import { useState, useEffect } from "react";
import { Save, Upload, Building, Phone, Mail, MapPin, FileText, Settings, Image, Folder, Shield, Users, Activity, Plus, Edit, Trash2, Store, RefreshCw, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useGetAllBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} from "@/services/branchesApi";
import { useGetCurrentCompanyQuery } from "@/services/companyApi";

interface Branch {
  id: number;
  arabicName: string;
  englishName: string;
  code: string;
  description?: string;
  working_hours_from: string;
  working_hours_to: string;
  isActive: boolean;
  phoneNumber: string;
  telephoneNumber?: string;
  email: string;
  website?: string;
  country: string;
  city: string;
  neighborhood?: string;
  street?: string;
  postalCode?: string;
  manager?: string;
  supervisor?: string;
  branchImageAttachment?: string;
  licenceAttachment?: string;
  anotherAttachments?: string;
  createdAt: string;
  updatedAt: string;
}

interface BranchFormData {
  arabicName: string;
  englishName: string;
  code: string;
  description: string;
  working_hours_from: string;
  working_hours_to: string;
  isActive: boolean;
  phoneNumber: string;
  telephoneNumber: string;
  email: string;
  website: string;
  country: string;
  city: string;
  neighborhood: string;
  street: string;
  postalCode: string;
  manager: string;
  supervisor: string;
  companyId: number;
}

export default function BranchSettings() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  
  // API hooks
  const { data: branchesData, isLoading, error, refetch } = useGetAllBranchesQuery();
  const { data: companyData } = useGetCurrentCompanyQuery();
  const [createBranch, { isLoading: isCreating }] = useCreateBranchMutation();
  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();
  const [deleteBranch, { isLoading: isDeleting }] = useDeleteBranchMutation();
  
  const [formData, setFormData] = useState<Partial<BranchFormData>>({
    arabicName: "",
    englishName: "",
    code: "",
    description: "",
    working_hours_from: "08:00",
    working_hours_to: "18:00",
    isActive: true,
    phoneNumber: "",
    telephoneNumber: "",
    email: "",
    website: "",
    country: "المملكة العربية المصرية",
    city: "",
    neighborhood: "",
    street: "",
    postalCode: "",
    manager: "",
    supervisor: "",
    companyId: companyData?.data?.company?.id || 1,
  });

  // Get branches from API response
  const branches: Branch[] = branchesData?.data || [];

  // Update companyId when company data changes
  useEffect(() => {
    if (companyData?.data?.company?.id) {
      setFormData(prev => ({
        ...prev,
        companyId: companyData.data.company.id
      }));
    }
  }, [companyData]);

  // Filtered branches
  const filteredBranches = branches.filter((branch) => {
    const matchesSearch = 
      branch.arabicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && branch.isActive) ||
      (statusFilter === "inactive" && !branch.isActive);
    
    const matchesCity = cityFilter === "all" || branch.city === cityFilter;
    
    return matchesSearch && matchesStatus && matchesCity;
  });

  // Get unique cities for filter, filtering out empty/null/undefined values
  const cities = [...new Set(branches.map(branch => branch.city).filter(city => city && city.trim() !== ''))];

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      if (editingBranch) {
        // تحديث فرع موجود
        await updateBranch({
          id: editingBranch.id,
          formData: formData as BranchFormData
        }).unwrap();

        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث بيانات الفرع بنجاح",
        });
      } else {
        // إضافة فرع جديد
        await createBranch(formData as BranchFormData).unwrap();
        
        toast({
          title: "تم الإضافة بنجاح",
          description: "تم إضافة الفرع الجديد بنجاح",
        });
      }
      
      setIsDialogOpen(false);
      setEditingBranch(null);
      resetForm();
      refetch();
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      arabicName: "",
      englishName: "",
      code: "",
      description: "",
      working_hours_from: "08:00",
      working_hours_to: "18:00",
      isActive: true,
      phoneNumber: "",
      telephoneNumber: "",
      email: "",
      website: "",
      country: "المملكة العربية المصرية",
      city: "",
      neighborhood: "",
      street: "",
      postalCode: "",
      manager: "",
      supervisor: "",
      companyId: companyData?.data?.company?.id || 1,
    });
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      arabicName: branch.arabicName,
      englishName: branch.englishName,
      code: branch.code,
      description: branch.description || "",
      working_hours_from: branch.working_hours_from,
      working_hours_to: branch.working_hours_to,
      isActive: branch.isActive,
      phoneNumber: branch.phoneNumber,
      telephoneNumber: branch.telephoneNumber || "",
      email: branch.email,
      website: branch.website || "",
      country: branch.country,
      city: branch.city,
      neighborhood: branch.neighborhood || "",
      street: branch.street || "",
      postalCode: branch.postalCode || "",
      manager: branch.manager || "",
      supervisor: branch.supervisor || "",
      companyId: companyData?.data?.company?.id || 1,
    });
    setActiveTab("details");
  };

  const handleDelete = async (branch: Branch) => {
    try {
      await deleteBranch(branch.id).unwrap();
      toast({
        title: "تم الحذف",
        description: "تم حذف الفرع بنجاح",
      });
      refetch();
    } catch (error) {
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف الفرع",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (branch: Branch) => {
    try {
      await updateBranch({
        id: branch.id,
        formData: { isActive: !branch.isActive }
      }).unwrap();
      
      toast({
        title: "تم التحديث",
        description: `تم ${!branch.isActive ? 'تفعيل' : 'إلغاء تفعيل'} الفرع بنجاح`,
      });
      refetch();
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث حالة الفرع",
        variant: "destructive",
      });
    }
  };

  const formatWorkingHours = (from: string, to: string) => {
    return `${from} - ${to}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">جاري تحميل بيانات الفروع...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">خطأ في تحميل البيانات</h2>
          <p className="text-muted-foreground mb-4">
            حدث خطأ أثناء تحميل بيانات الفروع. يرجى المحاولة مرة أخرى.
          </p>
          <Button onClick={() => refetch()} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary-blue bg-clip-text text-transparent">إدارة الفروع</h1>
          <p className="text-muted-foreground">إدارة فروع الشركة ومواقعها والمسؤولين عنها</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => refetch()}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            تحديث البيانات
          </Button>
          <Button 
            onClick={() => {
              setEditingBranch(null);
              resetForm();
              setActiveTab("details");
            }}
            className="gap-2 bg-gradient-to-r from-primary to-secondary-blue hover:from-primary/90 hover:to-secondary-blue/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            إضافة فرع جديد
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 p-1 bg-gradient-to-r from-card to-card/80 border shadow-lg">
          <TabsTrigger 
            value="list" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <Store className="w-4 h-4" />
            قائمة الفروع
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

        {/* قائمة الفروع */}
        <TabsContent value="list" className="space-y-6">
          {/* Filters and Search */}
          <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle>البحث والتصفية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="search">البحث</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="البحث في اسم الفرع أو الكود..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">المدينة</Label>
                  <Select value={cityFilter} onValueChange={setCityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المدن</SelectItem>
                      {cities.map((city) => {
                        const cityValue = city && city.trim() !== '' ? city : `city-${Math.random()}`;
                        return (
                          <SelectItem key={cityValue} value={cityValue}>
                            {city || 'بدون مدينة'}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-primary/5 border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">إجمالي الفروع</p>
                    <p className="text-2xl font-bold text-primary">{branches.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Store className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-success/5 border-l-4 border-l-success">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">الفروع النشطة</p>
                    <p className="text-2xl font-bold text-success">
                      {branches.filter(b => b.isActive).length}
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
                    <p className="text-sm font-medium text-muted-foreground">الفروع غير النشطة</p>
                    <p className="text-2xl font-bold text-secondary-blue">
                      {branches.filter(b => !b.isActive).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-secondary-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-secondary-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Branches Table */}
          <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Store className="w-4 h-4 text-primary" />
                </div>
                قائمة الفروع
              </CardTitle>
              <CardDescription>جميع فروع الشركة ومعلوماتها</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الفرع</TableHead>
                    <TableHead>الرمز</TableHead>
                    <TableHead>المدينة</TableHead>
                    <TableHead>المدير</TableHead>
                    <TableHead>ساعات العمل</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBranches.map((branch) => (
                    <TableRow key={branch.id} className="hover:bg-muted/50 transition-colors duration-200">
                      <TableCell className="font-medium">{branch.arabicName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{branch.code}</Badge>
                      </TableCell>
                      <TableCell>{branch.city}</TableCell>
                      <TableCell>{branch.manager || "غير محدد"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {formatWorkingHours(branch.working_hours_from, branch.working_hours_to)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={branch.isActive}
                            onCheckedChange={() => handleToggleStatus(branch)}
                            disabled={isUpdating}
                          />
                          <Badge variant={branch.isActive ? "default" : "secondary"}>
                            {branch.isActive ? "نشط" : "غير نشط"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(branch)}
                            className="hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedBranch(branch)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                <AlertDialogDescription>
                                  هل أنت متأكد من حذف الفرع "{branch.arabicName}"؟ 
                                  لا يمكن التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(branch)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredBranches.length === 0 && (
                <div className="text-center py-12">
                  <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">لا توجد فروع</h3>
                  <p className="text-muted-foreground">
                    لا توجد فروع تطابق معايير البحث المحددة.
                  </p>
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
                {editingBranch ? `تعديل بيانات: ${editingBranch.arabicName}` : "إضافة فرع جديد"}
              </CardTitle>
              <CardDescription>المعلومات الأساسية والهوية البصرية للفرع</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="arabicName" className="flex items-center gap-2">
                    <Building className="w-3 h-3 text-primary" />
                    اسم الفرع (عربي) *
                  </Label>
                  <Input
                    id="arabicName"
                    value={formData.arabicName}
                    onChange={(e) => handleInputChange("arabicName", e.target.value)}
                    placeholder="أدخل اسم الفرع بالعربية"
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="englishName" className="flex items-center gap-2">
                    <Building className="w-3 h-3 text-secondary-blue" />
                    اسم الفرع (إنجليزي)
                  </Label>
                  <Input
                    id="englishName"
                    value={formData.englishName}
                    onChange={(e) => handleInputChange("englishName", e.target.value)}
                    placeholder="أدخل اسم الفرع بالإنجليزية"
                    className="focus:ring-2 focus:ring-secondary-blue/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="code" className="flex items-center gap-2">
                    <FileText className="w-3 h-3 text-primary" />
                    رمز الفرع *
                  </Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                    placeholder="MAIN-DGL"
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="working_hours_from" className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-secondary-blue" />
                    ساعة البداية
                  </Label>
                  <Input
                    id="working_hours_from"
                    type="time"
                    value={formData.working_hours_from}
                    onChange={(e) => handleInputChange("working_hours_from", e.target.value)}
                    className="focus:ring-2 focus:ring-secondary-blue/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="working_hours_to" className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-success" />
                    ساعة النهاية
                  </Label>
                  <Input
                    id="working_hours_to"
                    type="time"
                    value={formData.working_hours_to}
                    onChange={(e) => handleInputChange("working_hours_to", e.target.value)}
                    className="focus:ring-2 focus:ring-success/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="isActive" className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-warning" />
                    حالة الفرع
                  </Label>
                  <Select
                    value={formData.isActive ? "true" : "false"}
                    onValueChange={(value) => handleInputChange("isActive", value === "true")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">نشط</SelectItem>
                      <SelectItem value="false">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="w-3 h-3 text-primary" />
                  وصف مختصر عن الفرع
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="وصف مختصر عن الفرع وموقعه"
                  rows={3}
                  className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={isUpdating || isCreating}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary-blue hover:from-primary/90 hover:to-secondary-blue/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isUpdating ? "جاري التحديث..." : isCreating ? "جاري الإضافة..." : editingBranch ? "تحديث البيانات" : "إضافة فرع جديد"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("list")}
                  className="hover:bg-muted/50 transition-colors duration-200"
                >
                  إلغاء
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
              <CardDescription>طرق التواصل مع الفرع</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-primary" />
                    الهاتف *
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="+966112345678"
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="telephoneNumber" className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-secondary-blue" />
                    الهاتف الثابت
                  </Label>
                  <Input
                    id="telephoneNumber"
                    value={formData.telephoneNumber}
                    onChange={(e) => handleInputChange("telephoneNumber", e.target.value)}
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
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="main@dagliwa.com"
                  className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              <div>
                <Label htmlFor="website" className="flex items-center gap-2">
                  <FileText className="w-3 h-3 text-secondary-blue" />
                  الموقع الإلكتروني
                </Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="www.dagliwa.com"
                  className="focus:ring-2 focus:ring-secondary-blue/20 transition-all duration-200"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={isUpdating || isCreating}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary-blue hover:from-primary/90 hover:to-secondary-blue/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingBranch ? "حفظ معلومات الاتصال" : "إضافة فرع جديد"}
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
                عنوان الفرع
              </CardTitle>
              <CardDescription>موقع الفرع التفصيلي</CardDescription>
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
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
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
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="الرياض"
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="neighborhood" className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-secondary-blue" />
                    الحي
                  </Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => handleInputChange("neighborhood", e.target.value)}
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
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
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
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  placeholder="شارع الملك فهد"
                  className="focus:ring-2 focus:ring-success/20 transition-all duration-200"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={isUpdating || isCreating}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary-blue hover:from-primary/90 hover:to-secondary-blue/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingBranch ? "حفظ العنوان" : "إضافة فرع جديد"}
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
                إدارة الفرع والمسؤولين
              </CardTitle>
              <CardDescription>تحديد المسؤولين عن إدارة الفرع</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="manager" className="flex items-center gap-2">
                    <Users className="w-3 h-3 text-primary" />
                    مدير الفرع *
                  </Label>
                  <Input
                    id="manager"
                    value={formData.manager}
                    onChange={(e) => handleInputChange("manager", e.target.value)}
                    placeholder="أحمد محمد العتيبي"
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
                    value={formData.supervisor}
                    onChange={(e) => handleInputChange("supervisor", e.target.value)}
                    placeholder="سعد أحمد الشهري"
                    className="focus:ring-2 focus:ring-secondary-blue/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={isUpdating || isCreating}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary-blue hover:from-primary/90 hover:to-secondary-blue/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingBranch ? "حفظ بيانات المسؤولين" : "إضافة فرع جديد"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* المرفقات */}
        <TabsContent value="attachments" className="space-y-6">
          {/* مرفقات الهوية */}
          <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-primary/5 border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                مرفقات الفرع
              </CardTitle>
              <CardDescription>الوثائق والصور الخاصة بالفرع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* صور الفرع */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Image className="w-4 h-4 text-primary" />
                    صور الفرع
                  </Label>
                  <div className="border-2 border-dashed border-primary/25 rounded-lg p-4 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
                    <Image className="w-8 h-8 mx-auto text-primary/60 mb-2 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-200">رفع صور الفرع</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG، PNG حتى 10MB</p>
                    <Button variant="outline" size="sm" className="mt-3 group-hover:border-primary group-hover:text-primary transition-all duration-200">
                      <Upload className="w-3 h-3 mr-1" />
                      اختيار صور
                    </Button>
                  </div>
                </div>

                {/* ترخيص الفرع */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-secondary-blue" />
                    ترخيص الفرع
                  </Label>
                  <div className="border-2 border-dashed border-secondary-blue/25 rounded-lg p-4 text-center hover:border-secondary-blue/50 hover:bg-secondary-blue/5 transition-all duration-300 cursor-pointer group">
                    <FileText className="w-8 h-8 mx-auto text-secondary-blue/60 mb-2 group-hover:text-secondary-blue group-hover:scale-110 transition-all duration-300" />
                    <p className="text-sm text-muted-foreground group-hover:text-secondary-blue transition-colors duration-200">رفع ترخيص الفرع</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF، JPG حتى 5MB</p>
                    <Button variant="outline" size="sm" className="mt-3 group-hover:border-secondary-blue group-hover:text-secondary-blue transition-all duration-200">
                      <Upload className="w-3 h-3 mr-1" />
                      رفع ترخيص
                    </Button>
                  </div>
                </div>

                {/* مرفقات أخرى */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Folder className="w-4 h-4 text-success" />
                    مرفقات أخرى
                  </Label>
                  <div className="border-2 border-dashed border-success/25 rounded-lg p-4 text-center hover:border-success/50 hover:bg-success/5 transition-all duration-300 cursor-pointer group">
                    <Folder className="w-8 h-8 mx-auto text-success/60 mb-2 group-hover:text-success group-hover:scale-110 transition-all duration-300" />
                    <p className="text-sm text-muted-foreground group-hover:text-success transition-colors duration-200">ملفات متنوعة</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF، DOC، XLS حتى 15MB</p>
                    <Button variant="outline" size="sm" className="mt-3 group-hover:border-success group-hover:text-success transition-all duration-200">
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