import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Edit, Trash2, ArrowLeft, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const DocumentTemplates = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [templates] = useState([
    { id: "1", name: "عقد العمل", type: "contract", status: "active" },
    { id: "2", name: "شهادة راتب", type: "certificate", status: "active" },
    { id: "3", name: "خطاب تعريف", type: "letter", status: "active" }
  ]);

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
            <h1 className="text-3xl font-bold">قوالب الوثائق</h1>
            <p className="text-muted-foreground">إعداد قوالب العقود والوثائق التلقائية</p>
          </div>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 ml-2" />
          إضافة قالب
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قوالب الوثائق</CardTitle>
          <CardDescription>جميع قوالب الوثائق المتاحة</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم القالب</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.type}</TableCell>
                  <TableCell>
                    <Badge variant={template.status === 'active' ? 'default' : 'secondary'}>
                      {template.status === 'active' ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3" />
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

export default DocumentTemplates;