import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Clock, Plus, Edit, Trash2, ArrowLeft, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AttendancePolicy {
  id: string;
  name: string;
  description: string;
  graceMinutes: number;
  lateThreshold: number;
  absenceThreshold: number;
  deductionType: 'minutes' | 'percentage' | 'fixed';
  deductionValue: number;
  warningAfterLates: number;
  autoDeduction: boolean;
  weekendWork: boolean;
  flexibleTime: boolean;
  status: 'active' | 'inactive';
}

const AttendancePolicies = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [policies, setPolicies] = useState<AttendancePolicy[]>([
    {
      id: "1",
      name: "سياسة الحضور العامة",
      description: "السياسة العامة للحضور والانصراف لجميع الموظفين",
      graceMinutes: 15,
      lateThreshold: 30,
      absenceThreshold: 3,
      deductionType: "minutes",
      deductionValue: 1,
      warningAfterLates: 3,
      autoDeduction: true,
      weekendWork: false,
      flexibleTime: false,
      status: "active"
    },
    {
      id: "2",
      name: "سياسة الإدارة العليا",
      description: "سياسة خاصة بالإدارة العليا مع مرونة أكبر",
      graceMinutes: 30,
      lateThreshold: 60,
      absenceThreshold: 5,
      deductionType: "percentage",
      deductionValue: 0.5,
      warningAfterLates: 5,
      autoDeduction: false,
      weekendWork: true,
      flexibleTime: true,
      status: "active"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<AttendancePolicy | null>(null);
  const [formData, setFormData] = useState<Partial<AttendancePolicy>>({
    name: "",
    description: "",
    graceMinutes: 15,
    lateThreshold: 30,
    absenceThreshold: 3,
    deductionType: "minutes",
    deductionValue: 1,
    warningAfterLates: 3,
    autoDeduction: true,
    weekendWork: false,
    flexibleTime: false
  });

  const handleSave = () => {
    if (editingPolicy) {
      setPolicies(policies.map(policy => 
        policy.id === editingPolicy.id 
          ? { ...policy, ...formData as AttendancePolicy }
          : policy
      ));
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث سياسة الحضور بنجاح"
      });
    } else {
      const newPolicy: AttendancePolicy = {
        id: Date.now().toString(),
        ...formData as AttendancePolicy,
        status: "active"
      };
      setPolicies([...policies, newPolicy]);
      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة سياسة الحضور بنجاح"
      });
    }
    
    setIsDialogOpen(false);
    setEditingPolicy(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      graceMinutes: 15,
      lateThreshold: 30,
      absenceThreshold: 3,
      deductionType: "minutes",
      deductionValue: 1,
      warningAfterLates: 3,
      autoDeduction: true,
      weekendWork: false,
      flexibleTime: false
    });
  };

  const handleEdit = (policy: AttendancePolicy) => {
    setEditingPolicy(policy);
    setFormData(policy);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPolicies(policies.filter(policy => policy.id !== id));
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف سياسة الحضور بنجاح"
    });
  };

  const getDeductionTypeLabel = (type: string) => {
    const types = {
      minutes: "دقائق من الراتب",
      percentage: "نسبة مئوية",
      fixed: "مبلغ ثابت"
    };
    return types[type as keyof typeof types];
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
            <h1 className="text-3xl font-bold">سياسات التأخيرات</h1>
            <p className="text-muted-foreground">آلية احتساب التأخير والاستقطاعات</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingPolicy(null);
              resetForm();
            }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة سياسة حضور
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPolicy ? "تعديل سياسة الحضور" : "إضافة سياسة حضور جديدة"}
              </DialogTitle>
              <DialogDescription>
                املأ البيانات المطلوبة لسياسة الحضور والانصراف
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">اسم السياسة</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="مثل: سياسة الحضور العامة"
                />
              </div>
              
              <div>
                <Label htmlFor="description">وصف السياسة</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف تفصيلي لسياسة الحضور"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="graceMinutes">فترة السماح (دقيقة)</Label>
                  <Input
                    id="graceMinutes"
                    type="number"
                    value={formData.graceMinutes || ""}
                    onChange={(e) => setFormData({...formData, graceMinutes: Number(e.target.value)})}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="lateThreshold">حد التأخير (دقيقة)</Label>
                  <Input
                    id="lateThreshold"
                    type="number"
                    value={formData.lateThreshold || ""}
                    onChange={(e) => setFormData({...formData, lateThreshold: Number(e.target.value)})}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="absenceThreshold">حد الغياب (أيام)</Label>
                  <Input
                    id="absenceThreshold"
                    type="number"
                    value={formData.absenceThreshold || ""}
                    onChange={(e) => setFormData({...formData, absenceThreshold: Number(e.target.value)})}
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="deductionType">نوع الاستقطاع</Label>
                  <Select value={formData.deductionType || ""} onValueChange={(value: 'minutes' | 'percentage' | 'fixed') => setFormData({...formData, deductionType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">دقائق من الراتب</SelectItem>
                      <SelectItem value="percentage">نسبة مئوية</SelectItem>
                      <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="deductionValue">قيمة الاستقطاع</Label>
                  <Input
                    id="deductionValue"
                    type="number"
                    value={formData.deductionValue || ""}
                    onChange={(e) => setFormData({...formData, deductionValue: Number(e.target.value)})}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="warningAfterLates">إنذار بعد (تأخيرات)</Label>
                  <Input
                    id="warningAfterLates"
                    type="number"
                    value={formData.warningAfterLates || ""}
                    onChange={(e) => setFormData({...formData, warningAfterLates: Number(e.target.value)})}
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="autoDeduction" 
                    checked={formData.autoDeduction || false}
                    onCheckedChange={(checked) => setFormData({...formData, autoDeduction: checked})}
                  />
                  <Label htmlFor="autoDeduction">استقطاع تلقائي</Label>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="weekendWork" 
                    checked={formData.weekendWork || false}
                    onCheckedChange={(checked) => setFormData({...formData, weekendWork: checked})}
                  />
                  <Label htmlFor="weekendWork">العمل في عطلة نهاية الأسبوع</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="flexibleTime" 
                    checked={formData.flexibleTime || false}
                    onCheckedChange={(checked) => setFormData({...formData, flexibleTime: checked})}
                  />
                  <Label htmlFor="flexibleTime">مواعيد عمل مرنة</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingPolicy ? "تحديث" : "إضافة"}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>سياسات الحضور والتأخيرات</CardTitle>
          <CardDescription>جميع سياسات الحضور والانصراف واحتساب التأخيرات</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم السياسة</TableHead>
                <TableHead>فترة السماح</TableHead>
                <TableHead>حد التأخير</TableHead>
                <TableHead>نوع الاستقطاع</TableHead>
                <TableHead>استقطاع تلقائي</TableHead>
                <TableHead>مواعيد مرنة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{policy.name}</div>
                      <div className="text-sm text-muted-foreground">{policy.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {policy.graceMinutes} دقيقة
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-orange-500" />
                      {policy.lateThreshold} دقيقة
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getDeductionTypeLabel(policy.deductionType)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={policy.autoDeduction ? 'default' : 'secondary'}>
                      {policy.autoDeduction ? 'نعم' : 'لا'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={policy.flexibleTime ? 'default' : 'secondary'}>
                      {policy.flexibleTime ? 'نعم' : 'لا'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={policy.status === 'active' ? 'default' : 'secondary'}>
                      {policy.status === 'active' ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(policy)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(policy.id)}>
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
    </div>
  );
};

export default AttendancePolicies;