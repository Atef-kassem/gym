import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { BranchSelector } from "@/components/BranchSelector";
import { 
  useStartShiftSessionMutation, 
  useGetCurrentSessionQuery, 
  useGetAllSessionsQuery, 
  useCloseShiftSessionMutation 
} from '@/services/shiftSessionApi';
import { useGetAllShiftsQuery } from '@/services/shiftApi';
import { 
  Clock, 
  User, 
  Calculator,
  Printer,
  DollarSign,
  CreditCard,
  Banknote,
  Smartphone,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  List,
  PlayCircle,
  StopCircle,
  Calendar,
  TrendingUp,
  Users,
  Activity,
  Monitor
} from 'lucide-react';

/**
 * ⚠️ تحذير: هذه الصفحة تستخدم بيانات وهمية (Mock Data)
 * 
 * المشكلة: البيانات المعروضة ليست من قاعدة البيانات الحقيقية
 * الحل: يجب ربط الصفحة بـ APIs التالية:
 * - useGetAllSessionsQuery() للحصول على قائمة الورديات
 * - useStartShiftSessionMutation() لبدء وردية جديدة
 * - useCloseShiftSessionMutation() لإغلاق وردية
 * - useGetCurrentSessionQuery() للحصول على الوردية الحالية
 * 
 * حتى يتم الربط الكامل، قد تظهر بيانات غير دقيقة
 */
export default function ShiftManagement() {
  const { toast } = useToast();
  const [currentShift, setCurrentShift] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [shiftHistory, setShiftHistory] = useState<any[]>([]);
  const [isNewShiftDialog, setIsNewShiftDialog] = useState(false);
  const [isClosingShift, setIsClosingShift] = useState(false);
  const [selectedShiftDetails, setSelectedShiftDetails] = useState<any>(null);
  const [isShiftDetailsDialog, setIsShiftDetailsDialog] = useState(false);
  const [branchFilter, setBranchFilter] = useState("all");
  
  // ⚠️ TODO: استبدال Mock Data بـ API calls الحقيقية
  // const { data: sessionsData } = useGetAllSessionsQuery({});
  // const { data: currentSessionData } = useGetCurrentSessionQuery({});
  // const [startSession] = useStartShiftSessionMutation();
  // const [closeSession] = useCloseShiftSessionMutation();

  // Mock user session data
  const currentUser = {
    id: 'EMP-001',
    name: 'أحمد محمد علي',
    role: 'مشرف نقاط البيع',
    branchId: 'BR-001',
    branchName: 'فرع الرياض الرئيسي',
    permissions: ['open_shift', 'close_shift', 'view_reports'],
    avatar: '/api/placeholder/40/40'
  };

  // Mock devices data
  const branchDevices = [
    { 
      id: 'POS-001', 
      name: 'جهاز نقاط البيع 1', 
      type: 'main',
      status: 'available',
      location: 'الكاشير الرئيسي',
      lastUsed: '2024-01-17 14:30',
      currentShift: null
    },
    { 
      id: 'POS-002', 
      name: 'جهاز نقاط البيع 2', 
      type: 'secondary',
      status: 'available',
      location: 'الكاشير الفرعي',
      lastUsed: '2024-01-17 08:00',
      currentShift: null
    }
  ];

  // Professional shift data
  const [professionalShiftData, setProfessionalShiftData] = useState({
    deviceId: '',
    employeeId: currentUser.id,
    branchId: currentUser.branchId,
    startingCash: '',
    notes: ''
  });

  const [closingData, setClosingData] = useState({
    actualCash: '',
    notes: ''
  });

  // Mock data for shifts (including open and closed shifts from multiple branches)
  const mockShiftHistory = [
    // Open shifts
    {
      shiftId: 'SH-2024-008',
      employee: 'نورا خالد',
      employeeId: 'EMP-008',
      deviceId: 'POS-101',
      branchName: 'فرع جدة الرئيسي',
      branchId: 'BR-002',
      date: '2024-01-18',
      startTime: '14:00',
      endTime: null,
      duration: 'نشطة منذ 3 ساعات',
      lane: 'الكاشير الرئيسي',
      startingCash: 700,
      sales: { cash: 890, card: 650, applePay: 200, deferred: 150, total: 1890 },
      transactions: 28,
      status: 'مفتوحة',
      cashDifference: null
    },
    {
      shiftId: 'SH-2024-007',
      employee: 'خالد أحمد',
      employeeId: 'EMP-007',
      deviceId: 'POS-003',
      branchName: 'فرع الرياض الرئيسي',
      branchId: 'BR-001',
      date: '2024-01-18',
      startTime: '12:00',
      endTime: null,
      duration: 'نشطة منذ 5 ساعات',
      lane: 'الكاشير المحمول',
      startingCash: 400,
      sales: { cash: 1200, card: 800, applePay: 300, deferred: 200, total: 2500 },
      transactions: 45,
      status: 'مفتوحة',
      cashDifference: null
    },
    {
      shiftId: 'SH-2024-006',
      employee: 'رانيا محمد',
      employeeId: 'EMP-006',
      deviceId: 'POS-201',
      branchName: 'فرع الدمام الشرقي',
      branchId: 'BR-003',
      date: '2024-01-18',
      startTime: '10:00',
      endTime: null,
      duration: 'نشطة منذ 7 ساعات',
      lane: 'الكاشير الرئيسي',
      startingCash: 600,
      sales: { cash: 2100, card: 1500, applePay: 400, deferred: 300, total: 4300 },
      transactions: 67,
      status: 'مفتوحة',
      cashDifference: null
    },
    // Closed shifts
    {
      shiftId: 'SH-2024-005',
      employee: 'أحمد محمد علي',
      employeeId: 'EMP-001',
      deviceId: 'POS-001',
      branchName: 'فرع الرياض الرئيسي',
      branchId: 'BR-001',
      date: '2024-01-18',
      startTime: '08:00',
      endTime: '16:00',
      duration: '8:00',
      lane: 'الكاشير الرئيسي',
      startingCash: 500,
      sales: { cash: 1600, card: 1200, applePay: 400, deferred: 300, total: 3500 },
      transactions: 65,
      status: 'مغلقة',
      cashDifference: 0
    },
    {
      shiftId: 'SH-2024-004',
      employee: 'سارة علي',
      employeeId: 'EMP-004',
      deviceId: 'POS-102',
      branchName: 'فرع جدة الرئيسي',
      branchId: 'BR-002',
      date: '2024-01-18',
      startTime: '06:00',
      endTime: '14:00',
      duration: '8:00',
      lane: 'الكاشير الفرعي',
      startingCash: 600,
      sales: { cash: 1100, card: 900, applePay: 350, deferred: 250, total: 2600 },
      transactions: 42,
      status: 'مغلقة',
      cashDifference: 10
    },
    {
      shiftId: 'SH-2024-003',
      employee: 'فاطمة أحمد',
      employeeId: 'EMP-002',
      deviceId: 'POS-202',
      branchName: 'فرع الدمام الشرقي',
      branchId: 'BR-003',
      date: '2024-01-17',
      startTime: '14:00',
      endTime: '22:00',
      duration: '8:00',
      lane: 'الكاشير الرئيسي',
      startingCash: 500,
      sales: { cash: 1400, card: 950, applePay: 380, deferred: 270, total: 3000 },
      transactions: 52,
      status: 'مغلقة',
      cashDifference: 0
    },
    {
      shiftId: 'SH-2024-002',
      employee: 'محمد خالد',
      employeeId: 'EMP-003',
      deviceId: 'POS-002',
      branchName: 'فرع الرياض الرئيسي',
      branchId: 'BR-001',
      date: '2024-01-16',
      startTime: '16:00',
      endTime: '00:00',
      duration: '8:00',
      lane: 'الكاشير الفرعي',
      startingCash: 600,
      sales: { cash: 1200, card: 800, applePay: 300, deferred: 200, total: 2500 },
      transactions: 38,
      status: 'مغلقة',
      cashDifference: -20
    },
    {
      shiftId: 'SH-2024-001',
      employee: 'ليلى سعد',
      employeeId: 'EMP-005',
      deviceId: 'POS-103',
      branchName: 'فرع جدة الرئيسي',
      branchId: 'BR-002',
      date: '2024-01-15',
      startTime: '08:00',
      endTime: '16:00',
      duration: '8:00',
      lane: 'الكاشير الرئيسي',
      startingCash: 500,
      sales: { cash: 1800, card: 1100, applePay: 450, deferred: 350, total: 3700 },
      transactions: 58,
      status: 'مغلقة',
      cashDifference: 5
    }
  ];

  // Get unique branches from shift history
  const uniqueBranches = [...new Set(mockShiftHistory.map(shift => shift.branchName))];

  useEffect(() => {
    setShiftHistory(mockShiftHistory);
  }, []);

  const openProfessionalShift = () => {
    if (!professionalShiftData.deviceId) {
      toast({
        title: "جهاز غير محدد",
        description: "الرجاء اختيار جهاز نقاط البيع",
        variant: "destructive"
      });
      return;
    }

    if (!professionalShiftData.startingCash || parseFloat(professionalShiftData.startingCash) < 0) {
      toast({
        title: "خطأ في الرصيد الابتدائي",
        description: "الرجاء إدخال رصيد ابتدائي صحيح",
        variant: "destructive"
      });
      return;
    }

    const selectedDevice = branchDevices.find(d => d.id === professionalShiftData.deviceId);
    if (selectedDevice?.status !== 'available') {
      toast({
        title: "الجهاز غير متاح",
        description: "الجهاز المختار غير متاح حالياً",
        variant: "destructive"
      });
      return;
    }

    const newShift = {
      shiftId: `SH-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      employee: currentUser.name,
      employeeId: currentUser.id,
      deviceId: professionalShiftData.deviceId,
      deviceName: selectedDevice.name,
      branchId: currentUser.branchId,
      branchName: currentUser.branchName,
      startTime: new Date().toISOString(),
      startingCash: parseFloat(professionalShiftData.startingCash),
      sales: {
        cash: 0,
        card: 0,
        applePay: 0,
        deferred: 0,
        total: 0
      },
      transactions: 0,
      notes: professionalShiftData.notes
    };

    setCurrentShift(newShift);
    setIsNewShiftDialog(false);
    
    setProfessionalShiftData({
      deviceId: '',
      employeeId: currentUser.id,
      branchId: currentUser.branchId,
      startingCash: '',
      notes: ''
    });
    
    toast({
      title: "تم فتح الوردية بنجاح!",
      description: `رقم الوردية: ${newShift?.shiftId || 'غير محدد'} - الجهاز: ${selectedDevice?.name || 'غير محدد'}`,
    });
  };

  const closeShift = () => {
    if (!closingData.actualCash) {
      toast({
        title: "بيانات مفقودة",
        description: "الرجاء إدخال الرصيد الفعلي",
        variant: "destructive"
      });
      return;
    }

    const actualCash = parseFloat(closingData.actualCash);
    const shiftToClose = selectedShiftDetails || currentShift;
    const expectedCash = shiftToClose.startingCash + shiftToClose.sales.cash;
    const difference = actualCash - expectedCash;

    const closingReport = {
      ...shiftToClose,
      endTime: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      duration: selectedShiftDetails ? 
        `${Math.floor(Math.random() * 8) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : 
        calculateDuration(shiftToClose.startTime),
      expectedCash,
      actualCash,
      cashDifference: difference,
      notes: closingData.notes,
      status: 'مغلقة'
    };

    // Update shift history
    setShiftHistory(prev => 
      prev.map(shift => 
        shift.shiftId === (shiftToClose?.shiftId || '') ? closingReport : shift
      )
    );

    const differenceText = difference === 0 ? '✅ الرصيد مطابق' : 
                          difference > 0 ? `⬆️ فائض: ${difference} جنيه` : 
                          `⬇️ نقص: ${Math.abs(difference)} جنيه`;

    toast({
      title: "تم إغلاق الوردية بنجاح!",
      description: `رقم الوردية: ${shiftToClose?.shiftId || 'غير محدد'} - ${differenceText}`,
    });
    
    // Reset states
    setCurrentShift(null);
    setSelectedShiftDetails(null);
    setIsClosingShift(false);
    setIsShiftDetailsDialog(false);
    setClosingData({ actualCash: '', notes: '' });
  };

  const calculateDuration = (startTime: string) => {
    try {
      const start = new Date(`2024-01-18 ${startTime}`);
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}:${minutes.toString().padStart(2, '0')}`;
    } catch {
      return "8:00";
    }
  };

  const printShiftReport = () => {
    if (!currentShift) {
      toast({
        title: "لا توجد وردية نشطة",
        description: "لا توجد وردية نشطة للطباعة",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "تم طباعة التقرير",
      description: `تم طباعة تقرير الوردية ${currentShift?.shiftId || 'غير محدد'} بنجاح`,
    });
  };

  // Main view when no shift is active
  if (!currentShift && !isClosingShift) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Branch Selector */}
            <BranchSelector />
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                  إدارة الورديات
                </h1>
                <p className="text-gray-600 text-lg">إدارة ومتابعة ورديات نقاط البيع بطريقة احترافية</p>
              </div>
              <Button
                onClick={() => setIsNewShiftDialog(true)}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 
                         text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl 
                         transition-all duration-300 transform hover:scale-105 group"
              >
                <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                فتح وردية جديدة
              </Button>
            </div>


            {/* Tabs Interface */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-500">
                <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-blue-50 transition-all duration-300 rounded-xl font-medium py-3 group">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                    <span className="group-hover:scale-105 transition-transform duration-300">نظرة عامة</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-blue-50 transition-all duration-300 rounded-xl font-medium py-3 group">
                  <div className="flex items-center gap-2">
                    <List className="h-5 w-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                    <span className="group-hover:scale-105 transition-transform duration-300">سجل الورديات</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-blue-50 transition-all duration-300 rounded-xl font-medium py-3 group">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                    <span className="group-hover:scale-105 transition-transform duration-300">التقارير</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="activities" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-blue-50 transition-all duration-300 rounded-xl font-medium py-3 group">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                    <span className="group-hover:scale-105 transition-transform duration-300">سجل النشاطات</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 animate-fade-in">
                <Card className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] group">
                  <CardHeader className="pb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardTitle className="flex items-center gap-3 text-xl relative z-10">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                        <Monitor className="h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-300" />
                      </div>
                      <span className="group-hover:scale-105 transition-transform duration-300">نظرة عامة على النظام</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-center py-12">
                      <div className="flex justify-center mb-6">
                        <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-110 animate-pulse">
                          <PlayCircle className="h-12 w-12 text-blue-600 hover:text-blue-700 transition-colors duration-300" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4 hover:text-blue-600 transition-colors duration-300">لا توجد وردية نشطة حالياً</h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto hover:text-gray-700 transition-colors duration-300">
                        قم بفتح وردية جديدة لبدء العمل والمبيعات.
                      </p>
                      <Button 
                        onClick={() => setIsNewShiftDialog(true)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 
                                 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl 
                                 transition-all duration-300 transform hover:scale-105 group"
                      >
                        <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="group-hover:scale-105 transition-transform duration-300">فتح وردية جديدة</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4 animate-fade-in">
                <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                        <List className="h-5 w-5 text-white" />
                      </div>
                      سجل الورديات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Branch Filter */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">الفرع</Label>
                          <Select value={branchFilter} onValueChange={setBranchFilter}>
                            <SelectTrigger className="bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">جميع الفروع</SelectItem>
                              {uniqueBranches.map(branch => (
                                <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Statistics */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-green-100 p-3 rounded-lg text-center">
                            <p className="text-xs text-green-700 font-medium">مفتوحة</p>
                            <p className="text-xl font-bold text-green-800">
                              {mockShiftHistory.filter(s => s.status === "مفتوحة" && (branchFilter === "all" || s.branchName === branchFilter)).length}
                            </p>
                          </div>
                          <div className="bg-blue-100 p-3 rounded-lg text-center">
                            <p className="text-xs text-blue-700 font-medium">مغلقة</p>
                            <p className="text-xl font-bold text-blue-800">
                              {mockShiftHistory.filter(s => s.status === "مغلقة" && (branchFilter === "all" || s.branchName === branchFilter)).length}
                            </p>
                          </div>
                          <div className="bg-purple-100 p-3 rounded-lg text-center">
                            <p className="text-xs text-purple-700 font-medium">الفروع</p>
                            <p className="text-xl font-bold text-purple-800">{uniqueBranches.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shifts Tabs */}
                    <Tabs defaultValue="open" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-gray-100 to-gray-200 p-1 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-500">
                        <TabsTrigger value="open" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300 transform hover:scale-105 group">
                          <div className="flex items-center gap-2">
                            <PlayCircle className="h-4 w-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                            <span className="group-hover:scale-105 transition-transform duration-300">
                              الورديات المفتوحة ({mockShiftHistory.filter(s => s.status === "مفتوحة" && (branchFilter === "all" || s.branchName === branchFilter)).length})
                            </span>
                          </div>
                        </TabsTrigger>
                        <TabsTrigger value="closed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300 transform hover:scale-105 group">
                          <div className="flex items-center gap-2">
                            <StopCircle className="h-4 w-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                            <span className="group-hover:scale-105 transition-transform duration-300">
                              الورديات المغلقة ({mockShiftHistory.filter(s => s.status === "مغلقة" && (branchFilter === "all" || s.branchName === branchFilter)).length})
                            </span>
                          </div>
                        </TabsTrigger>
                        <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300 transform hover:scale-105 group">
                          <div className="flex items-center gap-2">
                            <List className="h-4 w-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                            <span className="group-hover:scale-105 transition-transform duration-300">
                              جميع الورديات ({mockShiftHistory.filter(s => branchFilter === "all" || s.branchName === branchFilter).length})
                            </span>
                          </div>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="open" className="space-y-4 mt-6 animate-fade-in">
                        <div className="space-y-4">
                          {mockShiftHistory
                            .filter(shift => shift.status === "مفتوحة" && (branchFilter === "all" || shift.branchName === branchFilter))
                            .map((shift, index) => (
                            <div key={shift.shiftId} className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 border border-green-200 rounded-xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] group relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              <div className="flex justify-between items-start relative z-10">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-green-700 transition-colors duration-300">{shift?.shiftId || 'غير محدد'}</h3>
                                    <Badge className="bg-green-100 text-green-800 border-green-200 animate-pulse shadow-lg hover:shadow-xl transition-all duration-300">مفتوحة</Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 flex items-center gap-2">
                                    <User className="h-4 w-4 text-green-600" />
                                     {shift?.employee || 'غير محدد'} - {shift?.branchName || 'غير محدد'}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-2 group-hover:text-gray-600 transition-colors duration-300">
                                    <Clock className="h-3 w-3 text-green-500" />
                                    بدأت {shift?.startTime || 'غير محدد'} - {shift?.duration || 'غير محدد'}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-2xl text-green-600 group-hover:text-green-700 transition-all duration-300 group-hover:scale-110">{shift?.sales?.total || 0} جنيه مصري</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-green-600 font-medium">نشطة الآن</span>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-4 gap-4 mt-4 relative z-10">
                                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-lg text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group/card">
                                  <Calculator className="h-4 w-4 text-green-700 mx-auto mb-1 group-hover/card:rotate-12 transition-transform duration-300" />
                                  <p className="text-xs text-green-700">العمليات</p>
                                  <p className="font-bold text-green-800 group-hover/card:scale-110 transition-transform duration-300">{shift?.transactions || 0}</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-lg text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group/card">
                                  <Banknote className="h-4 w-4 text-green-700 mx-auto mb-1 group-hover/card:rotate-12 transition-transform duration-300" />
                                  <p className="text-xs text-green-700">نقدي</p>
                                  <p className="font-bold text-green-800 group-hover/card:scale-110 transition-transform duration-300">{shift?.sales?.cash || 0}</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-lg text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group/card">
                                  <CreditCard className="h-4 w-4 text-green-700 mx-auto mb-1 group-hover/card:rotate-12 transition-transform duration-300" />
                                  <p className="text-xs text-green-700">بطاقات</p>
                                  <p className="font-bold text-green-800 group-hover/card:scale-110 transition-transform duration-300">{shift?.sales?.card || 0}</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-lg text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group/card">
                                  <Monitor className="h-4 w-4 text-green-700 mx-auto mb-1 group-hover/card:rotate-12 transition-transform duration-300" />
                                  <p className="text-xs text-green-700">الجهاز</p>
                                  <p className="font-bold text-green-800 group-hover/card:scale-110 transition-transform duration-300">{shift?.deviceId || 'غير محدد'}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-4 relative z-10">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1 bg-white/80 backdrop-blur-sm border-green-300 hover:bg-green-50 hover:border-green-400 transition-all duration-300 transform hover:scale-105 group/btn"
                                  onClick={() => {
                                    setSelectedShiftDetails(shift);
                                    setIsShiftDetailsDialog(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                                  <span className="group-hover/btn:scale-105 transition-transform duration-300">عرض التفاصيل</span>
                                </Button>
                                {shift.status === 'مفتوحة' && (
                                  <Button 
                                    size="sm" 
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group/btn"
                                    onClick={() => {
                                      setSelectedShiftDetails(shift);
                                      setIsClosingShift(true);
                                    }}
                                  >
                                    <StopCircle className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                                    <span className="group-hover/btn:scale-105 transition-transform duration-300">إغلاق الوردية</span>
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="closed" className="space-y-4 mt-6">
                        <div className="space-y-4">
                          {mockShiftHistory
                            .filter(shift => shift.status === "مغلقة" && (branchFilter === "all" || shift.branchName === branchFilter))
                            .map((shift) => (
                            <div key={shift.shiftId} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                              <div className="flex justify-between items-start">
                                <div>
                                   <h3 className="font-bold text-lg text-gray-800 mb-1">{shift?.shiftId || 'غير محدد'}</h3>
                                   <p className="text-sm text-gray-600">{shift?.employee || 'غير محدد'} - {shift?.branchName || 'غير محدد'}</p>
                                  <p className="text-xs text-gray-500 mt-1">{shift?.startTime || 'غير محدد'} - {shift?.endTime || 'غير محدد'}</p>
                                </div>
                                <div className="text-right">
                                   <p className="font-bold text-2xl text-blue-600">{shift?.sales?.total || 0} جنيه مصري</p>
                                   <Badge variant={(shift?.cashDifference || 0) === 0 ? "default" : (shift?.cashDifference || 0) > 0 ? "secondary" : "destructive"}>
                                     {(shift?.cashDifference || 0) === 0 ? "متطابق" : (shift?.cashDifference || 0) > 0 ? `فائض ${shift?.cashDifference || 0}` : `نقص ${Math.abs(shift?.cashDifference || 0)}`}
                                  </Badge>
                                </div>
                              </div>
                              <div className="grid grid-cols-4 gap-4 mt-4">
                                <div className="bg-blue-50 p-3 rounded-lg text-center">
                                  <p className="text-xs text-blue-700">العمليات</p>
                                  <p className="font-bold text-blue-800">{shift.transactions}</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg text-center">
                                  <p className="text-xs text-blue-700">نقدي</p>
                                  <p className="font-bold text-blue-800">{shift.sales.cash}</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg text-center">
                                  <p className="text-xs text-blue-700">بطاقات</p>
                                  <p className="font-bold text-blue-800">{shift.sales.card}</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg text-center">
                                  <p className="text-xs text-blue-700">الجهاز</p>
                                  <p className="font-bold text-blue-800">{shift.deviceId}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1"
                                  onClick={() => {
                                    setSelectedShiftDetails(shift);
                                    setIsShiftDetailsDialog(true);
                                  }}
                                >
                                  عرض التفاصيل
                                </Button>
                                <Button variant="outline" size="sm">طباعة التقرير</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="all" className="space-y-4 mt-6">
                        <div className="space-y-4">
                          {mockShiftHistory
                            .filter(shift => branchFilter === "all" || shift.branchName === branchFilter)
                            .map((shift) => (
                            <div key={shift.shiftId} className={`border rounded-xl p-6 hover:shadow-lg transition-all duration-300 ${shift.status === 'مفتوحة' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-bold text-lg text-gray-800 mb-1">{shift.shiftId}</h3>
                                  <p className="text-sm text-gray-600">{shift?.employee || 'غير محدد'} - {shift?.branchName || 'غير محدد'}</p>
                                  <p className="text-xs text-gray-500 mt-1">{shift.status === 'مفتوحة' ? `بدأت ${shift.startTime}` : `${shift.startTime} - ${shift.endTime}`}</p>
                                </div>
                                <div className="text-right">
                                  <p className={`font-bold text-2xl ${shift.status === 'مفتوحة' ? 'text-green-600' : 'text-blue-600'}`}>{shift.sales.total} جنيه مصري</p>
                                  <Badge variant={shift.status === 'مفتوحة' ? "default" : "secondary"}>{shift.status}</Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4 animate-fade-in">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      تقارير المبيعات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-3xl font-bold text-green-600">15,850 جنيه مصري</p>
                      <p className="text-gray-600">إجمالي المبيعات اليومية</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activities" className="space-y-4 animate-fade-in">
                <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-gray-600" />
                      سجل النشاطات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-white border rounded-lg p-4">
                        <h4 className="font-semibold">فتح الوردية</h4>
                        <p className="text-sm text-gray-600">أحمد محمد علي - 14:32</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* New Shift Dialog */}
            <Dialog open={isNewShiftDialog} onOpenChange={setIsNewShiftDialog}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-blue-600" />
                    فتح وردية جديدة
                  </DialogTitle>
                  <DialogDescription>
                    قم بتعبئة البيانات المطلوبة لفتح وردية جديدة
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="device">اختيار الجهاز *</Label>
                    <Select 
                      value={professionalShiftData.deviceId} 
                      onValueChange={(value) => setProfessionalShiftData({...professionalShiftData, deviceId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر جهاز نقاط البيع" />
                      </SelectTrigger>
                      <SelectContent>
                        {branchDevices.filter(device => device.status === 'available').map(device => (
                          <SelectItem key={device.id} value={device.id}>
                            {device.name} - {device.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startingCash">الرصيد الابتدائي *</Label>
                    <Input
                      id="startingCash"
                      type="number"
                      value={professionalShiftData.startingCash}
                      onChange={(e) => setProfessionalShiftData({...professionalShiftData, startingCash: e.target.value})}
                      placeholder="أدخل الرصيد النقدي الابتدائي"
                      className="text-right"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={openProfessionalShift} 
                      className="flex-1"
                      disabled={!professionalShiftData.deviceId || !professionalShiftData.startingCash}
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      فتح الوردية
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsNewShiftDialog(false)}
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Shift Details Dialog */}
            <Dialog open={isShiftDetailsDialog} onOpenChange={setIsShiftDetailsDialog}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <Eye className="h-6 w-6 text-blue-600" />
                    تفاصيل الوردية - {selectedShiftDetails?.shiftId || 'غير محدد'}
                  </DialogTitle>
                  <DialogDescription>
                    تفاصيل شاملة عن الوردية والمبيعات والعمليات المالية
                  </DialogDescription>
                </DialogHeader>
                
                {selectedShiftDetails ? (
                  <div className="space-y-6">
                    {/* معلومات أساسية */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5 text-blue-600" />
                          المعلومات الأساسية
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">رقم الوردية</Label>
                            <p className="font-semibold text-blue-600">{selectedShiftDetails?.shiftId || 'غير محدد'}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">الموظف</Label>
                            <p className="font-semibold">{selectedShiftDetails?.employee || 'غير محدد'}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">رقم الموظف</Label>
                            <p className="font-semibold">{selectedShiftDetails?.employeeId || 'غير محدد'}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">الفرع</Label>
                            <p className="font-semibold">{selectedShiftDetails?.branchName || 'غير محدد'}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">الجهاز</Label>
                            <p className="font-semibold">{selectedShiftDetails?.deviceId || 'غير محدد'}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">الموقع</Label>
                            <p className="font-semibold">{selectedShiftDetails?.lane || 'غير محدد'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* التوقيتات */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-green-600" />
                          التوقيتات
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">تاريخ الوردية</Label>
                            <p className="font-semibold">{selectedShiftDetails?.date || 'غير محدد'}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">وقت البداية</Label>
                            <p className="font-semibold text-green-600">{selectedShiftDetails?.startTime || 'غير محدد'}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">وقت النهاية</Label>
                            <p className="font-semibold text-red-600">
                              {selectedShiftDetails?.endTime || 'مازالت مفتوحة'}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">المدة</Label>
                            <p className="font-semibold">{selectedShiftDetails?.duration || 'غير محدد'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* المبيعات والمعاملات */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          المبيعات والمعاملات
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                            <Banknote className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <Label className="text-xs text-green-700 block">المبيعات النقدية</Label>
                            <p className="font-bold text-2xl text-green-800">{selectedShiftDetails?.sales?.cash || 0} جنيه مصري</p>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                            <CreditCard className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <Label className="text-xs text-blue-700 block">مبيعات البطاقات</Label>
                            <p className="font-bold text-2xl text-blue-800">{selectedShiftDetails?.sales?.card || 0} جنيه مصري</p>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
                            <Smartphone className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <Label className="text-xs text-purple-700 block">Apple Pay</Label>
                            <p className="font-bold text-2xl text-purple-800">{selectedShiftDetails?.sales?.applePay || 0} جنيه مصري</p>
                          </div>
                          <div className="bg-orange-50 p-4 rounded-lg text-center border border-orange-200">
                            <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                            <Label className="text-xs text-orange-700 block">المبيعات الآجلة</Label>
                            <p className="font-bold text-2xl text-orange-800">{selectedShiftDetails?.sales?.deferred || 0} جنيه مصري</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
                            <Calculator className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                            <Label className="text-xs text-gray-700 block">عدد العمليات</Label>
                            <p className="font-bold text-2xl text-gray-800">{selectedShiftDetails?.transactions || 0}</p>
                          </div>
                          <div className="bg-indigo-50 p-4 rounded-lg text-center border border-indigo-200">
                            <TrendingUp className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                            <Label className="text-xs text-indigo-700 block">إجمالي المبيعات</Label>
                            <p className="font-bold text-3xl text-indigo-800">{selectedShiftDetails?.sales?.total || 0} جنيه مصري</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* تفاصيل النقدية */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Banknote className="h-5 w-5 text-green-600" />
                          تفاصيل النقدية
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">الرصيد الابتدائي</Label>
                            <p className="font-semibold text-blue-600">{selectedShiftDetails?.startingCash || 0} جنيه مصري</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">المبيعات النقدية</Label>
                            <p className="font-semibold text-green-600">+{selectedShiftDetails?.sales?.cash || 0} جنيه مصري</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">الرصيد المتوقع</Label>
                            <p className="font-semibold text-blue-600">
                              {(selectedShiftDetails?.startingCash || 0) + (selectedShiftDetails?.sales?.cash || 0)} جنيه مصري
                            </p>
                          </div>
                          {selectedShiftDetails?.status === 'مغلقة' && (
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500">فرق الرصيد</Label>
                              <p className={`font-semibold ${
                                (selectedShiftDetails?.cashDifference || 0) === 0 ? 'text-green-600' : 
                                (selectedShiftDetails?.cashDifference || 0) > 0 ? 'text-blue-600' : 'text-red-600'
                              }`}>
                                {(selectedShiftDetails?.cashDifference || 0) === 0 ? '✅ متطابق' : 
                                 (selectedShiftDetails?.cashDifference || 0) > 0 ? `⬆️ فائض ${selectedShiftDetails?.cashDifference || 0} جنيه مصري` : 
                                 `⬇️ نقص ${Math.abs(selectedShiftDetails?.cashDifference || 0)} جنيه مصري`}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* تفاصيل العمليات */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <List className="h-5 w-5 text-purple-600" />
                          تفاصيل العمليات ({selectedShiftDetails?.transactions || 0} عملية)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {/* Mock transaction data */}
                          {Array.from({ length: selectedShiftDetails?.transactions || 0 }, (_, i) => {
                            const transactionTypes = ['بيع', 'مرتجع', 'خصم', 'إضافة'];
                            const paymentMethods = ['نقدي', 'بطاقة ائتمان', 'Apple Pay', 'آجل'];
                            const randomType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
                            const randomPayment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                            const randomAmount = Math.floor(Math.random() * 500) + 50;
                            const randomTime = `${Math.floor(Math.random() * 12) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
                            const invoiceNumber = `INV-${selectedShiftDetails?.shiftId?.split('-')?.[2] || '000'}-${(i + 1).toString().padStart(3, '0')}`;
                            
                            return (
                              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-full ${
                                    randomType === 'بيع' ? 'bg-green-100 text-green-600' :
                                    randomType === 'مرتجع' ? 'bg-red-100 text-red-600' :
                                    randomType === 'خصم' ? 'bg-orange-100 text-orange-600' :
                                    'bg-blue-100 text-blue-600'
                                  }`}>
                                    {randomType === 'بيع' ? <DollarSign className="h-4 w-4" /> :
                                     randomType === 'مرتجع' ? <XCircle className="h-4 w-4" /> :
                                     randomType === 'خصم' ? <AlertCircle className="h-4 w-4" /> :
                                     <Plus className="h-4 w-4" />}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-sm">{invoiceNumber}</p>
                                    <p className="text-xs text-gray-500">{randomType} - {randomPayment}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={`font-bold text-sm ${
                                    randomType === 'مرتجع' || randomType === 'خصم' ? 'text-red-600' : 'text-green-600'
                                  }`}>
                                    {randomType === 'مرتجع' || randomType === 'خصم' ? '-' : '+'}{randomAmount} جنيه مصري
                                  </p>
                                  <p className="text-xs text-gray-500">{randomTime}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* ملخص العمليات */}
                        <Separator className="my-4" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">مبيعات</p>
                            <p className="font-bold text-green-600">{Math.floor((selectedShiftDetails?.transactions || 0) * 0.85)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">مرتجعات</p>
                            <p className="font-bold text-red-600">{Math.floor((selectedShiftDetails?.transactions || 0) * 0.1)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">خصومات</p>
                            <p className="font-bold text-orange-600">{Math.floor((selectedShiftDetails?.transactions || 0) * 0.03)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">إضافات</p>
                            <p className="font-bold text-blue-600">{Math.floor((selectedShiftDetails?.transactions || 0) * 0.02)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* حالة الوردية */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-blue-600" />
                          حالة الوردية
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={selectedShiftDetails?.status === 'مفتوحة' ? 'default' : 'secondary'}
                              className={`text-lg px-4 py-2 ${
                                selectedShiftDetails?.status === 'مفتوحة' 
                                  ? 'bg-green-100 text-green-800 border-green-300' 
                                  : 'bg-gray-100 text-gray-800 border-gray-300'
                              }`}
                            >
                              {selectedShiftDetails?.status === 'مفتوحة' ? (
                                <PlayCircle className="h-4 w-4 mr-2" />
                              ) : (
                                <StopCircle className="h-4 w-4 mr-2" />
                              )}
                              {selectedShiftDetails?.status || 'غير محدد'}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">متوسط قيمة العملية</p>
                            <p className="font-bold text-lg">
                              {(selectedShiftDetails?.transactions || 0) > 0 
                                ? Math.round((selectedShiftDetails?.sales?.total || 0) / (selectedShiftDetails?.transactions || 1))
                                : 0} جنيه مصري
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">لا توجد بيانات لعرضها</p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </>
    );
  }

  // Active shift view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Branch Selector */}
        <BranchSelector />
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
              الوردية النشطة
            </h1>
            <p className="text-gray-600 text-lg">رقم الوردية: {currentShift?.shiftId || 'غير محدد'}</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={printShiftReport}
              variant="outline"
              size="lg"
              className="px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Printer className="h-5 w-5 mr-2" />
              طباعة التقرير
            </Button>
            <Button
              onClick={() => setIsClosingShift(true)}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                       text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl 
                       transition-all duration-300 transform hover:scale-105"
            >
              <StopCircle className="h-5 w-5 mr-2" />
              إغلاق الوردية
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>معلومات الوردية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>الموظف</Label>
                  <p className="font-semibold">{currentShift?.employee || 'غير محدد'}</p>
                </div>
                <div>
                  <Label>الجهاز</Label>
                  <p className="font-semibold">{currentShift?.deviceName || 'غير محدد'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>المبيعات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{currentShift?.sales?.total || 0} جنيه مصري</p>
            </CardContent>
          </Card>
        </div>

        {/* Closing Dialog */}
        <Dialog open={isClosingShift} onOpenChange={setIsClosingShift}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <StopCircle className="h-5 w-5 text-red-600" />
                إغلاق الوردية
              </DialogTitle>
              <DialogDescription>
                {selectedShiftDetails ? 
                  `إغلاق الوردية: ${selectedShiftDetails?.shiftId || 'غير محدد'}` : 
                  "إغلاق الوردية النشطة"
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">ملخص الوردية</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">الموظف:</p>
                    <p className="font-medium">{(selectedShiftDetails || currentShift)?.employee || 'غير محدد'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">إجمالي المبيعات:</p>
                    <p className="font-medium text-blue-600">{(selectedShiftDetails || currentShift)?.sales?.total || 0} جنيه مصري</p>
                  </div>
                  <div>
                    <p className="text-gray-600">الرصيد الابتدائي:</p>
                    <p className="font-medium">{(selectedShiftDetails || currentShift)?.startingCash || 0} جنيه مصري</p>
                  </div>
                  <div>
                    <p className="text-gray-600">المبيعات النقدية:</p>
                    <p className="font-medium text-green-600">{(selectedShiftDetails || currentShift)?.sales?.cash || 0} جنيه مصري</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="actualCash">الرصيد الفعلي *</Label>
                <Input
                  id="actualCash"
                  type="number"
                  value={closingData.actualCash}
                  onChange={(e) => setClosingData({...closingData, actualCash: e.target.value})}
                  placeholder="أدخل الرصيد النقدي الفعلي"
                  className="text-right"
                />
                <p className="text-xs text-gray-500">
                  المتوقع: {((selectedShiftDetails || currentShift)?.startingCash || 0) + ((selectedShiftDetails || currentShift)?.sales.cash || 0)} جنيه مصري
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات (اختيارية)</Label>
                <Input
                  id="notes"
                  value={closingData.notes}
                  onChange={(e) => setClosingData({...closingData, notes: e.target.value})}
                  placeholder="أضف أي ملاحظات حول الوردية"
                  className="text-right"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={closeShift} 
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  disabled={!closingData.actualCash}
                >
                  <StopCircle className="h-4 w-4 mr-2" />
                  إغلاق الوردية
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsClosingShift(false);
                    setSelectedShiftDetails(null);
                    setClosingData({ actualCash: '', notes: '' });
                  }}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}