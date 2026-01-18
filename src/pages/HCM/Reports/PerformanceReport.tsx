import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  ArrowLeft,
  Download,
  Star,
  Target,
  Award,
  Zap,
  CheckCircle,
  AlertTriangle,
  ThumbsUp
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line
} from 'recharts';

interface PerformanceRecord {
  employeeId: string;
  name: string;
  department: string;
  position: string;
  overallScore: number;
  goalsAchieved: number;
  totalGoals: number;
  skills: {
    technical: number;
    communication: number;
    leadership: number;
    teamwork: number;
    initiative: number;
  };
  rating: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement';
  lastReviewDate: string;
  nextReviewDate: string;
  manager: string;
}

export default function PerformanceReport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('year');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock data
  const performanceData: PerformanceRecord[] = [
    {
      employeeId: 'EMP001',
      name: 'أحمد محمد العتيبي',
      department: 'التقنية',
      position: 'مطور برمجيات أول',
      overallScore: 4.2,
      goalsAchieved: 8,
      totalGoals: 10,
      skills: {
        technical: 90,
        communication: 85,
        leadership: 75,
        teamwork: 88,
        initiative: 82
      },
      rating: 'excellent',
      lastReviewDate: '2024-01-15',
      nextReviewDate: '2024-07-15',
      manager: 'خالد السعد'
    },
    {
      employeeId: 'EMP002',
      name: 'فاطمة علي الأحمدي',
      department: 'المبيعات',
      position: 'مسؤولة المبيعات',
      overallScore: 3.8,
      goalsAchieved: 7,
      totalGoals: 9,
      skills: {
        technical: 70,
        communication: 95,
        leadership: 80,
        teamwork: 90,
        initiative: 85
      },
      rating: 'good',
      lastReviewDate: '2024-02-01',
      nextReviewDate: '2024-08-01',
      manager: 'سعد الملك'
    },
    {
      employeeId: 'EMP003',
      name: 'محمد سعد القحطاني',
      department: 'العمليات',
      position: 'مدير العمليات',
      overallScore: 4.5,
      goalsAchieved: 9,
      totalGoals: 10,
      skills: {
        technical: 85,
        communication: 90,
        leadership: 95,
        teamwork: 88,
        initiative: 92
      },
      rating: 'excellent',
      lastReviewDate: '2024-01-20',
      nextReviewDate: '2024-07-20',
      manager: 'عبدالله الراشد'
    }
  ];

  const departmentPerformance = [
    { department: 'التقنية', average: 4.2, employees: 38 },
    { department: 'المبيعات', average: 3.8, employees: 89 },
    { department: 'العمليات', average: 4.1, employees: 124 },
    { department: 'المالية', average: 3.9, employees: 45 },
    { department: 'الموارد البشرية', average: 4.0, employees: 28 }
  ];

  const performanceTrend = [
    { quarter: 'Q1 2023', average: 3.6 },
    { quarter: 'Q2 2023', average: 3.8 },
    { quarter: 'Q3 2023', average: 3.9 },
    { quarter: 'Q4 2023', average: 4.0 },
    { quarter: 'Q1 2024', average: 4.1 },
    { quarter: 'Q2 2024', average: 4.2 }
  ];

  const skillsAverage = {
    technical: 82,
    communication: 90,
    leadership: 83,
    teamwork: 89,
    initiative: 86
  };

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800"><Star className="h-3 w-3 mr-1" />ممتاز</Badge>;
      case 'good':
        return <Badge className="bg-blue-100 text-blue-800"><ThumbsUp className="h-3 w-3 mr-1" />جيد</Badge>;
      case 'satisfactory':
        return <Badge className="bg-yellow-100 text-yellow-800"><CheckCircle className="h-3 w-3 mr-1" />مرضي</Badge>;
      case 'needs_improvement':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />يحتاج تحسين</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  const handleExportPerformance = () => {
    toast({
      title: "تصدير تقرير الأداء",
      description: "جاري تصدير تقرير الأداء بصيغة Excel...",
    });
  };

  const filteredPerformance = selectedDepartment === 'all' 
    ? performanceData 
    : performanceData.filter(p => p.department === selectedDepartment);

  const averageScore = filteredPerformance.reduce((sum, p) => sum + p.overallScore, 0) / filteredPerformance.length;
  const excellentCount = filteredPerformance.filter(p => p.rating === 'excellent').length;
  const totalGoalsAchieved = filteredPerformance.reduce((sum, p) => sum + p.goalsAchieved, 0);
  const totalGoals = filteredPerformance.reduce((sum, p) => sum + p.totalGoals, 0);

  const radarData = [
    { skill: 'التقني', value: skillsAverage.technical },
    { skill: 'التواصل', value: skillsAverage.communication },
    { skill: 'القيادة', value: skillsAverage.leadership },
    { skill: 'العمل الجماعي', value: skillsAverage.teamwork },
    { skill: 'المبادرة', value: skillsAverage.initiative }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/hcm/reports')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة للتقارير
            </Button>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-3xl font-bold">تقرير تقييم الأداء</h1>
                <p className="text-muted-foreground">تحليل شامل لأداء الموظفين والمهارات</p>
              </div>
            </div>
          </div>
          <Button onClick={handleExportPerformance} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            تصدير تقرير الأداء
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">متوسط الأداء العام</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {averageScore.toFixed(1)}/5
                  </p>
                  <p className="text-sm text-blue-600">من 5 نقاط</p>
                </div>
                <Star className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">التقييم الممتاز</p>
                  <p className="text-2xl font-bold text-green-600">{excellentCount}</p>
                  <p className="text-sm text-green-600">موظف</p>
                </div>
                <Award className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">الأهداف المحققة</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {Math.round((totalGoalsAchieved / totalGoals) * 100)}%
                  </p>
                  <p className="text-sm text-emerald-600">{totalGoalsAchieved} من {totalGoals}</p>
                </div>
                <Target className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">التقييمات المكتملة</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {filteredPerformance.length}
                  </p>
                  <p className="text-sm text-purple-600">تقييم</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="الفترة الزمنية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quarter">هذا الربع</SelectItem>
              <SelectItem value="year">هذا العام</SelectItem>
              <SelectItem value="all">جميع الفترات</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="القسم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأقسام</SelectItem>
              <SelectItem value="التقنية">التقنية</SelectItem>
              <SelectItem value="المبيعات">المبيعات</SelectItem>
              <SelectItem value="العمليات">العمليات</SelectItem>
              <SelectItem value="المالية">المالية</SelectItem>
              <SelectItem value="الموارد البشرية">الموارد البشرية</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                متوسط المهارات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    name="المهارات"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                اتجاه الأداء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceTrend}>
                  <XAxis dataKey="quarter" />
                  <YAxis domain={[0, 5]} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="متوسط الأداء"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              الأداء حسب القسم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentPerformance}>
                <XAxis dataKey="department" />
                <YAxis domain={[0, 5]} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Bar dataKey="average" fill="#8b5cf6" name="متوسط الأداء" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل تقييم الأداء</CardTitle>
            <CardDescription>
              قائمة شاملة بتقييمات أداء الموظفين ومهاراتهم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الموظف</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>المنصب</TableHead>
                  <TableHead>النتيجة الإجمالية</TableHead>
                  <TableHead>الأهداف المحققة</TableHead>
                  <TableHead>المهارات التقنية</TableHead>
                  <TableHead>التواصل</TableHead>
                  <TableHead>القيادة</TableHead>
                  <TableHead>التقييم</TableHead>
                  <TableHead>المدير المسؤول</TableHead>
                  <TableHead>التقييم القادم</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPerformance.map((record) => (
                  <TableRow key={record.employeeId}>
                    <TableCell className="font-medium">{record.employeeId}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.department}</Badge>
                    </TableCell>
                    <TableCell>{record.position}</TableCell>
                    <TableCell className="font-bold text-blue-600">
                      {record.overallScore}/5
                    </TableCell>
                    <TableCell className="text-green-600">
                      {record.goalsAchieved}/{record.totalGoals}
                    </TableCell>
                    <TableCell>{record.skills.technical}%</TableCell>
                    <TableCell>{record.skills.communication}%</TableCell>
                    <TableCell>{record.skills.leadership}%</TableCell>
                    <TableCell>{getRatingBadge(record.rating)}</TableCell>
                    <TableCell>{record.manager}</TableCell>
                    <TableCell>{record.nextReviewDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}