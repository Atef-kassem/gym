import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  CreditCard, 
  ChevronLeft,
  Banknote,
  Smartphone,
  Building,
  Globe,
  Shield,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PaymentMethod {
  id: string;
  name: string;
  nameEn: string;
  isEnabled: boolean;
  icon: string;
  fees: number;
  maxAmount: number;
  minAmount: number;
  supportsMixedPayment: boolean;
}

const POSPaymentSettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "cash",
      name: "نقدي",
      nameEn: "Cash",
      isEnabled: true,
      icon: "banknote",
      fees: 0,
      maxAmount: 50000,
      minAmount: 0,
      supportsMixedPayment: true
    },
    {
      id: "mada",
      name: "مدى",
      nameEn: "Mada",
      isEnabled: true,
      icon: "credit-card",
      fees: 2.5,
      maxAmount: 100000,
      minAmount: 1,
      supportsMixedPayment: true
    },
    {
      id: "visa",
      name: "فيزا/ماستركارد",
      nameEn: "Visa/Mastercard",
      isEnabled: true,
      icon: "credit-card",
      fees: 3.5,
      maxAmount: 200000,
      minAmount: 5,
      supportsMixedPayment: true
    },
    {
      id: "applepay",
      name: "أبل باي",
      nameEn: "Apple Pay",
      isEnabled: false,
      icon: "smartphone",
      fees: 2.8,
      maxAmount: 100000,
      minAmount: 1,
      supportsMixedPayment: true
    },
    {
      id: "stcpay",
      name: "STC Pay",
      nameEn: "STC Pay",
      isEnabled: false,
      icon: "smartphone",
      fees: 2.0,
      maxAmount: 50000,
      minAmount: 1,
      supportsMixedPayment: true
    },
    {
      id: "bank_transfer",
      name: "تحويل بنكي",
      nameEn: "Bank Transfer",
      isEnabled: false,
      icon: "building",
      fees: 5.0,
      maxAmount: 1000000,
      minAmount: 100,
      supportsMixedPayment: false
    }
  ]);

  const [generalSettings, setGeneralSettings] = useState({
    allowMixedPayments: true,
    globalMaxTransaction: 500000,
    requireReceiptPrint: true,
    allowCreditSales: false,
    creditSaleLimit: 100000,
    cashierOverrideLimit: 10000,
    managerApprovalRequired: 50000,
    autoCalculateChange: true,
    roundingPolicy: "nearest_5_halalas", // nearest_5_halalas, nearest_riyal, no_rounding
    tipOption: false,
    refundPolicy: "full_refund_7_days"
  });

  const [securitySettings, setSecuritySettings] = useState({
    pinRequiredAbove: 1000,
    managerPinForRefunds: true,
    logAllTransactions: true,
    fraudDetection: true,
    velocityChecks: true,
    maxDailyTransactions: 1000000,
    requireSignatureAbove: 500,
    receiptMandatory: true
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("تم حفظ إعدادات الدفع بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePaymentMethod = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method =>
        method.id === id ? { ...method, isEnabled: !method.isEnabled } : method
      )
    );
  };

  const updatePaymentMethod = (id: string, field: keyof PaymentMethod, value: any) => {
    setPaymentMethods(methods =>
      methods.map(method =>
        method.id === id ? { ...method, [field]: value } : method
      )
    );
  };

  const getPaymentIcon = (iconType: string) => {
    switch (iconType) {
      case "banknote": return <Banknote className="h-5 w-5" />;
      case "credit-card": return <CreditCard className="h-5 w-5" />;
      case "smartphone": return <Smartphone className="h-5 w-5" />;
      case "building": return <Building className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  const enabledMethods = paymentMethods.filter(method => method.isEnabled);

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
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">إعدادات طرق الدفع</h1>
            <p className="text-muted-foreground">إدارة وسائل الدفع والحدود المالية وسياسات الأمان</p>
          </div>
        </div>
      </div>

      {/* Payment Methods Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              طرق الدفع المتاحة ({enabledMethods.length}/{paymentMethods.length})
            </span>
            <Badge variant="outline" className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              يدعم الدفع المختلط
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <Card key={method.id} className={`border-2 ${method.isEnabled ? 'border-primary/20 bg-primary/5' : 'border-muted bg-muted/20'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${method.isEnabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {getPaymentIcon(method.icon)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{method.name}</h3>
                        <p className="text-xs text-muted-foreground">{method.nameEn}</p>
                      </div>
                    </div>
                    <Switch
                      checked={method.isEnabled}
                      onCheckedChange={() => togglePaymentMethod(method.id)}
                    />
                  </div>

                  {method.isEnabled && (
                    <div className="space-y-3 pt-3 border-t">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">رسوم %</Label>
                          <Input
                            type="number"
                            value={method.fees}
                            onChange={(e) => updatePaymentMethod(method.id, 'fees', parseFloat(e.target.value) || 0)}
                            className="h-8 text-sm"
                            step="0.1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">حد أقصى</Label>
                          <Input
                            type="number"
                            value={method.maxAmount}
                            onChange={(e) => updatePaymentMethod(method.id, 'maxAmount', parseInt(e.target.value) || 0)}
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">دفع مختلط:</span>
                        <Switch
                          checked={method.supportsMixedPayment}
                          onCheckedChange={(checked) => updatePaymentMethod(method.id, 'supportsMixedPayment', checked)}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* General Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            الإعدادات العامة للدفع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>الحد الأقصى للعملية الواحدة (جنيه)</Label>
              <Input
                type="number"
                value={generalSettings.globalMaxTransaction}
                onChange={(e) => setGeneralSettings({
                  ...generalSettings,
                  globalMaxTransaction: parseInt(e.target.value) || 0
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>حد الصلاحية للكاشير (جنيه)</Label>
              <Input
                type="number"
                value={generalSettings.cashierOverrideLimit}
                onChange={(e) => setGeneralSettings({
                  ...generalSettings,
                  cashierOverrideLimit: parseInt(e.target.value) || 0
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>يتطلب موافقة المدير فوق (جنيه)</Label>
              <Input
                type="number"
                value={generalSettings.managerApprovalRequired}
                onChange={(e) => setGeneralSettings({
                  ...generalSettings,
                  managerApprovalRequired: parseInt(e.target.value) || 0
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>حد البيع الآجل (جنيه)</Label>
              <Input
                type="number"
                value={generalSettings.creditSaleLimit}
                onChange={(e) => setGeneralSettings({
                  ...generalSettings,
                  creditSaleLimit: parseInt(e.target.value) || 0
                })}
                disabled={!generalSettings.allowCreditSales}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">خيارات الدفع</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>السماح بالدفع المختلط</Label>
                  <Switch
                    checked={generalSettings.allowMixedPayments}
                    onCheckedChange={(checked) => setGeneralSettings({
                      ...generalSettings,
                      allowMixedPayments: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>السماح بالبيع الآجل</Label>
                  <Switch
                    checked={generalSettings.allowCreditSales}
                    onCheckedChange={(checked) => setGeneralSettings({
                      ...generalSettings,
                      allowCreditSales: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>حساب الباقي تلقائياً</Label>
                  <Switch
                    checked={generalSettings.autoCalculateChange}
                    onCheckedChange={(checked) => setGeneralSettings({
                      ...generalSettings,
                      autoCalculateChange: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>إلزامية طباعة الإيصال</Label>
                  <Switch
                    checked={generalSettings.requireReceiptPrint}
                    onCheckedChange={(checked) => setGeneralSettings({
                      ...generalSettings,
                      requireReceiptPrint: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تفعيل خيار البقشيش</Label>
                  <Switch
                    checked={generalSettings.tipOption}
                    onCheckedChange={(checked) => setGeneralSettings({
                      ...generalSettings,
                      tipOption: checked
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">سياسات الأمان</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>مطلوب PIN فوق (جنيه)</Label>
                  <Input
                    type="number"
                    value={securitySettings.pinRequiredAbove}
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings,
                      pinRequiredAbove: parseInt(e.target.value) || 0
                    })}
                    className="w-24"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>PIN المدير للمرتجعات</Label>
                  <Switch
                    checked={securitySettings.managerPinForRefunds}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      managerPinForRefunds: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تسجيل جميع العمليات</Label>
                  <Switch
                    checked={securitySettings.logAllTransactions}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      logAllTransactions: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>كشف الاحتيال</Label>
                  <Switch
                    checked={securitySettings.fraudDetection}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      fraudDetection: checked
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning Card */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-semibold text-orange-800">تنبيهات مهمة</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• تأكد من تفعيل وسائل الدفع المناسبة لفروعك</li>
                <li>• حدد الحد الأقصى للعمليات بما يتناسب مع سياسة الشركة</li>
                <li>• راجع رسوم الدفع مع مقدمي الخدمة</li>
                <li>• فعّل كشف الاحتيال لحماية إضافية</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} className="min-w-32">
          {isLoading ? "جاري الحفظ..." : "حفظ إعدادات الدفع"}
        </Button>
      </div>
    </div>
  );
};

export default POSPaymentSettings;