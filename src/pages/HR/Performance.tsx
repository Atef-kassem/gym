import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
  Award, Search, Filter, Calendar, Users, Target, TrendingUp,
  Plus, Edit, Trash2, Star, CheckCircle, XCircle, Download, BarChart3
} from "lucide-react";
import { useGetAllEmployeesQuery } from "@/services/employeesApi";
import { format } from "date-fns";

const Performance = () => {
  const [activeTab, setActiveTab] = useState("reviews");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { data: employeesResponse } = useGetAllEmployeesQuery({});
  const employees = Array.isArray(employeesResponse?.data) ? employeesResponse.data : [];

  // استخدام localStorage
  const [performanceReviews, setPerformanceReviews] = useState<any[]>(() => {
    const stored = localStorage.getItem('hr_performance_reviews');
    return stored ? JSON.parse(stored) : [];
  });

  const [goals, setGoals] = useState<any[]>(() => {
    const stored = localStorage.getItem('hr_goals');
    return stored ? JSON.parse(stored) : [];
  });

  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);

  const [reviewFormData, setReviewFormData] = useState({
    employeeId: "",
    reviewPeriod: "",
    reviewDate: "",
    overallRating: "",
    technicalSkills: "",
    communication: "",
    teamwork: "",
    leadership: "",
    productivity: "",
    comments: "",
    goals: "",
    status: "قيد المراجعة"
  });

  const [goalFormData, setGoalFormData] = useState({
    employeeId: "",
    title: "",
    description: "",
    targetDate: "",
    progress: "0",
    status: "قيد التنفيذ",
    category: ""
  });

  const saveToStorage = (key: string, data: any[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const filteredReviews = useMemo(() => {
    return performanceReviews.filter((review: any) => {
      const employee = employees.find((e: any) => e.id === parseInt(review.employeeId));
      return !searchQuery || employee?.arabicName?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [performanceReviews, employees, searchQuery]);

  const filteredGoals = useMemo(() => {
    return goals.filter((goal: any) => {
      const employee = employees.find((e: any) => e.id === parseInt(goal.employeeId));
      return !searchQuery || employee?.arabicName?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [goals, employees, searchQuery]);

  const handleAddReview = () => {
    setReviewFormData({
      employeeId: "",
      reviewPeriod: "",
      reviewDate: "",
      overallRating: "",
      technicalSkills: "",
      communication: "",
      teamwork: "",
      leadership: "",
      productivity: "",
      comments: "",
      goals: "",
      status: "قيد المراجعة"
    });
    setSelectedReview(null);
    setIsReviewDialogOpen(true);
  };

  const handleSaveReview = () => {
    if (!reviewFormData.employeeId || !reviewFormData.reviewDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const ratings = [
      parseFloat(reviewFormData.technicalSkills || 0),
      parseFloat(reviewFormData.communication || 0),
      parseFloat(reviewFormData.teamwork || 0),
      parseFloat(reviewFormData.leadership || 0),
      parseFloat(reviewFormData.productivity || 0)
    ];
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

    if (selectedReview) {
      const updated = performanceReviews.map((r: any) =>
        r.id === selectedReview.id ? { ...r, ...reviewFormData, overallRating: avgRating.toFixed(1), updatedAt: new Date().toISOString() } : r
      );
      setPerformanceReviews(updated);
      saveToStorage('hr_performance_reviews', updated);
      toast({ title: "نجح", description: "تم تحديث التقييم بنجاح" });
    } else {
      const newReview = {
        id: Date.now(),
        ...reviewFormData,
        overallRating: avgRating.toFixed(1),
        createdAt: new Date().toISOString()
      };
      const updated = [...performanceReviews, newReview];
      setPerformanceReviews(updated);
      saveToStorage('hr_performance_reviews', updated);
      toast({ title: "نجح", description: "تم إضافة التقييم بنجاح" });
    }
    setIsReviewDialogOpen(false);
  };

  const handleAddGoal = () => {
    setGoalFormData({
      employeeId: "",
      title: "",
      description: "",
      targetDate: "",
      progress: "0",
      status: "قيد التنفيذ",
      category: ""
    });
    setSelectedGoal(null);
    setIsGoalDialogOpen(true);
  };

  const handleSaveGoal = () => {
    if (!goalFormData.employeeId || !goalFormData.title) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (selectedGoal) {
      const updated = goals.map((g: any) =>
        g.id === selectedGoal.id ? { ...g, ...goalFormData, updatedAt: new Date().toISOString() } : g
      );
      setGoals(updated);
      saveToStorage('hr_goals', updated);
      toast({ title: "نجح", description: "تم تحديث الهدف بنجاح" });
    } else {
      const newGoal = {
        id: Date.now(),
        ...goalFormData,
        createdAt: new Date().toISOString()
      };
      const updated = [...goals, newGoal];
      setGoals(updated);
      saveToStorage('hr_goals', updated);
      toast({ title: "نجح", description: "تم إضافة الهدف بنجاح" });
    }
    setIsGoalDialogOpen(false);
  };

  const stats = useMemo(() => {
    const avgRating = performanceReviews.length > 0
      ? performanceReviews.reduce((sum: number, r: any) => sum + parseFloat(r.overallRating || 0), 0) / performanceReviews.length
      : 0;
    
    return {
      totalReviews: performanceReviews.length,
      avgRating: avgRating.toFixed(1),
      totalGoals: goals.length,
      completedGoals: goals.filter((g: any) => g.status === "مكتمل").length,
      inProgressGoals: goals.filter((g: any) => g.status === "قيد التنفيذ").length
    };
  }, [performanceReviews, goals]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-8 h-8 text-amber-600" />
              تقييم الأداء
            </h1>
            <p className="text-gray-600 mt-1">إدارة تقييمات الأداء وأهداف الموظفين</p>
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
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>التقييمات</span>
                <Award className="w-5 h-5 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stats.totalReviews}</div>
              <p className="text-sm text-gray-500 mt-1">تقييم إجمالي</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>متوسط التقييم</span>
                <Star className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.avgRating}</div>
              <p className="text-sm text-gray-500 mt-1">من 5.0</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الأهداف</span>
                <Target className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalGoals}</div>
              <p className="text-sm text-gray-500 mt-1">{stats.completedGoals} مكتملة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>قيد التنفيذ</span>
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.inProgressGoals}</div>
              <p className="text-sm text-gray-500 mt-1">هدف نشط</p>
            </CardContent>
          </Card>
        </div>

        {/* التبويبات */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="reviews">تقييمات الأداء</TabsTrigger>
            <TabsTrigger value="goals">الأهداف</TabsTrigger>
          </TabsList>

          {/* تبويب التقييمات */}
          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>تقييمات الأداء</CardTitle>
                <Button onClick={handleAddReview} className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة تقييم
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredReviews.map((review: any) => {
                    const employee = employees.find((e: any) => e.id === parseInt(review.employeeId));
                    return (
                      <Card key={review.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{employee?.arabicName || employee?.name || "غير محدد"}</h3>
                                <Badge className={
                                  parseFloat(review.overallRating) >= 4 ? "bg-green-500" :
                                  parseFloat(review.overallRating) >= 3 ? "bg-amber-500" : "bg-red-500"
                                }>
                                  {review.overallRating} / 5.0
                                </Badge>
                                <Badge variant="outline">{review.reviewPeriod}</Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">المهارات التقنية:</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Progress value={parseFloat(review.technicalSkills || 0) * 20} className="flex-1" />
                                    <span className="font-semibold">{review.technicalSkills}</span>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-500">التواصل:</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Progress value={parseFloat(review.communication || 0) * 20} className="flex-1" />
                                    <span className="font-semibold">{review.communication}</span>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-500">العمل الجماعي:</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Progress value={parseFloat(review.teamwork || 0) * 20} className="flex-1" />
                                    <span className="font-semibold">{review.teamwork}</span>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-500">القيادة:</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Progress value={parseFloat(review.leadership || 0) * 20} className="flex-1" />
                                    <span className="font-semibold">{review.leadership}</span>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-500">الإنتاجية:</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Progress value={parseFloat(review.productivity || 0) * 20} className="flex-1" />
                                    <span className="font-semibold">{review.productivity}</span>
                                  </div>
                                </div>
                              </div>
                              {review.comments && (
                                <p className="text-sm text-gray-600 mt-3">{review.comments}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => {
                                setSelectedReview(review);
                                setReviewFormData(review);
                                setIsReviewDialogOpen(true);
                              }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {filteredReviews.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">لا توجد تقييمات</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب الأهداف */}
          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>أهداف الموظفين</CardTitle>
                <Button onClick={handleAddGoal} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة هدف
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredGoals.map((goal: any) => {
                    const employee = employees.find((e: any) => e.id === parseInt(goal.employeeId));
                    return (
                      <Card key={goal.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{goal.title}</h3>
                                <Badge className={
                                  goal.status === "مكتمل" ? "bg-green-500" :
                                  goal.status === "قيد التنفيذ" ? "bg-blue-500" : "bg-gray-500"
                                }>
                                  {goal.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{employee?.arabicName || employee?.name || "غير محدد"}</p>
                              <p className="text-sm text-gray-700 mb-3">{goal.description}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {goal.targetDate}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Target className="w-4 h-4" />
                                  {goal.category}
                                </div>
                              </div>
                              <div className="mt-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>التقدم</span>
                                  <span>{goal.progress}%</span>
                                </div>
                                <Progress value={parseFloat(goal.progress || 0)} />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => {
                                setSelectedGoal(goal);
                                setGoalFormData(goal);
                                setIsGoalDialogOpen(true);
                              }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {filteredGoals.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">لا توجد أهداف</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedReview ? "تعديل التقييم" : "إضافة تقييم أداء جديد"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الموظف *</Label>
                  <Select value={reviewFormData.employeeId} onValueChange={(value) => setReviewFormData({...reviewFormData, employeeId: value})}>
                    <SelectTrigger><SelectValue placeholder="اختر الموظف" /></SelectTrigger>
                    <SelectContent>
                      {employees.map((e: any) => (
                        <SelectItem key={e.id} value={e.id.toString()}>{e.arabicName || e.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>فترة التقييم</Label>
                  <Select value={reviewFormData.reviewPeriod} onValueChange={(value) => setReviewFormData({...reviewFormData, reviewPeriod: value})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ربع سنوي">ربع سنوي</SelectItem>
                      <SelectItem value="نصف سنوي">نصف سنوي</SelectItem>
                      <SelectItem value="سنوي">سنوي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>تاريخ التقييم *</Label>
                <Input type="date" value={reviewFormData.reviewDate} onChange={(e) => setReviewFormData({...reviewFormData, reviewDate: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المهارات التقنية (1-5)</Label>
                  <Input type="number" min="1" max="5" step="0.1" value={reviewFormData.technicalSkills} onChange={(e) => setReviewFormData({...reviewFormData, technicalSkills: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>التواصل (1-5)</Label>
                  <Input type="number" min="1" max="5" step="0.1" value={reviewFormData.communication} onChange={(e) => setReviewFormData({...reviewFormData, communication: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>العمل الجماعي (1-5)</Label>
                  <Input type="number" min="1" max="5" step="0.1" value={reviewFormData.teamwork} onChange={(e) => setReviewFormData({...reviewFormData, teamwork: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>القيادة (1-5)</Label>
                  <Input type="number" min="1" max="5" step="0.1" value={reviewFormData.leadership} onChange={(e) => setReviewFormData({...reviewFormData, leadership: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>الإنتاجية (1-5)</Label>
                <Input type="number" min="1" max="5" step="0.1" value={reviewFormData.productivity} onChange={(e) => setReviewFormData({...reviewFormData, productivity: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>التعليقات</Label>
                <Textarea value={reviewFormData.comments} onChange={(e) => setReviewFormData({...reviewFormData, comments: e.target.value})} rows={4} />
              </div>
              <div className="space-y-2">
                <Label>الأهداف المستقبلية</Label>
                <Textarea value={reviewFormData.goals} onChange={(e) => setReviewFormData({...reviewFormData, goals: e.target.value})} rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveReview} className="bg-amber-600 hover:bg-amber-700">حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedGoal ? "تعديل الهدف" : "إضافة هدف جديد"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الموظف *</Label>
                  <Select value={goalFormData.employeeId} onValueChange={(value) => setGoalFormData({...goalFormData, employeeId: value})}>
                    <SelectTrigger><SelectValue placeholder="اختر الموظف" /></SelectTrigger>
                    <SelectContent>
                      {employees.map((e: any) => (
                        <SelectItem key={e.id} value={e.id.toString()}>{e.arabicName || e.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>الفئة</Label>
                  <Select value={goalFormData.category} onValueChange={(value) => setGoalFormData({...goalFormData, category: value})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="أداء">أداء</SelectItem>
                      <SelectItem value="تطوير">تطوير</SelectItem>
                      <SelectItem value="مبيعات">مبيعات</SelectItem>
                      <SelectItem value="مشروع">مشروع</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>عنوان الهدف *</Label>
                <Input value={goalFormData.title} onChange={(e) => setGoalFormData({...goalFormData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea value={goalFormData.description} onChange={(e) => setGoalFormData({...goalFormData, description: e.target.value})} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>تاريخ الهدف</Label>
                  <Input type="date" value={goalFormData.targetDate} onChange={(e) => setGoalFormData({...goalFormData, targetDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>التقدم (%)</Label>
                  <Input type="number" min="0" max="100" value={goalFormData.progress} onChange={(e) => setGoalFormData({...goalFormData, progress: e.target.value})} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGoalDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveGoal} className="bg-blue-600 hover:bg-blue-700">حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Performance;

