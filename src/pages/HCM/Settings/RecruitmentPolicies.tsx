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
import { UserPlus, Plus, Edit, Trash2, ArrowLeft, Users, Clock, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface RecruitmentPolicy {
  id: string;
  name: string;
  description: string;
  department: string;
  minExperience: number;
  maxAge: number;
  minEducation: string;
  requiredSkills: string[];
  testRequired: boolean;
  interviewRounds: number;
  probationPeriod: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

const RecruitmentPolicies = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [policies, setPolicies] = useState<RecruitmentPolicy[]>([
    {
      id: "1",
      name: "سياسة توظيف الموارد البشرية",
      description: "سياسة توظيف المختصين في مجال الموارد البشرية",
      department: "الموارد البشرية",
      minExperience: 3,
      maxAge: 45,
      minEducation: "بكالوريوس",
      requiredSkills: ["إدارة الموارد البشرية", "التوظيف", "Microsoft Office"],
      testRequired: true,
      interviewRounds: 2,
      probationPeriod: 6,
      status: "active",
      createdAt: "2024-01-15"
    },
    {
      id: "2", 
      name: "سياسة توظيف المحاسبين",
      description: "سياسة خاصة بتوظيف المحاسبين والمختصين في المالية",
      department: "المحاسبة",
      minExperience: 2,
      maxAge: 40,
      minEducation: "بكالوريوس محاسبة",
      requiredSkills: ["محاسبة", "Excel المتقدم", "برامج المحاسبة"],
      testRequired: true,
      interviewRounds: 3,
      probationPeriod: 3,
      status: "active",
      createdAt: "2024-01-10"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<RecruitmentPolicy | null>(null);
  const [formData, setFormData] = useState<Partial<RecruitmentPolicy>>({
    name: "",
    description: "",
    department: "",
    minExperience: 0,
    maxAge: 65,
    minEducation: "",
    requiredSkills: [],
    testRequired: false,
    interviewRounds: 1,
    probationPeriod: 3
  });

  const [skillInput, setSkillInput] = useState("");

  const handleSave = () => {
    if (editingPolicy) {
      setPolicies(policies.map(policy => 
        policy.id === editingPolicy.id 
          ? { ...policy, ...formData as RecruitmentPolicy }
          : policy
      ));
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث سياسة التوظيف بنجاح"
      });
    } else {
      const newPolicy: RecruitmentPolicy = {
        id: Date.now().toString(),
        ...formData as RecruitmentPolicy,
        status: "active",
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPolicies([...policies, newPolicy]);
      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة سياسة التوظيف بنجاح"
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
      minExperience: 0,
      maxAge: 65,
      minEducation: "",
      requiredSkills: [],
      testRequired: false,
      interviewRounds: 1,
      probationPeriod: 3
    });
    setSkillInput("");
  };

  const handleEdit = (policy: RecruitmentPolicy) => {
    setEditingPolicy(policy);
    setFormData(policy);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPolicies(policies.filter(policy => policy.id !== id));
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف سياسة التوظيف بنجاح"
    });
  };

  const addSkill = () => {
    if (skillInput.trim() && formData.requiredSkills && !formData.requiredSkills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        requiredSkills: [...(formData.requiredSkills || []), skillInput.trim()]
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills?.filter(skill => skill !== skillToRemove) || []
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
          <UserPlus className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">سياسات التوظيف</h1>
            <p className="text-muted-foreground">إدارة شروط وآليات الاستقطاب والتوظيف</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingPolicy(null);
              resetForm();
            }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة سياسة توظيف
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPolicy ? "تعديل سياسة التوظيف" : "إضافة سياسة توظيف جديدة"}
              </DialogTitle>
              <DialogDescription>
                املأ البيانات المطلوبة لسياسة التوظيف
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
                    placeholder="مثل: سياسة توظيف الموارد البشرية"
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
                  placeholder="وصف تفصيلي لسياسة التوظيف"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="minExperience">الحد الأدنى للخبرة (سنوات)</Label>
                  <Input
                    id="minExperience"
                    type="number"
                    value={formData.minExperience || ""}
                    onChange={(e) => setFormData({...formData, minExperience: Number(e.target.value)})}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="maxAge">الحد الأقصى للعمر</Label>
                  <Input
                    id="maxAge"
                    type="number"
                    value={formData.maxAge || ""}
                    onChange={(e) => setFormData({...formData, maxAge: Number(e.target.value)})}
                    min="18"
                    max="70"
                  />
                </div>
                <div>
                  <Label htmlFor="probationPeriod">فترة التجربة (شهور)</Label>
                  <Input
                    id="probationPeriod"
                    type="number"
                    value={formData.probationPeriod || ""}
                    onChange={(e) => setFormData({...formData, probationPeriod: Number(e.target.value)})}
                    min="1"
                    max="12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minEducation">الحد الأدنى للتعليم</Label>
                  <Select value={formData.minEducation || ""} onValueChange={(value) => setFormData({...formData, minEducation: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستوى التعليمي" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ثانوي">الثانوية العامة</SelectItem>
                      <SelectItem value="دبلوم">دبلوم</SelectItem>
                      <SelectItem value="بكالوريوس">بكالوريوس</SelectItem>
                      <SelectItem value="ماجستير">ماجستير</SelectItem>
                      <SelectItem value="دكتوراه">دكتوراه</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="interviewRounds">عدد جولات المقابلة</Label>
                  <Select value={formData.interviewRounds?.toString() || ""} onValueChange={(value) => setFormData({...formData, interviewRounds: Number(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">جولة واحدة</SelectItem>
                      <SelectItem value="2">جولتان</SelectItem>
                      <SelectItem value="3">ثلاث جولات</SelectItem>
                      <SelectItem value="4">أربع جولات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch 
                  id="testRequired" 
                  checked={formData.testRequired || false}
                  onCheckedChange={(checked) => setFormData({...formData, testRequired: checked})}
                />
                <Label htmlFor="testRequired">يتطلب اختبار فني</Label>
              </div>

              <div>
                <Label>المهارات المطلوبة</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="أدخل المهارة واضغط إضافة"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button type="button" onClick={addSkill}>
                      إضافة
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.requiredSkills?.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                        {skill} ×
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
          <CardTitle>سياسات التوظيف المعرفة</CardTitle>
          <CardDescription>جميع سياسات التوظيف والاستقطاب في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم السياسة</TableHead>
                <TableHead>القسم</TableHead>
                <TableHead>الخبرة المطلوبة</TableHead>
                <TableHead>التعليم</TableHead>
                <TableHead>اختبار مطلوب</TableHead>
                <TableHead>فترة التجربة</TableHead>
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
                      {policy.minExperience} سنوات
                    </div>
                  </TableCell>
                  <TableCell>{policy.minEducation}</TableCell>
                  <TableCell>
                    <Badge variant={policy.testRequired ? 'default' : 'secondary'}>
                      {policy.testRequired ? 'مطلوب' : 'غير مطلوب'}
                    </Badge>
                  </TableCell>
                  <TableCell>{policy.probationPeriod} شهر</TableCell>
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

export default RecruitmentPolicies;