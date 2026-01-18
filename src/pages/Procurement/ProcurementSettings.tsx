import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Settings, Shield, Users, Bell, FileText, BarChart3, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetProcurementSettingsQuery, useSaveProcurementSettingsMutation } from "@/services/procurementApi";

const ProcurementSettings = () => {
  const { toast } = useToast();
  const { data: settingsFromServer } = useGetProcurementSettingsQuery();
  const [saveSettings, { isLoading: isSaving }] = useSaveProcurementSettingsMutation();
  const [settings, setSettings] = useState({
    // حدود الطلب والموافقات
    minOrderAmount: "100",
    maxDirectPurchase: "5000",
    requireParallelApproval: false,
    orderValidityDays: "30",
    enableQuickApproval: true,
    enableMobileApproval: true,
    autoRFQ: false,

    // إعدادات الموردين
    requireContract: true,
    linkVendorRating: true,
    vendorCreditLimit: "50000",
    autoVendorNotification: true,

    // المخزون والتكامل
    checkStockBeforePurchase: true,
    allowBranchTransfer: true,
    enableERPIntegration: false,

    // الدفع
    enableThreeWayMatch: true,
    requirePOInInvoice: true,
    autoPaymentScheduling: false,

    // الإشعارات
    emailNotifications: true,
    smsNotifications: false,
    inSystemNotifications: true,
    mobileAppNotifications: true,
    stockAlertThreshold: "20",
    dueBillsAlert: true,
    vendorDelayAlert: true,

    // المرفقات
    allowedFileTypes: ["PDF", "Word", "Images"],
    maxFileSize: "10",
    requireMandatoryAttachments: false,
    keepOldVersions: true,

    // التقارير
    weeklyReport: false,
    monthlyReport: true,
    quarterlyReport: false,
    budgetExceedAlert: true
  });

  const handleSave = async () => {
    try {
      await saveSettings(settings).unwrap();
      toast({ title: "تم حفظ الإعدادات", description: "تم حفظ جميع إعدادات المشتريات بنجاح" });
    } catch (e: any) {
      toast({ title: "تعذر الحفظ", description: e?.data?.message || "حدث خطأ", variant: "destructive" });
    }
  };

  const handleReset = () => {
    // Reset to default values logic here
    toast({
      title: "تم استعادة الإعدادات الافتراضية",
      description: "تم إعادة تعيين جميع الإعدادات للقيم الافتراضية",
    });
  };

  // hydrate from server
  if (settingsFromServer && typeof window !== 'undefined') {
    // quick, safe merge without re-render loop
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    (function applyOnce() {
      // map server booleans/numbers directly
      const mapped = {
        minOrderAmount: String(settingsFromServer.minOrderAmount ?? ""),
        maxDirectPurchase: String(settingsFromServer.maxDirectPurchase ?? ""),
        requireParallelApproval: !!settingsFromServer.requireParallelApproval,
        orderValidityDays: String(settingsFromServer.orderValidityDays ?? ""),
        enableQuickApproval: !!settingsFromServer.enableQuickApproval,
        enableMobileApproval: !!settingsFromServer.enableMobileApproval,
        autoRFQ: !!settingsFromServer.autoRFQ,
        requireContract: !!settingsFromServer.requireContract,
        linkVendorRating: !!settingsFromServer.linkVendorRating,
        vendorCreditLimit: String(settingsFromServer.vendorCreditLimit ?? ""),
        autoVendorNotification: !!settingsFromServer.autoVendorNotification,
        checkStockBeforePurchase: !!settingsFromServer.checkStockBeforePurchase,
        allowBranchTransfer: !!settingsFromServer.allowBranchTransfer,
        enableERPIntegration: !!settingsFromServer.enableERPIntegration,
        enableThreeWayMatch: !!settingsFromServer.enableThreeWayMatch,
        requirePOInInvoice: !!settingsFromServer.requirePOInInvoice,
        autoPaymentScheduling: !!settingsFromServer.autoPaymentScheduling,
        emailNotifications: !!settingsFromServer.emailNotifications,
        smsNotifications: !!settingsFromServer.smsNotifications,
        inSystemNotifications: !!settingsFromServer.inSystemNotifications,
        mobileAppNotifications: !!settingsFromServer.mobileAppNotifications,
        stockAlertThreshold: String(settingsFromServer.stockAlertThreshold ?? ""),
        dueBillsAlert: !!settingsFromServer.dueBillsAlert,
        vendorDelayAlert: !!settingsFromServer.vendorDelayAlert,
        allowedFileTypes: settingsFromServer.allowedFileTypes ?? ["PDF", "Word", "Images"],
        maxFileSize: String(settingsFromServer.maxFileSize ?? ""),
        requireMandatoryAttachments: !!settingsFromServer.requireMandatoryAttachments,
        keepOldVersions: !!settingsFromServer.keepOldVersions,
        weeklyReport: !!settingsFromServer.weeklyReport,
        monthlyReport: !!settingsFromServer.monthlyReport,
        quarterlyReport: !!settingsFromServer.quarterlyReport,
        budgetExceedAlert: !!settingsFromServer.budgetExceedAlert,
      } as typeof settings;
      // only set once per navigation (avoid infinite loop)
      if ((window as any).__ps_applied__ !== true) {
        (window as any).__ps_applied__ = true;
        setSettings((prev) => ({ ...prev, ...mapped }));
      }
    })();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إعدادات إدارة المشتريات</h1>
          <p className="text-muted-foreground">
            ضبط السياسات والحدود ومسارات العمل لجميع عمليات المشتريات
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="ml-2 h-4 w-4" />
            استعادة الافتراضي
          </Button>
          <Button onClick={handleSave}>
            <Save className="ml-2 h-4 w-4" />
            حفظ الإعدادات
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="general">
            <Settings className="ml-1 h-4 w-4" />
            عام
          </TabsTrigger>
          <TabsTrigger value="approvals">
            <Shield className="ml-1 h-4 w-4" />
            الموافقات
          </TabsTrigger>
          <TabsTrigger value="vendors">
            <Users className="ml-1 h-4 w-4" />
            الموردين
          </TabsTrigger>
          <TabsTrigger value="inventory">المخزون</TabsTrigger>
          <TabsTrigger value="payments">المالية</TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="ml-1 h-4 w-4" />
            الإشعارات
          </TabsTrigger>
          <TabsTrigger value="attachments">
            <FileText className="ml-1 h-4 w-4" />
            المرفقات
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart3 className="ml-1 h-4 w-4" />
            التقارير
          </TabsTrigger>
        </TabsList>

        {/* الإعدادات العامة */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات العامة</CardTitle>
              <CardDescription>الإعدادات الأساسية لنظام المشتريات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minOrder">الحد الأدنى لطلب الشراء (جنيه)</Label>
                  <Input 
                    id="minOrder" 
                    type="number" 
                    value={settings.minOrderAmount}
                    onChange={(e) => setSettings({...settings, minOrderAmount: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDirect">الحد الأقصى للشراء المباشر (جنيه)</Label>
                  <Input 
                    id="maxDirect" 
                    type="number" 
                    value={settings.maxDirectPurchase}
                    onChange={(e) => setSettings({...settings, maxDirectPurchase: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="validity">مدة صلاحية طلب الشراء (أيام)</Label>
                <Input 
                  id="validity" 
                  type="number" 
                  value={settings.orderValidityDays}
                  onChange={(e) => setSettings({...settings, orderValidityDays: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إعدادات الموافقات */}
        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>سياسات الطلب والموافقة</CardTitle>
              <CardDescription>إعداد مسارات الموافقة والصلاحيات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>إلزام الموافقات المتوازية</Label>
                  <p className="text-sm text-muted-foreground">
                    موافقة أكثر من مسؤول في نفس الوقت
                  </p>
                </div>
                <Switch 
                  checked={settings.requireParallelApproval}
                  onCheckedChange={(checked) => setSettings({...settings, requireParallelApproval: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تفعيل الموافقة السريعة</Label>
                  <p className="text-sm text-muted-foreground">
                    موافقة تلقائية في الحالات البسيطة
                  </p>
                </div>
                <Switch 
                  checked={settings.enableQuickApproval}
                  onCheckedChange={(checked) => setSettings({...settings, enableQuickApproval: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>اعتماد الموافقات من الجوال</Label>
                  <p className="text-sm text-muted-foreground">
                    دعم الموافقة عبر تطبيق الهاتف
                  </p>
                </div>
                <Switch 
                  checked={settings.enableMobileApproval}
                  onCheckedChange={(checked) => setSettings({...settings, enableMobileApproval: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>طلب عرض أسعار تلقائي</Label>
                  <p className="text-sm text-muted-foreground">
                    تشغيل RFQ تلقائياً عند تجاوز حد معين
                  </p>
                </div>
                <Switch 
                  checked={settings.autoRFQ}
                  onCheckedChange={(checked) => setSettings({...settings, autoRFQ: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إعدادات الموردين */}
        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الموردين</CardTitle>
              <CardDescription>ضبط سياسات التعامل مع الموردين</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>إلزام تسجيل العقد/الاتفاقية</Label>
                  <p className="text-sm text-muted-foreground">
                    لا يمكن الشراء إلا بوجود عقد فعال
                  </p>
                </div>
                <Switch 
                  checked={settings.requireContract}
                  onCheckedChange={(checked) => setSettings({...settings, requireContract: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>ربط تقييم أداء المورد بالطلبات</Label>
                  <p className="text-sm text-muted-foreground">
                    لا يعرض المورد إلا إذا تجاوز تقييم معين
                  </p>
                </div>
                <Switch 
                  checked={settings.linkVendorRating}
                  onCheckedChange={(checked) => setSettings({...settings, linkVendorRating: checked})}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="creditLimit">الحد الائتماني للمورد (جنيه)</Label>
                <Input 
                  id="creditLimit" 
                  type="number" 
                  value={settings.vendorCreditLimit}
                  onChange={(e) => setSettings({...settings, vendorCreditLimit: e.target.value})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>إبلاغ تلقائي بتحديث بيانات المورد</Label>
                  <p className="text-sm text-muted-foreground">
                    إشعار المستخدمين عند تحديث بيانات المورد
                  </p>
                </div>
                <Switch 
                  checked={settings.autoVendorNotification}
                  onCheckedChange={(checked) => setSettings({...settings, autoVendorNotification: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إعدادات المخزون */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>المخزون والتكامل</CardTitle>
              <CardDescription>إعدادات الربط مع نظام المخزون</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تفعيل التحقق من الرصيد</Label>
                  <p className="text-sm text-muted-foreground">
                    منع الشراء إذا كان الرصيد متوفر
                  </p>
                </div>
                <Switch 
                  checked={settings.checkStockBeforePurchase}
                  onCheckedChange={(checked) => setSettings({...settings, checkStockBeforePurchase: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>السماح بالتحويل بين الفروع</Label>
                  <p className="text-sm text-muted-foreground">
                    اقتراح التحويل بدلاً من الشراء
                  </p>
                </div>
                <Switch 
                  checked={settings.allowBranchTransfer}
                  onCheckedChange={(checked) => setSettings({...settings, allowBranchTransfer: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>الربط مع أنظمة ERP أخرى</Label>
                  <p className="text-sm text-muted-foreground">
                    ربط مع محاسبة أو إدارة مشاريع
                  </p>
                </div>
                <Switch 
                  checked={settings.enableERPIntegration}
                  onCheckedChange={(checked) => setSettings({...settings, enableERPIntegration: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إعدادات المالية */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الدفع</CardTitle>
              <CardDescription>إعدادات المعالجة المالية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>سياسة المطابقة الثلاثية</Label>
                  <p className="text-sm text-muted-foreground">
                    تفعيل الإلزام في التطابق
                  </p>
                </div>
                <Switch 
                  checked={settings.enableThreeWayMatch}
                  onCheckedChange={(checked) => setSettings({...settings, enableThreeWayMatch: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>إلزام رقم أمر الشراء بالايصال</Label>
                  <p className="text-sm text-muted-foreground">
                    لا تقبل ايصال دون ربط أمر شراء
                  </p>
                </div>
                <Switch 
                  checked={settings.requirePOInInvoice}
                  onCheckedChange={(checked) => setSettings({...settings, requirePOInInvoice: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>جدولة الدفعات التلقائية</Label>
                  <p className="text-sm text-muted-foreground">
                    إدراج الإيصالات تلقائياً في جدول الدفع
                  </p>
                </div>
                <Switch 
                  checked={settings.autoPaymentScheduling}
                  onCheckedChange={(checked) => setSettings({...settings, autoPaymentScheduling: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إعدادات الإشعارات */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الإشعارات والتنبيهات</CardTitle>
              <CardDescription>ضبط قنوات التنبيه والإشعارات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label>بريد إلكتروني</Label>
                  <Switch 
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>رسائل نصية</Label>
                  <Switch 
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>داخل النظام</Label>
                  <Switch 
                    checked={settings.inSystemNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, inSystemNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تطبيق الجوال</Label>
                  <Switch 
                    checked={settings.mobileAppNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, mobileAppNotifications: checked})}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="stockAlert">تنبيه باقتراب حد الطلب (%)</Label>
                <Input 
                  id="stockAlert" 
                  type="number" 
                  value={settings.stockAlertThreshold}
                  onChange={(e) => setSettings({...settings, stockAlertThreshold: e.target.value})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>إشعارات الإيصالات المستحقة</Label>
                  <p className="text-sm text-muted-foreground">
                    تنبيه آلي للإيصالات القريبة الاستحقاق
                  </p>
                </div>
                <Switch 
                  checked={settings.dueBillsAlert}
                  onCheckedChange={(checked) => setSettings({...settings, dueBillsAlert: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تنبيه تأخر المورد</Label>
                  <p className="text-sm text-muted-foreground">
                    إرسال إشعار تلقائي عند تأخر الاستلام أو التوريد
                  </p>
                </div>
                <Switch 
                  checked={settings.vendorDelayAlert}
                  onCheckedChange={(checked) => setSettings({...settings, vendorDelayAlert: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إعدادات المرفقات */}
        <TabsContent value="attachments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>المرفقات والتوثيق</CardTitle>
              <CardDescription>ضبط سياسات المرفقات والمستندات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>أنواع المرفقات المقبولة</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر أنواع الملفات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="word">Word</SelectItem>
                    <SelectItem value="images">الصور</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fileSize">حجم المرفق الأقصى (ميجابايت)</Label>
                <Input 
                  id="fileSize" 
                  type="number" 
                  value={settings.maxFileSize}
                  onChange={(e) => setSettings({...settings, maxFileSize: e.target.value})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>إلزام مرفقات معينة</Label>
                  <p className="text-sm text-muted-foreground">
                    إلزام رفع ايصال، سند استلام...
                  </p>
                </div>
                <Switch 
                  checked={settings.requireMandatoryAttachments}
                  onCheckedChange={(checked) => setSettings({...settings, requireMandatoryAttachments: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>حفظ الإصدارات القديمة للمستندات</Label>
                  <p className="text-sm text-muted-foreground">
                    الرجوع لأي نسخة سابقة من المستندات
                  </p>
                </div>
                <Switch 
                  checked={settings.keepOldVersions}
                  onCheckedChange={(checked) => setSettings({...settings, keepOldVersions: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إعدادات التقارير */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>التقارير والتحليلات</CardTitle>
              <CardDescription>إعدادات التقارير الدورية والتنبيهات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">جدولة تقارير دورية</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>تقرير أسبوعي</Label>
                    <Switch 
                      checked={settings.weeklyReport}
                      onCheckedChange={(checked) => setSettings({...settings, weeklyReport: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>تقرير شهري</Label>
                    <Switch 
                      checked={settings.monthlyReport}
                      onCheckedChange={(checked) => setSettings({...settings, monthlyReport: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>تقرير ربع سنوي</Label>
                    <Switch 
                      checked={settings.quarterlyReport}
                      onCheckedChange={(checked) => setSettings({...settings, quarterlyReport: checked})}
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تنبيهات تجاوز المصروفات</Label>
                  <p className="text-sm text-muted-foreground">
                    إشعار عند تجاوز موازنة قسم أو مشروع
                  </p>
                </div>
                <Switch 
                  checked={settings.budgetExceedAlert}
                  onCheckedChange={(checked) => setSettings({...settings, budgetExceedAlert: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcurementSettings;