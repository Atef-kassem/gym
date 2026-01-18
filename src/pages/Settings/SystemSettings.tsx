import { useState, useRef } from "react";
import { Settings, Save, Upload, RefreshCw, Mail, MessageSquare, Receipt, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

// Language options
const languageOptions = [
  { value: "ar", label: "العربية", flag: "🇸🇦" },
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "es", label: "Español", flag: "🇪🇸" },
];

// Currency options
const currencyOptions = [
  { value: "SAR", label: "جنيه مصري (SAR)", symbol: "جنيه مصري" },
  { value: "USD", label: "دولار أمريكي (USD)", symbol: "$" },
  { value: "EUR", label: "يورو (EUR)", symbol: "€" },
  { value: "AED", label: "درهم إماراتي (AED)", symbol: "د.إ" },
  { value: "EGP", label: "جنيه مصري (EGP)", symbol: "ج.م" },
];

// Date format options
const dateFormats = [
  { value: "DD/MM/YYYY", label: "يوم/شهج.منة (25/12/2024)" },
  { value: "MM/DD/YYYY", label: "شهر/يوم/سنة (12/25/2024)" },
  { value: "YYYY-MM-DD", label: "سنة-شهر-يوم (2024-12-25)" },
  { value: "DD-MM-YYYY", label: "يوم-شهج.منة (25-12-2024)" },
];

// Time format options
const timeFormats = [
  { value: "24h", label: "24 ساعة (14:30)" },
  { value: "12h", label: "12 ساعة (2:30 PM)" },
];

export default function SystemSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [systemLogo, setSystemLogo] = useState<string | null>(null);

  const [systemSettings, setSystemSettings] = useState({
    // General Settings
    defaultLanguage: "ar",
    defaultCurrency: "SAR",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    timezone: "Asia/Riyadh",
    
    // VAT Settings
    vatEnabled: true,
    vatRate: 15,
    vatNumber: "",
    
    // Print & Invoice Settings
    invoiceTemplate: "standard",
    invoicePrefix: "INV-",
    receiptTemplate: "compact",
    autoPrint: false,
    
    // Email Settings (SMTP)
    smtpEnabled: false,
    smtpHost: "",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: "",
    smtpSecure: true,
    fromEmail: "",
    fromName: "",
    
    // SMS Settings
    smsEnabled: false,
    smsProvider: "twilio",
    smsApiKey: "",
    smsApiSecret: "",
    smsFromNumber: "",
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ إعدادات النظام بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ إعدادات النظام",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSystemLogo(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        
        toast({
          title: "تم رفع الشعار",
          description: "تم رفع شعار النظام بنجاح",
        });
      } else {
        toast({
          title: "خطأ في الملف",
          description: "يرجى رفع ملف صورة صالح",
          variant: "destructive",
        });
      }
    }
  };

  const testEmailConnection = async () => {
    if (!systemSettings.smtpHost || !systemSettings.smtpUsername) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى إدخال إعدادات SMTP أولاً",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "جاري الاختبار...",
      description: "جاري اختبار اتصال البريد الإلكتروني",
    });

    // Simulate test
    setTimeout(() => {
      toast({
        title: "نجح الاختبار",
        description: "تم اختبار إعدادات البريد الإلكتروني بنجاح",
      });
    }, 2000);
  };

  const testSmsConnection = async () => {
    if (!systemSettings.smsApiKey) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى إدخال إعدادات SMS API أولاً",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "جاري الاختبار...",
      description: "جاري اختبار اتصال الرسائل النصية",
    });

    // Simulate test
    setTimeout(() => {
      toast({
        title: "نجح الاختبار",
        description: "تم اختبار إعدادات الرسائل النصية بنجاح",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إعدادات النظام العامة</h1>
          <p className="text-muted-foreground">إعدادات النظام الأساسية والخدمات الخارجية</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading} className="gap-2">
          <Save className="w-4 h-4" />
          {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card className="shadow-card hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              الإعدادات العامة
            </CardTitle>
            <CardDescription>اللغة والعملة وتنسيقات التاريخ والوقت</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Default Language */}
            <div>
              <Label>اللغة الافتراضية للنظام</Label>
              <Select 
                value={systemSettings.defaultLanguage} 
                onValueChange={(value) => setSystemSettings(prev => ({ ...prev, defaultLanguage: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="اختر اللغة الافتراضية" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Default Currency */}
            <div>
              <Label>العملة الافتراضية</Label>
              <Select 
                value={systemSettings.defaultCurrency} 
                onValueChange={(value) => setSystemSettings(prev => ({ ...prev, defaultCurrency: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="اختر العملة الافتراضية" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{currency.symbol}</span>
                        <span>{currency.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Format */}
            <div>
              <Label>تنسيق التاريخ</Label>
              <Select 
                value={systemSettings.dateFormat} 
                onValueChange={(value) => setSystemSettings(prev => ({ ...prev, dateFormat: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="اختر تنسيق التاريخ" />
                </SelectTrigger>
                <SelectContent>
                  {dateFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Format */}
            <div>
              <Label>تنسيق الوقت</Label>
              <Select 
                value={systemSettings.timeFormat} 
                onValueChange={(value) => setSystemSettings(prev => ({ ...prev, timeFormat: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="اختر تنسيق الوقت" />
                </SelectTrigger>
                <SelectContent>
                  {timeFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* System Logo */}
        <Card className="shadow-card hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              شعار النظام العام
            </CardTitle>
            <CardDescription>رفع وإدارة شعار النظام الرئيسي</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => logoInputRef.current?.click()}
                className="w-full gap-2"
              >
                <Upload className="w-4 h-4" />
                رفع شعار النظام
              </Button>
            </div>
            
            {systemLogo && (
              <div className="text-center">
                <img
                  src={systemLogo}
                  alt="System Logo"
                  className="max-w-32 max-h-32 mx-auto border rounded-lg object-contain"
                />
                <p className="text-sm text-muted-foreground mt-2">شعار النظام الحالي</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* VAT Settings */}
        <Card className="shadow-card hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              إعدادات الضريبة المضافة
            </CardTitle>
            <CardDescription>تفعيل وإعداد الضريبة المضافة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>تفعيل الضريبة المضافة</Label>
                <p className="text-sm text-muted-foreground">تطبيق الضريبة على الإيصالات</p>
              </div>
              <Switch
                checked={systemSettings.vatEnabled}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, vatEnabled: checked }))}
              />
            </div>

            {systemSettings.vatEnabled && (
              <>
                <div>
                  <Label>نسبة الضريبة المضافة (%)</Label>
                  <Input
                    type="number"
                    value={systemSettings.vatRate}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, vatRate: Number(e.target.value) }))}
                    className="mt-2"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label>رقم التسجيل الضريبي</Label>
                  <Input
                    value={systemSettings.vatNumber}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, vatNumber: e.target.value }))}
                    placeholder="301234567890003"
                    className="mt-2"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Print & Invoice Settings */}
        <Card className="shadow-card hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              إعدادات الطباعة والإيصالات
            </CardTitle>
            <CardDescription>تخصيص قوالب الطباعة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>قالب الايصال</Label>
              <Select 
                value={systemSettings.invoiceTemplate} 
                onValueChange={(value) => setSystemSettings(prev => ({ ...prev, invoiceTemplate: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">قالب قياسي</SelectItem>
                  <SelectItem value="modern">قالب عصري</SelectItem>
                  <SelectItem value="minimal">قالب مبسط</SelectItem>
                  <SelectItem value="detailed">قالب مفصل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>بادئة رقم الايصال</Label>
              <Input
                value={systemSettings.invoicePrefix}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, invoicePrefix: e.target.value }))}
                placeholder="INV-"
                className="mt-2"
              />
            </div>

            <div>
              <Label>قالب الإيصال</Label>
              <Select 
                value={systemSettings.receiptTemplate} 
                onValueChange={(value) => setSystemSettings(prev => ({ ...prev, receiptTemplate: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">مضغوط</SelectItem>
                  <SelectItem value="standard">قياسي</SelectItem>
                  <SelectItem value="detailed">مفصل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>الطباعة التلقائية</Label>
                <p className="text-sm text-muted-foreground">طباعة الإيصالات تلقائياً</p>
              </div>
              <Switch
                checked={systemSettings.autoPrint}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoPrint: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="shadow-card hover-lift lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              إعدادات البريد الإلكتروني (SMTP)
            </CardTitle>
            <CardDescription>إعداد خدمة البريد الإلكتروني لإرسال الإشعارات</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>تفعيل البريد الإلكتروني</Label>
                <p className="text-sm text-muted-foreground">تفعيل خدمة البريد الإلكتروني</p>
              </div>
              <Switch
                checked={systemSettings.smtpEnabled}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, smtpEnabled: checked }))}
              />
            </div>

            {systemSettings.smtpEnabled && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>خادم SMTP</Label>
                  <Input
                    value={systemSettings.smtpHost}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                    placeholder="smtp.gmail.com"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>منفذ SMTP</Label>
                  <Input
                    type="number"
                    value={systemSettings.smtpPort}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, smtpPort: Number(e.target.value) }))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>اسم المستخدم</Label>
                  <Input
                    value={systemSettings.smtpUsername}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, smtpUsername: e.target.value }))}
                    placeholder="your-email@gmail.com"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>كلمة المرور</Label>
                  <Input
                    type="password"
                    value={systemSettings.smtpPassword}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                    placeholder="••••••••"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>البريد المرسل من</Label>
                  <Input
                    value={systemSettings.fromEmail}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                    placeholder="noreply@company.com"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>اسم المرسل</Label>
                  <Input
                    value={systemSettings.fromName}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, fromName: e.target.value }))}
                    placeholder="شركة مغاسل  الكافية"
                    className="mt-2"
                  />
                </div>

                <div className="md:col-span-2 flex items-center justify-between">
                  <div>
                    <Label>اتصال آمن (SSL/TLS)</Label>
                    <p className="text-sm text-muted-foreground">استخدام تشفير SSL/TLS</p>
                  </div>
                  <Switch
                    checked={systemSettings.smtpSecure}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, smtpSecure: checked }))}
                  />
                </div>

                <div className="md:col-span-2">
                  <Button 
                    variant="outline" 
                    onClick={testEmailConnection}
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    اختبار الاتصال
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SMS Settings */}
        <Card className="shadow-card hover-lift lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              إعدادات الرسائل النصية (SMS)
            </CardTitle>
            <CardDescription>إعداد خدمة الرسائل النصية للإشعارات والتنبيهات</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>تفعيل الرسائل النصية</Label>
                <p className="text-sm text-muted-foreground">تفعيل خدمة الرسائل النصية</p>
              </div>
              <Switch
                checked={systemSettings.smsEnabled}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, smsEnabled: checked }))}
              />
            </div>

            {systemSettings.smsEnabled && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>مزود الخدمة</Label>
                  <Select 
                    value={systemSettings.smsProvider} 
                    onValueChange={(value) => setSystemSettings(prev => ({ ...prev, smsProvider: value }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="nexmo">Nexmo/Vonage</SelectItem>
                      <SelectItem value="aws">AWS SNS</SelectItem>
                      <SelectItem value="custom">مخصص</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>مفتاح API</Label>
                  <Input
                    type="password"
                    value={systemSettings.smsApiKey}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, smsApiKey: e.target.value }))}
                    placeholder="••••••••••••••••"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>رقم المرسل</Label>
                  <Input
                    value={systemSettings.smsFromNumber}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, smsFromNumber: e.target.value }))}
                    placeholder="+966501234567"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>السر السري</Label>
                  <Input
                    type="password"
                    value={systemSettings.smsApiSecret}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, smsApiSecret: e.target.value }))}
                    placeholder="••••••••••••••••"
                    className="mt-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <Button 
                    variant="outline" 
                    onClick={testSmsConnection}
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    اختبار الاتصال
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}