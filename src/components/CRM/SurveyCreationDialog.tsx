import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Settings,
  MessageSquare,
  Star,
  CheckSquare,
  Radio,
  Type,
  Hash,
  FileText,
  Smartphone,
  Mail,
  Globe,
  Share2
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Question {
  id: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'rating' | 'number' | 'date';
  title: string;
  description?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

interface SurveyData {
  title: string;
  description: string;
  category: string;
  type: 'satisfaction' | 'nps' | 'feedback' | 'market_research' | 'employee';
  startDate?: Date;
  endDate?: Date;
  targetCount: number;
  questions: Question[];
  distribution: {
    whatsapp: boolean;
    sms: boolean;
    email: boolean;
    website: boolean;
    app: boolean;
  };
  settings: {
    allowAnonymous: boolean;
    requireLogin: boolean;
    limitPerUser: number;
    showProgress: boolean;
    randomizeQuestions: boolean;
    autoReminders: boolean;
  };
}

interface SurveyCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSurveyCreated: (survey: any) => void;
}

export default function SurveyCreationDialog({ open, onOpenChange, onSurveyCreated }: SurveyCreationDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    title: '',
    description: '',
    category: '',
    type: 'satisfaction',
    targetCount: 100,
    questions: [],
    distribution: {
      whatsapp: true,
      sms: false,
      email: false,
      website: true,
      app: false
    },
    settings: {
      allowAnonymous: true,
      requireLogin: false,
      limitPerUser: 1,
      showProgress: true,
      randomizeQuestions: false,
      autoReminders: false
    }
  });

  const totalSteps = 5;

  const questionTypes = [
    { value: 'text', label: 'نص قصير', icon: Type },
    { value: 'textarea', label: 'نص طويل', icon: FileText },
    { value: 'radio', label: 'اختيار واحد', icon: Radio },
    { value: 'checkbox', label: 'اختيار متعدد', icon: CheckSquare },
    { value: 'rating', label: 'تقييم بالنجوم', icon: Star },
    { value: 'number', label: 'رقم', icon: Hash },
    { value: 'date', label: 'تاريخ', icon: CalendarIcon }
  ];

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type: 'text',
      title: '',
      required: true,
      options: []
    };
    setSurveyData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setSurveyData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  };

  const removeQuestion = (questionId: string) => {
    setSurveyData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const addOption = (questionId: string) => {
    updateQuestion(questionId, {
      options: [...(surveyData.questions.find(q => q.id === questionId)?.options || []), '']
    });
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = surveyData.questions.find(q => q.id === questionId);
    if (question) {
      const newOptions = [...(question.options || [])];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = surveyData.questions.find(q => q.id === questionId);
    if (question) {
      const newOptions = (question.options || []).filter((_, index) => index !== optionIndex);
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const newSurvey = {
      id: `survey_${Date.now()}`,
      ...surveyData,
      status: 'draft' as const,
      createdDate: new Date().toISOString().split('T')[0],
      responseCount: 0,
      analytics: {
        avgRating: 0,
        npsScore: 0,
        completionRate: 0,
        sentiment: {
          positive: 0,
          negative: 0,
          neutral: 0
        }
      }
    };

    onSurveyCreated(newSurvey);
    onOpenChange(false);
    toast.success('تم إنشاء الاستبيان بنجاح');
    
    // Reset form
    setSurveyData({
      title: '',
      description: '',
      category: '',
      type: 'satisfaction',
      targetCount: 100,
      questions: [],
      distribution: {
        whatsapp: true,
        sms: false,
        email: false,
        website: true,
        app: false
      },
      settings: {
        allowAnonymous: true,
        requireLogin: false,
        limitPerUser: 1,
        showProgress: true,
        randomizeQuestions: false,
        autoReminders: false
      }
    });
    setCurrentStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">إنشاء استبيان جديد</DialogTitle>
          <DialogDescription>
            قم بإنشاء استبيان مخصص لجمع آراء وتقييمات العملاء
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">الخطوة {currentStep} من {totalSteps}</span>
            <span className="text-sm font-medium text-primary">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    المعلومات الأساسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">عنوان الاستبيان *</Label>
                    <Input
                      id="title"
                      value={surveyData.title}
                      onChange={(e) => setSurveyData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="مثال: استبيان رضا العملاء - يناير 2024"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">وصف الاستبيان</Label>
                    <Textarea
                      id="description"
                      value={surveyData.description}
                      onChange={(e) => setSurveyData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="وصف مختصر عن الهدف من الاستبيان"
                      dir="rtl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>نوع الاستبيان</Label>
                      <Select value={surveyData.type} onValueChange={(value: any) => setSurveyData(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="satisfaction">رضا العملاء</SelectItem>
                          <SelectItem value="nps">صافي نقاط الترويج (NPS)</SelectItem>
                          <SelectItem value="feedback">تقييم وملاحظات</SelectItem>
                          <SelectItem value="market_research">بحث السوق</SelectItem>
                          <SelectItem value="employee">تقييم الموظفين</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="category">الفئة</Label>
                      <Input
                        id="category"
                        value={surveyData.category}
                        onChange={(e) => setSurveyData(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="مثال: جودة الخدمة"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="targetCount">العدد المستهدف للردود</Label>
                    <Input
                      id="targetCount"
                      type="number"
                      value={surveyData.targetCount}
                      onChange={(e) => setSurveyData(prev => ({ ...prev, targetCount: parseInt(e.target.value) || 0 }))}
                      min="1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Scheduling */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    جدولة الاستبيان
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>تاريخ البداية</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-right">
                            <CalendarIcon className="w-4 h-4 ml-2" />
                            {surveyData.startDate ? format(surveyData.startDate, "PPP", { locale: ar }) : "اختر التاريخ"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={surveyData.startDate}
                            onSelect={(date) => setSurveyData(prev => ({ ...prev, startDate: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>تاريخ الانتهاء</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-right">
                            <CalendarIcon className="w-4 h-4 ml-2" />
                            {surveyData.endDate ? format(surveyData.endDate, "PPP", { locale: ar }) : "اختر التاريخ"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={surveyData.endDate}
                            onSelect={(date) => setSurveyData(prev => ({ ...prev, endDate: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">إعدادات إضافية</h4>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="allowAnonymous">السماح بالردود المجهولة</Label>
                      <Switch
                        id="allowAnonymous"
                        checked={surveyData.settings.allowAnonymous}
                        onCheckedChange={(checked) => setSurveyData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, allowAnonymous: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="requireLogin">يتطلب تسجيل الدخول</Label>
                      <Switch
                        id="requireLogin"
                        checked={surveyData.settings.requireLogin}
                        onCheckedChange={(checked) => setSurveyData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, requireLogin: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="showProgress">إظهار شريط التقدم</Label>
                      <Switch
                        id="showProgress"
                        checked={surveyData.settings.showProgress}
                        onCheckedChange={(checked) => setSurveyData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, showProgress: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoReminders">تذكيرات تلقائية</Label>
                      <Switch
                        id="autoReminders"
                        checked={surveyData.settings.autoReminders}
                        onCheckedChange={(checked) => setSurveyData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, autoReminders: checked }
                        }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="limitPerUser">الحد الأقصى للردود لكل مستخدم</Label>
                      <Input
                        id="limitPerUser"
                        type="number"
                        value={surveyData.settings.limitPerUser}
                        onChange={(e) => setSurveyData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, limitPerUser: parseInt(e.target.value) || 1 }
                        }))}
                        min="1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Questions */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    الأسئلة ({surveyData.questions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {surveyData.questions.map((question, index) => (
                    <Card key={question.id} className="border border-gray-200">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-500">السؤال {index + 1}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(question.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>نوع السؤال</Label>
                            <Select value={question.type} onValueChange={(value: any) => updateQuestion(question.id, { type: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {questionTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    <div className="flex items-center gap-2">
                                      <type.icon className="w-4 h-4" />
                                      {type.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center gap-2">
                            <Switch
                              checked={question.required}
                              onCheckedChange={(checked) => updateQuestion(question.id, { required: checked })}
                            />
                            <Label>سؤال مطلوب</Label>
                          </div>
                        </div>

                        <div>
                          <Label>نص السؤال</Label>
                          <Input
                            value={question.title}
                            onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
                            placeholder="اكتب السؤال هنا..."
                            dir="rtl"
                          />
                        </div>

                        <div>
                          <Label>وصف إضافي (اختياري)</Label>
                          <Input
                            value={question.description || ''}
                            onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
                            placeholder="تعليمات أو توضيحات للسؤال"
                            dir="rtl"
                          />
                        </div>

                        {/* Options for radio/checkbox questions */}
                        {(question.type === 'radio' || question.type === 'checkbox') && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>الخيارات</Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addOption(question.id)}
                              >
                                <Plus className="w-4 h-4 ml-1" />
                                إضافة خيار
                              </Button>
                            </div>
                            {(question.options || []).map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-2">
                                <Input
                                  value={option}
                                  onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                  placeholder={`الخيار ${optionIndex + 1}`}
                                  dir="rtl"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeOption(question.id, optionIndex)}
                                  className="text-red-500"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    variant="outline"
                    onClick={addQuestion}
                    className="w-full border-2 border-dashed border-gray-300 hover:border-primary"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة سؤال جديد
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Distribution */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    طرق التوزيع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-green-500" />
                        <div>
                          <Label>واتساب</Label>
                          <p className="text-sm text-gray-500">إرسال عبر واتساب</p>
                        </div>
                      </div>
                      <Switch
                        checked={surveyData.distribution.whatsapp}
                        onCheckedChange={(checked) => setSurveyData(prev => ({
                          ...prev,
                          distribution: { ...prev.distribution, whatsapp: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-blue-500" />
                        <div>
                          <Label>رسائل نصية</Label>
                          <p className="text-sm text-gray-500">إرسال عبر SMS</p>
                        </div>
                      </div>
                      <Switch
                        checked={surveyData.distribution.sms}
                        onCheckedChange={(checked) => setSurveyData(prev => ({
                          ...prev,
                          distribution: { ...prev.distribution, sms: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-red-500" />
                        <div>
                          <Label>البريد الإلكتروني</Label>
                          <p className="text-sm text-gray-500">إرسال عبر الإيميل</p>
                        </div>
                      </div>
                      <Switch
                        checked={surveyData.distribution.email}
                        onCheckedChange={(checked) => setSurveyData(prev => ({
                          ...prev,
                          distribution: { ...prev.distribution, email: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-purple-500" />
                        <div>
                          <Label>الموقع الإلكتروني</Label>
                          <p className="text-sm text-gray-500">نشر على الموقع</p>
                        </div>
                      </div>
                      <Switch
                        checked={surveyData.distribution.website}
                        onCheckedChange={(checked) => setSurveyData(prev => ({
                          ...prev,
                          distribution: { ...prev.distribution, website: checked }
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>مراجعة الاستبيان</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">العنوان</Label>
                      <p className="font-medium">{surveyData.title}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">النوع</Label>
                      <Badge variant="outline">{surveyData.type}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">عدد الأسئلة</Label>
                      <p className="font-medium">{surveyData.questions.length} سؤال</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">الهدف</Label>
                      <p className="font-medium">{surveyData.targetCount} رد</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm text-gray-500">طرق التوزيع المختارة</Label>
                    <div className="flex gap-2 mt-1">
                      {surveyData.distribution.whatsapp && <Badge>واتساب</Badge>}
                      {surveyData.distribution.sms && <Badge>رسائل نصية</Badge>}
                      {surveyData.distribution.email && <Badge>بريد إلكتروني</Badge>}
                      {surveyData.distribution.website && <Badge>موقع إلكتروني</Badge>}
                      {surveyData.distribution.app && <Badge>تطبيق</Badge>}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm text-gray-500">الأسئلة</Label>
                    <div className="space-y-2 mt-2">
                      {surveyData.questions.map((question, index) => (
                        <div key={question.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{index + 1}. {question.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {questionTypes.find(t => t.value === question.type)?.label}
                            </Badge>
                          </div>
                          {question.required && (
                            <span className="text-xs text-red-500">* مطلوب</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </ScrollArea>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            السابق
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            {currentStep === totalSteps ? (
              <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                إنشاء الاستبيان
              </Button>
            ) : (
              <Button onClick={handleNext}>
                التالي
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}