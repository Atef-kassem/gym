import { useState, useEffect } from "react";
import {
  Building2,
  TrendingUp,
  Users,
  MapPin,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  DollarSign,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  Activity,
  Phone,
  Mail,
  Globe,
  Calendar,
  Target,
  RefreshCw,
  Search,
  Filter,
  Download,
  Upload,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} from "@/services/branchesApi";

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
}

export function BranchManagement() {
  const { toast } = useToast();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");

  // API hooks
  const { data: branchesData, isLoading, error, refetch } = useGetAllBranchesQuery();
  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();
  const [deleteBranch, { isLoading: isDeleting }] = useDeleteBranchMutation();

  // Form state
  const [formData, setFormData] = useState<BranchFormData>({
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
  });

  // Get branches from API response
  const branches: Branch[] = branchesData?.data || [];

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

  // Get unique cities for filter
  const cities = [...new Set(branches.map(branch => branch.city))];

  // Calculate statistics
  const totalBranches = branches.length;
  const activeBranches = branches.filter(b => b.isActive).length;
  const inactiveBranches = totalBranches - activeBranches;
  const totalEmployees = branches.reduce((sum, branch) => sum + (branch.manager ? 1 : 0), 0);

  const handleEditBranch = (branch: Branch) => {
    setSelectedBranch(branch);
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
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateBranch = async () => {
    if (!selectedBranch) return;

    try {
      await updateBranch({
        id: selectedBranch.id,
        formData
      }).unwrap();

      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث بيانات الفرع بنجاح",
      });

      setIsEditDialogOpen(false);
      setSelectedBranch(null);
      refetch();
    } catch (error) {
    toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث بيانات الفرع",
      variant: "destructive",
    });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedBranch) return;

    try {
      await deleteBranch(selectedBranch.id).unwrap();

      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف الفرع بنجاح",
      });

      setIsDeleteDialogOpen(false);
      setSelectedBranch(null);
      refetch();
    } catch (error) {
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف الفرع",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof BranchFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-500 hover:bg-green-600">نشط</Badge>
    ) : (
      <Badge variant="destructive">غير نشط</Badge>
    );
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
            <AlertTriangle className="w-8 h-8 text-destructive" />
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
      <div className="flex items-center justify-between p-6 rounded-xl border shadow-lg bg-card">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            إدارة الفروع
          </h1>
          <p className="text-muted-foreground">
            إدارة شاملة لجميع فروع الشركة ومراقبة أدائها
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="hover:shadow-md transition-all duration-200">
            <Plus className="h-4 w-4 mr-2" />
            إضافة فرع جديد
          </Button>
          <Button
            variant="outline"
            className="hover:shadow-md transition-all duration-200"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            تحديث البيانات
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="branches">قائمة الفروع</TabsTrigger>
          <TabsTrigger value="comparison">مقارنة الأداء</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي الفروع
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBranches}</div>
                <p className="text-xs text-muted-foreground">
                  فرع في جميع المناطق
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  الفروع النشطة
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{activeBranches}</div>
                <p className="text-xs text-muted-foreground">
                  فرع يعمل حالياً
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  الفروع غير النشطة
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{inactiveBranches}</div>
                <p className="text-xs text-muted-foreground">
                  فرع متوقف مؤقتاً
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي الموظفين
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{totalEmployees}</div>
                <p className="text-xs text-muted-foreground">
                  موظف في جميع الفروع
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
                <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                النشاط الأخير
                    </CardTitle>
                </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {branches.slice(0, 5).map((branch) => (
                  <div key={branch.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="font-medium">{branch.arabicName}</p>
                        <p className="text-sm text-muted-foreground">{branch.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(branch.isActive)}
                      <span className="text-sm text-muted-foreground">
                        {new Date(branch.updatedAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                ))}
                  </div>
                </CardContent>
              </Card>
        </TabsContent>

        <TabsContent value="branches" className="space-y-6">
          {/* Filters and Search */}
          <Card>
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
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Branches List */}
          <div className="grid gap-6">
            {filteredBranches.map((branch) => (
              <Card key={branch.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{branch.arabicName}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <span className="font-medium">{branch.englishName}</span>
                          <Badge variant="outline">{branch.code}</Badge>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(branch.isActive)}
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBranch(branch)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                        <Button
                              variant="outline"
                          size="sm"
                              onClick={() => setSelectedBranch(branch)}
                            >
                              <Trash2 className="h-4 w-4" />
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
                                onClick={() => handleConfirmDelete()}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>الموقع</span>
                      </div>
                      <p className="font-medium">{branch.city}, {branch.country}</p>
                      {branch.street && (
                        <p className="text-sm text-muted-foreground">{branch.street}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>ساعات العمل</span>
                      </div>
                      <p className="font-medium">
                        {formatWorkingHours(branch.working_hours_from, branch.working_hours_to)}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>المدير</span>
                      </div>
                      <p className="font-medium">{branch.manager || "غير محدد"}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>الهاتف</span>
                      </div>
                      <p className="font-medium">{branch.phoneNumber}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>البريد الإلكتروني</span>
                      </div>
                      <p className="font-medium">{branch.email}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>تاريخ الإنشاء</span>
                      </div>
                      <p className="font-medium">
                        {new Date(branch.createdAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>

                  {branch.description && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">{branch.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBranches.length === 0 && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">لا توجد فروع</h3>
                  <p className="text-muted-foreground">
                    لا توجد فروع تطابق معايير البحث المحددة.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>مقارنة أداء الفروع</CardTitle>
              <CardDescription>
                مقارنة شاملة لأداء الفروع المختلفة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {branches.map((branch) => (
                  <div key={branch.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{branch.arabicName}</h4>
                      {getStatusBadge(branch.isActive)}
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">الحالة</p>
                        <p className="text-lg font-semibold">
                          {branch.isActive ? "نشط" : "غير نشط"}
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">المدينة</p>
                        <p className="text-lg font-semibold">{branch.city}</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">ساعات العمل</p>
                        <p className="text-lg font-semibold">
                          {formatWorkingHours(branch.working_hours_from, branch.working_hours_to)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
              <CardTitle>التحليلات والإحصائيات</CardTitle>
              <CardDescription>
                نظرة شاملة على إحصائيات الفروع
              </CardDescription>
              </CardHeader>
              <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">توزيع الفروع حسب المدينة</h4>
                  <div className="space-y-3">
                    {cities.map((city) => {
                      const cityBranches = branches.filter(b => b.city === city);
                      const percentage = ((cityBranches.length / totalBranches) * 100).toFixed(1);
                      return (
                        <div key={city} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{city}</span>
                            <span>{cityBranches.length} فرع ({percentage}%)</span>
                    </div>
                          <Progress value={parseFloat(percentage)} className="h-2" />
                  </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">حالة الفروع</h4>
                  <div className="space-y-3">
                  <div className="flex justify-between items-center">
                      <span className="text-sm">نشط</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{activeBranches}</span>
                        <Badge className="bg-green-500">{((activeBranches / totalBranches) * 100).toFixed(1)}%</Badge>
                      </div>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="text-sm">غير نشط</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{inactiveBranches}</span>
                        <Badge variant="destructive">{((inactiveBranches / totalBranches) * 100).toFixed(1)}%</Badge>
                  </div>
                  </div>
                  </div>
                  </div>
                </div>
              </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Branch Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل بيانات الفرع</DialogTitle>
            <DialogDescription>
              قم بتعديل بيانات الفرع "{selectedBranch?.arabicName}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="arabicName">الاسم العربي *</Label>
                <Input
                  id="arabicName"
                  value={formData.arabicName}
                  onChange={(e) => handleInputChange("arabicName", e.target.value)}
                  placeholder="اسم الفرع بالعربية"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="englishName">الاسم الإنجليزي *</Label>
                <Input
                  id="englishName"
                  value={formData.englishName}
                  onChange={(e) => handleInputChange("englishName", e.target.value)}
                  placeholder="اسم الفرع بالإنجليزية"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">الكود *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  placeholder="كود الفرع"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="وصف الفرع"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="working_hours_from">ساعة البداية *</Label>
                  <Input
                    id="working_hours_from"
                    type="time"
                    value={formData.working_hours_from}
                    onChange={(e) => handleInputChange("working_hours_from", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="working_hours_to">ساعة النهاية *</Label>
                  <Input
                    id="working_hours_to"
                    type="time"
                    value={formData.working_hours_to}
                    onChange={(e) => handleInputChange("working_hours_to", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isActive">الحالة</Label>
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

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">رقم الهاتف *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  placeholder="رقم الهاتف"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephoneNumber">رقم الهاتف الثابت</Label>
                <Input
                  id="telephoneNumber"
                  value={formData.telephoneNumber}
                  onChange={(e) => handleInputChange("telephoneNumber", e.target.value)}
                  placeholder="رقم الهاتف الثابت"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="البريد الإلكتروني"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">الموقع الإلكتروني</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="الموقع الإلكتروني"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">الدولة *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="الدولة"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">المدينة *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="المدينة"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">الحي</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                  placeholder="الحي"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">الشارع</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  placeholder="الشارع"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">الرمز البريدي</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  placeholder="الرمز البريدي"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manager">المدير</Label>
                <Input
                  id="manager"
                  value={formData.manager}
                  onChange={(e) => handleInputChange("manager", e.target.value)}
                  placeholder="اسم المدير"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supervisor">المشرف</Label>
                <Input
                  id="supervisor"
                  value={formData.supervisor}
                  onChange={(e) => handleInputChange("supervisor", e.target.value)}
                  placeholder="اسم المشرف"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleUpdateBranch}
              disabled={isUpdating}
              className="gap-2"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  جاري التحديث...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  تحديث الفرع
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
