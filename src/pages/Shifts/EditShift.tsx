import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Clock, Save, ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { useGetShiftByIdQuery, useUpdateShiftMutation } from '@/services/shiftApi';
import { useGetAllBranchesQuery } from '@/services/branchesApi';
import { toast } from 'sonner';

export default function EditShift() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: shiftData, isLoading: isLoadingShift, error } = useGetShiftByIdQuery(id);
  const [updateShift, { isLoading: isUpdating }] = useUpdateShiftMutation();
  const { data: branchesData } = useGetAllBranchesQuery({});
  
  const branches = Array.isArray(branchesData?.data) ? branchesData.data : [];
  const shift = shiftData?.data;
  
  const [formData, setFormData] = useState({
    shiftName: '',
    startTime: '',
    endTime: '',
    branchId: 'all',
    description: '',
    color: '#3b82f6',
    isActive: true
  });
  
  useEffect(() => {
    if (shift) {
      setFormData({
        shiftName: shift.shiftName || '',
        startTime: shift.startTime?.substring(0, 5) || '',
        endTime: shift.endTime?.substring(0, 5) || '',
        branchId: shift.branchId ? shift.branchId.toString() : 'all',
        description: shift.description || '',
        color: shift.color || '#3b82f6',
        isActive: shift.isActive !== undefined ? shift.isActive : true
      });
    }
  }, [shift]);
  
  const colorOptions = [
    { value: '#10b981', label: 'أخضر', name: 'صباحي' },
    { value: '#f59e0b', label: 'برتقالي', name: 'مسائي' },
    { value: '#8b5cf6', label: 'بنفسجي', name: 'ليلي' },
    { value: '#3b82f6', label: 'أزرق', name: 'افتراضي' },
    { value: '#ef4444', label: 'أحمر', name: 'طوارئ' },
    { value: '#6b7280', label: 'رمادي', name: 'صيانة' }
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.shiftName || !formData.startTime || !formData.endTime) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    try {
      await updateShift({
        id: parseInt(id!),
        shiftName: formData.shiftName,
        startTime: formData.startTime,
        endTime: formData.endTime,
        branchId: formData.branchId && formData.branchId !== 'all' ? parseInt(formData.branchId) : null,
        description: formData.description || null,
        color: formData.color,
        isActive: formData.isActive
      }).unwrap();
      
      toast.success('تم تحديث الوردية بنجاح! 🎉');
      navigate('/shifts');
    } catch (error: any) {
      console.error('Error updating shift:', error);
      toast.error(error?.data?.message || 'حدث خطأ أثناء تحديث الوردية');
    }
  };
  
  if (isLoadingShift) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل بيانات الوردية...</p>
        </div>
      </div>
    );
  }
  
  if (error || !shift) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">خطأ في تحميل الوردية</h3>
            <p className="text-muted-foreground mb-4">لم يتم العثور على الوردية المطلوبة</p>
            <Button onClick={() => navigate('/shifts')}>
              <ArrowRight className="h-4 w-4 ml-2" />
              العودة للقائمة
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-card bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">تعديل الوردية</h1>
                  <p className="text-sm text-muted-foreground">تحديث معلومات وأوقات الوردية</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate('/shifts')}>
                <ArrowRight className="h-4 w-4 ml-2" />
                العودة للقائمة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* نموذج تعديل الوردية */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>معلومات الوردية</CardTitle>
              <CardDescription>قم بتعديل تفاصيل الوردية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* المعلومات الأساسية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="shiftName">اسم الوردية *</Label>
                  <Input
                    id="shiftName"
                    value={formData.shiftName}
                    onChange={(e) => setFormData({ ...formData, shiftName: e.target.value })}
                    placeholder="مثال: الوردية الصباحية"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="branchId">الفرع (اختياري)</Label>
                  <Select
                    value={formData.branchId}
                    onValueChange={(value) => setFormData({ ...formData, branchId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الفروع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الفروع</SelectItem>
                      {branches.map((branch: any) => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
                          {branch.arabicName || branch.englishName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* أوقات الوردية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startTime">وقت البداية *</Label>
                  <div className="relative">
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="pr-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endTime">وقت النهاية *</Label>
                  <div className="relative">
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="pr-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* حالة الوردية */}
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive">حالة الوردية</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.isActive ? 'الوردية نشطة ومتاحة للاستخدام' : 'الوردية معطلة ولن تظهر في النظام'}
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>

              {/* اللون */}
              <div className="space-y-2">
                <Label htmlFor="color">لون الوردية</Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {colorOptions.map((colorOption) => (
                    <button
                      key={colorOption.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: colorOption.value })}
                      className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                        formData.color === colorOption.value
                          ? 'border-primary shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: `${colorOption.value}20` }}
                    >
                      <div
                        className="w-8 h-8 rounded-full mx-auto mb-2"
                        style={{ backgroundColor: colorOption.value }}
                      />
                      <p className="text-xs font-medium text-center">{colorOption.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* الوصف */}
              <div className="space-y-2">
                <Label htmlFor="description">الوصف (اختياري)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف الوردية وملاحظات إضافية..."
                  rows={4}
                />
              </div>

              {/* معاينة الوردية */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    معاينة الوردية
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: formData.color }}
                      />
                      <span className="font-bold">{formData.shiftName || 'اسم الوردية'}</span>
                      {formData.isActive ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">نشطة</span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">معطلة</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <Clock className="inline h-4 w-4 ml-1" />
                      من {formData.startTime || '--:--'} إلى {formData.endTime || '--:--'}
                    </div>
                    {formData.branchId && formData.branchId !== 'all' && (
                      <div className="text-sm text-gray-600">
                        الفرع: {branches.find((b: any) => b.id.toString() === formData.branchId)?.arabicName || 'غير محدد'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* أزرار الحفظ */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/shifts')}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="bg-primary hover:bg-primary/90"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2" />
                  جاري التحديث...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  حفظ التعديلات
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

