import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save, Settings } from "lucide-react";

const AccountingSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    fiscalYearStart: "01-01",
    currency: "EGP",
    currencySymbol: "ج.م",
    autoPostEntries: false,
    requireApproval: true,
    defaultJournalEntryType: "daily",
    accountNumberFormat: "####",
    enableDoubleEntry: true,
  });

  const handleSave = () => {
    toast({
      title: "نجح",
      description: "تم حفظ الإعدادات بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-8 h-8 text-blue-600" />
            إعدادات المحاسبة المالية
          </h1>
          <p className="text-gray-600 mt-1">إعدادات النظام المحاسبي</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>الإعدادات العامة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>بداية السنة المالية</Label>
                <Input type="date" value={settings.fiscalYearStart} onChange={(e) => setSettings({ ...settings, fiscalYearStart: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>العملة</Label>
                <Input value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>رمز العملة</Label>
                <Input value={settings.currencySymbol} onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>تنسيق رقم الحساب</Label>
                <Input value={settings.accountNumberFormat} onChange={(e) => setSettings({ ...settings, accountNumberFormat: e.target.value })} placeholder="####" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>الترحيل التلقائي للقيود</Label>
                  <p className="text-sm text-gray-500">ترحيل القيود تلقائياً بعد الحفظ</p>
                </div>
                <Switch checked={settings.autoPostEntries} onCheckedChange={(checked) => setSettings({ ...settings, autoPostEntries: checked })} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>يتطلب الموافقة</Label>
                  <p className="text-sm text-gray-500">يتطلب الموافقة قبل ترحيل القيود</p>
                </div>
                <Switch checked={settings.requireApproval} onCheckedChange={(checked) => setSettings({ ...settings, requireApproval: checked })} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>القيد المزدوج</Label>
                  <p className="text-sm text-gray-500">تفعيل نظام القيد المزدوج</p>
                </div>
                <Switch checked={settings.enableDoubleEntry} onCheckedChange={(checked) => setSettings({ ...settings, enableDoubleEntry: checked })} />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ الإعدادات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountingSettings;

