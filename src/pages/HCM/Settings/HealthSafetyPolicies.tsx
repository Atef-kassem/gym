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
import { Shield, Plus, Edit, Trash2, ArrowLeft, Heart, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface HealthSafetyPolicy {
  id: string;
  name: string;
  description: string;
  category: 'medical-checkup' | 'insurance' | 'safety-training' | 'emergency-procedures' | 'workplace-safety';
  frequency: 'monthly' | 'quarterly' | 'semi-annual' | 'annual' | 'one-time';
  mandatory: boolean;
  reminderDays: number;
  applicableTo: string[];
  status: 'active' | 'inactive';
}

const HealthSafetyPolicies = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [policies, setPolicies] = useState<HealthSafetyPolicy[]>([
    {
      id: "1",
      name: "سياسة الكشف الطبي الدوري",
      description: "فحص طبي شامل سنوي لجميع الموظفين",
      category: "medical-checkup",
      frequency: "annual",
      mandatory: true,
      reminderDays: 30,
      applicableTo: ["جميع الموظفين"],
      status: "active"
    },
    {
      id: "2",
      name: "سياسة التأمين الطبي",
      description: "تغطية تأمينية شاملة للموظفين وعائلاتهم",
      category: "insurance",
      frequency: "annual",
      mandatory: true,
      reminderDays: 60,
      applicableTo: ["الموظفين الدائمين"],
      status: "active"
    },
    {
      id: "3",
      name: "تدريب السلامة المهنية",
      description: "دورات تدريبية حول السلامة في مكان العمل",
      category: "safety-training",
      frequency: "quarterly",
      mandatory: true,
      reminderDays: 14,
      applicableTo: ["موظفي التشغيل", "الفنيين"],
      status: "active"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<HealthSafetyPolicy | null>(null);
  const [formData, setFormData] = useState<Partial<HealthSafetyPolicy>>({
    name: "",
    description: "",
    category: "medical-checkup",
    frequency: "annual",
    mandatory: true,
    reminderDays: 30,
    applicableTo: []
  });

  const [applicableInput, setApplicableInput] = useState("");

  const handleSave = () => {
    if (editingPolicy) {
      setPolicies(policies.map(policy => 
        policy.id === editingPolicy.id 
          ? { ...policy, ...formData as HealthSafetyPolicy }
          : policy
      ));
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث سياسة الصحة والسلامة بنجاح"
      });
    } else {
      const newPolicy: HealthSafetyPolicy = {
        id: Date.now().toString(),
        ...formData as HealthSafetyPolicy,
        status: "active"
      };
      setPolicies([...policies, newPolicy]);
      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة سياسة الصحة والسلامة بنجاح"
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
      category: "medical-checkup",
      frequency: "annual",
      mandatory: true,
      reminderDays: 30,
      applicableTo: []
    });
    setApplicableInput("");
  };

  const handleEdit = (policy: HealthSafetyPolicy) => {
    setEditingPolicy(policy);
    setFormData(policy);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPolicies(policies.filter(policy => policy.id !== id));
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف سياسة الصحة والسلامة بنجاح"
    });
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      "medical-checkup": "كشف طبي",
      insurance: "تأمين",
      "safety-training": "تدريب السلامة",
      "emergency-procedures": "إجراءات الطوارئ",
      "workplace-safety": "سلامة مكان العمل"
    };
    return categories[category as keyof typeof categories];
  };

  const getFrequencyLabel = (frequency: string) => {
    const frequencies = {
      monthly: "شهري",
      quarterly: "ربع سنوي",
      "semi-annual": "نصف سنوي",
      annual: "سنوي",
      "one-time": "مرة واحدة"
    };
    return frequencies[frequency as keyof typeof frequencies];
  };

  const addApplicable = () => {
    if (applicableInput.trim() && formData.applicableTo && !formData.applicableTo.includes(applicableInput.trim())) {
      setFormData({
        ...formData,
        applicableTo: [...(formData.applicableTo || []), applicableInput.trim()]
      });
      setApplicableInput("");
    }
  };

  const removeApplicable = (itemToRemove: string) => {
    setFormData({
      ...formData,
      applicableTo: formData.applicableTo?.filter(item => item !== itemToRemove) || []
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
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">الصحة والسلامة</h1>
            <p className="text-muted-foreground">سياسات الكشف الطبي والتأمين</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingPolicy(null);
              resetForm();
            }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة سياسة صحة وسلامة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPolicy ? "تعديل سياسة الصحة والسلامة" : "إضافة سياسة صحة وسلامة جديدة"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">اسم السياسة</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="مثل: سياسة الكشف الطبي الدوري"
                />
              </div>
              
              <div>
                <Label htmlFor="description">وصف السياسة</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف تفصيلي لسياسة الصحة والسلامة"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">الفئة</Label>
                  <Select value={formData.category || ""} onValueChange={(value: 'medical-checkup' | 'insurance' | 'safety-training' | 'emergency-procedures' | 'workplace-safety') => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medical-checkup">كشف طبي</SelectItem>
                      <SelectItem value="insurance">تأمين</SelectItem>
                      <SelectItem value="safety-training">تدريب السلامة</SelectItem>
                      <SelectItem value="emergency-procedures">إجراءات الطوارئ</SelectItem>
                      <SelectItem value="workplace-safety">سلامة مكان العمل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="frequency">التكرار</Label>
                  <Select value={formData.frequency || ""} onValueChange={(value: 'monthly' | 'quarterly' | 'semi-annual' | 'annual' | 'one-time') => setFormData({...formData, frequency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">شهري</SelectItem>
                      <SelectItem value="quarterly">ربع سنوي</SelectItem>
                      <SelectItem value="semi-annual">نصف سنوي</SelectItem>
                      <SelectItem value="annual">سنوي</SelectItem>
                      <SelectItem value="one-time">مرة واحدة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="reminderDays">أيام التذكير المسبق</Label>
                <Input
                  id="reminderDays"
                  type="number"
                  value={formData.reminderDays || ""}
                  onChange={(e) => setFormData({...formData, reminderDays: Number(e.target.value)})}
                  min="0"
                />
              </div>

              <div>
                <Label>ينطبق على</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={applicableInput}
                      onChange={(e) => setApplicableInput(e.target.value)}
                      placeholder="مثل: جميع الموظفين"
                    />
                    <Button type="button" onClick={addApplicable}>
                      إضافة
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.applicableTo?.map((item, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeApplicable(item)}>
                        {item} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch 
                  id="mandatory" 
                  checked={formData.mandatory || false}
                  onCheckedChange={(checked) => setFormData({...formData, mandatory: checked})}
                />
                <Label htmlFor="mandatory">إجباري</Label>
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
          <CardTitle>سياسات الصحة والسلامة</CardTitle>
          <CardDescription>جميع سياسات الصحة والسلامة المهنية</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم السياسة</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>التكرار</TableHead>
                <TableHead>إجباري</TableHead>
                <TableHead>ينطبق على</TableHead>
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
                    <Badge variant="outline">
                      {getCategoryLabel(policy.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3 text-muted-foreground" />
                      {getFrequencyLabel(policy.frequency)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={policy.mandatory ? 'default' : 'secondary'}>
                      {policy.mandatory ? 'إجباري' : 'اختياري'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {policy.applicableTo.slice(0, 2).join(', ')}
                      {policy.applicableTo.length > 2 && ` +${policy.applicableTo.length - 2}`}
                    </div>
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

export default HealthSafetyPolicies;