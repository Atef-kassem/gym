import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { 
  Shield, 
  Users, 
  Settings, 
  Save, 
  Download, 
  Search,
  Check,
  X,
  Info,
  Eye,
  Edit,
  Trash2,
  Plus,
  FileText,
  DollarSign,
  Car,
  Package,
  BarChart,
  Calendar,
  CreditCard,
  MessageSquare,
  UserCheck,
  Wrench,
  Coffee,
  Truck,
  Star,
  AlertTriangle,
  History,
  Filter,
  Copy,
  RefreshCw,
  Lock,
  Unlock,
  Activity,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRolesManagement } from "@/hooks/useRolesManagement";

// نوع البيانات للأدوار - يتم استيراده من useRolesManagement
import type { Role } from "@/hooks/useRolesManagement";

// تعريف أنواع البيانات للوحدات والصلاحيات
interface SystemModule {
  id: string;
  name: string;
  moduleTitle?: string;
  icon?: any;
  departments?: Array<{
    departmentName: string;
    departmentTitle: string;
    pages: Array<{
      pageName: string;
      pageTitle: string;
    }>;
  }>;
  screens?: Array<{
    pageName: string;
    pageTitle: string;
    departmentName?: string;
    departmentTitle?: string;
  }>;
}

interface PermissionType {
  id: string;
  permissionName: string;
  description?: string;
}

interface PageWithStatus {
  id: number;
  pageName: string;
  pageTitle: string;
  permissions?: Array<{ id: number }>;
}

interface AuditLog {
  id: string;
  action: string;
  user: string;
  target: string;
  timestamp: string;
  type: string;
}

// Memoized Components for better performance
const RoleCard = memo(({ role, onEdit, onDelete, onDetails }: {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
  onDetails: (role: Role) => void;
}) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${role.color} text-white`}>
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold">{role.roleName}</h3>
            <p className="text-sm text-muted-foreground">
              {role.userCount} مستخدم
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDetails(role)}
              >
                <Info className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>عرض تفاصيل الدور</p>
            </TooltipContent>
          </Tooltip>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(role)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={role.userCount > 0}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                <AlertDialogDescription>
                  هل أنت متأكد من حذف الدور "{role.roleName}"؟ هذا الإجراء لا يمكن التراجع عنه.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(role.id)}>
                  حذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        {role.description}
      </p>
      <div className="flex items-center justify-between">
        <Badge variant={role.isActive ? "default" : "secondary"}>
          {role.isActive ? "نشط" : "غير نشط"}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {role.createdAt}
        </span>
      </div>
    </CardContent>
  </Card>
));

const PermissionRow = memo(({ 
  screen, 
  index, 
  selectedRole, 
  module, 
  permissionTypes, 
  hasPermission, 
  updatePermission, 
  toggleAllScreenPermissions 
}: {
  screen: string;
  index: number;
  selectedRole: string;
  module: SystemModule;
  permissionTypes: PermissionType[];
  hasPermission: (roleId: string, moduleId: string, screen: string, permissionId: string) => boolean;
  updatePermission: (roleId: string, moduleId: string, screen: string, permissionId: string, value: boolean) => void;
  toggleAllScreenPermissions: (roleId: string, moduleId: string, screen: string, value: boolean) => void;
}) => {
  // استخراج pageName من النص المعروض (إزالة العنوان بين القوسين)
  const pageName = screen.includes('(') ? screen.split(' (')[0] : screen;
  
  return (
    <div className={`p-4 hover:bg-muted/20 transition-colors ${
      index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
    }`}>
      <div className="grid gap-2 items-center" style={{
        gridTemplateColumns: `250px 80px repeat(${permissionTypes.length}, 1fr)`
      }}>
        {/* اسم الشاشة */}
        <div className="font-medium text-right pr-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/60" />
            <div className="text-sm">
              {screen.includes('(') ? (
                <div>
                  <div className="font-medium text-foreground">{screen.split(' (')[0]}</div>
                  <div className="text-xs text-muted-foreground">({screen.split(' (')[1]}</div>
                </div>
              ) : (
                <span>{screen}</span>
              )}
            </div>
          </div>
        </div>

        {/* تحديد الكل */}
        <div className="flex justify-center">
          <Checkbox
            checked={permissionTypes.every(perm => hasPermission(selectedRole, module.id, pageName, perm.id))}
            onCheckedChange={(checked) => 
              toggleAllScreenPermissions(selectedRole, module.id, pageName, checked as boolean)
            }
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>

        {/* صلاحيات فردية */}
        {permissionTypes.map((perm) => (
          <div key={perm.id} className="flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Checkbox
                    checked={hasPermission(selectedRole, module.id, pageName, perm.id)}
                    onCheckedChange={(checked) => 
                      updatePermission(selectedRole, module.id, pageName, perm.id, checked as boolean)
                    }
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{perm.permissionName} - {screen}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
});

const StatisticsCard = memo(({ icon: Icon, title, value, bgColor, textColor }: {
  icon: any;
  title: string;
  value: string | number;
  bgColor: string;
  textColor: string;
}) => (
  <Card className="shadow-card">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 ${bgColor} ${textColor} rounded-lg`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
));

function RolesPermissions() {
  const { toast } = useToast();

  // استخدام hook إدارة الأدوار
  const {
    activeTab,
    setActiveTab,
    selectedRole,
    setSelectedRole,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    isRoleDialogOpen,
    setIsRoleDialogOpen,
    editingRole,
    setEditingRole,
    permissionsMatrix,
    setPermissionsMatrix,
    isRoleDetailsOpen,
    setIsRoleDetailsOpen,
    selectedRoleForDetails,
    setSelectedRoleForDetails,
    roles,
    filteredRoles,
    isLoadingRoles,
    rolePages,
    allPagesWithStatus,
    handleSaveRole: saveRole,
    handleDeleteRole: deleteRoleHandler,
    roleForm,
    setRoleForm,
    refetchRoles,
    assignPageToRole,
    removePageFromRole,
    // إضافة الدوال الجديدة من useRolesManagement
    handleSavePermissions: savePermissionsFromHook,
    updatePermission: updatePermissionFromHook,
    hasPermission: hasPermissionFromHook,
    toggleAllScreenPermissions: toggleAllScreenPermissionsFromHook,
    permissionTypes: permissionTypesFromHook,
    systemModules: systemModulesFromHook,
    // إضافة دوال التصدير والاستيراد
    handleExportRoles,
    handleImportRoles,
    handleExportAudit,
    handleClearAudit,
    // إضافة بيانات التدقيق
    auditLogs,
    filteredAuditLogs,
    // إضافة حالة الحفظ
    isSaving,
    // إضافة حالة تحميل الصلاحيات
    isLoadingPermissions,
    // إضافة دالة تحميل الصلاحيات
    loadRolePermissions,
    // إضافة دالة تحديث بيانات المستخدمين
    refetchRolesWithUserCounts
  } = useRolesManagement();

  // تحميل البيانات فقط عند تغيير التاب
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    // إعادة تعيين الدور المحدد عند تغيير التاب
    if (value !== "permissions") {
      setSelectedRole("");
      setPermissionsMatrix({});
    }
    
    // إذا كان التاب هو المستخدمين، قم بتحديث بيانات المستخدمين
    if (value === "users") {
      refetchRolesWithUserCounts();
    }
  }, [setActiveTab, setSelectedRole, setPermissionsMatrix, refetchRolesWithUserCounts]);

  // دالة معالجة تغيير الدور
  const handleRoleChange = useCallback((roleId: string) => {
    setSelectedRole(roleId);
    
    // إذا كان التاب المحدد هو الصلاحيات، قم بتحميل صلاحيات الدور
    if (activeTab === "permissions" && roleId) {
      const selectedRoleName = roles.find((r: Role) => r.id === roleId)?.roleName || 'الدور المحدد';
      
      toast({
        title: "جاري تحميل الصلاحيات",
        description: `جاري تحميل صلاحيات دور: ${selectedRoleName}`,
      });
      
      // تحميل الصلاحيات للدور المحدد
      setTimeout(() => {
        loadRolePermissions();
      }, 100);
    }
  }, [activeTab, loadRolePermissions, roles, toast]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleSavePermissions = useCallback(async () => {
    if (!selectedRole) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار دور أولاً",
        variant: "destructive"
      });
      return;
    }

    try {
      await savePermissionsFromHook();
      
      toast({
        title: "تم الحفظ بنجاح",
        description: `تم حفظ إعدادات الصلاحيات للدور`,
      });
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الصلاحيات",
        variant: "destructive"
      });
    }
  }, [selectedRole, savePermissionsFromHook, toast]);

  const updatePermission = useCallback((roleId: string, moduleId: string, screen: string, permissionId: string, value: boolean) => {
    const permission = permissionTypesFromHook?.find((p: PermissionType) => p.id === permissionId);
    if (permission) {
      updatePermissionFromHook(roleId, screen, permission.permissionName, value);
    }
  }, [permissionTypesFromHook, updatePermissionFromHook]);

  const hasPermission = useCallback((roleId: string, moduleId: string, screen: string, permissionId: string): boolean => {
    const permission = permissionTypesFromHook?.find((p: PermissionType) => p.id === permissionId);
    if (permission) {
      return hasPermissionFromHook(roleId, screen, permission.permissionName);
    }
    return false;
  }, [permissionTypesFromHook, hasPermissionFromHook]);

  const toggleAllScreenPermissions = useCallback((roleId: string, moduleId: string, screen: string, value: boolean) => {
    toggleAllScreenPermissionsFromHook(roleId, screen, value);
  }, [toggleAllScreenPermissionsFromHook]);

  // تعريف resetRoleForm أولاً
  const resetRoleForm = useCallback(() => {
    setRoleForm({
      roleName: "",
      description: "",
      color: "bg-gradient-to-r from-blue-500 to-indigo-500",
      isActive: true
    });
    setEditingRole(null);
  }, []);

  const handleSaveRole = useCallback(async () => {
    if (!roleForm.roleName.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال اسم الدور",
        variant: "destructive"
      });
      return;
    }

    try {
      await saveRole();
      resetRoleForm();
      setIsRoleDialogOpen(false);
      refetchRoles();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الدور",
        variant: "destructive"
      });
    }
  }, [roleForm.roleName, saveRole, resetRoleForm, refetchRoles, toast]);

  const handleDeleteRole = useCallback((roleId: string) => {
    const role = roles.find((r: Role) => r.id === roleId);
    if (!role) return;

    if (role.userCount > 0) {
      toast({
        title: "لا يمكن الحذف",
        description: "لا يمكن حذف دور مرتبط بمستخدمين. يرجى نقل المستخدمين أولاً.",
        variant: "destructive"
      });
      return;
    }

    deleteRoleHandler(roleId);
  }, [roles, deleteRoleHandler, toast]);

  const handleEditRole = useCallback((role: Role) => {
    setEditingRole(role);
    setRoleForm({
      roleName: role.roleName,
      description: role.description,
      color: role.color,
      isActive: role.isActive
    });
    setIsRoleDialogOpen(true);
  }, []);

  const handleRoleDetails = useCallback((role: Role) => {
    setSelectedRoleForDetails(role);
    setIsRoleDetailsOpen(true);
  }, []);

  const handleFileImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImportRoles(file);
    }
    event.target.value = '';
  }, [handleImportRoles]);

  const handleExport = useCallback((type: 'roles' | 'permissions' | 'users') => {
    switch (type) {
      case 'roles':
        handleExportRoles();
        break;
      case 'permissions':
        toast({
          title: "تم التصدير",
          description: "تم تصدير الصلاحيات"
        });
        break;
      case 'users':
        toast({
          title: "تم التصدير",
          description: "تم تصدير بيانات المستخدمين"
        });
        break;
    }
  }, [handleExportRoles, toast]);

  // Memoized statistics data - Load only when needed
  const statisticsData = useMemo(() => [
    {
      icon: Shield,
      title: "إجمالي الأدوار",
      value: activeTab === "roles" || activeTab === "users" ? roles.length : 0,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      icon: Users,
      title: "إجمالي المستخدمين",
      value: activeTab === "roles" || activeTab === "users" ? roles.reduce((sum: number, role: Role) => sum + role.userCount, 0) : 0,
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      icon: Lock,
      title: "وحدات النظام",
      value: activeTab === "permissions" ? (systemModulesFromHook?.length || 0) : 0,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    },
    {
      icon: Activity,
      title: "أنواع الصلاحيات",
      value: activeTab === "permissions" ? (permissionTypesFromHook?.length || 0) : 0,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600"
    }
  ], [activeTab, roles, systemModulesFromHook, permissionTypesFromHook]);

  // إنشاء مصفوفة الصلاحيات من البيانات الحقيقية - فقط عند الحاجة
  useEffect(() => {
    // تحميل البيانات فقط عند الحاجة
    if (activeTab === "permissions" && selectedRole && allPagesWithStatus && allPagesWithStatus.length > 0 && permissionTypesFromHook?.length > 0) {

      const newPermissionsMatrix: Record<string, Record<string, Record<string, boolean>>> = {};
      
      allPagesWithStatus.forEach((page: PageWithStatus) => {
        if (!newPermissionsMatrix[selectedRole]) {
          newPermissionsMatrix[selectedRole] = {};
        }
        
        // استخدام pageName كمعرف فريد للصفحة
        if (!newPermissionsMatrix[selectedRole][page.pageName]) {
          newPermissionsMatrix[selectedRole][page.pageName] = {};
        }
        
        // تعيين الصلاحيات الموجودة
        permissionTypesFromHook.forEach((permission: PermissionType) => {
          newPermissionsMatrix[selectedRole][page.pageName][permission.permissionName] = 
            page.permissions?.some((p: { id: number }) => p.id === parseInt(permission.id)) || false;
        });
      });
      

      setPermissionsMatrix(newPermissionsMatrix);
    }
  }, [activeTab, selectedRole, allPagesWithStatus, permissionTypesFromHook]);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              إدارة الأدوار والصلاحيات (RBAC)
            </h1>
            <p className="text-muted-foreground mt-2">
              نظام إدارة شامل للأدوار والصلاحيات مع التحكم الكامل في الوصول والأمان
            </p>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
                  <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            إدارة الأدوار
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            إدارة الصلاحيات
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            المستخدمين
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            سجل التدقيق
          </TabsTrigger>
        </TabsList>

          {/* Tab: إدارة الأدوار */}
          <TabsContent value="roles" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    إدارة الأدوار
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleExport('roles')}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      تصدير الأدوار
                    </Button>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept=".xlsx,.xls" 
                        onChange={handleFileImport}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button 
                        variant="outline" 
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        استيراد الأدوار
                      </Button>
                    </div>
                    <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="gap-2" onClick={resetRoleForm}>
                          <Plus className="w-4 h-4" />
                          إضافة دور جديد
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            {editingRole ? "تعديل الدور" : "إضافة دور جديد"}
                          </DialogTitle>
                          <DialogDescription>
                            {editingRole ? "تعديل بيانات الدور المحدد" : "إنشاء دور جديد بصلاحيات مخصصة"}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="roleName">اسم الدور</Label>
                            <Input
                              id="roleName"
                              value={roleForm.roleName}
                              onChange={(e) => setRoleForm(prev => ({ ...prev, roleName: e.target.value }))}
                              placeholder="مثال: مشرف المبيعات"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="roleDescription">الوصف</Label>
                            <Textarea
                              id="roleDescription"
                              value={roleForm.description}
                              onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="وصف مختصر لمهام هذا الدور"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="roleColor">لون الدور</Label>
                            <Select 
                              value={roleForm.color} 
                              onValueChange={(value) => setRoleForm(prev => ({ ...prev, color: value }))}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bg-gradient-to-r from-blue-500 to-indigo-500">أزرق</SelectItem>
                                <SelectItem value="bg-gradient-to-r from-green-500 to-emerald-500">أخضر</SelectItem>
                                <SelectItem value="bg-gradient-to-r from-red-500 to-rose-500">أحمر</SelectItem>
                                <SelectItem value="bg-gradient-to-r from-purple-500 to-violet-500">بنفسجي</SelectItem>
                                <SelectItem value="bg-gradient-to-r from-orange-500 to-amber-500">برتقالي</SelectItem>
                                <SelectItem value="bg-gradient-to-r from-teal-500 to-cyan-500">تركوازي</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="roleActive"
                              checked={roleForm.isActive}
                              onCheckedChange={(checked) => setRoleForm(prev => ({ ...prev, isActive: checked }))}
                            />
                            <Label htmlFor="roleActive">دور نشط</Label>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                            إلغاء
                          </Button>
                          <Button onClick={handleSaveRole}>
                            {editingRole ? "تحديث" : "إنشاء"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* فلاتر البحث */}
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="البحث في الأدوار..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأدوار</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Loading State */}
                {isLoadingRoles && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">جاري تحميل الأدوار...</p>
                  </div>
                )}

                {/* قائمة الأدوار */}
                {!isLoadingRoles && activeTab === "roles" && (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredRoles.map((role: Role) => (
                      <RoleCard
                        key={role.id}
                        role={role}
                        onEdit={handleEditRole}
                        onDelete={handleDeleteRole}
                        onDetails={handleRoleDetails}
                      />
                    ))}
                  </div>
                )}

                {!isLoadingRoles && activeTab === "roles" && filteredRoles.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد أدوار تطابق البحث</p>
                  </div>
                )}

                {activeTab !== "roles" && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>اختر تاب "إدارة الأدوار" لعرض الأدوار</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: إدارة الصلاحيات */}
          <TabsContent value="permissions" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    إدارة الصلاحيات
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleExport('permissions')}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      تصدير الصلاحيات
                    </Button>
                     <Button 
                       onClick={handleSavePermissions}
                       className="gap-2"
                       disabled={!selectedRole || isSaving}
                     >
                      <Save className="w-4 h-4" />
                      {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* اختيار الدور */}
                <div className="mb-6">
                  <Label>اختيار الدور لتحرير صلاحياته</Label>
                  <Select value={selectedRole} onValueChange={handleRoleChange}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="اختر الدور..." />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role: Role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded ${role.color}`} />
                            {role.roleName}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedRole && activeTab === "permissions" && systemModulesFromHook && systemModulesFromHook.length > 0 && (
                  <div className="space-y-6">
                    {/* رسالة حالة تحميل الصلاحيات */}
                    {isLoadingPermissions && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                          <div>
                            <h4 className="font-medium text-blue-900">جاري تحميل صلاحيات الدور</h4>
                            <p className="text-sm text-blue-700">
                              يتم الآن تحميل جميع الصلاحيات الموجودة للدور المحدد...
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* تابس الإدارات */}
                    <Tabs defaultValue={systemModulesFromHook[0]?.id} className="w-full">
                      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto p-1">
                        {systemModulesFromHook.map((module: SystemModule) => {
                          const IconComponent = module.icon || BarChart;

                          return (
                            <TabsTrigger 
                              key={module.id} 
                              value={module.id}
                              className="flex flex-col gap-1 p-3 h-auto"
                            >
                              <IconComponent className="w-4 h-4" />
                              <span className="text-xs text-center leading-tight">
                                <div className="font-medium">{module.name}</div>
                                {module.moduleTitle && (
                                  <div className="text-muted-foreground">({module.moduleTitle})</div>
                                )}
                              </span>
                            </TabsTrigger>
                          );
                        })}
                      </TabsList>

                      {/* محتوى كل إدارة */}
                      {systemModulesFromHook.map((module: SystemModule) => (
                        <TabsContent key={module.id} value={module.id} className="mt-6">
                          <Card>
                            <CardHeader className="pb-4">
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <BarChart className="w-5 h-5 text-primary" />
                                صلاحيات {module.name} {module.moduleTitle && `(${module.moduleTitle})`}
                              </CardTitle>
                              <div className="text-sm text-muted-foreground">
                                حدد الصلاحيات المطلوبة لكل شاشة في هذه الإدارة
                              </div>
                            </CardHeader>
                            <CardContent>
                              {/* جدول الصلاحيات */}
                              <div className="border rounded-lg overflow-hidden">
                                {/* ج.م الجدول */}
                                <div className="bg-muted/30 p-4">
                                  <div className="grid gap-2 items-center" style={{
                                    gridTemplateColumns: `250px 80px repeat(${permissionTypesFromHook?.length || 0}, 1fr)`
                                  }}>
                                    <div className="font-semibold text-right">اسم الشاشة</div>
                                    <div className="text-center font-semibold">الكل</div>
                                    {permissionTypesFromHook?.map((perm: PermissionType) => (
                                      <Tooltip key={perm.id}>
                                        <TooltipTrigger asChild>
                                          <div className="text-center font-semibold cursor-help">
                                            <Eye className="w-5 h-5 mx-auto text-blue-600" />
                                            <span className="text-xs mt-1 block">{perm.permissionName}</span>
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{perm.description || `صلاحية ${perm.permissionName}`}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    ))}
                                  </div>
                                </div>

                                {/* صفوف الشاشات */}
                                <div className="divide-y">
                                  {(() => {
                                    // إذا كان يحتوي على departments، اعرضها بشكل مجمع
                                    if (module.departments && module.departments.length > 0) {
                                      let globalIndex = 0;
                                      return module.departments.map((dept: any) => (
                                        <div key={dept.departmentName}>
                                          {/* رأس الإدارة */}
                                          <div className="bg-primary/5 px-4 py-3 border-b-2 border-primary/20">
                                            <div className="flex items-center gap-2">
                                              <div className="w-1 h-6 bg-primary rounded-full" />
                                              <h3 className="font-bold text-primary text-lg">{dept.departmentTitle}</h3>
                                            </div>
                                          </div>
                                          {/* صفحات الإدارة */}
                                          {(dept.pages || []).map((screen: any) => {
                                            const screenTitle = screen.pageTitle;
                                            const screenName = screen.pageName;
                                            const displayText = `${screen.pageName} (${screen.pageTitle})`;
                                            globalIndex++;
                                            
                                            return (
                                              <PermissionRow
                                                key={screenName}
                                                screen={displayText}
                                                index={globalIndex}
                                                selectedRole={selectedRole}
                                                module={module}
                                                permissionTypes={permissionTypesFromHook || []}
                                                hasPermission={hasPermission}
                                                updatePermission={updatePermission}
                                                toggleAllScreenPermissions={toggleAllScreenPermissions}
                                              />
                                            );
                                          })}
                                        </div>
                                      ));
                                    } else {
                                      // البنية القديمة - عرض مباشر
                                      return (module.screens || []).map((screen: any, index: number) => {
                                    const screenTitle = typeof screen === 'string' ? screen : screen.pageTitle;
                                    const screenName = typeof screen === 'string' ? screen : screen.pageName;
                                    const displayText = typeof screen === 'string' 
                                      ? screen 
                                      : `${screen.pageName} (${screen.pageTitle})`;
                                    
                                    return (
                                      <PermissionRow
                                        key={screenName}
                                        screen={displayText}
                                        index={index}
                                        selectedRole={selectedRole}
                                        module={module}
                                        permissionTypes={permissionTypesFromHook || []}
                                        hasPermission={hasPermission}
                                        updatePermission={updatePermission}
                                        toggleAllScreenPermissions={toggleAllScreenPermissions}
                                      />
                                    );
                                      });
                                    }
                                  })()}
                                </div>
                              </div>

                              {/* إحصائيات الإدارة */}
                              <div className="mt-4 p-4 bg-muted/20 rounded-lg">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    إجمالي الشاشات: <span className="font-medium text-foreground">{module.screens?.length || 0}</span>
                                  </span>
                                  <span className="text-muted-foreground">
                                    الصلاحيات المفعلة: <span className="font-medium text-foreground">
                                      {(module.screens || []).reduce((count: number, screen: any) => {
                                        const screenName = typeof screen === 'string' ? screen : screen.pageName;
                                        return count + (permissionTypesFromHook?.filter((perm: PermissionType) => 
                                          hasPermission(selectedRole, module.id, screenName, perm.id)
                                        ).length || 0);
                                      }, 0)} / {(module.screens?.length || 0) * (permissionTypesFromHook?.length || 0)}
                                    </span>
                                  </span>
                                  <span className="text-muted-foreground">
                                    نسبة التفعيل: <span className="font-medium text-foreground">
                                      {Math.round(((module.screens || []).reduce((count: number, screen: any) => {
                                        const screenName = typeof screen === 'string' ? screen : screen.pageName;
                                        return count + (permissionTypesFromHook?.filter((perm: PermissionType) => 
                                          hasPermission(selectedRole, module.id, screenName, perm.id)
                                        ).length || 0);
                                      }, 0) / ((module.screens?.length || 0) * (permissionTypesFromHook?.length || 0))) * 100) || 0}%
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>
                )}

                {!selectedRole && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Lock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">اختر دوراً لتحرير صلاحياته</h3>
                    <p>حدد الدور من القائمة أعلاه لعرض وتعديل صلاحياته حسب الإدارات</p>
                  </div>
                )}

                {selectedRole && (!systemModulesFromHook || systemModulesFromHook.length === 0) && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">لا توجد وحدات نظام</h3>
                    <p>لم يتم العثور على وحدات النظام. يرجى التحقق من إعدادات النظام.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: المستخدمين */}
          <TabsContent value="users" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    إدارة المستخدمين والأدوار
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleExport('users')}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      تصدير المستخدمين
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* عرض الأدوار مع عدد المستخدمين */}
                <div className="space-y-4">
                  {roles.map((role: Role) => (
                    <div key={role.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${role.color} text-white`}>
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{role.roleName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {role.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {role.userCount}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            مستخدم
                          </div>
                        </div>
                      </div>
                      
                      {/* تفاصيل المستخدمين */}
                      {role.userCount > 0 && (
                        <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                          <h4 className="font-medium mb-2">المستخدمين في هذا الدور:</h4>
                          <div className="space-y-2">
                            {/* هنا يمكن إضافة قائمة المستخدمين الفعلية */}
                            <div className="text-sm text-muted-foreground">
                              عدد المستخدمين: {role.userCount}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              (سيتم عرض تفاصيل المستخدمين قريباً)
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {role.userCount === 0 && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2 text-yellow-800">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-sm">لا يوجد مستخدمين لهذا الدور</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: سجل التدقيق */}
          <TabsContent value="audit" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    سجل التدقيق والمراجعة
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleExportAudit}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      تصدير السجل
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleClearAudit}
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      مسح السجل
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {activeTab === "audit" && filteredAuditLogs && filteredAuditLogs.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAuditLogs.map((log: AuditLog) => (
                      <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Activity className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium">{log.action}</p>
                            <p className="text-sm text-muted-foreground">
                              المستخدم: {log.user} | الهدف: {log.target}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{log.timestamp}</p>
                          <Badge variant="outline">{log.type}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activeTab === "audit" ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">سجل التدقيق فارغ</h3>
                    <p>لا توجد سجلات تدقيق لعرضها</p>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">اختر تاب "سجل التدقيق" لعرض السجلات</h3>
                    <p>سيتم تحميل البيانات عند اختيار التاب</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statisticsData.map((stat, index) => (
            <StatisticsCard
              key={index}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              bgColor={stat.bgColor}
              textColor={stat.textColor}
            />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

export default memo(RolesPermissions);