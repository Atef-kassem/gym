import { useState } from "react";
import { 
  Settings, 
  Bell, 
  Palette, 
  Database, 
  Shield, 
  Globe, 
  Monitor,
  Smartphone,
  User,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Languages,
  Clock,
  Calendar,
  BarChart3,
  Zap,
  CheckCircle2,
  X
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface AdvancedSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvancedSettingsDialog({ open, onOpenChange }: AdvancedSettingsDialogProps) {
  const { toast } = useToast();
  
  // Settings State
  const [settings, setSettings] = useState({
    // النظام العام
    theme: "light",
    language: "ar",
    autoRefresh: true,
    refreshInterval: 30,
    
    // الإشعارات
    notifications: {
      enabled: true,
      sound: true,
      email: true,
      sms: false,
      browser: true,
      volume: 80
    },
    
    // العرض والواجهة
    display: {
      animations: true,
      compactMode: false,
      showTooltips: true,
      sidebarExpanded: true,
      fontSize: "medium",
      colorMode: "auto"
    },
    
    // الأمان والخصوصية
    security: {
      autoLogout: true,
      logoutTimer: 30,
      twoFactor: false,
      activityLog: true,
      dataEncryption: true
    },
    
    // التحليلات والتقارير
    analytics: {
      realTimeUpdates: true,
      dataRetention: 90,
      exportFormat: "excel",
      autoBackup: true,
      backupFrequency: "daily"
    },
    
    // الذكاء الاصطناعي
    ai: {
      enabled: true,
      autoInsights: true,
      predictiveAnalysis: true,
      smartNotifications: true,
      learningMode: "adaptive"
    }
  });

  const handleSettingChange = (category: string, key: string, value: any) => {
    if (category === '') {
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...(prev[category as keyof typeof prev] as object),
          [key]: value
        }
      }));
    }
  };

  const handleSaveSettings = () => {
    // حفظ الإعدادات في localStorage أو إرسالها للخادم
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ جميع الإعدادات بنجاح",
      className: "toast-success"
    });
  };

  const handleResetSettings = () => {
    // إعادة تعيين الإعدادات للقيم الافتراضية
    toast({
      title: "تم إعادة تعيين الإعدادات",
      description: "تم استعادة الإعدادات الافتراضية",
      className: "toast-warning"
    });
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'system-settings.json';
    link.click();
    
    toast({
      title: "تم تصدير الإعدادات",
      description: "تم تنزيل ملف الإعدادات",
      className: "toast-success"
    });
  };

  const themes = [
    { value: "light", label: "فاتح", icon: Sun },
    { value: "dark", label: "داكن", icon: Moon },
    { value: "auto", label: "تلقائي", icon: Monitor }
  ];

  const languages = [
    { value: "ar", label: "العربية", flag: "🇸🇦" },
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "fr", label: "Français", flag: "🇫🇷" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Settings className="h-6 w-6 text-primary animate-spin" />
            إعدادات النظام المتقدمة
          </DialogTitle>
          <DialogDescription>
            تخصيص وضبط إعدادات النظام حسب احتياجاتك
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 glass-effect">
            <TabsTrigger value="general" className="interactive-button">
              <Settings className="h-4 w-4 mr-2" />
              عام
            </TabsTrigger>
            <TabsTrigger value="notifications" className="interactive-button">
              <Bell className="h-4 w-4 mr-2" />
              الإشعارات
            </TabsTrigger>
            <TabsTrigger value="display" className="interactive-button">
              <Palette className="h-4 w-4 mr-2" />
              العرض
            </TabsTrigger>
            <TabsTrigger value="security" className="interactive-button">
              <Shield className="h-4 w-4 mr-2" />
              الأمان
            </TabsTrigger>
            <TabsTrigger value="analytics" className="interactive-button">
              <BarChart3 className="h-4 w-4 mr-2" />
              التحليلات
            </TabsTrigger>
            <TabsTrigger value="ai" className="interactive-button">
              <Zap className="h-4 w-4 mr-2" />
              الذكاء الاصطناعي
            </TabsTrigger>
          </TabsList>

          {/* الإعدادات العامة */}
          <TabsContent value="general" className="space-y-4 animate-fade-in">
            <Card className="interactive-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  إعدادات عامة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>المظهر</Label>
                    <Select value={settings.theme} onValueChange={(value) => handleSettingChange('', 'theme', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {themes.map((theme) => (
                          <SelectItem key={theme.value} value={theme.value}>
                            <div className="flex items-center gap-2">
                              <theme.icon className="h-4 w-4" />
                              {theme.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>اللغة</Label>
                    <Select value={settings.language} onValueChange={(value) => handleSettingChange('', 'language', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            <div className="flex items-center gap-2">
                              <span>{lang.flag}</span>
                              {lang.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>التحديث التلقائي</Label>
                    <p className="text-sm text-muted-foreground">تحديث البيانات تلقائياً</p>
                  </div>
                  <Switch 
                    checked={settings.autoRefresh}
                    onCheckedChange={(checked) => handleSettingChange('', 'autoRefresh', checked)}
                  />
                </div>

                {settings.autoRefresh && (
                  <div className="space-y-2">
                    <Label>فترة التحديث (ثانية): {settings.refreshInterval}</Label>
                    <Slider
                      value={[settings.refreshInterval]}
                      onValueChange={([value]) => handleSettingChange('', 'refreshInterval', value)}
                      max={300}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* إعدادات الإشعارات */}
          <TabsContent value="notifications" className="space-y-4 animate-fade-in">
            <Card className="interactive-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-yellow-500" />
                  إعدادات الإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>تفعيل الإشعارات</Label>
                    <p className="text-sm text-muted-foreground">تلقي إشعارات النظام</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.enabled}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'enabled', checked)}
                  />
                </div>

                {settings.notifications.enabled && (
                  <>
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>الصوت</Label>
                        <Switch 
                          checked={settings.notifications.sound}
                          onCheckedChange={(checked) => handleSettingChange('notifications', 'sound', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>البريد الإلكتروني</Label>
                        <Switch 
                          checked={settings.notifications.email}
                          onCheckedChange={(checked) => handleSettingChange('notifications', 'email', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>الرسائل النصية</Label>
                        <Switch 
                          checked={settings.notifications.sms}
                          onCheckedChange={(checked) => handleSettingChange('notifications', 'sms', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>المتصفح</Label>
                        <Switch 
                          checked={settings.notifications.browser}
                          onCheckedChange={(checked) => handleSettingChange('notifications', 'browser', checked)}
                        />
                      </div>
                    </div>

                    {settings.notifications.sound && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <Label>مستوى الصوت: {settings.notifications.volume}%</Label>
                          <Slider
                            value={[settings.notifications.volume]}
                            onValueChange={([value]) => handleSettingChange('notifications', 'volume', value)}
                            max={100}
                            min={0}
                            step={5}
                            className="w-full"
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* إعدادات العرض */}
          <TabsContent value="display" className="space-y-4 animate-fade-in">
            <Card className="interactive-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-500" />
                  إعدادات العرض والواجهة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <Label>الحركات والتأثيرات</Label>
                    <Switch 
                      checked={settings.display.animations}
                      onCheckedChange={(checked) => handleSettingChange('display', 'animations', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>الوضع المضغوط</Label>
                    <Switch 
                      checked={settings.display.compactMode}
                      onCheckedChange={(checked) => handleSettingChange('display', 'compactMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>إظهار التلميحات</Label>
                    <Switch 
                      checked={settings.display.showTooltips}
                      onCheckedChange={(checked) => handleSettingChange('display', 'showTooltips', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>توسيع الشريط الجانبي</Label>
                    <Switch 
                      checked={settings.display.sidebarExpanded}
                      onCheckedChange={(checked) => handleSettingChange('display', 'sidebarExpanded', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>حجم الخط</Label>
                  <Select value={settings.display.fontSize} onValueChange={(value) => handleSettingChange('display', 'fontSize', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">صغير</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="large">كبير</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* باقي التبويبات بنفس الطريقة... */}
          <TabsContent value="security" className="space-y-4 animate-fade-in">
            <Card className="interactive-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  إعدادات الأمان والخصوصية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>تسجيل الخروج التلقائي</Label>
                    <p className="text-sm text-muted-foreground">تسجيل خروج تلقائي عند عدم النشاط</p>
                  </div>
                  <Switch 
                    checked={settings.security.autoLogout}
                    onCheckedChange={(checked) => handleSettingChange('security', 'autoLogout', checked)}
                  />
                </div>

                {settings.security.autoLogout && (
                  <div className="space-y-2">
                    <Label>مؤقت تسجيل الخروج (دقيقة): {settings.security.logoutTimer}</Label>
                    <Slider
                      value={[settings.security.logoutTimer]}
                      onValueChange={([value]) => handleSettingChange('security', 'logoutTimer', value)}
                      max={120}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label>المصادقة الثنائية</Label>
                  <Switch 
                    checked={settings.security.twoFactor}
                    onCheckedChange={(checked) => handleSettingChange('security', 'twoFactor', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>سجل النشاط</Label>
                  <Switch 
                    checked={settings.security.activityLog}
                    onCheckedChange={(checked) => handleSettingChange('security', 'activityLog', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 animate-fade-in">
            <Card className="interactive-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  إعدادات التحليلات والتقارير
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label>التحديثات المباشرة</Label>
                  <Switch 
                    checked={settings.analytics.realTimeUpdates}
                    onCheckedChange={(checked) => handleSettingChange('analytics', 'realTimeUpdates', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>مدة حفظ البيانات (يوم): {settings.analytics.dataRetention}</Label>
                  <Slider
                    value={[settings.analytics.dataRetention]}
                    onValueChange={([value]) => handleSettingChange('analytics', 'dataRetention', value)}
                    max={365}
                    min={30}
                    step={30}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4 animate-fade-in">
            <Card className="interactive-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-500 animate-pulse" />
                  إعدادات الذكاء الاصطناعي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>تفعيل الذكاء الاصطناعي</Label>
                    <p className="text-sm text-muted-foreground">تفعيل جميع ميزات الذكاء الاصطناعي</p>
                  </div>
                  <Switch 
                    checked={settings.ai.enabled}
                    onCheckedChange={(checked) => handleSettingChange('ai', 'enabled', checked)}
                  />
                </div>

                {settings.ai.enabled && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>الرؤى التلقائية</Label>
                      <Switch 
                        checked={settings.ai.autoInsights}
                        onCheckedChange={(checked) => handleSettingChange('ai', 'autoInsights', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>التحليل التنبؤي</Label>
                      <Switch 
                        checked={settings.ai.predictiveAnalysis}
                        onCheckedChange={(checked) => handleSettingChange('ai', 'predictiveAnalysis', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>الإشعارات الذكية</Label>
                      <Switch 
                        checked={settings.ai.smartNotifications}
                        onCheckedChange={(checked) => handleSettingChange('ai', 'smartNotifications', checked)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* أزرار التحكم */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportSettings}
              className="interactive-button"
            >
              <Download className="h-4 w-4 mr-2" />
              تصدير الإعدادات
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleResetSettings}
              className="interactive-button"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              إعادة تعيين
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="interactive-button"
            >
              <X className="h-4 w-4 mr-2" />
              إلغاء
            </Button>
            <Button 
              onClick={handleSaveSettings}
              className="interactive-button"
            >
              <Save className="h-4 w-4 mr-2" />
              حفظ الإعدادات
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}