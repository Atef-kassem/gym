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
  BarChart3, 
  ChevronLeft,
  Download,
  Upload,
  Calendar,
  FileText,
  PieChart,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ReportTemplate {
  id: string;
  name: string;
  type: "sales" | "inventory" | "financial" | "operational";
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  isActive: boolean;
  autoGenerate: boolean;
  recipients: string[];
  format: "pdf" | "excel" | "csv";
}

const POSReportsSettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [reportSettings, setReportSettings] = useState({
    enableAutoReports: true,
    defaultFormat: "pdf", // pdf, excel, csv
    reportRetentionDays: 365,
    enableScheduledReports: true,
    enableRealTimeReports: true,
    compressReports: true,
    watermarkReports: true,
    encryptReports: false,
    defaultTimeZone: "Asia/Riyadh",
    dateFormat: "DD/MM/YYYY",
    currency: "SAR",
    includeCharts: true,
    includeGraphs: true,
    colorTheme: "default"
  });

  const [accessSettings, setAccessSettings] = useState({
    restrictReportAccess: true,
    allowDataExport: true,
    requireApprovalForExport: false,
    logReportAccess: true,
    enableReportSharing: true,
    allowExternalSharing: false,
    maxReportsPerUser: 50,
    enableReportSubscription: true,
    allowCustomReports: true,
    requirePermissionForCustom: true
  });

  const [dashboardSettings, setDashboardSettings] = useState({
    enableDashboard: true,
    refreshInterval: 5, // minutes
    showKPIs: true,
    showCharts: true,
    showAlerts: true,
    showRecentTransactions: true,
    showTopProducts: true,
    showPerformanceMetrics: true,
    enableDrillDown: true,
    enableFilters: true,
    defaultDateRange: "today", // today, week, month, quarter, year
    maxDashboardWidgets: 12
  });

  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([
    {
      id: "1",
      name: "تقرير المبيعات اليومي",
      type: "sales",
      frequency: "daily",
      isActive: true,
      autoGenerate: true,
      recipients: ["manager@company.com", "sales@company.com"],
      format: "pdf"
    },
    {
      id: "2",
      name: "تقرير المخزون الأسبوعي",
      type: "inventory",
      frequency: "weekly",
      isActive: true,
      autoGenerate: false,
      recipients: ["inventory@company.com"],
      format: "excel"
    },
    {
      id: "3",
      name: "التقرير المالي الشهري",
      type: "financial",
      frequency: "monthly",
      isActive: false,
      autoGenerate: true,
      recipients: ["finance@company.com", "manager@company.com"],
      format: "pdf"
    },
    {
      id: "4",
      name: "تقرير الأداء التشغيلي",
      type: "operational",
      frequency: "weekly",
      isActive: true,
      autoGenerate: false,
      recipients: ["operations@company.com"],
      format: "excel"
    }
  ]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("تم حفظ إعدادات التقارير بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReportTemplate = (templateId: string) => {
    setReportTemplates(templates =>
      templates.map(template =>
        template.id === templateId ? { ...template, isActive: !template.isActive } : template
      )
    );
    toast.success("تم تحديث قالب التقرير");
  };

  const generateSampleReport = async () => {
    try {
      toast.info("جاري إنشاء تقرير تجريبي...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("تم إنشاء التقرير التجريبي بنجاح");
    } catch (error) {
      toast.error("فشل في إنشاء التقرير التجريبي");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sales": return <DollarSign className="h-4 w-4" />;
      case "inventory": return <Package className="h-4 w-4" />;
      case "financial": return <TrendingUp className="h-4 w-4" />;
      case "operational": return <Users className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "sales": return "مبيعات";
      case "inventory": return "مخزون";
      case "financial": return "مالي";
      case "operational": return "تشغيلي";
      default: return type;
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "daily": return "يومي";
      case "weekly": return "أسبوعي";
      case "monthly": return "شهري";
      case "quarterly": return "ربع سنوي";
      case "yearly": return "سنوي";
      default: return frequency;
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
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">إعدادات التقارير</h1>
            <p className="text-muted-foreground">تخصيص وتصدير تقارير نقاط البيع والتحليلات</p>
          </div>
        </div>
      </div>

      {/* General Report Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            الإعدادات العامة للتقارير
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>تنسيق التقرير الافتراضي</Label>
              <Select value={reportSettings.defaultFormat} onValueChange={(value) => setReportSettings({...reportSettings, defaultFormat: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>فترة الاحتفاظ بالتقارير (يوم)</Label>
              <Input
                type="number"
                min="30"
                max="3650"
                value={reportSettings.reportRetentionDays}
                onChange={(e) => setReportSettings({
                  ...reportSettings,
                  reportRetentionDays: parseInt(e.target.value) || 365
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>المنطقة الزمنية</Label>
              <Select value={reportSettings.defaultTimeZone} onValueChange={(value) => setReportSettings({...reportSettings, defaultTimeZone: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Riyadh">الرياض</SelectItem>
                  <SelectItem value="Asia/Dubai">دبي</SelectItem>
                  <SelectItem value="Asia/Kuwait">الكويت</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>تنسيق التاريخ</Label>
              <Select value={reportSettings.dateFormat} onValueChange={(value) => setReportSettings({...reportSettings, dateFormat: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>العملة</Label>
              <Select value={reportSettings.currency} onValueChange={(value) => setReportSettings({...reportSettings, currency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAR">جنيه مصري</SelectItem>
                  <SelectItem value="AED">درهم إماراتي</SelectItem>
                  <SelectItem value="USD">دولار أمريكي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>نمط الألوان</Label>
              <Select value={reportSettings.colorTheme} onValueChange={(value) => setReportSettings({...reportSettings, colorTheme: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">افتراضي</SelectItem>
                  <SelectItem value="blue">أزرق</SelectItem>
                  <SelectItem value="green">أخضر</SelectItem>
                  <SelectItem value="corporate">شركة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">خيارات التقارير</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>تفعيل التقارير التلقائية</Label>
                  <Switch
                    checked={reportSettings.enableAutoReports}
                    onCheckedChange={(checked) => setReportSettings({
                      ...reportSettings,
                      enableAutoReports: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>التقارير المجدولة</Label>
                  <Switch
                    checked={reportSettings.enableScheduledReports}
                    onCheckedChange={(checked) => setReportSettings({
                      ...reportSettings,
                      enableScheduledReports: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>التقارير الفورية</Label>
                  <Switch
                    checked={reportSettings.enableRealTimeReports}
                    onCheckedChange={(checked) => setReportSettings({
                      ...reportSettings,
                      enableRealTimeReports: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>ضغط التقارير</Label>
                  <Switch
                    checked={reportSettings.compressReports}
                    onCheckedChange={(checked) => setReportSettings({
                      ...reportSettings,
                      compressReports: checked
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">التصميم والأمان</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>علامة مائية للتقارير</Label>
                  <Switch
                    checked={reportSettings.watermarkReports}
                    onCheckedChange={(checked) => setReportSettings({
                      ...reportSettings,
                      watermarkReports: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تشفير التقارير</Label>
                  <Switch
                    checked={reportSettings.encryptReports}
                    onCheckedChange={(checked) => setReportSettings({
                      ...reportSettings,
                      encryptReports: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تضمين الرسوم البيانية</Label>
                  <Switch
                    checked={reportSettings.includeCharts}
                    onCheckedChange={(checked) => setReportSettings({
                      ...reportSettings,
                      includeCharts: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تضمين الإحصائيات المرئية</Label>
                  <Switch
                    checked={reportSettings.includeGraphs}
                    onCheckedChange={(checked) => setReportSettings({
                      ...reportSettings,
                      includeGraphs: checked
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            التحكم في الوصول والأذونات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>حد أقصى للتقارير لكل مستخدم</Label>
              <Input
                type="number"
                min="10"
                max="200"
                value={accessSettings.maxReportsPerUser}
                onChange={(e) => setAccessSettings({
                  ...accessSettings,
                  maxReportsPerUser: parseInt(e.target.value) || 50
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">أذونات الوصول</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>تقييد الوصول للتقارير</Label>
                  <Switch
                    checked={accessSettings.restrictReportAccess}
                    onCheckedChange={(checked) => setAccessSettings({
                      ...accessSettings,
                      restrictReportAccess: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>السماح بتصدير البيانات</Label>
                  <Switch
                    checked={accessSettings.allowDataExport}
                    onCheckedChange={(checked) => setAccessSettings({
                      ...accessSettings,
                      allowDataExport: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>طلب موافقة للتصدير</Label>
                  <Switch
                    checked={accessSettings.requireApprovalForExport}
                    onCheckedChange={(checked) => setAccessSettings({
                      ...accessSettings,
                      requireApprovalForExport: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تسجيل الوصول للتقارير</Label>
                  <Switch
                    checked={accessSettings.logReportAccess}
                    onCheckedChange={(checked) => setAccessSettings({
                      ...accessSettings,
                      logReportAccess: checked
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">خيارات المشاركة</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>تفعيل مشاركة التقارير</Label>
                  <Switch
                    checked={accessSettings.enableReportSharing}
                    onCheckedChange={(checked) => setAccessSettings({
                      ...accessSettings,
                      enableReportSharing: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>السماح بالمشاركة الخارجية</Label>
                  <Switch
                    checked={accessSettings.allowExternalSharing}
                    onCheckedChange={(checked) => setAccessSettings({
                      ...accessSettings,
                      allowExternalSharing: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تفعيل الاشتراك بالتقارير</Label>
                  <Switch
                    checked={accessSettings.enableReportSubscription}
                    onCheckedChange={(checked) => setAccessSettings({
                      ...accessSettings,
                      enableReportSubscription: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>السماح بالتقارير المخصصة</Label>
                  <Switch
                    checked={accessSettings.allowCustomReports}
                    onCheckedChange={(checked) => setAccessSettings({
                      ...accessSettings,
                      allowCustomReports: checked
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            إعدادات لوحة المعلومات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>فترة التحديث (دقائق)</Label>
              <Input
                type="number"
                min="1"
                max="60"
                value={dashboardSettings.refreshInterval}
                onChange={(e) => setDashboardSettings({
                  ...dashboardSettings,
                  refreshInterval: parseInt(e.target.value) || 5
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>النطاق الزمني الافتراضي</Label>
              <Select value={dashboardSettings.defaultDateRange} onValueChange={(value) => setDashboardSettings({...dashboardSettings, defaultDateRange: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">اليوم</SelectItem>
                  <SelectItem value="week">هذا الأسبوع</SelectItem>
                  <SelectItem value="month">هذا الشهر</SelectItem>
                  <SelectItem value="quarter">هذا الربع</SelectItem>
                  <SelectItem value="year">هذا العام</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>حد أقصى للعناصر في اللوحة</Label>
              <Input
                type="number"
                min="4"
                max="20"
                value={dashboardSettings.maxDashboardWidgets}
                onChange={(e) => setDashboardSettings({
                  ...dashboardSettings,
                  maxDashboardWidgets: parseInt(e.target.value) || 12
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">عناصر اللوحة</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>تفعيل لوحة المعلومات</Label>
                  <Switch
                    checked={dashboardSettings.enableDashboard}
                    onCheckedChange={(checked) => setDashboardSettings({
                      ...dashboardSettings,
                      enableDashboard: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>إظهار مؤشرات الأداء الرئيسية</Label>
                  <Switch
                    checked={dashboardSettings.showKPIs}
                    onCheckedChange={(checked) => setDashboardSettings({
                      ...dashboardSettings,
                      showKPIs: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>إظهار الرسوم البيانية</Label>
                  <Switch
                    checked={dashboardSettings.showCharts}
                    onCheckedChange={(checked) => setDashboardSettings({
                      ...dashboardSettings,
                      showCharts: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>إظهار التنبيهات</Label>
                  <Switch
                    checked={dashboardSettings.showAlerts}
                    onCheckedChange={(checked) => setDashboardSettings({
                      ...dashboardSettings,
                      showAlerts: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>إظهار المعاملات الأخيرة</Label>
                  <Switch
                    checked={dashboardSettings.showRecentTransactions}
                    onCheckedChange={(checked) => setDashboardSettings({
                      ...dashboardSettings,
                      showRecentTransactions: checked
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">خيارات التفاعل</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>إظهار أفضل المنتجات</Label>
                  <Switch
                    checked={dashboardSettings.showTopProducts}
                    onCheckedChange={(checked) => setDashboardSettings({
                      ...dashboardSettings,
                      showTopProducts: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>إظهار مقاييس الأداء</Label>
                  <Switch
                    checked={dashboardSettings.showPerformanceMetrics}
                    onCheckedChange={(checked) => setDashboardSettings({
                      ...dashboardSettings,
                      showPerformanceMetrics: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تفعيل التفصيل التدريجي</Label>
                  <Switch
                    checked={dashboardSettings.enableDrillDown}
                    onCheckedChange={(checked) => setDashboardSettings({
                      ...dashboardSettings,
                      enableDrillDown: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تفعيل المرشحات</Label>
                  <Switch
                    checked={dashboardSettings.enableFilters}
                    onCheckedChange={(checked) => setDashboardSettings({
                      ...dashboardSettings,
                      enableFilters: checked
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            قوالب التقارير المجدولة ({reportTemplates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportTemplates.map((template) => (
              <Card key={template.id} className={`border-2 ${template.isActive ? 'border-primary/20 bg-primary/5' : 'border-muted bg-muted/20'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${template.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {getTypeIcon(template.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(template.type)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getFrequencyLabel(template.frequency)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {template.format.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={template.isActive ? "default" : "secondary"}>
                        {template.isActive ? "نشط" : "غير نشط"}
                      </Badge>
                      <Badge variant={template.autoGenerate ? "default" : "outline"}>
                        {template.autoGenerate ? "تلقائي" : "يدوي"}
                      </Badge>
                      <Switch
                        checked={template.isActive}
                        onCheckedChange={() => toggleReportTemplate(template.id)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">المستلمون:</div>
                      <div className="text-xs">{template.recipients.length} مستلم</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">آخر إنشاء:</div>
                      <div className="text-xs">منذ 2 ساعات</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Report Generation */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-primary">إنشاء تقرير تجريبي</h3>
              <p className="text-sm text-muted-foreground">اختبر إعدادات التقارير وتنسيقاتها</p>
            </div>
            <Button onClick={generateSampleReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              إنشاء تقرير تجريبي
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} className="min-w-32">
          {isLoading ? "جاري الحفظ..." : "حفظ إعدادات التقارير"}
        </Button>
      </div>
    </div>
  );
};

export default POSReportsSettings;