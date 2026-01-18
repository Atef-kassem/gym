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
  FileText, 
  ChevronLeft,
  Upload,
  Download,
  QrCode,
  Printer,
  Hash,
  Calendar,
  Building,
  Stamp,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InvoiceTemplate {
  id: string;
  name: string;
  type: "simple" | "detailed" | "thermal" | "electronic";
  isDefault: boolean;
  paperSize: string;
  includeHeader: boolean;
  includeLogo: boolean;
  includeFooter: boolean;
  includeQR: boolean;
  includeSignature: boolean;
}

const POSInvoiceSettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    companyName: "شركة رغوة المحدودة",
    companyNameEn: "Raghwa Company Ltd",
    taxNumber: "310123456789012",
    commercialRegister: "1234567890",
    address: "الرياض، المملكة العربية المصرية",
    addressEn: "Riyadh, Saudi Arabia",
    phone: "+966123456789",
    email: "info@raghwa.com",
    website: "www.raghwa.com",
    logoPath: "",
    signaturePath: "",
    footerText: "شكراً لزيارتكم - Thank you for visiting us",
    supportText: "للاستفسارات: 966123456789+"
  });

  const [numberingSettings, setNumberingSettings] = useState({
    autoNumbering: true,
    numberingFormat: "INV-{YYYY}-{MM}-{NNNN}",
    startingNumber: 1,
    resetPeriod: "yearly", // yearly, monthly, daily, never
    branchPrefix: true,
    devicePrefix: false,
    separateSequence: true, // separate sequence per branch/device
    includeDate: true,
    dateFormat: "YYYY/MM/DD"
  });

  const [zatcaSettings, setZatcaSettings] = useState({
    enableElectronicInvoice: true,
    simplifiedInvoice: true,
    standardInvoice: false,
    qrCodeEnabled: true,
    qrCodePosition: "bottom-right",
    zatcaCompliant: true,
    encryptionEnabled: true,
    digitalSignature: true,
    invoiceHash: true,
    previousInvoiceHash: true,
    certificatePath: "",
    environmentMode: "sandbox" // sandbox, production
  });

  const [printSettings, setPrintSettings] = useState({
    autoPrint: false,
    printCopies: 1,
    printPreview: true,
    thermalPrinter: true,
    paperWidth: "80mm",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 2,
    marginRight: 2,
    fontSize: "small",
    lineSpacing: "normal",
    printLogo: true,
    printQRCode: true,
    printFooter: true,
    cutPaper: true
  });

  const [draftSettings, setDraftSettings] = useState({
    enableDrafts: true,
    autoSaveDrafts: true,
    autoSaveInterval: 30, // seconds
    draftRetentionDays: 7,
    maxDraftsPerUser: 50,
    notifyDraftExpiry: true,
    allowDraftRecovery: true
  });

  const [templates, setTemplates] = useState<InvoiceTemplate[]>([
    {
      id: "1",
      name: "ايصال بسيطة",
      type: "simple",
      isDefault: true,
      paperSize: "A4",
      includeHeader: true,
      includeLogo: true,
      includeFooter: true,
      includeQR: true,
      includeSignature: false
    },
    {
      id: "2",
      name: "ايصال مفصلة",
      type: "detailed",
      isDefault: false,
      paperSize: "A4",
      includeHeader: true,
      includeLogo: true,
      includeFooter: true,
      includeQR: true,
      includeSignature: true
    },
    {
      id: "3",
      name: "إيصال حراري",
      type: "thermal",
      isDefault: false,
      paperSize: "80mm",
      includeHeader: true,
      includeLogo: false,
      includeFooter: true,
      includeQR: true,
      includeSignature: false
    }
  ]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("تم حفظ إعدادات الإيصالات بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate file upload
      toast.success("تم رفع الشعار بنجاح");
      setGeneralSettings({
        ...generalSettings,
        logoPath: URL.createObjectURL(file)
      });
    }
  };

  const setDefaultTemplate = (templateId: string) => {
    setTemplates(templates.map(template => ({
      ...template,
      isDefault: template.id === templateId
    })));
    toast.success("تم تعيين القالب كافتراضي");
  };

  const testZatcaConnection = async () => {
    try {
      toast.info("جاري اختبار الاتصال مع هيئة الزكاة...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("تم الاتصال بنجاح مع هيئة الزكاة والدخل");
    } catch (error) {
      toast.error("فشل في الاتصال مع هيئة الزكاة");
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
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">إعدادات الإيصالات</h1>
            <p className="text-muted-foreground">إدارة قوالب الطباعة والترقيم والإيصالات الإلكترونية</p>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            بيانات الشركة في الإيصالات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>اسم الشركة (عربي)</Label>
                <Input
                  value={generalSettings.companyName}
                  onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>اسم الشركة (إنجليزي)</Label>
                <Input
                  value={generalSettings.companyNameEn}
                  onChange={(e) => setGeneralSettings({...generalSettings, companyNameEn: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>الرقم الضريبي</Label>
                <Input
                  value={generalSettings.taxNumber}
                  onChange={(e) => setGeneralSettings({...generalSettings, taxNumber: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>السجل التجاري</Label>
                <Input
                  value={generalSettings.commercialRegister}
                  onChange={(e) => setGeneralSettings({...generalSettings, commercialRegister: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>العنوان</Label>
                <Textarea
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>رقم الهاتف</Label>
                <Input
                  value={generalSettings.phone}
                  onChange={(e) => setGeneralSettings({...generalSettings, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input
                  value={generalSettings.email}
                  onChange={(e) => setGeneralSettings({...generalSettings, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>شعار الشركة</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    رفع الشعار
                  </Button>
                  {generalSettings.logoPath && (
                    <Badge variant="outline" className="text-green-600">
                      تم الرفع
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Numbering */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            ترقيم الإيصالات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>تنسيق الترقيم</Label>
              <Select value={numberingSettings.numberingFormat} onValueChange={(value) => setNumberingSettings({...numberingSettings, numberingFormat: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INV-{YYYY}-{MM}-{NNNN}">INV-2024-01-0001</SelectItem>
                  <SelectItem value="INV-{YYYYMM}-{NNNN}">INV-202401-0001</SelectItem>
                  <SelectItem value="{BRANCH}-INV-{NNNN}">{"{BRANCH}"}-INV-0001</SelectItem>
                  <SelectItem value="POS-{DD}{MM}{YY}-{NNN}">POS-240115-001</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>رقم البداية</Label>
              <Input
                type="number"
                value={numberingSettings.startingNumber}
                onChange={(e) => setNumberingSettings({...numberingSettings, startingNumber: parseInt(e.target.value) || 1})}
              />
            </div>

            <div className="space-y-2">
              <Label>إعادة ضبط الترقيم</Label>
              <Select value={numberingSettings.resetPeriod} onValueChange={(value) => setNumberingSettings({...numberingSettings, resetPeriod: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">لا يعاد الضبط</SelectItem>
                  <SelectItem value="daily">يومياً</SelectItem>
                  <SelectItem value="monthly">شهرياً</SelectItem>
                  <SelectItem value="yearly">سنوياً</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>ترقيم تلقائي</Label>
                <Switch
                  checked={numberingSettings.autoNumbering}
                  onCheckedChange={(checked) => setNumberingSettings({...numberingSettings, autoNumbering: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>بادئة الفرع</Label>
                <Switch
                  checked={numberingSettings.branchPrefix}
                  onCheckedChange={(checked) => setNumberingSettings({...numberingSettings, branchPrefix: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>تسلسل منفصل لكل فرع</Label>
                <Switch
                  checked={numberingSettings.separateSequence}
                  onCheckedChange={(checked) => setNumberingSettings({...numberingSettings, separateSequence: checked})}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ZATCA Electronic Invoice Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            إعدادات الايصال الإلكترونية (ZATCA)
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              متوافق
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">إعدادات الامتثال</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>تفعيل الايصال الإلكترونية</Label>
                  <Switch
                    checked={zatcaSettings.enableElectronicInvoice}
                    onCheckedChange={(checked) => setZatcaSettings({...zatcaSettings, enableElectronicInvoice: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>الايصال الضريبية المبسطة</Label>
                  <Switch
                    checked={zatcaSettings.simplifiedInvoice}
                    onCheckedChange={(checked) => setZatcaSettings({...zatcaSettings, simplifiedInvoice: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>رمز QR</Label>
                  <Switch
                    checked={zatcaSettings.qrCodeEnabled}
                    onCheckedChange={(checked) => setZatcaSettings({...zatcaSettings, qrCodeEnabled: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>التوقيع الرقمي</Label>
                  <Switch
                    checked={zatcaSettings.digitalSignature}
                    onCheckedChange={(checked) => setZatcaSettings({...zatcaSettings, digitalSignature: checked})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">بيئة التشغيل</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>البيئة</Label>
                  <Select value={zatcaSettings.environmentMode} onValueChange={(value) => setZatcaSettings({...zatcaSettings, environmentMode: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">بيئة التجريب</SelectItem>
                      <SelectItem value="production">بيئة الإنتاج</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>موقع رمز QR</Label>
                  <Select value={zatcaSettings.qrCodePosition} onValueChange={(value) => setZatcaSettings({...zatcaSettings, qrCodePosition: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top-right">أعلى يمين</SelectItem>
                      <SelectItem value="top-left">أعلى يسار</SelectItem>
                      <SelectItem value="bottom-right">أسفل يمين</SelectItem>
                      <SelectItem value="bottom-left">أسفل يسار</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={testZatcaConnection} variant="outline" className="w-full">
                  اختبار الاتصال مع هيئة الزكاة
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Print Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            إعدادات الطباعة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>عدد النسخ</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={printSettings.printCopies}
                onChange={(e) => setPrintSettings({...printSettings, printCopies: parseInt(e.target.value) || 1})}
              />
            </div>

            <div className="space-y-2">
              <Label>عرض الورق</Label>
              <Select value={printSettings.paperWidth} onValueChange={(value) => setPrintSettings({...printSettings, paperWidth: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="80mm">80 مم</SelectItem>
                  <SelectItem value="58mm">58 مم</SelectItem>
                  <SelectItem value="A4">A4</SelectItem>
                  <SelectItem value="A5">A5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>حجم الخط</Label>
              <Select value={printSettings.fontSize} onValueChange={(value) => setPrintSettings({...printSettings, fontSize: value})}>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>طباعة تلقائية</Label>
                <Switch
                  checked={printSettings.autoPrint}
                  onCheckedChange={(checked) => setPrintSettings({...printSettings, autoPrint: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>معاينة قبل الطباعة</Label>
                <Switch
                  checked={printSettings.printPreview}
                  onCheckedChange={(checked) => setPrintSettings({...printSettings, printPreview: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>طباعة الشعار</Label>
                <Switch
                  checked={printSettings.printLogo}
                  onCheckedChange={(checked) => setPrintSettings({...printSettings, printLogo: checked})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>طباعة رمز QR</Label>
                <Switch
                  checked={printSettings.printQRCode}
                  onCheckedChange={(checked) => setPrintSettings({...printSettings, printQRCode: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>قطع الورق تلقائياً</Label>
                <Switch
                  checked={printSettings.cutPaper}
                  onCheckedChange={(checked) => setPrintSettings({...printSettings, cutPaper: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>طابعة حرارية</Label>
                <Switch
                  checked={printSettings.thermalPrinter}
                  onCheckedChange={(checked) => setPrintSettings({...printSettings, thermalPrinter: checked})}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Draft Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            إعدادات المسودات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>فترة الاحتفاظ بالمسودات (أيام)</Label>
              <Input
                type="number"
                min="1"
                max="30"
                value={draftSettings.draftRetentionDays}
                onChange={(e) => setDraftSettings({...draftSettings, draftRetentionDays: parseInt(e.target.value) || 7})}
              />
            </div>

            <div className="space-y-2">
              <Label>فترة الحفظ التلقائي (ثانية)</Label>
              <Input
                type="number"
                min="10"
                max="300"
                value={draftSettings.autoSaveInterval}
                onChange={(e) => setDraftSettings({...draftSettings, autoSaveInterval: parseInt(e.target.value) || 30})}
              />
            </div>

            <div className="space-y-2">
              <Label>حد أقصى للمسودات لكل مستخدم</Label>
              <Input
                type="number"
                min="10"
                max="100"
                value={draftSettings.maxDraftsPerUser}
                onChange={(e) => setDraftSettings({...draftSettings, maxDraftsPerUser: parseInt(e.target.value) || 50})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>تفعيل المسودات</Label>
                <Switch
                  checked={draftSettings.enableDrafts}
                  onCheckedChange={(checked) => setDraftSettings({...draftSettings, enableDrafts: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>حفظ تلقائي للمسودات</Label>
                <Switch
                  checked={draftSettings.autoSaveDrafts}
                  onCheckedChange={(checked) => setDraftSettings({...draftSettings, autoSaveDrafts: checked})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>تنبيه انتهاء صلاحية المسودة</Label>
                <Switch
                  checked={draftSettings.notifyDraftExpiry}
                  onCheckedChange={(checked) => setDraftSettings({...draftSettings, notifyDraftExpiry: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>السماح باسترداد المسودات</Label>
                <Switch
                  checked={draftSettings.allowDraftRecovery}
                  onCheckedChange={(checked) => setDraftSettings({...draftSettings, allowDraftRecovery: checked})}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stamp className="h-5 w-5" />
            قوالب الإيصالات ({templates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className={`border-2 ${template.isDefault ? 'border-primary bg-primary/5' : 'border-muted'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{template.name}</h3>
                    <div className="flex items-center gap-2">
                      {template.isDefault && (
                        <Badge variant="default">افتراضي</Badge>
                      )}
                      <Badge variant="outline">{template.paperSize}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className={`h-3 w-3 ${template.includeHeader ? 'text-green-500' : 'text-gray-300'}`} />
                      <span>ج.م الصفحة</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className={`h-3 w-3 ${template.includeLogo ? 'text-green-500' : 'text-gray-300'}`} />
                      <span>الشعار</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className={`h-3 w-3 ${template.includeQR ? 'text-green-500' : 'text-gray-300'}`} />
                      <span>رمز QR</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className={`h-3 w-3 ${template.includeSignature ? 'text-green-500' : 'text-gray-300'}`} />
                      <span>التوقيع</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2 border-t">
                    {!template.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setDefaultTemplate(template.id)}
                        className="flex-1"
                      >
                        تعيين كافتراضي
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="flex-1">
                      معاينة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Warning Card */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-semibold text-orange-800">ملاحظات مهمة</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• تأكد من صحة الرقم الضريبي والسجل التجاري</li>
                <li>• راجع متطلبات هيئة الزكاة والدخل للإيصالات الإلكترونية</li>
                <li>• اختبر الطباعة على جميع الطابعات المستخدمة</li>
                <li>• احتفظ بنسخة احتياطية من الشهادات الرقمية</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} className="min-w-32">
          {isLoading ? "جاري الحفظ..." : "حفظ إعدادات الإيصالات"}
        </Button>
      </div>
    </div>
  );
};

export default POSInvoiceSettings;