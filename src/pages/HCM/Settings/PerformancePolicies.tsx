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
import { Star, Plus, Edit, Trash2, ArrowLeft, Target, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface PerformancePolicy {
  id: string;
  name: string;
  description: string;
  evaluationCycle: 'quarterly' | 'semi-annual' | 'annual';
  ratingScale: number;
  criteriaWeights: Record<string, number>;
  requiredTraining: boolean;
  autoReminders: boolean;
  managerApproval: boolean;
  status: 'active' | 'inactive';
}

const PerformancePolicies = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [policies, setPolicies] = useState<PerformancePolicy[]>([
    {
      id: "1",
      name: "سياسة تقييم الأداء السنوية",
      description: "السياسة العامة لتقييم أداء الموظفين",
      evaluationCycle: "annual",
      ratingScale: 5,
      criteriaWeights: {
        "الأداء الوظيفي": 40,
        "الجودة": 25,
        "الانضباط": 15,
        "التطوير": 20
      },
      requiredTraining: true,
      autoReminders: true,
      managerApproval: true,
      status: "active"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<PerformancePolicy | null>(null);
  const [formData, setFormData] = useState<Partial<PerformancePolicy>>({
    name: "",
    description: "",
    evaluationCycle: "annual",
    ratingScale: 5,
    criteriaWeights: {},
    requiredTraining: false,
    autoReminders: true,
    managerApproval: true
  });

  const handleSave = () => {
    if (editingPolicy) {
      setPolicies(policies.map(policy => 
        policy.id === editingPolicy.id 
          ? { ...policy, ...formData as PerformancePolicy }
          : policy
      ));
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث سياسة التقييم بنجاح"
      });
    } else {
      const newPolicy: PerformancePolicy = {
        id: Date.now().toString(),
        ...formData as PerformancePolicy,
        status: "active"
      };
      setPolicies([...policies, newPolicy]);
      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة سياسة التقييم بنجاح"
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
      evaluationCycle: "annual",
      ratingScale: 5,
      criteriaWeights: {},
      requiredTraining: false,
      autoReminders: true,
      managerApproval: true
    });
  };

  const handleEdit = (policy: PerformancePolicy) => {
    setEditingPolicy(policy);
    setFormData(policy);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPolicies(policies.filter(policy => policy.id !== id));
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف سياسة التقييم بنجاح"
    });
  };

  const getCycleLabel = (cycle: string) => {
    const cycles = {
      quarterly: "ربع سنوي",
      "semi-annual": "نصف سنوي",
      annual: "سنوي"
    };
    return cycles[cycle as keyof typeof cycles];
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
          <Star className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">سياسات التقييم</h1>
            <p className="text-muted-foreground">دورية التقييم ومعايير الأداء</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingPolicy(null);
              resetForm();
            }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة سياسة تقييم
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPolicy ? "تعديل سياسة التقييم" : "إضافة سياسة تقييم جديدة"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">اسم السياسة</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="مثل: سياسة تقييم الأداء السنوية"
                />
              </div>
              
              <div>
                <Label htmlFor="description">وصف السياسة</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف تفصيلي لسياسة التقييم"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="evaluationCycle">دورة التقييم</Label>
                  <Select value={formData.evaluationCycle || ""} onValueChange={(value: 'quarterly' | 'semi-annual' | 'annual') => setFormData({...formData, evaluationCycle: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quarterly">ربع سنوي</SelectItem>
                      <SelectItem value="semi-annual">نصف سنوي</SelectItem>
                      <SelectItem value="annual">سنوي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ratingScale">مقياس التقييم</Label>
                  <Select value={formData.ratingScale?.toString() || ""} onValueChange={(value) => setFormData({...formData, ratingScale: Number(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">مقياس 3 درجات</SelectItem>
                      <SelectItem value="5">مقياس 5 درجات</SelectItem>
                      <SelectItem value="10">مقياس 10 درجات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="requiredTraining" 
                    checked={formData.requiredTraining || false}
                    onCheckedChange={(checked) => setFormData({...formData, requiredTraining: checked})}
                  />
                  <Label htmlFor="requiredTraining">تدريب مطلوب للمقيمين</Label>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="autoReminders" 
                    checked={formData.autoReminders || false}
                    onCheckedChange={(checked) => setFormData({...formData, autoReminders: checked})}
                  />
                  <Label htmlFor="autoReminders">تذكير تلقائي</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="managerApproval" 
                    checked={formData.managerApproval || false}
                    onCheckedChange={(checked) => setFormData({...formData, managerApproval: checked})}
                  />
                  <Label htmlFor="managerApproval">اعتماد المدير مطلوب</Label>
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
          <CardTitle>سياسات التقييم</CardTitle>
          <CardDescription>جميع سياسات تقييم الأداء في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم السياسة</TableHead>
                <TableHead>دورة التقييم</TableHead>
                <TableHead>مقياس التقييم</TableHead>
                <TableHead>تدريب مطلوب</TableHead>
                <TableHead>تذكير تلقائي</TableHead>
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
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {getCycleLabel(policy.evaluationCycle)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-muted-foreground" />
                      {policy.ratingScale} درجات
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={policy.requiredTraining ? 'default' : 'secondary'}>
                      {policy.requiredTraining ? 'مطلوب' : 'غير مطلوب'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={policy.autoReminders ? 'default' : 'secondary'}>
                      {policy.autoReminders ? 'مفعل' : 'معطل'}
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

export default PerformancePolicies;