import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Bell, 
  ChevronLeft,
  Mail,
  MessageSquare,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Users,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NotificationRule {
  id: string;
  name: string;
  type: "transaction" | "inventory" | "system" | "security";
  trigger: string;
  threshold?: number;
  isActive: boolean;
  channels: string[];
  recipients: string[];
}

const POSNotificationsSettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [emailSettings, setEmailSettings] = useState({
    enableEmail: true,
    smtpServer: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "notifications@company.com",
    smtpPassword: "",
    useSSL: true,
    fromName: "نظام رغوة",
    fromEmail: "notifications@raghwa.com",
    testEmail: "manager@company.com"
  });

  const [smsSettings, setSmsSettings] = useState({
    enableSMS: false,
    provider: "twillio", // twillio, nexmo, local
    apiKey: "",
    apiSecret: "",
    fromNumber: "+966501234567",
    testNumber: "+966501234567"
  });

  const [systemNotifications, setSystemNotifications] = useState({
    enableInApp: true,
    enableSound: true,
    enablePopups: true,
    autoHideDelay: 5, // seconds
    maxNotifications: 50,
    priorityLevels: true,
    groupSimilar: true,
    markReadAuto: true,
    persistCritical: true
  });

  const [alertSettings, setAlertSettings] = useState({
    lowStockAlert: true,
    lowStockThreshold: 10,
    highValueTransactionAlert: true,
    highValueThreshold: 5000,
    failedLoginAlert: true,
    voidTransactionAlert: true,
    refundAlert: true,
    cashDrawerAlert: false,
    endOfShiftAlert: true,
    dailyReportAlert: true,
    systemErrorAlert: true,
    backupAlert: true
  });

  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([
    {
      id: "1",
      name: "تنبيه المخزون المنخفض",
      type: "inventory",
      trigger: "low_stock",
      threshold: 10,
      isActive: true,
      channels: ["email", "inapp"],
      recipients: ["manager@company.com", "inventory@company.com"]
    },
    {
      id: "2",
      name: "معاملة عالية القيمة",
      type: "transaction",
      trigger: "high_value_transaction",
      threshold: 5000,
      isActive: true,
      channels: ["email", "sms", "inapp"],
      recipients: ["manager@company.com"]
    },
    {
      id: "3",
      name: "فشل تسجيل الدخول",
      type: "security",
      trigger: "failed_login",
      threshold: 3,
      isActive: true,
      channels: ["email", "inapp"],
      recipients: ["security@company.com"]
    },
    {
      id: "4",
      name: "نهاية الوردية",
      type: "system",
      trigger: "shift_end",
      isActive: false,
      channels: ["email"],
      recipients: ["manager@company.com"]
    }
  ]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("تم حفظ إعدادات الإشعارات بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setIsLoading(false);
    }
  };

  const testEmailConnection = async () => {
    try {
      toast.info("جاري اختبار اتصال البريد الإلكتروني...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("تم اختبار البريد الإلكتروني بنجاح");
    } catch (error) {
      toast.error("فشل في اختبار البريد الإلكتروني");
    }
  };

  const testSMSConnection = async () => {
    try {
      toast.info("جاري اختبار اتصال الرسائل النصية...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("تم اختبار الرسائل النصية بنجاح");
    } catch (error) {
      toast.error("فشل في اختبار الرسائل النصية");
    }
  };

  const toggleNotificationRule = (ruleId: string) => {
    setNotificationRules(rules =>
      rules.map(rule =>
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
    toast.success("تم تحديث قاعدة الإشعارات");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "transaction": return <DollarSign className="h-4 w-4" />;
      case "inventory": return <Package className="h-4 w-4" />;
      case "system": return <Activity className="h-4 w-4" />;
      case "security": return <AlertTriangle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "transaction": return "معاملات";
      case "inventory": return "مخزون";
      case "system": return "نظام";
      case "security": return "أمان";
      default: return type;
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
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">إعدادات الإشعارات</h1>
            <p className="text-muted-foreground">إدارة تنبيهات العمليات والمراقبة والتحكم</p>
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            إعدادات البريد الإلكتروني
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>خادم SMTP</Label>
              <Input
                value={emailSettings.smtpServer}
                onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
                placeholder="smtp.gmail.com"
              />
            </div>

            <div className="space-y-2">
              <Label>منفذ SMTP</Label>
              <Input
                type="number"
                value={emailSettings.smtpPort}
                onChange={(e) => setEmailSettings({...emailSettings, smtpPort: parseInt(e.target.value) || 587})}
              />
            </div>

            <div className="space-y-2">
              <Label>اسم المستخدم</Label>
              <Input
                value={emailSettings.smtpUsername}
                onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                placeholder="notifications@company.com"
              />
            </div>

            <div className="space-y-2">
              <Label>كلمة المرور</Label>
              <Input
                type="password"
                value={emailSettings.smtpPassword}
                onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label>اسم المرسل</Label>
              <Input
                value={emailSettings.fromName}
                onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>بريد المرسل</Label>
              <Input
                type="email"
                value={emailSettings.fromEmail}
                onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>تفعيل البريد الإلكتروني</Label>
                <Switch
                  checked={emailSettings.enableEmail}
                  onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableEmail: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>استخدام SSL</Label>
                <Switch
                  checked={emailSettings.useSSL}
                  onCheckedChange={(checked) => setEmailSettings({...emailSettings, useSSL: checked})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label>بريد الاختبار</Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={emailSettings.testEmail}
                    onChange={(e) => setEmailSettings({...emailSettings, testEmail: e.target.value})}
                    placeholder="test@company.com"
                  />
                  <Button onClick={testEmailConnection} variant="outline">
                    اختبار
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMS Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            إعدادات الرسائل النصية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>مقدم الخدمة</Label>
              <Select value={smsSettings.provider} onValueChange={(value) => setSmsSettings({...smsSettings, provider: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twillio">Twilio</SelectItem>
                  <SelectItem value="nexmo">Nexmo</SelectItem>
                  <SelectItem value="local">مقدم محلي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>مفتاح API</Label>
              <Input
                value={smsSettings.apiKey}
                onChange={(e) => setSmsSettings({...smsSettings, apiKey: e.target.value})}
                placeholder="API Key"
              />
            </div>

            <div className="space-y-2">
              <Label>سر API</Label>
              <Input
                type="password"
                value={smsSettings.apiSecret}
                onChange={(e) => setSmsSettings({...smsSettings, apiSecret: e.target.value})}
                placeholder="API Secret"
              />
            </div>

            <div className="space-y-2">
              <Label>رقم المرسل</Label>
              <Input
                value={smsSettings.fromNumber}
                onChange={(e) => setSmsSettings({...smsSettings, fromNumber: e.target.value})}
                placeholder="+966501234567"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>تفعيل الرسائل النصية</Label>
                <Switch
                  checked={smsSettings.enableSMS}
                  onCheckedChange={(checked) => setSmsSettings({...smsSettings, enableSMS: checked})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label>رقم الاختبار</Label>
                <div className="flex gap-2">
                  <Input
                    value={smsSettings.testNumber}
                    onChange={(e) => setSmsSettings({...smsSettings, testNumber: e.target.value})}
                    placeholder="+966501234567"
                  />
                  <Button onClick={testSMSConnection} variant="outline">
                    اختبار
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            إشعارات النظام
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>مدة إخفاء الإشعار التلقائي (ثانية)</Label>
              <Input
                type="number"
                min="1"
                max="30"
                value={systemNotifications.autoHideDelay}
                onChange={(e) => setSystemNotifications({
                  ...systemNotifications,
                  autoHideDelay: parseInt(e.target.value) || 5
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>حد أقصى للإشعارات</Label>
              <Input
                type="number"
                min="10"
                max="200"
                value={systemNotifications.maxNotifications}
                onChange={(e) => setSystemNotifications({
                  ...systemNotifications,
                  maxNotifications: parseInt(e.target.value) || 50
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">خيارات العرض</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>إشعارات داخل التطبيق</Label>
                  <Switch
                    checked={systemNotifications.enableInApp}
                    onCheckedChange={(checked) => setSystemNotifications({
                      ...systemNotifications,
                      enableInApp: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>الأصوات</Label>
                  <Switch
                    checked={systemNotifications.enableSound}
                    onCheckedChange={(checked) => setSystemNotifications({
                      ...systemNotifications,
                      enableSound: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>النوافذ المنبثقة</Label>
                  <Switch
                    checked={systemNotifications.enablePopups}
                    onCheckedChange={(checked) => setSystemNotifications({
                      ...systemNotifications,
                      enablePopups: checked
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">سلوك الإشعارات</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>مستويات الأولوية</Label>
                  <Switch
                    checked={systemNotifications.priorityLevels}
                    onCheckedChange={(checked) => setSystemNotifications({
                      ...systemNotifications,
                      priorityLevels: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تجميع الإشعارات المتشابهة</Label>
                  <Switch
                    checked={systemNotifications.groupSimilar}
                    onCheckedChange={(checked) => setSystemNotifications({
                      ...systemNotifications,
                      groupSimilar: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>وضع علامة مقروء تلقائياً</Label>
                  <Switch
                    checked={systemNotifications.markReadAuto}
                    onCheckedChange={(checked) => setSystemNotifications({
                      ...systemNotifications,
                      markReadAuto: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>الاحتفاظ بالإشعارات الحرجة</Label>
                  <Switch
                    checked={systemNotifications.persistCritical}
                    onCheckedChange={(checked) => setSystemNotifications({
                      ...systemNotifications,
                      persistCritical: checked
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            قواعد الإشعارات ({notificationRules.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notificationRules.map((rule) => (
              <Card key={rule.id} className={`border-2 ${rule.isActive ? 'border-primary/20 bg-primary/5' : 'border-muted bg-muted/20'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${rule.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {getTypeIcon(rule.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{rule.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(rule.type)}
                          </Badge>
                          {rule.threshold && (
                            <span className="text-xs text-muted-foreground">
                              حد التنبيه: {rule.threshold}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={rule.isActive ? "default" : "secondary"}>
                        {rule.isActive ? "نشط" : "غير نشط"}
                      </Badge>
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={() => toggleNotificationRule(rule.id)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">قنوات الإشعار:</div>
                      <div className="flex gap-1">
                        {rule.channels.map((channel) => (
                          <Badge key={channel} variant="outline" className="text-xs">
                            {channel === 'email' ? 'بريد' : channel === 'sms' ? 'رسائل' : 'داخلي'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">المستلمون:</div>
                      <div className="text-xs">{rule.recipients.length} مستلم</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Alert Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            إعدادات التنبيهات السريعة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">تنبيهات المخزون</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>تنبيه المخزون المنخفض</Label>
                  <Switch
                    checked={alertSettings.lowStockAlert}
                    onCheckedChange={(checked) => setAlertSettings({
                      ...alertSettings,
                      lowStockAlert: checked
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>حد المخزون المنخفض</Label>
                  <Input
                    type="number"
                    min="1"
                    value={alertSettings.lowStockThreshold}
                    onChange={(e) => setAlertSettings({
                      ...alertSettings,
                      lowStockThreshold: parseInt(e.target.value) || 10
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">تنبيهات المعاملات</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>المعاملات عالية القيمة</Label>
                  <Switch
                    checked={alertSettings.highValueTransactionAlert}
                    onCheckedChange={(checked) => setAlertSettings({
                      ...alertSettings,
                      highValueTransactionAlert: checked
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>حد القيمة العالية (جنيه)</Label>
                  <Input
                    type="number"
                    value={alertSettings.highValueThreshold}
                    onChange={(e) => setAlertSettings({
                      ...alertSettings,
                      highValueThreshold: parseInt(e.target.value) || 5000
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تنبيه إلغاء المعاملات</Label>
                  <Switch
                    checked={alertSettings.voidTransactionAlert}
                    onCheckedChange={(checked) => setAlertSettings({
                      ...alertSettings,
                      voidTransactionAlert: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تنبيه المرتجعات</Label>
                  <Switch
                    checked={alertSettings.refundAlert}
                    onCheckedChange={(checked) => setAlertSettings({
                      ...alertSettings,
                      refundAlert: checked
                    })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">تنبيهات الأمان</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>فشل تسجيل الدخول</Label>
                  <Switch
                    checked={alertSettings.failedLoginAlert}
                    onCheckedChange={(checked) => setAlertSettings({
                      ...alertSettings,
                      failedLoginAlert: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>فتح الدرج النقدي</Label>
                  <Switch
                    checked={alertSettings.cashDrawerAlert}
                    onCheckedChange={(checked) => setAlertSettings({
                      ...alertSettings,
                      cashDrawerAlert: checked
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">تنبيهات النظام</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>نهاية الوردية</Label>
                  <Switch
                    checked={alertSettings.endOfShiftAlert}
                    onCheckedChange={(checked) => setAlertSettings({
                      ...alertSettings,
                      endOfShiftAlert: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>التقرير اليومي</Label>
                  <Switch
                    checked={alertSettings.dailyReportAlert}
                    onCheckedChange={(checked) => setAlertSettings({
                      ...alertSettings,
                      dailyReportAlert: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>أخطاء النظام</Label>
                  <Switch
                    checked={alertSettings.systemErrorAlert}
                    onCheckedChange={(checked) => setAlertSettings({
                      ...alertSettings,
                      systemErrorAlert: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>النسخ الاحتياطي</Label>
                  <Switch
                    checked={alertSettings.backupAlert}
                    onCheckedChange={(checked) => setAlertSettings({
                      ...alertSettings,
                      backupAlert: checked
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} className="min-w-32">
          {isLoading ? "جاري الحفظ..." : "حفظ إعدادات الإشعارات"}
        </Button>
      </div>
    </div>
  );
};

export default POSNotificationsSettings;