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
import { LogOut, Plus, Edit, Trash2, ArrowLeft, Calendar, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ExitPolicy {
  id: string;
  name: string;
  description: string;
  exitType: 'resignation' | 'termination' | 'retirement' | 'contract-end';
  noticePeriod: number;
  clearanceRequired: boolean;
  exitInterview: boolean;
  finalSettlement: number;
  documentReturn: string[];
  accessRevocation: boolean;
  status: 'active' | 'inactive';
}

const ExitPolicies = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [policies, setPolicies] = useState<ExitPolicy[]>([
    {
      id: "1",
      name: "سياسة نهاية الخدمة - الاستقالة",
      description: "إجراءات نهاية الخدمة للموظفين المستقيلين",
      exitType: "resignation",
      noticePeriod: 30,
      clearanceRequired: true,
      exitInterview: true,
      finalSettlement: 7,
      documentReturn: ["بطاقة الهوية", "اللابتوب", "مفاتيح المكتب"],
      accessRevocation: true,
      status: "active"
    },
    {
      id: "2",
      name: "سياسة نهاية الخدمة - التقاعد",
      description: "إجراءات نهاية الخدمة للموظفين المتقاعدين",
      exitType: "retirement",
      noticePeriod: 60,
      clearanceRequired: true,
      exitInterview: false,
      finalSettlement: 14,
      documentReturn: ["بطاقة الهوية", "شهادة الخدمة"],
      accessRevocation: true,
      status: "active"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<ExitPolicy | null>(null);
  const [formData, setFormData] = useState<Partial<ExitPolicy>>({
    name: "",
    description: "",
    exitType: "resignation",
    noticePeriod: 30,
    clearanceRequired: true,
    exitInterview: true,
    finalSettlement: 7,
    documentReturn: [],
    accessRevocation: true
  });

  const [documentInput, setDocumentInput] = useState("");

  const handleSave = () => {
    if (editingPolicy) {
      setPolicies(policies.map(policy => 
        policy.id === editingPolicy.id 
          ? { ...policy, ...formData as ExitPolicy }
          : policy
      ));
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث سياسة نهاية الخدمة بنجاح"
      });
    } else {
      const newPolicy: ExitPolicy = {
        id: Date.now().toString(),
        ...formData as ExitPolicy,
        status: "active"
      };
      setPolicies([...policies, newPolicy]);
      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة سياسة نهاية الخدمة بنجاح"
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
      exitType: "resignation",
      noticePeriod: 30,
      clearanceRequired: true,
      exitInterview: true,
      finalSettlement: 7,
      documentReturn: [],
      accessRevocation: true
    });
    setDocumentInput("");
  };

  const handleEdit = (policy: ExitPolicy) => {
    setEditingPolicy(policy);
    setFormData(policy);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPolicies(policies.filter(policy => policy.id !== id));
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف سياسة نهاية الخدمة بنجاح"
    });
  };

  const getExitTypeLabel = (type: string) => {
    const types = {
      resignation: "استقالة",
      termination: "فصل",
      retirement: "تقاعد",
      "contract-end": "انتهاء عقد"
    };
    return types[type as keyof typeof types];
  };

  const addDocument = () => {
    if (documentInput.trim() && formData.documentReturn && !formData.documentReturn.includes(documentInput.trim())) {
      setFormData({
        ...formData,
        documentReturn: [...(formData.documentReturn || []), documentInput.trim()]
      });
      setDocumentInput("");
    }
  };

  const removeDocument = (docToRemove: string) => {
    setFormData({
      ...formData,
      documentReturn: formData.documentReturn?.filter(doc => doc !== docToRemove) || []
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
          <LogOut className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">سياسات نهاية الخدمة</h1>
            <p className="text-muted-foreground">إجراءات الاستقالة وإخلاء الطرف</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingPolicy(null);
              resetForm();
            }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة سياسة نهاية خدمة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPolicy ? "تعديل سياسة نهاية الخدمة" : "إضافة سياسة نهاية خدمة جديدة"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">اسم السياسة</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="مثل: سياسة نهاية الخدمة - الاستقالة"
                />
              </div>
              
              <div>
                <Label htmlFor="description">وصف السياسة</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف تفصيلي لسياسة نهاية الخدمة"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="exitType">نوع نهاية الخدمة</Label>
                  <Select value={formData.exitType || ""} onValueChange={(value: 'resignation' | 'termination' | 'retirement' | 'contract-end') => setFormData({...formData, exitType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resignation">استقالة</SelectItem>
                      <SelectItem value="termination">فصل</SelectItem>
                      <SelectItem value="retirement">تقاعد</SelectItem>
                      <SelectItem value="contract-end">انتهاء عقد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="noticePeriod">فترة الإشعار (أيام)</Label>
                  <Input
                    id="noticePeriod"
                    type="number"
                    value={formData.noticePeriod || ""}
                    onChange={(e) => setFormData({...formData, noticePeriod: Number(e.target.value)})}
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="finalSettlement">مدة التسوية النهائية (أيام)</Label>
                <Input
                  id="finalSettlement"
                  type="number"
                  value={formData.finalSettlement || ""}
                  onChange={(e) => setFormData({...formData, finalSettlement: Number(e.target.value)})}
                  min="0"
                />
              </div>

              <div>
                <Label>الوثائق المطلوب إرجاعها</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={documentInput}
                      onChange={(e) => setDocumentInput(e.target.value)}
                      placeholder="مثل: بطاقة الهوية"
                    />
                    <Button type="button" onClick={addDocument}>
                      إضافة
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.documentReturn?.map((doc, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeDocument(doc)}>
                        {doc} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="clearanceRequired" 
                    checked={formData.clearanceRequired || false}
                    onCheckedChange={(checked) => setFormData({...formData, clearanceRequired: checked})}
                  />
                  <Label htmlFor="clearanceRequired">مطلوب إخلاء طرف</Label>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="exitInterview" 
                    checked={formData.exitInterview || false}
                    onCheckedChange={(checked) => setFormData({...formData, exitInterview: checked})}
                  />
                  <Label htmlFor="exitInterview">مقابلة نهاية الخدمة</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="accessRevocation" 
                    checked={formData.accessRevocation || false}
                    onCheckedChange={(checked) => setFormData({...formData, accessRevocation: checked})}
                  />
                  <Label htmlFor="accessRevocation">إلغاء صلاحيات الوصول</Label>
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
          <CardTitle>سياسات نهاية الخدمة</CardTitle>
          <CardDescription>جميع سياسات نهاية الخدمة وإخلاء الطرف</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم السياسة</TableHead>
                <TableHead>نوع نهاية الخدمة</TableHead>
                <TableHead>فترة الإشعار</TableHead>
                <TableHead>إخلاء طرف</TableHead>
                <TableHead>مقابلة نهاية خدمة</TableHead>
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
                      {getExitTypeLabel(policy.exitType)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {policy.noticePeriod} يوم
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={policy.clearanceRequired ? 'default' : 'secondary'}>
                      {policy.clearanceRequired ? 'مطلوب' : 'غير مطلوب'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={policy.exitInterview ? 'default' : 'secondary'}>
                      {policy.exitInterview ? 'مطلوبة' : 'غير مطلوبة'}
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

export default ExitPolicies;