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
import { TrendingUp, Plus, Edit, Trash2, ArrowLeft, Clock, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface OvertimePolicy {
  id: string;
  name: string;
  description: string;
  department: string;
  minHours: number;
  maxHoursDaily: number;
  maxHoursMonthly: number;
  multiplier: number;
  weekendMultiplier: number;
  holidayMultiplier: number;
  requiresApproval: boolean;
  approvalLevels: number;
  autoCalculation: boolean;
  status: 'active' | 'inactive';
}

const OvertimePolicies = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [policies, setPolicies] = useState<OvertimePolicy[]>([
    {
      id: "1",
      name: "سياسة الساعات الإضافية العامة",
      description: "السياسة العامة لحساب الساعات الإضافية لجميع الموظفين",
      department: "عام",
      minHours: 1,
      maxHoursDaily: 4,
      maxHoursMonthly: 40,
      multiplier: 1.5,
      weekendMultiplier: 2.0,
      holidayMultiplier: 2.5,
      requiresApproval: true,
      approvalLevels: 1,
      autoCalculation: true,
      status: "active"
    },
    {
      id: "2",
      name: "سياسة ساعات إضافية - التشغيل",
      description: "سياسة خاصة بقسم التشغيل مع حد أعلى للساعات",
      department: "التشغيل",
      minHours: 0.5,
      maxHoursDaily: 6,
      maxHoursMonthly: 60,
      multiplier: 1.25,
      weekendMultiplier: 1.75,
      holidayMultiplier: 2.0,
      requiresApproval: true,
      approvalLevels: 2,
      autoCalculation: false,
      status: "active"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<OvertimePolicy | null>(null);
  const [formData, setFormData] = useState<Partial<OvertimePolicy>>({
    name: "",
    description: "",
    department: "",
    minHours: 1,
    maxHoursDaily: 4,
    maxHoursMonthly: 40,
    multiplier: 1.5,
    weekendMultiplier: 2.0,
    holidayMultiplier: 2.5,
    requiresApproval: true,
    approvalLevels: 1,
    autoCalculation: true
  });

  const handleSave = () => {
    if (editingPolicy) {
      setPolicies(policies.map(policy => 
        policy.id === editingPolicy.id 
          ? { ...policy, ...formData as OvertimePolicy }
          : policy
      ));
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث سياسة العمل الإضافي بنجاح"
      });
    } else {
      const newPolicy: OvertimePolicy = {
        id: Date.now().toString(),
        ...formData as OvertimePolicy,
        status: "active"
      };
      setPolicies([...policies, newPolicy]);
      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة سياسة العمل الإضافي بنجاح"
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
      department: "",
      minHours: 1,
      maxHoursDaily: 4,
      maxHoursMonthly: 40,
      multiplier: 1.5,
      weekendMultiplier: 2.0,
      holidayMultiplier: 2.5,
      requiresApproval: true,
      approvalLevels: 1,
      autoCalculation: true
    });
  };

  const handleEdit = (policy: OvertimePolicy) => {
    setEditingPolicy(policy);
    setFormData(policy);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPolicies(policies.filter(policy => policy.id !== id));
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف سياسة العمل الإضافي بنجاح"
    });
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
          <TrendingUp className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">سياسات العمل الإضافي</h1>
            <p className="text-muted-foreground">تعريف الحالات ومعادلات الاحتساب</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingPolicy(null);
              resetForm();
            }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة سياسة عمل إضافي
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPolicy ? "تعديل سياسة العمل الإضافي" : "إضافة سياسة عمل إضافي جديدة"}
              </DialogTitle>
              <DialogDescription>
                املأ البيانات المطلوبة لسياسة العمل الإضافي
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">اسم السياسة</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="مثل: سياسة الساعات الإضافية العامة"
                  />
                </div>
                <div>
                  <Label htmlFor="department">القسم المستهدف</Label>
                  <Input
                    id="department"
                    value={formData.department || ""}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="مثل: التشغيل"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">وصف السياسة</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف تفصيلي لسياسة العمل الإضافي"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="minHours">الحد الأدنى (ساعات)</Label>
                  <Input
                    id="minHours"
                    type="number"
                    value={formData.minHours || ""}
                    onChange={(e) => setFormData({...formData, minHours: Number(e.target.value)})}
                    min="0"
                    step="0.5"
                  />
                </div>
                <div>
                  <Label htmlFor="maxHoursDaily">الحد الأقصى يومياً</Label>
                  <Input
                    id="maxHoursDaily"
                    type="number"
                    value={formData.maxHoursDaily || ""}
                    onChange={(e) => setFormData({...formData, maxHoursDaily: Number(e.target.value)})}
                    min="0"
                    step="0.5"
                  />
                </div>
                <div>
                  <Label htmlFor="maxHoursMonthly">الحد الأقصى شهرياً</Label>
                  <Input
                    id="maxHoursMonthly"
                    type="number"
                    value={formData.maxHoursMonthly || ""}
                    onChange={(e) => setFormData({...formData, maxHoursMonthly: Number(e.target.value)})}
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="multiplier">مضاعف أيام العمل</Label>
                  <Input
                    id="multiplier"
                    type="number"
                    value={formData.multiplier || ""}
                    onChange={(e) => setFormData({...formData, multiplier: Number(e.target.value)})}
                    min="1"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="weekendMultiplier">مضاعف عطلة نهاية الأسبوع</Label>
                  <Input
                    id="weekendMultiplier"
                    type="number"
                    value={formData.weekendMultiplier || ""}
                    onChange={(e) => setFormData({...formData, weekendMultiplier: Number(e.target.value)})}
                    min="1"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="holidayMultiplier">مضاعف الإجازات الرسمية</Label>
                  <Input
                    id="holidayMultiplier"
                    type="number"
                    value={formData.holidayMultiplier || ""}
                    onChange={(e) => setFormData({...formData, holidayMultiplier: Number(e.target.value)})}
                    min="1"
                    step="0.1"
                  />
                </div>
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

              <div className="space-y-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="requiresApproval" 
                    checked={formData.requiresApproval || false}
                    onCheckedChange={(checked) => setFormData({...formData, requiresApproval: checked})}
                  />
                  <Label htmlFor="requiresApproval">يتطلب اعتماد مسبق</Label>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="autoCalculation" 
                    checked={formData.autoCalculation || false}
                    onCheckedChange={(checked) => setFormData({...formData, autoCalculation: checked})}
                  />
                  <Label htmlFor="autoCalculation">حساب تلقائي</Label>
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
          <CardTitle>سياسات العمل الإضافي</CardTitle>
          <CardDescription>جميع سياسات احتساب الساعات الإضافية والمضاعفات</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم السياسة</TableHead>
                <TableHead>القسم</TableHead>
                <TableHead>الحد الأدنى</TableHead>
                <TableHead>الحد الأقصى يومياً</TableHead>
                <TableHead>مضاعف عادي</TableHead>
                <TableHead>مضاعف عطلة</TableHead>
                <TableHead>حساب تلقائي</TableHead>
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
                  <TableCell>{policy.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {policy.minHours}س
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {policy.maxHoursDaily}س
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calculator className="h-3 w-3 text-muted-foreground" />
                      {policy.multiplier}x
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calculator className="h-3 w-3 text-muted-foreground" />
                      {policy.weekendMultiplier}x
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={policy.autoCalculation ? 'default' : 'secondary'}>
                      {policy.autoCalculation ? 'نعم' : 'لا'}
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

export default OvertimePolicies;