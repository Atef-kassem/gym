import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Package, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  useCreateDeliveryOrderMutation,
  useUpdateDeliveryOrderMutation,
  useGetDeliveryOrderByIdQuery
} from '@/services/deliveryOrderApi';
import { useGetAllDeliveryDriversQuery } from '@/services/deliveryDriverApi';
import { useGetAllMotorcyclesQuery } from '@/services/motorcycleApi';
import { useGetAllCompaniesQuery } from '@/services/companyApi';
import { useGetAllBranchesQuery } from '@/services/branchesApi';

const DeliveryOrderForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [gettingLocation, setGettingLocation] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    deliveryAddress: '',
    deliveryLatitude: '',
    deliveryLongitude: '',
    scheduledDeliveryDate: '',
    motorcycleId: '',
    driverId: '',
    orderValue: '',
    deliveryFee: '',
    paymentMethod: 'نقد',
    paymentStatus: 'غير مدفوع',
    priority: 'عادي',
    deliveryType: 'عادي',
    status: 'جديد',
    specialInstructions: '',
    customerNotes: '',
    branchId: '',
    companyId: '',
  });

  // RTK Query hooks
  const { data: orderData, isLoading: isLoadingOrder } = useGetDeliveryOrderByIdQuery(id!, {
    skip: !isEdit,
  });
  const { data: driversData } = useGetAllDeliveryDriversQuery({});
  const { data: motorcyclesData } = useGetAllMotorcyclesQuery({ page: 1, limit: 100 });
  const { data: companiesData } = useGetAllCompaniesQuery({});
  const { data: branchesData } = useGetAllBranchesQuery({});
  const [createOrder, { isLoading: isCreating }] = useCreateDeliveryOrderMutation();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateDeliveryOrderMutation();

  // Extract data from API responses
  const drivers = driversData?.data?.drivers || [];
  const motorcycles = motorcyclesData?.data?.motorcycles || motorcyclesData?.motorcycles || [];
  
  // Companies - backend returns { status: "success", data: { companies: [...], total: ... } }
  const companies = companiesData?.data?.companies || 
                    companiesData?.companies || 
                    (Array.isArray(companiesData?.data) ? companiesData.data : []);
  
  // Branches - backend returns { success: true, data: [...] }
  const branches = Array.isArray(branchesData?.data) 
    ? branchesData.data 
    : branchesData?.data?.branches || branchesData?.branches || [];

  useEffect(() => {
    if (isEdit && orderData?.data?.deliveryOrder) {
      const order = orderData.data.deliveryOrder;
      setFormData({
        customerName: order.customerName || '',
        customerPhone: order.customerPhone || '',
        customerAddress: order.customerAddress || '',
        deliveryAddress: order.deliveryAddress || '',
        deliveryLatitude: order.deliveryLatitude || '',
        deliveryLongitude: order.deliveryLongitude || '',
        scheduledDeliveryDate: order.scheduledDeliveryDate ? order.scheduledDeliveryDate.substring(0, 16) : '',
        motorcycleId: order.motorcycleId || '',
        driverId: order.driverId || '',
        orderValue: order.orderValue || '',
        deliveryFee: order.deliveryFee || '',
        paymentMethod: order.paymentMethod || 'نقد',
        paymentStatus: order.paymentStatus || 'غير مدفوع',
        priority: order.priority || 'عادي',
        deliveryType: order.deliveryType || 'عادي',
        status: order.status || 'جديد',
        specialInstructions: order.specialInstructions || '',
        customerNotes: order.customerNotes || '',
        branchId: order.branchId || '',
        companyId: order.companyId || '',
      });
    }
  }, [isEdit, orderData]);

  // Set default company and branch from localStorage if available
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
    }
  }, [isEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('المتصفح لا يدعم خاصية تحديد الموقع');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);
        
        setFormData((prev) => ({
          ...prev,
          deliveryLatitude: latitude,
          deliveryLongitude: longitude,
        }));
        
        toast.success('تم تحديد الموقع بنجاح');
        setGettingLocation(false);
      },
      (error) => {
        let errorMessage = 'حدث خطأ في تحديد الموقع';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'تم رفض السماح بالوصول إلى الموقع';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'معلومات الموقع غير متوفرة';
            break;
          case error.TIMEOUT:
            errorMessage = 'انتهت مهلة طلب تحديد الموقع';
            break;
        }
        
        toast.error(errorMessage);
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.customerName.trim()) {
      toast.error('يرجى إدخال اسم العميل');
      return;
    }
    if (!formData.customerPhone.trim()) {
      toast.error('يرجى إدخال رقم هاتف العميل');
      return;
    }
    if (!formData.deliveryAddress.trim()) {
      toast.error('يرجى إدخال عنوان التوصيل');
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
      motorcycleId: formData.motorcycleId ? parseInt(formData.motorcycleId) : null,
      driverId: formData.driverId ? parseInt(formData.driverId) : null,
      orderValue: parseFloat(formData.orderValue) || 0,
      deliveryFee: parseFloat(formData.deliveryFee) || 0,
      deliveryLatitude: formData.deliveryLatitude ? parseFloat(formData.deliveryLatitude) : null,
      deliveryLongitude: formData.deliveryLongitude ? parseFloat(formData.deliveryLongitude) : null,
      branchId: parseInt(formData.branchId),
      companyId: parseInt(formData.companyId),
    };

    try {
      if (isEdit) {
        await updateOrder({ id: parseInt(id!), data: dataToSend }).unwrap();
        toast.success('تم تحديث طلب التوصيل بنجاح');
      } else {
        await createOrder(dataToSend).unwrap();
        toast.success('تم إضافة طلب التوصيل بنجاح');
      }
      navigate('/motorcycle-management/orders');
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'حدث خطأ في حفظ طلب التوصيل';
      toast.error(errorMessage);
    }
  };

  if (isEdit && isLoadingOrder) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto text-gray-400 animate-pulse" />
          <p className="mt-2 text-gray-600">جارٍ تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/motorcycle-management/orders')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'تعديل طلب توصيل' : 'إضافة طلب توصيل جديد'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'تحديث معلومات طلب التوصيل' : 'إدخال معلومات طلب التوصيل الجديد'}
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

        {/* معلومات العميل */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات العميل</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">اسم العميل *</Label>
              <Input
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="أدخل اسم العميل"
                required
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">رقم الهاتف *</Label>
              <Input
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                placeholder="05xxxxxxxx"
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="customerAddress">عنوان العميل</Label>
              <Textarea
                id="customerAddress"
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleInputChange}
                placeholder="أدخل عنوان العميل"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* معلومات التوصيل */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات التوصيل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="deliveryAddress">عنوان التوصيل *</Label>
              <Textarea
                id="deliveryAddress"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                placeholder="أدخل عنوان التوصيل"
                rows={2}
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>إحداثيات التوصيل (GPS)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGetCurrentLocation}
                  disabled={gettingLocation}
                >
                  {gettingLocation ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      جارٍ التحديد...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      تحديد الموقع الحالي
                    </>
                  )}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliveryLatitude" className="text-sm text-gray-600">خط العرض</Label>
                  <Input
                    id="deliveryLatitude"
                    name="deliveryLatitude"
                    type="text"
                    value={formData.deliveryLatitude}
                    readOnly
                    placeholder="سيتم تحديده تلقائياً"
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryLongitude" className="text-sm text-gray-600">خط الطول</Label>
                  <Input
                    id="deliveryLongitude"
                    name="deliveryLongitude"
                    type="text"
                    value={formData.deliveryLongitude}
                    readOnly
                    placeholder="سيتم تحديده تلقائياً"
                    className="bg-gray-50"
                  />
                </div>
              </div>
              {formData.deliveryLatitude && formData.deliveryLongitude && (
                <div className="mt-2">
                  <a
                    href={`https://www.google.com/maps?q=${formData.deliveryLatitude},${formData.deliveryLongitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <MapPin className="h-3 w-3" />
                    عرض الموقع على خرائط جوجل
                  </a>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="scheduledDeliveryDate">موعد التوصيل المقرر</Label>
              <Input
                id="scheduledDeliveryDate"
                name="scheduledDeliveryDate"
                type="datetime-local"
                value={formData.scheduledDeliveryDate}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* التعيين */}
        <Card>
          <CardHeader>
            <CardTitle>تعيين السائق والدراجة</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="driverId">السائق</Label>
              <Select value={formData.driverId || undefined} onValueChange={(value) => handleSelectChange('driverId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختج.مائق (اختياري)" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver: any) => (
                    <SelectItem key={driver.id} value={driver.id.toString()}>
                      {driver.name} - {driver.driverCode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="motorcycleId">الدراجة النارية</Label>
              <Select value={formData.motorcycleId || undefined} onValueChange={(value) => handleSelectChange('motorcycleId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر دراجة نارية (اختياري)" />
                </SelectTrigger>
                <SelectContent>
                  {motorcycles.map((motorcycle: any) => (
                    <SelectItem key={motorcycle.id} value={motorcycle.id.toString()}>
                      {motorcycle.motorcycleCode} - {motorcycle.brand} {motorcycle.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* المبالغ المالية */}
        <Card>
          <CardHeader>
            <CardTitle>المبالغ المالية</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="orderValue">قيمة الطلب</Label>
              <Input
                id="orderValue"
                name="orderValue"
                type="number"
                step="0.01"
                value={formData.orderValue}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="deliveryFee">رسوم التوصيل</Label>
              <Input
                id="deliveryFee"
                name="deliveryFee"
                type="number"
                step="0.01"
                value={formData.deliveryFee}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="paymentMethod">طريقة الدفع</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => handleSelectChange('paymentMethod', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نقد">نقد</SelectItem>
                  <SelectItem value="بطاقة ائتمان">بطاقة ائتمان</SelectItem>
                  <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                  <SelectItem value="محفظة إلكترونية">محفظة إلكترونية</SelectItem>
                  <SelectItem value="عند التوصيل">عند التوصيل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentStatus">حالة الدفع</Label>
              <Select value={formData.paymentStatus} onValueChange={(value) => handleSelectChange('paymentStatus', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="غير مدفوع">غير مدفوع</SelectItem>
                  <SelectItem value="مدفوع">مدفوع</SelectItem>
                  <SelectItem value="مدفوع جزئياً">مدفوع جزئياً</SelectItem>
                  <SelectItem value="مسترد">مسترد</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* معلومات إضافية */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات إضافية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="status">الحالة</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="جديد">جديد</SelectItem>
                    <SelectItem value="قيد التحضير">قيد التحضير</SelectItem>
                    <SelectItem value="جاهز للتوصيل">جاهز للتوصيل</SelectItem>
                    <SelectItem value="في الطريق">في الطريق</SelectItem>
                    <SelectItem value="تم التوصيل">تم التوصيل</SelectItem>
                    <SelectItem value="ملغي">ملغي</SelectItem>
                    <SelectItem value="مؤجل">مؤجل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">الأولوية</Label>
                <Select value={formData.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="عادي">عادي</SelectItem>
                    <SelectItem value="عاجل">عاجل</SelectItem>
                    <SelectItem value="فائق العجلة">فائق العجلة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="deliveryType">نوع التوصيل</Label>
                <Select value={formData.deliveryType} onValueChange={(value) => handleSelectChange('deliveryType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="عادي">عادي</SelectItem>
                    <SelectItem value="سريع">سريع</SelectItem>
                    <SelectItem value="مجدول">مجدول</SelectItem>
                    <SelectItem value="مستعجل">مستعجل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="specialInstructions">تعليمات خاصة</Label>
              <Textarea
                id="specialInstructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                placeholder="أدخل أي تعليمات خاصة للسائق"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="customerNotes">ملاحظات العميل</Label>
              <Textarea
                id="customerNotes"
                name="customerNotes"
                value={formData.customerNotes}
                onChange={handleInputChange}
                placeholder="أدخل أي ملاحظات من العميل"
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
            onClick={() => navigate('/motorcycle-management/orders')}
            disabled={isCreating || isUpdating}
          >
            إلغاء
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating}>
            <Save className="h-4 w-4 mr-2" />
            {isCreating || isUpdating ? 'جارٍ الحفظ...' : isEdit ? 'تحديث الطلب' : 'إضافة الطلب'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryOrderForm;

