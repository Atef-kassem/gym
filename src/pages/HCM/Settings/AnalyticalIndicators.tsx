import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Plus, Edit, Trash2, ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AnalyticalIndicators = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [indicators] = useState([
    { 
      id: "1", 
      name: "معدل دوران الموظفين", 
      category: "الاستقرار الوظيفي",
      value: 12.5,
      target: 10,
      unit: "%",
      trend: "up",
      status: "warning"
    },
    { 
      id: "2", 
      name: "معدل الحضور", 
      category: "الحضور والغياب",
      value: 94.2,
      target: 95,
      unit: "%",
      trend: "down",
      status: "good"
    },
    { 
      id: "3", 
      name: "متوسط تقييم الأداء", 
      category: "الأداء",
      value: 4.1,
      target: 4.5,
      unit: "/5",
      trend: "up",
      status: "good"
    },
    { 
      id: "4", 
      name: "مؤشر رضا الموظفين", 
      category: "الرضا الوظيفي",
      value: 78,
      target: 85,
      unit: "%",
      trend: "stable",
      status: "warning"
    },
    { 
      id: "5", 
      name: "معدل التدريب", 
      category: "التطوير",
      value: 24,
      target: 30,
      unit: "ساعة/سنة",
      trend: "up",
      status: "good"
    }
  ]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-green-600";
      case "warning": return "text-yellow-600";
      case "danger": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getProgressValue = (value: number, target: number) => {
    return Math.min((value / target) * 100, 100);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/hcm/settings')}
            className="ml-2"
          >
            <ArrowLeft className="h-4 w-4 ml-1" />
            رجوع للإعدادات
          </Button>
          <BarChart3 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">المؤشرات التحليلية</h1>
            <p className="text-muted-foreground">مراقبة وتحليل مؤشرات الأداء الرئيسية</p>
          </div>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 ml-2" />
          إضافة مؤشر
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">إجمالي المؤشرات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{indicators.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">المؤشرات الجيدة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {indicators.filter(i => i.status === 'good').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">تحتاج انتباه</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {indicators.filter(i => i.status === 'warning').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">متوسط الإنجاز</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(indicators.reduce((acc, ind) => acc + getProgressValue(ind.value, ind.target), 0) / indicators.length)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>المؤشرات التحليلية</CardTitle>
          <CardDescription>مراقبة الأداء والاتجاهات</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم المؤشر</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>القيمة الحالية</TableHead>
                <TableHead>الهدف</TableHead>
                <TableHead>الإنجاز</TableHead>
                <TableHead>الاتجاه</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {indicators.map((indicator) => (
                <TableRow key={indicator.id}>
                  <TableCell className="font-medium">{indicator.name}</TableCell>
                  <TableCell>{indicator.category}</TableCell>
                  <TableCell>
                    <span className={getStatusColor(indicator.status)}>
                      {indicator.value}{indicator.unit}
                    </span>
                  </TableCell>
                  <TableCell>{indicator.target}{indicator.unit}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={getProgressValue(indicator.value, indicator.target)} 
                        className="w-20"
                      />
                      <span className="text-sm">
                        {Math.round(getProgressValue(indicator.value, indicator.target))}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(indicator.trend)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      indicator.status === 'good' ? 'default' : 
                      indicator.status === 'warning' ? 'secondary' : 'destructive'
                    }>
                      {indicator.status === 'good' ? 'جيد' : 
                       indicator.status === 'warning' ? 'يحتاج انتباه' : 'خطر'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
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
    </div>
  );
};

export default AnalyticalIndicators;