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
import { Users, Plus, Edit, Trash2, Briefcase, Star, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface JobDefinition {
  id: string;
  title: string;
  titleEn: string;
  code: string;
  level: string;
  department: string;
  category: 'management' | 'technical' | 'administrative' | 'operational';
  description: string;
  requirements: string;
  responsibilities: string;
  minSalary: number;
  maxSalary: number;
  status: 'active' | 'inactive';
}

const JobDefinitions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobDefinition[]>([
    {
      id: "1",
      title: "مدير الموارد البشرية",
      titleEn: "HR Manager",
      code: "HRM001",
      level: "المستوى الخامس",
      department: "الموارد البشرية",
      category: "management",
      description: "إدارة وتطوير استراتيجيات الموارد البشرية",
      requirements: "بكالوريوس في إدارة الأعمال أو الموارد البشرية، خبرة 5 سنوات",
      responsibilities: "وضع السياسات، إدارة الفريق، التطوير الوظيفي",
      minSalary: 15000,
      maxSalary: 25000,
      status: "active"
    },
    {
      id: "2",
      title: "محاسب أول",
      titleEn: "Senior Accountant",
      code: "ACC001",
      level: "المستوى الرابع",
      department: "المحاسبة",
      category: "technical",
      description: "إعداد التقارير المالية والمحاسبية",
      requirements: "بكالوريوس محاسبة، شهادة مهنية، خبرة 3 سنوات",
      responsibilities: "إعداد القوائم المالية، مراجعة الحسابات، التدقيق الداخلي",
      minSalary: 8000,
      maxSalary: 15000,
      status: "active"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobDefinition | null>(null);
  const [formData, setFormData] = useState<Partial<JobDefinition>>({
    title: "",
    titleEn: "",
    code: "",
    level: "",
    department: "",
    category: "technical",
    description: "",
    requirements: "",
    responsibilities: "",
    minSalary: 0,
    maxSalary: 0
  });

  const handleSave = () => {
    if (editingJob) {
      setJobs(jobs.map(job => 
        job.id === editingJob.id 
          ? { ...job, ...formData as JobDefinition }
          : job
      ));
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث الوظيفة بنجاح"
      });
    } else {
      const newJob: JobDefinition = {
        id: Date.now().toString(),
        ...formData as JobDefinition,
        status: "active"
      };
      setJobs([...jobs, newJob]);
      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة الوظيفة بنجاح"
      });
    }
    
    setIsDialogOpen(false);
    setEditingJob(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      titleEn: "",
      code: "",
      level: "",
      department: "",
      category: "technical",
      description: "",
      requirements: "",
      responsibilities: "",
      minSalary: 0,
      maxSalary: 0
    });
  };

  const handleEdit = (job: JobDefinition) => {
    setEditingJob(job);
    setFormData(job);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id));
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف الوظيفة بنجاح"
    });
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      management: "إدارية",
      technical: "فنية",
      administrative: "إدارية مساعدة",
      operational: "تشغيلية"
    };
    return categories[category as keyof typeof categories];
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      management: "bg-purple-500",
      technical: "bg-blue-500",
      administrative: "bg-green-500",
      operational: "bg-orange-500"
    };
    return colors[category as keyof typeof colors] || "bg-gray-500";
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
          <Briefcase className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">تعريف الوظائف والمسميات</h1>
            <p className="text-muted-foreground">إدارة قائمة مركزية لجميع المسميات والدرجات الوظيفية</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingJob(null);
              resetForm();
            }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة وظيفة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingJob ? "تعديل الوظيفة" : "إضافة وظيفة جديدة"}
              </DialogTitle>
              <DialogDescription>
                املأ البيانات المطلوبة للوظيفة
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">المسمى الوظيفي (عربي)</Label>
                  <Input
                    id="title"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="مثل: مدير الموارد البشرية"
                  />
                </div>
                <div>
                  <Label htmlFor="titleEn">المسمى الوظيفي (إنجليزي)</Label>
                  <Input
                    id="titleEn"
                    value={formData.titleEn || ""}
                    onChange={(e) => setFormData({...formData, titleEn: e.target.value})}
                    placeholder="e.g: HR Manager"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="code">كود الوظيفة</Label>
                  <Input
                    id="code"
                    value={formData.code || ""}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="مثل: HRM001"
                  />
                </div>
                <div>
                  <Label htmlFor="level">المستوى</Label>
                  <Select value={formData.level || ""} onValueChange={(value) => setFormData({...formData, level: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستوى" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="المستوى الأول">المستوى الأول</SelectItem>
                      <SelectItem value="المستوى الثاني">المستوى الثاني</SelectItem>
                      <SelectItem value="المستوى الثالث">المستوى الثالث</SelectItem>
                      <SelectItem value="المستوى الرابع">المستوى الرابع</SelectItem>
                      <SelectItem value="المستوى الخامس">المستوى الخامس</SelectItem>
                      <SelectItem value="المستوى السادس">المستوى السادس</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">الفئة</Label>
                  <Select value={formData.category || ""} onValueChange={(value: 'management' | 'technical' | 'administrative' | 'operational') => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="management">إدارية</SelectItem>
                      <SelectItem value="technical">فنية</SelectItem>
                      <SelectItem value="administrative">إدارية مساعدة</SelectItem>
                      <SelectItem value="operational">تشغيلية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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

              <div>
                <Label htmlFor="description">وصف الوظيفة</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف مختصر عن الوظيفة ومهامها الرئيسية"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="requirements">المتطلبات والمؤهلات</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements || ""}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  placeholder="المؤهلات الأكاديمية، الخبرات المطلوبة، المهارات اللازمة"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="responsibilities">المسؤوليات والمهام</Label>
                <Textarea
                  id="responsibilities"
                  value={formData.responsibilities || ""}
                  onChange={(e) => setFormData({...formData, responsibilities: e.target.value})}
                  placeholder="المسؤوليات الرئيسية والمهام اليومية"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minSalary">الحد الأدنى للراتب</Label>
                  <Input
                    id="minSalary"
                    type="number"
                    value={formData.minSalary || ""}
                    onChange={(e) => setFormData({...formData, minSalary: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="maxSalary">الحد الأقصى للراتب</Label>
                  <Input
                    id="maxSalary"
                    type="number"
                    value={formData.maxSalary || ""}
                    onChange={(e) => setFormData({...formData, maxSalary: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingJob ? "تحديث" : "إضافة"}
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
          <CardTitle>قائمة الوظائف والمسميات</CardTitle>
          <CardDescription>جميع الوظائف المعرفة في النظام مع تفاصيلها</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الكود</TableHead>
                <TableHead>المسمى الوظيفي</TableHead>
                <TableHead>المستوى</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>القسم</TableHead>
                <TableHead>نطاق الراتب</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.code}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{job.title}</div>
                      <div className="text-sm text-muted-foreground">{job.titleEn}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      {job.level}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-white ${getCategoryColor(job.category)}`}>
                      {getCategoryLabel(job.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>{job.department}</TableCell>
                  <TableCell className="text-sm">
                    {job.minSalary.toLocaleString()} - {job.maxSalary.toLocaleString()} جنيه
                  </TableCell>
                  <TableCell>
                    <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                      {job.status === 'active' ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(job)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(job.id)}>
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

export default JobDefinitions;