import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Shield, 
  Settings, 
  TrendingUp, 
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  BarChart,
  ArrowUpDown,
  Trash2,
  Eye,
  Edit,
  Bell,
  Lock,
  RefreshCw,
  Calendar,
  Zap,
  Target,
  Database,
  Activity,
  DollarSign,
  Truck,
  ClipboardCheck,
  Plus,
  Save
} from 'lucide-react';

interface StoragePolicy {
  id: string;
  itemCategory: string;
  minLevel: number;
  maxLevel: number;
  reorderPoint: number;
  unit: string;
  autoReorder: boolean;
  alertThreshold: number;
}

interface IssuePolicy {
  id: string;
  method: 'FIFO' | 'LIFO' | 'FEFO' | 'AVERAGE';
  description: string;
  requireApproval: boolean;
  approvalThreshold: number;
  approverRole: string;
}

interface InventoryPolicy {
  id: string;
  type: 'PERIODIC' | 'CONTINUOUS' | 'SURPRISE';
  frequency: string;
  responsible: string;
  tolerance: number;
  autoAdjustment: boolean;
  requireManagerApproval: boolean;
}

interface SecurityPolicy {
  id: string;
  operation: string;
  requiredRole: string;
  approvalRequired: boolean;
  documentationRequired: boolean;
  auditLog: boolean;
}

export default function InventoryPolicies() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Dialog states
  const [editingStoragePolicy, setEditingStoragePolicy] = useState<StoragePolicy | null>(null);
  const [editingIssuePolicy, setEditingIssuePolicy] = useState<IssuePolicy | null>(null);
  const [editingInventoryPolicy, setEditingInventoryPolicy] = useState<InventoryPolicy | null>(null);
  const [editingSecurityPolicy, setEditingSecurityPolicy] = useState<SecurityPolicy | null>(null);
  const [viewingWorkflow, setViewingWorkflow] = useState<number | null>(null);
  
  const [storagePolicies, setStoragePolicies] = useState<StoragePolicy[]>([
    {
      id: '1',
      itemCategory: 'منتجات تنظيف',
      minLevel: 50,
      maxLevel: 500,
      reorderPoint: 100,
      unit: '  ',
      autoReorder: true,
      alertThreshold: 75
    },
    {
      id: '2',
      itemCategory: 'مشروب ومنتجات',
      minLevel: 10,
      maxLevel: 100,
      reorderPoint: 25,
      unit: '  ',
      autoReorder: false,
      alertThreshold: 15
    }
  ]);

  const [issuePolicies, setIssuePolicies] = useState<IssuePolicy[]>([
    {
      id: '1',
      method: 'FIFO',
      description: 'الوارد أولاً يخرج أولاً - للمنتجات ذات الصلاحية',
      requireApproval: false,
      approvalThreshold: 0,
      approverRole: ''
    },
    {
      id: '2',
      method: 'FEFO',
      description: 'أول انتهاء يخرج أولاً - للمنتجات منتهية الصلاحية',
      requireApproval: true,
      approvalThreshold: 100,
      approverRole: 'مدير المخزون'
    }
  ]);

  const [inventoryPolicies, setInventoryPolicies] = useState<InventoryPolicy[]>([
    {
      id: '1',
      type: 'PERIODIC',
      frequency: 'شهرياً',
      responsible: 'فريق الجرد',
      tolerance: 2,
      autoAdjustment: false,
      requireManagerApproval: true
    },
    {
      id: '2',
      type: 'CONTINUOUS',
      frequency: 'يومياً',
      responsible: 'مشرف المخزون',
      tolerance: 1,
      autoAdjustment: true,
      requireManagerApproval: false
    }
  ]);

  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>([
    {
      id: '1',
      operation: 'إضافة صنف جديد',
      requiredRole: 'مدير المخزون',
      approvalRequired: true,
      documentationRequired: true,
      auditLog: true
    },
    {
      id: '2',
      operation: 'صرف كمية كبيرة',
      requiredRole: 'مشرف المخزون',
      approvalRequired: true,
      documentationRequired: true,
      auditLog: true
    },
    {
      id: '3',
      operation: 'تسوية الجرد',
      requiredRole: 'مدير المخزون',
      approvalRequired: true,
      documentationRequired: true,
      auditLog: true
    }
  ]);

  // Enhanced Functions
  const handleSavePolicies = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "تم حفظ السياسات بنجاح",
        description: "تم تطبيق جميع السياسات والإجراءات على النظام",
      });
    } catch (error) {
      toast({
        title: "خطأ في حفظ السياسات",
        description: "حدث خطأ أثناء حفظ السياسات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addNewStoragePolicy = () => {
    const newPolicy: StoragePolicy = {
      id: (storagePolicies.length + 1).toString(),
      itemCategory: 'فئة جديدة',
      minLevel: 10,
      maxLevel: 100,
      reorderPoint: 25,
      unit: '  ',
      autoReorder: false,
      alertThreshold: 15
    };
    setStoragePolicies([...storagePolicies, newPolicy]);
    toast({
      title: "تم إضافة سياسة تخزين جديدة",
      description: "يمكنك الآن تعديل إعدادات السياسة الجديدة"
    });
  };

  const editStoragePolicy = (index: number) => {
    setEditingStoragePolicy(storagePolicies[index]);
  };

  const saveStoragePolicy = (updatedPolicy: StoragePolicy) => {
    const updatedPolicies = storagePolicies.map(policy => 
      policy.id === updatedPolicy.id ? updatedPolicy : policy
    );
    setStoragePolicies(updatedPolicies);
    setEditingStoragePolicy(null);
    toast({
      title: "تم تحديث السياسة",
      description: `تم تحديث سياسة ${updatedPolicy.itemCategory} بنجاح`
    });
  };

  const deleteStoragePolicy = (index: number) => {
    const updatedPolicies = storagePolicies.filter((_, i) => i !== index);
    setStoragePolicies(updatedPolicies);
    toast({
      title: "تم حذف السياسة",
      description: "تم حذف سياسة التخزين بنجاح"
    });
  };

  const editIssuePolicy = (index: number) => {
    setEditingIssuePolicy(issuePolicies[index]);
  };

  const editInventoryPolicy = (index: number) => {
    setEditingInventoryPolicy(inventoryPolicies[index]);
  };

  const deleteInventoryPolicy = (index: number) => {
    const updatedPolicies = inventoryPolicies.filter((_, i) => i !== index);
    setInventoryPolicies(updatedPolicies);
    toast({
      title: "تم حذف سياسة الجرد",
      description: "تم حذف سياسة الجرد بنجاح"
    });
  };

  const addNewInventoryPolicy = () => {
    const newPolicy: InventoryPolicy = {
      id: (inventoryPolicies.length + 1).toString(),
      type: 'PERIODIC',
      frequency: 'شهرياً',
      responsible: 'فريق الجرد',
      tolerance: 2,
      autoAdjustment: false,
      requireManagerApproval: true
    };
    setInventoryPolicies([...inventoryPolicies, newPolicy]);
    toast({
      title: "تم إضافة سياسة جرد جديدة",
      description: "يمكنك الآن تعديل إعدادات السياسة الجديدة"
    });
  };

  const editSecurityPolicy = (index: number) => {
    setEditingSecurityPolicy(securityPolicies[index]);
  };

  const deleteSecurityPolicy = (index: number) => {
    const updatedPolicies = securityPolicies.filter((_, i) => i !== index);
    setSecurityPolicies(updatedPolicies);
    toast({
      title: "تم حذف سياسة الأمان",
      description: "تم حذف سياسة الأمان بنجاح"
    });
  };

  const addNewSecurityPolicy = () => {
    const newPolicy: SecurityPolicy = {
      id: (securityPolicies.length + 1).toString(),
      operation: 'عملية جديدة',
      requiredRole: 'موظف المخزون',
      approvalRequired: false,
      documentationRequired: false,
      auditLog: true
    };
    setSecurityPolicies([...securityPolicies, newPolicy]);
    toast({
      title: "تم إضافة سياسة أمان جديدة",
      description: "يمكنك الآن تعديل إعدادات السياسة الجديدة"
    });
  };

  const viewWorkflowDetails = (workflowIndex: number) => {
    setViewingWorkflow(workflowIndex);
  };

  const editWorkflow = (workflowIndex: number) => {
    toast({
      title: "تعديل الإجراء",
      description: `جاري تعديل ${workflows[workflowIndex].title}`
    });
  };

  const generateComplianceReport = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "تم إنشاء تقرير الالتزام",
        description: "تم إنشاء تقرير الالتزام الشهري بنجاح"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateEffectivenessReport = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2200));
      toast({
        title: "تم إنشاء تحليل الفعالية",
        description: "تم إنشاء تقرير تحليل فعالية السياسات"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateViolationsReport = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1800));
      toast({
        title: "تم إنشاء تقرير المخالفات",
        description: "تم إنشاء تقرير المخالفات والانحرافات"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPolicyBadgeColor = (type: string) => {
    switch (type) {
      case 'FIFO': return 'bg-green-500';
      case 'LIFO': return 'bg-blue-500';
      case 'FEFO': return 'bg-red-500';
      case 'AVERAGE': return 'bg-purple-500';
      case 'PERIODIC': return 'bg-orange-500';
      case 'CONTINUOUS': return 'bg-teal-500';
      case 'SURPRISE': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const workflows = [
    {
      title: 'إجراء إضافة صنف جديد',
      steps: [
        'تعبئة نموذج تعريف شامل للصنف',
        'تحديد التصنيف وحد الطلب ووحدة القياس',
        'إضافة الباركود والصلاحية والصورة',
        'موافقة الإدارة أو مسؤول النظام',
        'تفعيل الصنف في النظام'
      ],
      icon: Plus,
      color: 'text-green-500'
    },
    {
      title: 'إجراء الاستلام المخزني',
      steps: [
        'استلام الكميات والتحقق من الايصال وأمر الشراء',
        'فحص الجودة وإثبات المطابقة',
        'تسجيل الدفعة وربطها برقم التشغيلة',
        'تحديث الرصيد وطباعة الباركود',
        'إشعار الأقسام المعنية'
      ],
      icon: Package,
      color: 'text-blue-500'
    },
    {
      title: 'إجراء الصرف المخزني',
      steps: [
        'استلام طلب الصرف من القسم المستفيد',
        'مراجعة واعتماد الطلب حسب السياسة',
        'صرف حسب نظام FIFO/FEFO',
        'خصم الكمية وتوثيق الرصيد',
        'التوقيع الإلكتروني عند الاستلام'
      ],
      icon: ArrowUpDown,
      color: 'text-orange-500'
    },
    {
      title: 'إجراء التحويل بين المخازن',
      steps: [
        'إنشاء طلب تحويل وتحديد التفاصيل',
        'اعتماد التحويل إلكترونياً',
        'متابعة مرحلة النقل الفعلي',
        'تأكيد الاستلام من المخزن المستلم',
        'تحديث الأرصدة في كلا المخزنين'
      ],
      icon: Truck,
      color: 'text-purple-500'
    },
    {
      title: 'إجراء الجرد',
      steps: [
        'فتح دورة جرد جديدة',
        'توزيع قوائم الجرد على الفرق',
        'توثيق الفروقات وتحليل الأسباب',
        'اعتماد التسويات اللازمة',
        'إصدار تقرير نهائي للإدارة'
      ],
      icon: ClipboardCheck,
      color: 'text-indigo-500'
    },
    {
      title: 'إجراء التالف أو الفاقد',
      steps: [
        'تسجيل حالة التالف مع التقرير والصور',
        'اعتماد الإتلاف من الإدارة العليا',
        'تسوية الرصيد في النظام',
        'إنشاء قيد محاسبي تلقائي',
        'أرشفة المستندات'
      ],
      icon: Trash2,
      color: 'text-red-500'
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6 bg-gradient-to-br from-slate-50 to-white min-h-screen">
      {/* Enhanced Header with KPIs */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-500 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">نظام السياسات والإجراءات المتقدم</h1>
              <p className="text-blue-100 text-lg">إدارة شاملة لسياسات المخزون وفق أفضل الممارسات العالمية</p>
            </div>
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              <div className="text-center">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-xs text-blue-100">معدل الالتزام</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24</div>
                <div className="text-xs text-blue-100">سياسة نشطة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">15</div>
                <div className="text-xs text-blue-100">إجراء تشغيلي</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">سياسات التخزين</p>
                <p className="text-3xl font-bold text-green-900">{storagePolicies.length}</p>
                <p className="text-xs text-green-600 mt-1">نشطة وفعالة</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Database className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">سياسات الصرف</p>
                <p className="text-3xl font-bold text-blue-900">{issuePolicies.length}</p>
                <p className="text-xs text-blue-600 mt-1">محدثة ومعتمدة</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ArrowUpDown className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">سياسات الجرد</p>
                <p className="text-3xl font-bold text-purple-900">{inventoryPolicies.length}</p>
                <p className="text-xs text-purple-600 mt-1">مراجعة دورية</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <ClipboardCheck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">سياسات الأمان</p>
                <p className="text-3xl font-bold text-orange-900">{securityPolicies.length}</p>
                <p className="text-xs text-orange-600 mt-1">متقدمة وآمنة</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Button onClick={handleSavePolicies} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 ml-2" />
            حفظ جميع السياسات
          </Button>
          <Button variant="outline" onClick={generateComplianceReport} disabled={isLoading}>
            <BarChart className="h-4 w-4 ml-2" />
            تقرير الالتزام
          </Button>
          <Button variant="outline" onClick={generateEffectivenessReport} disabled={isLoading}>
            <Target className="h-4 w-4 ml-2" />
            تحليل الفعالية
          </Button>
        </div>
        <Badge variant="outline" className="px-4 py-2 text-sm">
          آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
        </Badge>
      </div>

      <Tabs defaultValue="storage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8 bg-white shadow-lg rounded-xl p-1">
          <TabsTrigger value="storage" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Database className="h-4 w-4" />
            حدود التخزين
          </TabsTrigger>
          <TabsTrigger value="issue" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <ArrowUpDown className="h-4 w-4" />
            سياسة الصرف
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <ClipboardCheck className="h-4 w-4" />
            سياسة الجرد
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Shield className="h-4 w-4" />
            الأمان والصلاحيات
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Activity className="h-4 w-4" />
            الإجراءات التشغيلية
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <BarChart className="h-4 w-4" />
            المراقبة والتحليل
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <CheckCircle className="h-4 w-4" />
            الالتزام والجودة
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Zap className="h-4 w-4" />
            الأتمتة الذكية
          </TabsTrigger>
        </TabsList>

        {/* سياسة حدود التخزين */}
        <TabsContent value="storage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                إعدادات حدود التخزين وإعادة الطلب
              </CardTitle>
              <CardDescription>
                تحديد الحد الأدنى والأقصى ونقطة إعادة الطلب لكل فئة من المنتجات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {storagePolicies.map((policy, index) => (
                  <Card key={policy.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{policy.itemCategory}</CardTitle>
                        <Badge variant="outline" className="gap-1">
                          <Target className="h-3 w-3" />
                          {policy.unit}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>الحد الأدنى</Label>
                          <Input
                            type="number"
                            value={policy.minLevel}
                            onChange={(e) => {
                              const newPolicies = [...storagePolicies];
                              newPolicies[index].minLevel = parseInt(e.target.value);
                              setStoragePolicies(newPolicies);
                            }}
                            className="text-center"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>الحد الأقصى</Label>
                          <Input
                            type="number"
                            value={policy.maxLevel}
                            onChange={(e) => {
                              const newPolicies = [...storagePolicies];
                              newPolicies[index].maxLevel = parseInt(e.target.value);
                              setStoragePolicies(newPolicies);
                            }}
                            className="text-center"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>نقطة إعادة الطلب</Label>
                          <Input
                            type="number"
                            value={policy.reorderPoint}
                            onChange={(e) => {
                              const newPolicies = [...storagePolicies];
                              newPolicies[index].reorderPoint = parseInt(e.target.value);
                              setStoragePolicies(newPolicies);
                            }}
                            className="text-center"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>حد التنبيه</Label>
                          <Input
                            type="number"
                            value={policy.alertThreshold}
                            onChange={(e) => {
                              const newPolicies = [...storagePolicies];
                              newPolicies[index].alertThreshold = parseInt(e.target.value);
                              setStoragePolicies(newPolicies);
                            }}
                            className="text-center"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={policy.autoReorder}
                            onCheckedChange={(checked) => {
                              const newPolicies = [...storagePolicies];
                              newPolicies[index].autoReorder = checked;
                              setStoragePolicies(newPolicies);
                            }}
                          />
                          <Label>الطلب التلقائي</Label>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => editStoragePolicy(index)}
                            disabled={isLoading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => deleteStoragePolicy(index)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button 
                  className="w-full gap-2" 
                  variant="outline"
                  onClick={addNewStoragePolicy}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" />
                  إضافة سياسة تخزين جديدة
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* سياسة الصرف */}
        <TabsContent value="issue" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpDown className="h-5 w-5" />
                  طرق الصرف المعتمدة
                </CardTitle>
                <CardDescription>
                  تحديد طريقة صرف الأصناف وقواعد الموافقة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {issuePolicies.map((policy, index) => (
                  <Card key={policy.id} className="border">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge className={`${getPolicyBadgeColor(policy.method)} text-white`}>
                            {policy.method}
                          </Badge>
                          <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => editIssuePolicy(index)}
                            disabled={isLoading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {policy.description}
                        </p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>يتطلب موافقة</Label>
                            <Switch
                              checked={policy.requireApproval}
                              onCheckedChange={(checked) => {
                                const newPolicies = [...issuePolicies];
                                newPolicies[index].requireApproval = checked;
                                setIssuePolicies(newPolicies);
                              }}
                            />
                          </div>
                          
                          {policy.requireApproval && (
                            <>
                              <div className="space-y-2">
                                <Label>حد الموافقة (الكمية)</Label>
                                <Input
                                  type="number"
                                  value={policy.approvalThreshold}
                                  onChange={(e) => {
                                    const newPolicies = [...issuePolicies];
                                    newPolicies[index].approvalThreshold = parseInt(e.target.value);
                                    setIssuePolicies(newPolicies);
                                  }}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>دور المعتمد</Label>
                                <Select 
                                  value={policy.approverRole}
                                  onValueChange={(value) => {
                                    const newPolicies = [...issuePolicies];
                                    newPolicies[index].approverRole = value;
                                    setIssuePolicies(newPolicies);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="اختر دور المعتمد" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="مدير المخزون">مدير المخزون</SelectItem>
                                    <SelectItem value="مشرف المخزون">مشرف المخزون</SelectItem>
                                    <SelectItem value="المدير المالي">المدير المالي</SelectItem>
                                    <SelectItem value="مدير العمليات">مدير العمليات</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  إعدادات الصلاحية والانتهاء
                </CardTitle>
                <CardDescription>
                  إدارة المنتجات ذات الصلاحية المحددة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>تفعيل تنبيهات الصلاحية</Label>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>تنبيه قبل انتهاء الصلاحية (بالأيام)</Label>
                    <Input type="number" defaultValue={30} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>إجراء المنتجات منتهية الصلاحية</Label>
                    <Select defaultValue="isolate">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="isolate">عزل تلقائي</SelectItem>
                        <SelectItem value="alert">تنبيه فقط</SelectItem>
                        <SelectItem value="auto-issue">صرف تلقائي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>إلزام باستخدام الباركود</Label>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>تتبع رقم الدفعة</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* سياسة الجرد */}
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                سياسات الجرد والتسوية
              </CardTitle>
              <CardDescription>
                تحديد أنواع الجرد وإجراءات التسوية المعتمدة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {inventoryPolicies.map((policy, index) => (
                  <Card key={policy.id} className={`border-l-4 ${
                    policy.type === 'PERIODIC' ? 'border-l-orange-500' :
                    policy.type === 'CONTINUOUS' ? 'border-l-teal-500' : 'border-l-yellow-500'
                  }`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getPolicyBadgeColor(policy.type)} text-white`}>
                            {policy.type === 'PERIODIC' ? 'دوري' : 
                             policy.type === 'CONTINUOUS' ? 'مستمر' : 'مفاجئ'}
                          </Badge>
                          <span className="font-medium">{policy.frequency}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => editInventoryPolicy(index)}
                            disabled={isLoading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteInventoryPolicy(index)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>المسؤول</Label>
                          <Input value={policy.responsible} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>نسبة التسامح (%)</Label>
                          <Input
                            type="number"
                            value={policy.tolerance}
                            onChange={(e) => {
                              const newPolicies = [...inventoryPolicies];
                              newPolicies[index].tolerance = parseInt(e.target.value);
                              setInventoryPolicies(newPolicies);
                            }}
                            step="0.1"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>التكرار</Label>
                          <Select 
                            value={policy.frequency}
                            onValueChange={(value) => {
                              const newPolicies = [...inventoryPolicies];
                              newPolicies[index].frequency = value;
                              setInventoryPolicies(newPolicies);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="يومياً">يومياً</SelectItem>
                              <SelectItem value="أسبوعياً">أسبوعياً</SelectItem>
                              <SelectItem value="شهرياً">شهرياً</SelectItem>
                              <SelectItem value="ربع سنوي">ربع سنوي</SelectItem>
                              <SelectItem value="سنوياً">سنوياً</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={policy.autoAdjustment}
                              onCheckedChange={(checked) => {
                                const newPolicies = [...inventoryPolicies];
                                newPolicies[index].autoAdjustment = checked;
                                setInventoryPolicies(newPolicies);
                              }}
                            />
                            <Label>التسوية التلقائية</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={policy.requireManagerApproval}
                              onCheckedChange={(checked) => {
                                const newPolicies = [...inventoryPolicies];
                                newPolicies[index].requireManagerApproval = checked;
                                setInventoryPolicies(newPolicies);
                              }}
                            />
                            <Label>موافقة المدير</Label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button 
                  className="w-full gap-2" 
                  variant="outline"
                  onClick={addNewInventoryPolicy}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" />
                  إضافة سياسة جرد جديدة
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* الأمان والصلاحيات */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                سياسات الأمان والصلاحيات
              </CardTitle>
              <CardDescription>
                تحديد الصلاحيات المطلوبة لكل عملية ومستوى التوثيق
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityPolicies.map((policy, index) => (
                  <Card key={policy.id} className="border">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">{policy.operation}</h4>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => editSecurityPolicy(index)}
                            disabled={isLoading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteSecurityPolicy(index)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>الدور المطلوب</Label>
                          <Select 
                            value={policy.requiredRole}
                            onValueChange={(value) => {
                              const newPolicies = [...securityPolicies];
                              newPolicies[index].requiredRole = value;
                              setSecurityPolicies(newPolicies);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="مدير المخزون">مدير المخزون</SelectItem>
                              <SelectItem value="مشرف المخزون">مشرف المخزون</SelectItem>
                              <SelectItem value="موظف المخزون">موظف المخزون</SelectItem>
                              <SelectItem value="المدير المالي">المدير المالي</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>يتطلب موافقة</Label>
                            <Switch
                              checked={policy.approvalRequired}
                              onCheckedChange={(checked) => {
                                const newPolicies = [...securityPolicies];
                                newPolicies[index].approvalRequired = checked;
                                setSecurityPolicies(newPolicies);
                              }}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>توثيق مطلوب</Label>
                            <Switch
                              checked={policy.documentationRequired}
                              onCheckedChange={(checked) => {
                                const newPolicies = [...securityPolicies];
                                newPolicies[index].documentationRequired = checked;
                                setSecurityPolicies(newPolicies);
                              }}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>سجل المراجعة</Label>
                            <Switch
                              checked={policy.auditLog}
                              onCheckedChange={(checked) => {
                                const newPolicies = [...securityPolicies];
                                newPolicies[index].auditLog = checked;
                                setSecurityPolicies(newPolicies);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button 
                  className="w-full gap-2" 
                  variant="outline"
                  onClick={addNewSecurityPolicy}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" />
                  إضافة سياسة أمان جديدة
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* الإجراءات التشغيلية */}
        <TabsContent value="workflows" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  الإجراءات التشغيلية (Workflows)
                </CardTitle>
                <CardDescription>
                  خطوات العمل المترجمة من السياسات إلى إجراءات قابلة للتنفيذ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {workflows.map((workflow, index) => (
                    <Card key={index} className="border-l-4" style={{borderLeftColor: workflow.color.replace('text-', '')}}>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-background border`}>
                            <workflow.icon className={`h-5 w-5 ${workflow.color}`} />
                          </div>
                          {workflow.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {workflow.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="flex items-start gap-3">
                              <div className={`w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary flex-shrink-0 mt-0.5`}>
                                {stepIndex + 1}
                              </div>
                              <p className="text-sm text-muted-foreground">{step}</p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => viewWorkflowDetails(index)}
                            disabled={isLoading}
                          >
                            <Eye className="h-4 w-4" />
                            عرض التفاصيل
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => editWorkflow(index)}
                            disabled={isLoading}
                          >
                            <Edit className="h-4 w-4" />
                            تعديل
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* المراقبة والتحليل */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  مراقبة الالتزام بالسياسات
                </CardTitle>
                <CardDescription>
                  تتبع مدى الالتزام بالسياسات والإجراءات المحددة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">التزام سياسة الصرف</span>
                    <Badge variant="default" className="bg-green-500">98%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">دقة الجرد</span>
                    <Badge variant="default" className="bg-blue-500">95%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">التزام حدود التخزين</span>
                    <Badge variant="default" className="bg-orange-500">87%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">توثيق العمليات</span>
                    <Badge variant="default" className="bg-purple-500">92%</Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium">التنبيهات النشطة</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span>5 أصناف تحت الحد الأدنى</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-red-500" />
                      <span>3 منتجات قاربت انتهاء الصلاحية</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>تم إكمال الجرد الشهري</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  إعدادات الإشعارات والتنبيهات
                </CardTitle>
                <CardDescription>
                  تخصيص الإشعارات الآلية للسياسات والإجراءات
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>تنبيه الحد الأدنى</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>تنبيه انتهاء الصلاحية</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>تنبيه طلبات الموافقة</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>تنبيه فروقات الجرد</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>تنبيه العمليات الاستثنائية</Label>
                    <Switch />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>طرق الإشعار</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">البريد الإلكتروني</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">إشعارات داخل النظام</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">الرسائل النصية</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">إشعارات الجوال</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                تقارير السياسات والالتزام
              </CardTitle>
              <CardDescription>
                تقارير دورية لمراقبة الالتزام بالسياسات وتحليل الأداء
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={generateComplianceReport}
                  disabled={isLoading}
                >
                  <FileText className="h-4 w-4" />
                  تقرير الالتزام الشهري
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={generateEffectivenessReport}
                  disabled={isLoading}
                >
                  <BarChart className="h-4 w-4" />
                  تحليل فعالية السياسات
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={generateViolationsReport}
                  disabled={isLoading}
                >
                  <TrendingUp className="h-4 w-4" />
                  تقرير المخالفات والانحرافات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب الالتزام والجودة */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  مؤشرات الالتزام
                </CardTitle>
                <CardDescription>
                  معدلات الالتزام بالسياسات والإجراءات
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">سياسات التخزين</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">98%</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ArrowUpDown className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">سياسات الصرف</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">95%</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ClipboardCheck className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">إجراءات الجرد</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">89%</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">سياسات الأمان</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">96%</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    <CheckCircle className="h-4 w-4 ml-2" />
                    تقرير الالتزام التفصيلي
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  مؤشرات الجودة
                </CardTitle>
                <CardDescription>
                  قياس جودة العمليات والإجراءات
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-blue-800">زمن الاستجابة</div>
                      <Badge className="bg-blue-100 text-blue-800">ممتاز</Badge>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">2.3 ثانية</div>
                    <div className="text-sm text-blue-600 mt-1">متوسط وقت معالجة الطلبات</div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-green-800">دقة المعاملات</div>
                      <Badge className="bg-green-100 text-green-800">مرتفع</Badge>
                    </div>
                    <div className="text-2xl font-bold text-green-600">99.7%</div>
                    <div className="text-sm text-green-600 mt-1">نسبة المعاملات الخالية من الأخطاء</div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-orange-800">مراجعات الجودة</div>
                      <Badge className="bg-orange-100 text-orange-800">مجدولة</Badge>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">24</div>
                    <div className="text-sm text-orange-600 mt-1">مراجعة هذا الشهر</div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button variant="outline" className="w-full">
                    <BarChart className="h-4 w-4 ml-2" />
                    تقرير مؤشرات الجودة
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Bell className="h-4 w-4 ml-2" />
                    إعداد التنبيهات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* تبويب الأتمتة الذكية */}
        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  الأتمتة الذكية
                </CardTitle>
                <CardDescription>
                  تفعيل وإدارة العمليات الآلية المدعومة بالذكاء الاصطناعي
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-green-800">إعادة الطلب التلقائي</div>
                      <Badge className="bg-green-100 text-green-800">نشط</Badge>
                    </div>
                    <div className="text-sm text-green-600">
                      توفير 23% في تكاليف المخزون
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-blue-800">تحديث الأسعار الذكي</div>
                      <Badge className="bg-blue-100 text-blue-800">نشط</Badge>
                    </div>
                    <div className="text-sm text-blue-600">
                      تحديث تلقائي لأسعار 342 منتج يومياً
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-indigo-800">تحليل أنماط الاستهلاك</div>
                      <Badge className="bg-indigo-100 text-indigo-800">نشط</Badge>
                    </div>
                    <div className="text-sm text-indigo-600">
                      دقة التنبؤ تحسنت إلى 94.7%
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-emerald-800">تحسين دورة المخزون</div>
                      <Badge className="bg-emerald-100 text-emerald-800">قيد التطوير</Badge>
                    </div>
                    <div className="text-sm text-emerald-600">
                      تقليل دورة المخزون بنسبة 18%
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Zap className="h-4 w-4 ml-2" />
                    تفعيل جميع خدمات الذكاء الاصطناعي
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-slate-600" />
                  مراقبة الأداء الآلي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">847</div>
                    <div className="text-sm text-blue-700">عملية آلية اليوم</div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">99.8%</div>
                    <div className="text-sm text-green-700">نجاح العمليات</div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">2.3 ثانية</div>
                    <div className="text-sm text-purple-700">متوسط وقت الاستجابة</div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">156 ساعة</div>
                    <div className="text-sm text-orange-700">وقت موفر هذا الشهر</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Storage Policy Edit Dialog */}
      <Dialog open={!!editingStoragePolicy} onOpenChange={() => setEditingStoragePolicy(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تعديل سياسة التخزين</DialogTitle>
            <DialogDescription>
              تعديل إعدادات سياسة التخزين لفئة {editingStoragePolicy?.itemCategory}
            </DialogDescription>
          </DialogHeader>
          {editingStoragePolicy && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم الفئة</Label>
                  <Input
                    value={editingStoragePolicy.itemCategory}
                    onChange={(e) => setEditingStoragePolicy({
                      ...editingStoragePolicy,
                      itemCategory: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>وحدة القياس</Label>
                  <Input
                    value={editingStoragePolicy.unit}
                    onChange={(e) => setEditingStoragePolicy({
                      ...editingStoragePolicy,
                      unit: e.target.value
                    })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الحد الأدنى</Label>
                  <Input
                    type="number"
                    value={editingStoragePolicy.minLevel}
                    onChange={(e) => setEditingStoragePolicy({
                      ...editingStoragePolicy,
                      minLevel: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الحد الأقصى</Label>
                  <Input
                    type="number"
                    value={editingStoragePolicy.maxLevel}
                    onChange={(e) => setEditingStoragePolicy({
                      ...editingStoragePolicy,
                      maxLevel: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نقطة إعادة الطلب</Label>
                  <Input
                    type="number"
                    value={editingStoragePolicy.reorderPoint}
                    onChange={(e) => setEditingStoragePolicy({
                      ...editingStoragePolicy,
                      reorderPoint: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>حد التنبيه</Label>
                  <Input
                    type="number"
                    value={editingStoragePolicy.alertThreshold}
                    onChange={(e) => setEditingStoragePolicy({
                      ...editingStoragePolicy,
                      alertThreshold: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editingStoragePolicy.autoReorder}
                  onCheckedChange={(checked) => setEditingStoragePolicy({
                    ...editingStoragePolicy,
                    autoReorder: checked
                  })}
                />
                <Label>الطلب التلقائي</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => saveStoragePolicy(editingStoragePolicy)} className="flex-1">
                  <Save className="h-4 w-4 ml-2" />
                  حفظ التغييرات
                </Button>
                <Button variant="outline" onClick={() => setEditingStoragePolicy(null)}>
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Issue Policy Edit Dialog */}
      <Dialog open={!!editingIssuePolicy} onOpenChange={() => setEditingIssuePolicy(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>تعديل سياسة الصرف</DialogTitle>
            <DialogDescription>
              تعديل إعدادات سياسة الصرف {editingIssuePolicy?.method}
            </DialogDescription>
          </DialogHeader>
          {editingIssuePolicy && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>وصف السياسة</Label>
                <Textarea
                  value={editingIssuePolicy.description}
                  onChange={(e) => setEditingIssuePolicy({
                    ...editingIssuePolicy,
                    description: e.target.value
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>يتطلب موافقة</Label>
                <Switch
                  checked={editingIssuePolicy.requireApproval}
                  onCheckedChange={(checked) => setEditingIssuePolicy({
                    ...editingIssuePolicy,
                    requireApproval: checked
                  })}
                />
              </div>
              {editingIssuePolicy.requireApproval && (
                <>
                  <div className="space-y-2">
                    <Label>حد الموافقة (الكمية)</Label>
                    <Input
                      type="number"
                      value={editingIssuePolicy.approvalThreshold}
                      onChange={(e) => setEditingIssuePolicy({
                        ...editingIssuePolicy,
                        approvalThreshold: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>دور المعتمد</Label>
                    <Select
                      value={editingIssuePolicy.approverRole}
                      onValueChange={(value) => setEditingIssuePolicy({
                        ...editingIssuePolicy,
                        approverRole: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="مدير المخزون">مدير المخزون</SelectItem>
                        <SelectItem value="مشرف المخزون">مشرف المخزون</SelectItem>
                        <SelectItem value="المدير المالي">المدير المالي</SelectItem>
                        <SelectItem value="مدير العمليات">مدير العمليات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => {
                    const updatedPolicies = issuePolicies.map(policy => 
                      policy.id === editingIssuePolicy.id ? editingIssuePolicy : policy
                    );
                    setIssuePolicies(updatedPolicies);
                    setEditingIssuePolicy(null);
                    toast({
                      title: "تم تحديث سياسة الصرف",
                      description: `تم تحديث سياسة ${editingIssuePolicy.method} بنجاح`
                    });
                  }}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 ml-2" />
                  حفظ التغييرات
                </Button>
                <Button variant="outline" onClick={() => setEditingIssuePolicy(null)}>
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Workflow Details Dialog */}
      <Dialog open={viewingWorkflow !== null} onOpenChange={() => setViewingWorkflow(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {viewingWorkflow !== null && (
                <>
                  {React.createElement(workflows[viewingWorkflow].icon, { 
                    className: `h-6 w-6 ${workflows[viewingWorkflow].color}` 
                  })}
                  {workflows[viewingWorkflow].title}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              تفاصيل الإجراء التشغيلي وخطوات التنفيذ
            </DialogDescription>
          </DialogHeader>
          {viewingWorkflow !== null && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">خطوات التنفيذ:</h4>
                <div className="space-y-3">
                  {workflows[viewingWorkflow].steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary flex-shrink-0">
                        {stepIndex + 1}
                      </div>
                      <p className="text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={() => setViewingWorkflow(null)} className="flex-1">
                  إغلاق
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 ml-2" />
                  تعديل الإجراء
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}