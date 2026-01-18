import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Star, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  Users,
  BarChart3,
  Download,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  X,
  Award,
  Target,
  Activity,
  Clock,
  AlertCircle,
  Brain
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AISupplierEvaluation from "@/components/Inventory/AISupplierEvaluation";

// Enhanced Types
interface EvaluationCriteria {
  id: string;
  name: string;
  weight: number;
  rating: number;
  notes: string;
}

interface SupplierEvaluation {
  id: string;
  supplierId: string;
  supplierName: string;
  evaluatorName: string;
  evaluationDate: Date;
  contractNumber: string;
  criteria: EvaluationCriteria[];
  totalScore: number;
  generalNotes: string;
  recommendation: string;
  nextEvaluationDate: Date;
  attachments: string[];
  status: "مكتمل" | "معلق" | "قيد المراجعة";
  createdAt: Date;
  updatedAt: Date;
}

interface Supplier {
  id: string;
  name: string;
  category: string;
  contractsCount: number;
  averageRating: number;
  status: string;
  lastEvaluation: Date;
}

const SupplierEvaluation = () => {
  const { toast } = useToast();

  // Default evaluation criteria
  const defaultCriteria: EvaluationCriteria[] = [
    { id: "1", name: "جودة المنتجات/الخدمة", weight: 30, rating: 3, notes: "" },
    { id: "2", name: "الالتزام بالمواعيد", weight: 20, rating: 3, notes: "" },
    { id: "3", name: "الأسعار والتكلفة", weight: 15, rating: 3, notes: "" },
    { id: "4", name: "المرونة والاستجابة", weight: 10, rating: 3, notes: "" },
    { id: "5", name: "استكمال الوثائق", weight: 10, rating: 3, notes: "" },
    { id: "6", name: "خدمة ما بعد البيع", weight: 10, rating: 3, notes: "" },
    { id: "7", name: "علاقات العمل", weight: 5, rating: 3, notes: "" },
  ];

  // Sample suppliers
  const [suppliers] = useState<Supplier[]>([
    {
      id: "1",
      name: "شركة الأولى للمواد الكيميائية",
      category: "مواد كيميائية",
      contractsCount: 15,
      averageRating: 4.2,
      status: "نشط",
      lastEvaluation: new Date(2024, 0, 15)
    },
    {
      id: "2", 
      name: "مؤسسة النجاح لقطع   ",
      category: "مشروب ومنتجات",
      contractsCount: 8,
      averageRating: 3.8,
      status: "تحت المراقبة",
      lastEvaluation: new Date(2024, 1, 20)
    },
    {
      id: "3",
      name: "شركة التميز للزيوت",
      category: "زيوت ومواد تشحيم", 
      contractsCount: 12,
      averageRating: 4.5,
      status: "متميز",
      lastEvaluation: new Date(2024, 2, 10)
    },
  ]);

  // Enhanced state management
  const [evaluations, setEvaluations] = useState<SupplierEvaluation[]>([
    {
      id: "EVAL-001",
      supplierId: "1",
      supplierName: "شركة الأولى للمواد الكيميائية",
      evaluatorName: "أحمد المدير",
      evaluationDate: new Date(2024, 2, 15),
      contractNumber: "CONT-2024-001",
      criteria: [
        { id: "1", name: "جودة المنتجات/الخدمة", weight: 30, rating: 4, notes: "جودة ممتازة ومطابقة للمواصفات" },
        { id: "2", name: "الالتزام بالمواعيد", weight: 20, rating: 5, notes: "التزام كامل بالمواعيد المحددة" },
        { id: "3", name: "الأسعار والتكلفة", weight: 15, rating: 3, notes: "أسعار معقولة مع إمكانية التحسن" },
        { id: "4", name: "المرونة والاستجابة", weight: 10, rating: 4, notes: "استجابة سريعة للطلبات" },
        { id: "5", name: "استكمال الوثائق", weight: 10, rating: 5, notes: "وثائق كاملة ومنظمة" },
        { id: "6", name: "خدمة ما بعد البيع", weight: 10, rating: 4, notes: "خدمة جيدة مع متابعة منتظمة" },
        { id: "7", name: "علاقات العمل", weight: 5, rating: 5, notes: "تعاون ممتاز وتواصل فعال" }
      ],
      totalScore: 4.2,
      generalNotes: "مورد موثوق مع أداء متميز في معظم المعايير",
      recommendation: "continue",
      nextEvaluationDate: new Date(2024, 8, 15),
      attachments: [],
      status: "مكتمل",
      createdAt: new Date(2024, 2, 15),
      updatedAt: new Date(2024, 2, 15)
    }
  ]);

  // Form states
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [evaluatorName, setEvaluatorName] = useState("");
  const [contractNumber, setContractNumber] = useState("");
  const [evaluationDate, setEvaluationDate] = useState<Date>(new Date());
  const [nextEvaluationDate, setNextEvaluationDate] = useState<Date>();
  const [criteria, setCriteria] = useState<EvaluationCriteria[]>(defaultCriteria);
  const [generalNotes, setGeneralNotes] = useState("");
  const [recommendation, setRecommendation] = useState("");
  
  // Enhanced state for management
  const [selectedEvaluation, setSelectedEvaluation] = useState<SupplierEvaluation | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Calculate total score
  const calculateTotalScore = () => {
    return criteria.reduce((total, criterion) => {
      return total + (criterion.rating * criterion.weight / 100);
    }, 0);
  };

  // Update criterion rating
  const updateCriterionRating = (id: string, rating: number) => {
    setCriteria(prev => prev.map(c => 
      c.id === id ? { ...c, rating } : c
    ));
  };

  // Update criterion notes
  const updateCriterionNotes = (id: string, notes: string) => {
    setCriteria(prev => prev.map(c => 
      c.id === id ? { ...c, notes } : c
    ));
  };

  // Get rating color
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "متميز": return "default";
      case "نشط": return "secondary";
      case "تحت المراقبة": return "destructive";
      default: return "outline";
    }
  };

  // Enhanced functions
  const editEvaluation = (evaluation: SupplierEvaluation) => {
    setSelectedEvaluation(evaluation);
    setSelectedSupplier(evaluation.supplierId);
    setEvaluatorName(evaluation.evaluatorName);
    setContractNumber(evaluation.contractNumber);
    setEvaluationDate(evaluation.evaluationDate);
    setNextEvaluationDate(evaluation.nextEvaluationDate);
    setCriteria(evaluation.criteria);
    setGeneralNotes(evaluation.generalNotes);
    setRecommendation(evaluation.recommendation);
    setShowEditForm(true);
  };

  const viewEvaluation = (evaluation: SupplierEvaluation) => {
    setSelectedEvaluation(evaluation);
    setShowViewDialog(true);
  };

  const deleteEvaluation = (evaluationId: string) => {
    setEvaluations(prev => prev.filter(evaluation => evaluation.id !== evaluationId));
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف التقييم من النظام",
    });
  };

  const updateEvaluation = () => {
    if (!selectedEvaluation || !selectedSupplier || !evaluatorName) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إكمال الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const totalScore = calculateTotalScore();
    const selectedSupplierData = suppliers.find(s => s.id === selectedSupplier);

    const updatedEvaluation: SupplierEvaluation = {
      ...selectedEvaluation,
      supplierId: selectedSupplier,
      supplierName: selectedSupplierData?.name || "",
      evaluatorName,
      contractNumber,
      evaluationDate,
      nextEvaluationDate: nextEvaluationDate || new Date(),
      criteria,
      totalScore,
      generalNotes,
      recommendation,
      updatedAt: new Date()
    };

    setEvaluations(prev => prev.map(evaluation => 
      evaluation.id === selectedEvaluation.id ? updatedEvaluation : evaluation
    ));

    // Reset form
    resetForm();
    setShowEditForm(false);
    
    toast({
      title: "تم التحديث بنجاح",
      description: `تم تحديث التقييم - إجمالي التقييم: ${totalScore.toFixed(1)} من 5`,
    });
  };

  const resetForm = () => {
    setSelectedSupplier("");
    setEvaluatorName("");
    setContractNumber("");
    setEvaluationDate(new Date());
    setNextEvaluationDate(undefined);
    setCriteria(defaultCriteria);
    setGeneralNotes("");
    setRecommendation("");
    setSelectedEvaluation(null);
  };

  // Submit evaluation
  const submitEvaluation = () => {
    if (!selectedSupplier || !evaluatorName) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إكمال الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const totalScore = calculateTotalScore();
    const selectedSupplierData = suppliers.find(s => s.id === selectedSupplier);
    
    const newEvaluation: SupplierEvaluation = {
      id: `EVAL-${Date.now()}`,
      supplierId: selectedSupplier,
      supplierName: selectedSupplierData?.name || "",
      evaluatorName,
      contractNumber,
      evaluationDate,
      nextEvaluationDate: nextEvaluationDate || new Date(),
      criteria: [...criteria],
      totalScore,
      generalNotes,
      recommendation,
      attachments: [],
      status: "مكتمل",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setEvaluations(prev => [...prev, newEvaluation]);

    toast({
      title: "تم حفظ التقييم بنجاح",
      description: `إجمالي التقييم: ${totalScore.toFixed(1)} من 5`,
    });

    // Reset form
    resetForm();
  };

  // Enhanced filtering
  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = evaluation.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluation.evaluatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluation.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || evaluation.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case "continue": return "الاستمرار بالتعامل";
      case "monitor": return "وضع تحت المراقبة";
      case "improve": return "اقتراح تطوير";
      case "stop": return "إيقاف التعامل";
      default: return recommendation;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "continue": return "bg-green-100 text-green-800 border-green-200";
      case "monitor": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "improve": return "bg-blue-100 text-blue-800 border-blue-200";
      case "stop": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مكتمل": return "bg-green-100 text-green-800 border-green-200";
      case "معلق": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "قيد المراجعة": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="space-y-8 p-6">
        {/* Enhanced Header with Modern Design */}
        <div className="relative overflow-hidden bg-gradient-to-r from-white/95 via-blue-50/80 to-purple-50/70 p-8 rounded-3xl border border-white/60 shadow-2xl backdrop-blur-md">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 via-purple-200/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/20 via-pink-200/10 to-transparent rounded-full blur-xl"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
                  تقييم الموردين
                </h1>
                <p className="text-lg text-gray-600 font-medium">
                  نظام متقدم وشامل لتقييم أداء الموردين وفق معايير احترافية موحدة
                </p>
              </div>
            </div>
            
            {/* Enhanced Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 bg-white/80 backdrop-blur-sm border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
              >
                <Download className="w-5 h-5 text-blue-600" />
                تصدير التقارير
              </Button>
            </div>
          </div>
        </div>

      <Tabs defaultValue="evaluation" className="w-full">
        <TabsList className="grid w-full grid-cols-5 p-1 bg-gradient-to-r from-white/90 to-blue-50/80 border shadow-2xl rounded-2xl">
          <TabsTrigger 
            value="evaluation" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl"
          >
            <Star className="w-4 h-4" />
            تقييم جديد
          </TabsTrigger>
          <TabsTrigger 
            value="ai-analysis" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl"
          >
            <Brain className="w-4 h-4" />
            التحليل الذكي
          </TabsTrigger>
          <TabsTrigger 
            value="suppliers" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl"
          >
            <Users className="w-4 h-4" />
            قائمة الموردين
          </TabsTrigger>
          <TabsTrigger 
            value="reports" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl"
          >
            <BarChart3 className="w-4 h-4" />
            التقارير والإحصائيات
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl"
          >
            <FileText className="w-4 h-4" />
            سجل التقييمات
          </TabsTrigger>
        </TabsList>

        {/* تقييم جديد */}
        <TabsContent value="evaluation">
          <div className="grid gap-6">
            {/* معلومات التقييم الأساسية */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  معلومات التقييم الأساسية
                </CardTitle>
                <CardDescription>تحديد المورد والمعلومات الأساسية للتقييم</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="supplier">اختيار المورد *</Label>
                    <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المورد" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name} - {supplier.category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="evaluator">اسم المقيم *</Label>
                    <Input
                      id="evaluator"
                      value={evaluatorName}
                      onChange={(e) => setEvaluatorName(e.target.value)}
                      placeholder="اسم الموظف المسؤول"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contract">رقم العقد/الطلبية</Label>
                    <Input
                      id="contract"
                      value={contractNumber}
                      onChange={(e) => setContractNumber(e.target.value)}
                      placeholder="رقم العقد (اختياري)"
                    />
                  </div>
                  <div>
                    <Label>تاريخ التقييم</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !evaluationDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {evaluationDate ? format(evaluationDate, "yyyy-MM-dd") : "اختر التاريخ"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={evaluationDate}
                          onSelect={(date) => date && setEvaluationDate(date)}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* معايير التقييم */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  معايير التقييم
                </CardTitle>
                <CardDescription>تقييم المورد وفق المعايير المحددة (1-5 نجوم)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {criteria.map((criterion) => (
                  <div key={criterion.id} className="p-4 bg-muted/30 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{criterion.name}</h4>
                        <Badge variant="outline">{criterion.weight}%</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getRatingColor(criterion.rating)}`}>
                          {criterion.rating}
                        </span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 cursor-pointer ${
                                star <= criterion.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              onClick={() => updateCriterionRating(criterion.id, star)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>التقييم (1-5)</Label>
                      <Slider
                        value={[criterion.rating]}
                        onValueChange={(value) => updateCriterionRating(criterion.id, value[0])}
                        max={5}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label>ملاحظات</Label>
                      <Textarea
                        value={criterion.notes}
                        onChange={(e) => updateCriterionNotes(criterion.id, e.target.value)}
                        placeholder="أضف ملاحظات على هذا المعيار..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}

                {/* إجمالي التقييم */}
                <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary-blue/10 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">إجمالي التقييم</h3>
                    <div className="text-2xl font-bold text-primary">
                      {calculateTotalScore().toFixed(1)} / 5.0
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 ${
                            star <= Math.round(calculateTotalScore())
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* الملاحظات والتوصيات */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  الملاحظات والتوصيات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="generalNotes">ملاحظات عامة</Label>
                  <Textarea
                    id="generalNotes"
                    value={generalNotes}
                    onChange={(e) => setGeneralNotes(e.target.value)}
                    placeholder="أضف ملاحظات عامة حول أداء المورد..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="recommendation">التوصية النهائية</Label>
                  <Select value={recommendation} onValueChange={setRecommendation}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التوصية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="continue">الاستمرار بالتعامل</SelectItem>
                      <SelectItem value="monitor">وضع المورد تحت المراقبة</SelectItem>
                      <SelectItem value="improve">اقتراح تطوير/إجراءات تصحيحية</SelectItem>
                      <SelectItem value="stop">إيقاف التعامل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>تاريخ التقييم القادم</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !nextEvaluationDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {nextEvaluationDate ? format(nextEvaluationDate, "yyyy-MM-dd") : "اختر التاريخ"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={nextEvaluationDate}
                        onSelect={setNextEvaluationDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button onClick={submitEvaluation} className="w-full" size="lg">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  حفظ التقييم
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* التحليل بالذكاء الاصطناعي */}
        <TabsContent value="ai-analysis">
          <AISupplierEvaluation />
        </TabsContent>

        {/* قائمة الموردين */}
        <TabsContent value="suppliers">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                قائمة الموردين وتقييماتهم
              </CardTitle>
              <CardDescription>عرض جميع الموردين مع آخر تقييم لكل منهم</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suppliers.map((supplier) => (
                  <div key={supplier.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{supplier.name}</h3>
                        <p className="text-sm text-muted-foreground">{supplier.category}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span>عدد العقود: {supplier.contractsCount}</span>
                          <span>•</span>
                          <span>آخر تقييم: {format(supplier.lastEvaluation, "yyyy-MM-dd")}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= Math.round(supplier.averageRating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold">{supplier.averageRating}</span>
                        </div>
                        <Badge variant={getStatusVariant(supplier.status)}>
                          {supplier.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* التقارير والإحصائيات */}
        <TabsContent value="reports">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">متوسط التقييمات</p>
                      <p className="text-2xl font-bold">4.2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">موردين تحت المراقبة</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">موردين متميزين</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>أفضل الموردين</CardTitle>
                <CardDescription>الموردين الحاصلين على أعلى التقييمات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suppliers
                    .sort((a, b) => b.averageRating - a.averageRating)
                    .slice(0, 5)
                    .map((supplier, index) => (
                      <div key={supplier.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{supplier.name}</h4>
                            <p className="text-sm text-muted-foreground">{supplier.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= Math.round(supplier.averageRating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold">{supplier.averageRating}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Enhanced History Tab with Full Functionality */}
        <TabsContent value="history">
          <div className="space-y-6">
            {/* Search and Filter Section */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 to-gray-50/80 backdrop-blur-md border-0 shadow-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-indigo-600 transition-colors duration-300" />
                      <Input
                        placeholder="البحث عن مورد، مقيم، أو رقم تقييم..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-4 h-12 bg-gradient-to-r from-white to-gray-50/80 border-gray-200 hover:border-indigo-500 focus:border-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-48 h-12 bg-gradient-to-r from-white to-gray-50/80 border-gray-200 hover:border-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg rounded-xl">
                        <Filter className="w-4 h-4 mr-2 text-gray-500" />
                        <SelectValue placeholder="حالة التقييم" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl shadow-2xl border-0 bg-white/95 backdrop-blur-md">
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="مكتمل">مكتمل</SelectItem>
                        <SelectItem value="معلق">معلق</SelectItem>
                        <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Evaluations Table */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 to-indigo-50/80 backdrop-blur-md border-0 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>
              <CardHeader className="bg-gradient-to-r from-indigo-50/80 to-purple-50/60 backdrop-blur-sm">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                    سجل التقييمات ({filteredEvaluations.length})
                  </span>
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  عرض جميع التقييمات السابقة مع إمكانية البحث والفلترة والإدارة
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredEvaluations.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>رقم التقييم</TableHead>
                        <TableHead>المورد</TableHead>
                        <TableHead>المقيم</TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>إجمالي التقييم</TableHead>
                        <TableHead>التوصية</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEvaluations.map((evaluation) => (
                        <TableRow key={evaluation.id} className="hover:bg-indigo-50/50 transition-colors">
                          <TableCell className="font-medium">{evaluation.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{evaluation.supplierName}</div>
                              <div className="text-sm text-muted-foreground">{evaluation.contractNumber}</div>
                            </div>
                          </TableCell>
                          <TableCell>{evaluation.evaluatorName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3 text-gray-500" />
                              {format(evaluation.evaluationDate, "yyyy-MM-dd")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= Math.round(evaluation.totalScore)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-semibold text-lg">{evaluation.totalScore.toFixed(1)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRecommendationColor(evaluation.recommendation)}>
                              {getRecommendationText(evaluation.recommendation)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(evaluation.status)}>
                              {evaluation.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-indigo-100">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl shadow-2xl border-0 bg-white/95 backdrop-blur-md">
                                <DropdownMenuItem onClick={() => viewEvaluation(evaluation)} className="hover:bg-blue-50">
                                  <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                  عرض التفاصيل
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => editEvaluation(evaluation)} className="hover:bg-green-50">
                                  <Edit className="mr-2 h-4 w-4 text-green-600" />
                                  تعديل التقييم
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => deleteEvaluation(evaluation.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  حذف التقييم
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-purple-50">
                                  <Download className="mr-2 h-4 w-4 text-purple-600" />
                                  تحميل التقرير
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">لا توجد تقييمات مطابقة للبحث</p>
                    <p className="text-sm">جرب تغيير معايير البحث أو إضافة تقييم جديد</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

        {/* Edit Evaluation Form */}
        {showEditForm && selectedEvaluation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative max-w-6xl w-full max-h-[95vh] overflow-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-purple-100/10 to-indigo-100/20 rounded-3xl blur-xl"></div>
              <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 to-blue-50/80 backdrop-blur-md border-0 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
                <CardHeader className="bg-gradient-to-r from-blue-50/80 to-purple-50/60 backdrop-blur-sm p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-md opacity-30 animate-pulse"></div>
                        <div className="relative p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                          <Edit className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                          تعديل التقييم
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-600 font-medium mt-2">
                          تحديث بيانات التقييم: {selectedEvaluation.id}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setShowEditForm(false)}
                      className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  {/* Edit form content - reuse the evaluation form structure */}
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="editSupplier">اختيار المورد *</Label>
                        <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المورد" />
                          </SelectTrigger>
                          <SelectContent>
                            {suppliers.map((supplier) => (
                              <SelectItem key={supplier.id} value={supplier.id}>
                                {supplier.name} - {supplier.category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="editEvaluator">اسم المقيم *</Label>
                        <Input
                          id="editEvaluator"
                          value={evaluatorName}
                          onChange={(e) => setEvaluatorName(e.target.value)}
                          placeholder="اسم الموظف المسؤول"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
                      <Button 
                        onClick={updateEvaluation}
                        size="lg"
                        className="flex-1 gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        <CheckCircle className="w-5 h-5" />
                        تحديث التقييم
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowEditForm(false)}
                        size="lg"
                        className="flex-1 gap-3 border-2 border-gray-300 hover:bg-gray-50 font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        <X className="w-5 h-5" />
                        إلغاء
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* View Evaluation Dialog */}
        {showViewDialog && selectedEvaluation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative max-w-5xl w-full max-h-[95vh] overflow-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 via-blue-100/10 to-purple-100/20 rounded-3xl blur-xl"></div>
              <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 to-green-50/80 backdrop-blur-md border-0 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
                <CardHeader className="bg-gradient-to-r from-green-50/80 to-blue-50/60 backdrop-blur-sm p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-500 rounded-2xl blur-md opacity-30 animate-pulse"></div>
                        <div className="relative p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl shadow-lg">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-700 to-blue-700 bg-clip-text text-transparent">
                          تفاصيل التقييم
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-600 font-medium mt-2">
                          معلومات شاملة عن التقييم
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setShowViewDialog(false)}
                      className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-8">
                    {/* Basic Information Display */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-600">رقم التقييم</Label>
                        <p className="text-lg font-medium">{selectedEvaluation.id}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-600">المورد</Label>
                        <p className="text-lg font-medium">{selectedEvaluation.supplierName}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-600">المقيم</Label>
                        <p className="text-lg font-medium">{selectedEvaluation.evaluatorName}</p>
                      </div>
                    </div>

                    {/* Evaluation Score Display */}
                    <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800">إجمالي التقييم</h3>
                        <div className="text-3xl font-bold text-green-600">
                          {selectedEvaluation.totalScore.toFixed(1)} / 5.0
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-8 h-8 ${
                              star <= Math.round(selectedEvaluation.totalScore)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
                      <Button 
                        onClick={() => editEvaluation(selectedEvaluation)}
                        size="lg"
                        className="flex-1 gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        <Edit className="w-5 h-5" />
                        تعديل التقييم
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="flex-1 gap-3 border-2 border-green-300 hover:bg-green-50 font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        <Download className="w-5 h-5" />
                        تحميل التقرير
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowViewDialog(false)}
                        size="lg"
                        className="flex-1 gap-3 border-2 border-gray-300 hover:bg-gray-50 font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        <X className="w-5 h-5" />
                        إغلاق
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierEvaluation;