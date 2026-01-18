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
import { TrendingUp, Plus, Edit, Trash2, ArrowLeft, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface PromotionPolicy {
  id: string;
  name: string;
  description: string;
  department: string;
  minTenure: number;
  minPerformanceRating: number;
  requiredTraining: boolean;
  approvalLevels: number;
  autoPromotion: boolean;
  evaluationCriteria: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

const PromotionPolicies = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [policies, setPolicies] = useState<PromotionPolicy[]>([
    {
      id: "1",
      name: "سياسة ترقية الموظفين العامة",
      description: "السياسة العامة لترقية الموظفين في جميع الأقسام",
      department: "عام",
      minTenure: 24,
      minPerformanceRating: 4,
      requiredTraining: true,
      approvalLevels: 2,
      autoPromotion: false,
      evaluationCriteria: ["الأداء الوظيفي", "الانضباط", "المبادرة", "التطوير المهني"],
      status: "active",
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      name: "سياسة ترقية الإدارة العليا",
      description: "سياسة خاصة بترقية المناصب الإدارية العليا",
      department: "الإدارة العليا",
      minTenure: 36,
      minPerformanceRating: 5,
      requiredTraining: true,
      approvalLevels: 3,
      autoPromotion: false,
      evaluationCriteria: ["القيادة", "الرؤية الاستراتيجية", "النتائج", "تطوير الفريق"],
      status: "active",
      createdAt: "2024-01-10"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<PromotionPolicy | null>(null);
  const [formData, setFormData] = useState<Partial<PromotionPolicy>>({
    name: "",
    description: "",
    department: "",
    minTenure: 12,
    minPerformanceRating: 3,
    requiredTraining: false,
    approvalLevels: 1,
    autoPromotion: false,
    evaluationCriteria: []
  });

  const [criteriaInput, setCriteriaInput] = useState("");

  const handleSave = () => {
    if (editingPolicy) {
      setPolicies(policies.map(policy => 
        policy.id === editingPolicy.id 
          ? { ...policy, ...formData as PromotionPolicy }
          : policy
      ));
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث سياسة الترقية بنجاح"
      });
    } else {
      const newPolicy: PromotionPolicy = {
        id: Date.now().toString(),
        ...formData as PromotionPolicy,
        status: "active",
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPolicies([...policies, newPolicy]);
      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة سياسة الترقية بنجاح"
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
      minTenure: 12,
      minPerformanceRating: 3,
      requiredTraining: false,
      approvalLevels: 1,
      autoPromotion: false,
      evaluationCriteria: []
    });
    setCriteriaInput("");
  };

  const handleEdit = (policy: PromotionPolicy) => {
    setEditingPolicy(policy);
    setFormData(policy);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPolicies(policies.filter(policy => policy.id !== id));
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف سياسة الترقية بنجاح"
    });
  };

  const addCriteria = () => {
    if (criteriaInput.trim() && formData.evaluationCriteria && !formData.evaluationCriteria.includes(criteriaInput.trim())) {
      setFormData({
        ...formData,
        evaluationCriteria: [...(formData.evaluationCriteria || []), criteriaInput.trim()]
      });
      setCriteriaInput("");
    }
  };

  const removeCriteria = (criteriaToRemove: string) => {
    setFormData({
      ...formData,
      evaluationCriteria: formData.evaluationCriteria?.filter(criteria => criteria !== criteriaToRemove) || []
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
            <h1 className="text-3xl font-bold">سياسات الترقيات</h1>
            <p className="text-muted-foreground">إدارة شروط وضوابط الترقية والتنقلات</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingPolicy(null);
              resetForm();
            }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة سياسة ترقية
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPolicy ? "تعديل سياسة الترقية" : "إضافة سياسة ترقية جديدة"}
              </DialogTitle>
              <DialogDescription>
                املأ البيانات المطلوبة لسياسة الترقية
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
                    placeholder="مثل: سياسة ترقية الموظفين العامة"
                  />
                </div>
                <div>
                  <Label htmlFor="department">القسم المستهدف</Label>
                  <Input
                    id="department"
                    value={formData.department || ""}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="مثل: الموارد البشرية"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">وصف السياسة</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف تفصيلي لسياسة الترقية"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="minTenure">الحد الأدنى للخدمة (شهور)</Label>
                  <Input
                    id="minTenure"
                    type="number"
                    value={formData.minTenure || ""}
                    onChange={(e) => setFormData({...formData, minTenure: Number(e.target.value)})}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="minPerformanceRating">الحد الأدنى لتقييم الأداء</Label>
                  <Select value={formData.minPerformanceRating?.toString() || ""} onValueChange={(value) => setFormData({...formData, minPerformanceRating: Number(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - ضعيف</SelectItem>
                      <SelectItem value="2">2 - مقبول</SelectItem>
                      <SelectItem value="3">3 - جيد</SelectItem>
                      <SelectItem value="4">4 - ممتاز</SelectItem>
                      <SelectItem value="5">5 - استثنائي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="approvalLevels">مستويات الاعتماد</Label>
                  <Select value={formData.approvalLevels?.toString() || ""} onValueChange={(value) => setFormData({...formData, approvalLevels: Number(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">مستوى واحد</SelectItem>
                      <SelectItem value="2">مستويان</SelectItem>
                      <SelectItem value="3">ثلاثة مستويات</SelectItem>
                      <SelectItem value="4">أربعة مستويات</SelectItem>
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
                  <Label htmlFor="requiredTraining">يتطلب تدريب مسبق</Label>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="autoPromotion" 
                    checked={formData.autoPromotion || false}
                    onCheckedChange={(checked) => setFormData({...formData, autoPromotion: checked})}
                  />
                  <Label htmlFor="autoPromotion">ترقية تلقائية</Label>
                </div>
              </div>

              <div>
                <Label>معايير التقييم</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={criteriaInput}
                      onChange={(e) => setCriteriaInput(e.target.value)}
                      placeholder="أدخل معيار التقييم واضغط إضافة"
                      onKeyPress={(e) => e.key === 'Enter' && addCriteria()}
                    />
                    <Button type="button" onClick={addCriteria}>
                      إضافة
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.evaluationCriteria?.map((criteria, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeCriteria(criteria)}>
                        {criteria} ×
                      </Badge>
                    ))}
                  </div>
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
          <CardTitle>سياسات الترقيات المعرفة</CardTitle>
          <CardDescription>جميع سياسات الترقية والتنقلات في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم السياسة</TableHead>
                <TableHead>القسم</TableHead>
                <TableHead>مدة الخدمة</TableHead>
                <TableHead>تقييم الأداء</TableHead>
                <TableHead>تدريب مطلوب</TableHead>
                <TableHead>ترقية تلقائية</TableHead>
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
                      {policy.minTenure} شهر
                    </div>
                  </TableCell>
                  <TableCell>{policy.minPerformanceRating}/5</TableCell>
                  <TableCell>
                    <Badge variant={policy.requiredTraining ? 'default' : 'secondary'}>
                      {policy.requiredTraining ? 'مطلوب' : 'غير مطلوب'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={policy.autoPromotion ? 'default' : 'secondary'}>
                      {policy.autoPromotion ? 'نعم' : 'لا'}
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

export default PromotionPolicies;