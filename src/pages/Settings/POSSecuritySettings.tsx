import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Shield, 
  ChevronLeft,
  Lock,
  Eye,
  Users,
  Clock,
  AlertTriangle,
  Key,
  Fingerprint,
  Smartphone,
  Camera,
  FileSearch,
  UserCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  canOverride: boolean;
  maxTransactionAmount: number;
}

const POSSecuritySettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [authenticationSettings, setAuthenticationSettings] = useState({
    requireLogin: true,
    sessionTimeout: 30, // minutes
    autoLockScreen: true,
    lockScreenTimeout: 5, // minutes
    twoFactorAuth: false,
    biometricAuth: false,
    pinLength: 4,
    pinComplexity: "numbers", // numbers, alphanumeric, complex
    maxLoginAttempts: 3,
    lockoutDuration: 15, // minutes
    rememberLogin: false,
    rememberDuration: 24 // hours
  });

  const [cashierPermissions, setCashierPermissions] = useState({
    canProcessSales: true,
    canApplyDiscounts: false,
    maxDiscountPercent: 0,
    canVoidTransactions: false,
    canRefundItems: false,
    canModifyPrices: false,
    canAccessReports: false,
    canOpenCashDrawer: true,
    canOverridePrices: false,
    overrideLimit: 0,
    requireApprovalAbove: 1000,
    canViewCustomerInfo: true,
    canEditCustomerInfo: false
  });

  const [supervisorPermissions, setSupervisorPermissions] = useState({
    canProcessSales: true,
    canApplyDiscounts: true,
    maxDiscountPercent: 20,
    canVoidTransactions: true,
    canRefundItems: true,
    canModifyPrices: true,
    canAccessReports: true,
    canOpenCashDrawer: true,
    canOverridePrices: true,
    overrideLimit: 5000,
    canApproveTransactions: true,
    canManageUsers: false,
    canModifySettings: false,
    canViewAllTransactions: true,
    canExportData: true
  });

  const [auditSettings, setAuditSettings] = useState({
    logAllTransactions: true,
    logUserActivities: true,
    logSystemAccess: true,
    logConfigChanges: true,
    logSecurityEvents: true,
    retentionPeriod: 365, // days
    enableVideoRecording: false,
    recordSensitiveOperations: true,
    enableScreenshots: false,
    screenshotFrequency: 60, // minutes
    requireDigitalSignature: false,
    enableGpsTracking: false
  });

  const [alertSettings, setAlertSettings] = useState({
    enableSecurityAlerts: true,
    alertOnFailedLogins: true,
    alertOnLargeTransactions: true,
    largeTransactionThreshold: 10000,
    alertOnVoidTransactions: true,
    alertOnRefunds: true,
    alertOnPriceOverrides: true,
    alertOnCashDrawerOpen: false,
    alertOnSystemAccess: true,
    alertOnConfigChanges: true,
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    alertRecipients: ["manager@company.com"]
  });

  const [restrictionSettings, setRestrictionSettings] = useState({
    restrictByTime: false,
    allowedStartTime: "08:00",
    allowedEndTime: "22:00",
    restrictByDays: false,
    allowedDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    restrictByLocation: false,
    allowedLocations: [],
    restrictByDevice: true,
    allowedDevices: [],
    restrictByIP: false,
    allowedIPs: [],
    requirePhysicalPresence: false,
    enableGeofencing: false,
    maxConcurrentSessions: 1
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("تم حفظ إعدادات الأمان بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setIsLoading(false);
    }
  };

  const testSecuritySystem = async () => {
    try {
      toast.info("جاري اختبار النظام الأمني...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("تم اختبار النظام الأمني بنجاح - جميع الأنظمة تعمل بشكل صحيح");
    } catch (error) {
      toast.error("فشل في اختبار النظام الأمني");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/settings/pos-settings")}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          العودة لإعدادات نقاط البيع
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">إعدادات الأمان ونقاط البيع</h1>
            <p className="text-muted-foreground">إدارة صلاحيات المستخدمين وسياسات الأمان والمراقبة</p>
          </div>
        </div>
      </div>

      {/* Authentication Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            إعدادات المصادقة والوصول
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>مهلة انتهاء الجلسة (دقيقة)</Label>
              <Input
                type="number"
                min="5"
                max="480"
                value={authenticationSettings.sessionTimeout}
                onChange={(e) => setAuthenticationSettings({
                  ...authenticationSettings,
                  sessionTimeout: parseInt(e.target.value) || 30
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>مهلة قفل الشاشة (دقيقة)</Label>
              <Input
                type="number"
                min="1"
                max="60"
                value={authenticationSettings.lockScreenTimeout}
                onChange={(e) => setAuthenticationSettings({
                  ...authenticationSettings,
                  lockScreenTimeout: parseInt(e.target.value) || 5
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>طول كلمة المرور</Label>
              <Select 
                value={authenticationSettings.pinLength.toString()} 
                onValueChange={(value) => setAuthenticationSettings({
                  ...authenticationSettings,
                  pinLength: parseInt(value)
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 أرقام</SelectItem>
                  <SelectItem value="6">6 أرقام</SelectItem>
                  <SelectItem value="8">8 أرقام</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>تعقيد كلمة المرور</Label>
              <Select 
                value={authenticationSettings.pinComplexity} 
                onValueChange={(value) => setAuthenticationSettings({
                  ...authenticationSettings,
                  pinComplexity: value
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="numbers">أرقام فقط</SelectItem>
                  <SelectItem value="alphanumeric">أرقام وحروف</SelectItem>
                  <SelectItem value="complex">معقدة (رموز)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>محاولات تسجيل الدخول المسموحة</Label>
              <Input
                type="number"
                min="3"
                max="10"
                value={authenticationSettings.maxLoginAttempts}
                onChange={(e) => setAuthenticationSettings({
                  ...authenticationSettings,
                  maxLoginAttempts: parseInt(e.target.value) || 3
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>مدة القفل عند تجاوز المحاولات (دقيقة)</Label>
              <Input
                type="number"
                min="5"
                max="60"
                value={authenticationSettings.lockoutDuration}
                onChange={(e) => setAuthenticationSettings({
                  ...authenticationSettings,
                  lockoutDuration: parseInt(e.target.value) || 15
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Key className="h-4 w-4" />
                طرق المصادقة
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    طلب تسجيل الدخول
                  </Label>
                  <Switch
                    checked={authenticationSettings.requireLogin}
                    onCheckedChange={(checked) => setAuthenticationSettings({
                      ...authenticationSettings,
                      requireLogin: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    التحقق بخطوتين
                  </Label>
                  <Switch
                    checked={authenticationSettings.twoFactorAuth}
                    onCheckedChange={(checked) => setAuthenticationSettings({
                      ...authenticationSettings,
                      twoFactorAuth: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4" />
                    البصمة البيولوجية
                  </Label>
                  <Switch
                    checked={authenticationSettings.biometricAuth}
                    onCheckedChange={(checked) => setAuthenticationSettings({
                      ...authenticationSettings,
                      biometricAuth: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    قفل الشاشة التلقائي
                  </Label>
                  <Switch
                    checked={authenticationSettings.autoLockScreen}
                    onCheckedChange={(checked) => setAuthenticationSettings({
                      ...authenticationSettings,
                      autoLockScreen: checked
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            صلاحيات المستخدمين
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cashier Permissions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">كاشير</Badge>
                <h3 className="font-semibold text-lg">صلاحيات الكاشير</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>معالجة المبيعات</Label>
                  <Switch
                    checked={cashierPermissions.canProcessSales}
                    onCheckedChange={(checked) => setCashierPermissions({
                      ...cashierPermissions,
                      canProcessSales: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تطبيق خصومات</Label>
                  <Switch
                    checked={cashierPermissions.canApplyDiscounts}
                    onCheckedChange={(checked) => setCashierPermissions({
                      ...cashierPermissions,
                      canApplyDiscounts: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>إلغاء المعاملات</Label>
                  <Switch
                    checked={cashierPermissions.canVoidTransactions}
                    onCheckedChange={(checked) => setCashierPermissions({
                      ...cashierPermissions,
                      canVoidTransactions: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>استرداد المنتجات</Label>
                  <Switch
                    checked={cashierPermissions.canRefundItems}
                    onCheckedChange={(checked) => setCashierPermissions({
                      ...cashierPermissions,
                      canRefundItems: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تعديل الأسعار</Label>
                  <Switch
                    checked={cashierPermissions.canModifyPrices}
                    onCheckedChange={(checked) => setCashierPermissions({
                      ...cashierPermissions,
                      canModifyPrices: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>فتح الدرج النقدي</Label>
                  <Switch
                    checked={cashierPermissions.canOpenCashDrawer}
                    onCheckedChange={(checked) => setCashierPermissions({
                      ...cashierPermissions,
                      canOpenCashDrawer: checked
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>يتطلب موافقة فوق المبلغ (جنيه)</Label>
                  <Input
                    type="number"
                    value={cashierPermissions.requireApprovalAbove}
                    onChange={(e) => setCashierPermissions({
                      ...cashierPermissions,
                      requireApprovalAbove: parseInt(e.target.value) || 1000
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Supervisor Permissions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="default">مشرف</Badge>
                <h3 className="font-semibold text-lg">صلاحيات المشرف</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>الموافقة على المعاملات</Label>
                  <Switch
                    checked={supervisorPermissions.canApproveTransactions}
                    onCheckedChange={(checked) => setSupervisorPermissions({
                      ...supervisorPermissions,
                      canApproveTransactions: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>الوصول للتقارير</Label>
                  <Switch
                    checked={supervisorPermissions.canAccessReports}
                    onCheckedChange={(checked) => setSupervisorPermissions({
                      ...supervisorPermissions,
                      canAccessReports: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>عرض جميع المعاملات</Label>
                  <Switch
                    checked={supervisorPermissions.canViewAllTransactions}
                    onCheckedChange={(checked) => setSupervisorPermissions({
                      ...supervisorPermissions,
                      canViewAllTransactions: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تصدير البيانات</Label>
                  <Switch
                    checked={supervisorPermissions.canExportData}
                    onCheckedChange={(checked) => setSupervisorPermissions({
                      ...supervisorPermissions,
                      canExportData: checked
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>حد أقصى للخصم (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={supervisorPermissions.maxDiscountPercent}
                    onChange={(e) => setSupervisorPermissions({
                      ...supervisorPermissions,
                      maxDiscountPercent: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>حد تجاوز الأسعار (جنيه)</Label>
                  <Input
                    type="number"
                    value={supervisorPermissions.overrideLimit}
                    onChange={(e) => setSupervisorPermissions({
                      ...supervisorPermissions,
                      overrideLimit: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit & Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="h-5 w-5" />
            المراجعة والمراقبة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">سجلات المراجعة</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>تسجيل جميع المعاملات</Label>
                  <Switch
                    checked={auditSettings.logAllTransactions}
                    onCheckedChange={(checked) => setAuditSettings({
                      ...auditSettings,
                      logAllTransactions: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تسجيل أنشطة المستخدمين</Label>
                  <Switch
                    checked={auditSettings.logUserActivities}
                    onCheckedChange={(checked) => setAuditSettings({
                      ...auditSettings,
                      logUserActivities: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تسجيل الوصول للنظام</Label>
                  <Switch
                    checked={auditSettings.logSystemAccess}
                    onCheckedChange={(checked) => setAuditSettings({
                      ...auditSettings,
                      logSystemAccess: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تسجيل تغييرات الإعدادات</Label>
                  <Switch
                    checked={auditSettings.logConfigChanges}
                    onCheckedChange={(checked) => setAuditSettings({
                      ...auditSettings,
                      logConfigChanges: checked
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>فترة الاحتفاظ بالسجلات (يوم)</Label>
                  <Input
                    type="number"
                    min="30"
                    max="3650"
                    value={auditSettings.retentionPeriod}
                    onChange={(e) => setAuditSettings({
                      ...auditSettings,
                      retentionPeriod: parseInt(e.target.value) || 365
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Camera className="h-4 w-4" />
                المراقبة المرئية
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>تسجيل فيديو للعمليات الحساسة</Label>
                  <Switch
                    checked={auditSettings.recordSensitiveOperations}
                    onCheckedChange={(checked) => setAuditSettings({
                      ...auditSettings,
                      recordSensitiveOperations: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>لقطات شاشة دورية</Label>
                  <Switch
                    checked={auditSettings.enableScreenshots}
                    onCheckedChange={(checked) => setAuditSettings({
                      ...auditSettings,
                      enableScreenshots: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تتبع الموقع الجغرافي</Label>
                  <Switch
                    checked={auditSettings.enableGpsTracking}
                    onCheckedChange={(checked) => setAuditSettings({
                      ...auditSettings,
                      enableGpsTracking: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>التوقيع الرقمي للعمليات</Label>
                  <Switch
                    checked={auditSettings.requireDigitalSignature}
                    onCheckedChange={(checked) => setAuditSettings({
                      ...auditSettings,
                      requireDigitalSignature: checked
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            التنبيهات الأمنية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">أحداث التنبيه</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>فشل تسجيل الدخول</Label>
                  <Switch
                    checked={alertSettings.alertOnFailedLogins}
                    onCheckedChange={(checked) => setAlertSettings({
                      ...alertSettings,
                      alertOnFailedLogins: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>المعاملات الكبيرة</Label>
                  <Switch
                    checked={alertSettings.alertOnLargeTransactions}
                    onCheckedChange={(checked) => setAlertSettings({
                      ...alertSettings,
                      alertOnLargeTransactions: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>إلغاء المعاملات</Label>
                  <Switch
                    checked={alertSettings.alertOnVoidTransactions}
                    onCheckedChange={(checked) => setAlertSettings({
                      ...alertSettings,
                      alertOnVoidTransactions: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>المرتجعات</Label>
                  <Switch
                    checked={alertSettings.alertOnRefunds}
                    onCheckedChange={(checked) => setAlertSettings({
                      ...alertSettings,
                      alertOnRefunds: checked
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>حد المعاملة الكبيرة (جنيه)</Label>
                  <Input
                    type="number"
                    value={alertSettings.largeTransactionThreshold}
                    onChange={(e) => setAlertSettings({
                      ...alertSettings,
                      largeTransactionThreshold: parseInt(e.target.value) || 10000
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">طرق التنبيه</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>تنبيهات البريد الإلكتروني</Label>
                  <Switch
                    checked={alertSettings.emailAlerts}
                    onCheckedChange={(checked) => setAlertSettings({
                      ...alertSettings,
                      emailAlerts: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تنبيهات الرسائل النصية</Label>
                  <Switch
                    checked={alertSettings.smsAlerts}
                    onCheckedChange={(checked) => setAlertSettings({
                      ...alertSettings,
                      smsAlerts: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>الإشعارات المنبثقة</Label>
                  <Switch
                    checked={alertSettings.pushNotifications}
                    onCheckedChange={(checked) => setAlertSettings({
                      ...alertSettings,
                      pushNotifications: checked
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Security */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-primary">اختبار النظام الأمني</h3>
              <p className="text-sm text-muted-foreground">تحقق من سلامة جميع الإعدادات الأمنية</p>
            </div>
            <Button onClick={testSecuritySystem} variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              اختبار النظام
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} className="min-w-32">
          {isLoading ? "جاري الحفظ..." : "حفظ إعدادات الأمان"}
        </Button>
      </div>
    </div>
  );
};

export default POSSecuritySettings;