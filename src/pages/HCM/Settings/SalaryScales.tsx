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
import { DollarSign, Plus, Edit, Trash2, Calculator, TrendingUp, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SalaryScale {
  id: string;
  name: string;
  code: string;
  type: 'basic' | 'management' | 'technical' | 'special';
  currency: string;
  levels: SalaryLevel[];
  allowances: Allowance[];
  status: 'active' | 'inactive';
}

interface SalaryLevel {
  level: number;
  minSalary: number;
  maxSalary: number;
  annualIncrement: number;
}

interface Allowance {
  id: string;
  name: string;
  type: 'fixed' | 'percentage';
  value: number;
  isRequired: boolean;
}

const SalaryScales = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [scales, setScales] = useState<SalaryScale[]>([
    {
      id: "1",
      name: "السلم الأساسي للموظفين",
      code: "BASIC001",
      type: "basic",
      currency: "SAR",
      levels: [
        { level: 1, minSalary: 3000, maxSalary: 5000, annualIncrement: 300 },
        { level: 2, minSalary: 5000, maxSalary: 7500, annualIncrement: 400 },
        { level: 3, minSalary: 7500, maxSalary: 10000, annualIncrement: 500 }
      ],
      allowances: [
        { id: "1", name: "بدل النقل", type: "fixed", value: 500, isRequired: true },
        { id: "2", name: "بدل السكن", type: "percentage", value: 25, isRequired: false }
      ],
      status: "active"
    },
    {
      id: "2",
      name: "سلم الإدارة العليا",
      code: "MGT001",
      type: "management",
      currency: "SAR",
      levels: [
        { level: 4, minSalary: 15000, maxSalary: 20000, annualIncrement: 1000 },
        { level: 5, minSalary: 20000, maxSalary: 30000, annualIncrement: 1500 },
        { level: 6, minSalary: 30000, maxSalary: 50000, annualIncrement: 2000 }
      ],
      allowances: [
        { id: "3", name: "بدل الإدارة", type: "percentage", value: 30, isRequired: true },
        { id: "4", name: "بدل التمثيل", type: "fixed", value: 2000, isRequired: false }
      ],
      status: "active"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingScale, setEditingScale] = useState<SalaryScale | null>(null);
  const [formData, setFormData] = useState<Partial<SalaryScale>>({
    name: "",
    code: "",
    type: "basic",
    currency: "SAR",
    levels: [],
    allowances: []
  });

  const handleSave = () => {
    if (editingScale) {
      setScales(scales.map(scale => 
        scale.id === editingScale.id 
          ? { ...scale, ...formData as SalaryScale }
          : scale
      ));
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث سلم الرواتب بنجاح"
      });
    } else {
      const newScale: SalaryScale = {
        id: Date.now().toString(),
        ...formData as SalaryScale,
        status: "active"
      };
      setScales([...scales, newScale]);
      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة سلم الرواتب بنجاح"
      });
    }
    
    setIsDialogOpen(false);
    setEditingScale(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      type: "basic",
      currency: "SAR",
      levels: [],
      allowances: []
    });
  };

  const handleEdit = (scale: SalaryScale) => {
    setEditingScale(scale);
    setFormData(scale);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setScales(scales.filter(scale => scale.id !== id));
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف سلم الرواتب بنجاح"
    });
  };

  const getTypeLabel = (type: string) => {
    const types = {
      basic: "أساسي",
      management: "إداري",
      technical: "فني",
      special: "خاص"
    };
    return types[type as keyof typeof types];
  };

  const getTypeColor = (type: string) => {
    const colors = {
      basic: "bg-blue-500",
      management: "bg-purple-500",
      technical: "bg-green-500",
      special: "bg-orange-500"
    };
    return colors[type as keyof typeof colors] || "bg-gray-500";
  };

  const addLevel = () => {
    const newLevel: SalaryLevel = {
      level: (formData.levels?.length || 0) + 1,
      minSalary: 0,
      maxSalary: 0,
      annualIncrement: 0
    };
    setFormData({
      ...formData,
      levels: [...(formData.levels || []), newLevel]
    });
  };

  const updateLevel = (index: number, field: keyof SalaryLevel, value: number) => {
    const updatedLevels = [...(formData.levels || [])];
    updatedLevels[index] = { ...updatedLevels[index], [field]: value };
    setFormData({ ...formData, levels: updatedLevels });
  };

  const removeLevel = (index: number) => {
    const updatedLevels = formData.levels?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, levels: updatedLevels });
  };

  const addAllowance = () => {
    const newAllowance: Allowance = {
      id: Date.now().toString(),
      name: "",
      type: "fixed",
      value: 0,
      isRequired: false
    };
    setFormData({
      ...formData,
      allowances: [...(formData.allowances || []), newAllowance]
    });
  };

  const updateAllowance = (index: number, field: keyof Allowance, value: any) => {
    const updatedAllowances = [...(formData.allowances || [])];
    updatedAllowances[index] = { ...updatedAllowances[index], [field]: value };
    setFormData({ ...formData, allowances: updatedAllowances });
  };

  const removeAllowance = (index: number) => {
    const updatedAllowances = formData.allowances?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, allowances: updatedAllowances });
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
            <h1 className="text-3xl font-bold">جداول الرواتب</h1>
            <p className="text-muted-foreground">إدارة السلالم والجداول للرواتب والبدلات والمكافآت</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingScale(null);
              resetForm();
            }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة سلم رواتب جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingScale ? "تعديل سلم الرواتب" : "إضافة سلم رواتب جديد"}
              </DialogTitle>
              <DialogDescription>
                املأ البيانات المطلوبة لسلم الرواتب
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">البيانات الأساسية</TabsTrigger>
                <TabsTrigger value="levels">المستويات والدرجات</TabsTrigger>
                <TabsTrigger value="allowances">البدلات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">اسم السلم</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="مثل: السلم الأساسي للموظفين"
                    />
                  </div>
                  <div>
                    <Label htmlFor="code">الكود</Label>
                    <Input
                      id="code"
                      value={formData.code || ""}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      placeholder="مثل: BASIC001"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">نوع السلم</Label>
                    <Select value={formData.type || ""} onValueChange={(value: 'basic' | 'management' | 'technical' | 'special') => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">أساسي</SelectItem>
                        <SelectItem value="management">إداري</SelectItem>
                        <SelectItem value="technical">فني</SelectItem>
                        <SelectItem value="special">خاص</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currency">العملة</Label>
                    <Select value={formData.currency || ""} onValueChange={(value) => setFormData({...formData, currency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAR">جنيه مصري</SelectItem>
                        <SelectItem value="USD">دولار أمريكي</SelectItem>
                        <SelectItem value="EUR">يورو</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="levels" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">المستويات والدرجات</h3>
                  <Button onClick={addLevel} size="sm">
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة مستوى
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {formData.levels?.map((level, index) => (
                    <div key={index} className="grid grid-cols-5 gap-2 items-center p-3 border rounded">
                      <div>
                        <Label>المستوى</Label>
                        <Input
                          type="number"
                          value={level.level}
                          onChange={(e) => updateLevel(index, 'level', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>الحد الأدنى</Label>
                        <Input
                          type="number"
                          value={level.minSalary}
                          onChange={(e) => updateLevel(index, 'minSalary', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>الحد الأقصى</Label>
                        <Input
                          type="number"
                          value={level.maxSalary}
                          onChange={(e) => updateLevel(index, 'maxSalary', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>الزيادة السنوية</Label>
                        <Input
                          type="number"
                          value={level.annualIncrement}
                          onChange={(e) => updateLevel(index, 'annualIncrement', Number(e.target.value))}
                        />
                      </div>
                      <div className="flex justify-center pt-6">
                        <Button variant="outline" size="sm" onClick={() => removeLevel(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="allowances" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">البدلات والمكافآت</h3>
                  <Button onClick={addAllowance} size="sm">
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة بدل
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {formData.allowances?.map((allowance, index) => (
                    <div key={index} className="grid grid-cols-5 gap-2 items-center p-3 border rounded">
                      <div>
                        <Label>اسم البدل</Label>
                        <Input
                          value={allowance.name}
                          onChange={(e) => updateAllowance(index, 'name', e.target.value)}
                          placeholder="مثل: بدل النقل"
                        />
                      </div>
                      <div>
                        <Label>النوع</Label>
                        <Select value={allowance.type} onValueChange={(value: 'fixed' | 'percentage') => updateAllowance(index, 'type', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                            <SelectItem value="percentage">نسبة مئوية</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>القيمة</Label>
                        <Input
                          type="number"
                          value={allowance.value}
                          onChange={(e) => updateAllowance(index, 'value', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>إجباري</Label>
                        <Select value={allowance.isRequired.toString()} onValueChange={(value) => updateAllowance(index, 'isRequired', value === 'true')}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">نعم</SelectItem>
                            <SelectItem value="false">لا</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-center pt-6">
                        <Button variant="outline" size="sm" onClick={() => removeAllowance(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">
                {editingScale ? "تحديث" : "إضافة"}
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                إلغاء
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>سلالم الرواتب المعرفة</CardTitle>
          <CardDescription>جميع سلالم الرواتب والبدلات في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الكود</TableHead>
                <TableHead>اسم السلم</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>العملة</TableHead>
                <TableHead>عدد المستويات</TableHead>
                <TableHead>عدد البدلات</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scales.map((scale) => (
                <TableRow key={scale.id}>
                  <TableCell className="font-medium">{scale.code}</TableCell>
                  <TableCell>{scale.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-white ${getTypeColor(scale.type)}`}>
                      {getTypeLabel(scale.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>{scale.currency}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-muted-foreground" />
                      {scale.levels.length}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calculator className="h-3 w-3 text-muted-foreground" />
                      {scale.allowances.length}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={scale.status === 'active' ? 'default' : 'secondary'}>
                      {scale.status === 'active' ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(scale)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(scale.id)}>
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

export default SalaryScales;