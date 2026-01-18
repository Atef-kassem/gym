import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowRight, 
  Save, 
  User, 
  Phone, 
  Mail, 
  CreditCard,
  Calendar,
  MapPin,
  Building,
  FileText,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import {
  useGetDeliveryDriverByIdQuery,
  useCreateDeliveryDriverMutation,
  useUpdateDeliveryDriverMutation
} from '@/services/deliveryDriverApi';
import { useGetAllBranchesQuery } from '@/services/branchesApi';
import { useGetAllCompaniesQuery } from '@/services/companyApi';

interface DriverFormData {
  driverCode: string;
  name: string;
  phone: string;
  email: string;
  nationalId: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiry: string;
  status: string;
  isAvailable: boolean;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  branchId: string;
  companyId: string;
  notes: string;
}

const DeliveryDriverForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<DriverFormData>({
    driverCode: '',
    name: '',
    phone: '',
    email: '',
    nationalId: '',
    licenseNumber: '',
    licenseType: '',
    licenseExpiry: '',
    status: 'نشط',
    isAvailable: true,
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    branchId: '',
    companyId: '',
    notes: ''
  });

  // RTK Query hooks
  const { data: driverData, isLoading: isLoadingDriver } = useGetDeliveryDriverByIdQuery(id!, { skip: !isEditMode });
  const { data: branchesData, isLoading: isLoadingBranches } = useGetAllBranchesQuery(undefined);
  const { data: companiesData, isLoading: isLoadingCompanies } = useGetAllCompaniesQuery(undefined);
  const [createDriver, { isLoading: isCreating }] = useCreateDeliveryDriverMutation();
  const [updateDriver, { isLoading: isUpdating }] = useUpdateDeliveryDriverMutation();

  const loading = isCreating || isUpdating;

  // Load driver data when editing
  useEffect(() => {
    if (isEditMode && driverData?.data?.driver) {
      const driver = driverData.data.driver;
      setFormData({
        driverCode: driver.driverCode || '',
        name: driver.name || '',
        phone: driver.phone || '',
        email: driver.email || '',
        nationalId: driver.nationalId || '',
        licenseNumber: driver.licenseNumber || '',
        licenseType: driver.licenseType || '',
        licenseExpiry: driver.licenseExpiry || '',
        status: driver.status || 'نشط',
        isAvailable: driver.isAvailable ?? true,
        address: driver.address || '',
        emergencyContact: driver.emergencyContact || '',
        emergencyPhone: driver.emergencyPhone || '',
        branchId: driver.branchId?.toString() || '',
        companyId: driver.companyId?.toString() || '',
        notes: driver.notes || ''
      });
    }
  }, [driverData, isEditMode]);

  const handleInputChange = (field: keyof DriverFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('الرجاء إدخال اسم السائق');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('الرجاء إدخال رقم الهاتف');
      return false;
    }
    if (!formData.licenseNumber.trim()) {
      setError('الرجاء إدخال رقم الرخصة');
      return false;
    }
    if (!formData.licenseType) {
      setError('الرجاء اختيار نوع الرخصة');
      return false;
    }
    if (!formData.licenseExpiry) {
      setError('الرجاء تحديد تاريخ انتهاء الرخصة');
      return false;
    }
    if (!formData.branchId) {
      setError('الرجاء اختيار الفرع');
      return false;
    }
    if (!formData.companyId) {
      setError('الرجاء اختيار الشركة');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        driverCode: formData.driverCode,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        nationalId: formData.nationalId,
        licenseNumber: formData.licenseNumber,
        licenseType: formData.licenseType,
        licenseExpiry: formData.licenseExpiry,
        status: formData.status,
        isAvailable: formData.isAvailable,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        branchId: parseInt(formData.branchId),
        companyId: parseInt(formData.companyId),
        notes: formData.notes
      };

      let result;
      if (isEditMode) {
        result = await updateDriver({ id: parseInt(id!), data: submitData }).unwrap();
        toast.success('تم تحديث بيانات السائق بنجاح');
      } else {
        result = await createDriver(submitData).unwrap();
        toast.success('تم إضافة السائق بنجاح');
      }

      navigate('/motorcycle-management/drivers');
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'حدث خطأ في حفظ بيانات السائق';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (isLoadingDriver) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/motorcycle-management/drivers')}
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          العودة للقائمة
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'تعديل بيانات السائق' : 'إضافة سائق جديد'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode ? 'تعديل بيانات السائق في النظام' : 'إضافة سائق توصيل جديد إلى النظام'}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                المعلومات الشخصية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="driverCode">رمز السائق</Label>
                  <Input
                    id="driverCode"
                    value={formData.driverCode}
                    onChange={(e) => handleInputChange('driverCode', e.target.value)}
                    placeholder="سيتم إنشاؤه تلقائياً"
                    disabled={isEditMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="أدخل الاسم الكامل"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="05xxxxxxxx"
                      className="pr-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="example@domain.com"
                      className="pr-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationalId">رقم الهوية الوطنية</Label>
                  <div className="relative">
                    <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="nationalId"
                      value={formData.nationalId}
                      onChange={(e) => handleInputChange('nationalId', e.target.value)}
                      placeholder="1xxxxxxxxx"
                      className="pr-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">العنوان</Label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="المدينة، الحي"
                      className="pr-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                معلومات الرخصة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">رقم الرخصة *</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    placeholder="أدخل رقم الرخصة"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseType">نوع الرخصة *</Label>
                  <Select
                    value={formData.licenseType}
                    onValueChange={(value) => handleInputChange('licenseType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الرخصة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="دراجة نارية">دراجة نارية</SelectItem>
                      <SelectItem value="مشروب">مشروب</SelectItem>
                      <SelectItem value="شاحنة صغيرة">شاحنة صغيرة</SelectItem>
                      <SelectItem value="شاحنة كبيرة">شاحنة كبيرة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseExpiry">تاريخ انتهاء الرخصة *</Label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="licenseExpiry"
                      type="date"
                      value={formData.licenseExpiry}
                      onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                      className="pr-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نشط">نشط</SelectItem>
                      <SelectItem value="غير نشط">غير نشط</SelectItem>
                      <SelectItem value="إجازة">إجازة</SelectItem>
                      <SelectItem value="معلق">معلق</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                معلومات الطوارئ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">اسم جهة الاتصال للطوارئ</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    placeholder="أدخل الاسم"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">رقم هاتف الطوارئ</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    placeholder="05xxxxxxxx"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                معلومات العمل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyId">الشركة *</Label>
                  <Select
                    value={formData.companyId}
                    onValueChange={(value) => handleInputChange('companyId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الشركة" />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        // Handle different API response structures
                        let companies = [];
                        if (Array.isArray(companiesData?.data?.companies)) {
                          companies = companiesData.data.companies;
                        } else if (Array.isArray(companiesData?.data)) {
                          companies = companiesData.data;
                        } else if (Array.isArray(companiesData)) {
                          companies = companiesData;
                        }
                        
                        // Filter out invalid entries (must have id)
                        companies = companies.filter((c: any) => c && c.id);
                        
                        if (isLoadingCompanies) {
                          return <SelectItem value="loading" disabled>جاري التحميل...</SelectItem>;
                        }
                        
                        if (companies.length === 0) {
                          return <SelectItem value="empty" disabled>لا توجد شركات متاحة</SelectItem>;
                        }
                        
                        return companies.map((company: any) => (
                          <SelectItem key={company.id} value={company.id.toString()}>
                            {company.arabicName || company.englishName || company.companyName || company.name || `شركة ${company.id}`}
                          </SelectItem>
                        ));
                      })()}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branchId">الفرع *</Label>
                  <Select
                    value={formData.branchId}
                    onValueChange={(value) => handleInputChange('branchId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفرع" />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        // Handle different API response structures
                        let branches = [];
                        if (Array.isArray(branchesData?.data?.branches)) {
                          branches = branchesData.data.branches;
                        } else if (Array.isArray(branchesData?.data)) {
                          branches = branchesData.data;
                        } else if (Array.isArray(branchesData)) {
                          branches = branchesData;
                        }
                        
                        // Filter out invalid entries (must have id)
                        branches = branches.filter((b: any) => b && b.id);
                        
                        if (isLoadingBranches) {
                          return <SelectItem value="loading" disabled>جاري التحميل...</SelectItem>;
                        }
                        
                        if (branches.length === 0) {
                          return <SelectItem value="empty" disabled>لا توجد فروع متاحة</SelectItem>;
                        }
                        
                        return branches.map((branch: any) => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.arabicName || branch.englishName || branch.branchName || branch.name || `فرع ${branch.id}`}
                          </SelectItem>
                        ));
                      })()}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="أدخل أي ملاحظات إضافية"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/motorcycle-management/drivers')}
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                'جاري الحفظ...'
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  {isEditMode ? 'تحديث البيانات' : 'إضافة السائق'}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DeliveryDriverForm;

