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
import { FileText, Plus, Edit, Trash2, ArrowLeft, AlertTriangle, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface DocumentAlert {
  id: string;
  name: string;
  description: string;
  documentType: 'passport' | 'visa' | 'license' | 'certification' | 'contract' | 'insurance';
  alertDays: number;
  reminderDays: number[];
  autoAlert: boolean;
  emailAlert: boolean;
  smsAlert: boolean;
  recipients: string[];
  status: 'active' | 'inactive';
}

const DocumentAlerts = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<DocumentAlert[]>([
    {
      id: "1",
      name: "تنبيه انتهاء الجواز",
      description: "تنبيه قبل انتهاء صلاحية جواز السفر",
      documentType: "passport",
      alertDays: 90,
      reminderDays: [90, 60, 30, 7],
      autoAlert: true,
      emailAlert: true,
      smsAlert: false,
      recipients: ["hr@company.com", "manager@company.com"],
      status: "active"
    },
    {
      id: "2",
      name: "تنبيه انتهاء الإقامة",
      description: "تنبيه قبل انتهاء صلاحية الإقامة",
      documentType: "visa",
      alertDays: 60,
      reminderDays: [60, 30, 15, 3],
      autoAlert: true,
      emailAlert: true,
      smsAlert: true,
      recipients: ["hr@company.com"],
      status: "active"
    },
    {
      id: "3",
      name: "تنبيه انتهاء رخصة القيادة",
      description: "تنبيه قبل انتهاء صلاحية رخصة القيادة",
      documentType: "license",
      alertDays: 30,
      reminderDays: [30, 7],
      autoAlert: false,
      emailAlert: true,
      smsAlert: false,
      recipients: ["hr@company.com"],
      status: "active"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<DocumentAlert | null>(null);
  const [formData, setFormData] = useState<Partial<DocumentAlert>>({
    name: "",
    description: "",
    documentType: "passport",
    alertDays: 30,
    reminderDays: [],
    autoAlert: true,
    emailAlert: true,
    smsAlert: false,
    recipients: []
  });

  const [recipientInput, setRecipientInput] = useState("");
  const [reminderInput, setReminderInput] = useState("");

  const handleSave = () => {
    if (editingAlert) {
      setAlerts(alerts.map(alert => 
        alert.id === editingAlert.id 
          ? { ...alert, ...formData as DocumentAlert }
          : alert
      ));
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث تنبيه الوثائق بنجاح"
      });
    } else {
      const newAlert: DocumentAlert = {
        id: Date.now().toString(),
        ...formData as DocumentAlert,
        status: "active"
      };
      setAlerts([...alerts, newAlert]);
      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة تنبيه الوثائق بنجاح"
      });
    }
    
    setIsDialogOpen(false);
    setEditingAlert(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      documentType: "passport",
      alertDays: 30,
      reminderDays: [],
      autoAlert: true,
      emailAlert: true,
      smsAlert: false,
      recipients: []
    });
    setRecipientInput("");
    setReminderInput("");
  };

  const handleEdit = (alert: DocumentAlert) => {
    setEditingAlert(alert);
    setFormData(alert);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف تنبيه الوثائق بنجاح"
    });
  };

  const getDocumentTypeLabel = (type: string) => {
    const types = {
      passport: "جواز السفر",
      visa: "الإقامة/الفيزا",
      license: "رخصة القيادة",
      certification: "الشهادات",
      contract: "العقود",
      insurance: "التأمين"
    };
    return types[type as keyof typeof types];
  };

  const addRecipient = () => {
    if (recipientInput.trim() && formData.recipients && !formData.recipients.includes(recipientInput.trim())) {
      setFormData({
        ...formData,
        recipients: [...(formData.recipients || []), recipientInput.trim()]
      });
      setRecipientInput("");
    }
  };

  const removeRecipient = (recipientToRemove: string) => {
    setFormData({
      ...formData,
      recipients: formData.recipients?.filter(recipient => recipient !== recipientToRemove) || []
    });
  };

  const addReminderDay = () => {
    const day = Number(reminderInput);
    if (day > 0 && formData.reminderDays && !formData.reminderDays.includes(day)) {
      setFormData({
        ...formData,
        reminderDays: [...(formData.reminderDays || []), day].sort((a, b) => b - a)
      });
      setReminderInput("");
    }
  };

  const removeReminderDay = (dayToRemove: number) => {
    setFormData({
      ...formData,
      reminderDays: formData.reminderDays?.filter(day => day !== dayToRemove) || []
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
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">تنبيهات الوثائق</h1>
            <p className="text-muted-foreground">إعداد تنبيهات انتهاء الوثائق</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingAlert(null);
              resetForm();
            }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة تنبيه وثيقة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAlert ? "تعديل تنبيه الوثيقة" : "إضافة تنبيه وثيقة جديد"}
              </DialogTitle>
              <DialogDescription>
                املأ البيانات المطلوبة لتنبيه الوثيقة
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">اسم التنبيه</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="مثل: تنبيه انتهاء الجواز"
                  />
                </div>
                <div>
                  <Label htmlFor="documentType">نوع الوثيقة</Label>
                  <Select value={formData.documentType || ""} onValueChange={(value: 'passport' | 'visa' | 'license' | 'certification' | 'contract' | 'insurance') => setFormData({...formData, documentType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">جواز السفر</SelectItem>
                      <SelectItem value="visa">الإقامة/الفيزا</SelectItem>
                      <SelectItem value="license">رخصة القيادة</SelectItem>
                      <SelectItem value="certification">الشهادات</SelectItem>
                      <SelectItem value="contract">العقود</SelectItem>
                      <SelectItem value="insurance">التأمين</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">وصف التنبيه</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="وصف تفصيلي للتنبيه"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="alertDays">عدد أيام التنبيه المسبق</Label>
                <Input
                  id="alertDays"
                  type="number"
                  value={formData.alertDays || ""}
                  onChange={(e) => setFormData({...formData, alertDays: Number(e.target.value)})}
                  min="1"
                />
              </div>

              <div>
                <Label>أيام التذكير</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={reminderInput}
                      onChange={(e) => setReminderInput(e.target.value)}
                      placeholder="عدد الأيام"
                      min="1"
                    />
                    <Button type="button" onClick={addReminderDay}>
                      إضافة
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.reminderDays?.map((day, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeReminderDay(day)}>
                        {day} يوم ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label>المستلمون</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={recipientInput}
                      onChange={(e) => setRecipientInput(e.target.value)}
                      placeholder="البريد الإلكتروني"
                      type="email"
                    />
                    <Button type="button" onClick={addRecipient}>
                      إضافة
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.recipients?.map((recipient, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeRecipient(recipient)}>
                        {recipient} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="autoAlert" 
                    checked={formData.autoAlert || false}
                    onCheckedChange={(checked) => setFormData({...formData, autoAlert: checked})}
                  />
                  <Label htmlFor="autoAlert">تنبيه تلقائي</Label>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="emailAlert" 
                    checked={formData.emailAlert || false}
                    onCheckedChange={(checked) => setFormData({...formData, emailAlert: checked})}
                  />
                  <Label htmlFor="emailAlert">تنبيه عبر البريد الإلكتروني</Label>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    id="smsAlert" 
                    checked={formData.smsAlert || false}
                    onCheckedChange={(checked) => setFormData({...formData, smsAlert: checked})}
                  />
                  <Label htmlFor="smsAlert">تنبيه عبر الرسائل النصية</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingAlert ? "تحديث" : "إضافة"}
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
          <CardTitle>تنبيهات الوثائق المعرفة</CardTitle>
          <CardDescription>جميع تنبيهات انتهاء الوثائق في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم التنبيه</TableHead>
                <TableHead>نوع الوثيقة</TableHead>
                <TableHead>أيام التنبيه</TableHead>
                <TableHead>تنبيه تلقائي</TableHead>
                <TableHead>بريد إلكتروني</TableHead>
                <TableHead>رسائل نصية</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{alert.name}</div>
                      <div className="text-sm text-muted-foreground">{alert.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getDocumentTypeLabel(alert.documentType)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {alert.alertDays} يوم
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={alert.autoAlert ? 'default' : 'secondary'}>
                      {alert.autoAlert ? 'نعم' : 'لا'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={alert.emailAlert ? 'default' : 'secondary'}>
                      {alert.emailAlert ? 'مفعل' : 'معطل'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={alert.smsAlert ? 'default' : 'secondary'}>
                      {alert.smsAlert ? 'مفعل' : 'معطل'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={alert.status === 'active' ? 'default' : 'secondary'}>
                      {alert.status === 'active' ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(alert)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(alert.id)}>
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

export default DocumentAlerts;