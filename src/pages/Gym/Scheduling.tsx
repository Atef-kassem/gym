import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Calendar, Plus, Clock, Users, Save, Edit, Trash2,
  Loader2, BookOpen
} from "lucide-react";
import {
  useGetAllClassesQuery,
  useGetClassStatisticsQuery,
} from "@/services/classesApi";
import { useBranch } from "@/contexts/BranchContext";

interface GymClass {
  id: number;
  className: string;
  trainerId: number;
  branchId: number;
  classDate: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  currentEnrollments: number;
  status: string;
  trainer?: {
    id: number;
    name: string;
  };
}

const Scheduling = () => {
  const { selectedBranch } = useBranch();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [trainerFilter, setTrainerFilter] = useState<string>("all");
  
  const { toast } = useToast();
  
  // Fetch classes
  const { data: classesData, isLoading: isLoadingClasses } = useGetAllClassesQuery({
    branchId: selectedBranch?.id,
    startDate: dateFilter || undefined,
    endDate: dateFilter || undefined,
    trainerId: trainerFilter !== "all" ? trainerFilter : undefined,
    search: searchQuery || undefined,
  });
  
  // Fetch statistics
  const { data: statisticsData } = useGetClassStatisticsQuery({
    branchId: selectedBranch?.id,
  });
  
  // Normalize data
  const classes = useMemo(() => {
    if (!classesData) return [];
    if (Array.isArray(classesData)) return classesData;
    if (classesData.data?.classes && Array.isArray(classesData.data.classes)) return classesData.data.classes;
    if (classesData.data && Array.isArray(classesData.data)) return classesData.data;
    return [];
  }, [classesData]);
  
  const statistics = useMemo(() => {
    if (!statisticsData) return null;
    return statisticsData.data?.statistics || statisticsData.statistics || null;
  }, [statisticsData]);
  
  // Group classes by date
  const classesByDate = useMemo(() => {
    const grouped: Record<string, GymClass[]> = {};
    classes.forEach((cls: GymClass) => {
      if (!grouped[cls.classDate]) {
        grouped[cls.classDate] = [];
      }
      grouped[cls.classDate].push(cls);
    });
    
    // Sort dates
    const sortedDates = Object.keys(grouped).sort();
    const result: Record<string, GymClass[]> = {};
    sortedDates.forEach(date => {
      result[date] = grouped[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    return result;
  }, [classes]);
  
  // Get unique trainers
  const trainers = useMemo(() => {
    const trainerSet = new Set(classes.map((c: GymClass) => c.trainer?.name).filter(Boolean));
    return Array.from(trainerSet);
  }, [classes]);
  
  // Filter classes
  const filteredClassesByDate = useMemo(() => {
    if (!dateFilter) return classesByDate;
    
    return Object.keys(classesByDate)
      .filter(date => date === dateFilter)
      .reduce((acc, date) => {
        acc[date] = classesByDate[date];
        return acc;
      }, {} as Record<string, GymClass[]>);
  }, [classesByDate, dateFilter]);
  
  if (isLoadingClasses) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الجدولة</h1>
            <p className="text-gray-600 mt-1">إدارة الجداول الزمنية والمواعيد</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>بحث</Label>
                <Input
                  placeholder="ابحث عن حصة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>التاريخ</Label>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>المدرب</Label>
                <Select value={trainerFilter} onValueChange={setTrainerFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="جميع المدربين" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المدربين</SelectItem>
                    {trainers.map((trainer) => (
                      <SelectItem key={trainer} value={trainer}>
                        {trainer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي الحصص</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {statistics?.totalClasses || classes.length}
              </div>
              <p className="text-sm text-gray-500 mt-1">حصة</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الحصص المجدولة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {statistics?.scheduledClasses || classes.filter((c: GymClass) => c.status === 'scheduled').length}
              </div>
              <p className="text-sm text-gray-500 mt-1">حصة</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي الحجوزات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {statistics?.totalEnrollments || classes.reduce((sum: number, c: GymClass) => sum + (c.currentEnrollments || 0), 0)}
              </div>
              <p className="text-sm text-gray-500 mt-1">حجز</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">معدل الإشغال</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {statistics?.attendanceRate?.toFixed(1) || 
                  (classes.length > 0 
                    ? Math.round((classes.reduce((sum: number, c: GymClass) => sum + (c.currentEnrollments || 0), 0) / classes.reduce((sum: number, c: GymClass) => sum + (c.maxCapacity || 1), 1)) * 100)
                    : 0)}%
              </div>
              <p className="text-sm text-gray-500 mt-1">نسبة الإشغال</p>
            </CardContent>
          </Card>
        </div>

        {/* Schedule by Date */}
        <div className="space-y-6">
          {Object.keys(filteredClassesByDate).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                لا توجد حصص في الجدول
              </CardContent>
            </Card>
          ) : (
            Object.entries(filteredClassesByDate).map(([date, dateClasses]) => (
              <Card key={date}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {new Date(date).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dateClasses.map((classRecord: GymClass) => (
                      <div
                        key={classRecord.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{classRecord.className}</h4>
                            <Badge variant="outline">{classRecord.trainer?.name || "غير محدد"}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{classRecord.startTime} - {classRecord.endTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{classRecord.currentEnrollments}/{classRecord.maxCapacity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Scheduling;
