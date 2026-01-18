import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  FileText, Search, Filter, Calendar, Users, Folder, Upload,
  Plus, Edit, Trash2, Download, Eye, AlertCircle, CheckCircle
} from "lucide-react";
import { useGetAllEmployeesQuery } from "@/services/employeesApi";
import { format } from "date-fns";

const Documents = () => {
  const [activeTab, setActiveTab] = useState("documents");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { data: employeesResponse } = useGetAllEmployeesQuery({});
  const employees = Array.isArray(employeesResponse?.data) ? employeesResponse.data : [];

  // استخدام localStorage
  const [documents, setDocuments] = useState<any[]>(() => {
    const stored = localStorage.getItem('hr_documents');
    return stored ? JSON.parse(stored) : [];
  });

  const [documentTypes, setDocumentTypes] = useState<any[]>(() => {
    const stored = localStorage.getItem('hr_document_types');
    return stored ? JSON.parse(stored) : [
      { id: 1, name: "هوية وطنية", required: true },
      { id: 2, name: "شهادة تعليم", required: true },
      { id: 3, name: "عقد عمل", required: true },
      { id: 4, name: "صورة شخصية", required: true },
      { id: 5, name: "شهادة صحية", required: false },
      { id: 6, name: "شهادة خبرة", required: false }
    ];
  });

  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  const [documentFormData, setDocumentFormData] = useState({
    employeeId: "",
    documentType: "",
    title: "",
    description: "",
    uploadDate: "",
    expiryDate: "",
    fileUrl: "",
    status: "نشط"
  });

  const saveToStorage = (key: string, data: any[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc: any) => {
      const employee = employees.find((e: any) => e.id === parseInt(doc.employeeId));
      return !searchQuery ||
        employee?.arabicName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.documentType?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [documents, employees, searchQuery]);

  const handleAddDocument = () => {
    setDocumentFormData({
      employeeId: "",
      documentType: "",
      title: "",
      description: "",
      uploadDate: new Date().toISOString().split('T')[0],
      expiryDate: "",
      fileUrl: "",
      status: "نشط"
    });
    setSelectedDocument(null);
    setIsDocumentDialogOpen(true);
  };

  const handleSaveDocument = () => {
    if (!documentFormData.employeeId || !documentFormData.documentType || !documentFormData.title) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (selectedDocument) {
      const updated = documents.map((d: any) =>
        d.id === selectedDocument.id ? { ...d, ...documentFormData, updatedAt: new Date().toISOString() } : d
      );
      setDocuments(updated);
      saveToStorage('hr_documents', updated);
      toast({ title: "نجح", description: "تم تحديث الوثيقة بنجاح" });
    } else {
      const newDocument = {
        id: Date.now(),
        ...documentFormData,
        createdAt: new Date().toISOString()
      };
      const updated = [...documents, newDocument];
      setDocuments(updated);
      saveToStorage('hr_documents', updated);
      toast({ title: "نجح", description: "تم إضافة الوثيقة بنجاح" });
    }
    setIsDocumentDialogOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // في التطبيق الحقيقي، سيتم رفع الملف إلى السيرفر
      const fileUrl = URL.createObjectURL(file);
      setDocumentFormData({...documentFormData, fileUrl: fileUrl});
      toast({ title: "نجح", description: "تم رفع الملف بنجاح" });
    }
  };

  const stats = useMemo(() => {
    const expiringSoon = documents.filter((d: any) => {
      if (!d.expiryDate || d.status !== "نشط") return false;
      const expiry = new Date(d.expiryDate);
      const daysUntilExpiry = Math.ceil((expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    }).length;

    const missingRequired = employees.filter((emp: any) => {
      const empDocs = documents.filter((d: any) => d.employeeId === emp.id.toString());
      const requiredTypes = documentTypes.filter((dt: any) => dt.required);
      return requiredTypes.some((rt: any) => 
        !empDocs.some((ed: any) => ed.documentType === rt.name && ed.status === "نشط")
      );
    }).length;

    return {
      totalDocuments: documents.length,
      activeDocuments: documents.filter((d: any) => d.status === "نشط").length,
      expiringSoon,
      missingRequired
    };
  }, [documents, employees, documentTypes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Folder className="w-8 h-8 text-teal-600" />
              إدارة الوثائق
            </h1>
            <p className="text-gray-600 mt-1">إدارة وثائق الموظفين والأرشيف</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </Button>
            <Button onClick={handleAddDocument} className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 ml-2" />
              إضافة وثيقة
            </Button>
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-teal-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي الوثائق</span>
                <FileText className="w-5 h-5 text-teal-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal-600">{stats.totalDocuments}</div>
              <p className="text-sm text-gray-500 mt-1">{stats.activeDocuments} نشطة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الوثائق النشطة</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.activeDocuments}</div>
              <p className="text-sm text-gray-500 mt-1">وثيقة نشطة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>تنتهي قريباً</span>
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stats.expiringSoon}</div>
              <p className="text-sm text-gray-500 mt-1">وثيقة خلال 30 يوم</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>وثائق ناقصة</span>
                <AlertCircle className="w-5 h-5 text-red-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.missingRequired}</div>
              <p className="text-sm text-gray-500 mt-1">موظف يحتاج وثائق</p>
            </CardContent>
          </Card>
        </div>

        {/* التبويبات */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="documents">الوثائق</TabsTrigger>
            <TabsTrigger value="types">أنواع الوثائق</TabsTrigger>
          </TabsList>

          {/* تبويب الوثائق */}
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>وثائق الموظفين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-4 font-semibold">الموظف</th>
                        <th className="text-right py-3 px-4 font-semibold">نوع الوثيقة</th>
                        <th className="text-right py-3 px-4 font-semibold">العنوان</th>
                        <th className="text-right py-3 px-4 font-semibold">تاريخ الرفع</th>
                        <th className="text-right py-3 px-4 font-semibold">تاريخ الانتهاء</th>
                        <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                        <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map((doc: any) => {
                        const employee = employees.find((e: any) => e.id === parseInt(doc.employeeId));
                        const isExpiringSoon = doc.expiryDate && doc.status === "نشط" &&
                          new Date(doc.expiryDate) <= new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
                        const isExpired = doc.expiryDate && new Date(doc.expiryDate) < new Date();
                        return (
                          <tr key={doc.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-semibold">{employee?.arabicName || employee?.name || "-"}</td>
                            <td className="py-3 px-4">{doc.documentType}</td>
                            <td className="py-3 px-4">{doc.title}</td>
                            <td className="py-3 px-4">{doc.uploadDate}</td>
                            <td className="py-3 px-4">{doc.expiryDate || "لا ينتهي"}</td>
                            <td className="py-3 px-4">
                              <Badge className={
                                isExpired ? "bg-red-500" :
                                isExpiringSoon ? "bg-amber-500" :
                                doc.status === "نشط" ? "bg-green-500" : "bg-gray-500"
                              }>
                                {isExpired ? "منتهية" : isExpiringSoon ? "تنتهي قريباً" : doc.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2 justify-end">
                                {doc.fileUrl && (
                                  <Button variant="ghost" size="sm" onClick={() => window.open(doc.fileUrl, '_blank')}>
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm" onClick={() => {
                                  setSelectedDocument(doc);
                                  setDocumentFormData(doc);
                                  setIsDocumentDialogOpen(true);
                                }}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => {
                                  const updated = documents.filter((d: any) => d.id !== doc.id);
                                  setDocuments(updated);
                                  saveToStorage('hr_documents', updated);
                                  toast({ title: "نجح", description: "تم حذف الوثيقة" });
                                }}>
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredDocuments.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Folder className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">لا توجد وثائق</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب أنواع الوثائق */}
          <TabsContent value="types" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>أنواع الوثائق</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documentTypes.map((type: any) => (
                    <Card key={type.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-teal-500" />
                            <div>
                              <h3 className="font-semibold">{type.name}</h3>
                              {type.required && (
                                <Badge className="bg-red-500 text-xs mt-1">مطلوب</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog إضافة/تعديل وثيقة */}
        <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedDocument ? "تعديل الوثيقة" : "إضافة وثيقة جديدة"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الموظف *</Label>
                  <Select value={documentFormData.employeeId} onValueChange={(value) => setDocumentFormData({...documentFormData, employeeId: value})}>
                    <SelectTrigger><SelectValue placeholder="اختر الموظف" /></SelectTrigger>
                    <SelectContent>
                      {employees.map((e: any) => (
                        <SelectItem key={e.id} value={e.id.toString()}>{e.arabicName || e.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>نوع الوثيقة *</Label>
                  <Select value={documentFormData.documentType} onValueChange={(value) => setDocumentFormData({...documentFormData, documentType: value})}>
                    <SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type: any) => (
                        <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>العنوان *</Label>
                <Input value={documentFormData.title} onChange={(e) => setDocumentFormData({...documentFormData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Input value={documentFormData.description} onChange={(e) => setDocumentFormData({...documentFormData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>تاريخ الرفع</Label>
                  <Input type="date" value={documentFormData.uploadDate} onChange={(e) => setDocumentFormData({...documentFormData, uploadDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>تاريخ الانتهاء</Label>
                  <Input type="date" value={documentFormData.expiryDate} onChange={(e) => setDocumentFormData({...documentFormData, expiryDate: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>رفع الملف</Label>
                <Input type="file" onChange={handleFileUpload} />
                {documentFormData.fileUrl && (
                  <p className="text-sm text-green-600">تم رفع الملف بنجاح</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDocumentDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveDocument} className="bg-teal-600 hover:bg-teal-700">حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Documents;

