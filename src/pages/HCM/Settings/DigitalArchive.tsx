import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Archive, Plus, Edit, Trash2, ArrowLeft, Search, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const DigitalArchive = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const [documents] = useState([
    { 
      id: "1", 
      name: "ملف أحمد محمد", 
      type: "employee_file", 
      category: "الملفات الشخصية",
      size: "2.5 MB",
      lastModified: "2024-01-15",
      status: "archived"
    },
    { 
      id: "2", 
      name: "عقود العمل 2024", 
      type: "contracts", 
      category: "العقود",
      size: "15.8 MB",
      lastModified: "2024-01-20",
      status: "active"
    },
    { 
      id: "3", 
      name: "تقارير الأداء Q1", 
      type: "reports", 
      category: "التقارير",
      size: "8.2 MB",
      lastModified: "2024-01-18",
      status: "archived"
    },
    { 
      id: "4", 
      name: "سياسات الشركة", 
      type: "policies", 
      category: "السياسات",
      size: "3.1 MB",
      lastModified: "2024-01-22",
      status: "active"
    }
  ]);

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Archive className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">الأرشيف الرقمي</h1>
            <p className="text-muted-foreground">إدارة وأرشفة الوثائق الإلكترونية</p>
          </div>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 ml-2" />
          رفع وثيقة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">إجمالي الوثائق</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{documents.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">الوثائق النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {documents.filter(d => d.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">الوثائق المؤرشفة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {documents.filter(d => d.status === 'archived').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">المساحة المستخدمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">29.6 MB</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>الأرشيف الرقمي</CardTitle>
          <CardDescription>جميع الوثائق والملفات المحفوظة</CardDescription>
          <div className="flex items-center gap-2 mt-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في الوثائق..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم الوثيقة</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>الحجم</TableHead>
                <TableHead>آخر تعديل</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">{document.name}</TableCell>
                  <TableCell>{document.category}</TableCell>
                  <TableCell>{document.size}</TableCell>
                  <TableCell>{document.lastModified}</TableCell>
                  <TableCell>
                    <Badge variant={document.status === 'active' ? 'default' : 'secondary'}>
                      {document.status === 'active' ? 'نشط' : 'مؤرشف'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
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

export default DigitalArchive;