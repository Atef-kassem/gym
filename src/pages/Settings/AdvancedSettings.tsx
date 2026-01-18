import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Database, 
  Download, 
  Upload, 
  Clock, 
  Shield, 
  Settings,
  Bell,
  Lock,
  Timer,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  HardDrive,
  Cloud,
  Key,
  User,
  Mail
} from 'lucide-react';

interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: string;
  backupTime: string;
  storageLocation: string;
  retentionDays: number;
  encryption: boolean;
  compression: boolean;
}

interface NotificationSettings {
  systemUpdates: boolean;
  backupNotifications: boolean;
  securityAlerts: boolean;
  performanceAlerts: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  inAppNotifications: boolean;
}

interface SecurityPolicies {
  passwordMinLength: number;
  passwordComplexity: boolean;
  passwordExpiry: number;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  twoFactorAuth: boolean;
  ipWhitelist: boolean;
}

export default function AdvancedSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [backupSettings, setBackupSettings] = useState<BackupSettings>({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    storageLocation: 'cloud',
    retentionDays: 30,
    encryption: true,
    compression: true
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    systemUpdates: true,
    backupNotifications: true,
    securityAlerts: true,
    performanceAlerts: false,
    emailNotifications: true,
    smsNotifications: false,
    inAppNotifications: true
  });

  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicies>({
    passwordMinLength: 8,
    passwordComplexity: true,
    passwordExpiry: 90,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorAuth: false,
    ipWhitelist: false
  });

  const handleBackupNow = async () => {
    setIsLoading(true);
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast({
        title: "تم إنشاء النسخة الاحتياطية بنجاح",
        description: "تم حفظ النسخة الاحتياطية في الموقع المحدد",
      });
    } catch (error) {
      toast({
        title: "خطأ في إنشاء النسخة الاحتياطية",
        description: "حدث خطأ أثناء إنشاء النسخة الاحتياطية",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "تم استعادة البيانات بنجاح",
        description: "تم استعادة البيانات من النسخة الاحتياطية المحددة",
      });
    } catch (error) {
      toast({
        title: "خطأ في استعادة البيانات",
        description: "حدث خطأ أثناء استعادة البيانات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "تم حفظ الإعدادات بنجاح",
        description: "تم تطبيق جميع التغييرات على النظام",
      });
    } catch (error) {
      toast({
        title: "خطأ في حفظ الإعدادات",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">الإعدادات المتقدمة</h1>
          <p className="text-muted-foreground">إدارة النسخ الاحتياطية والسياسات الأمنية وإعدادات النظام</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={isLoading} className="gap-2">
          <Settings className="h-4 w-4" />
          حفظ جميع الإعدادات
        </Button>
      </div>

      <Tabs defaultValue="backup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="backup" className="gap-2">
            <Database className="h-4 w-4" />
            النسخ الاحتياطية
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            الإشعارات
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            السياسات الأمنية
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Settings className="h-4 w-4" />
            إعدادات النظام
          </TabsTrigger>
        </TabsList>

        {/* النسخ الاحتياطية */}
        <TabsContent value="backup" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* إعدادات النسخ الاحتياطي */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  إعدادات النسخ الاحتياطي
                </CardTitle>
                <CardDescription>
                  تكوين النسخ الاحتياطي التلقائي والإعدادات المتعلقة به
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-backup">النسخ الاحتياطي التلقائي</Label>
                  <Switch
                    id="auto-backup"
                    checked={backupSettings.autoBackup}
                    onCheckedChange={(checked) => 
                      setBackupSettings(prev => ({ ...prev, autoBackup: checked }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>تكرار النسخ الاحتياطي</Label>
                  <Select
                    value={backupSettings.backupFrequency}
                    onValueChange={(value) => 
                      setBackupSettings(prev => ({ ...prev, backupFrequency: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">كل ساعة</SelectItem>
                      <SelectItem value="daily">يومياً</SelectItem>
                      <SelectItem value="weekly">أسبوعياً</SelectItem>
                      <SelectItem value="monthly">شهرياً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>وقت النسخ الاحتياطي</Label>
                  <Input
                    type="time"
                    value={backupSettings.backupTime}
                    onChange={(e) => 
                      setBackupSettings(prev => ({ ...prev, backupTime: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>مكان التخزين</Label>
                  <Select
                    value={backupSettings.storageLocation}
                    onValueChange={(value) => 
                      setBackupSettings(prev => ({ ...prev, storageLocation: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">
                        <div className="flex items-center gap-2">
                          <HardDrive className="h-4 w-4" />
                          محلياً
                        </div>
                      </SelectItem>
                      <SelectItem value="cloud">
                        <div className="flex items-center gap-2">
                          <Cloud className="h-4 w-4" />
                          السحابة
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>مدة الاحتفاظ (بالأيام)</Label>
                  <Input
                    type="number"
                    value={backupSettings.retentionDays}
                    onChange={(e) => 
                      setBackupSettings(prev => ({ ...prev, retentionDays: parseInt(e.target.value) }))
                    }
                    min="1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>تشفير النسخ الاحتياطية</Label>
                  <Switch
                    checked={backupSettings.encryption}
                    onCheckedChange={(checked) => 
                      setBackupSettings(prev => ({ ...prev, encryption: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>ضغط البيانات</Label>
                  <Switch
                    checked={backupSettings.compression}
                    onCheckedChange={(checked) => 
                      setBackupSettings(prev => ({ ...prev, compression: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* العمليات */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  عمليات النسخ الاحتياطي
                </CardTitle>
                <CardDescription>
                  إنشاء واستعادة النسخ الاحتياطية يدوياً
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Button 
                    onClick={handleBackupNow} 
                    disabled={isLoading}
                    className="w-full gap-2"
                  >
                    <Download className="h-4 w-4" />
                    إنشاء نسخة احتياطية الآن
                  </Button>

                  <Separator />

                  <div className="space-y-2">
                    <Label>استعادة من نسخة احتياطية</Label>
                    <div className="flex gap-2">
                      <Input placeholder="اختر ملف النسخة الاحتياطية" readOnly />
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button 
                    onClick={handleRestoreData}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    استعادة البيانات
                  </Button>
                </div>

                <Separator />

                {/* آخر النسخ الاحتياطية */}
                <div className="space-y-3">
                  <h4 className="font-medium">آخر النسخ الاحتياطية</h4>
                  <div className="space-y-2">
                    {[
                      { date: '2024-01-15 02:00', size: '2.5 GB', status: 'مكتملة' },
                      { date: '2024-01-14 02:00', size: '2.4 GB', status: 'مكتملة' },
                      { date: '2024-01-13 02:00', size: '2.3 GB', status: 'فشلت' },
                    ].map((backup, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="text-sm">
                          <div className="font-medium">{backup.date}</div>
                          <div className="text-muted-foreground">{backup.size}</div>
                        </div>
                        <Badge variant={backup.status === 'مكتملة' ? 'default' : 'destructive'}>
                          {backup.status === 'مكتملة' ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                          {backup.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* الإشعارات */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  إعدادات الإشعارات
                </CardTitle>
                <CardDescription>
                  تحديد أنواع الإشعارات المطلوب تلقيها
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>إشعارات تحديثات النظام</Label>
                  <Switch
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, systemUpdates: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>إشعارات النسخ الاحتياطية</Label>
                  <Switch
                    checked={notificationSettings.backupNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, backupNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>تنبيهات الأمان</Label>
                  <Switch
                    checked={notificationSettings.securityAlerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, securityAlerts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>تنبيهات الأداء</Label>
                  <Switch
                    checked={notificationSettings.performanceAlerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, performanceAlerts: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  طرق الإشعارات
                </CardTitle>
                <CardDescription>
                  اختيار وسائل استلام الإشعارات
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>البريد الإلكتروني</Label>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>الرسائل النصية</Label>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>الإشعارات داخل التطبيق</Label>
                  <Switch
                    checked={notificationSettings.inAppNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, inAppNotifications: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* السياسات الأمنية */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  سياسة كلمات المرور
                </CardTitle>
                <CardDescription>
                  تحديد متطلبات وقواعد كلمات المرور
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>الحد الأدنى لطول كلمة المرور</Label>
                  <Input
                    type="number"
                    value={securityPolicies.passwordMinLength}
                    onChange={(e) => 
                      setSecurityPolicies(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))
                    }
                    min="6"
                    max="20"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>تعقيد كلمة المرور</Label>
                  <Switch
                    checked={securityPolicies.passwordComplexity}
                    onCheckedChange={(checked) => 
                      setSecurityPolicies(prev => ({ ...prev, passwordComplexity: checked }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>انتهاء صلاحية كلمة المرور (بالأيام)</Label>
                  <Input
                    type="number"
                    value={securityPolicies.passwordExpiry}
                    onChange={(e) => 
                      setSecurityPolicies(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))
                    }
                    min="30"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>المصادقة الثنائية</Label>
                  <Switch
                    checked={securityPolicies.twoFactorAuth}
                    onCheckedChange={(checked) => 
                      setSecurityPolicies(prev => ({ ...prev, twoFactorAuth: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  سياسة الجلسات والأمان
                </CardTitle>
                <CardDescription>
                  إعدادات الجلسات ومحاولات تسجيل الدخول
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>مهلة انتهاء الجلسة (بالدقائق)</Label>
                  <Input
                    type="number"
                    value={securityPolicies.sessionTimeout}
                    onChange={(e) => 
                      setSecurityPolicies(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))
                    }
                    min="5"
                  />
                </div>

                <div className="space-y-2">
                  <Label>الحد الأقصى لمحاولات تسجيل الدخول</Label>
                  <Input
                    type="number"
                    value={securityPolicies.maxLoginAttempts}
                    onChange={(e) => 
                      setSecurityPolicies(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))
                    }
                    min="3"
                    max="10"
                  />
                </div>

                <div className="space-y-2">
                  <Label>مدة الحظر (بالدقائق)</Label>
                  <Input
                    type="number"
                    value={securityPolicies.lockoutDuration}
                    onChange={(e) => 
                      setSecurityPolicies(prev => ({ ...prev, lockoutDuration: parseInt(e.target.value) }))
                    }
                    min="5"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>قائمة IP المسموحة</Label>
                  <Switch
                    checked={securityPolicies.ipWhitelist}
                    onCheckedChange={(checked) => 
                      setSecurityPolicies(prev => ({ ...prev, ipWhitelist: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* إعدادات النظام */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  التحديثات التلقائية
                </CardTitle>
                <CardDescription>
                  إعدادات تحديث النظام والتطبيقات
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>التحديثات التلقائية</Label>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>وقت فحص التحديثات</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">كل ساعة</SelectItem>
                      <SelectItem value="daily">يومياً</SelectItem>
                      <SelectItem value="weekly">أسبوعياً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>تحديثات الأمان التلقائية</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label>إعادة تشغيل تلقائية بعد التحديث</Label>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  صيانة النظام
                </CardTitle>
                <CardDescription>
                  مهام الصيانة والتنظيف الدورية
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>تنظيف الملفات المؤقتة</Label>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>تكرار التنظيف</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">يومياً</SelectItem>
                      <SelectItem value="weekly">أسبوعياً</SelectItem>
                      <SelectItem value="monthly">شهرياً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>ضغط قاعدة البيانات</Label>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <Label>تحسين الأداء التلقائي</Label>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}