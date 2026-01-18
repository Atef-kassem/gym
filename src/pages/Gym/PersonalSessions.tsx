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
  Loader2, User, UserCheck
} from "lucide-react";
import {
  useGetAllClassesQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
  useEnrollMemberMutation,
  useRemoveMemberMutation,
} from "@/services/classesApi";
import {
  useGetAllTrainersQuery,
} from "@/services/trainersApi";
import {
  useGetAllMembersQuery,
} from "@/services/membersApi";
import { useBranch } from "@/contexts/BranchContext";

interface GymClass {
  id: number;
  className: string;
  description: string | null;
  trainerId: number;
  branchId: number;
  classDate: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  currentEnrollments: number;
  price: number;
  status: string;
  notes: string | null;
  trainer?: {
    id: number;
    name: string;
    phone: string;
    email: string;
  };
  enrollments?: Array<{
    id: number;
    memberId: number;
    attendanceStatus: string;
    enrollmentDate: string;
    member?: {
      id: number;
      name: string;
      memberCode: string;
      phone: string;
    };
  }>;
}

const PersonalSessions = () => {
  const { selectedBranch } = useBranch();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<GymClass | null>(null);
  
  const { toast } = useToast();
  
  // Fetch personal sessions (classes with maxCapacity = 1)
  const { data: classesData, isLoading: isLoadingClasses, refetch: refetchClasses } = useGetAllClassesQuery({
    branchId: selectedBranch?.id,
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: searchQuery || undefined,
  });
  
  // Fetch trainers
  const { data: trainersData, isLoading: isLoadingTrainers } = useGetAllTrainersQuery({});
  
  // Fetch members
  const { data: membersData, isLoading: isLoadingMembers } = useGetAllMembersQuery({
    branchId: selectedBranch?.id,
  });
  
  // Mutations
  const [createClass, { isLoading: isCreating }] = useCreateClassMutation();
  const [updateClass, { isLoading: isUpdating }] = useUpdateClassMutation();
  const [deleteClass, { isLoading: isDeleting }] = useDeleteClassMutation();
  const [enrollMember] = useEnrollMemberMutation();
  const [removeMember] = useRemoveMemberMutation();
  
  // Form state
  const [formData, setFormData] = useState({
    className: "",
    description: "",
    trainerId: "",
    branchId: selectedBranch?.id?.toString() || "",
    classDate: new Date().toISOString().split('T')[0],
    startTime: "",
    endTime: "",
    price: "0",
    notes: "",
    memberId: "",
  });
  
  // Normalize data
  const allClasses = useMemo(() => {
    if (!classesData) return [];
    if (Array.isArray(classesData)) return classesData;
    if (classesData.data?.classes && Array.isArray(classesData.data.classes)) return classesData.data.classes;
    if (classesData.data && Array.isArray(classesData.data)) return classesData.data;
    return [];
  }, [classesData]);
  
  // Filter for personal sessions (maxCapacity = 1)
  const personalSessions = useMemo(() => {
    return allClasses.filter((cls: GymClass) => cls.maxCapacity === 1);
  }, [allClasses]);
  
  const trainers = useMemo(() => {
    if (!trainersData) return [];
    if (Array.isArray(trainersData)) return trainersData;
    if (trainersData.data && Array.isArray(trainersData.data)) return trainersData.data;
    if (trainersData.success && trainersData.data && Array.isArray(trainersData.data)) return trainersData.data;
    return [];
  }, [trainersData]);
  
  const members = useMemo(() => {
    if (!membersData) return [];
    if (Array.isArray(membersData)) return membersData;
    if (membersData.data && Array.isArray(membersData.data)) return membersData.data;
    if (membersData.success && membersData.data && Array.isArray(membersData.data)) return membersData.data;
    return [];
  }, [membersData]);
  
  // Filter sessions
  const filteredSessions = useMemo(() => {
    if (!searchQuery) return personalSessions;
    const query = searchQuery.toLowerCase();
    return personalSessions.filter((session: GymClass) => 
      session.className.toLowerCase().includes(query) ||
      session.trainer?.name?.toLowerCase().includes(query) ||
      session.enrollments?.some(e => e.member?.name?.toLowerCase().includes(query))
    );
  }, [personalSessions, searchQuery]);
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: "bg-blue-500",
      ongoing: "bg-green-500",
      completed: "bg-gray-500",
      cancelled: "bg-red-500",
    };
    const labels: Record<string, string> = {
      scheduled: "مجدول",
      ongoing: "جاري",
      completed: "منتهي",
      cancelled: "ملغي",
    };
    return (
      <Badge className={colors[status] || "bg-gray-500"}>
        {labels[status] || status}
      </Badge>
    );
  };
  
  // Open dialog for creating new session
  const handleOpenDialog = () => {
    setEditingSession(null);
    setFormData({
      className: "",
      description: "",
      trainerId: "",
      branchId: selectedBranch?.id?.toString() || "",
      classDate: new Date().toISOString().split('T')[0],
      startTime: "",
      endTime: "",
      price: "0",
      notes: "",
      memberId: "",
    });
    setIsDialogOpen(true);
  };
  
  // Open dialog for editing session
  const handleEdit = (session: GymClass) => {
    setEditingSession(session);
    const enrollment = session.enrollments?.[0];
    setFormData({
      className: session.className,
      description: session.description || "",
      trainerId: session.trainerId.toString(),
      branchId: session.branchId.toString(),
      classDate: session.classDate,
      startTime: session.startTime,
      endTime: session.endTime,
      price: session.price.toString(),
      notes: session.notes || "",
      memberId: enrollment?.memberId.toString() || "",
    });
    setIsDialogOpen(true);
  };
  
  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الموعد الشخصي؟")) return;
    
    try {
      await deleteClass(id).unwrap();
      toast({
        title: "نجح",
        description: "تم حذف الموعد الشخصي بنجاح",
      });
      refetchClasses();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "فشل حذف الموعد",
        variant: "destructive",
      });
    }
  };
  
  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.className || !formData.trainerId || !formData.classDate || !formData.startTime || !formData.endTime || !formData.memberId) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const sessionData = {
        className: formData.className,
        description: formData.description || null,
        trainerId: parseInt(formData.trainerId),
        branchId: parseInt(formData.branchId),
        classDate: formData.classDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        maxCapacity: 1, // Personal session
        price: parseFloat(formData.price),
        notes: formData.notes || null,
        memberIds: [parseInt(formData.memberId)],
      };
      
      if (editingSession) {
        await updateClass({ id: editingSession.id, data: sessionData }).unwrap();
        toast({
          title: "نجح",
          description: "تم تحديث الموعد الشخصي بنجاح",
        });
      } else {
        await createClass(sessionData).unwrap();
        toast({
          title: "نجح",
          description: "تم إنشاء الموعد الشخصي بنجاح",
        });
      }
      
      setIsDialogOpen(false);
      refetchClasses();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "فشل حفظ الموعد",
        variant: "destructive",
      });
    }
  };
  
  if (isLoadingClasses || isLoadingTrainers || isLoadingMembers) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">المواعيد الشخصية</h1>
            <p className="text-gray-600 mt-1">إدارة المواعيد الشخصية للأعضاء مع المدربين</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleOpenDialog}>
            <Plus className="w-5 h-5 ml-2" />
            موعد شخصي جديد
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>بحث</Label>
                <Input
                  placeholder="ابحث عن موعد..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>الحالة</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="جميع الحالات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="scheduled">مجدولة</SelectItem>
                    <SelectItem value="ongoing">جارية</SelectItem>
                    <SelectItem value="completed">منتهية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي المواعيد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{personalSessions.length}</div>
              <p className="text-sm text-gray-500 mt-1">موعد</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">مواعيد اليوم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {personalSessions.filter((s: GymClass) => s.classDate === new Date().toISOString().split('T')[0]).length}
              </div>
              <p className="text-sm text-gray-500 mt-1">موعد</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الأعضاء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {new Set(personalSessions.flatMap((s: GymClass) => s.enrollments?.map(e => e.memberId) || [])).size}
              </div>
              <p className="text-sm text-gray-500 mt-1">عضو</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">المدربون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {new Set(personalSessions.map((s: GymClass) => s.trainerId)).size}
              </div>
              <p className="text-sm text-gray-500 mt-1">مدرب</p>
            </CardContent>
          </Card>
        </div>

        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              المواعيد الشخصية
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSessions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                لا توجد مواعيد شخصية
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSessions.map((session: GymClass) => {
                  const enrollment = session.enrollments?.[0];
                  return (
                    <Card key={session.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{session.className}</h3>
                              {getStatusBadge(session.status)}
                            </div>
                            {session.description && (
                              <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                              {enrollment?.member && (
                                <div className="flex items-center gap-2">
                                  <UserCheck className="w-4 h-4" />
                                  <span>{enrollment.member.name} ({enrollment.member.memberCode})</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>المدرب: {session.trainer?.name || "غير محدد"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{session.classDate}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{session.startTime} - {session.endTime}</span>
                              </div>
                            </div>
                            {session.notes && (
                              <div className="mt-2 text-sm text-gray-500">
                                <strong>ملاحظات:</strong> {session.notes}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(session)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(session.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSession ? "تعديل الموعد الشخصي" : "إضافة موعد شخصي جديد"}
              </DialogTitle>
              <DialogDescription>
                {editingSession ? "قم بتعديل بيانات الموعد الشخصي" : "أدخل بيانات الموعد الشخصي الجديد"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="className">اسم الجلسة *</Label>
                  <Input
                    id="className"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    required
                    placeholder="مثال: جلسة تدريب شخصي"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="وصف الجلسة"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trainerId">المدرب *</Label>
                    <Select
                      value={formData.trainerId || undefined}
                      onValueChange={(value) => setFormData({ ...formData, trainerId: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المدرب" />
                      </SelectTrigger>
                      <SelectContent>
                        {trainers.map((trainer: any) => (
                          <SelectItem key={trainer.id} value={trainer.id.toString()}>
                            {trainer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memberId">العضو *</Label>
                    <Select
                      value={formData.memberId || undefined}
                      onValueChange={(value) => setFormData({ ...formData, memberId: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر العضو" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member: any) => (
                          <SelectItem key={member.id} value={member.id.toString()}>
                            {member.name} ({member.memberCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="classDate">التاريخ *</Label>
                    <Input
                      id="classDate"
                      type="date"
                      value={formData.classDate}
                      onChange={(e) => setFormData({ ...formData, classDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">وقت البدء *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">وقت الانتهاء *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">السعر (جنيه)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="ملاحظات إضافية"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isCreating || isUpdating}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isCreating || isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 ml-2" />
                      حفظ
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default PersonalSessions;
