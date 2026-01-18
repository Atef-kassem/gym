import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { UserCheck, Plus, Edit, Trash2, ArrowLeft, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const SelfService = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [services, setServices] = useState([
    { id: "1", name: "طلب إجازة", description: "تقديم طلبات الإجازات", enabled: true, category: "attendance" },
    { id: "2", name: "طلب شهادة راتب", description: "طباعة شهادات الراتب", enabled: true, category: "documents" },
    { id: "3", name: "تحديث البيانات الشخصية", description: "تعديل المعلومات الشخصية", enabled: false, category: "profile" },
    { id: "4", name: "عرض كشف الراتب", description: "الاطلاع على تفاصيل الراتب", enabled: true, category: "payroll" }
  ]);

  const toggleService = (id: string) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, enabled: !service.enabled } : service
    ));
    toast({
      title: "تم التحديث",
      description: "تم تحديث حالة الخدمة بنجاح"
    });
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      attendance: "الحضور والغياب",
      documents: "الوثائق",
      profile: "الملف الشخصي",
      payroll: "الرواتب"
    };
    return categories[category as keyof typeof categories] || category;
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
          <UserCheck className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">الخدمة الذاتية</h1>
            <p className="text-muted-foreground">إعداد خدمات الموظفين الذاتية</p>
          </div>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 ml-2" />
          إضافة خدمة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">إجمالي الخدمات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{services.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">الخدمات النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {services.filter(s => s.enabled).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">الخدمات المعطلة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {services.filter(s => !s.enabled).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>خدمات الموظفين الذاتية</CardTitle>
          <CardDescription>إدارة الخدمات المتاحة للموظفين</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم الخدمة</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>التفعيل</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell>{getCategoryLabel(service.category)}</TableCell>
                  <TableCell>
                    <Badge variant={service.enabled ? 'default' : 'secondary'}>
                      {service.enabled ? 'نشط' : 'معطل'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={service.enabled}
                      onCheckedChange={() => toggleService(service.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
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

export default SelfService;