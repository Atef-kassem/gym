import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
import { useGetAllBranchesQuery } from "@/services/branchesApi";
import {
  Plus, Save, Search, Edit, Trash2, TrendingUp,
  Filter, Download, Activity, Target, Calendar,
  CheckCircle, XCircle, User, Award, BarChart3
} from "lucide-react";

const ProgressTracking = () => {
  const { toast } = useToast();
  const { data: branchesData } = useGetAllBranchesQuery(undefined as any);
  const branches = Array.isArray(branchesData?.data) ? branchesData.data : [];

  const [progressRecords, setProgressRecords] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMember, setFilterMember] = useState<string>("all");
  const [filterProgram, setFilterProgram] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const [formData, setFormData] = useState({
    memberName: "",
    programName: "",
    date: "",
    weight: "",
    bodyFat: "",
    muscleMass: "",
    measurements: {
      chest: "",
      waist: "",
      hips: "",
      arms: "",
      thighs: ""
    },
    performance: {
      maxBench: "",
      maxSquat: "",
      maxDeadlift: "",
      maxRun: ""
    },
    notes: ""
  });

  const [dateInput, setDateInput] = useState("");

  // تحويل التاريخ من dd/mm/yyyy إلى yyyy-mm-dd
  const convertDateToISO = (dateStr: string): string => {
    if (!dateStr) return "";
    const parts = dateStr.split("/");
    if (parts.length !== 3) return "";
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  // تحويل التاريخ من yyyy-mm-dd إلى dd/mm/yyyy
  const convertDateFromISO = (dateStr: string): string => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return "";
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  };

  // فلترة السجلات
  const filteredRecords = useMemo(() => {
    return progressRecords.filter(record => {
      const matchesSearch = !searchQuery ||
        record.memberName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.programName?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesMember = filterMember === "all" || record.memberName === filterMember;
      const matchesProgram = filterProgram === "all" || record.programName === filterProgram;
      
      return matchesSearch && matchesMember && matchesProgram;
    });
  }, [progressRecords, searchQuery, filterMember, filterProgram]);

  // إحصائيات
  const stats = useMemo(() => {
    const total = progressRecords.length;
    const thisMonth = progressRecords.filter(r => {
      if (!r.date) return false;
      const recordDate = new Date(r.date);
      const now = new Date();
      return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
    }).length;
    const avgWeightLoss = progressRecords.length > 0 
      ? progressRecords.reduce((sum, r) => sum + (parseFloat(r.weight) || 0), 0) / progressRecords.length
      : 0;

    return { total, thisMonth, avgWeightLoss };
  }, [progressRecords]);

  const members = Array.from(new Set(progressRecords.map(r => r.memberName)));
  const programs = Array.from(new Set(progressRecords.map(r => r.programName)));

  const handleAdd = () => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
    
    setFormData({
      memberName: "",
      programName: "",
      date: "",
      weight: "",
      bodyFat: "",
      muscleMass: "",
      measurements: {
        chest: "",
        waist: "",
        hips: "",
        arms: "",
        thighs: ""
      },
      performance: {
        maxBench: "",
        maxSquat: "",
        maxDeadlift: "",
        maxRun: ""
      },
      notes: ""
    });
    setDateInput(formattedDate);
    setIsAddDialogOpen(true);
  };

  const handleEdit = (record: any) => {
    setSelectedRecord(record);
    setFormData({
      memberName: record.memberName || "",
      programName: record.programName || "",
      date: record.date || "",
      weight: record.weight || "",
      bodyFat: record.bodyFat || "",
      muscleMass: record.muscleMass || "",
      measurements: record.measurements || {
        chest: "",
        waist: "",
        hips: "",
        arms: "",
        thighs: ""
      },
      performance: record.performance || {
        maxBench: "",
        maxSquat: "",
        maxDeadlift: "",
        maxRun: ""
      },
      notes: record.notes || ""
    });
    if (record.date) {
      setDateInput(record.date.includes('/') ? record.date : convertDateFromISO(record.date));
    }
    setIsEditDialogOpen(true);
  };

  const handleDelete = (record: any) => {
    setSelectedRecord(record);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.memberName || !formData.programName || !formData.date) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const isoDate = convertDateToISO(dateInput);
    const newRecord = {
      id: progressRecords.length + 1,
      ...formData,
      date: isoDate || dateInput
    };

    setProgressRecords([...progressRecords, newRecord]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة سجل التقدم بنجاح"
    });

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
    setFormData({
      memberName: "",
      programName: "",
      date: "",
      weight: "",
      bodyFat: "",
      muscleMass: "",
      measurements: {
        chest: "",
        waist: "",
        hips: "",
        arms: "",
        thighs: ""
      },
      performance: {
        maxBench: "",
        maxSquat: "",
        maxDeadlift: "",
        maxRun: ""
      },
      notes: ""
    });
    setDateInput(formattedDate);
  };

  const handleSaveEdit = () => {
    if (!formData.memberName || !formData.programName || !formData.date) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const isoDate = convertDateToISO(dateInput);
    setProgressRecords(progressRecords.map(r =>
      r.id === selectedRecord.id
        ? {
          ...formData,
          date: isoDate || dateInput
        }
        : r
    ));

    setIsEditDialogOpen(false);
    setSelectedRecord(null);
    toast({
      title: "نجح",
      description: "تم تحديث سجل التقدم بنجاح"
    });
  };

  const handleConfirmDelete = () => {
    setProgressRecords(progressRecords.filter(r => r.id !== selectedRecord.id));
    setIsDeleteDialogOpen(false);
    setSelectedRecord(null);
    toast({
      title: "نجح",
      description: "تم حذف سجل التقدم بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان والبحث */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تتبع التقدم</h1>
            <p className="text-gray-600 mt-1">تتبع تقدم الأعضاء في البرامج التدريبية</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن سجل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              فلتر
              {(filterMember !== "all" || filterProgram !== "all") && (
                <Badge className="bg-blue-500">{[filterMember, filterProgram].filter(f => f !== "all").length}</Badge>
              )}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة سجل جديد
            </Button>
          </div>
        </div>

        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي السجلات</span>
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>هذا الشهر</span>
                <Calendar className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.thisMonth}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>متوسط الوزن</span>
                <Target className="w-5 h-5 text-orange-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.avgWeightLoss.toFixed(1)}</div>
              <p className="text-sm text-gray-500 mt-1">كجم</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الأعضاء النشطون</span>
                <User className="w-5 h-5 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{members.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* الفلاتر */}
        {showFilters && (
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  الفلاتر
                </span>
                <Button variant="ghost" size="sm" onClick={() => {
                  setFilterMember("all");
                  setFilterProgram("all");
                }}>
                  <XCircle className="w-4 h-4 ml-1" />
                  إعادة تعيين
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>العضو</Label>
                  <Select value={filterMember} onValueChange={setFilterMember}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الأعضاء" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأعضاء</SelectItem>
                      {members.map(member => (
                        <SelectItem key={member} value={member}>{member}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>البرنامج</Label>
                  <Select value={filterProgram} onValueChange={setFilterProgram}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع البرامج" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع البرامج</SelectItem>
                      {programs.map(program => (
                        <SelectItem key={program} value={program}>{program}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* عرض الجدول */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                سجلات التقدم ({filteredRecords.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">التاريخ</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">اسم العضو</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">البرنامج</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الوزن (كجم)</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">نسبة الدهون (%)</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الكتلة العضلية (كجم)</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        {record.date ? (record.date.includes('/') ? record.date : convertDateFromISO(record.date)) : "-"}
                      </td>
                      <td className="py-3 px-4 font-semibold whitespace-nowrap">{record.memberName}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">{record.programName}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">{record.weight || "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">{record.bodyFat || "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">{record.muscleMass || "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(record)} title="تعديل" className="hover:bg-blue-50">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(record)} title="حذف" className="hover:bg-red-50">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredRecords.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>لا توجد نتائج مطابقة</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog إضافة سجل جديد */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة سجل تقدم جديد</DialogTitle>
              <DialogDescription>
                أدخل بيانات سجل التقدم الجديد
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">التاريخ *</Label>
                  <Input
                    id="date"
                    value={dateInput}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length >= 2) {
                        value = value.substring(0, 2) + "/" + value.substring(2);
                      }
                      if (value.length >= 5) {
                        value = value.substring(0, 5) + "/" + value.substring(5, 9);
                      }
                      setDateInput(value);
                      const isoDate = convertDateToISO(value);
                      if (isoDate) {
                        setFormData({ ...formData, date: isoDate });
                      }
                    }}
                    placeholder="dd/mm/yyyy"
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memberName">اسم العضو *</Label>
                  <Input
                    id="memberName"
                    value={formData.memberName}
                    onChange={(e) => setFormData({ ...formData, memberName: e.target.value })}
                    placeholder="أدخل اسم العضو"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="programName">البرنامج *</Label>
                  <Input
                    id="programName"
                    value={formData.programName}
                    onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                    placeholder="أدخل اسم البرنامج"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">الوزن (كجم)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bodyFat">نسبة الدهون (%)</Label>
                  <Input
                    id="bodyFat"
                    type="number"
                    value={formData.bodyFat}
                    onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                    placeholder="15"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="muscleMass">الكتلة العضلية (كجم)</Label>
                  <Input
                    id="muscleMass"
                    type="number"
                    value={formData.muscleMass}
                    onChange={(e) => setFormData({ ...formData, muscleMass: e.target.value })}
                    placeholder="50"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">القياسات (سم)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chest">الصدر</Label>
                    <Input
                      id="chest"
                      type="number"
                      value={formData.measurements.chest}
                      onChange={(e) => setFormData({
                        ...formData,
                        measurements: { ...formData.measurements, chest: e.target.value }
                      })}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waist">الخصر</Label>
                    <Input
                      id="waist"
                      type="number"
                      value={formData.measurements.waist}
                      onChange={(e) => setFormData({
                        ...formData,
                        measurements: { ...formData.measurements, waist: e.target.value }
                      })}
                      placeholder="80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hips">الأرداف</Label>
                    <Input
                      id="hips"
                      type="number"
                      value={formData.measurements.hips}
                      onChange={(e) => setFormData({
                        ...formData,
                        measurements: { ...formData.measurements, hips: e.target.value }
                      })}
                      placeholder="95"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arms">الذراعين</Label>
                    <Input
                      id="arms"
                      type="number"
                      value={formData.measurements.arms}
                      onChange={(e) => setFormData({
                        ...formData,
                        measurements: { ...formData.measurements, arms: e.target.value }
                      })}
                      placeholder="35"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thighs">الفخذين</Label>
                    <Input
                      id="thighs"
                      type="number"
                      value={formData.measurements.thighs}
                      onChange={(e) => setFormData({
                        ...formData,
                        measurements: { ...formData.measurements, thighs: e.target.value }
                      })}
                      placeholder="60"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">الأداء</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxBench">أقصى رفع للصدر (كجم)</Label>
                    <Input
                      id="maxBench"
                      type="number"
                      value={formData.performance.maxBench}
                      onChange={(e) => setFormData({
                        ...formData,
                        performance: { ...formData.performance, maxBench: e.target.value }
                      })}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxSquat">أقصى قرفصاء (كجم)</Label>
                    <Input
                      id="maxSquat"
                      type="number"
                      value={formData.performance.maxSquat}
                      onChange={(e) => setFormData({
                        ...formData,
                        performance: { ...formData.performance, maxSquat: e.target.value }
                      })}
                      placeholder="120"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxDeadlift">أقصى رفعة ميتة (كجم)</Label>
                    <Input
                      id="maxDeadlift"
                      type="number"
                      value={formData.performance.maxDeadlift}
                      onChange={(e) => setFormData({
                        ...formData,
                        performance: { ...formData.performance, maxDeadlift: e.target.value }
                      })}
                      placeholder="150"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxRun">أقصى جري (كم)</Label>
                    <Input
                      id="maxRun"
                      type="number"
                      value={formData.performance.maxRun}
                      onChange={(e) => setFormData({
                        ...formData,
                        performance: { ...formData.performance, maxRun: e.target.value }
                      })}
                      placeholder="5"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="أدخل ملاحظات إضافية"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveAdd} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تعديل سجل */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل سجل التقدم</DialogTitle>
              <DialogDescription>
                قم بتعديل بيانات سجل التقدم
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* نفس الحقول كما في الإضافة */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">التاريخ *</Label>
                  <Input
                    id="edit-date"
                    value={dateInput}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length >= 2) {
                        value = value.substring(0, 2) + "/" + value.substring(2);
                      }
                      if (value.length >= 5) {
                        value = value.substring(0, 5) + "/" + value.substring(5, 9);
                      }
                      setDateInput(value);
                      const isoDate = convertDateToISO(value);
                      if (isoDate) {
                        setFormData({ ...formData, date: isoDate });
                      }
                    }}
                    placeholder="dd/mm/yyyy"
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-memberName">اسم العضو *</Label>
                  <Input
                    id="edit-memberName"
                    value={formData.memberName}
                    onChange={(e) => setFormData({ ...formData, memberName: e.target.value })}
                    placeholder="أدخل اسم العضو"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-programName">البرنامج *</Label>
                  <Input
                    id="edit-programName"
                    value={formData.programName}
                    onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                    placeholder="أدخل اسم البرنامج"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-weight">الوزن (كجم)</Label>
                  <Input
                    id="edit-weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-bodyFat">نسبة الدهون (%)</Label>
                  <Input
                    id="edit-bodyFat"
                    type="number"
                    value={formData.bodyFat}
                    onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                    placeholder="15"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-muscleMass">الكتلة العضلية (كجم)</Label>
                  <Input
                    id="edit-muscleMass"
                    type="number"
                    value={formData.muscleMass}
                    onChange={(e) => setFormData({ ...formData, muscleMass: e.target.value })}
                    placeholder="50"
                  />
                </div>
              </div>

              {/* باقي الحقول مشابهة للإضافة */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">القياسات (سم)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-chest">الصدر</Label>
                    <Input
                      id="edit-chest"
                      type="number"
                      value={formData.measurements.chest}
                      onChange={(e) => setFormData({
                        ...formData,
                        measurements: { ...formData.measurements, chest: e.target.value }
                      })}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-waist">الخصر</Label>
                    <Input
                      id="edit-waist"
                      type="number"
                      value={formData.measurements.waist}
                      onChange={(e) => setFormData({
                        ...formData,
                        measurements: { ...formData.measurements, waist: e.target.value }
                      })}
                      placeholder="80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-hips">الأرداف</Label>
                    <Input
                      id="edit-hips"
                      type="number"
                      value={formData.measurements.hips}
                      onChange={(e) => setFormData({
                        ...formData,
                        measurements: { ...formData.measurements, hips: e.target.value }
                      })}
                      placeholder="95"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-arms">الذراعين</Label>
                    <Input
                      id="edit-arms"
                      type="number"
                      value={formData.measurements.arms}
                      onChange={(e) => setFormData({
                        ...formData,
                        measurements: { ...formData.measurements, arms: e.target.value }
                      })}
                      placeholder="35"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-thighs">الفخذين</Label>
                    <Input
                      id="edit-thighs"
                      type="number"
                      value={formData.measurements.thighs}
                      onChange={(e) => setFormData({
                        ...formData,
                        measurements: { ...formData.measurements, thighs: e.target.value }
                      })}
                      placeholder="60"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">الأداء</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-maxBench">أقصى رفع للصدر (كجم)</Label>
                    <Input
                      id="edit-maxBench"
                      type="number"
                      value={formData.performance.maxBench}
                      onChange={(e) => setFormData({
                        ...formData,
                        performance: { ...formData.performance, maxBench: e.target.value }
                      })}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-maxSquat">أقصى قرفصاء (كجم)</Label>
                    <Input
                      id="edit-maxSquat"
                      type="number"
                      value={formData.performance.maxSquat}
                      onChange={(e) => setFormData({
                        ...formData,
                        performance: { ...formData.performance, maxSquat: e.target.value }
                      })}
                      placeholder="120"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-maxDeadlift">أقصى رفعة ميتة (كجم)</Label>
                    <Input
                      id="edit-maxDeadlift"
                      type="number"
                      value={formData.performance.maxDeadlift}
                      onChange={(e) => setFormData({
                        ...formData,
                        performance: { ...formData.performance, maxDeadlift: e.target.value }
                      })}
                      placeholder="150"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-maxRun">أقصى جري (كم)</Label>
                    <Input
                      id="edit-maxRun"
                      type="number"
                      value={formData.performance.maxRun}
                      onChange={(e) => setFormData({
                        ...formData,
                        performance: { ...formData.performance, maxRun: e.target.value }
                      })}
                      placeholder="5"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">ملاحظات</Label>
                <Input
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="أدخل ملاحظات إضافية"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog حذف سجل */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من حذف سجل {selectedRecord?.memberName}؟ هذا الإجراء لا يمكن التراجع عنه.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                إلغاء
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                <Trash2 className="w-4 h-4 ml-2" />
                حذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProgressTracking;

