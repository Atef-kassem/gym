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
  Package, 
  ChevronLeft,
  AlertTriangle,
  TrendingDown,
  Percent,
  Tag,
  Target,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StockPolicy {
  id: string;
  name: string;
  category: string;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  isActive: boolean;
}

const POSInventorySettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [stockSettings, setStockSettings] = useState({
    allowNegativeStock: false,
    warnLowStock: true,
    lowStockThreshold: 10,
    autoReorder: false,
    reorderLeadTime: 7, // days
    stockCheckFrequency: "daily", // daily, weekly, realtime
    enableStockReservation: true,
    reservationTimeout: 30, // minutes
    trackExpiryDates: true,
    expiryWarningDays: 30,
    enableBatchTracking: false,
    enableSerialTracking: false
  });

  const [pricingSettings, setPricingSettings] = useState({
    allowPriceOverride: false,
    maxPriceOverride: 20, // percentage
    requireApprovalAbove: 1000,
    enableDynamicPricing: false,
    priceUpdateFrequency: "manual", // manual, daily, weekly
    enablePromotions: true,
    maxDiscountPercent: 50,
    combinableDiscounts: false,
    loyaltyDiscounts: true,
    enableHappyHour: false,
    happyHourStart: "14:00",
    happyHourEnd: "17:00",
    happyHourDiscount: 15
  });

  const [categorySettings, setCategorySettings] = useState({
    enableCategoryLimits: false,
    categorySpecificTax: true,
    enableSeasonalPricing: false,
    enableBundleDeals: true,
    crossSelling: true,
    upselling: true,
    categoryBasedDiscounts: true,
    hideOutOfStock: false,
    showStockCount: true,
    enablePreOrders: false,
    preOrderLeadTime: 3 // days
  });

  const [salesSettings, setSalesSettings] = useState({
    enableQuickSale: true,
    requireCustomerInfo: false,
    enableLayaway: false,
    layawayDepositPercent: 30,
    layawayTimeout: 30, // days
    enableGiftCards: true,
    giftCardExpiry: 365, // days
    enableRefunds: true,
    refundTimeLimit: 7, // days
    refundRequireReceipt: true,
    enableExchanges: true,
    exchangeTimeLimit: 14, // days
    partialRefunds: true
  });

  const [stockPolicies, setStockPolicies] = useState<StockPolicy[]>([
    {
      id: "1",
      name: "منتجات التنظيف",
      category: "cleaning",
      minStock: 20,
      maxStock: 200,
      reorderPoint: 30,
      isActive: true
    },
    {
      id: "2", 
      name: "أدوات ال ",
      category: "tools",
      minStock: 10,
      maxStock: 100,
      reorderPoint: 15,
      isActive: true
    },
    {
      id: "3",
      name: "العطور والمعطرات",
      category: "fragrances",
      minStock: 15,
      maxStock: 150,
      reorderPoint: 25,
      isActive: false
    }
  ]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("تم حفظ إعدادات المخزون بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStockPolicy = (policyId: string) => {
    setStockPolicies(policies =>
      policies.map(policy =>
        policy.id === policyId ? { ...policy, isActive: !policy.isActive } : policy
      )
    );
    toast.success("تم تحديث سياسة المخزون");
  };

  const testInventorySync = async () => {
    try {
      toast.info("جاري مزامنة المخزون...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("تم مزامنة المخزون بنجاح مع نقاط البيع");
    } catch (error) {
      toast.error("فشل في مزامنة المخزون");
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
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">إعدادات المخزون لنقاط البيع</h1>
            <p className="text-muted-foreground">إدارة سياسات البيع والخصومات والعروض الترويجية</p>
          </div>
        </div>
      </div>

      {/* Stock Management Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            إدارة المخزون
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>حد التنبيه للمخزون المنخفض</Label>
              <Input
                type="number"
                min="1"
                value={stockSettings.lowStockThreshold}
                onChange={(e) => setStockSettings({
                  ...stockSettings,
                  lowStockThreshold: parseInt(e.target.value) || 10
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>مهلة إعادة الطلب (أيام)</Label>
              <Input
                type="number"
                min="1"
                max="30"
                value={stockSettings.reorderLeadTime}
                onChange={(e) => setStockSettings({
                  ...stockSettings,
                  reorderLeadTime: parseInt(e.target.value) || 7
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>مهلة انتهاء الحجز (دقيقة)</Label>
              <Input
                type="number"
                min="5"
                max="120"
                value={stockSettings.reservationTimeout}
                onChange={(e) => setStockSettings({
                  ...stockSettings,
                  reservationTimeout: parseInt(e.target.value) || 30
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>تكرار فحص المخزون</Label>
              <Select value={stockSettings.stockCheckFrequency} onValueChange={(value) => setStockSettings({...stockSettings, stockCheckFrequency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">فوري</SelectItem>
                  <SelectItem value="daily">يومي</SelectItem>
                  <SelectItem value="weekly">أسبوعي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>أيام تحذير انتهاء الصلاحية</Label>
              <Input
                type="number"
                min="1"
                max="365"
                value={stockSettings.expiryWarningDays}
                onChange={(e) => setStockSettings({
                  ...stockSettings,
                  expiryWarningDays: parseInt(e.target.value) || 30
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">سياسات المخزون</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>السماح بالبيع عند نفاد المخزون</Label>
                  <Switch
                    checked={stockSettings.allowNegativeStock}
                    onCheckedChange={(checked) => setStockSettings({
                      ...stockSettings,
                      allowNegativeStock: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تحذير المخزون المنخفض</Label>
                  <Switch
                    checked={stockSettings.warnLowStock}
                    onCheckedChange={(checked) => setStockSettings({
                      ...stockSettings,
                      warnLowStock: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>الطلب التلقائي للمخزون</Label>
                  <Switch
                    checked={stockSettings.autoReorder}
                    onCheckedChange={(checked) => setStockSettings({
                      ...stockSettings,
                      autoReorder: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>حجز المخزون للطلبات</Label>
                  <Switch
                    checked={stockSettings.enableStockReservation}
                    onCheckedChange={(checked) => setStockSettings({
                      ...stockSettings,
                      enableStockReservation: checked
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">تتبع المنتجات</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>تتبع تواريخ الانتهاء</Label>
                  <Switch
                    checked={stockSettings.trackExpiryDates}
                    onCheckedChange={(checked) => setStockSettings({
                      ...stockSettings,
                      trackExpiryDates: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تتبع الدفعات</Label>
                  <Switch
                    checked={stockSettings.enableBatchTracking}
                    onCheckedChange={(checked) => setStockSettings({
                      ...stockSettings,
                      enableBatchTracking: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تتبع الأرقام التسلسلية</Label>
                  <Switch
                    checked={stockSettings.enableSerialTracking}
                    onCheckedChange={(checked) => setStockSettings({
                      ...stockSettings,
                      enableSerialTracking: checked
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            إعدادات التسعير والخصومات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>حد أقصى لتجاوز السعر (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={pricingSettings.maxPriceOverride}
                onChange={(e) => setPricingSettings({
                  ...pricingSettings,
                  maxPriceOverride: parseInt(e.target.value) || 20
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>يتطلب موافقة فوق (جنيه)</Label>
              <Input
                type="number"
                value={pricingSettings.requireApprovalAbove}
                onChange={(e) => setPricingSettings({
                  ...pricingSettings,
                  requireApprovalAbove: parseInt(e.target.value) || 1000
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>حد أقصى للخصم (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={pricingSettings.maxDiscountPercent}
                onChange={(e) => setPricingSettings({
                  ...pricingSettings,
                  maxDiscountPercent: parseInt(e.target.value) || 50
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>وقت بداية العروض الخاصة</Label>
              <Input
                type="time"
                value={pricingSettings.happyHourStart}
                onChange={(e) => setPricingSettings({
                  ...pricingSettings,
                  happyHourStart: e.target.value
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>وقت نهاية العروض الخاصة</Label>
              <Input
                type="time"
                value={pricingSettings.happyHourEnd}
                onChange={(e) => setPricingSettings({
                  ...pricingSettings,
                  happyHourEnd: e.target.value
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>خصم العروض الخاصة (%)</Label>
              <Input
                type="number"
                min="0"
                max="50"
                value={pricingSettings.happyHourDiscount}
                onChange={(e) => setPricingSettings({
                  ...pricingSettings,
                  happyHourDiscount: parseInt(e.target.value) || 15
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Percent className="h-4 w-4" />
                سياسات التسعير
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>السماح بتجاوز الأسعار</Label>
                  <Switch
                    checked={pricingSettings.allowPriceOverride}
                    onCheckedChange={(checked) => setPricingSettings({
                      ...pricingSettings,
                      allowPriceOverride: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>التسعير الديناميكي</Label>
                  <Switch
                    checked={pricingSettings.enableDynamicPricing}
                    onCheckedChange={(checked) => setPricingSettings({
                      ...pricingSettings,
                      enableDynamicPricing: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تفعيل العروض الترويجية</Label>
                  <Switch
                    checked={pricingSettings.enablePromotions}
                    onCheckedChange={(checked) => setPricingSettings({
                      ...pricingSettings,
                      enablePromotions: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>دمج الخصومات</Label>
                  <Switch
                    checked={pricingSettings.combinableDiscounts}
                    onCheckedChange={(checked) => setPricingSettings({
                      ...pricingSettings,
                      combinableDiscounts: checked
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Target className="h-4 w-4" />
                العروض الخاصة
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>خصومات الولاء</Label>
                  <Switch
                    checked={pricingSettings.loyaltyDiscounts}
                    onCheckedChange={(checked) => setPricingSettings({
                      ...pricingSettings,
                      loyaltyDiscounts: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تفعيل العروض الزمنية</Label>
                  <Switch
                    checked={pricingSettings.enableHappyHour}
                    onCheckedChange={(checked) => setPricingSettings({
                      ...pricingSettings,
                      enableHappyHour: checked
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            إعدادات المبيعات والإرجاع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>نسبة عربون الحجز (%)</Label>
              <Input
                type="number"
                min="10"
                max="100"
                value={salesSettings.layawayDepositPercent}
                onChange={(e) => setSalesSettings({
                  ...salesSettings,
                  layawayDepositPercent: parseInt(e.target.value) || 30
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>مهلة الحجز (أيام)</Label>
              <Input
                type="number"
                min="1"
                max="90"
                value={salesSettings.layawayTimeout}
                onChange={(e) => setSalesSettings({
                  ...salesSettings,
                  layawayTimeout: parseInt(e.target.value) || 30
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>صلاحية بطاقة الهدايا (أيام)</Label>
              <Input
                type="number"
                min="30"
                max="3650"
                value={salesSettings.giftCardExpiry}
                onChange={(e) => setSalesSettings({
                  ...salesSettings,
                  giftCardExpiry: parseInt(e.target.value) || 365
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>مهلة الإرجاع (أيام)</Label>
              <Input
                type="number"
                min="1"
                max="30"
                value={salesSettings.refundTimeLimit}
                onChange={(e) => setSalesSettings({
                  ...salesSettings,
                  refundTimeLimit: parseInt(e.target.value) || 7
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>مهلة الاستبدال (أيام)</Label>
              <Input
                type="number"
                min="1"
                max="30"
                value={salesSettings.exchangeTimeLimit}
                onChange={(e) => setSalesSettings({
                  ...salesSettings,
                  exchangeTimeLimit: parseInt(e.target.value) || 14
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">خيارات البيع</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>البيع السريع</Label>
                  <Switch
                    checked={salesSettings.enableQuickSale}
                    onCheckedChange={(checked) => setSalesSettings({
                      ...salesSettings,
                      enableQuickSale: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>طلب بيانات العميل</Label>
                  <Switch
                    checked={salesSettings.requireCustomerInfo}
                    onCheckedChange={(checked) => setSalesSettings({
                      ...salesSettings,
                      requireCustomerInfo: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تفعيل نظام الحجز</Label>
                  <Switch
                    checked={salesSettings.enableLayaway}
                    onCheckedChange={(checked) => setSalesSettings({
                      ...salesSettings,
                      enableLayaway: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>بطاقات الهدايا</Label>
                  <Switch
                    checked={salesSettings.enableGiftCards}
                    onCheckedChange={(checked) => setSalesSettings({
                      ...salesSettings,
                      enableGiftCards: checked
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">سياسات الإرجاع</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>السماح بالإرجاع</Label>
                  <Switch
                    checked={salesSettings.enableRefunds}
                    onCheckedChange={(checked) => setSalesSettings({
                      ...salesSettings,
                      enableRefunds: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>طلب الإيصال للإرجاع</Label>
                  <Switch
                    checked={salesSettings.refundRequireReceipt}
                    onCheckedChange={(checked) => setSalesSettings({
                      ...salesSettings,
                      refundRequireReceipt: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>السماح بالاستبدال</Label>
                  <Switch
                    checked={salesSettings.enableExchanges}
                    onCheckedChange={(checked) => setSalesSettings({
                      ...salesSettings,
                      enableExchanges: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>الإرجاع الجزئي</Label>
                  <Switch
                    checked={salesSettings.partialRefunds}
                    onCheckedChange={(checked) => setSalesSettings({
                      ...salesSettings,
                      partialRefunds: checked
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            سياسات المخزون حسب الفئة ({stockPolicies.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stockPolicies.map((policy) => (
              <Card key={policy.id} className={`border-2 ${policy.isActive ? 'border-primary/20 bg-primary/5' : 'border-muted bg-muted/20'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${policy.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{policy.name}</h3>
                        <p className="text-xs text-muted-foreground">فئة: {policy.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={policy.isActive ? "default" : "secondary"}>
                        {policy.isActive ? "نشط" : "غير نشط"}
                      </Badge>
                      <Switch
                        checked={policy.isActive}
                        onCheckedChange={() => toggleStockPolicy(policy.id)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-2 rounded border">
                      <div className="text-xs text-muted-foreground">حد أدنى</div>
                      <div className="font-semibold text-orange-600">{policy.minStock}</div>
                    </div>
                    <div className="text-center p-2 rounded border">
                      <div className="text-xs text-muted-foreground">نقطة إعادة الطلب</div>
                      <div className="font-semibold text-blue-600">{policy.reorderPoint}</div>
                    </div>
                    <div className="text-center p-2 rounded border">
                      <div className="text-xs text-muted-foreground">حد أقصى</div>
                      <div className="font-semibold text-green-600">{policy.maxStock}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Sync */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-primary">مزامنة المخزون</h3>
              <p className="text-sm text-muted-foreground">تحديث المخزون عبر جميع نقاط البيع</p>
            </div>
            <Button onClick={testInventorySync} variant="outline">
              <Package className="h-4 w-4 mr-2" />
              مزامنة الآن
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Warning Card */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-semibold text-orange-800">تنبيهات مهمة</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• راجع حدود المخزون بانتظام حسب الطلب</li>
                <li>• تأكد من تحديث الأسعار قبل تفعيل العروض</li>
                <li>• اختبج.مياسات الإرجاع مع فريق العمل</li>
                <li>• راقب تأثير الخصومات على الربحية</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} className="min-w-32">
          {isLoading ? "جاري الحفظ..." : "حفظ إعدادات المخزون"}
        </Button>
      </div>
    </div>
  );
};

export default POSInventorySettings;