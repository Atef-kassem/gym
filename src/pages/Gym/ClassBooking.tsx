import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  useEnrollMemberMutation,
  useRemoveMemberMutation,
} from "@/services/classesApi";
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

const ClassBooking = () => {
  const { selectedBranch } = useBranch();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("scheduled");
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<GymClass | null>(null);
  
  const { toast } = useToast();
  
  // Fetch classes (only scheduled and ongoing)
  const { data: classesData, isLoading: isLoadingClasses, refetch: refetchClasses } = useGetAllClassesQuery({
    branchId: selectedBranch?.id,
    status: statusFilter,
    search: searchQuery || undefined,
  });
  
  // Fetch members
  const { data: membersData, isLoading: isLoadingMembers } = useGetAllMembersQuery({
    branchId: selectedBranch?.id,
  });
  
  // Mutations
  const [enrollMember, { isLoading: isEnrolling }] = useEnrollMemberMutation();
  const [removeMember] = useRemoveMemberMutation();
  
  // Normalize data
  const classes = useMemo(() => {
    if (!classesData) return [];
    if (Array.isArray(classesData)) return classesData;
    if (classesData.data?.classes && Array.isArray(classesData.data.classes)) return classesData.data.classes;
    if (classesData.data && Array.isArray(classesData.data)) return classesData.data;
    return [];
  }, [classesData]);
  
  const members = useMemo(() => {
    if (!membersData) return [];
    if (Array.isArray(membersData)) return membersData;
    if (membersData.data && Array.isArray(membersData.data)) return membersData.data;
    if (membersData.success && membersData.data && Array.isArray(membersData.data)) return membersData.data;
    return [];
  }, [membersData]);
  
  // Filter classes by search
  const filteredClasses = useMemo(() => {
    if (!searchQuery) return classes;
    const query = searchQuery.toLowerCase();
    return classes.filter((cls: GymClass) => 
      cls.className.toLowerCase().includes(query) ||
      cls.description?.toLowerCase().includes(query) ||
      cls.trainer?.name?.toLowerCase().includes(query)
    );
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
  
  // Handle enroll member
  const handleEnrollMember = async (classId: number, memberId: number) => {
    try {
      await enrollMember({ classId, memberId }).unwrap();
      toast({
        title: "نجح",
        description: "تم حجز الحصة بنجاح",
      });
      refetchClasses();
      setIsEnrollDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "فشل حجز الحصة",
        variant: "destructive",
      });
    }
  };
  
  // Handle remove member
  const handleRemoveMember = async (classId: number, memberId: number) => {
    if (!confirm("هل أنت متأكد من إلغاء الحجز؟")) return;
    
    try {
      await removeMember({ classId, memberId }).unwrap();
      toast({
        title: "نجح",
        description: "تم إلغاء الحجز بنجاح",
      });
      refetchClasses();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "فشل إلغاء الحجز",
        variant: "destructive",
      });
    }
  };
  
  // Open enroll dialog
  const handleOpenEnrollDialog = (classRecord: GymClass) => {
    setSelectedClass(classRecord);
    setIsEnrollDialogOpen(true);
  };
  
  if (isLoadingClasses || isLoadingMembers) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">حجز الحصص</h1>
            <p className="text-gray-600 mt-1">إدارة حجوزات الحصص التدريبية للأعضاء</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="scheduled">مجدولة</SelectItem>
                    <SelectItem value="ongoing">جارية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الحصص المتاحة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{classes.length}</div>
              <p className="text-sm text-gray-500 mt-1">حصة</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">حصص اليوم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {classes.filter((c: GymClass) => c.classDate === new Date().toISOString().split('T')[0]).length}
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
                {classes.reduce((sum: number, c: GymClass) => sum + (c.currentEnrollments || 0), 0)}
              </div>
              <p className="text-sm text-gray-500 mt-1">حجز</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الأعضاء المسجلين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {new Set(classes.flatMap((c: GymClass) => c.enrollments?.map(e => e.memberId) || [])).size}
              </div>
              <p className="text-sm text-gray-500 mt-1">عضو</p>
            </CardContent>
          </Card>
        </div>

        {/* Classes List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              الحصص المتاحة للحجز
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredClasses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                لا توجد حصص متاحة للحجز
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
                                الأعضاء المحجوزون ({classRecord.enrollments.length})
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
                            variant="default"
                            size="sm"
                            onClick={() => handleOpenEnrollDialog(classRecord)}
                            disabled={classRecord.currentEnrollments >= classRecord.maxCapacity}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Plus className="w-4 h-4 ml-2" />
                            حجز حصة
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

        {/* Enroll Member Dialog */}
        <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>حجز حصة</DialogTitle>
              <DialogDescription>
                اختر عضواً لحجز الحصة: {selectedClass?.className}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedClass && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">تفاصيل الحصة:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>التاريخ:</strong> {selectedClass.classDate}</div>
                    <div><strong>الوقت:</strong> {selectedClass.startTime} - {selectedClass.endTime}</div>
                    <div><strong>المدرب:</strong> {selectedClass.trainer?.name}</div>
                    <div><strong>المتاح:</strong> {selectedClass.maxCapacity - selectedClass.currentEnrollments} من {selectedClass.maxCapacity}</div>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>اختر العضو</Label>
                <Select
                  value=""
                  onValueChange={async (value) => {
                    if (value && selectedClass) {
                      await handleEnrollMember(selectedClass.id, parseInt(value));
                    }
                  }}
                  disabled={isEnrolling}
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
              <Button variant="outline" onClick={() => setIsEnrollDialogOpen(false)} disabled={isEnrolling}>
                إلغاء
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default ClassBooking;
