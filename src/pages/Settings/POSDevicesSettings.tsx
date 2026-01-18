import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Monitor, 
  Plus, 
  Trash2, 
  Edit2, 
  ChevronLeft,
  Building2,
  HardDrive,
  Wallet,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  useGetPosDevicesQuery, 
  useCreatePosDeviceMutation, 
  useUpdatePosDeviceMutation, 
  useDeletePosDeviceMutation, 
  useToggleDeviceStatusMutation 
} from "@/services/posApi";

interface POSDevice {
  id: number;
  name: string;
  serialNumber: string;
  deviceType: string;
  branchId: number;
  warehouseId?: number;
  cashDrawerId?: string;
  isActive: boolean;
  ipAddress?: string;
  printerType?: string;
  deviceBranch?: {
    id: number;
    arabicName: string;
    englishName: string;
    code: string;
  };
  deviceWarehouse?: {
    warehouse_id: number;
    name_ar: string;
    name_en: string;
  };
}

interface Branch {
  id: number;
  arabicName: string;
  englishName: string;
  code: string;
}

const POSDevicesSettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // API Hooks
  const { data: devicesData, isLoading: isLoadingDevices, refetch } = useGetPosDevicesQuery({});
  const [createDevice, { isLoading: isCreating }] = useCreatePosDeviceMutation();
  const [updateDevice, { isLoading: isUpdating }] = useUpdatePosDeviceMutation();
  const [deleteDevice, { isLoading: isDeleting }] = useDeletePosDeviceMutation();
  const [toggleStatus, { isLoading: isToggling }] = useToggleDeviceStatusMutation();

  // Local state
  const [devices, setDevices] = useState<POSDevice[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [newDevice, setNewDevice] = useState<Partial<POSDevice>>({
    name: "",
    serialNumber: "",
    deviceType: "desktop",
    branchId: 0,
    warehouseId: undefined,
    cashDrawerId: "",
    isActive: true,
    ipAddress: "",
    printerType: "thermal"
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState<number | null>(null);

  // Load devices and branches when component mounts
  useEffect(() => {
    if (devicesData?.data?.devices) {
      setDevices(devicesData.data.devices);
    }
    // TODO: Load branches from API when available
    // For now, using sample branches
    setBranches([
      { id: 1, arabicName: "الفرع الرئيسي", englishName: "Main Branch", code: "MAIN" },
      { id: 2, arabicName: "فرع الخليج", englishName: "Gulf Branch", code: "GULF" },
      { id: 3, arabicName: "فرع القيروان", englishName: "Qirwan Branch", code: "QIR" },
    ]);
  }, [devicesData]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await refetch();
      toast.success("تم تحديث البيانات بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDevice = async () => {
    if (!newDevice.name || !newDevice.serialNumber || !newDevice.branchId) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      await createDevice({
        name: newDevice.name,
        serialNumber: newDevice.serialNumber,
        deviceType: newDevice.deviceType || "desktop",
        branchId: newDevice.branchId,
        warehouseId: newDevice.warehouseId,
        cashDrawerId: newDevice.cashDrawerId,
        isActive: newDevice.isActive ?? true,
        ipAddress: newDevice.ipAddress,
        printerType: newDevice.printerType
      }).unwrap();

      setNewDevice({
        name: "",
        serialNumber: "",
        deviceType: "desktop",
        branchId: 0,
        warehouseId: undefined,
        cashDrawerId: "",
        isActive: true,
        ipAddress: "",
        printerType: "thermal"
      });
      setShowAddForm(false);
      toast.success("تم إضافة الجهاز بنجاح");
      refetch();
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة الجهاز");
    }
  };

  const handleDeleteDevice = async (id: number) => {
    try {
      await deleteDevice(id).unwrap();
      toast.success("تم حذف الجهاز بنجاح");
      refetch();
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الجهاز");
    }
  };

  const handleToggleDeviceStatus = async (id: number) => {
    try {
      await toggleStatus(id).unwrap();
      toast.success("تم تحديث حالة الجهاز بنجاح");
      refetch();
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث حالة الجهاز");
    }
  };

  const getBranchName = (branchId: number) => {
    return branches.find(branch => branch.id === branchId)?.arabicName || "غير محدد";
  };

  const getDeviceTypeLabel = (type: string) => {
    switch (type) {
      case "desktop": return "جهاز مكتبي";
      case "tablet": return "جهاز لوحي";
      case "mobile": return "جهاز محمول";
      default: return type;
    }
  };

  if (isLoadingDevices) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>جاري تحميل البيانات...</span>
        </div>
      </div>
    );
  }

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
            <Monitor className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">إعدادات الأجهزة ونقاط البيع</h1>
            <p className="text-muted-foreground">إدارة الفروع والأجهزة وربطها بالمخازن والصناديق</p>
          </div>
        </div>
      </div>

      {/* Add New Device Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              إضافة جهاز نقطة بيع جديد
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="device-name">اسم الجهاز*</Label>
                <Input
                  id="device-name"
                  value={newDevice.name || ""}
                  onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                  placeholder="أدخل اسم الجهاز"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serial-number">الرقم التسلسلي*</Label>
                <Input
                  id="serial-number"
                  value={newDevice.serialNumber || ""}
                  onChange={(e) => setNewDevice({...newDevice, serialNumber: e.target.value})}
                  placeholder="POS001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="device-type">نوع الجهاز</Label>
                <Select value={newDevice.deviceType} onValueChange={(value) => setNewDevice({...newDevice, deviceType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الجهاز" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desktop">جهاز مكتبي</SelectItem>
                    <SelectItem value="tablet">جهاز لوحي</SelectItem>
                    <SelectItem value="mobile">جهاز محمول</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">الفرع*</Label>
                <Select value={newDevice.branchId?.toString() || ""} onValueChange={(value) => setNewDevice({...newDevice, branchId: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفرع" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.arabicName} - {branch.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="warehouse">المخزن المرتبط</Label>
                <Input
                  id="warehouse"
                  value={newDevice.warehouseId?.toString() || ""}
                  onChange={(e) => setNewDevice({...newDevice, warehouseId: e.target.value ? parseInt(e.target.value) : undefined})}
                  placeholder="WH001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cash-drawer">رقم الصندوق النقدي</Label>
                <Input
                  id="cash-drawer"
                  value={newDevice.cashDrawerId || ""}
                  onChange={(e) => setNewDevice({...newDevice, cashDrawerId: e.target.value})}
                  placeholder="CD001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ip-address">عنوان IP</Label>
                <Input
                  id="ip-address"
                  value={newDevice.ipAddress || ""}
                  onChange={(e) => setNewDevice({...newDevice, ipAddress: e.target.value})}
                  placeholder="192.168.1.100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="printer-type">نوع الطابعة</Label>
                <Select value={newDevice.printerType} onValueChange={(value) => setNewDevice({...newDevice, printerType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الطابعة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thermal">طابعة حرارية</SelectItem>
                    <SelectItem value="receipt">طابعة إيصالات</SelectItem>
                    <SelectItem value="laser">طابعة ليزر</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="device-active"
                  checked={newDevice.isActive ?? true}
                  onCheckedChange={(checked) => setNewDevice({...newDevice, isActive: checked})}
                />
                <Label htmlFor="device-active">جهاز نشط</Label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddDevice} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    جاري الإضافة...
                  </>
                ) : (
                  "إضافة الجهاز"
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Devices List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            أجهزة نقاط البيع المسجلة ({devices.length})
          </CardTitle>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            إضافة جهاز جديد
          </Button>
        </CardHeader>
        <CardContent>
          {devices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد أجهزة مسجلة حالياً
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {devices.map((device) => (
                <Card key={device.id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{device.name}</h3>
                        <p className="text-sm text-muted-foreground">رقم تسلسلي: {device.serialNumber}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={device.isActive ? "default" : "secondary"}>
                          {device.isActive ? "نشط" : "غير نشط"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingDevice(device.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDevice(device.id)}
                          disabled={isDeleting}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">الفرع:</span>
                        <span className="font-medium">{getBranchName(device.branchId)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">النوع:</span>
                        <span className="font-medium">{getDeviceTypeLabel(device.deviceType)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">المخزن:</span>
                        <span className="font-medium">{device.warehouseId || "غير محدد"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">الصندوق:</span>
                        <span className="font-medium">{device.cashDrawerId || "غير محدد"}</span>
                      </div>
                    </div>
                    
                    {device.ipAddress && (
                      <div className="text-xs text-muted-foreground">
                        عنوان IP: {device.ipAddress}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">
                        الطابعة: {device.printerType || "غير محدد"}
                      </span>
                      <Switch
                        checked={device.isActive}
                        onCheckedChange={() => handleToggleDeviceStatus(device.id)}
                        disabled={isToggling}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} className="min-w-32">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              جاري التحديث...
            </>
          ) : (
            "تحديث البيانات"
          )}
        </Button>
      </div>
    </div>
  );
};

export default POSDevicesSettings;