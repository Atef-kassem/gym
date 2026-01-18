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
  Calendar, Plus, Clock, MapPin, Users, Save, Edit, Trash2,
  Loader2, BookOpen, UserCheck
} from "lucide-react";
import {
  useGetAllClassesQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
  useEnrollMemberMutation,
  useRemoveMemberMutation,
  useUpdateAttendanceMutation,
} from "@/services/classesApi";
import {
  useGetAllTrainersQuery,
} from "@/services/trainersApi";
import {
  useGetAllMembersQuery,
} from "@/services/membersApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  isActive: boolean;
  trainer?: {
    id: number;
    name: string;
    phone: string;
    email: string;
  };
  branch?: {
    id: number;
    arabicName: string;
    englishName: string;
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

const Classes = () => {
  const { selectedBranch } = useBranch();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [trainerFilter, setTrainerFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<GymClass | null>(null);
  const [editingClass, setEditingClass] = useState<GymClass | null>(null);
  
  const { toast } = useToast();
  
  // Fetch classes
  const { data: classesData, isLoading: isLoadingClasses, refetch: refetchClasses } = useGetAllClassesQuery({
    branchId: selectedBranch?.id,
    status: statusFilter !== "all" ? statusFilter : undefined,
    trainerId: trainerFilter !== "all" ? trainerFilter : undefined,
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
    maxCapacity: "10",
    price: "0",
    notes: "",
    memberIds: [] as string[],
  });
  
  // Normalize data
  const classes = useMemo(() => {
    if (!classesData) return [];
    if (Array.isArray(classesData)) return classesData;
    if (classesData.data?.classes && Array.isArray(classesData.data.classes)) return classesData.data.classes;
    if (classesData.data && Array.isArray(classesData.data)) return classesData.data;
    return [];
  }, [classesData]);
  
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
  
  // Filter classes
  const filteredClasses = useMemo(() => {
    let filtered = classes;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((cls: GymClass) => 
        cls.className.toLowerCase().includes(query) ||
        cls.description?.toLowerCase().includes(query) ||
        cls.trainer?.name?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [classes, searchQuery]);
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: "bg-blue-500",
      ongoing: "bg-green-500",
      completed: "bg-gray-500",
      cancelled: "bg-red-500",
    };
    const labels: Record<string, string> = {
      scheduled: "مجدولة",
      ongoing: "جارية",
      completed: "منتهية",
      cancelled: "ملغية",
    };
    return (
      <Badge className={colors[status] || "bg-gray-500"}>
        {labels[status] || status}
      </Badge>
    );
  };
  
  // Open dialog for creating new class
  const handleOpenDialog = () => {
    setEditingClass(null);
    setFormData({
      className: "",
      description: "",
      trainerId: "",
      branchId: selectedBranch?.id?.toString() || "",
      classDate: new Date().toISOString().split('T')[0],
      startTime: "",
      endTime: "",
      maxCapacity: "10",
      price: "0",
      notes: "",
      memberIds: [],
    });
    setIsDialogOpen(true);
  };
  
  // Open dialog for editing class
  const handleEdit = (classRecord: GymClass) => {
    setEditingClass(classRecord);
    setFormData({
      className: classRecord.className,
      description: classRecord.description || "",
      trainerId: classRecord.trainerId.toString(),
      branchId: classRecord.branchId.toString(),
      classDate: classRecord.classDate,
      startTime: classRecord.startTime,
      endTime: classRecord.endTime,
      maxCapacity: classRecord.maxCapacity.toString(),
      price: classRecord.price.toString(),
      notes: classRecord.notes || "",
      memberIds: classRecord.enrollments?.map(e => e.memberId.toString()) || [],
    });
    setIsDialogOpen(true);
  };
  
  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الحصة؟")) return;
    
    try {
      await deleteClass(id).unwrap();
      toast({
        title: "نجح",
        description: "تم حذف الحصة بنجاح",
      });
      refetchClasses();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "فشل حذف الحصة",
        variant: "destructive",
      });
    }
  };
  
  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.className || !formData.trainerId || !formData.classDate || !formData.startTime || !formData.endTime) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const classData = {
        className: formData.className,
        description: formData.description || null,
        trainerId: parseInt(formData.trainerId),
        branchId: parseInt(formData.branchId),
        classDate: formData.classDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        maxCapacity: parseInt(formData.maxCapacity),
        price: parseFloat(formData.price),
        notes: formData.notes || null,
        memberIds: formData.memberIds.map(id => parseInt(id)),
      };
      
      if (editingClass) {
        await updateClass({ id: editingClass.id, data: classData }).unwrap();
        toast({
          title: "نجح",
          description: "تم تحديث الحصة بنجاح",
        });
      } else {
        await createClass(classData).unwrap();
        toast({
          title: "نجح",
          description: "تم إنشاء الحصة بنجاح",
        });
      }
      
      setIsDialogOpen(false);
      refetchClasses();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "فشل حفظ الحصة",
        variant: "destructive",
      });
    }
  };
  
  // Handle enroll member
  const handleEnrollMember = async (classId: number, memberId: number) => {
    try {
      await enrollMember({ classId, memberId }).unwrap();
      toast({
        title: "نجح",
        description: "تم تسجيل العضو في الحصة بنجاح",
      });
      refetchClasses();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "فشل تسجيل العضو",
        variant: "destructive",
      });
    }
  };
  
  // Handle remove member
  const handleRemoveMember = async (classId: number, memberId: number) => {
    if (!confirm("هل أنت متأكد من إلغاء تسجيل العضو من هذه الحصة؟")) return;
    
    try {
      await removeMember({ classId, memberId }).unwrap();
      toast({
        title: "نجح",
        description: "تم إلغاء تسجيل العضو بنجاح",
      });
      refetchClasses();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "فشل إلغاء التسجيل",
        variant: "destructive",
      });
    }
  };
  
  // Open enroll dialog
  const handleOpenEnrollDialog = (classRecord: GymClass) => {
    setSelectedClass(classRecord);
    setIsEnrollDialogOpen(true);
  };
  
  if (isLoadingClasses || isLoadingTrainers || isLoadingMembers) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الحصص</h1>
            <p className="text-gray-600 mt-1">إدارة الحصص والأعضاء والمدربين</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleOpenDialog}>
            <Plus className="w-5 h-5 ml-2" />
            إضافة حصة جديدة
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>بحث</Label>
                <Input
                  placeholder="ابحث عن حصة..."
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
                    <SelectItem value="cancelled">ملغية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>المدرب</Label>
                <Select value={trainerFilter} onValueChange={setTrainerFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="جميع المدربين" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المدربين</SelectItem>
                    {trainers.map((trainer: any) => (
                      <SelectItem key={trainer.id} value={trainer.id.toString()}>
                        {trainer.name}
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
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي الحصص</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{classes.length}</div>
              <p className="text-sm text-gray-500 mt-1">حصة</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الحصص النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {classes.filter((c: GymClass) => c.status === 'scheduled' || c.status === 'ongoing').length}
              </div>
              <p className="text-sm text-gray-500 mt-1">حصة نشطة</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الأعضاء المسجلين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {classes.reduce((sum: number, c: GymClass) => sum + (c.currentEnrollments || 0), 0)}
              </div>
              <p className="text-sm text-gray-500 mt-1">عضو مسجل</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">المدربون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {new Set(classes.map((c: GymClass) => c.trainerId)).size}
              </div>
              <p className="text-sm text-gray-500 mt-1">مدرب نشط</p>
            </CardContent>
          </Card>
        </div>

        {/* Classes List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              قائمة الحصص
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredClasses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                لا توجد حصص متاحة
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClasses.map((classRecord: GymClass) => (
                  <Card key={classRecord.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{classRecord.className}</h3>
                            {getStatusBadge(classRecord.status)}
                          </div>
                          {classRecord.description && (
                            <p className="text-sm text-gray-600 mb-3">{classRecord.description}</p>
                          )}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>المدرب: {classRecord.trainer?.name || "غير محدد"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{classRecord.classDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{classRecord.startTime} - {classRecord.endTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>{classRecord.currentEnrollments}/{classRecord.maxCapacity}</span>
                            </div>
                          </div>
                          
                          {/* Enrolled Members */}
                          {classRecord.enrollments && classRecord.enrollments.length > 0 && (
                            <div className="mt-4 border-t pt-4">
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <UserCheck className="w-4 h-4" />
                                الأعضاء المسجلين ({classRecord.enrollments.length})
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {classRecord.enrollments.map((enrollment) => (
                                  <Badge key={enrollment.id} variant="outline" className="flex items-center gap-1">
                                    {enrollment.member?.name || "عضو غير معروف"} ({enrollment.member?.memberCode || "N/A"})
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-4 w-4 p-0 hover:bg-red-100"
                                      onClick={() => handleRemoveMember(classRecord.id, enrollment.memberId)}
                                    >
                                      <Trash2 className="w-3 h-3 text-red-500" />
                                    </Button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEnrollDialog(classRecord)}
                            disabled={classRecord.currentEnrollments >= classRecord.maxCapacity}
                          >
                            <Users className="w-4 h-4 ml-2" />
                            تسجيل عضو
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(classRecord)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(classRecord.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingClass ? "تعديل الحصة" : "إضافة حصة جديدة"}
              </DialogTitle>
              <DialogDescription>
                {editingClass ? "قم بتعديل بيانات الحصة" : "أدخل بيانات الحصة الجديدة"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="className">اسم الحصة *</Label>
                  <Input
                    id="className"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    required
                    placeholder="مثال: تمارين القلب"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="وصف الحصة"
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
                    <Label htmlFor="branchId">الفرع *</Label>
                    <Input
                      id="branchId"
                      value={formData.branchId}
                      disabled
                    />
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxCapacity">الحد الأقصى للأعضاء *</Label>
                    <Input
                      id="maxCapacity"
                      type="number"
                      min="1"
                      value={formData.maxCapacity}
                      onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                      required
                    />
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
                </div>
                {!editingClass && (
                  <div className="space-y-2">
                    <Label htmlFor="memberIds">الأعضاء (اختياري)</Label>
                    <Select
                      value=""
                      onValueChange={(value) => {
                        if (value && !formData.memberIds.includes(value)) {
                          setFormData({ ...formData, memberIds: [...formData.memberIds, value] });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر أعضاء لتسجيلهم في الحصة" />
                      </SelectTrigger>
                      <SelectContent>
                        {members
                          .filter((m: any) => !formData.memberIds.includes(m.id.toString()))
                          .map((member: any) => (
                            <SelectItem key={member.id} value={member.id.toString()}>
                              {member.name} ({member.memberCode})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {formData.memberIds.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.memberIds.map((memberId) => {
                          const member = members.find((m: any) => m.id.toString() === memberId);
                          return (
                            <Badge key={memberId} variant="outline" className="flex items-center gap-1">
                              {member?.name || memberId}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-red-100"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    memberIds: formData.memberIds.filter(id => id !== memberId),
                                  });
                                }}
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </Button>
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
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
                  className="bg-blue-600 hover:bg-blue-700"
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

        {/* Enroll Member Dialog */}
        <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تسجيل عضو في الحصة</DialogTitle>
              <DialogDescription>
                اختر عضواً لتسجيله في الحصة: {selectedClass?.className}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>اختر العضو</Label>
                <Select
                  value=""
                  onValueChange={async (value) => {
                    if (value && selectedClass) {
                      await handleEnrollMember(selectedClass.id, parseInt(value));
                      setIsEnrollDialogOpen(false);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العضو" />
                  </SelectTrigger>
                  <SelectContent>
                    {members
                      .filter((m: any) => 
                        !selectedClass?.enrollments?.some(e => e.memberId === m.id)
                      )
                      .map((member: any) => (
                        <SelectItem key={member.id} value={member.id.toString()}>
                          {member.name} ({member.memberCode})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedClass && selectedClass.currentEnrollments >= selectedClass.maxCapacity && (
                <div className="text-sm text-red-500">
                  الحصة ممتلئة! الحد الأقصى: {selectedClass.maxCapacity}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEnrollDialogOpen(false)}>
                إلغاء
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default Classes;

