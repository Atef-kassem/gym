import { Shield, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  useGetUserPermissionsQuery,
  useUpdateUserPermissionsMutation,
  useGetUserModulesQuery,
  useUpdateUserModulesMutation
} from "@/services/userApi";
import { UserPermissions, UserModules } from "@/types/user";

interface UserPermissionsFormProps {
  userId?: string;
}

export function UserPermissionsForm({ userId }: UserPermissionsFormProps) {
  const { toast } = useToast();
  
  // API hooks
  const { data: permissionsData, refetch: refetchPermissions } = useGetUserPermissionsQuery(
    userId || "1",
    { skip: !userId }
  );
  const [updatePermissions, { isLoading: isUpdatingPermissions }] = useUpdateUserPermissionsMutation();
  
  const { data: modulesData, refetch: refetchModules } = useGetUserModulesQuery(
    userId || "1",
    { skip: !userId }
  );
  const [updateModules, { isLoading: isUpdatingModules }] = useUpdateUserModulesMutation();

  const [permissions, setPermissions] = useState<UserPermissions>({
    dashboard: true,
    pos: true,
    inventory: false,
    crm: true,
    reception: false,
    reports: true,
    settings: false,
    users: false,
    backup: false,
    systemLogs: false
  });

  const [modules, setModules] = useState<UserModules>({
    sales: true,
    purchases: false,
    accounting: true,
    hr: false,
    maintenance: true
  });

  // Load permissions and modules when data changes
  useEffect(() => {
    if (permissionsData?.permissions) {
      setPermissions(permissionsData.permissions);
    }
  }, [permissionsData]);

  useEffect(() => {
    if (modulesData?.modules) {
      setModules(modulesData.modules);
    }
  }, [modulesData]);

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setPermissions(prev => ({ ...prev, [permission]: checked }));
  };

  const handleModuleChange = (module: string, checked: boolean) => {
    setModules(prev => ({ ...prev, [module]: checked }));
  };

  const handleSavePermissions = async () => {
    if (!userId) {
      toast({
        title: "خطأ",
        description: "لم يتم تحديد المستخدم",
        variant: "destructive",
      });
      return;
    }

    try {
      await updatePermissions({ userId, permissions }).unwrap();
      toast({
        title: "تم حفظ الصلاحيات",
        description: "تم حفظ صلاحيات المستخدم بنجاح",
      });
      refetchPermissions();
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الصلاحيات",
        variant: "destructive",
      });
    }
  };

  const handleSaveModules = async () => {
    if (!userId) {
      toast({
        title: "خطأ",
        description: "لم يتم تحديد المستخدم",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateModules({ userId, modules }).unwrap();
      toast({
        title: "تم حفظ الوحدات",
        description: "تم حفظ وحدات المستخدم بنجاح",
      });
      refetchModules();
    } catch (error) {
      console.error('Error saving modules:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الوحدات",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* System Permissions */}
      <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-warning/5 border-l-4 border-l-warning">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-4 h-4 text-warning" />
            </div>
            صلاحيات النظام
          </CardTitle>
          <CardDescription>تحديد الصلاحيات الأساسية للمستخدم</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="dashboard" className="text-sm font-medium">
                لوحة المعلومات
              </Label>
              <Switch
                id="dashboard"
                checked={permissions.dashboard}
                onCheckedChange={(checked) => handlePermissionChange("dashboard", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="pos" className="text-sm font-medium">
                نقاط البيع
              </Label>
              <Switch
                id="pos"
                checked={permissions.pos}
                onCheckedChange={(checked) => handlePermissionChange("pos", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="inventory" className="text-sm font-medium">
                إدارة المخزون
              </Label>
              <Switch
                id="inventory"
                checked={permissions.inventory}
                onCheckedChange={(checked) => handlePermissionChange("inventory", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="crm" className="text-sm font-medium">
                إدارة العملاء
              </Label>
              <Switch
                id="crm"
                checked={permissions.crm}
                onCheckedChange={(checked) => handlePermissionChange("crm", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reception" className="text-sm font-medium">
                الاستقبال
              </Label>
              <Switch
                id="reception"
                checked={permissions.reception}
                onCheckedChange={(checked) => handlePermissionChange("reception", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reports" className="text-sm font-medium">
                التقارير
              </Label>
              <Switch
                id="reports"
                checked={permissions.reports}
                onCheckedChange={(checked) => handlePermissionChange("reports", checked)}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-muted">
            <Button 
              onClick={handleSavePermissions}
              disabled={isUpdatingPermissions}
              className="w-full bg-gradient-to-r from-warning to-orange-500 hover:from-warning/90 hover:to-orange-500/90 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isUpdatingPermissions ? "جاري الحفظ..." : "حفظ الصلاحيات"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Administrative Permissions */}
      <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-destructive/5 border-l-4 border-l-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-4 h-4 text-destructive" />
            </div>
            الصلاحيات الإدارية
          </CardTitle>
          <CardDescription>صلاحيات خاصة للمديرين والمشرفين</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="settings" className="text-sm font-medium">
                إعدادات النظام
              </Label>
              <Switch
                id="settings"
                checked={permissions.settings}
                onCheckedChange={(checked) => handlePermissionChange("settings", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="users" className="text-sm font-medium">
                إدارة المستخدمين
              </Label>
              <Switch
                id="users"
                checked={permissions.users}
                onCheckedChange={(checked) => handlePermissionChange("users", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="backup" className="text-sm font-medium">
                النسخ الاحتياطي
              </Label>
              <Switch
                id="backup"
                checked={permissions.backup}
                onCheckedChange={(checked) => handlePermissionChange("backup", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="systemLogs" className="text-sm font-medium">
                سجلات النظام
              </Label>
              <Switch
                id="systemLogs"
                checked={permissions.systemLogs}
                onCheckedChange={(checked) => handlePermissionChange("systemLogs", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Access */}
      <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-primary/5 border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            الوصول للوحدات
          </CardTitle>
          <CardDescription>تحديد الوحدات التي يمكن للمستخدم الوصول إليها</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sales"
                checked={modules.sales}
                onCheckedChange={(checked) => handleModuleChange("sales", checked as boolean)}
              />
              <Label htmlFor="sales" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                وحدة المبيعات
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="purchases"
                checked={modules.purchases}
                onCheckedChange={(checked) => handleModuleChange("purchases", checked as boolean)}
              />
              <Label htmlFor="purchases" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                وحدة المشتريات
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="accounting"
                checked={modules.accounting}
                onCheckedChange={(checked) => handleModuleChange("accounting", checked as boolean)}
              />
              <Label htmlFor="accounting" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                وحدة المحاسبة
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hr"
                checked={modules.hr}
                onCheckedChange={(checked) => handleModuleChange("hr", checked as boolean)}
              />
              <Label htmlFor="hr" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                وحدة الموارد البشرية
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="maintenance"
                checked={modules.maintenance}
                onCheckedChange={(checked) => handleModuleChange("maintenance", checked as boolean)}
              />
              <Label htmlFor="maintenance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                وحدة الصيانة
              </Label>
            </div>
          </div>

          <div className="pt-4 border-t border-muted">
            <Button 
              onClick={handleSaveModules}
              disabled={isUpdatingModules}
              className="w-full bg-gradient-to-r from-primary to-secondary-blue hover:from-primary/90 hover:to-secondary-blue/90 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isUpdatingModules ? "جاري الحفظ..." : "حفظ الوحدات"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}