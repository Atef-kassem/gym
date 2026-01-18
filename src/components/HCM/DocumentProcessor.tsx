import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  Scan,
  Languages,
  FileCheck,
  Download,
  Trash2,
  RefreshCw,
  Brain,
  Camera,
  FileImage,
  FileType,
  ZoomIn,
  Copy,
  Edit
} from "lucide-react";

interface ProcessedDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'processing' | 'completed' | 'error';
  progress: number;
  extractedData?: any;
  confidence?: number;
  language?: string;
  documentType?: string;
  validationResults?: any;
}

interface ExtractionResult {
  field: string;
  value: string;
  confidence: number;
  verified: boolean;
}

const DocumentProcessor = () => {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<ProcessedDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentTypes = [
    { value: 'national_id', label: 'الهوية الوطنية', icon: FileText },
    { value: 'residence_permit', label: 'الإقامة', icon: FileText },
    { value: 'passport', label: 'جواز السفر', icon: FileImage },
    { value: 'work_permit', label: 'تصريح العمل', icon: FileCheck },
    { value: 'contract', label: 'العقد الوظيفي', icon: FileType },
    { value: 'certificate', label: 'الشهادات', icon: FileText },
    { value: 'medical', label: 'الفحص الطبي', icon: FileText },
    { value: 'other', label: 'أخرى', icon: FileText }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const newDoc: ProcessedDocument = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size),
        status: 'processing',
        progress: 0
      };

      setDocuments(prev => [...prev, newDoc]);
      processDocument(newDoc, file);
    });

    toast({
      title: "بدء المعالجة",
      description: `تم رفع ${files.length} ملف وبدء المعالجة بالذكاء الاصطناعي`,
    });
  };

  const processDocument = async (doc: ProcessedDocument, file: File) => {
    setIsProcessing(true);

    try {
      // Simulate OCR and AI processing
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setDocuments(prev => prev.map(d => 
          d.id === doc.id ? { ...d, progress } : d
        ));
      }

      // Simulate extraction results based on document type
      const extractedData = generateMockExtractionData(file.name);
      const confidence = Math.floor(Math.random() * 20) + 80; // 80-100%
      const language = detectLanguage(file.name);
      const documentType = classifyDocument(file.name);
      const validationResults = validateExtractedData(extractedData);

      setDocuments(prev => prev.map(d => 
        d.id === doc.id ? { 
          ...d, 
          status: 'completed',
          extractedData,
          confidence,
          language,
          documentType,
          validationResults
        } : d
      ));

      toast({
        title: "تمت المعالجة بنجاح ✅",
        description: `تم استخراج البيانات من ${doc.name} بدقة ${confidence}%`,
      });

    } catch (error) {
      setDocuments(prev => prev.map(d => 
        d.id === doc.id ? { ...d, status: 'error' } : d
      ));
      
      toast({
        title: "خطأ في المعالجة",
        description: `فشل في معالجة ${doc.name}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateMockExtractionData = (fileName: string): ExtractionResult[] => {
    const name = fileName.toLowerCase();
    
    if (name.includes('id') || name.includes('هوية')) {
      return [
        { field: 'الاسم', value: 'أحمد محمد العتيبي', confidence: 95, verified: true },
        { field: 'رقم الهوية', value: '1234567890', confidence: 98, verified: true },
        { field: 'تاريخ الميلاد', value: '1985-03-15', confidence: 92, verified: true },
        { field: 'الجنسية', value: 'مصري', confidence: 100, verified: true },
        { field: 'تاريخ الإصدار', value: '2020-01-01', confidence: 90, verified: true },
        { field: 'تاريخ الانتهاء', value: '2030-01-01', confidence: 90, verified: true }
      ];
    } else if (name.includes('passport') || name.includes('جواز')) {
      return [
        { field: 'الاسم', value: 'AHMED MOHAMMED AL-OTAIBI', confidence: 96, verified: true },
        { field: 'رقم الجواز', value: 'A12345678', confidence: 99, verified: true },
        { field: 'الجنسية', value: 'Saudi Arabia', confidence: 100, verified: true },
        { field: 'تاريخ الإصدار', value: '2019-05-20', confidence: 94, verified: true },
        { field: 'تاريخ الانتهاء', value: '2029-05-20', confidence: 94, verified: true },
        { field: 'مكان الإصدار', value: 'Riyadh', confidence: 88, verified: true }
      ];
    } else if (name.includes('residence') || name.includes('إقامة')) {
      return [
        { field: 'الاسم', value: 'أحمد محمد العتيبي', confidence: 93, verified: true },
        { field: 'رقم الإقامة', value: '2345678901', confidence: 97, verified: true },
        { field: 'الجنسية', value: 'مصري', confidence: 100, verified: true },
        { field: 'المهنة', value: 'فني صيانة', confidence: 85, verified: false },
        { field: 'تاريخ الانتهاء', value: '2025-03-10', confidence: 91, verified: true }
      ];
    } else {
      return [
        { field: 'نوع الوثيقة', value: 'وثيقة رسمية', confidence: 85, verified: false },
        { field: 'اللغة', value: 'عربي/إنجليزي', confidence: 95, verified: true },
        { field: 'التاريخ', value: '2024-01-28', confidence: 80, verified: false }
      ];
    }
  };

  const detectLanguage = (fileName: string): string => {
    const name = fileName.toLowerCase();
    if (name.includes('arabic') || name.includes('عربي')) return 'العربية';
    if (name.includes('english') || name.includes('eng')) return 'English';
    return 'مختلط';
  };

  const classifyDocument = (fileName: string): string => {
    const name = fileName.toLowerCase();
    if (name.includes('id') || name.includes('هوية')) return 'الهوية الوطنية';
    if (name.includes('passport') || name.includes('جواز')) return 'جواز السفر';
    if (name.includes('residence') || name.includes('إقامة')) return 'الإقامة';
    if (name.includes('contract') || name.includes('عقد')) return 'العقد الوظيفي';
    if (name.includes('certificate') || name.includes('شهادة')) return 'الشهادات';
    return 'غير محدد';
  };

  const validateExtractedData = (data: ExtractionResult[]) => {
    const issues = [];
    const suggestions = [];

    data.forEach(item => {
      if (item.confidence < 90) {
        issues.push(`دقة منخفضة في حقل "${item.field}" (${item.confidence}%)`);
        suggestions.push(`يُنصح بمراجعة حقل "${item.field}" يدوياً`);
      }
    });

    return {
      isValid: issues.length === 0,
      issues,
      suggestions,
      score: Math.round(data.reduce((sum, item) => sum + item.confidence, 0) / data.length)
    };
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800"><Loader2 className="w-3 h-3 mr-1 animate-spin" />جاري المعالجة</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />مكتمل</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />خطأ</Badge>;
      default:
        return <Badge variant="secondary">غير معروف</Badge>;
    }
  };

  const getConfidenceBadge = (confidence?: number) => {
    if (!confidence) return null;
    
    if (confidence >= 90) {
      return <Badge className="bg-green-100 text-green-800">دقة عالية {confidence}%</Badge>;
    } else if (confidence >= 70) {
      return <Badge className="bg-orange-100 text-orange-800">دقة متوسطة {confidence}%</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">دقة منخفضة {confidence}%</Badge>;
    }
  };

  const handleRetryProcessing = (docId: string) => {
    setDocuments(prev => prev.map(d => 
      d.id === docId ? { ...d, status: 'processing', progress: 0 } : d
    ));
    
    // Simulate retry
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      processDocument(doc, new File([], doc.name));
    }
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    if (selectedDocument?.id === docId) {
      setSelectedDocument(null);
    }
    
    toast({
      title: "تم الحذف",
      description: "تم حذف الوثيقة",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">معالج الوثائق الذكي</CardTitle>
              <CardDescription className="text-lg">
                استخراج البيانات تلقائياً من الوثائق باستخدام الذكاء الاصطناعي
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Upload Area */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            رفع الوثائق
          </CardTitle>
          <CardDescription>
            اسحب الملفات هنا أو انقر لاختيار الوثائق (PDF, JPG, PNG, DOCX)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-purple-50 rounded-full">
                <Upload className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-900 mb-2">رفع الوثائق للمعالجة</p>
                <p className="text-slate-600">
                  يدعم النظام: الهوية الوطنية، جواز السفر، الإقامة، العقود، الشهادات
                </p>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Camera className="w-4 h-4 mr-2" />
                اختيار الملفات
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      {documents.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Documents List */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                الوثائق المرفوعة ({documents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <Card 
                    key={doc.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedDocument?.id === doc.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-50 rounded-lg">
                            <FileText className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{doc.name}</p>
                            <p className="text-xs text-slate-500">{doc.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(doc.status)}
                          {doc.confidence && getConfidenceBadge(doc.confidence)}
                        </div>
                      </div>

                      {doc.status === 'processing' && (
                        <div className="space-y-2">
                          <Progress value={doc.progress} className="h-2" />
                          <p className="text-xs text-slate-500">جاري المعالجة... {doc.progress}%</p>
                        </div>
                      )}

                      {doc.status === 'completed' && doc.documentType && (
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {doc.documentType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {doc.language}
                          </Badge>
                        </div>
                      )}

                      {doc.status === 'error' && (
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRetryProcessing(doc.id);
                            }}
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            إعادة المحاولة
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDocument(doc.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            حذف
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Document Details */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                تفاصيل الوثيقة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDocument ? (
                <div className="space-y-6">
                  {/* Document Info */}
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-medium mb-2">{selectedDocument.name}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>النوع: {selectedDocument.documentType || 'غير محدد'}</div>
                      <div>اللغة: {selectedDocument.language || 'غير محدد'}</div>
                      <div>الحجم: {selectedDocument.size}</div>
                      <div>الدقة: {selectedDocument.confidence}%</div>
                    </div>
                  </div>

                  {/* Extracted Data */}
                  {selectedDocument.extractedData && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Scan className="w-4 h-4" />
                        البيانات المستخرجة
                      </h4>
                      <div className="space-y-3">
                        {selectedDocument.extractedData.map((item: ExtractionResult, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{item.field}</div>
                              <div className="text-slate-600 text-sm">{item.value}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                className={
                                  item.confidence >= 90 
                                    ? "bg-green-100 text-green-800" 
                                    : item.confidence >= 70 
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {item.confidence}%
                              </Badge>
                              {item.verified ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-orange-600" />
                              )}
                              <Button size="sm" variant="ghost">
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Validation Results */}
                  {selectedDocument.validationResults && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <FileCheck className="w-4 h-4" />
                        نتائج التحقق
                      </h4>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="text-lg font-bold">{selectedDocument.validationResults.score}%</div>
                          <div className="text-sm text-slate-600">درجة الدقة الإجمالية</div>
                        </div>
                        
                        {selectedDocument.validationResults.issues.length > 0 && (
                          <div className="space-y-2">
                            <p className="font-medium text-red-600">مشاكل محتملة:</p>
                            {selectedDocument.validationResults.issues.map((issue: string, index: number) => (
                              <p key={index} className="text-sm text-red-600">• {issue}</p>
                            ))}
                          </div>
                        )}
                        
                        {selectedDocument.validationResults.suggestions.length > 0 && (
                          <div className="space-y-2 mt-4">
                            <p className="font-medium text-orange-600">اقتراحات:</p>
                            {selectedDocument.validationResults.suggestions.map((suggestion: string, index: number) => (
                              <p key={index} className="text-sm text-orange-600">• {suggestion}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      تصدير البيانات
                    </Button>
                    <Button className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      حفظ في الملف
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>اختر وثيقة لعرض التفاصيل</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Statistics */}
      {documents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{documents.length}</div>
                  <div className="text-sm text-slate-600">إجمالي الوثائق</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {documents.filter(d => d.status === 'completed').length}
                  </div>
                  <div className="text-sm text-slate-600">مكتمل</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Loader2 className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {documents.filter(d => d.status === 'processing').length}
                  </div>
                  <div className="text-sm text-slate-600">قيد المعالجة</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Brain className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {documents.length > 0 
                      ? Math.round(documents.reduce((sum, d) => sum + (d.confidence || 0), 0) / documents.length)
                      : 0}%
                  </div>
                  <div className="text-sm text-slate-600">متوسط الدقة</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DocumentProcessor;