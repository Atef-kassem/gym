import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import {
  useCreateMaintenanceMutation,
  useUpdateMaintenanceMutation,
  useGetMaintenanceByIdQuery
} from '@/services/maintenanceApi';
import { useGetAllMotorcyclesQuery } from '@/services/motorcycleApi';
import { useGetAllCompaniesQuery } from '@/services/companyApi';
import { useGetAllBranchesQuery } from '@/services/branchesApi';

const MaintenanceForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    motorcycleId: '',
    maintenanceType: 'صيانة دورية',
    maintenanceDate: '',
    maintenanceTime: '',
    description: '',
    mileage: '',
    cost: '',
    laborCost: '',
    partsCost: '',
    workshopName: '',
    workshopContact: '',
    technicianName: '',
    nextMaintenanceDate: '',
    nextMaintenanceMileage: '',
    status: 'مجدولة',
    completedDate: '',
    completedTime: '',
    notes: '',
    branchId: '',
    companyId: '',
  });

  // RTK Query hooks
  const { data: maintenanceData, isLoading: isLoadingMaintenance } = useGetMaintenanceByIdQuery(id!, {
    skip: !isEdit,
  });
  const { data: motorcyclesData } = useGetAllMotorcyclesQuery({ page: 1, limit: 100 });
  const { data: companiesData } = useGetAllCompaniesQuery({});
  const { data: branchesData } = useGetAllBranchesQuery({});
  const [createMaintenance, { isLoading: isCreating }] = useCreateMaintenanceMutation();
  const [updateMaintenance, { isLoading: isUpdating }] = useUpdateMaintenanceMutation();

  const motorcycles = motorcyclesData?.data?.motorcycles || motorcyclesData?.motorcycles || [];
  const companies = companiesData?.data?.companies || 
                    companiesData?.companies || 
                    (Array.isArray(companiesData?.data) ? companiesData.data : []);
  const branches = Array.isArray(branchesData?.data) 
    ? branchesData.data 
    : branchesData?.data?.branches || branchesData?.branches || [];

  useEffect(() => {
    if (isEdit && maintenanceData?.data?.maintenance) {
      const maintenance = maintenanceData.data.maintenance;
      setFormData({
        motorcycleId: maintenance.motorcycleId?.toString() || '',
        maintenanceType: maintenance.maintenanceType || 'صيانة دورية',
        maintenanceDate: maintenance.maintenanceDate || '',
        maintenanceTime: maintenance.maintenanceTime || '',
        description: maintenance.description || '',
        mileage: maintenance.mileage?.toString() || '',
        cost: maintenance.cost?.toString() || '',
        laborCost: maintenance.laborCost?.toString() || '',
        partsCost: maintenance.partsCost?.toString() || '',
        workshopName: maintenance.workshopName || '',
        workshopContact: maintenance.workshopContact || '',
        technicianName: maintenance.technicianName || '',
        nextMaintenanceDate: maintenance.nextMaintenanceDate || '',
        nextMaintenanceMileage: maintenance.nextMaintenanceMileage?.toString() || '',
        status: maintenance.status || 'مجدولة',
        completedDate: maintenance.completedDate || '',
        completedTime: maintenance.completedTime || '',
        notes: maintenance.notes || '',
        branchId: maintenance.branchId?.toString() || '',
        companyId: maintenance.companyId?.toString() || '',
      });
    }
  }, [isEdit, maintenanceData]);

  // Set default company and branch from localStorage
  useEffect(() => {
    if (!isEdit) {
      const storedBranchId = localStorage.getItem('branchId');
      const storedCompanyId = localStorage.getItem('companyId');
      
      if (storedBranchId) {
        setFormData((prev) => ({ ...prev, branchId: storedBranchId }));
      }
      if (storedCompanyId) {
        setFormData((prev) => ({ ...prev, companyId: storedCompanyId }));
      }
      
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setFormData((prev) => ({ ...prev, maintenanceDate: today }));
    }
  }, [isEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.motorcycleId) {
      toast.error('يرجى اختيار الدراجة النارية');
      return;
    }
    if (!formData.maintenanceDate) {
      toast.error('يرجى إدخال تاريخ الصيانة');
      return;
    }
    if (!formData.branchId) {
      toast.error('يرجى اختيار الفرع');
      return;
    }
    if (!formData.companyId) {
      toast.error('يرجى اختيار الشركة');
      return;
    }

    const dataToSend = {
      ...formData,
      motorcycleId: parseInt(formData.motorcycleId),
      mileage: formData.mileage ? parseInt(formData.mileage) : null,
      cost: parseFloat(formData.cost) || 0,
      laborCost: parseFloat(formData.laborCost) || 0,
      partsCost: parseFloat(formData.partsCost) || 0,
      nextMaintenanceMileage: formData.nextMaintenanceMileage ? parseInt(formData.nextMaintenanceMileage) : null,
      branchId: parseInt(formData.branchId),
      companyId: parseInt(formData.companyId),
    };

    try {
      if (isEdit) {
        await updateMaintenance({ id: parseInt(id!), data: dataToSend }).unwrap();
        toast.success('تم تحديث سجل الصيانة بنجاح');
      } else {
        await createMaintenance(dataToSend).unwrap();
        toast.success('تم إضافة سجل الصيانة بنجاح');
      }
      navigate('/motorcycle-management/maintenance');
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'حدث خطأ في حفظ سجل الصيانة';
      toast.error(errorMessage);
    }
  };

  if (isEdit && isLoadingMaintenance) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Wrench className="h-12 w-12 mx-auto text-gray-400 animate-pulse" />
          <p className="mt-2 text-gray-600">جارٍ تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/motorcycle-management/maintenance')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'تعديل سجل صيانة' : 'إضافة سجل صيانة جديد'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'تحديث معلومات سجل الصيانة' : 'إدخال معلومات سجل الصيانة الجديد'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* معلومات الشركة والفرع */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات الشركة والفرع</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyId">الشركة *</Label>
              <Select value={formData.companyId} onValueChange={(value) => handleSelectChange('companyId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الشركة" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company: any) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.arabicName || company.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="branchId">الفرع *</Label>
              <Select value={formData.branchId} onValueChange={(value) => handleSelectChange('branchId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفرع" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch: any) => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.arabicName || branch.branchName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* معلومات الدراجة النارية */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات الدراجة النارية</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="motorcycleId">الدراجة النارية *</Label>
              <Select value={formData.motorcycleId} onValueChange={(value) => handleSelectChange('motorcycleId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدراجة النارية" />
                </SelectTrigger>
                <SelectContent>
                  {motorcycles.map((motorcycle: any) => (
                    <SelectItem key={motorcycle.id} value={motorcycle.id.toString()}>
                      {motorcycle.motorcycleCode} - {motorcycle.brand} {motorcycle.model} ({motorcycle.plateNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="mileage">المسافة المقطوعة (كم)</Label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                value={formData.mileage}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
          </CardContent>
        </Card>

        {/* تفاصيل الصيانة */}
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل الصيانة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="maintenanceType">نوع الصيانة *</Label>
                <Select value={formData.maintenanceType} onValueChange={(value) => handleSelectChange('maintenanceType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="صيانة دورية">صيانة دورية</SelectItem>
                    <SelectItem value="صيانة طارئة">صيانة طارئة</SelectItem>
                    <SelectItem value="إصلاح">إصلاح</SelectItem>
                    <SelectItem value="فحص">فحص</SelectItem>
                    <SelectItem value="تنظيف">تنظيف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="maintenanceDate">تاريخ الصيانة *</Label>
                <Input
                  id="maintenanceDate"
                  name="maintenanceDate"
                  type="date"
                  value={formData.maintenanceDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="maintenanceTime">وقت الصيانة</Label>
                <Input
                  id="maintenanceTime"
                  name="maintenanceTime"
                  type="time"
                  value={formData.maintenanceTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">وصف الصيانة</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="أدخل وصف تفصيلي للصيانة المطلوبة"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* التكاليف */}
        <Card>
          <CardHeader>
            <CardTitle>التكاليف</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="laborCost">تكلفة العمالة (جنيه)</Label>
              <Input
                id="laborCost"
                name="laborCost"
                type="number"
                step="0.01"
                value={formData.laborCost}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="partsCost">تكلفة القطع (جنيه)</Label>
              <Input
                id="partsCost"
                name="partsCost"
                type="number"
                step="0.01"
                value={formData.partsCost}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="cost">إجمالي التكلفة (جنيه)</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={handleInputChange}
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">
                المجموع التلقائي: {(parseFloat(formData.laborCost || '0') + parseFloat(formData.partsCost || '0')).toFixed(2)} جنيه
              </p>
            </div>
          </CardContent>
        </Card>

        {/* معلومات الورشة */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات الورشة والفني</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="workshopName">اسم الورشة</Label>
              <Input
                id="workshopName"
                name="workshopName"
                value={formData.workshopName}
                onChange={handleInputChange}
                placeholder="أدخل اسم الورشة"
              />
            </div>
            <div>
              <Label htmlFor="workshopContact">جهة الاتصال بالورشة</Label>
              <Input
                id="workshopContact"
                name="workshopContact"
                value={formData.workshopContact}
                onChange={handleInputChange}
                placeholder="رقم الهاتف أو البريد الإلكتروني"
              />
            </div>
            <div>
              <Label htmlFor="technicianName">اسم الفني</Label>
              <Input
                id="technicianName"
                name="technicianName"
                value={formData.technicianName}
                onChange={handleInputChange}
                placeholder="أدخل اسم الفني المسؤول"
              />
            </div>
          </CardContent>
        </Card>

        {/* الصيانة القادمة */}
        <Card>
          <CardHeader>
            <CardTitle>جدولة الصيانة القادمة</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nextMaintenanceDate">تاريخ الصيانة القادمة</Label>
              <Input
                id="nextMaintenanceDate"
                name="nextMaintenanceDate"
                type="date"
                value={formData.nextMaintenanceDate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="nextMaintenanceMileage">المسافة للصيانة القادمة (كم)</Label>
              <Input
                id="nextMaintenanceMileage"
                name="nextMaintenanceMileage"
                type="number"
                value={formData.nextMaintenanceMileage}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
          </CardContent>
        </Card>

        {/* الحالة والإكمال */}
        <Card>
          <CardHeader>
            <CardTitle>الحالة والإكمال</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="status">حالة الصيانة *</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مجدولة">مجدولة</SelectItem>
                    <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                    <SelectItem value="مكتملة">مكتملة</SelectItem>
                    <SelectItem value="ملغاة">ملغاة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="completedDate">تاريخ الإنجاز</Label>
                <Input
                  id="completedDate"
                  name="completedDate"
                  type="date"
                  value={formData.completedDate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="completedTime">وقت الإنجاز</Label>
                <Input
                  id="completedTime"
                  name="completedTime"
                  type="time"
                  value={formData.completedTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="أدخل أي ملاحظات إضافية"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/motorcycle-management/maintenance')}
            disabled={isCreating || isUpdating}
          >
            إلغاء
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating}>
            <Save className="h-4 w-4 mr-2" />
            {isCreating || isUpdating ? 'جارٍ الحفظ...' : isEdit ? 'تحديث السجل' : 'إضافة السجل'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MaintenanceForm;

