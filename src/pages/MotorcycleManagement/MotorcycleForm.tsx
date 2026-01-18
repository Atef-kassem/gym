import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Save, 
  ArrowLeft,
  Bike,
  DollarSign,
  FileText,
  Wrench,
  MapPin,
  RotateCcw
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  useGetMotorcycleByIdQuery,
  useGetNextMotorcycleCodeQuery,
  useCreateMotorcycleMutation,
  useUpdateMotorcycleMutation,
} from '@/services/motorcycleApi';
import { useGetAllDeliveryDriversQuery } from '@/services/deliveryDriverApi';
import { useGetAllBranchesQuery } from '@/services/branchesApi';
import { useGetAllCompaniesQuery } from '@/services/companyApi';

interface MotorcycleFormData {
  motorcycleCode: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  engineNumber: string;
  chassisNumber: string;
  capacity: number;
  fuelType: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  insuranceNumber: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  maxLoad: number;
  fuelCapacity: number;
  averageFuelConsumption: number;
  driverId: string;
  branchId: string;
  companyId: string;
  notes: string;
}

const MotorcycleForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState<MotorcycleFormData>({
    motorcycleCode: '',
    plateNumber: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    engineNumber: '',
    chassisNumber: '',
    capacity: '' as any,
    fuelType: 'بنزين',
    purchaseDate: '',
    purchasePrice: '' as any,
    currentValue: '' as any,
    insuranceNumber: '',
    insuranceExpiry: '',
    registrationExpiry: '',
    maxLoad: '' as any,
    fuelCapacity: '' as any,
    averageFuelConsumption: '' as any,
    driverId: '',
    branchId: '',
    companyId: '',
    notes: ''
  });

  // RTK Query hooks
  const { data: nextCodeData } = useGetNextMotorcycleCodeQuery(undefined, { skip: isEdit });
  const { data: motorcycleData, isLoading: isLoadingMotorcycle } = useGetMotorcycleByIdQuery(id!, { skip: !isEdit });
  const { data: branchesData } = useGetAllBranchesQuery(undefined);
  const { data: companiesData } = useGetAllCompaniesQuery(undefined);
  const { data: driversData } = useGetAllDeliveryDriversQuery(undefined);
  
  const [createMotorcycle, { isLoading: isCreating }] = useCreateMotorcycleMutation();
  const [updateMotorcycle, { isLoading: isUpdating }] = useUpdateMotorcycleMutation();

  const loading = isCreating || isUpdating;

  // Set motorcycle code when creating new
  useEffect(() => {
    if (!isEdit && nextCodeData?.data?.nextCode) {
      setFormData(prev => ({
        ...prev,
        motorcycleCode: nextCodeData.data.nextCode
      }));
    }
  }, [nextCodeData, isEdit]);

  // Load motorcycle data when editing
  useEffect(() => {
    if (isEdit && motorcycleData?.data?.motorcycle) {
      const motorcycle = motorcycleData.data.motorcycle;
      setFormData({
        motorcycleCode: motorcycle.motorcycleCode,
        plateNumber: motorcycle.plateNumber,
        brand: motorcycle.brand,
        model: motorcycle.model,
        year: motorcycle.year,
        color: motorcycle.color || '',
        engineNumber: motorcycle.engineNumber || '',
        chassisNumber: motorcycle.chassisNumber || '',
        capacity: motorcycle.capacity || 0,
        fuelType: motorcycle.fuelType,
        purchaseDate: motorcycle.purchaseDate || '',
        purchasePrice: motorcycle.purchasePrice || 0,
        currentValue: motorcycle.currentValue || 0,
        insuranceNumber: motorcycle.insuranceNumber || '',
        insuranceExpiry: motorcycle.insuranceExpiry || '',
        registrationExpiry: motorcycle.registrationExpiry || '',
        maxLoad: motorcycle.maxLoad || 0,
        fuelCapacity: motorcycle.fuelCapacity || 0,
        averageFuelConsumption: motorcycle.averageFuelConsumption || 0,
        driverId: motorcycle.driverId?.toString() || '',
        branchId: motorcycle.branchId?.toString() || '',
        companyId: motorcycle.companyId?.toString() || '',
        notes: motorcycle.notes || ''
      });
    }
  }, [motorcycleData, isEdit]);

  const handleInputChange = (field: keyof MotorcycleFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert string IDs to numbers and prepare data
      const submitData: any = {
        motorcycleCode: formData.motorcycleCode,
        plateNumber: formData.plateNumber,
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year.toString()) || new Date().getFullYear(),
        color: formData.color || null,
        engineNumber: formData.engineNumber || null,
        chassisNumber: formData.chassisNumber || null,
        fuelType: formData.fuelType,
        purchaseDate: formData.purchaseDate || null,
        insuranceNumber: formData.insuranceNumber || null,
        insuranceExpiry: formData.insuranceExpiry || null,
        registrationExpiry: formData.registrationExpiry || null,
        branchId: parseInt(formData.branchId),
        companyId: parseInt(formData.companyId),
        notes: formData.notes || null,
      };

      // Handle optional numeric fields - only add if they have values
      const capacityStr = formData.capacity?.toString() || '';
      if (capacityStr && capacityStr !== '' && capacityStr !== '0') {
        submitData.capacity = parseFloat(capacityStr);
      }
      
      const purchasePriceStr = formData.purchasePrice?.toString() || '';
      if (purchasePriceStr && purchasePriceStr !== '' && purchasePriceStr !== '0') {
        submitData.purchasePrice = parseFloat(purchasePriceStr);
      }
      
      const currentValueStr = formData.currentValue?.toString() || '';
      if (currentValueStr && currentValueStr !== '' && currentValueStr !== '0') {
        submitData.currentValue = parseFloat(currentValueStr);
      }
      
      const maxLoadStr = formData.maxLoad?.toString() || '';
      if (maxLoadStr && maxLoadStr !== '' && maxLoadStr !== '0') {
        submitData.maxLoad = parseFloat(maxLoadStr);
      }
      
      const fuelCapacityStr = formData.fuelCapacity?.toString() || '';
      if (fuelCapacityStr && fuelCapacityStr !== '' && fuelCapacityStr !== '0') {
        submitData.fuelCapacity = parseFloat(fuelCapacityStr);
      }
      
      const avgConsumptionStr = formData.averageFuelConsumption?.toString() || '';
      if (avgConsumptionStr && avgConsumptionStr !== '' && avgConsumptionStr !== '0') {
        submitData.averageFuelConsumption = parseFloat(avgConsumptionStr);
      }
      
      if (formData.driverId && formData.driverId !== 'none') {
        submitData.driverId = parseInt(formData.driverId);
      }

      if (isEdit) {
        await updateMotorcycle({ id: id!, data: submitData }).unwrap();
        toast.success('تم تحديث الدراجة النارية بنجاح');
      } else {
        await createMotorcycle(submitData).unwrap();
        toast.success('تم إنشاء الدراجة النارية بنجاح');
      }
      
      navigate('/motorcycle-management/motorcycles');
    } catch (error: any) {
      console.error('Error saving motorcycle:', error);
      const errorMessage = error.data?.message || error.message || 'خطأ في حفظ الدراجة النارية';
      toast.error(errorMessage);
    }
  };

  if (isLoadingMotorcycle && isEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // استخراج البيانات بشكل صحيح من الـ responses
  const branches = branchesData?.data || branchesData?.branches || [];
  const companies = companiesData?.data?.companies || companiesData?.companies || [];
  const drivers = driversData?.data?.drivers || driversData?.drivers || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/motorcycle-management/motorcycles')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'تعديل الدراجة النارية' : 'إضافة دراجة نارية جديدة'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'تعديل بيانات الدراجة النارية' : 'إضافة دراجة نارية جديدة للنظام'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bike className="h-5 w-5" />
              المعلومات الأساسية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="motorcycleCode">رمز الدراجة النارية *</Label>
                <div className="flex gap-2">
                  <Input
                    id="motorcycleCode"
                    value={formData.motorcycleCode}
                    onChange={(e) => handleInputChange('motorcycleCode', e.target.value)}
                    required
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                {!isEdit && (
                  <p className="text-xs text-gray-500 mt-1">
                    تم إنشاء الرمز تلقائياً
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="plateNumber">رقم اللوحة *</Label>
                <Input
                  id="plateNumber"
                  value={formData.plateNumber}
                  onChange={(e) => handleInputChange('plateNumber', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="brand">الماركة *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="model">الموديل *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="year">سنة الصنع *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="color">اللون</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              المعلومات التقنية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="engineNumber">رقم المحرك</Label>
                <Input
                  id="engineNumber"
                  value={formData.engineNumber}
                  onChange={(e) => handleInputChange('engineNumber', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="chassisNumber">رقم الهيكل</Label>
                <Input
                  id="chassisNumber"
                  value={formData.chassisNumber}
                  onChange={(e) => handleInputChange('chassisNumber', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="capacity">سعة المحرك (سي سي)</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="fuelType">نوع الوقود *</Label>
                <Select value={formData.fuelType} onValueChange={(value) => handleInputChange('fuelType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="بنزين">بنزين</SelectItem>
                    <SelectItem value="ديزل">ديزل</SelectItem>
                    <SelectItem value="كهربائي">كهربائي</SelectItem>
                    <SelectItem value="هجين">هجين</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="maxLoad">الحد الأقصى للحمل (كجم)</Label>
                <Input
                  id="maxLoad"
                  type="number"
                  value={formData.maxLoad}
                  onChange={(e) => handleInputChange('maxLoad', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="fuelCapacity">سعة خزان الوقود (لتر)</Label>
                <Input
                  id="fuelCapacity"
                  type="number"
                  value={formData.fuelCapacity}
                  onChange={(e) => handleInputChange('fuelCapacity', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="averageFuelConsumption">متوسط استهلاك الوقود (لتر/100كم)</Label>
                <Input
                  id="averageFuelConsumption"
                  type="number"
                  step="0.1"
                  value={formData.averageFuelConsumption}
                  onChange={(e) => handleInputChange('averageFuelConsumption', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              المعلومات المالية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="purchaseDate">تاريخ الشراء</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="purchasePrice">سعر الشراء</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="currentValue">القيمة الحالية</Label>
                <Input
                  id="currentValue"
                  type="number"
                  value={formData.currentValue}
                  onChange={(e) => handleInputChange('currentValue', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              المعلومات القانونية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="insuranceNumber">رقم التأمين</Label>
                <Input
                  id="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="insuranceExpiry">انتهاء التأمين</Label>
                <Input
                  id="insuranceExpiry"
                  type="date"
                  value={formData.insuranceExpiry}
                  onChange={(e) => handleInputChange('insuranceExpiry', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="registrationExpiry">انتهاء التسجيل</Label>
                <Input
                  id="registrationExpiry"
                  type="date"
                  value={formData.registrationExpiry}
                  onChange={(e) => handleInputChange('registrationExpiry', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              معلومات التعيين
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="companyId">الشركة *</Label>
                <Select value={formData.companyId} onValueChange={(value) => handleInputChange('companyId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الشركة" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.length > 0 ? (
                      companies.map((company: any) => (
                        <SelectItem key={company.id} value={company.id?.toString()}>
                          {company.arabicName || company.companyName || company.englishName || company.name || 'شركة'}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>لا توجد شركات متاحة</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="branchId">الفرع *</Label>
                <Select value={formData.branchId} onValueChange={(value) => handleInputChange('branchId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفرع" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.length > 0 ? (
                      branches.map((branch: any) => (
                        <SelectItem key={branch.id} value={branch.id?.toString()}>
                          {branch.arabicName || branch.branchName || branch.englishName || branch.name || 'فرع'}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>لا توجد فروع متاحة</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="driverId">السائق المخصص</Label>
                <Select value={formData.driverId || "none"} onValueChange={(value) => handleInputChange('driverId', value === "none" ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر السائق" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">لا يوجد سائق مخصص</SelectItem>
                    {drivers.length > 0 ? (
                      drivers.map((driver: any) => (
                        <SelectItem key={driver.id} value={driver.id?.toString()}>
                          {driver.name || driver.driverName || (driver.firstName && driver.lastName ? `${driver.firstName} ${driver.lastName}` : null) || `سائق ${driver.id}`}
                        </SelectItem>
                      ))
                    ) : null}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>ملاحظات</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="أي ملاحظات إضافية حول الدراجة النارية..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/motorcycle-management/motorcycles')}
          >
            إلغاء
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'جاري الحفظ...' : (isEdit ? 'تحديث' : 'حفظ')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MotorcycleForm;
