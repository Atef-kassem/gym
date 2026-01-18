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
import { DollarSign, Plus, Edit, Trash2, ArrowLeft, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SalaryPolicy {
  id: string;
  name: string;
  description: string;
  department: string;
  effectiveDate: string;
  autoApply: boolean;
  baseSalaryMin: number;
  baseSalaryMax: number;
  annualIncreaseRate: number;
  performanceBonus: boolean;
  status: 'active' | 'inactive';
}

const SalaryPolicies = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [policies, setPolicies] = useState<SalaryPolicy[]>([
    {
      id: "1",
      name: "سياسة الرواتب العامة",
      description: "السياسة العامة للرواتب والاستحقاقات",
      department: "عام",
      effectiveDate: "2024-01-01",
      autoApply: true,
      baseSalaryMin: 3000,
      baseSalaryMax: 50000,
      annualIncreaseRate: 5,
      performanceBonus: true,
      status: "active"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<SalaryPolicy | null>(null);
  const [formData, setFormData] = useState<Partial<SalaryPolicy>>({
    name: "",
    description: "",
    department: "",
    effectiveDate: "",
    autoApply: true,
    baseSalaryMin: 0,
    baseSalaryMax: 0,
    annualIncreaseRate: 0,
    performanceBonus: false
  });

  const handleSave = () => {
    if (editingPolicy) {
      setPolicies(policies.map(policy => 
        policy.id === editingPolicy.id 
          ? { ...policy, ...formData as SalaryPolicy }
          : policy
      ));
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث سياسة الرواتب بنجاح"
      });
    } else {
      const newPolicy: SalaryPolicy = {
        id: Date.now().toString(),
        ...formData as SalaryPolicy,
        status: "active"
      };
      setPolicies([...policies, newPolicy]);
      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة سياسة الرواتب بنجاح"
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
      effectiveDate: "",
      autoApply: true,
      baseSalaryMin: 0,
      baseSalaryMax: 0,
      annualIncreaseRate: 0,
      performanceBonus: false
    });
  };

  const handleEdit = (policy: SalaryPolicy) => {
    setEditingPolicy(policy);
    setFormData(policy);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPolicies(policies.filter(policy => policy.id !== id));
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف سياسة الرواتب بنجاح"
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
          <DollarSign className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">سياسات الرواتب</h1>
            <p className="text-muted-foreground">جداول الرواتب والاستحقاقات</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingPolicy(null);
              resetForm();
            }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة سياسة راتب
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPolicy ? "تعديل سياسة الراتب" : "إضافة سياسة راتب جديدة"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">اسم السياسة</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="مثل: سياسة الرواتب العامة"
                  />
                </div>
                <div>
                  <Label htmlFor="department">القسم</Label>
                  <Input
                    id="department"
                    value={formData.department || ""}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="مثل: الموارد البشرية"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="baseSalaryMin">الحد الأدنى للراتب</Label>
                  <Input
                    id="baseSalaryMin"
                    type="number"
                    value={formData.baseSalaryMin || ""}
                    onChange={(e) => setFormData({...formData, baseSalaryMin: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="baseSalaryMax">الحد الأقصى للراتب</Label>
                  <Input
                    id="baseSalaryMax"
                    type="number"
                    value={formData.baseSalaryMax || ""}
                    onChange={(e) => setFormData({...formData, baseSalaryMax: Number(e.target.value)})}
                  />
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
          <CardTitle>سياسات الرواتب</CardTitle>
          <CardDescription>جميع سياسات الرواتب في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم السياسة</TableHead>
                <TableHead>القسم</TableHead>
                <TableHead>نطاق الراتب</TableHead>
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
                    {policy.baseSalaryMin.toLocaleString()} - {policy.baseSalaryMax.toLocaleString()} جنيه
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

export default SalaryPolicies;