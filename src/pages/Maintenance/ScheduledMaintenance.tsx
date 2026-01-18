import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Calendar, Plus, Search, Save, CheckCircle, Clock, Wrench
} from "lucide-react";

const ScheduledMaintenance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      asset: "مكيف الهواء - الطابق الأول",
      type: "صيانة دورية",
      frequency: "شهرية",
      lastMaintenance: "2024-01-01",
      nextMaintenance: "2024-02-01",
      status: "مجدولة"
    },
    {
      id: 2,
      asset: "المصعد الرئيسي",
      type: "فحص دوري",
      frequency: "أسبوعية",
      lastMaintenance: "2024-01-20",
      nextMaintenance: "2024-01-27",
      status: "مجدولة"
    },
    {
      id: 3,
      asset: "أجهزة الحاسوب",
      type: "تنظيف",
      frequency: "شهرية",
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-02-15",
      status: "مكتملة"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    asset: "",
    type: "",
    frequency: "",
    lastMaintenance: "",
    nextMaintenance: ""
  });
  const { toast } = useToast();

  const handleAdd = () => {
    setFormData({
      asset: "",
      type: "",
      frequency: "",
      lastMaintenance: "",
      nextMaintenance: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.asset || !formData.type || !formData.frequency || !formData.nextMaintenance) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newSchedule = {
      id: schedules.length + 1,
      asset: formData.asset,
      type: formData.type,
      frequency: formData.frequency,
      lastMaintenance: formData.lastMaintenance || "-",
      nextMaintenance: formData.nextMaintenance,
      status: "مجدولة"
    };
    
    setSchedules([...schedules, newSchedule]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة جدول الصيانة بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الصيانة المجدولة</h1>
            <p className="text-gray-600 mt-1">إدارة جداول الصيانة الدورية</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              جدول صيانة جديد
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              جداول الصيانة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">الأصل/الجهاز</th>
                    <th className="text-right py-3 px-4 font-semibold">نوع الصيانة</th>
                    <th className="text-right py-3 px-4 font-semibold">التكرار</th>
                    <th className="text-right py-3 px-4 font-semibold">آخر صيانة</th>
                    <th className="text-right py-3 px-4 font-semibold">الصيانة القادمة</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule) => (
                    <tr key={schedule.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{schedule.asset}</td>
                      <td className="py-3 px-4">{schedule.type}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{schedule.frequency}</Badge>
                      </td>
                      <td className="py-3 px-4">{schedule.lastMaintenance}</td>
                      <td className="py-3 px-4 font-semibold text-blue-600">{schedule.nextMaintenance}</td>
                      <td className="py-3 px-4">
                        <Badge className={schedule.status === "مكتملة" ? "bg-green-500" : "bg-blue-500"}>
                          {schedule.status === "مكتملة" ? <CheckCircle className="w-3 h-3 ml-1" /> : <Clock className="w-3 h-3 ml-1" />}
                          {schedule.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>جدول صيانة جديد</DialogTitle>
              <DialogDescription>أدخل بيانات جدول الصيانة</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="asset">الأصل/الجهاز *</Label>
                <Input
                  id="asset"
                  value={formData.asset}
                  onChange={(e) => setFormData({...formData, asset: e.target.value})}
                  placeholder="اسم الأصل أو الجهاز"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">نوع الصيانة *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="صيانة دورية">صيانة دورية</SelectItem>
                      <SelectItem value="فحص دوري">فحص دوري</SelectItem>
                      <SelectItem value="تنظيف">تنظيف</SelectItem>
                      <SelectItem value="استبدال">استبدال</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">التكرار *</Label>
                  <Select value={formData.frequency} onValueChange={(value) => setFormData({...formData, frequency: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التكرار" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="يومية">يومية</SelectItem>
                      <SelectItem value="أسبوعية">أسبوعية</SelectItem>
                      <SelectItem value="شهرية">شهرية</SelectItem>
                      <SelectItem value="ربع سنوية">ربع سنوية</SelectItem>
                      <SelectItem value="سنوية">سنوية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastMaintenance">آخر صيانة</Label>
                  <Input
                    id="lastMaintenance"
                    type="date"
                    value={formData.lastMaintenance}
                    onChange={(e) => setFormData({...formData, lastMaintenance: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextMaintenance">الصيانة القادمة *</Label>
                  <Input
                    id="nextMaintenance"
                    type="date"
                    value={formData.nextMaintenance}
                    onChange={(e) => setFormData({...formData, nextMaintenance: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveAdd} className="bg-orange-600 hover:bg-orange-700">
                <Save className="w-4 h-4 ml-2" /> حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ScheduledMaintenance;

