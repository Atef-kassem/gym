import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  FileText, 
  User, 
  Star,
  Target,
  Lightbulb,
  Zap,
  Award,
  Calendar,
  RefreshCw,
  ArrowRight,
  Shield
} from "lucide-react";

interface SmartRecommendationsProps {
  employees: any[];
}

interface Recommendation {
  id: string;
  type: 'urgent' | 'improvement' | 'optimization' | 'compliance';
  title: string;
  description: string;
  priority: 'عالي' | 'متوسط' | 'منخفض';
  impact: string;
  action: string;
  employee?: any;
  deadline?: string;
  progress?: number;
}

const SmartRecommendations = ({ employees }: SmartRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateRecommendations();
  }, [employees]);

  const generateRecommendations = () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const newRecommendations: Recommendation[] = [];

      // Analyze employees and generate recommendations
      employees.forEach(employee => {
        // Document expiry recommendations
        if (employee.residenceExpiry && new Date(employee.residenceExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
          newRecommendations.push({
            id: `doc_${employee.id}_residence`,
            type: 'urgent',
            title: 'تجديد وثيقة إقامة عاجل',
            description: `إقامة الموظف ${employee.name} تنتهي قريباً (${employee.residenceExpiry})`,
            priority: 'عالي',
            impact: 'تجنب غرامات وإيقاف الخدمات',
            action: 'بدء إجراءات التجديد فوراً',
            employee: employee,
            deadline: employee.residenceExpiry
          });
        }

        // File completion recommendations
        if (employee.completionPercentage < 80) {
          newRecommendations.push({
            id: `completion_${employee.id}`,
            type: 'improvement',
            title: 'استكمال ملف الموظف',
            description: `ملف ${employee.name} ناقص (${employee.completionPercentage}% مكتمل)`,
            priority: 'متوسط',
            impact: 'تحسين دقة البيانات والامتثال',
            action: 'جمع الوثائق الناقصة',
            employee: employee,
            progress: employee.completionPercentage
          });
        }

        // Performance recommendations
        if (employee.performanceRating < 3.0) {
          newRecommendations.push({
            id: `performance_${employee.id}`,
            type: 'improvement',
            title: 'تحسين الأداء الوظيفي',
            description: `مراجعة أداء ${employee.name} والعمل على تطويره`,
            priority: 'متوسط',
            impact: 'رفع مستوى الإنتاجية',
            action: 'وضع خطة تطوير شخصية',
            employee: employee
          });
        }
      });

      // System-wide recommendations
      const incompleteFiles = employees.filter(emp => emp.fileStatus === 'ناقص').length;
      if (incompleteFiles > 10) {
        newRecommendations.push({
          id: 'system_incomplete',
          type: 'optimization',
          title: 'حملة استكمال الملفات',
          description: `يوجد ${incompleteFiles} ملف موظف ناقص في النظام`,
          priority: 'عالي',
          impact: 'تحسين جودة البيانات والامتثال',
          action: 'إطلاق حملة جمع الوثائق الناقصة'
        });
      }

      // Compliance recommendations
      const expiredDocs = calculateExpiredDocuments();
      if (expiredDocs > 5) {
        newRecommendations.push({
          id: 'compliance_docs',
          type: 'compliance',
          title: 'مراجعة سياسة الوثائق',
          description: `${expiredDocs} وثيقة تحتاج تجديد أو مراجعة`,
          priority: 'عالي',
          impact: 'ضمان الامتثال القانوني',
          action: 'مراجعة وتحديث سياسة إدارة الوثائق'
        });
      }

      // Training recommendations
      newRecommendations.push({
        id: 'training_ai',
        type: 'optimization',
        title: 'تدريب فريق الموارد البشرية',
        description: 'تحسين استخدام النظام الذكي وميزات الذكاء الاصطناعي',
        priority: 'منخفض',
        impact: 'زيادة الكفاءة والإنتاجية',
        action: 'تنظيم دورة تدريبية متخصصة'
      });

      setRecommendations(newRecommendations);
      setIsGenerating(false);
    }, 2000);
  };

  const calculateExpiredDocuments = () => {
    let count = 0;
    const currentDate = new Date();
    
    employees.forEach(employee => {
      if (employee.residenceExpiry && new Date(employee.residenceExpiry) < currentDate) count++;
      if (employee.passportExpiry && new Date(employee.passportExpiry) < currentDate) count++;
      if (employee.workPermitExpiry && new Date(employee.workPermitExpiry) < currentDate) count++;
    });
    
    return count;
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'urgent': return AlertTriangle;
      case 'improvement': return TrendingUp;
      case 'optimization': return Zap;
      case 'compliance': return Shield;
      default: return Lightbulb;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'improvement': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'optimization': return 'text-green-600 bg-green-50 border-green-200';
      case 'compliance': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عالي': return 'bg-red-100 text-red-800';
      case 'متوسط': return 'bg-orange-100 text-orange-800';
      case 'منخفض': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'high') return rec.priority === 'عالي';
    if (activeFilter === 'urgent') return rec.type === 'urgent';
    if (activeFilter === 'improvement') return rec.type === 'improvement';
    return true;
  });

  const executeRecommendation = (recommendation: Recommendation) => {
    toast({
      title: "تم تنفيذ التوصية",
      description: `بدء تنفيذ: ${recommendation.title}`,
    });
  };

  const dismissRecommendation = (id: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
    toast({
      title: "تم تجاهل التوصية",
      description: "تم إزالة التوصية من القائمة",
    });
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">التوصيات الذكية</CardTitle>
              <p className="text-sm text-slate-600 mt-1">اقتراحات مدعومة بالذكاء الاصطناعي لتحسين إدارة الملفات</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={generateRecommendations}
              disabled={isGenerating}
              className="hover:bg-purple-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'جاري التحليل...' : 'تحديث'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: 'جميع التوصيات', count: recommendations.length },
            { key: 'high', label: 'أولوية عالية', count: recommendations.filter(r => r.priority === 'عالي').length },
            { key: 'urgent', label: 'عاجل', count: recommendations.filter(r => r.type === 'urgent').length },
            { key: 'improvement', label: 'تحسينات', count: recommendations.filter(r => r.type === 'improvement').length }
          ].map(filter => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.key)}
              className={`relative ${activeFilter === filter.key ? 'bg-purple-600 hover:bg-purple-700' : 'hover:bg-purple-50'}`}
            >
              {filter.label}
              <Badge variant="secondary" className="ml-2 bg-white text-slate-700">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 bg-purple-50 px-6 py-4 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600 animate-pulse" />
              <div>
                <p className="font-medium text-purple-900">جاري تحليل البيانات...</p>
                <p className="text-sm text-purple-600">الذكاء الاصطناعي يحلل ملفات الموظفين لإنتاج توصيات مخصصة</p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations List */}
        {!isGenerating && (
          <div className="space-y-4">
            {filteredRecommendations.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">لا توجد توصيات</h3>
                <p className="text-slate-500">جميع العمليات تسير بشكل مثالي أو لا توجد بيانات كافية للتحليل</p>
              </div>
            ) : (
              filteredRecommendations.map((recommendation) => {
                const IconComponent = getRecommendationIcon(recommendation.type);
                return (
                  <Card 
                    key={recommendation.id} 
                    className={`border-l-4 hover:shadow-lg transition-all duration-300 ${getRecommendationColor(recommendation.type)}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${getRecommendationColor(recommendation.type)}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-slate-900 text-lg">{recommendation.title}</h4>
                              <p className="text-slate-600 mt-1">{recommendation.description}</p>
                            </div>
                            <Badge className={getPriorityColor(recommendation.priority)}>
                              {recommendation.priority}
                            </Badge>
                          </div>

                          {recommendation.employee && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                                  <User className="w-4 h-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-slate-900">{recommendation.employee.name}</p>
                                <p className="text-sm text-slate-600">{recommendation.employee.empId} - {recommendation.employee.position}</p>
                              </div>
                            </div>
                          )}

                          {recommendation.progress !== undefined && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">نسبة الإكمال</span>
                                <span className="font-medium">{recommendation.progress}%</span>
                              </div>
                              <Progress value={recommendation.progress} className="h-2" />
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                              <p className="font-medium text-slate-900 flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                التأثير المتوقع
                              </p>
                              <p className="text-slate-600">{recommendation.impact}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium text-slate-900 flex items-center gap-1">
                                <ArrowRight className="w-3 h-3" />
                                الإجراء المطلوب
                              </p>
                              <p className="text-slate-600">{recommendation.action}</p>
                            </div>
                          </div>

                          {recommendation.deadline && (
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                              <Calendar className="w-4 h-4" />
                              <span>موعد نهائي: {recommendation.deadline}</span>
                            </div>
                          )}

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm text-slate-600">توصية ذكية</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => dismissRecommendation(recommendation.id)}
                                className="text-slate-600 hover:bg-slate-50"
                              >
                                تجاهل
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => executeRecommendation(recommendation)}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                              >
                                تنفيذ الآن
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartRecommendations;