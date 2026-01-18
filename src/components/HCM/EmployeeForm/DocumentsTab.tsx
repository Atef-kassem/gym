import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Upload, Eye, Download, Trash2, Plus, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface DocumentsTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

const DocumentsTab = ({ formData, setFormData }: DocumentsTabProps) => {
  const [newDocument, setNewDocument] = useState({
    type: "",
    name: "",
    number: "",
    issueDate: "",
    expiryDate: "",
    notes: ""
  });

  const documentTypes = [
    "صورة الهوية الوطنية",
    "صورة الإقامة",
    "صورة جواز السفر",
    "عقد العمل",
    "السيرة الذاتية",
    "الشهادات العلمية",
    "شهادات الخبرة",
    "شهادات التدريب",
    "التأمين الطبي",
    "رخصة القيادة",
    "شهادة التطعيم",
    "إخلاء الطرف",
    "أخرى"
  ];

  const handleDocumentsChange = (documents: any[]) => {
    setFormData({
      ...formData,
      documents: documents
    });
  };

  const addDocument = () => {
    if (newDocument.name && newDocument.type) {
      const documents = formData.documents || [];
      handleDocumentsChange([...documents, { ...newDocument, id: Date.now(), uploadDate: new Date().toISOString().split('T')[0] }]);
      setNewDocument({
        type: "",
        name: "",
        number: "",
        issueDate: "",
        expiryDate: "",
        notes: ""
      });
    }
  };

  const removeDocument = (docId: number) => {
    const documents = formData.documents || [];
    handleDocumentsChange(documents.filter((doc: any) => doc.id !== docId));
  };

  const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const threeMonthsFromNow = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000));
    return expiry <= threeMonthsFromNow && expiry >= now;
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
  };

  const getDocumentStatus = (doc: any) => {
    if (isExpired(doc.expiryDate)) {
      return { status: "منتهي", variant: "destructive" as const };
    } else if (isExpiringSoon(doc.expiryDate)) {
      return { status: "ينتهي قريباً", variant: "secondary" as const };
    } else {
      return { status: "صالح", variant: "default" as const };
    }
  };

  return (
    <div className="space-y-6">
      {/* إضافة وثيقة جديدة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            إضافة وثيقة جديدة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="docType">نوع الوثيقة *</Label>
              <select 
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                value={newDocument.type}
                onChange={(e) => setNewDocument({...newDocument, type: e.target.value})}
              >
                <option value="">اختر نوع الوثيقة</option>
                {documentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="docName">اسم الوثيقة *</Label>
              <Input
                id="docName"
                value={newDocument.name}
                onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                placeholder="مثل: شهادة البكالوريوس"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="docNumber">رقم الوثيقة</Label>
              <Input
                id="docNumber"
                value={newDocument.number}
                onChange={(e) => setNewDocument({...newDocument, number: e.target.value})}
                placeholder="رقم الوثيقة أو الرقم المرجعي"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issueDate">تاريخ الإصدار</Label>
              <Input
                id="issueDate"
                type="date"
                value={newDocument.issueDate}
                onChange={(e) => setNewDocument({...newDocument, issueDate: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">تاريخ الانتهاء</Label>
              <Input
                id="expiryDate"
                type="date"
                value={newDocument.expiryDate}
                onChange={(e) => setNewDocument({...newDocument, expiryDate: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUpload">رفع الملف</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="fileUpload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  اختر ملف
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="docNotes">ملاحظات</Label>
            <Textarea
              id="docNotes"
              value={newDocument.notes}
              onChange={(e) => setNewDocument({...newDocument, notes: e.target.value})}
              placeholder="أي ملاحظات إضافية..."
              rows={2}
            />
          </div>

          <Button onClick={addDocument} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            إضافة الوثيقة
          </Button>
        </CardContent>
      </Card>

      {/* قائمة الوثائق */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            الوثائق المرفوعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(!formData.documents || formData.documents.length === 0) ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد وثائق مرفوعة للموظف حالياً
            </div>
          ) : (
            <div className="space-y-4">
              {formData.documents.map((doc: any, index: number) => {
                const statusInfo = getDocumentStatus(doc);
                return (
                  <div key={doc.id || index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.expiryDate && (
                          <>
                            {isExpired(doc.expiryDate) && (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                            {isExpiringSoon(doc.expiryDate) && !isExpired(doc.expiryDate) && (
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            )}
                            <Badge variant={statusInfo.variant}>
                              {statusInfo.status}
                            </Badge>
                          </>
                        )}
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeDocument(doc.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">النوع:</span> {doc.type}
                      </div>
                      {doc.number && (
                        <div>
                          <span className="font-medium">الرقم:</span> {doc.number}
                        </div>
                      )}
                      {doc.issueDate && (
                        <div>
                          <span className="font-medium">تاريخ الإصدار:</span> {doc.issueDate}
                        </div>
                      )}
                      {doc.expiryDate && (
                        <div>
                          <span className="font-medium">تاريخ الانتهاء:</span> {doc.expiryDate}
                        </div>
                      )}
                    </div>
                    
                    {doc.notes && (
                      <div className="text-sm">
                        <span className="font-medium">ملاحظات:</span> {doc.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* التنبيهات والإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              التنبيهات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formData.documents?.filter((doc: any) => isExpired(doc.expiryDate)).length > 0 && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{formData.documents.filter((doc: any) => isExpired(doc.expiryDate)).length} وثيقة منتهية الصلاحية</span>
                </div>
              )}
              
              {formData.documents?.filter((doc: any) => isExpiringSoon(doc.expiryDate) && !isExpired(doc.expiryDate)).length > 0 && (
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{formData.documents.filter((doc: any) => isExpiringSoon(doc.expiryDate) && !isExpired(doc.expiryDate)).length} وثيقة تنتهي قريباً</span>
                </div>
              )}
              
              {(!formData.documents || formData.documents.length === 0) && (
                <div className="text-muted-foreground">لا توجد تنبيهات</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إحصائيات الوثائق</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">
                  {formData.documents?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">إجمالي الوثائق</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">
                  {formData.documents?.filter((doc: any) => !doc.expiryDate || (!isExpired(doc.expiryDate) && !isExpiringSoon(doc.expiryDate))).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">صالحة</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-yellow-600">
                  {formData.documents?.filter((doc: any) => isExpiringSoon(doc.expiryDate) && !isExpired(doc.expiryDate)).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">تنتهي قريباً</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-red-600">
                  {formData.documents?.filter((doc: any) => isExpired(doc.expiryDate)).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">منتهية</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentsTab;