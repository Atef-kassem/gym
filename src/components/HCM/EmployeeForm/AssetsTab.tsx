import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Monitor, Smartphone, Car, ShirtIcon, CreditCard, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface AssetsTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

const AssetsTab = ({ formData, setFormData }: AssetsTabProps) => {
  const [newAsset, setNewAsset] = useState({
    type: "",
    name: "",
    serialNumber: "",
    assignedDate: "",
    condition: "جيد",
    notes: ""
  });

  const handleAssetsChange = (assets: any[]) => {
    setFormData({
      ...formData,
      assets: assets
    });
  };

  const addAsset = () => {
    if (newAsset.name && newAsset.type) {
      const assets = formData.assets || [];
      handleAssetsChange([...assets, { ...newAsset, id: Date.now() }]);
      setNewAsset({
        type: "",
        name: "",
        serialNumber: "",
        assignedDate: "",
        condition: "جيد",
        notes: ""
      });
    }
  };

  const removeAsset = (assetId: number) => {
    const assets = formData.assets || [];
    handleAssetsChange(assets.filter((asset: any) => asset.id !== assetId));
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "جهاز كمبيوتر": return <Monitor className="w-4 h-4" />;
      case "جوال": return <Smartphone className="w-4 h-4" />;
      case "مشروب": return <Car className="w-4 h-4" />;
      case "زي موحد": return <ShirtIcon className="w-4 h-4" />;
      case "بطاقة": return <CreditCard className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* إضافة عهدة جديدة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            إضافة عهدة جديدة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assetType">نوع العهدة *</Label>
              <Select value={newAsset.type} onValueChange={(value) => setNewAsset({...newAsset, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع العهدة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="جهاز كمبيوتر">جهاز كمبيوتر</SelectItem>
                  <SelectItem value="لابتوب">لابتوب</SelectItem>
                  <SelectItem value="جوال">جوال</SelectItem>
                  <SelectItem value="طابعة">طابعة</SelectItem>
                  <SelectItem value="مشروب">مشروب</SelectItem>
                  <SelectItem value="زي موحد">زي موحد</SelectItem>
                  <SelectItem value="بطاقة">بطاقة دخول</SelectItem>
                  <SelectItem value="أدوات">أدوات عمل</SelectItem>
                  <SelectItem value="أثاث">أثاث مكتب</SelectItem>
                  <SelectItem value="أخرى">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assetName">اسم/وصف العهدة *</Label>
              <Input
                id="assetName"
                value={newAsset.name}
                onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                placeholder="مثل: لابتوب Dell Latitude"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">الرقم التسلسلي/الهوية</Label>
              <Input
                id="serialNumber"
                value={newAsset.serialNumber}
                onChange={(e) => setNewAsset({...newAsset, serialNumber: e.target.value})}
                placeholder="الرقم التسلسلي أو رقم الهوية"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedDate">تاريخ التسليم</Label>
              <Input
                id="assignedDate"
                type="date"
                value={newAsset.assignedDate}
                onChange={(e) => setNewAsset({...newAsset, assignedDate: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">الحالة</Label>
              <Select value={newAsset.condition} onValueChange={(value) => setNewAsset({...newAsset, condition: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ممتاز">ممتاز</SelectItem>
                  <SelectItem value="جيد">جيد</SelectItem>
                  <SelectItem value="متوسط">متوسط</SelectItem>
                  <SelectItem value="يحتاج صيانة">يحتاج صيانة</SelectItem>
                  <SelectItem value="تالف">تالف</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="assetNotes">ملاحظات</Label>
              <Textarea
                id="assetNotes"
                value={newAsset.notes}
                onChange={(e) => setNewAsset({...newAsset, notes: e.target.value})}
                placeholder="أي ملاحظات إضافية..."
                rows={2}
              />
            </div>
          </div>

          <Button onClick={addAsset} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            إضافة العهدة
          </Button>
        </CardContent>
      </Card>

      {/* قائمة العهد الحالية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            العهد المسلمة للموظف
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(!formData.assets || formData.assets.length === 0) ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد عهد مسلمة للموظف حالياً
            </div>
          ) : (
            <div className="space-y-4">
              {formData.assets.map((asset: any, index: number) => (
                <div key={asset.id || index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getAssetIcon(asset.type)}
                      <span className="font-medium">{asset.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={asset.condition === "ممتاز" || asset.condition === "جيد" ? "default" : "destructive"}
                      >
                        {asset.condition}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeAsset(asset.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">النوع:</span> {asset.type}
                    </div>
                    {asset.serialNumber && (
                      <div>
                        <span className="font-medium">الرقم التسلسلي:</span> {asset.serialNumber}
                      </div>
                    )}
                    {asset.assignedDate && (
                      <div>
                        <span className="font-medium">تاريخ التسليم:</span> {asset.assignedDate}
                      </div>
                    )}
                  </div>
                  
                  {asset.notes && (
                    <div className="text-sm">
                      <span className="font-medium">ملاحظات:</span> {asset.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ملخص العهد */}
      <Card>
        <CardHeader>
          <CardTitle>ملخص العهد</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">
                {formData.assets?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">إجمالي العهد</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {formData.assets?.filter((asset: any) => asset.condition === "ممتاز" || asset.condition === "جيد").length || 0}
              </div>
              <div className="text-sm text-muted-foreground">حالة جيدة</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-yellow-600">
                {formData.assets?.filter((asset: any) => asset.condition === "متوسط" || asset.condition === "يحتاج صيانة").length || 0}
              </div>
              <div className="text-sm text-muted-foreground">تحتاج صيانة</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-red-600">
                {formData.assets?.filter((asset: any) => asset.condition === "تالف").length || 0}
              </div>
              <div className="text-sm text-muted-foreground">تالفة</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetsTab;