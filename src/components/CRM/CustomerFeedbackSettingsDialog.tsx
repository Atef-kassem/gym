import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  Monitor,
  Phone,
  MessageSquare,
  Smartphone,
  Globe,
  QrCode,
  Brain,
  Bot,
  Bell,
  Eye,
  Shield,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  Save,
  RotateCcw,
  Palette,
  Volume2,
  Mail,
  Clock,
  Target,
  Activity,
  FileText,
  Database,
  Zap,
  Users,
  Filter
} from "lucide-react";

interface CustomerFeedbackSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CustomerFeedbackSettingsDialog({ 
  open, 
  onOpenChange 
}: CustomerFeedbackSettingsDialogProps) {
  const { toast } = useToast();
  
  // إعدادات طرق الجمع
  const [collectionSettings, setCollectionSettings] = useState({
    internal: true,
    sms: true,
    whatsapp: true,
    mobileApp: true,
    googleReviews: false,
    posTerminal: true,
    callCenter: false,
    autoSend: true,
    sendDelay: '24'
  });

  // إعدادات التحليل الذكي
  const [analysisSettings, setAnalysisSettings] = useState({
    sentimentAnalysis: true,
    keywordExtraction: true,
    autoClassification: true,
    npsCalculation: true,
    realTimeAnalysis: true,
    aiInsights: true,
    predictionMode: true,
    languageDetection: true
  });

  // إعدادات الأتمتة
  const [automationSettings, setAutomationSettings] = useState({
    autoThankYou: true,
    negativeAlerts: true,
    complaintTickets: true,
    loyaltyRewards: true,
    followUpReminders: true,
    responseTemplates: true,
    escalationRules: true,
    autoAssignment: false
  });

  // إعدادات الإشعارات
  const [notificationSettings, setNotificationSettings] = useState({
    alertLevel: '2',
    emailNotifications: true,
    smsNotifications: false,
    mobileNotifications: true,
    desktopNotifications: true,
    soundEnabled: true,
    volume: '50',
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00'
  });

  // إعدادات العرض
  const [displaySettings, setDisplaySettings] = useState({
    theme: 'light',
    language: 'ar',
    autoUpdate: true,
    updateFrequency: '30',
    animationsEnabled: true,
    compactMode: false,
    showTooltips: true,
    sidebarCollapsed: false,
    fontSize: 'medium'
  });

  // إعدادات عامة أخرى
  const [generalSettings, setGeneralSettings] = useState({
    autoLogout: true,
    logoutTimer: '30',
    twoFactorAuth: false,
    activityLog: true,
    dataEncryption: true,
    dataRetention: '365',
    exportFormat: 'excel',
    autoBackup: true,
    backupFrequency: 'weekly'
  });

  const handleSaveSettings = () => {
    // حفظ الإعدادات في localStorage أو إرسالها للخادم
    const allSettings = {
      collection: collectionSettings,
      analysis: analysisSettings,
      automation: automationSettings,
      notifications: notificationSettings,
      display: displaySettings,
      general: generalSettings
    };

    localStorage.setItem('customerFeedbackSettings', JSON.stringify(allSettings));
    
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ جميع إعدادات نظام تقييمات العملاء بنجاح",
    });
    
    onOpenChange(false);
  };

  const handleResetSettings = () => {
    // إعادة تعيين جميع الإعدادات للقيم الافتراضية
    setCollectionSettings({
      internal: true,
      sms: true,
      whatsapp: true,
      mobileApp: true,
      googleReviews: false,
      posTerminal: true,
      callCenter: false,
      autoSend: true,
      sendDelay: '24'
    });

    setAnalysisSettings({
      sentimentAnalysis: true,
      keywordExtraction: true,
      autoClassification: true,
      npsCalculation: true,
      realTimeAnalysis: true,
      aiInsights: true,
      predictionMode: true,
      languageDetection: true
    });

    setAutomationSettings({
      autoThankYou: true,
      negativeAlerts: true,
      complaintTickets: true,
      loyaltyRewards: true,
      followUpReminders: true,
      responseTemplates: true,
      escalationRules: true,
      autoAssignment: false
    });

    setNotificationSettings({
      alertLevel: '2',
      emailNotifications: true,
      smsNotifications: false,
      mobileNotifications: true,
      desktopNotifications: true,
      soundEnabled: true,
      volume: '50',
      quietHours: false,
      quietStart: '22:00',
      quietEnd: '08:00'
    });

    setDisplaySettings({
      theme: 'light',
      language: 'ar',
      autoUpdate: true,
      updateFrequency: '30',
      animationsEnabled: true,
      compactMode: false,
      showTooltips: true,
      sidebarCollapsed: false,
      fontSize: 'medium'
    });

    setGeneralSettings({
      autoLogout: true,
      logoutTimer: '30',
      twoFactorAuth: false,
      activityLog: true,
      dataEncryption: true,
      dataRetention: '365',
      exportFormat: 'excel',
      autoBackup: true,
      backupFrequency: 'weekly'
    });

    toast({
      title: "تم إعادة تعيين الإعدادات",
      description: "تم إعادة تعيين جميع الإعدادات للقيم الافتراضية",
    });
  };

  const handleExportSettings = () => {
    const allSettings = {
      collection: collectionSettings,
      analysis: analysisSettings,
      automation: automationSettings,
      notifications: notificationSettings,
      display: displaySettings,
      general: generalSettings
    };

    const dataStr = JSON.stringify(allSettings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'feedback-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "تم تصدير الإعدادات",
      description: "تم تصدير ملف الإعدادات بنجاح",
    });
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          
          if (importedSettings.collection) setCollectionSettings(importedSettings.collection);
          if (importedSettings.analysis) setAnalysisSettings(importedSettings.analysis);
          if (importedSettings.automation) setAutomationSettings(importedSettings.automation);
          if (importedSettings.notifications) setNotificationSettings(importedSettings.notifications);
          if (importedSettings.display) setDisplaySettings(importedSettings.display);
          if (importedSettings.general) setGeneralSettings(importedSettings.general);

          toast({
            title: "تم استيراد الإعدادات",
            description: "تم استيراد الإعدادات من الملف بنجاح",
          });
        } catch (error) {
          toast({
            title: "خطأ في الاستيراد",
            description: "فشل في قراءة ملف الإعدادات",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500" />
            إعدادات نظام تقييمات العملاء
          </DialogTitle>
          <DialogDescription>
            قم بتخصيص إعدادات النظام لتحسين تجربة إدارة تقييمات العملاء
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="collection" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="collection" className="flex items-center gap-1 text-xs">
                <Monitor className="w-3 h-3" />
                طرق الجمع
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-1 text-xs">
                <Brain className="w-3 h-3" />
                التحليل
              </TabsTrigger>
              <TabsTrigger value="automation" className="flex items-center gap-1 text-xs">
                <Bot className="w-3 h-3" />
                الأتمتة
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-1 text-xs">
                <Bell className="w-3 h-3" />
                الإشعارات
              </TabsTrigger>
              <TabsTrigger value="display" className="flex items-center gap-1 text-xs">
                <Eye className="w-3 h-3" />
                العرض
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              {/* تبويب طرق الجمع */}
              <TabsContent value="collection" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      مصادر جمع التقييمات
                    </CardTitle>
                    <CardDescription>
                      تحديد القنوات المتاحة لجمع تقييمات العملاء
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-blue-500" />
                          <Label>النظام الداخلي</Label>
                        </div>
                        <Switch 
                          checked={collectionSettings.internal}
                          onCheckedChange={(checked) => 
                            setCollectionSettings(prev => ({...prev, internal: checked}))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-500" />
                          <Label>رسائل SMS</Label>
                        </div>
                        <Switch 
                          checked={collectionSettings.sms}
                          onCheckedChange={(checked) => 
                            setCollectionSettings(prev => ({...prev, sms: checked}))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-500" />
                          <Label>واتساب</Label>
                        </div>
                        <Switch 
                          checked={collectionSettings.whatsapp}
                          onCheckedChange={(checked) => 
                            setCollectionSettings(prev => ({...prev, whatsapp: checked}))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-purple-500" />
                          <Label>تطبيق الجوال</Label>
                        </div>
                        <Switch 
                          checked={collectionSettings.mobileApp}
                          onCheckedChange={(checked) => 
                            setCollectionSettings(prev => ({...prev, mobileApp: checked}))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-red-500" />
                          <Label>مراجعات جوجل</Label>
                        </div>
                        <Switch 
                          checked={collectionSettings.googleReviews}
                          onCheckedChange={(checked) => 
                            setCollectionSettings(prev => ({...prev, googleReviews: checked}))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <QrCode className="w-4 h-4 text-orange-500" />
                          <Label>نقاط البيع</Label>
                        </div>
                        <Switch 
                          checked={collectionSettings.posTerminal}
                          onCheckedChange={(checked) => 
                            setCollectionSettings(prev => ({...prev, posTerminal: checked}))
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>الإرسال التلقائي للاستبيانات</Label>
                        <Switch 
                          checked={collectionSettings.autoSend}
                          onCheckedChange={(checked) => 
                            setCollectionSettings(prev => ({...prev, autoSend: checked}))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>وقت التأخير قبل الإرسال (بالساعات)</Label>
                        <Select 
                          value={collectionSettings.sendDelay}
                          onValueChange={(value) => 
                            setCollectionSettings(prev => ({...prev, sendDelay: value}))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">فوري</SelectItem>
                            <SelectItem value="1">ساعة واحدة</SelectItem>
                            <SelectItem value="6">6 ساعات</SelectItem>
                            <SelectItem value="24">24 ساعة</SelectItem>
                            <SelectItem value="48">48 ساعة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* تبويب التحليل الذكي */}
              <TabsContent value="analysis" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      التحليل الذكي بالذكاء الاصطناعي
                    </CardTitle>
                    <CardDescription>
                      تفعيل ميزات التحليل التلقائي والذكاء الاصطناعي
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-blue-500" />
                          <Label>تحليل المشاعر التلقائي</Label>
                        </div>
                        <Switch 
                          checked={analysisSettings.sentimentAnalysis}
                          onCheckedChange={(checked) => 
                            setAnalysisSettings(prev => ({...prev, sentimentAnalysis: checked}))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-green-500" />
                          <Label>استخراج الكلمات المفتاحية</Label>
                        </div>
                        <Switch 
                          checked={analysisSettings.keywordExtraction}
                          onCheckedChange={(checked) => 
                            setAnalysisSettings(prev => ({...prev, keywordExtraction: checked}))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4 text-purple-500" />
                          <Label>التصنيف التلقائي</Label>
                        </div>
                        <Switch 
                          checked={analysisSettings.autoClassification}
                          onCheckedChange={(checked) => 
                            setAnalysisSettings(prev => ({...prev, autoClassification: checked}))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-orange-500" />
                          <Label>حساب مؤشر NPS</Label>
                        </div>
                        <Switch 
                          checked={analysisSettings.npsCalculation}
                          onCheckedChange={(checked) => 
                            setAnalysisSettings(prev => ({...prev, npsCalculation: checked}))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-cyan-500" />
                          <Label>التحليل الفوري</Label>
                        </div>
                        <Switch 
                          checked={analysisSettings.realTimeAnalysis}
                          onCheckedChange={(checked) => 
                            setAnalysisSettings(prev => ({...prev, realTimeAnalysis: checked}))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-indigo-500" />
                          <Label>الرؤى الذكية</Label>
                        </div>
                        <Switch 
                          checked={analysisSettings.aiInsights}
                          onCheckedChange={(checked) => 
                            setAnalysisSettings(prev => ({...prev, aiInsights: checked}))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* تبويب الأتمتة */}
              <TabsContent value="automation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      الردود والإجراءات التلقائية
                    </CardTitle>
                    <CardDescription>
                      تفعيل الردود التلقائية والإجراءات الذكية
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-green-500" />
                          <Label>الشكر التلقائي للتقييمات الإيجابية</Label>
                        </div>
                        <Switch 
                          checked={automationSettings.autoThankYou}
                          onCheckedChange={(checked) => 
                            setAutomationSettings(prev => ({...prev, autoThankYou: checked}))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-red-500" />
                          <Label>تنبيهات فورية للتقييمات السلبية</Label>
                        </div>
                        <Switch 
                          checked={automationSettings.negativeAlerts}
                          onCheckedChange={(checked) => 
                            setAutomationSettings(prev => ({...prev, negativeAlerts: checked}))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-orange-500" />
                          <Label>إنشاء تذاكر للشكاوى</Label>
                        </div>
                        <Switch 
                          checked={automationSettings.complaintTickets}
                          onCheckedChange={(checked) => 
                            setAutomationSettings(prev => ({...prev, complaintTickets: checked}))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-500" />
                          <Label>منح نقاط الولاء التلقائية</Label>
                        </div>
                        <Switch 
                          checked={automationSettings.loyaltyRewards}
                          onCheckedChange={(checked) => 
                            setAutomationSettings(prev => ({...prev, loyaltyRewards: checked}))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* تبويب الإشعارات */}
              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      إعدادات التنبيهات والإشعارات
                    </CardTitle>
                    <CardDescription>
                      تخصيص طرق وأوقات استلام الإشعارات
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>مستوى التنبيه للتقييمات (نجوم أو أقل)</Label>
                        <Select 
                          value={notificationSettings.alertLevel}
                          onValueChange={(value) => 
                            setNotificationSettings(prev => ({...prev, alertLevel: value}))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 نجمة</SelectItem>
                            <SelectItem value="2">2 نجوم أو أقل</SelectItem>
                            <SelectItem value="3">3 نجوم أو أقل</SelectItem>
                            <SelectItem value="4">4 نجوم أو أقل</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-500" />
                            <Label>إشعارات البريد الإلكتروني</Label>
                          </div>
                          <Switch 
                            checked={notificationSettings.emailNotifications}
                            onCheckedChange={(checked) => 
                              setNotificationSettings(prev => ({...prev, emailNotifications: checked}))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-500" />
                            <Label>إشعارات SMS</Label>
                          </div>
                          <Switch 
                            checked={notificationSettings.smsNotifications}
                            onCheckedChange={(checked) => 
                              setNotificationSettings(prev => ({...prev, smsNotifications: checked}))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-purple-500" />
                            <Label>إشعارات الجوال</Label>
                          </div>
                          <Switch 
                            checked={notificationSettings.mobileNotifications}
                            onCheckedChange={(checked) => 
                              setNotificationSettings(prev => ({...prev, mobileNotifications: checked}))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Volume2 className="w-4 h-4 text-orange-500" />
                            <Label>الأصوات</Label>
                          </div>
                          <Switch 
                            checked={notificationSettings.soundEnabled}
                            onCheckedChange={(checked) => 
                              setNotificationSettings(prev => ({...prev, soundEnabled: checked}))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* تبويب العرض */}
              <TabsContent value="display" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      إعدادات واجهة المستخدم
                    </CardTitle>
                    <CardDescription>
                      تخصيص شكل ومظهر واجهة المستخدم
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>المظهر</Label>
                        <Select 
                          value={displaySettings.theme}
                          onValueChange={(value) => 
                            setDisplaySettings(prev => ({...prev, theme: value}))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">فاتح</SelectItem>
                            <SelectItem value="dark">داكن</SelectItem>
                            <SelectItem value="auto">تلقائي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>اللغة</Label>
                        <Select 
                          value={displaySettings.language}
                          onValueChange={(value) => 
                            setDisplaySettings(prev => ({...prev, language: value}))
                          }
                        >
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
                        <Label>حجم الخط</Label>
                        <Select 
                          value={displaySettings.fontSize}
                          onValueChange={(value) => 
                            setDisplaySettings(prev => ({...prev, fontSize: value}))
                          }
                        >
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

                      <div className="space-y-2">
                        <Label>تكرار التحديث (ثانية)</Label>
                        <Select 
                          value={displaySettings.updateFrequency}
                          onValueChange={(value) => 
                            setDisplaySettings(prev => ({...prev, updateFrequency: value}))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 ثانية</SelectItem>
                            <SelectItem value="30">30 ثانية</SelectItem>
                            <SelectItem value="60">دقيقة واحدة</SelectItem>
                            <SelectItem value="300">5 دقائق</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <Label>التحديث التلقائي</Label>
                        <Switch 
                          checked={displaySettings.autoUpdate}
                          onCheckedChange={(checked) => 
                            setDisplaySettings(prev => ({...prev, autoUpdate: checked}))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <Label>الرسوم المتحركة</Label>
                        <Switch 
                          checked={displaySettings.animationsEnabled}
                          onCheckedChange={(checked) => 
                            setDisplaySettings(prev => ({...prev, animationsEnabled: checked}))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <Label>النمط المضغوط</Label>
                        <Switch 
                          checked={displaySettings.compactMode}
                          onCheckedChange={(checked) => 
                            setDisplaySettings(prev => ({...prev, compactMode: checked}))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <Label>إظهار التلميحات</Label>
                        <Switch 
                          checked={displaySettings.showTooltips}
                          onCheckedChange={(checked) => 
                            setDisplaySettings(prev => ({...prev, showTooltips: checked}))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportSettings}>
              <Download className="w-4 h-4 mr-2" />
              تصدير
            </Button>
            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleImportSettings}
                className="hidden"
                id="import-settings"
              />
              <Button variant="outline" onClick={() => document.getElementById('import-settings')?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                استيراد
              </Button>
            </div>
            <Button variant="outline" onClick={handleResetSettings}>
              <RotateCcw className="w-4 h-4 mr-2" />
              إعادة تعيين
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveSettings} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Save className="w-4 h-4 mr-2" />
              حفظ الإعدادات
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}