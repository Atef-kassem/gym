import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus, Edit, Trash2, ArrowLeft, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const WorkflowAutomation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [workflows] = useState([
    { id: "1", name: "اعتماد الإجازات", type: "approval", status: "active" },
    { id: "2", name: "إجراءات التوظيف", type: "recruitment", status: "active" },
    { id: "3", name: "تقييم الأداء", type: "performance", status: "active" }
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
          <Zap className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">سير العمل الآلي</h1>
            <p className="text-muted-foreground">إدارة سياسات الاعتماد الآلي</p>
          </div>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 ml-2" />
          إضافة سير عمل
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>سير العمل الآلي</CardTitle>
          <CardDescription>جميع عمليات الأتمتة المكونة</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم سير العمل</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell className="font-medium">{workflow.name}</TableCell>
                  <TableCell>{workflow.type}</TableCell>
                  <TableCell>
                    <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                      {workflow.status === 'active' ? 'نشط' : 'غير نشط'}
                    </Badge>
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

export default WorkflowAutomation;