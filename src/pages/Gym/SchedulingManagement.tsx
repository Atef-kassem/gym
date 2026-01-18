import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar, Plus, Clock, MapPin, Users, Save, Edit, Trash2,
  CheckCircle, XCircle
} from "lucide-react";

const SchedulingManagement = () => {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      type: "حصة تدريبية",
      title: "تمارين القلب",
      trainer: "أحمد محمود",
      date: "2024-01-25",
      time: "09:00",
      duration: "60 دقيقة",
      participants: 15,
      maxParticipants: 20,
      location: "صالة 1",
      status: "متاح"
    },
    {
      id: 2,
      type: "حجز قاعة",
      title: "قاعة اليوغا",
      trainer: "سارة أحمد",
      date: "2024-01-25",
      time: "11:00",
      duration: "90 دقيقة",
      participants: 8,
      maxParticipants: 10,
      location: "قاعة اليوغا",
      status: "شبه ممتلئ"
    },
    {
      id: 3,
      type: "موعد شخصي",
      title: "جلسة تدريب شخصي",
      trainer: "محمد علي",
      date: "2024-01-25",
      time: "14:00",
      duration: "45 دقيقة",
      participants: 1,
      maxParticipants: 1,
      location: "صالة VIP",
      status: "محجوز"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    trainer: "",
    date: "",
    time: "",
    duration: "",
    maxParticipants: "",
    location: "",
    notes: ""
  });
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      "متاح": "bg-green-500",
      "شبه ممتلئ": "bg-yellow-500",
      "محجوز": "bg-blue-500",
      "ممتلئ": "bg-red-500"
    };
    return <Badge className={colors[status] || "bg-gray-500"}>{status}</Badge>;
  };

  const handleAdd = () => {
    setFormData({
      type: "",
      title: "",
      trainer: "",
      date: "",
      time: "",
      duration: "",
      maxParticipants: "",
      location: "",
      notes: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (schedule: any) => {
    setSelectedSchedule(schedule);
    setFormData({
      type: schedule.type,
      title: schedule.title,
      trainer: schedule.trainer,
      date: schedule.date,
      time: schedule.time,
      duration: schedule.duration,
      maxParticipants: schedule.maxParticipants.toString(),
      location: schedule.location,
      notes: schedule.notes || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (schedule: any) => {
    setSelectedSchedule(schedule);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.type || !formData.title || !formData.trainer || !formData.date || !formData.time) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newSchedule = {
      id: schedules.length + 1,
      ...formData,
      participants: 0,
      maxParticipants: parseInt(formData.maxParticipants) || 20,
      status: "متاح"
    };
    
    setSchedules([...schedules, newSchedule]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة الحجز بنجاح"
    });
  };

  const handleSaveEdit = () => {
    if (!formData.type || !formData.title || !formData.trainer || !formData.date || !formData.time) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setSchedules(schedules.map(s => 
      s.id === selectedSchedule.id 
        ? { ...s, ...formData, maxParticipants: parseInt(formData.maxParticipants) || 20 }
        : s
    ));
    
    setIsEditDialogOpen(false);
    setSelectedSchedule(null);
    toast({
      title: "نجح",
      description: "تم تحديث الحجز بنجاح"
    });
  };

  const handleConfirmDelete = () => {
    setSchedules(schedules.filter(s => s.id !== selectedSchedule.id));
    setIsDeleteDialogOpen(false);
    setSelectedSchedule(null);
    toast({
      title: "نجح",
      description: "تم حذف الحجز بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الجدولة والبيع</h1>
            <p className="text-gray-600 mt-1">إدارة الجدولة والبيع</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Calendar className="w-5 h-5 ml-2" />
              عرض التقويم
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              حجز جديد
            </Button>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الحصص اليوم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">24</div>
              <p className="text-sm text-gray-500 mt-1">حصص مجدولة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">البيع النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">156</div>
              <p className="text-sm text-gray-500 mt-1">حجز نشط</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">القاعات المتاحة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">8</div>
              <p className="text-sm text-gray-500 mt-1">قاعة متاحة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">معدل الإشغال</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">78%</div>
              <p className="text-sm text-gray-500 mt-1">نسبة الإشغال</p>
            </CardContent>
          </Card>
        </div>

        {/* قائمة الجدولة */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              جدول اليوم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{schedule.title}</h3>
                          <Badge variant="outline">{schedule.type}</Badge>
                          {getStatusBadge(schedule.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{schedule.time} - {schedule.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{schedule.participants}/{schedule.maxParticipants}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{schedule.trainer}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{schedule.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(schedule)} title="تعديل">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(schedule)} title="حذف">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* خيارات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                حجز الحصص
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">حجز الحصص التدريبية</p>
              <Button variant="outline" className="mt-4 w-full">
                عرض الحصص
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                حجوزات القاعات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">إدارة حجوزات القاعات</p>
              <Button variant="outline" className="mt-4 w-full">
                عرض القاعات
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                المواعيد الشخصية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">إدارة المواعيد الشخصية</p>
              <Button variant="outline" className="mt-4 w-full">
                عرض المواعيد
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dialog إضافة حجز جديد */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة حجز جديد</DialogTitle>
              <DialogDescription>
                أدخل بيانات الحجز الجديد
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="type">نوع الحجز *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الحجز" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="حصة تدريبية">حصة تدريبية</SelectItem>
                    <SelectItem value="حجز قاعة">حجز قاعة</SelectItem>
                    <SelectItem value="موعد شخصي">موعد شخصي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">العنوان *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="عنوان الحصة أو الحجز"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trainer">المدرب *</Label>
                  <Input
                    id="trainer"
                    value={formData.trainer}
                    onChange={(e) => setFormData({...formData, trainer: e.target.value})}
                    placeholder="اسم المدرب"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">الموقع *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="الموقع أو القاعة"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">التاريخ *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">الوقت *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">المدة *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="مثال: 60 دقيقة"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">الحد الأقصى للمشاركين</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                  placeholder="الحد الأقصى"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="ملاحظات إضافية"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveAdd} className="bg-orange-600 hover:bg-orange-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تعديل حجز */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل الحجز</DialogTitle>
              <DialogDescription>
                قم بتعديل بيانات الحجز
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">نوع الحجز *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الحجز" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="حصة تدريبية">حصة تدريبية</SelectItem>
                    <SelectItem value="حجز قاعة">حجز قاعة</SelectItem>
                    <SelectItem value="موعد شخصي">موعد شخصي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-title">العنوان *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="عنوان الحصة أو الحجز"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-trainer">المدرب *</Label>
                  <Input
                    id="edit-trainer"
                    value={formData.trainer}
                    onChange={(e) => setFormData({...formData, trainer: e.target.value})}
                    placeholder="اسم المدرب"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">الموقع *</Label>
                  <Input
                    id="edit-location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="الموقع أو القاعة"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">التاريخ *</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-time">الوقت *</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">المدة *</Label>
                  <Input
                    id="edit-duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="مثال: 60 دقيقة"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-maxParticipants">الحد الأقصى للمشاركين</Label>
                <Input
                  id="edit-maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                  placeholder="الحد الأقصى"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">ملاحظات</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="ملاحظات إضافية"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveEdit} className="bg-orange-600 hover:bg-orange-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تأكيد الحذف */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من حذف الحجز "{selectedSchedule?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                إلغاء
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                <Trash2 className="w-4 h-4 ml-2" />
                حذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default SchedulingManagement;

