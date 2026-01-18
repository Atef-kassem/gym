import { useState, useEffect } from "react";
import { 
  Wifi, 
  WifiOff, 
  Save, 
  RefreshCw, 
  Plus, 
  Settings, 
  Fingerprint, 
  CreditCard, 
  Monitor, 
  Shield, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Trash2, 
  Edit, 
  Search, 
  Filter,
  Bluetooth,
  Usb,
  Cable,
  Radio,
  Power,
  PowerOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

// أنواع الأجهزة
interface Device {
  id: string;
  name: string;
  type: 'biometric' | 'pos' | 'payment' | 'access_control';
  brand: string;
  model: string;
  serialNumber: string;
  ipAddress?: string;
  port?: number;
  connectionType: 'ethernet' | 'wifi' | 'usb' | 'bluetooth' | 'serial';
  status: 'connected' | 'disconnected' | 'error' | 'testing';
  lastConnected: string;
  location: string;
  isActive: boolean;
  settings: Record<string, any>;
}

// أجهزة العينة
const sampleDevices: Device[] = [
  {
    id: "bio_001",
    name: "جهاز بصمة الاستقبال",
    type: "biometric",
    brand: "ZKTeco",
    model: "iClock360",
    serialNumber: "ZK2024001",
    ipAddress: "192.168.1.100",
    port: 4370,
    connectionType: "ethernet",
    status: "connected",
    lastConnected: "2024-12-25 14:30:15",
    location: "مدخل الاستقبال",
    isActive: true,
    settings: {
      verification_mode: "fingerprint_face",
      timeout: 30,
      voice_prompt: true
    }
  },
  {
    id: "pos_001",
    name: "كاشير رقم 1",
    type: "pos",
    brand: "Epson",
    model: "TM-T88VI",
    serialNumber: "EP2024001",
    ipAddress: "192.168.1.110",
    port: 9100,
    connectionType: "ethernet",
    status: "connected",
    lastConnected: "2024-12-25 14:25:42",
    location: "كاشير رئيسي",
    isActive: true,
    settings: {
      paper_width: "80mm",
      print_speed: "fast",
      logo_print: true
    }
  },
  {
    id: "pay_001",
    name: "جهاز دفع إلكتروني",
    type: "payment",
    brand: "MADA",
    model: "P400 Plus",
    serialNumber: "MD2024001",
    connectionType: "ethernet",
    status: "disconnected",
    lastConnected: "2024-12-25 10:15:30",
    location: "كاشير رئيسي",
    isActive: true,
    settings: {
      currency: "SAR",
      receipt_print: true,
      contactless: true
    }
  },
  {
    id: "access_001",
    name: "بوابة الدخول الرئيسية",
    type: "access_control",
    brand: "HIKVISION",
    model: "DS-K1T671M",
    serialNumber: "HK2024001",
    ipAddress: "192.168.1.120",
    port: 8000,
    connectionType: "ethernet",
    status: "connected",
    lastConnected: "2024-12-25 14:28:18",
    location: "مدخل رئيسي",
    isActive: true,
    settings: {
      card_format: "mifare",
      door_open_time: 5,
      alarm_enabled: true
    }
  }
];

// مقدمو خدمات الدفع
const paymentProviders = [
  { id: "mada", name: "شبكة مدى", logo: "🏦" },
  { id: "visa", name: "فيزا", logo: "💳" },
  { id: "mastercard", name: "ماستركارد", logo: "💳" },
  { id: "stc_pay", name: "STC Pay", logo: "📱" },
  { id: "apple_pay", name: "Apple Pay", logo: "🍎" },
  { id: "samsung_pay", name: "Samsung Pay", logo: "📱" }
];

export default function ExternalDevicesSettings() {
  const [activeTab, setActiveTab] = useState("biometric");
  const [devices, setDevices] = useState<Device[]>(sampleDevices);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDeviceDialogOpen, setIsDeviceDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testingDevice, setTestingDevice] = useState<string | null>(null);
  const { toast } = useToast();

  // نموذج إضافة/تعديل جهاز
  const [deviceForm, setDeviceForm] = useState({
    name: "",
    type: "biometric" as Device['type'],
    brand: "",
    model: "",
    serialNumber: "",
    ipAddress: "",
    port: 80,
    connectionType: "ethernet" as Device['connectionType'],
    location: "",
    isActive: true,
    settings: {}
  });

  // إعدادات عامة للأجهزة
  const [generalSettings, setGeneralSettings] = useState({
    autoDiscovery: true,
    connectionTimeout: 30,
    retryAttempts: 3,
    healthCheckInterval: 60,
    enableNotifications: true,
    logLevel: "info"
  });

  // فلترة الأجهزة
  const getFilteredDevices = (type?: string) => {
    return devices.filter(device => {
      const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           device.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           device.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || device.status === filterStatus;
      const matchesType = !type || device.type === type;
      return matchesSearch && matchesStatus && matchesType;
    });
  };

  // اختبار اتصال الجهاز
  const testDeviceConnection = async (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    setTestingDevice(deviceId);
    setDevices(prev => prev.map(d => 
      d.id === deviceId ? { ...d, status: 'testing' } : d
    ));

    try {
      // محاكاة اختبار الاتصال
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // نتيجة عشوائية للاختبار
      const isSuccess = Math.random() > 0.2; // 80% نجاح
      
      setDevices(prev => prev.map(d => 
        d.id === deviceId ? { 
          ...d, 
          status: isSuccess ? 'connected' : 'error',
          lastConnected: isSuccess ? new Date().toLocaleString('ar-SA') : d.lastConnected
        } : d
      ));

      toast({
        title: isSuccess ? "نجح الاتصال" : "فشل الاتصال",
        description: isSuccess 
          ? `تم الاتصال بنجاح مع ${device.name}`
          : `فشل في الاتصال مع ${device.name}`,
        variant: isSuccess ? "default" : "destructive"
      });
    } catch (error) {
      setDevices(prev => prev.map(d => 
        d.id === deviceId ? { ...d, status: 'error' } : d
      ));
      
      toast({
        title: "خطأ في الاتصال",
        description: `حدث خطأ أثناء اختبار الاتصال مع ${device.name}`,
        variant: "destructive"
      });
    } finally {
      setTestingDevice(null);
    }
  };

  // إعادة تشغيل جهاز
  const restartDevice = async (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    toast({
      title: "جاري إعادة التشغيل",
      description: `جاري إعادة تشغيل ${device.name}...`
    });

    // محاكاة إعادة التشغيل
    setTimeout(() => {
      setDevices(prev => prev.map(d => 
        d.id === deviceId ? { 
          ...d, 
          status: 'connected',
          lastConnected: new Date().toLocaleString('ar-SA')
        } : d
      ));
      
      toast({
        title: "تم إعادة التشغيل",
        description: `تم إعادة تشغيل ${device.name} بنجاح`
      });
    }, 2000);
  };

  // حفظ جهاز جديد أو تعديل جهاز موجود
  const handleSaveDevice = () => {
    if (!deviceForm.name.trim() || !deviceForm.brand.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال جميع البيانات المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (editingDevice) {
      setDevices(prev => prev.map(device => 
        device.id === editingDevice.id 
          ? { 
              ...device, 
              ...deviceForm,
              settings: { ...device.settings, ...deviceForm.settings }
            }
          : device
      ));
      
      toast({
        title: "تم التحديث",
        description: "تم تحديث إعدادات الجهاز بنجاح"
      });
    } else {
      const newDevice: Device = {
        id: `device_${Date.now()}`,
        ...deviceForm,
        status: 'disconnected',
        lastConnected: "لم يتم الاتصال بعد"
      };
      
      setDevices(prev => [...prev, newDevice]);
      
      toast({
        title: "تم الإضافة",
        description: "تم إضافة الجهاز بنجاح"
      });
    }

    resetDeviceForm();
    setIsDeviceDialogOpen(false);
  };

  // حذف جهاز
  const handleDeleteDevice = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    setDevices(prev => prev.filter(d => d.id !== deviceId));
    
    toast({
      title: "تم الحذف",
      description: `تم حذف ${device.name} بنجاح`
    });
  };

  // إعادة تعيين نموذج الجهاز
  const resetDeviceForm = () => {
    setDeviceForm({
      name: "",
      type: "biometric",
      brand: "",
      model: "",
      serialNumber: "",
      ipAddress: "",
      port: 80,
      connectionType: "ethernet",
      location: "",
      isActive: true,
      settings: {}
    });
    setEditingDevice(null);
  };

  // حفظ الإعدادات العامة
  const handleSaveGeneralSettings = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "تم الحفظ",
        description: "تم حفظ الإعدادات العامة بنجاح"
      });
    }, 1000);
  };

  // البحث عن أجهزة جديدة
  const discoverDevices = async () => {
    toast({
      title: "جاري البحث",
      description: "جاري البحث عن أجهزة جديدة في الشبكة..."
    });

    // محاكاة البحث
    setTimeout(() => {
      toast({
        title: "اكتمل البحث",
        description: "تم العثور على 2 أجهزة جديدة"
      });
    }, 3000);
  };

  // الحصول على رمز حالة الجهاز
  const getStatusIcon = (status: Device['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'testing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  // الحصول على رمز نوع الاتصال
  const getConnectionIcon = (type: Device['connectionType']) => {
    switch (type) {
      case 'ethernet':
        return <Cable className="w-4 h-4" />;
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'usb':
        return <Usb className="w-4 h-4" />;
      case 'bluetooth':
        return <Bluetooth className="w-4 h-4" />;
      case 'serial':
        return <Radio className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Monitor className="w-8 h-8 text-primary" />
            إعدادات الأجهزة الخارجية
          </h1>
          <p className="text-muted-foreground mt-2">
            إدارة وتكوين الأجهزة المتصلة بالنظام (بصمة، نقاط البيع، الدفع الإلكتروني)
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={discoverDevices}
            className="gap-2"
          >
            <Search className="w-4 h-4" />
            البحث عن أجهزة
          </Button>
          <Dialog open={isDeviceDialogOpen} onOpenChange={setIsDeviceDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={resetDeviceForm}>
                <Plus className="w-4 h-4" />
                إضافة جهاز جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingDevice ? "تعديل الجهاز" : "إضافة جهاز جديد"}
                </DialogTitle>
                <DialogDescription>
                  {editingDevice ? "تعديل إعدادات الجهاز المحدد" : "إضافة جهاز خارجي جديد للنظام"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deviceName">اسم الجهاز</Label>
                    <Input
                      id="deviceName"
                      value={deviceForm.name}
                      onChange={(e) => setDeviceForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="جهاز بصمة الاستقبال"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deviceType">نوع الجهاز</Label>
                    <Select 
                      value={deviceForm.type} 
                      onValueChange={(value: Device['type']) => setDeviceForm(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="biometric">أجهزة البصمة</SelectItem>
                        <SelectItem value="pos">نقاط البيع (POS)</SelectItem>
                        <SelectItem value="payment">أجهزة الدفع</SelectItem>
                        <SelectItem value="access_control">بوابات الدخول</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deviceBrand">الماركة</Label>
                    <Input
                      id="deviceBrand"
                      value={deviceForm.brand}
                      onChange={(e) => setDeviceForm(prev => ({ ...prev, brand: e.target.value }))}
                      placeholder="ZKTeco"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deviceModel">الموديل</Label>
                    <Input
                      id="deviceModel"
                      value={deviceForm.model}
                      onChange={(e) => setDeviceForm(prev => ({ ...prev, model: e.target.value }))}
                      placeholder="iClock360"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="serialNumber">الرقم المسلسل</Label>
                    <Input
                      id="serialNumber"
                      value={deviceForm.serialNumber}
                      onChange={(e) => setDeviceForm(prev => ({ ...prev, serialNumber: e.target.value }))}
                      placeholder="ZK2024001"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deviceLocation">الموقع</Label>
                    <Input
                      id="deviceLocation"
                      value={deviceForm.location}
                      onChange={(e) => setDeviceForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="مدخل الاستقبال"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="connectionType">نوع الاتصال</Label>
                    <Select 
                      value={deviceForm.connectionType} 
                      onValueChange={(value: Device['connectionType']) => setDeviceForm(prev => ({ ...prev, connectionType: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ethernet">شبكة سلكية</SelectItem>
                        <SelectItem value="wifi">واي فاي</SelectItem>
                        <SelectItem value="usb">USB</SelectItem>
                        <SelectItem value="bluetooth">بلوتوث</SelectItem>
                        <SelectItem value="serial">منفذ تسلسلي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ipAddress">عنوان IP</Label>
                    <Input
                      id="ipAddress"
                      value={deviceForm.ipAddress}
                      onChange={(e) => setDeviceForm(prev => ({ ...prev, ipAddress: e.target.value }))}
                      placeholder="192.168.1.100"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="port">المنفذ</Label>
                    <Input
                      id="port"
                      type="number"
                      value={deviceForm.port}
                      onChange={(e) => setDeviceForm(prev => ({ ...prev, port: Number(e.target.value) }))}
                      placeholder="4370"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="deviceActive"
                    checked={deviceForm.isActive}
                    onCheckedChange={(checked) => setDeviceForm(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="deviceActive">جهاز نشط</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeviceDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSaveDevice}>
                  {editingDevice ? "تحديث" : "إضافة"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">أجهزة متصلة</p>
                <p className="text-2xl font-bold">
                  {devices.filter(d => d.status === 'connected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <WifiOff className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">أجهزة من  </p>
                <p className="text-2xl font-bold">
                  {devices.filter(d => d.status === 'disconnected' || d.status === 'error').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الأجهزة</p>
                <p className="text-2xl font-bold">{devices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">معدل الاتصال</p>
                <p className="text-2xl font-bold">
                  {Math.round((devices.filter(d => d.status === 'connected').length / devices.length) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="biometric" className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4" />
            أجهزة البصمة
          </TabsTrigger>
          <TabsTrigger value="pos" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            نقاط البيع
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            أجهزة الدفع
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            الإعدادات العامة
          </TabsTrigger>
        </TabsList>

        {/* Tab: أجهزة البصمة وبوابات الدخول */}
        <TabsContent value="biometric" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-primary" />
                  أجهزة البصمة وبوابات الدخول
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="البحث في الأجهزة..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 w-64"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأجهزة</SelectItem>
                      <SelectItem value="connected">متصل</SelectItem>
                      <SelectItem value="disconnected">منقطع</SelectItem>
                      <SelectItem value="error">خطأ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getFilteredDevices('biometric').concat(getFilteredDevices('access_control')).map((device) => (
                  <Card key={device.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            {device.type === 'biometric' ? (
                              <Fingerprint className="w-5 h-5" />
                            ) : (
                              <Shield className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{device.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {device.brand} {device.model}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(device.status)}
                          {getConnectionIcon(device.connectionType)}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">الموقع:</span>
                          <span>{device.location}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">IP:</span>
                          <span className="font-mono">{device.ipAddress || "غير محدد"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">آخر اتصال:</span>
                          <span>{device.lastConnected}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant={device.status === 'connected' ? "default" : "destructive"}>
                          {device.status === 'connected' ? "متصل" : 
                           device.status === 'testing' ? "جاري الاختبار" : "منقطع"}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => testDeviceConnection(device.id)}
                            disabled={testingDevice === device.id}
                          >
                            <RefreshCw className={`w-4 h-4 ${testingDevice === device.id ? 'animate-spin' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingDevice(device);
                              setDeviceForm({
                                name: device.name,
                                type: device.type,
                                brand: device.brand,
                                model: device.model,
                                serialNumber: device.serialNumber,
                                ipAddress: device.ipAddress || "",
                                port: device.port || 80,
                                connectionType: device.connectionType,
                                location: device.location,
                                isActive: device.isActive,
                                settings: device.settings
                              });
                              setIsDeviceDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                <AlertDialogDescription>
                                  هل أنت متأكد من حذف "{device.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteDevice(device.id)}>
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {getFilteredDevices('biometric').concat(getFilteredDevices('access_control')).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Fingerprint className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد أجهزة بصمة أو بوابات دخول</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: نقاط البيع */}
        <TabsContent value="pos" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-primary" />
                أجهزة نقاط البيع (POS)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getFilteredDevices('pos').map((device) => (
                  <Card key={device.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <Monitor className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{device.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {device.brand} {device.model}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(device.status)}
                          {getConnectionIcon(device.connectionType)}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">الموقع:</span>
                          <span>{device.location}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">IP:</span>
                          <span className="font-mono">{device.ipAddress || "غير محدد"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">آخر اتصال:</span>
                          <span>{device.lastConnected}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant={device.status === 'connected' ? "default" : "destructive"}>
                          {device.status === 'connected' ? "متصل" : 
                           device.status === 'testing' ? "جاري الاختبار" : "منقطع"}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => testDeviceConnection(device.id)}
                            disabled={testingDevice === device.id}
                          >
                            <RefreshCw className={`w-4 h-4 ${testingDevice === device.id ? 'animate-spin' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => restartDevice(device.id)}
                          >
                            <Power className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {getFilteredDevices('pos').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد أجهزة نقاط بيع مكونة</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: أجهزة الدفع */}
        <TabsContent value="payment" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                أجهزة الدفع الإلكتروني
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* مقدمو خدمات الدفع */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">مقدمو خدمات الدفع المدعومة</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {paymentProviders.map((provider) => (
                    <Card key={provider.id} className="p-3 text-center hover:shadow-md transition-shadow">
                      <div className="text-2xl mb-1">{provider.logo}</div>
                      <p className="text-sm font-medium">{provider.name}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* أجهزة الدفع */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getFilteredDevices('payment').map((device) => (
                  <Card key={device.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{device.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {device.brand} {device.model}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(device.status)}
                          {getConnectionIcon(device.connectionType)}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">الموقع:</span>
                          <span>{device.location}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">العملة:</span>
                          <span>{device.settings?.currency || "SAR"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">دفع لا تلامسي:</span>
                          <span>{device.settings?.contactless ? "مفعل" : "معطل"}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant={device.status === 'connected' ? "default" : "destructive"}>
                          {device.status === 'connected' ? "متصل" : 
                           device.status === 'testing' ? "جاري الاختبار" : "منقطع"}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => testDeviceConnection(device.id)}
                            disabled={testingDevice === device.id}
                          >
                            <RefreshCw className={`w-4 h-4 ${testingDevice === device.id ? 'animate-spin' : ''}`} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {getFilteredDevices('payment').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد أجهزة دفع إلكتروني مكونة</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: الإعدادات العامة */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  الإعدادات العامة للأجهزة
                </CardTitle>
                <Button 
                  onClick={handleSaveGeneralSettings} 
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? "جاري الحفظ..." : "حفظ الإعدادات"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label>البحث التلقائي عن الأجهزة</Label>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-muted-foreground">
                      البحث التلقائي عن أجهزة جديدة في الشبكة
                    </p>
                    <Switch
                      checked={generalSettings.autoDiscovery}
                      onCheckedChange={(checked) => 
                        setGeneralSettings(prev => ({ ...prev, autoDiscovery: checked }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>إشعارات الأجهزة</Label>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-muted-foreground">
                      تفعيل إشعارات حالة الاتصال
                    </p>
                    <Switch
                      checked={generalSettings.enableNotifications}
                      onCheckedChange={(checked) => 
                        setGeneralSettings(prev => ({ ...prev, enableNotifications: checked }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>مهلة الاتصال (ثانية)</Label>
                  <Input
                    type="number"
                    value={generalSettings.connectionTimeout}
                    onChange={(e) => 
                      setGeneralSettings(prev => ({ 
                        ...prev, 
                        connectionTimeout: Number(e.target.value) 
                      }))
                    }
                    className="mt-2"
                    min="5"
                    max="300"
                  />
                </div>

                <div>
                  <Label>عدد محاولات الإعادة</Label>
                  <Input
                    type="number"
                    value={generalSettings.retryAttempts}
                    onChange={(e) => 
                      setGeneralSettings(prev => ({ 
                        ...prev, 
                        retryAttempts: Number(e.target.value) 
                      }))
                    }
                    className="mt-2"
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <Label>فترة فحص الصحة (دقيقة)</Label>
                  <Input
                    type="number"
                    value={generalSettings.healthCheckInterval}
                    onChange={(e) => 
                      setGeneralSettings(prev => ({ 
                        ...prev, 
                        healthCheckInterval: Number(e.target.value) 
                      }))
                    }
                    className="mt-2"
                    min="1"
                    max="1440"
                  />
                </div>

                <div>
                  <Label>مستوى السجلات</Label>
                  <Select 
                    value={generalSettings.logLevel} 
                    onValueChange={(value) => 
                      setGeneralSettings(prev => ({ ...prev, logLevel: value }))
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="error">أخطاء فقط</SelectItem>
                      <SelectItem value="warn">تحذيرات وأخطاء</SelectItem>
                      <SelectItem value="info">معلومات عامة</SelectItem>
                      <SelectItem value="debug">تفاصيل تشخيصية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* معلومات إضافية */}
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">معلومات الشبكة</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="p-4">
                    <div className="text-center">
                      <Wifi className="w-8 h-8 mx-auto mb-2 text-green-500" />
                      <p className="font-semibold">حالة الشبكة</p>
                      <p className="text-sm text-muted-foreground">متصل</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <Monitor className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <p className="font-semibold">عنوان الخادم</p>
                      <p className="text-sm text-muted-foreground font-mono">192.168.1.10</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                      <p className="font-semibold">آخر فحص</p>
                      <p className="text-sm text-muted-foreground">منذ 5 دقائق</p>
                    </div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}