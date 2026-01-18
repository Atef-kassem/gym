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
import { FileText, Plus, Edit, Trash2, ArrowLeft, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface LeavePolicy {
  id: string;
  name: string;
  nameEn: string;
  type: 'annual' | 'sick' | 'maternity' | 'emergency' | 'pilgrimage' | 'study';
  daysPerYear: number;
  carryOverDays: number;
  maxBalance: number;
  requiresApproval: boolean;
  approvalLevels: number;
  advanceNotice: number;
  paidLeave: boolean;
  gender: 'all' | 'male' | 'female';
  minTenure: number;
  status: 'active' | 'inactive';
}

const LeavePolicies = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [policies, setPolicies] = useState<LeavePolicy[]>([
    {
      id: "1",
      name: "الإجازة السنوية",
      nameEn: "Annual Leave",
      type: "annual",
      daysPerYear: 30,
      carryOverDays: 7,
      maxBalance: 60,
      requiresApproval: true,
      approvalLevels: 1,
      advanceNotice: 7,
      paidLeave: true,
      gender: "all",
      minTenure: 12,
      status: "active"
    },
    {
      id: "2",
      name: "الإجازة المرضية",
      nameEn: "Sick Leave",
      type: "sick",
      daysPerYear: 120,
      carryOverDays: 0,
      maxBalance: 120,
      requiresApproval: false,
      approvalLevels: 0,
      advanceNotice: 0,
      paidLeave: true,
      gender: "all",
      minTenure: 0,
      status: "active"
    },
    {
      id: "3",
      name: "إجازة الوضع",
      nameEn: "Maternity Leave",
      type: "maternity",
      daysPerYear: 70,
      carryOverDays: 0,
      maxBalance: 70,
      requiresApproval: true,
      approvalLevels: 2,
      advanceNotice: 30,
      paidLeave: true,
      gender: "female",
      minTenure: 6,
      status: "active"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<LeavePolicy | null>(null);
  const [formData, setFormData] = useState<Partial<LeavePolicy>>({
    name: "",
    nameEn: "",
    type: "annual",
    daysPerYear: 0,
    carryOverDays: 0,
    maxBalance: 0,
    requiresApproval: true,
    approvalLevels: 1,
    advanceNotice: 0,
    paidLeave: true,
    gender: "all",
    minTenure: 0
  });

  const handleSave = () => {
    if (editingPolicy) {
      setPolicies(policies.map(policy => 
        policy.id === editingPolicy.id 
          ? { ...policy, ...formData as LeavePolicy }
          : policy
      ));
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث سياسة الإجازة بنجاح"
      });
    } else {
      const newPolicy: LeavePolicy = {
        id: Date.now().toString(),
        ...formData as LeavePolicy,
        status: "active"
      };
      setPolicies([...policies, newPolicy]);
      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة سياسة الإجازة بنجاح"
      });
    }
    
    setIsDialogOpen(false);
    setEditingPolicy(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      nameEn: "",
      type: "annual",
      daysPerYear: 0,
      carryOverDays: 0,
      maxBalance: 0,
      requiresApproval: true,
      approvalLevels: 1,
      advanceNotice: 0,
      paidLeave: true,
      gender: "all",
      minTenure: 0
    });
  };

  const handleEdit = (policy: LeavePolicy) => {
    setEditingPolicy(policy);
    setFormData(policy);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPolicies(policies.filter(policy => policy.id !== id));
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف سياسة الإجازة بنجاح"
    });
  };

  const getTypeLabel = (type: string) => {
    const types = {
      annual: "سنوية",
      sick: "مرضية",
      maternity: "وضع",
      emergency: "طارئة",
      pilgrimage: "حج",
      study: "دج.مية"
    };
    return types[type as keyof typeof types];
  };

  const getGenderLabel = (gender: string) => {
    const genders = {
      all: "الجميع",
      male: "ذكور فقط",
      female: "إناث فقط"
    };
    return genders[gender as keyof typeof genders];
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
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">سياسات الإجازات</h1>
            <p className="text-muted-foreground">تعريف أنواع الإجازات وشروطها</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingPolicy(null);
              resetForm();
            }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة سياسة إجازة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPolicy ? "تعديل سياسة الإجازة" : "إضافة سياسة إجازة جديدة"}
              </DialogTitle>
              <DialogDescription>
                املأ البيانات المطلوبة لسياسة الإجازة
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">اسم الإجازة (عربي)</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="مثل: الإجازة السنوية"
                  />
                </div>
                <div>
                  <Label htmlFor="nameEn">اسم الإجازة (إنجليزي)</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn || ""}
                    onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                    placeholder="e.g: Annual Leave"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">نوع الإجازة</Label>
                  <Select value={formData.type || ""} onValueChange={(value: 'annual' | 'sick' | 'maternity' | 'emergency' | 'pilgrimage' | 'study') => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">سنوية</SelectItem>
                      <SelectItem value="sick">مرضية</SelectItem>
                      <SelectItem value="maternity">وضع</SelectItem>
                      <SelectItem value="emergency">طارئة</SelectItem>
                      <SelectItem value="pilgrimage">حج</SelectItem>
                      <SelectItem value="study">دج.مية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="gender">الجنس المستهدف</Label>
                  <Select value={formData.gender || ""} onValueChange={(value: 'all' | 'male' | 'female') => setFormData({...formData, gender: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الجميع</SelectItem>
                      <SelectItem value="male">ذكور فقط</SelectItem>
                      <SelectItem value="female">إناث فقط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="daysPerYear">الأيام سنوياً</Label>
                  <Input
                    id="daysPerYear"
                    type="number"
                    value={formData.daysPerYear || ""}
                    onChange={(e) => setFormData({...formData, daysPerYear: Number(e.target.value)})}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="carryOverDays">أيام الترحيل</Label>
                  <Input
                    id="carryOverDays"
                    type="number"
                    value={formData.carryOverDays || ""}
                    onChange={(e) => setFormData({...formData, carryOverDays: Number(e.target.value)})}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="maxBalance">الحد الأقصى للرصيد</Label>
                  <Input
                    id="maxBalance"
                    type="number"
                    value={formData.maxBalance || ""}
                    onChange={(e) => setFormData({...formData, maxBalance: Number(e.target.value)})}
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="minTenure">الحد الأدنى للخدمة (شهور)</Label>
                  <Input
                    id="minTenure"
                    type="number"
                    value={formData.minTenure || ""}
                    onChange={(e) => setFormData({...formData, minTenure: Number(e.target.value)})}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="advanceNotice">إشعار مسبق (أيام)</Label>
                  <Input
                    id="advanceNotice"
                    type="number"
                    value={formData.advanceNotice || ""}
                    onChange={(e) => setFormData({...formData, advanceNotice: Number(e.target.value)})}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="approvalLevels">مستويات الاعتماد</Label>
                  <Select value={formData.approvalLevels?.toString() || ""} onValueChange={(value) => setFormData({...formData, approvalLevels: Number(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">بدون اعتماد</SelectItem>
                      <SelectItem value="1">مستوى واحد</SelectItem>
                      <SelectItem value="2">مستويان</SelectItem>
                      <SelectItem value="3">ثلاثة مستويات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="requiresApproval" 
                    checked={formData.requiresApproval || false}
                    onCheckedChange={(checked) => setFormData({...formData, requiresApproval: checked})}
                  />
                  <Label htmlFor="requiresApproval">تتطلب اعتماد</Label>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="paidLeave" 
                    checked={formData.paidLeave || false}
                    onCheckedChange={(checked) => setFormData({...formData, paidLeave: checked})}
                  />
                  <Label htmlFor="paidLeave">إجازة مدفوعة الأجر</Label>
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
          <CardTitle>سياسات الإجازات المعرفة</CardTitle>
          <CardDescription>جميع أنواع الإجازات وشروطها في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم الإجازة</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الأيام سنوياً</TableHead>
                <TableHead>أيام الترحيل</TableHead>
                <TableHead>اعتماد مطلوب</TableHead>
                <TableHead>مدفوعة الأجر</TableHead>
                <TableHead>الجنس</TableHead>
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
                      <div className="text-sm text-muted-foreground">{policy.nameEn}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getTypeLabel(policy.type)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {policy.daysPerYear}
                    </div>
                  </TableCell>
                  <TableCell>{policy.carryOverDays}</TableCell>
                  <TableCell>
                    <Badge variant={policy.requiresApproval ? 'default' : 'secondary'}>
                      {policy.requiresApproval ? 'مطلوب' : 'غير مطلوب'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={policy.paidLeave ? 'default' : 'secondary'}>
                      {policy.paidLeave ? 'نعم' : 'لا'}
                    </Badge>
                  </TableCell>
                  <TableCell>{getGenderLabel(policy.gender)}</TableCell>
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

export default LeavePolicies;