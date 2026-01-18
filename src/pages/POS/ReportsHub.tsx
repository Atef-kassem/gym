import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Package,
  Users,
  TrendingUp,
  FileText,
  Clock,
  Target,
  DollarSign,
  PieChart,
  Activity,
  Calculator,
  Star,
  Percent,
  ChevronRight
} from 'lucide-react';

const reports = [
  {
    id: 'categories-sales',
    title: 'تقرير إجمالي مبيعات التصنيفات',
    description: 'معرفة حجم المبيعات لكل تصنيف رئيسي مع النسب والإحصائيات',
    icon: PieChart,
    color: 'from-blue-500 to-blue-600',
    route: '/pos/reports/categories-sales',
    features: ['نسب التصنيفات', 'الضرائب المحصلة', 'متوسط سعر الوحدة'],
    status: 'active'
  },
  {
    id: 'products-services',
    title: 'تقرير إجمالي مبيعات المنتجات والخدمات',
    description: 'تحليل مبيعات كل منتج وخدمة بالتفصيل',
    icon: Package,
    color: 'from-green-500 to-green-600',
    route: '/pos/reports/products-services',
    features: ['الباركود', 'الخصومات المطبقة', 'نسبة المساهمة'],
    status: 'active'
  },
  {
    id: 'shifts-sales',
    title: 'تقرير مبيعات الورديات',
    description: 'معرفة أداء كل وردية ومبيعات كل كاشير',
    icon: Clock,
    color: 'from-purple-500 to-purple-600',
    route: '/pos/reports/shifts-sales',
    features: ['أداء الكاشير', 'طرق الدفع', 'إيرادات الوردية'],
    status: 'active'
  },
  {
    id: 'shifts-detailed',
    title: 'تقرير حركة الورديات التفصيلي',
    description: 'متابعة كل العمليات والتعاملات المالية لكل وردية',
    icon: Activity,
    color: 'from-orange-500 to-orange-600',
    route: '/pos/reports/shifts-detailed',
    features: ['العمليات التفصيلية', 'التوقيعات', 'السحب والإيداع'],
    status: 'active'
  },
  {
    id: 'shifts-profitability',
    title: 'تقرير ربحية الورديات',
    description: 'معرفة صافي ربح كل وردية مع تكلفة المنتجات',
    icon: TrendingUp,
    color: 'from-emerald-500 to-emerald-600',
    route: '/pos/reports/shifts-profitability',
    features: ['صافي الربح', 'نسبة الربحية', 'تكلفة المبيعات'],
    status: 'active'
  },
  {
    id: 'categories-profitability',
    title: 'تقرير ربحية التصنيفات',
    description: 'تحليل هامش الربح حسب كل تصنيف رئيسي وفرعي',
    icon: Target,
    color: 'from-red-500 to-red-600',
    route: '/pos/reports/categories-profitability',
    features: ['هامش الربح', 'متوسط الربح', 'نسب الربحية'],
    status: 'active'
  },
  {
    id: 'products-profitability',
    title: 'تقرير ربحية المنتجات والخدمات',
    description: 'قياس ربحية كل منتج وخدمة لتحديد الأفضل والأضعف',
    icon: Calculator,
    color: 'from-indigo-500 to-indigo-600',
    route: '/pos/reports/products-profitability',
    features: ['أفضل المنتجات', 'مساهمة الربح', 'تحليل الأداء'],
    status: 'active'
  }
];

export default function ReportsHub() {
  const navigate = useNavigate();

  const handleReportClick = (report) => {
    if (report.status === 'active') {
      navigate(report.route);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <Badge className="bg-green-100 text-green-800">متاح</Badge>;
    }
    return <Badge variant="outline" className="text-gray-500">قريباً</Badge>;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full">
            <BarChart3 className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">مركز التقارير والتحليلات</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            تقارير شاملة ومفصلة لتحليل أداء نقاط البيع والمبيعات والربحية
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">إجمالي التقارير</p>
                <p className="text-2xl font-bold text-blue-900">{reports.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">التقارير المتاحة</p>
                <p className="text-2xl font-bold text-green-900">
                  {reports.filter(r => r.status === 'active').length}
                </p>
              </div>
              <Star className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">تقارير الربحية</p>
                <p className="text-2xl font-bold text-orange-900">3</p>
              </div>
              <Percent className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">تقارير المبيعات</p>
                <p className="text-2xl font-bold text-purple-900">4</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => {
          const IconComponent = report.icon;
          const isActive = report.status === 'active';
          
          return (
            <Card 
              key={report.id}
              className={cn(
                "transition-all duration-300 hover:shadow-lg group",
                isActive ? "cursor-pointer hover:scale-105" : "opacity-75"
              )}
              onClick={() => handleReportClick(report)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className={cn(
                    "p-3 rounded-lg bg-gradient-to-r",
                    report.color,
                    "text-white"
                  )}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  {getStatusBadge(report.status)}
                </div>
                
                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {report.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {report.description}
                </p>
                
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    الميزات الرئيسية
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {report.features.map((feature, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs bg-gray-50"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {isActive && (
                  <Button 
                    className="w-full mt-4 group-hover:bg-blue-600 transition-colors"
                    size="sm"
                  >
                    عرض التقرير
                    <ChevronRight className="w-4 h-4 mr-2" />
                  </Button>
                )}
                
                {!isActive && (
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500">قريباً</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features Section */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-900">
            مميزات التقارير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">رسوم بيانية تفاعلية</h3>
              <p className="text-sm text-gray-600">عرض البيانات بأشكال بصرية واضحة</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">تصدير متقدم</h3>
              <p className="text-sm text-gray-600">تصدير إلى Excel وPDF مع التنسيق</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">فلاتر ذكية</h3>
              <p className="text-sm text-gray-600">فلترة حسب الفترة والفروع والموظفين</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">مقارنة الفترات</h3>
              <p className="text-sm text-gray-600">مقارنة الأداء بين فترات مختلفة</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}