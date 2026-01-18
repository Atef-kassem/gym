import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Power, 
  TestTube, 
  Eye, 
  EyeOff,
  Loader2
} from 'lucide-react';
import { 
  useGetPaymentMethodsQuery, 
  useCreatePaymentMethodMutation, 
  useUpdatePaymentMethodMutation, 
  useDeletePaymentMethodMutation, 
  useTogglePaymentMethodMutation, 
  useTestPaymentConnectionMutation 
} from '@/services/posApi';

interface POSPaymentMethod {
  id: number;
  name: string;
  nameEn: string;
  code: string;
  icon: string;
  fees: number;
  maxAmount?: number;
  minAmount?: number;
  supportsMixedPayment: boolean;
  requiresApproval: boolean;
  approvalThreshold?: number;
  providerName?: string;
  apiKey?: string;
  apiSecret?: string;
  isTestMode: boolean;
  isEnabled: boolean;
  description?: string;
  sortOrder: number;
  paymentCompany?: {
    id: number;
    arabicName: string;
    englishName: string;
    code: string;
  };
  paymentCreator?: {
    id: number;
    arabicName: string;
    englinshName: string;
  };
}

const POSPaymentMethodsManagement = () => {
  // API Hooks
  const { data: paymentMethodsData, isLoading: isLoadingPaymentMethods, refetch } = useGetPaymentMethodsQuery({});
  const [createPaymentMethod, { isLoading: isCreating }] = useCreatePaymentMethodMutation();
  const [updatePaymentMethod, { isLoading: isUpdating }] = useUpdatePaymentMethodMutation();
  const [deletePaymentMethod, { isLoading: isDeleting }] = useDeletePaymentMethodMutation();
  const [togglePaymentMethod, { isLoading: isToggling }] = useTogglePaymentMethodMutation();
  const [testPaymentConnection, { isLoading: isTesting }] = useTestPaymentConnectionMutation();

  // Local state
  const [paymentMethods, setPaymentMethods] = useState<POSPaymentMethod[]>([]);
  const [filteredMethods, setFilteredMethods] = useState<POSPaymentMethod[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<number | null>(null);
  const [showApiKey, setShowApiKey] = useState<{ [key: number]: boolean }>({});

  const [newPaymentMethod, setNewPaymentMethod] = useState<Partial<POSPaymentMethod>>({
    name: '',
    nameEn: '',
    code: '',
    icon: 'credit-card',
    fees: 0,
    maxAmount: undefined,
    minAmount: undefined,
    supportsMixedPayment: false,
    requiresApproval: false,
    approvalThreshold: undefined,
    providerName: '',
    apiKey: '',
    apiSecret: '',
    isTestMode: false,
    isEnabled: true,
    description: '',
    sortOrder: 0
  });

  // Load payment methods when component mounts
  useEffect(() => {
    if (paymentMethodsData?.data?.paymentMethods) {
      setPaymentMethods(paymentMethodsData.data.paymentMethods);
      setFilteredMethods(paymentMethodsData.data.paymentMethods);
    }
  }, [paymentMethodsData]);

  // Filter payment methods based on search and status
  useEffect(() => {
    let filtered = paymentMethods;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(method => 
        statusFilter === 'enabled' ? method.isEnabled : !method.isEnabled
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(method =>
        method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMethods(filtered);
  }, [paymentMethods, searchTerm, statusFilter]);

  const handleAddPaymentMethod = async () => {
    if (!newPaymentMethod.name || !newPaymentMethod.code) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      await createPaymentMethod(newPaymentMethod).unwrap();
      
      setNewPaymentMethod({
        name: '',
        nameEn: '',
        code: '',
        icon: 'credit-card',
        fees: 0,
        maxAmount: undefined,
        minAmount: undefined,
        supportsMixedPayment: false,
        requiresApproval: false,
        approvalThreshold: undefined,
        providerName: '',
        apiKey: '',
        apiSecret: '',
        isTestMode: false,
        isEnabled: true,
        description: '',
        sortOrder: 0
      });
      setShowAddForm(false);
      toast.success('تم إضافة طريقة الدفع بنجاح');
      refetch();
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة طريقة الدفع');
    }
  };

  const handleUpdatePaymentMethod = async (id: number, data: Partial<POSPaymentMethod>) => {
    try {
      await updatePaymentMethod({ id, ...data }).unwrap();
      toast.success('تم تحديث طريقة الدفع بنجاح');
      refetch();
      setEditingMethod(null);
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث طريقة الدفع');
    }
  };

  const handleDeletePaymentMethod = async (id: number) => {
    try {
      await deletePaymentMethod(id).unwrap();
      toast.success('تم حذف طريقة الدفع بنجاح');
      refetch();
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف طريقة الدفع');
    }
  };

  const handleTogglePaymentMethod = async (id: number) => {
    try {
      await togglePaymentMethod(id).unwrap();
      toast.success('تم تحديث حالة طريقة الدفع بنجاح');
      refetch();
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث حالة طريقة الدفع');
    }
  };

  const handleTestConnection = async (id: number) => {
    try {
      await testPaymentConnection(id).unwrap();
      toast.success('تم اختبار الاتصال بنجاح');
    } catch (error) {
      toast.error('فشل في اختبار الاتصال');
    }
  };

  const toggleApiKeyVisibility = (id: number) => {
    setShowApiKey(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getIconComponent = (iconName: string) => {
    // Map icon names to Lucide components
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'credit-card': CreditCard,
      'wallet': CreditCard,
      'bank': CreditCard,
      'cash': CreditCard
    };
    
    const IconComponent = iconMap[iconName] || CreditCard;
    return <IconComponent className="h-4 w-4" />;
  };

  if (isLoadingPaymentMethods) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>جاري تحميل طرق الدفع...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة طرق الدفع</h2>
          <p className="text-muted-foreground">إدارة طرق الدفع المتاحة في النظام</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة طريقة دفع
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في طرق الدفع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={(value: 'all' | 'enabled' | 'disabled') => setStatusFilter(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="فلترة حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الطرق</SelectItem>
            <SelectItem value="enabled">مفعلة</SelectItem>
            <SelectItem value="disabled">معطلة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>إضافة طريقة دفع جديدة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم (عربي)*</Label>
                <Input
                  id="name"
                  value={newPaymentMethod.name}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, name: e.target.value})}
                  placeholder="الدفع بالبطاقة"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nameEn">الاسم (إنجليزي)*</Label>
                <Input
                  id="nameEn"
                  value={newPaymentMethod.nameEn}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, nameEn: e.target.value})}
                  placeholder="Card Payment"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">الرمز*</Label>
                <Input
                  id="code"
                  value={newPaymentMethod.code}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, code: e.target.value})}
                  placeholder="CARD"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fees">الرسوم (%)</Label>
                <Input
                  id="fees"
                  type="number"
                  value={newPaymentMethod.fees}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, fees: parseFloat(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAmount">الحد الأقصى</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  value={newPaymentMethod.maxAmount || ''}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, maxAmount: e.target.value ? parseFloat(e.target.value) : undefined})}
                  placeholder="10000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minAmount">الحد الأدنى</Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={newPaymentMethod.minAmount || ''}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, minAmount: e.target.value ? parseFloat(e.target.value) : undefined})}
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="providerName">اسم المزود</Label>
                <Input
                  id="providerName"
                  value={newPaymentMethod.providerName || ''}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, providerName: e.target.value})}
                  placeholder="Visa, Mastercard"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Input
                  id="description"
                  value={newPaymentMethod.description || ''}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, description: e.target.value})}
                  placeholder="وصف طريقة الدفع"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="supportsMixedPayment"
                  checked={newPaymentMethod.supportsMixedPayment}
                  onCheckedChange={(checked) => setNewPaymentMethod({...newPaymentMethod, supportsMixedPayment: checked})}
                />
                <Label htmlFor="supportsMixedPayment">يدعم الدفع المختلط</Label>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="requiresApproval"
                  checked={newPaymentMethod.requiresApproval}
                  onCheckedChange={(checked) => setNewPaymentMethod({...newPaymentMethod, requiresApproval: checked})}
                />
                <Label htmlFor="requiresApproval">يتطلب موافقة</Label>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="isTestMode"
                  checked={newPaymentMethod.isTestMode}
                  onCheckedChange={(checked) => setNewPaymentMethod({...newPaymentMethod, isTestMode: checked})}
                />
                <Label htmlFor="isTestMode">وضع الاختبار</Label>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="isEnabled"
                  checked={newPaymentMethod.isEnabled}
                  onCheckedChange={(checked) => setNewPaymentMethod({...newPaymentMethod, isEnabled: checked})}
                />
                <Label htmlFor="isEnabled">مفعل</Label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddPaymentMethod} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    جاري الإضافة...
                  </>
                ) : (
                  "إضافة طريقة الدفع"
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMethods.map((method) => (
          <Card key={method.id} className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getIconComponent(method.icon)}
                    <h3 className="font-semibold text-lg">{method.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{method.nameEn}</p>
                  <Badge variant="outline">{method.code}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={method.isEnabled ? "default" : "secondary"}>
                    {method.isEnabled ? "مفعل" : "معطل"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingMethod(method.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePaymentMethod(method.id)}
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
                <div>
                  <span className="text-muted-foreground">الرسوم:</span>
                  <span className="font-medium mr-1">{method.fees}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">المزود:</span>
                  <span className="font-medium mr-1">{method.providerName || "غير محدد"}</span>
                </div>
                {method.maxAmount && (
                  <div>
                    <span className="text-muted-foreground">الحد الأقصى:</span>
                    <span className="font-medium mr-1">{method.maxAmount}</span>
                  </div>
                )}
                {method.minAmount && (
                  <div>
                    <span className="text-muted-foreground">الحد الأدنى:</span>
                    <span className="font-medium mr-1">{method.minAmount}</span>
                  </div>
                )}
              </div>

              {method.description && (
                <p className="text-sm text-muted-foreground">{method.description}</p>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={method.isEnabled}
                    onCheckedChange={() => handleTogglePaymentMethod(method.id)}
                    disabled={isToggling}
                  />
                  <span className="text-sm">تفعيل/تعطيل</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestConnection(method.id)}
                    disabled={isTesting}
                  >
                    <TestTube className="h-4 w-4" />
                  </Button>
                  
                  {method.apiKey && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleApiKeyVisibility(method.id)}
                    >
                      {showApiKey[method.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </div>

              {method.apiKey && showApiKey[method.id] && (
                <div className="pt-2 border-t space-y-2">
                  <div className="text-xs">
                    <span className="text-muted-foreground">API Key:</span>
                    <span className="font-mono bg-muted px-1 rounded">{method.apiKey}</span>
                  </div>
                  {method.apiSecret && (
                    <div className="text-xs">
                      <span className="text-muted-foreground">API Secret:</span>
                      <span className="font-mono bg-muted px-1 rounded">{method.apiSecret}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMethods.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm || statusFilter !== 'all' 
            ? 'لا توجد نتائج تطابق البحث' 
            : 'لا توجد طرق دفع مسجلة'
          }
        </div>
      )}
    </div>
  );
};

export default POSPaymentMethodsManagement;
