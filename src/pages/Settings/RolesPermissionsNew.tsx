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
import { useRolesManagement } from "@/hooks/useRolesManagement";

export default function RolesPermissions() {
  const {
    // State
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
    roleForm,
    setRoleForm,

    // Data
    roles,
    filteredRoles,
    auditLogs,
    filteredAuditLogs,
    systemModules,
    permissionTypes,
    roleStatistics,

    // Loading states
    isLoadingRoles,
    isCreatingRole,
    isUpdatingRole,
    isDeletingRole,
    isTogglingStatus,
    isUpdatingPermissions,
    isExportingRoles,
    isImportingRoles,
    isExportingAudit,
    isClearingAudit,

    // Functions
    handleSavePermissions,
    updatePermission,
    hasPermission,
    toggleAllScreenPermissions,
    handleSaveRole,
    handleDeleteRole,
    resetRoleForm,
    handleExportRoles,
    handleImportRoles,
    handleExportAudit,
    handleClearAudit,
    refetchRoles,
    refetchAuditLogs
  } = useRolesManagement();

  // Handle role edit
  const handleEditRole = (role: any) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      color: role.color,
      isActive: role.isActive
    });
    setIsRoleDialogOpen(true);
  };

  // Handle role details
  const handleRoleDetails = (role: any) => {
    setSelectedRoleForDetails(role);
    setIsRoleDetailsOpen(true);
  };

  // Handle file import
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImportRoles(file);
    }
    // Reset input
    event.target.value = '';
  };

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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              إدارة الأدوار
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              إدارة الصلاحيات
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
                      onClick={handleExportRoles}
                      disabled={isExportingRoles}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      {isExportingRoles ? "جاري التصدير..." : "تصدير الأدوار"}
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
                        disabled={isImportingRoles}
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        {isImportingRoles ? "جاري الاستيراد..." : "استيراد الأدوار"}
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
                              value={roleForm.name}
                              onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
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
                          <Button 
                            onClick={handleSaveRole}
                            disabled={isCreatingRole || isUpdatingRole}
                          >
                            {isCreatingRole || isUpdatingRole ? "جاري الحفظ..." : (editingRole ? "تحديث" : "إنشاء")}
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

                {/* Loading state */}
                {isLoadingRoles && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">جاري تحميل الأدوار...</p>
                  </div>
                )}

                {/* قائمة الأدوار */}
                {!isLoadingRoles && (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredRoles.map((role) => (
                      <Card key={role.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${role.color} text-white`}>
                                <Shield className="w-4 h-4" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{role.name}</h3>
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
                                     onClick={() => handleRoleDetails(role)}
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
                                 onClick={() => handleEditRole(role)}
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
                                       هل أنت متأكد من حذف الدور "{role.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
                                     </AlertDialogDescription>
                                   </AlertDialogHeader>
                                   <AlertDialogFooter>
                                     <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                     <AlertDialogAction onClick={() => handleDeleteRole(role.id)}>
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
                    ))}
                  </div>
                )}

                {!isLoadingRoles && filteredRoles.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد أدوار تطابق البحث</p>
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
                      onClick={handleExportRoles}
                      disabled={isExportingRoles}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      {isExportingRoles ? "جاري التصدير..." : "تصدير الصلاحيات"}
                    </Button>
                     <Button 
                       onClick={handleSavePermissions}
                       disabled={!selectedRole || isUpdatingPermissions}
                       className="gap-2"
                     >
                      <Save className="w-4 h-4" />
                      {isUpdatingPermissions ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* اختيار الدور */}
                <div className="mb-6">
                  <Label>اختيار الدور لتحرير صلاحياته</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="اختر الدور..." />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded ${role.color}`} />
                            {role.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedRole && systemModules.length > 0 && permissionTypes.length > 0 && (
                  <div className="space-y-6">
                    {/* تابس الإدارات */}
                    <Tabs defaultValue={systemModules[0]?.id} className="w-full">
                      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto p-1">
                        {systemModules.map((module) => {
                          const IconComponent = module.icon;
                          return (
                            <TabsTrigger 
                              key={module.id} 
                              value={module.id}
                              className="flex flex-col gap-1 p-3 h-auto"
                            >
                              <IconComponent className="w-4 h-4" />
                              <span className="text-xs text-center">{module.name}</span>
                            </TabsTrigger>
                          );
                        })}
                      </TabsList>

                      {/* محتوى كل إدارة */}
                      {systemModules.map((module) => (
                        <TabsContent key={module.id} value={module.id} className="mt-6">
                          <Card>
                            <CardHeader className="pb-4">
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <module.icon className="w-5 h-5 text-primary" />
                                صلاحيات {module.name}
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
                                    gridTemplateColumns: `250px 80px repeat(${permissionTypes.length}, 1fr)`
                                  }}>
                                    <div className="font-semibold text-right">اسم الشاشة</div>
                                    <div className="text-center font-semibold">الكل</div>
                                    {permissionTypes.map((perm) => (
                                      <Tooltip key={perm.id}>
                                        <TooltipTrigger asChild>
                                          <div className="text-center font-semibold cursor-help">
                                            <perm.icon className={`w-5 h-5 mx-auto ${perm.color}`} />
                                            <span className="text-xs mt-1 block">{perm.name}</span>
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{perm.description}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    ))}
                                  </div>
                                </div>

                                {/* صفوف الشاشات */}
                                <div className="divide-y">
                                  {module.screens.map((screen, index) => (
                                    <div key={screen} className={`p-4 hover:bg-muted/20 transition-colors ${
                                      index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                                    }`}>
                                      <div className="grid gap-2 items-center" style={{
                                        gridTemplateColumns: `250px 80px repeat(${permissionTypes.length}, 1fr)`
                                      }}>
                                        {/* اسم الشاشة */}
                                        <div className="font-medium text-right pr-2">
                                          <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-primary/60" />
                                            {screen}
                                          </div>
                                        </div>

                                        {/* تحديد الكل */}
                                        <div className="flex justify-center">
                                          <Checkbox
                                            checked={permissionTypes.every(perm => hasPermission(selectedRole, module.id, screen, perm.id))}
                                            onCheckedChange={(checked) => 
                                              toggleAllScreenPermissions(selectedRole, module.id, screen, checked as boolean)
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
                                                    checked={hasPermission(selectedRole, module.id, screen, perm.id)}
                                                    onCheckedChange={(checked) => 
                                                      updatePermission(selectedRole, module.id, screen, perm.id, checked as boolean)
                                                    }
                                                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                  />
                                                </div>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>{perm.name} - {screen}</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* إحصائيات الإدارة */}
                              <div className="mt-4 p-4 bg-muted/20 rounded-lg">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    إجمالي الشاشات: <span className="font-medium text-foreground">{module.screens.length}</span>
                                  </span>
                                  <span className="text-muted-foreground">
                                    الصلاحيات المفعلة: <span className="font-medium text-foreground">
                                      {module.screens.reduce((count, screen) => {
                                        return count + permissionTypes.filter(perm => 
                                          hasPermission(selectedRole, module.id, screen, perm.id)
                                        ).length;
                                      }, 0)} / {module.screens.length * permissionTypes.length}
                                    </span>
                                  </span>
                                  <span className="text-muted-foreground">
                                    نسبة التفعيل: <span className="font-medium text-foreground">
                                      {Math.round((module.screens.reduce((count, screen) => {
                                        return count + permissionTypes.filter(perm => 
                                          hasPermission(selectedRole, module.id, screen, perm.id)
                                        ).length;
                                      }, 0) / (module.screens.length * permissionTypes.length)) * 100)}%
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

                {selectedRole && (systemModules.length === 0 || permissionTypes.length === 0) && (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>جاري تحميل بيانات النظام...</p>
                  </div>
                )}
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
                      disabled={isExportingAudit}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      {isExportingAudit ? "جاري التصدير..." : "تصدير السجل"}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleClearAudit}
                      disabled={isClearingAudit}
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {isClearingAudit ? "جاري المسح..." : "مسح السجل"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* فلاتج.مجل التدقيق */}
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="البحث في السجل..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="نوع العملية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع العمليات</SelectItem>
                      <SelectItem value="role">الأدوار</SelectItem>
                      <SelectItem value="permission">الصلاحيات</SelectItem>
                      <SelectItem value="user">المستخدمين</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* قائمة سجل التدقيق */}
                <div className="space-y-3">
                  {filteredAuditLogs.map((log) => (
                    <Card key={log.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            log.type === 'role' ? 'bg-blue-100 text-blue-600' :
                            log.type === 'permission' ? 'bg-green-100 text-green-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            {log.type === 'role' ? <Shield className="w-4 h-4" /> :
                             log.type === 'permission' ? <Lock className="w-4 h-4" /> :
                             <Users className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{log.action}</h4>
                              <Badge variant="outline" className="text-xs">
                                {log.type === 'role' ? 'دور' :
                                 log.type === 'permission' ? 'صلاحية' : 'مستخدم'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              <span className="font-medium">{log.user}</span> قام بـ {log.action} على{" "}
                              <span className="font-medium">{log.target}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">{log.details}</p>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground text-left">
                          {log.timestamp}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {filteredAuditLogs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد عمليات في سجل التدقيق</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الأدوار</p>
                  <p className="text-2xl font-bold">{roles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي المستخدمين</p>
                  <p className="text-2xl font-bold">{roleStatistics.totalUsers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">وحدات النظام</p>
                  <p className="text-2xl font-bold">{systemModules.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">عمليات اليوم</p>
                  <p className="text-2xl font-bold">{auditLogs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
