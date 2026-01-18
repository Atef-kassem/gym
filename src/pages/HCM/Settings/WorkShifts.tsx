import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Plus, Edit, Trash2, ArrowLeft, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface WorkShift {
  id: string;
  name: string;
  code: string;
  type: 'fixed' | 'flexible' | 'rotating';
  startTime: string;
  endTime: string;
  breakDuration: number;
  workingHours: number;
  daysPerWeek: string[];
  overtimeRate: number;
  isDefault: boolean;
  status: 'active' | 'inactive';
}

interface ShiftSchedule {
  id: string;
  shiftId: string;
  employeeCount: number;
  department: string;
  effectiveDate: string;
}

const WorkShifts = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [shifts, setShifts] = useState<WorkShift[]>([
    {
      id: "1",
      name: "الوردية الصباحية",
      code: "MOR001",
      type: "fixed",
      startTime: "08:00",
      endTime: "16:00",
      breakDuration: 60,
      workingHours: 8,
      daysPerWeek: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"],
      overtimeRate: 1.5,
      isDefault: true,
      status: "active"
    },
    {
      id: "2",
      name: "الوردية المسائية",
      code: "EVE001",
      type: "fixed",
      startTime: "16:00",
      endTime: "00:00",
      breakDuration: 60,
      workingHours: 8,
      daysPerWeek: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"],
      overtimeRate: 1.75,
      isDefault: false,
      status: "active"
    }
  ]);

  const [schedules, setSchedules] = useState<ShiftSchedule[]>([
    {
      id: "1",
      shiftId: "1",
      employeeCount: 15,
      department: "خدمة العملاء",
      effectiveDate: "2024-01-01"
    },
    {
      id: "2", 
      shiftId: "2",
      employeeCount: 8,
      department: "الأمن",
      effectiveDate: "2024-01-01"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<WorkShift | null>(null);
  const [formData, setFormData] = useState<Partial<WorkShift>>({
    name: "",
    code: "",
    type: "fixed",
    startTime: "",
    endTime: "",
    breakDuration: 60,
    workingHours: 8,
    daysPerWeek: [],
    overtimeRate: 1.5,
    isDefault: false
  });

  const handleSave = () => {
    if (editingShift) {
      setShifts(shifts.map(shift => 
        shift.id === editingShift.id 
          ? { ...shift, ...formData as WorkShift }
          : shift
      ));
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث الوردية بنجاح"
      });
    } else {
      const newShift: WorkShift = {
        id: Date.now().toString(),
        ...formData as WorkShift,
        status: "active"
      };
      setShifts([...shifts, newShift]);
      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة الوردية بنجاح"
      });
    }
    
    setIsDialogOpen(false);
    setEditingShift(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      type: "fixed",
      startTime: "",
      endTime: "",
      breakDuration: 60,
      workingHours: 8,
      daysPerWeek: [],
      overtimeRate: 1.5,
      isDefault: false
    });
  };

  const handleEdit = (shift: WorkShift) => {
    setEditingShift(shift);
    setFormData(shift);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setShifts(shifts.filter(shift => shift.id !== id));
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف الوردية بنجاح"
    });
  };

  const getTypeLabel = (type: string) => {
    const types = {
      fixed: "ثابتة",
      flexible: "مرنة",
      rotating: "متناوبة"
    };
    return types[type as keyof typeof types];
  };

  const getTypeColor = (type: string) => {
    const colors = {
      fixed: "bg-blue-500",
      flexible: "bg-green-500",
      rotating: "bg-purple-500"
    };
    return colors[type as keyof typeof colors] || "bg-gray-500";
  };

  const weekDays = [
    "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"
  ];

  const toggleDay = (day: string) => {
    const currentDays = formData.daysPerWeek || [];
    const newDays = currentDays.includes(day) 
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    setFormData({ ...formData, daysPerWeek: newDays });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/hcm/settings')}
            className="ml-2"
          >
            <ArrowLeft className="h-4 w-4 ml-1" />
            رجوع للإعدادات
          </Button>
          <Clock className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">إعداد الورديات</h1>
            <p className="text-muted-foreground">إدارة جداول العمل ونظام الشفتات</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingShift(null);
              resetForm();
            }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة وردية جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingShift ? "تعديل الوردية" : "إضافة وردية جديدة"}
              </DialogTitle>
              <DialogDescription>
                املأ البيانات المطلوبة للوردية
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">البيانات الأساسية</TabsTrigger>
                <TabsTrigger value="schedule">الجدولة والأوقات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">اسم الوردية</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="مثل: الوردية الصباحية"
                    />
                  </div>
                  <div>
                    <Label htmlFor="code">الكود</Label>
                    <Input
                      id="code"
                      value={formData.code || ""}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      placeholder="مثل: MOR001"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="type">نوع الوردية</Label>
                    <Select value={formData.type || ""} onValueChange={(value: 'fixed' | 'flexible' | 'rotating') => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">ثابتة</SelectItem>
                        <SelectItem value="flexible">مرنة</SelectItem>
                        <SelectItem value="rotating">متناوبة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="breakDuration">مدة الاستراحة (دقيقة)</Label>
                    <Input
                      id="breakDuration"
                      type="number"
                      value={formData.breakDuration || ""}
                      onChange={(e) => setFormData({...formData, breakDuration: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="overtimeRate">معدل العمل الإضافي</Label>
                    <Input
                      id="overtimeRate"
                      type="number"
                      step="0.1"
                      value={formData.overtimeRate || ""}
                      onChange={(e) => setFormData({...formData, overtimeRate: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="startTime">وقت البداية</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime || ""}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">وقت النهاية</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime || ""}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="workingHours">ساعات العمل</Label>
                    <Input
                      id="workingHours"
                      type="number"
                      value={formData.workingHours || ""}
                      onChange={(e) => setFormData({...formData, workingHours: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <Label>أيام العمل</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {weekDays.map((day) => (
                      <Button
                        key={day}
                        type="button"
                        variant={formData.daysPerWeek?.includes(day) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleDay(day)}
                        className="text-xs"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault || false}
                    onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="isDefault">جعل هذه الوردية افتراضية</Label>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">
                {editingShift ? "تحديث" : "إضافة"}
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                إلغاء
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="shifts" className="w-full">
        <TabsList>
          <TabsTrigger value="shifts">الورديات المعرفة</TabsTrigger>
          <TabsTrigger value="schedules">جدولة الورديات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="shifts">
          <Card>
            <CardHeader>
              <CardTitle>قائمة الورديات</CardTitle>
              <CardDescription>جميع الورديات المعرفة في النظام</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الكود</TableHead>
                    <TableHead>اسم الوردية</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>الأوقات</TableHead>
                    <TableHead>ساعات العمل</TableHead>
                    <TableHead>أيام العمل</TableHead>
                    <TableHead>معدل الإضافي</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shifts.map((shift) => (
                    <TableRow key={shift.id}>
                      <TableCell className="font-medium">{shift.code}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {shift.name}
                          {shift.isDefault && <Badge variant="outline">افتراضية</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-white ${getTypeColor(shift.type)}`}>
                          {getTypeLabel(shift.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {shift.startTime} - {shift.endTime}
                      </TableCell>
                      <TableCell>{shift.workingHours} ساعات</TableCell>
                      <TableCell className="text-sm">
                        {shift.daysPerWeek.length} أيام/أسبوع
                      </TableCell>
                      <TableCell>{shift.overtimeRate}x</TableCell>
                      <TableCell>
                        <Badge variant={shift.status === 'active' ? 'default' : 'secondary'}>
                          {shift.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(shift)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(shift.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedules">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                جدولة الورديات
              </CardTitle>
              <CardDescription>توزيع الورديات على الأقسام والموظفين</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الوردية</TableHead>
                    <TableHead>القسم</TableHead>
                    <TableHead>عدد الموظفين</TableHead>
                    <TableHead>تاريخ السريان</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule) => {
                    const shift = shifts.find(s => s.id === schedule.shiftId);
                    return (
                      <TableRow key={schedule.id}>
                        <TableCell>
                          {shift ? (
                            <div>
                              <div className="font-medium">{shift.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {shift.startTime} - {shift.endTime}
                              </div>
                            </div>
                          ) : 'غير محدد'}
                        </TableCell>
                        <TableCell>{schedule.department}</TableCell>
                        <TableCell>{schedule.employeeCount} موظف</TableCell>
                        <TableCell>{schedule.effectiveDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkShifts;