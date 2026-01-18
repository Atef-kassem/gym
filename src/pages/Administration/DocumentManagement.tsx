import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Archive, 
  FileText, 
  Search, 
  Upload, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Filter,
  Calendar,
  Clock,
  User,
  Tag,
  BarChart3,
  Brain,
  Zap,
  CheckCircle,
  AlertTriangle,
  Star,
  FolderTree,
  Settings,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  size: string;
  uploadDate: string;
  lastModified: string;
  status: "active" | "archived" | "pending";
  tags: string[];
  confidence?: number;
  aiCategory?: string;
}

const DocumentManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const documents: Document[] = [
    {
      id: "1",
      name: "عقد توظيف - أحمد محمد.pdf",
      type: "PDF",
      category: "عقود العمل",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      lastModified: "2024-01-15",
      status: "active",
      tags: ["عقد", "توظيف", "موارد بشرية"],
      confidence: 95,
      aiCategory: "HR Documents"
    },
    {
      id: "2",
      name: "تقرير الحضور والانصراف - ديسمبر 2023.xlsx",
      type: "Excel",
      category: "تقارير الحضور",
      size: "1.8 MB",
      uploadDate: "2024-01-10",
      lastModified: "2024-01-12",
      status: "active",
      tags: ["حضور", "تقرير", "موظفين"],
      confidence: 92,
      aiCategory: "Attendance Reports"
    },
    {
      id: "3",
      name: "سياسة الأمن والسلامة.docx",
      type: "Word",
      category: "السياسات",
      size: "856 KB",
      uploadDate: "2024-01-08",
      lastModified: "2024-01-09",
      status: "archived",
      tags: ["سياسة", "أمن", "سلامة"],
      confidence: 98,
      aiCategory: "Policy Documents"
    }
  ];

  const categories = [
    { value: "all", label: "جميع الفئات", count: documents.length },
    { value: "contracts", label: "عقود العمل", count: 45 },
    { value: "reports", label: "التقارير", count: 23 },
    { value: "policies", label: "السياسات", count: 12 },
    { value: "financial", label: "المالية", count: 34 },
    { value: "legal", label: "القانونية", count: 18 }
  ];

  const stats = [
    {
      title: "إجمالي الوثائق",
      value: "15,847",
      change: "+234",
      icon: FileText,
      color: "text-blue-500"
    },
    {
      title: "المؤرشفة",
      value: "12,456",
      change: "+123",
      icon: Archive,
      color: "text-green-500"
    },
    {
      title: "قيد المعالجة",
      value: "89",
      change: "-12",
      icon: Clock,
      color: "text-orange-500"
    },
    {
      title: "مصنفة بالذكاء الاصطناعي",
      value: "14,892",
      change: "+456",
      icon: Brain,
      color: "text-purple-500"
    }
  ];

  const aiInsights = [
    {
      title: "تصنيف تلقائي عالي الدقة",
      description: "تم تصنيف 98.5% من الوثائق بدقة عالية",
      status: "success",
      recommendation: "مراجعة الوثائق المصنفة بدقة أقل من 90%"
    },
    {
      title: "اكتشاف وثائق مكررة",
      description: "تم اكتشاف 15 وثيقة مكررة",
      status: "warning",
      recommendation: "مراجعة وحذف الوثائق المكررة"
    },
    {
      title: "تحديث الفهرسة المطلوب",
      description: "234 وثيقة تحتاج إعادة فهرسة",
      status: "info",
      recommendation: "تشغيل عملية إعادة الفهرسة التلقائية"
    }
  ];

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAction = (action: string, docId: string) => {
    toast({
      title: "تم تنفيذ العملية",
      description: `تم ${action} الوثيقة بنجاح`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
            <Archive className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">إدارة الأرشفة والوثائق</h1>
            <p className="text-muted-foreground">نظام شامل لإدارة الوثائق والأرشفة الرقمية مدعوم بالذكاء الاصطناعي</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-1">{stat.change} هذا الشهر</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                      <IconComponent className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Insights Panel */}
        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Brain className="h-5 w-5" />
              تحليلات الذكاء الاصطناعي
            </CardTitle>
            <CardDescription>
              رؤى ذكية حول حالة الأرشفة والوثائق
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border shadow-sm">
                  <div className="flex items-start gap-3">
                    {insight.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                    {insight.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />}
                    {insight.status === 'info' && <Zap className="h-5 w-5 text-blue-500 mt-0.5" />}
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {insight.recommendation}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documents">إدارة الوثائق</TabsTrigger>
            <TabsTrigger value="categories">التصنيفات</TabsTrigger>
            <TabsTrigger value="search">البحث المتقدم</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-6">
            {/* Controls */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>إدارة الوثائق</CardTitle>
                  <div className="flex gap-2">
                    <Button className="gap-2">
                      <Upload className="h-4 w-4" />
                      رفع وثيقة
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" />
                      إنشاء مجلد
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="البحث في الوثائق..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 ml-2" />
                      تصفية
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 ml-2" />
                      تصدير
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.value}
                      variant={selectedCategory === category.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.value)}
                      className="gap-2"
                    >
                      {category.label}
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Documents Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  قائمة الوثائق ({filteredDocuments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم الوثيقة</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>الفئة</TableHead>
                      <TableHead>الحجم</TableHead>
                      <TableHead>دقة التصنيف</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>تاريخ الرفع</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            {doc.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.type}</Badge>
                        </TableCell>
                        <TableCell>{doc.category}</TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={doc.confidence} className="w-16 h-2" />
                            <span className="text-sm text-muted-foreground">{doc.confidence}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            doc.status === "active" ? "default" :
                            doc.status === "archived" ? "secondary" : "outline"
                          }>
                            {doc.status === "active" ? "نشط" :
                             doc.status === "archived" ? "مؤرشف" : "قيد المعالجة"}
                          </Badge>
                        </TableCell>
                        <TableCell>{doc.uploadDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => handleAction("عرض", doc.id)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleAction("تحميل", doc.id)}>
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleAction("تعديل", doc.id)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleAction("حذف", doc.id)}>
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
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>إدارة التصنيفات</CardTitle>
                <CardDescription>
                  إدارة تصنيفات الوثائق والمجلدات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FolderTree className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">سيتم تطوير هذا القسم قريباً</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>البحث المتقدم</CardTitle>
                <CardDescription>
                  البحث المتقدم في الوثائق باستخدام تقنيات الذكاء الاصطناعي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">البحث المتقدم قيد التطوير</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>تحليلات الوثائق</CardTitle>
                <CardDescription>
                  إحصائيات وتحليلات شاملة للوثائق والأرشفة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لوحة التحليلات قيد التطوير</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DocumentManagement;