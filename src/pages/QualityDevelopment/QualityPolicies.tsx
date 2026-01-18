import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  FileCheck, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  FileText,
  Calendar,
  Building,
  User
} from "lucide-react";

// Mock data for policies
const policiesData = [
  {
    id: 1,
    number: "POL-001",
    title: "سياسة إدارة الوثائق الإلكترونية",
    department: "تقنية المعلومات",
    issueDate: "2024-01-15",
    reviewDate: "2024-07-15",
    status: "active",
    version: "2.1",
    summary: "تحديد إجراءات إدارة وحفظ الوثائق الإلكترونية",
    attachments: 3,
    lastModified: "2024-01-20"
  },
  {
    id: 2,
    number: "POL-002",
    title: "سياسة خدمة العملاء",
    department: "خدمة العملاء",
    issueDate: "2024-02-01",
    reviewDate: "2024-08-01",
    status: "under_review",
    version: "1.5",
    summary: "معايير وإجراءات التعامل مع العملاء",
    attachments: 2,
    lastModified: "2024-02-10"
  },
  {
    id: 3,
    number: "POL-003",
    title: "سياسة الأمن والسلامة",
    department: "الأمن والسلامة",
    issueDate: "2024-01-10",
    reviewDate: "2024-07-10",
    status: "approved",
    version: "3.0",
    summary: "إجراءات الأمن والسلامة في مكان العمل",
    attachments: 5,
    lastModified: "2024-01-25"
  },
  {
    id: 4,
    number: "POL-004",
    title: "سياسة إدارة الموارد البشرية",
    department: "الموارد البشرية",
    issueDate: "2024-03-01",
    reviewDate: "2024-09-01",
    status: "draft",
    version: "1.0",
    summary: "سياسات التوظيف والتطوير والأداء",
    attachments: 1,
    lastModified: "2024-03-05"
  }
];

const departments = [
  "جميع الإدارات",
  "تقنية المعلومات",
  "خدمة العملاء",
  "الأمن والسلامة",
  "الموارد البشرية",
  "المالية",
  "التشغيل",
  "الجودة"
];

export default function QualityPolicies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("جميع الإدارات");
  const [selectedStatus, setSelectedStatus] = useState("الكل");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 border-green-200">نشطة</Badge>;
      case "under_review":
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">قيد المراجعة</Badge>;
      case "approved":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">معتمدة</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">مسودة</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "under_review":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "draft":
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredPolicies = policiesData.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "جميع الإدارات" || policy.department === selectedDepartment;
    const matchesStatus = selectedStatus === "الكل" || policy.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleViewPolicy = (policy: any) => {
    setSelectedPolicy(policy);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">إدارة سياسات الجودة والإجراءات</h1>
          <p className="text-muted-foreground">
            توثيق ومتابعة السياسات والإجراءات المؤسسية
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            تصدير
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                سياسة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إنشاء سياسة جديدة</DialogTitle>
                <DialogDescription>
                  إضافة سياسة أو إجراء جديد للمؤسسة
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policy-number">رقم السياسة</Label>
                    <Input id="policy-number" placeholder="POL-005" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="policy-title">عنوان السياسة</Label>
                    <Input id="policy-title" placeholder="اسم السياسة..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">الإدارة المعنية</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الإدارة" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.slice(1).map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issue-date">تاريخ الإصدار</Label>
                    <Input id="issue-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="review-date">تاريخ المراجعة الدورية</Label>
                    <Input id="review-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="version">الإصدار</Label>
                    <Input id="version" placeholder="1.0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary">ملخص السياسة</Label>
                  <Textarea id="summary" placeholder="وصف مختصر للسياسة..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">محتوى السياسة</Label>
                  <Textarea id="content" placeholder="المحتوى التفصيلي للسياسة..." rows={8} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attachments">المستندات المرفقة</Label>
                  <Input id="attachments" type="file" multiple />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>
                    حفظ السياسة
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في السياسات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="الإدارة" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الكل">الكل</SelectItem>
                <SelectItem value="active">نشطة</SelectItem>
                <SelectItem value="under_review">قيد المراجعة</SelectItem>
                <SelectItem value="approved">معتمدة</SelectItem>
                <SelectItem value="draft">مسودة</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              تصفية متقدمة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Policies List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredPolicies.map((policy) => (
          <Card key={policy.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{policy.number}</Badge>
                    {getStatusBadge(policy.status)}
                    <span className="text-sm text-muted-foreground">الإصدار {policy.version}</span>
                  </div>
                  <CardTitle className="text-xl">{policy.title}</CardTitle>
                  <CardDescription>{policy.summary}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewPolicy(policy)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">الإدارة:</span>
                  <span>{policy.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">تاريخ الإصدار:</span>
                  <span>{policy.issueDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">المراجعة:</span>
                  <span>{policy.reviewDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">المرفقات:</span>
                  <span>{policy.attachments}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Policy Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل السياسة</DialogTitle>
            <DialogDescription>
              عرض تفاصيل السياسة المحددة
            </DialogDescription>
          </DialogHeader>
          {selectedPolicy && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">رقم السياسة</Label>
                  <p className="text-sm text-muted-foreground">{selectedPolicy.number}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">العنوان</Label>
                  <p className="text-sm text-muted-foreground">{selectedPolicy.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">الإدارة المعنية</Label>
                  <p className="text-sm text-muted-foreground">{selectedPolicy.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">الحالة</Label>
                  <div className="mt-1">{getStatusBadge(selectedPolicy.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">تاريخ الإصدار</Label>
                  <p className="text-sm text-muted-foreground">{selectedPolicy.issueDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">تاريخ المراجعة</Label>
                  <p className="text-sm text-muted-foreground">{selectedPolicy.reviewDate}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">الملخص</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedPolicy.summary}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">المحتوى التفصيلي</Label>
                <div className="mt-2 p-4 bg-muted rounded-lg text-sm">
                  هذا نص تجريبي لمحتوى السياسة. يمكن إضافة المحتوى الفعلي للسياسة هنا...
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  إغلاق
                </Button>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  تعديل
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}