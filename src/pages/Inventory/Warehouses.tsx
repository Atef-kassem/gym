import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Save, Building, Phone, MapPin, Users, Activity, Plus, Edit, Package, Search, MoreVertical, Mail, FileText, Shield, Upload, Folder, Eye, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

// API configuration
  const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || "https://metagym.metacodecx.com";

// Types matching backend schema
interface Warehouse {
  warehouse_id: number;
  warehouse_code: string;
  name_ar: string;
  name_en: string;
  type: "main" | "sub";
  storage_capacity: number;
  branch_id: number;
  current_stock: number;
  description?: string;
  status: "active" | "inactive";
  phone?: string;
  mobile?: string;
  email?: string;
  country: string;
  city: string;
  district?: string;
  postal_code?: string;
  street?: string;
  manager_name?: string;
  assistant_manager_name?: string;
  created_at: string;
  updated_at: string;
  branch?: {
    id: number;
    arabicName: string;
    englishName: string;
  };
}

interface Branch {
  id: number;
  arabicName: string;
  englishName: string;
}

export default function Warehouses() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("list");
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Data states
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  // Form state
  const [newWarehouse, setNewWarehouse] = useState<Partial<Warehouse>>({
    warehouse_code: "",
    name_ar: "",
    name_en: "",
    type: "main",
    storage_capacity: 100,
    branch_id: 0, // سيتم تحديثه عند جلب الفروع
    current_stock: 0,
    description: "",
    status: "active",
    phone: "",
    mobile: "",
    email: "",
    country: "المملكة العربية المصرية",
    city: "",
    district: "",
    postal_code: "",
    street: "",
    manager_name: "",
    assistant_manager_name: ""
  });

  // التعامل مع معاملات الرابط لفتح التبويب المطلوب
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['list', 'details', 'contact', 'address', 'management', 'attachments'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Fetch data on component mount
  useEffect(() => {
    console.log('Component mounted, fetching data...');
    fetchWarehouses();
    fetchBranches();
  }, []);
  
  // Update branch_id when branches are loaded
  useEffect(() => {
    if (branches.length > 0 && newWarehouse.branch_id === 0) {
      console.log('Setting default branch_id to:', branches[0].id);
      setNewWarehouse(prev => ({ ...prev, branch_id: branches[0].id }));
    }
  }, [branches, newWarehouse.branch_id]);

  // Fetch warehouses from backend
  const fetchWarehouses = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/v1/warehouses`);
      if (!res.ok) throw new Error("فشل جلب المستودعات");
      const json = await res.json();
      const list: Warehouse[] = json?.data?.warehouses || [];
      setWarehouses(Array.isArray(list) ? list : []);
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message || "تعذر تحميل المستودعات", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch branches from backend
  const fetchBranches = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/branches`);
      if (!res.ok) throw new Error("فشل جلب الفروع");
      const json = await res.json();
      
      // البيانات تأتي في data field
      const list: Branch[] = json?.data || [];
      setBranches(Array.isArray(list) ? list : []);
      
      // للتأكد من البيانات
      console.log('Branches fetched:', list);
    } catch (e: any) {
      console.error("Failed to fetch branches:", e);
      toast({ title: "خطأ", description: "فشل جلب الفروع", variant: "destructive" });
    }
  };

  // Create new warehouse
  const createWarehouse = async () => {
    try {
      console.log('Creating warehouse with data:', newWarehouse); // للتأكد من البيانات
      
      if (!newWarehouse.name_ar || !newWarehouse.name_en || !newWarehouse.warehouse_code) {
        toast({ title: "خطأ", description: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
        return;
      }
      
      if (!newWarehouse.branch_id) {
        toast({ title: "خطأ", description: "يرجى اختيار الفرع", variant: "destructive" });
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/warehouses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWarehouse),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.message || "فشل إنشاء المستودع");
      }

      toast({ title: "تم إنشاء المستودع بنجاح" });
      await fetchWarehouses();
      
      // Reset form
      setNewWarehouse({
        warehouse_code: "",
        name_ar: "",
        name_en: "",
        type: "main",
        storage_capacity: 100,
        branch_id: 1,
        current_stock: 0,
      description: "",
        status: "active",
      phone: "",
      mobile: "",
      email: "",
      country: "المملكة العربية المصرية",
      city: "",
      district: "",
        postal_code: "",
      street: "",
        manager_name: "",
        assistant_manager_name: ""
      });
    } catch (e: any) {
      toast({ title: "فشل إنشاء المستودع", description: e.message, variant: "destructive" });
    }
  };

  // Update warehouse
  const updateWarehouse = async (warehouse: Warehouse) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/warehouses/${warehouse.warehouse_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(warehouse),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.message || "فشل تحديث المستودع");
      }

      toast({ title: "تم تحديث المستودع بنجاح" });
      await fetchWarehouses();
      setEditingWarehouse(null);
      
      // Reset form after successful update
      setNewWarehouse({
        warehouse_code: "",
        name_ar: "",
        name_en: "",
        type: "main",
        storage_capacity: 100,
        branch_id: branches.length > 0 ? branches[0].id : 0,
        current_stock: 0,
        description: "",
        status: "active",
        phone: "",
        mobile: "",
        email: "",
        country: "المملكة العربية المصرية",
        city: "",
        district: "",
        postal_code: "",
        street: "",
        manager_name: "",
        assistant_manager_name: ""
      });
      
      setActiveTab("list");
    } catch (e: any) {
      toast({ title: "فشل تحديث المستودع", description: e.message, variant: "destructive" });
    }
  };

  // Delete warehouse
  const deleteWarehouse = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستودع؟")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/warehouses/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.message || "فشل حذف المستودع");
      }

      toast({ title: "تم حذف المستودع بنجاح" });
      await fetchWarehouses();
    } catch (e: any) {
      toast({ title: "فشل حذف المستودع", description: e.message, variant: "destructive" });
    }
  };

  // Filter warehouses based on search and status
  const filteredWarehouses = warehouses.filter((warehouse) => {
    const matchesSearch = 
      warehouse.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.warehouse_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || warehouse.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Helper functions
  const getTypeLabel = (type: string) => {
    return type === "main" ? "رئيسي" : "فرعي";
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">نشط</Badge>
    ) : (
      <Badge variant="destructive">غير نشط</Badge>
    );
  };

  const getBranchName = (branchId: number) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      return branch.arabicName || branch.englishName || `فرع #${branch.id}`;
    }
    return `فرع #${branchId}`;
  };

  // Handle edit button click
  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setNewWarehouse({
      warehouse_code: warehouse.warehouse_code,
      name_ar: warehouse.name_ar,
      name_en: warehouse.name_en,
      type: warehouse.type,
      storage_capacity: warehouse.storage_capacity,
      branch_id: warehouse.branch_id,
      current_stock: warehouse.current_stock,
      description: warehouse.description || "",
      status: warehouse.status,
      phone: warehouse.phone || "",
      mobile: warehouse.mobile || "",
      email: warehouse.email || "",
      country: warehouse.country,
      city: warehouse.city,
      district: warehouse.district || "",
      postal_code: warehouse.postal_code || "",
      street: warehouse.street || "",
      manager_name: warehouse.manager_name || "",
      assistant_manager_name: warehouse.assistant_manager_name || ""
    });
    setActiveTab("details");
  };

  // Handle save (create or update)
  const handleSave = async () => {
    if (editingWarehouse) {
      // Update existing warehouse
      const updatedWarehouse = {
        ...editingWarehouse,
        ...newWarehouse
      };
      await updateWarehouse(updatedWarehouse);
    } else {
      // Create new warehouse
      await createWarehouse();
    }
  };

  // Reset form and editing state
  const handleCancel = () => {
    setEditingWarehouse(null);
    setNewWarehouse({
      warehouse_code: "",
      name_ar: "",
      name_en: "",
      type: "main",
      storage_capacity: 100,
      branch_id: branches.length > 0 ? branches[0].id : 0,
      current_stock: 0,
      description: "",
      status: "active",
      phone: "",
      mobile: "",
      email: "",
      country: "المملكة العربية المصرية",
      city: "",
      district: "",
      postal_code: "",
      street: "",
      manager_name: "",
      assistant_manager_name: ""
    });
    setActiveTab("list");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary-blue bg-clip-text text-transparent">إدارة المستودعات</h1>
          <p className="text-muted-foreground">إدارة وتنظيم المستودعات والمخازن والمسؤولين عنها</p>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <div className="flex items-center gap-2 text-blue-600">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">جاري التحميل...</span>
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              fetchWarehouses();
              fetchBranches();
            }}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث البيانات
          </Button>
        <Button 
          onClick={() => {
            if (editingWarehouse) {
              handleCancel();
            } else {
              setEditingWarehouse(null);
              setNewWarehouse({
                warehouse_code: "",
                name_ar: "",
                name_en: "",
                type: "main",
                storage_capacity: 100,
                branch_id: branches.length > 0 ? branches[0].id : 0,
                current_stock: 0,
                description: "",
                status: "active",
                phone: "",
                mobile: "",
                email: "",
                country: "المملكة العربية المصرية",
                city: "",
                district: "",
                postal_code: "",
                street: "",
                manager_name: "",
                assistant_manager_name: ""
              });
              setActiveTab("details");
            }
          }}
          className={`gap-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
            editingWarehouse 
              ? "bg-gradient-to-r from-destructive to-red-600 hover:from-destructive/90 hover:to-red-600/90 text-white" 
              : "bg-gradient-to-r from-primary to-secondary-blue hover:from-primary/90 hover:to-secondary-blue/90 text-white"
          }`}
        >
          {editingWarehouse ? (
            <>
              <RefreshCw className="w-4 h-4" />
              إلغاء التعديل
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              إضافة مستودع جديد
            </>
          )}
        </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 p-1 bg-gradient-to-r from-card to-card/80 border shadow-lg">
          <TabsTrigger 
            value="list" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <Package className="w-4 h-4" />
            قائمة المستودعات
          </TabsTrigger>
          <TabsTrigger 
            value="details" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <Building className="w-4 h-4" />
            البيانات الأساسية
          </TabsTrigger>
          <TabsTrigger 
            value="contact" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <Phone className="w-4 h-4" />
            معلومات الاتصال
          </TabsTrigger>
          <TabsTrigger 
            value="address" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <MapPin className="w-4 h-4" />
            العنوان
          </TabsTrigger>
          <TabsTrigger 
            value="management" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <Users className="w-4 h-4" />
            المسؤولين
          </TabsTrigger>
          <TabsTrigger 
            value="attachments" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <Folder className="w-4 h-4" />
            المرفقات
          </TabsTrigger>
        </TabsList>

        {/* قائمة المستودعات */}
        <TabsContent value="list" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-primary/5 border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">إجمالي المستودعات</p>
                    <p className="text-2xl font-bold text-primary">{warehouses.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-success/5 border-l-4 border-l-success">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">المستودعات النشطة</p>
                    <p className="text-2xl font-bold text-success">
                      {warehouses.filter(w => w.status === "active").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Activity className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-secondary-blue/5 border-l-4 border-l-secondary-blue">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">إجمالي الأصناف</p>
                    <p className="text-2xl font-bold text-secondary-blue">
                      {warehouses.reduce((total, w) => total + w.current_stock, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-secondary-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-6 h-6 text-secondary-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-warning/5 border-l-4 border-l-warning">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">المسؤولين</p>
                    <p className="text-2xl font-bold text-warning">
                      {new Set(warehouses.filter(w => w.manager_name !== undefined).map(w => w.manager_name)).size}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* البحث والفلترة */}
          <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="البحث في المستودعات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="inactive">مغلق</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWarehouses.map((warehouse) => (
                  <Card key={warehouse.warehouse_id} className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/80 border">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{warehouse.name_ar}</CardTitle>
                          <CardDescription className="mt-1">{warehouse.city} - {warehouse.district}</CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(warehouse)}>
                              <Edit className="w-4 h-4 ml-2" />
                              تعديل
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 ml-2" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package className="w-4 h-4 ml-2" />
                              الأصناف
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteWarehouse(warehouse.warehouse_id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Package className="w-4 h-4 ml-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          {getTypeLabel(warehouse.type)}
                        </Badge>
                        {getStatusBadge(warehouse.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">الفرع:</span>
                        <span className="text-sm font-medium">
                          {warehouse.branch_id ? getBranchName(warehouse.branch_id) : "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">المخزون الحالي:</span>
                        <span className="text-sm font-bold text-primary">{warehouse.current_stock}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">السعة:</span>
                        <span className="text-sm font-medium">{warehouse.storage_capacity}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">المسؤول:</span>
                        <span className="text-sm font-medium">{warehouse.manager_name}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                          onClick={() => handleEdit(warehouse)}
                        >
                          <Edit className="w-4 h-4 ml-2" />
                          تعديل
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 hover:bg-secondary-blue/10 hover:text-secondary-blue transition-colors duration-200"
                        >
                          <Package className="w-4 h-4 ml-2" />
                          الأصناف
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                          onClick={() => deleteWarehouse(warehouse.warehouse_id)}
                        >
                          <Package className="w-4 h-4 ml-2" />
                          حذف
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredWarehouses.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground">لا توجد مستودعات</h3>
                  <p className="text-sm text-muted-foreground mt-2">لم يتم العثور على مستودعات تطابق البحث</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* البيانات الأساسية */}
        <TabsContent value="details" className="space-y-6">
          <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-primary/5 border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Building className="w-4 h-4 text-primary" />
                </div>
                {editingWarehouse ? `تعديل بيانات: ${editingWarehouse.name_ar}` : "إضافة مستودع جديد"}
              </CardTitle>
              <CardDescription>المعلومات الأساسية للمستودع</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="nameAr" className="flex items-center gap-2">
                    <Building className="w-3 h-3 text-primary" />
                    اسم المستودع (عربي) *
                  </Label>
                  <Input
                    id="nameAr"
                    value={newWarehouse.name_ar}
                    onChange={(e) => setNewWarehouse(prev => ({ ...prev, name_ar: e.target.value }))}
                    placeholder="أدخل اسم المستودع بالعربية"
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="nameEn" className="flex items-center gap-2">
                    <Building className="w-3 h-3 text-secondary-blue" />
                    اسم المستودع (إنجليزي)
                  </Label>
                  <Input
                    id="nameEn"
                    value={newWarehouse.name_en}
                    onChange={(e) => setNewWarehouse(prev => ({ ...prev, name_en: e.target.value }))}
                    placeholder="أدخل اسم المستودع بالإنجليزية"
                    className="focus:ring-2 focus:ring-secondary-blue/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="code" className="flex items-center gap-2">
                    <FileText className="w-3 h-3 text-primary" />
                    رمز المستودع *
                  </Label>
                  <Input
                    id="code"
                    value={newWarehouse.warehouse_code}
                    onChange={(e) => setNewWarehouse(prev => ({ ...prev, warehouse_code: e.target.value.toUpperCase() }))}
                    placeholder="MAIN-WH-DGL"
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="flex items-center gap-2">
                    <Package className="w-3 h-3 text-secondary-blue" />
                    نوع المستودع
                  </Label>
                  <Select value={newWarehouse.type} onValueChange={(value) => setNewWarehouse(prev => ({ ...prev, type: value as "main" | "sub" }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع المستودع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">رئيسي</SelectItem>
                      <SelectItem value="sub">فرعي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="capacity" className="flex items-center gap-2">
                    <Package className="w-3 h-3 text-success" />
                    السعة التخزينية
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={newWarehouse.storage_capacity}
                    onChange={(e) => setNewWarehouse(prev => ({ ...prev, storage_capacity: parseInt(e.target.value) }))}
                    placeholder="1000"
                    className="focus:ring-2 focus:ring-success/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="branch" className="flex items-center gap-2">
                    <Building className="w-3 h-3 text-warning" />
                    الفرع التابع له
                  </Label>
                  <Select
                    value={String(newWarehouse.branch_id)}
                    onValueChange={(value) => {
                      console.log('Selected branch:', value); // للتأكد من الاختيار
                      setNewWarehouse(prev => ({ ...prev, branch_id: parseInt(value) }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={branches.length > 0 ? "اختر الفرع" : "جاري تحميل الفروع..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.length > 0 ? (
                        branches.map(branch => (
                          <SelectItem key={branch.id} value={String(branch.id)}>
                            {branch.arabicName || branch.englishName || `فرع #${branch.id}`}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-branches-available" disabled>لا توجد فروع متاحة</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currentStock" className="flex items-center gap-2">
                    <Package className="w-3 h-3 text-primary" />
                    المخزون الحالي
                  </Label>
                  <Input
                    id="currentStock"
                    type="number"
                    value={newWarehouse.current_stock}
                    onChange={(e) => setNewWarehouse(prev => ({ ...prev, current_stock: parseInt(e.target.value) }))}
                    placeholder="750"
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="w-3 h-3 text-primary" />
                  وصف مختصر عن المستودع
                </Label>
                <Textarea
                  id="description"
                  value={newWarehouse.description}
                  onChange={(e) => setNewWarehouse(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف مختصر عن المستودع ونوع المواد المخزنة"
                  rows={3}
                  className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newWarehouse.status === "active"}
                  onCheckedChange={(checked) => 
                    setNewWarehouse(prev => ({ ...prev, status: checked ? "active" : "inactive" }))
                  }
                />
                <Label>المستودع نشط</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSave} 
                  className="flex-1 bg-gradient-to-r from-primary to-secondary-blue hover:from-primary/90 hover:to-secondary-blue/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingWarehouse ? "تحديث البيانات" : "حفظ المستودع"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="hover:bg-muted/50 transition-colors duration-200"
                >
                  {editingWarehouse ? "إلغاء التعديل" : "إلغاء"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* معلومات الاتصال */}
        <TabsContent value="contact" className="space-y-6">
          <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-secondary-blue/5 border-l-4 border-l-secondary-blue">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-4 h-4 text-secondary-blue" />
                </div>
                معلومات الاتصال
              </CardTitle>
              <CardDescription>طرق التواصل مع المستودع</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-primary" />
                    الهاتف *
                  </Label>
                  <Input
                    id="phone"
                    value={newWarehouse.phone}
                    onChange={(e) => setNewWarehouse(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+966112345678"
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="mobile" className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-secondary-blue" />
                    الجوال
                  </Label>
                  <Input
                    id="mobile"
                    value={newWarehouse.mobile}
                    onChange={(e) => setNewWarehouse(prev => ({ ...prev, mobile: e.target.value }))}
                    placeholder="+966501234567"
                    className="focus:ring-2 focus:ring-secondary-blue/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-primary" />
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newWarehouse.email}
                  onChange={(e) => setNewWarehouse(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="warehouse@dagliwa.com"
                  className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSave} 
                  className="flex-1 bg-gradient-to-r from-primary to-secondary-blue hover:from-primary/90 hover:to-secondary-blue/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingWarehouse ? "تحديث معلومات الاتصال" : "حفظ معلومات الاتصال"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="hover:bg-muted/50 transition-colors duration-200"
                >
                  {editingWarehouse ? "إلغاء التعديل" : "إلغاء"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* العنوان */}
        <TabsContent value="address" className="space-y-6">
          <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-success/5 border-l-4 border-l-success">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-4 h-4 text-success" />
                </div>
                عنوان المستودع
              </CardTitle>
              <CardDescription>موقع المستودع التفصيلي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <Label htmlFor="country" className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-success" />
                    الدولة *
                  </Label>
                  <Input
                    id="country"
                    value={newWarehouse.country}
                    onChange={(e) => setNewWarehouse(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="المملكة العربية المصرية"
                    className="focus:ring-2 focus:ring-success/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="flex items-center gap-2">
                    <Building className="w-3 h-3 text-primary" />
                    المدينة *
                  </Label>
                  <Input
                    id="city"
                    value={newWarehouse.city}
                    onChange={(e) => setNewWarehouse(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="الرياض"
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="district" className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-secondary-blue" />
                    الحي/المنطقة
                  </Label>
                  <Input
                    id="district"
                    value={newWarehouse.district}
                    onChange={(e) => setNewWarehouse(prev => ({ ...prev, district: e.target.value }))}
                    placeholder="حي الملقا"
                    className="focus:ring-2 focus:ring-secondary-blue/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode" className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-warning" />
                    الرمز البريدي
                  </Label>
                  <Input
                    id="postalCode"
                    value={newWarehouse.postal_code}
                    onChange={(e) => setNewWarehouse(prev => ({ ...prev, postal_code: e.target.value }))}
                    placeholder="12345"
                    className="focus:ring-2 focus:ring-warning/20 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="street" className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-success" />
                  الشارع *
                </Label>
                <Input
                  id="street"
                  value={newWarehouse.street}
                  onChange={(e) => setNewWarehouse(prev => ({ ...prev, street: e.target.value }))}
                  placeholder="شارع الملك فهد"
                  className="focus:ring-2 focus:ring-success/20 transition-all duration-200"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSave} 
                  className="flex-1 bg-gradient-to-r from-primary to-secondary-blue hover:from-primary/90 hover:to-secondary-blue/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingWarehouse ? "تحديث العنوان" : "حفظ العنوان"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="hover:bg-muted/50 transition-colors duration-200"
                >
                  {editingWarehouse ? "إلغاء التعديل" : "إلغاء"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* المسؤولين */}
        <TabsContent value="management" className="space-y-6">
          <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-warning/5 border-l-4 border-l-warning">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-4 h-4 text-warning" />
                </div>
                إدارة المستودع والمسؤولين
              </CardTitle>
              <CardDescription>تحديد المسؤولين عن إدارة المستودع</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="manager" className="flex items-center gap-2">
                    <Users className="w-3 h-3 text-primary" />
                    مدير المستودع *
                  </Label>
                  <Input
                    id="manager"
                    value={newWarehouse.manager_name}
                    onChange={(e) => setNewWarehouse(prev => ({ ...prev, manager_name: e.target.value }))}
                    placeholder="عبدالله سعد المطيري"
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="supervisor" className="flex items-center gap-2">
                    <Users className="w-3 h-3 text-secondary-blue" />
                    المشرف المساعد
                  </Label>
                  <Input
                    id="supervisor"
                    value={newWarehouse.assistant_manager_name}
                    onChange={(e) => setNewWarehouse(prev => ({ ...prev, assistant_manager_name: e.target.value }))}
                    placeholder="محمد أحمد الشهري"
                    className="focus:ring-2 focus:ring-secondary-blue/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSave} 
                  className="flex-1 bg-gradient-to-r from-primary to-secondary-blue hover:from-primary/90 hover:to-secondary-blue/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  حفظ بيانات المسؤولين
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="hover:bg-muted/50 transition-colors duration-200"
                >
                  {editingWarehouse ? "إلغاء التعديل" : "إلغاء"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* المرفقات */}
        <TabsContent value="attachments" className="space-y-6">
          <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-primary/5 border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                مرفقات المستودع
              </CardTitle>
              <CardDescription>الوثائق والصور الخاصة بالمستودع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* صور المستودع */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-primary" />
                    صور المستودع
                  </Label>
                  <div className="border-2 border-dashed border-primary/25 rounded-lg p-4 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
                    <FileText className="w-8 h-8 mx-auto text-primary/60 mb-2 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-200">رفع صور المستودع</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG، PNG حتى 10MB</p>
                    <Button variant="outline" size="sm" className="mt-3 group-hover:border-primary group-hover:text-primary transition-all duration-200">
                      <Upload className="w-3 h-3 mr-1" />
                      اختيار صور
                    </Button>
                  </div>
                </div>

                {/* رخصة التشغيل */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-secondary-blue" />
                    رخصة التشغيل
                  </Label>
                  <div className="border-2 border-dashed border-secondary-blue/25 rounded-lg p-4 text-center hover:border-secondary-blue/50 hover:bg-secondary-blue/5 transition-all duration-300 cursor-pointer group">
                    <FileText className="w-8 h-8 mx-auto text-secondary-blue/60 mb-2 group-hover:text-secondary-blue group-hover:scale-110 transition-all duration-300" />
                    <p className="text-sm text-muted-foreground group-hover:text-secondary-blue transition-colors duration-200">رفع رخصة التشغيل</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF، JPG حتى 5MB</p>
                    <Button variant="outline" size="sm" className="mt-3 group-hover:border-secondary-blue group-hover:text-secondary-blue transition-all duration-200">
                      <Upload className="w-3 h-3 mr-1" />
                      رفع ترخيص
                    </Button>
                  </div>
                </div>

                {/* شهادات السلامة */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-success" />
                    شهادات السلامة
                  </Label>
                  <div className="border-2 border-dashed border-success/25 rounded-lg p-4 text-center hover:border-success/50 hover:bg-success/5 transition-all duration-300 cursor-pointer group">
                    <Shield className="w-8 h-8 mx-auto text-success/60 mb-2 group-hover:text-success group-hover:scale-110 transition-all duration-300" />
                    <p className="text-sm text-muted-foreground group-hover:text-success transition-colors duration-200">شهادات السلامة والأمان</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF، JPG حتى 5MB</p>
                    <Button variant="outline" size="sm" className="mt-3 group-hover:border-success group-hover:text-success transition-all duration-200">
                      <Upload className="w-3 h-3 mr-1" />
                      رفع شهادات
                    </Button>
                  </div>
                </div>

                {/* مخططات المستودع */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-warning" />
                    مخططات المستودع
                  </Label>
                  <div className="border-2 border-dashed border-warning/25 rounded-lg p-4 text-center hover:border-warning/50 hover:bg-warning/5 transition-all duration-300 cursor-pointer group">
                    <FileText className="w-8 h-8 mx-auto text-warning/60 mb-2 group-hover:text-warning group-hover:scale-110 transition-all duration-300" />
                    <p className="text-sm text-muted-foreground group-hover:text-warning transition-colors duration-200">مخططات وتصاميم المستودع</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF، DWG، JPG حتى 10MB</p>
                    <Button variant="outline" size="sm" className="mt-3 group-hover:border-warning group-hover:text-warning transition-all duration-200">
                      <Upload className="w-3 h-3 mr-1" />
                      رفع مخططات
                    </Button>
                  </div>
                </div>

                {/* تقارير الجرد */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-destructive" />
                    تقارير الجرد
                  </Label>
                  <div className="border-2 border-dashed border-destructive/25 rounded-lg p-4 text-center hover:border-destructive/50 hover:bg-destructive/5 transition-all duration-300 cursor-pointer group">
                    <FileText className="w-8 h-8 mx-auto text-destructive/60 mb-2 group-hover:text-destructive group-hover:scale-110 transition-all duration-300" />
                    <p className="text-sm text-muted-foreground group-hover:text-destructive transition-colors duration-200">تقارير الجرد والمخزون</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF، XLS حتى 15MB</p>
                    <Button variant="outline" size="sm" className="mt-3 group-hover:border-destructive group-hover:text-destructive transition-all duration-200">
                      <Upload className="w-3 h-3 mr-1" />
                      رفع تقارير
                    </Button>
                  </div>
                </div>

                {/* مرفقات أخرى */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Folder className="w-4 h-4 text-muted-foreground" />
                    مرفقات أخرى
                  </Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 hover:bg-muted/5 transition-all duration-300 cursor-pointer group">
                    <Folder className="w-8 h-8 mx-auto text-muted-foreground/60 mb-2 group-hover:text-muted-foreground group-hover:scale-110 transition-all duration-300" />
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">ملفات متنوعة</p>
                    <p className="text-xs text-muted-foreground mt-1">جميع أنواع الملفات حتى 20MB</p>
                    <Button variant="outline" size="sm" className="mt-3 group-hover:border-muted-foreground group-hover:text-muted-foreground transition-all duration-200">
                      <Upload className="w-3 h-3 mr-1" />
                      رفع ملفات
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}