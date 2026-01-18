import { useState } from 'react';
import { Lock, Shield, Bell, Globe, Eye, EyeOff, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const UserSettings = () => {
  const { toast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    systemAlerts: true,
    inventoryAlerts: true,
    reportAlerts: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30',
    language: 'ar',
    timezone: 'Asia/Riyadh'
  });

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (setting: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSecurityChange = (setting: string, value: string | boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: "خطأ", description: "كلمة المرور الجديدة غير متطابقة", variant: "destructive" });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast({ title: "خطأ", description: "كلمة المرور يجب أن تكون على الأقل 6 أحرف", variant: "destructive" });
      return;
    }

    toast({ title: "نجح", description: "تم تغيير كلمة المرور بنجاح" });
    
    // مسح الحقول
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleSaveSettings = () => {
    toast({ title: "حفظ الإعدادات", description: "تم حفظ الإعدادات بنجاح" });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">إعدادات المستخدم</h1>
        <Button onClick={handleSaveSettings} className="gap-2">
          <Save className="w-4 h-4" />
          حفظ الإعدادات
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* تغيير كلمة المرور */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              تغيير كلمة المرور
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button onClick={handleChangePassword} className="w-full gap-2">
              <RefreshCw className="w-4 h-4" />
              تغيير كلمة المرور
            </Button>
          </CardContent>
        </Card>

        {/* إعدادات الأمان */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              إعدادات الأمان
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>المصادقة الثنائية</Label>
                <p className="text-sm text-muted-foreground">تفعيل طبقة أمان إضافية</p>
              </div>
              <Switch
                checked={securitySettings.twoFactorAuth}
                onCheckedChange={(value) => handleSecurityChange('twoFactorAuth', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>تنبيهات تسجيل الدخول</Label>
                <p className="text-sm text-muted-foreground">إشعار عند تسجيل الدخول من جهاز جديد</p>
              </div>
              <Switch
                checked={securitySettings.loginAlerts}
                onCheckedChange={(value) => handleSecurityChange('loginAlerts', value)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>انتهاء الجلسة (بالدقائق)</Label>
              <Select value={securitySettings.sessionTimeout} onValueChange={(value) => handleSecurityChange('sessionTimeout', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 دقيقة</SelectItem>
                  <SelectItem value="30">30 دقيقة</SelectItem>
                  <SelectItem value="60">60 دقيقة</SelectItem>
                  <SelectItem value="120">ساعتان</SelectItem>
                  <SelectItem value="480">8 ساعات</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* إعدادات الإشعارات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              إعدادات الإشعارات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>إشعارات البريد الإلكتروني</Label>
                <p className="text-sm text-muted-foreground">استقبال الإشعارات عبر البريد</p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(value) => handleNotificationChange('emailNotifications', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>الإشعارات الفورية</Label>
                <p className="text-sm text-muted-foreground">إشعارات في المتصفح</p>
              </div>
              <Switch
                checked={notificationSettings.pushNotifications}
                onCheckedChange={(value) => handleNotificationChange('pushNotifications', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>رسائل SMS</Label>
                <p className="text-sm text-muted-foreground">استقبال رسائل نصية</p>
              </div>
              <Switch
                checked={notificationSettings.smsNotifications}
                onCheckedChange={(value) => handleNotificationChange('smsNotifications', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>تنبيهات النظام</Label>
                <p className="text-sm text-muted-foreground">إشعارات حالة النظام</p>
              </div>
              <Switch
                checked={notificationSettings.systemAlerts}
                onCheckedChange={(value) => handleNotificationChange('systemAlerts', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>تنبيهات المخزون</Label>
                <p className="text-sm text-muted-foreground">إشعارات نقص المخزون</p>
              </div>
              <Switch
                checked={notificationSettings.inventoryAlerts}
                onCheckedChange={(value) => handleNotificationChange('inventoryAlerts', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* إعدادات عامة */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              إعدادات عامة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>اللغة</Label>
              <Select value={securitySettings.language} onValueChange={(value) => handleSecurityChange('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>المنطقة الزمنية</Label>
              <Select value={securitySettings.timezone} onValueChange={(value) => handleSecurityChange('timezone', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Riyadh">الرياض (GMT+3)</SelectItem>
                  <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                  <SelectItem value="Asia/Kuwait">الكويت (GMT+3)</SelectItem>
                  <SelectItem value="UTC">التوقيت العالمي (UTC)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserSettings;