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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useGetAllBranchesQuery } from "@/services/branchesApi";
import {
  useGetAllMembersQuery,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useGetMemberStatisticsQuery,
} from "@/services/membersApi";
import { useGetAllMembershipTypesQuery } from "@/services/membershipTypesApi";
import {
  Users, Plus, Search, Edit, Trash2, CreditCard,
  Calendar as CalendarIcon, CheckCircle, XCircle, Save, Filter, Download,
  FileText, TrendingUp, UserPlus, Clock, Building, Mail,
  Phone, Award, DollarSign, PieChart, BarChart3, MapPin,
  User, Heart, Briefcase, Activity, Upload, Image
} from "lucide-react";

const MembershipManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  
  // جلب الفروع
  const { data: branchesData, isLoading: branchesLoading } = useGetAllBranchesQuery(undefined as any);
  const branches = Array.isArray(branchesData?.data) ? branchesData.data : [];
  
  // جلب الأعضاء من API
  const { data: membersData, isLoading: membersLoading, refetch: refetchMembers } = useGetAllMembersQuery({
    search: searchQuery,
    branchId: filterType !== "all" ? filterType : undefined,
    status: filterStatus !== "all" ? filterStatus : undefined,
  });
  const members = Array.isArray(membersData?.data) ? membersData.data : [];
  
  // جلب أنواع العضوية
  const { data: membershipTypesData } = useGetAllMembershipTypesQuery(undefined as any);
  const membershipTypes = Array.isArray(membershipTypesData?.data) ? membershipTypesData.data : [];
  
  // جلب الإحصائيات
  const { data: statisticsData } = useGetMemberStatisticsQuery(undefined as any);
  const statistics = statisticsData?.data || { total: 0, active: 0, inactive: 0 };
  
  // Mutations
  const [createMember] = useCreateMemberMutation();
  const [updateMember] = useUpdateMemberMutation();
  const [deleteMember] = useDeleteMemberMutation();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [formData, setFormData] = useState({
    branchId: "",
    name: "",
    memberCode: "",
    phone: "",
    gender: "",
    cardNumber: "",
    dateOfBirth: "",
    address: "",
    profilePicture: null as File | null,
    // حقول إضافية للتوافق مع الكود الموجود
    email: "",
    membershipType: "",
    startDate: "",
    endDate: "",
    notes: ""
  });
  
  const [phoneError, setPhoneError] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    if (status === "نشط") {
      return <Badge className="bg-green-500">نشط</Badge>;
    }
    return <Badge variant="destructive">منتهي</Badge>;
  };

  // التحقق من رقم الموبايل
  const validatePhone = (phone: string) => {
    if (!phone) {
      setPhoneError("رقم الموبايل مطلوب");
      return false;
    }
    if (!phone.startsWith("010") && !phone.startsWith("010")) {
      setPhoneError("رقم الموبايل يجب أن يبدأ بـ 010");
      return false;
    }
    if (phone.length < 9 || phone.length > 12) {
      setPhoneError("رقم الموبايل غير صحيح");
      return false;
    }
    setPhoneError("");
    return true;
  };

  // تحويل Date إلى yyyy-mm-dd
  const convertDateToISO = (date: Date | undefined): string => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  // تحويل yyyy-mm-dd إلى Date
  const convertDateFromISO = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    try {
      return new Date(dateStr);
    } catch {
      return undefined;
    }
  };

  const handleAdd = () => {
    setFormData({
      branchId: "",
      name: "",
      memberCode: "", // سيتم إنشاؤه تلقائياً في الـ backend
      phone: "",
      gender: "",
      cardNumber: "",
      dateOfBirth: "",
      address: "",
      profilePicture: null,
      email: "",
      membershipType: "",
      startDate: "",
      endDate: "",
      notes: ""
    });
    setDateOfBirth(undefined);
    setPhoneError("");
    setIsAddDialogOpen(true);
  };

  // Handle edit member
  const handleEdit = (member: any) => {
    setSelectedMember(member);
    setFormData({
      branchId: member.branchId || "",
      name: member.name || "",
      memberCode: member.memberCode || "",
      phone: member.phone || "",
      gender: member.gender || "",
      cardNumber: member.cardNumber || member.idNumber || "",
      dateOfBirth: member.dateOfBirth || "",
      address: member.address || "",
      profilePicture: null,
      email: member.email || "",
      membershipType: member.membershipType || "",
      startDate: member.startDate || "",
      endDate: member.endDate || "",
      notes: member.notes || ""
    });
    if (member.dateOfBirth) {
      setDateOfBirth(convertDateFromISO(member.dateOfBirth));
    } else {
      setDateOfBirth(undefined);
    }
    setIsEditDialogOpen(true);
  };

  const handleView = (member: any) => {
    setSelectedMember(member);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (member: any) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAdd = async () => {
    // التحقق من الحقول المطلوبة (memberCode سيتم إنشاؤه تلقائياً)
    if (!formData.branchId || !formData.name || !formData.phone || !formData.gender || !dateOfBirth) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة (الفرع، الاسم، رقم الموبايل، الجنس، تاريخ الميلاد)",
        variant: "destructive"
      });
      return;
    }

    // التحقق من رقم الموبايل
    if (!validatePhone(formData.phone)) {
      toast({
        title: "خطأ",
        description: phoneError || "رقم الموبايل يجب أن يبدأ بـ 010",
        variant: "destructive"
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("branchId", formData.branchId);
      formDataToSend.append("name", formData.name);
      // memberCode سيتم إنشاؤه تلقائياً في الـ backend إذا لم يتم إرساله أو كان فارغاً
      // formDataToSend.append("memberCode", formData.memberCode);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("cardNumber", formData.cardNumber || "");
      formDataToSend.append("dateOfBirth", convertDateToISO(dateOfBirth));
      formDataToSend.append("address", formData.address || "");
      formDataToSend.append("email", formData.email || "");
      formDataToSend.append("membershipTypeId", formData.membershipType || "");
      formDataToSend.append("startDate", formData.startDate || "");
      formDataToSend.append("endDate", formData.endDate || "");
      formDataToSend.append("notes", formData.notes || "");
      if (formData.profilePicture) {
        formDataToSend.append("profilePicture", formData.profilePicture);
      }

      await createMember(formDataToSend).unwrap();
      toast({
        title: "نجح",
        description: "تم إضافة العضو بنجاح"
      });
      setIsAddDialogOpen(false);
      refetchMembers();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء إضافة العضو",
        variant: "destructive"
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!formData.name || !formData.phone) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    // التحقق من رقم الموبايل
    if (!validatePhone(formData.phone)) {
      toast({
        title: "خطأ",
        description: phoneError || "رقم الموبايل يجب أن يبدأ بـ 010",
        variant: "destructive"
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("branchId", formData.branchId);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("memberCode", formData.memberCode);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("cardNumber", formData.cardNumber || "");
      formDataToSend.append("dateOfBirth", convertDateToISO(dateOfBirth));
      formDataToSend.append("address", formData.address || "");
      formDataToSend.append("email", formData.email || "");
      formDataToSend.append("membershipTypeId", formData.membershipType || "");
      formDataToSend.append("startDate", formData.startDate || "");
      formDataToSend.append("endDate", formData.endDate || "");
      formDataToSend.append("notes", formData.notes || "");
      if (formData.profilePicture) {
        formDataToSend.append("profilePicture", formData.profilePicture);
      }

      await updateMember({ id: selectedMember.id, formData: formDataToSend }).unwrap();
      toast({
        title: "نجح",
        description: "تم تحديث بيانات العضو بنجاح"
      });
      setIsEditDialogOpen(false);
      setSelectedMember(null);
      refetchMembers();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء تحديث العضو",
        variant: "destructive"
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMember(selectedMember.id).unwrap();
      toast({
        title: "نجح",
        description: "تم حذف العضو بنجاح"
      });
      setIsDeleteDialogOpen(false);
      setSelectedMember(null);
      refetchMembers();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حذف العضو",
        variant: "destructive"
      });
    }
  };

  // فلترة الأعضاء - يتم في API
  const filteredMembers = members;

  // إحصائيات - يتم جلبها من API
  const stats = {
    total: statistics.total || 0,
    active: statistics.active || 0,
    expired: statistics.inactive || 0,
    monthly: 0, // يمكن إضافتها في API لاحقاً
    quarterly: 0, // يمكن إضافتها في API لاحقاً
    annual: 0, // يمكن إضافتها في API لاحقاً
  };

  const membershipTypesList = membershipTypes.map((mt: any) => mt.name);
  const statuses = ["active", "inactive"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان والبحث */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة العضوية</h1>
            <p className="text-gray-600 mt-1">إدارة العضوية وسجلات الأعضاء</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن عضو..."
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
              {(filterType !== "all" || filterStatus !== "all") && (
                <Badge className="bg-blue-500">{[filterType, filterStatus].filter(f => f !== "all").length}</Badge>
              )}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة عضو جديد
            </Button>
          </div>
        </div>

        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي الأعضاء</span>
                <Users className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-500">{stats.active} نشط</Badge>
                <Badge variant="destructive">{stats.expired} منتهي</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الأعضاء النشطون</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.active}</div>
              <div className="mt-3">
                <Progress value={(stats.active / stats.total) * 100} className="h-2" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <TrendingUp className="w-3 h-3 inline ml-1" />
                {((stats.active / stats.total) * 100).toFixed(1)}% من إجمالي الأعضاء
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الاشتراكات المنتهية</span>
                <Clock className="w-5 h-5 text-orange-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.expired}</div>
              <p className="text-sm text-gray-500 mt-1">في انتظار التجديد</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>معدل التجديد</span>
                <Award className="w-5 h-5 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {stats.total > 0 ? Math.round((stats.active / (stats.active + stats.expired)) * 100) : 0}%
              </div>
              <Progress value={stats.total > 0 ? (stats.active / (stats.active + stats.expired)) * 100 : 0} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* بطاقات إضافية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-cyan-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الاشتراكات الشهرية</span>
                <CalendarIcon className="w-5 h-5 text-cyan-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-600">{stats.monthly}</div>
              <p className="text-sm text-gray-500 mt-1">عضو</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>الربع سنوية</span>
                <CreditCard className="w-5 h-5 text-indigo-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats.quarterly}</div>
              <p className="text-sm text-gray-500 mt-1">عضو</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pink-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>السنوية</span>
                <Award className="w-5 h-5 text-pink-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">{stats.annual}</div>
              <p className="text-sm text-gray-500 mt-1">عضو</p>
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
                  setFilterType("all");
                  setFilterStatus("all");
                }}>
                  <XCircle className="w-4 h-4 ml-1" />
                  إعادة تعيين
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نوع العضوية</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الأنواع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      {membershipTypes.map((type: any) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>الحالة</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الحالات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* عرض الجدول أو الكروت */}
        <Tabs defaultValue="table" className="space-y-4">
          <TabsList>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              عرض الجدول
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              عرض الكروت
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    قائمة الأعضاء ({filteredMembers.length})
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>عرض</span>
                    <Select defaultValue="10">
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الفرع</th>
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">إسم العضو</th>
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">كود العضو</th>
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">رقم الموبايل</th>
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الجنس</th>
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">رقم البطاقة</th>
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">تاريخ الميلاد</th>
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">العنوان</th>
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">صورة العضو</th>
                        <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الإجراءات</th>
                      </tr>
                    </thead>  
                    <tbody>
                      {filteredMembers.map((member: any) => (
                        <tr key={member.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 whitespace-nowrap text-sm">
                            {branches.find((b: any) => b.id === member.branchId)?.arabicName || 
                             branches.find((b: any) => b.id === member.branchId)?.englishName || 
                             branches.find((b: any) => b.id === member.branchId)?.name || "-"}
                          </td>
                          <td className="py-3 px-4 font-semibold whitespace-nowrap">{member.name}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-sm">{member.memberCode || "-"}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-sm">{member.phone || "-"}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-sm">
                            {member.gender === "male" ? "ذكر" : member.gender === "female" ? "أنثى" : "-"}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="text-sm font-mono">{member.cardNumber || member.idNumber || "-"}</span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-sm">
                            {member.dateOfBirth ? (member.dateOfBirth.includes('/') ? member.dateOfBirth : format(new Date(member.dateOfBirth), "PPP", { locale: ar })) : "-"}
                          </td>
                          <td className="py-3 px-4 text-sm max-w-xs truncate" title={member.address || ""}>
                            {member.address || "-"}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {member.profilePicture ? (
                              <img 
                                src={
                                  typeof member.profilePicture === 'string' 
                                    ? (member.profilePicture.startsWith('http') || member.profilePicture.startsWith('data:') || member.profilePicture.startsWith('/'))
                                      ? member.profilePicture
                                      : `${import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com'}/${member.profilePicture}`
                                    : URL.createObjectURL(member.profilePicture)
                                } 
                                alt={member.name}
                                className="w-12 h-12 rounded-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  const parent = (e.target as HTMLElement).parentElement;
                                  if (parent && !parent.querySelector('.fallback-icon')) {
                                    const icon = document.createElement('div');
                                    icon.className = 'fallback-icon w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center';
                                    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>';
                                    parent.appendChild(icon);
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                <Users className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(member)} title="تعديل" className="hover:bg-blue-50">
                                <Edit className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(member)} title="حذف" className="hover:bg-red-50">
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredMembers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>لا توجد نتائج مطابقة</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member: any) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                          {member.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{member.name}</CardTitle>
                          <p className="text-sm text-gray-500">{member.membershipType}</p>
                        </div>
                      </div>
                      {getStatusBadge(member.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">من:</span>
                        <span>{member.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">إلى:</span>
                        <span>{member.endDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(member)}>
                        <Edit className="w-4 h-4 ml-1" />
                        تعديل
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <CreditCard className="w-4 h-4 ml-1 text-green-600" />
                        بطاقة
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(member)}>
                        <Trash2 className="w-4 h-4 ml-1 text-red-500" />
                        حذف
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredMembers.length === 0 && (
              <Card>
                <CardContent className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">لا توجد نتائج مطابقة</p>
                  <p className="text-sm mt-2">جرب تغيير الفلاتر أو البحث</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialog إضافة عضو جديد */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة عضو جديد</DialogTitle>
              <DialogDescription>
                أدخل جميع بيانات العضو الجديد
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* الفرع */}
              <div className="space-y-2">
                <Label htmlFor="branchId">الفرع *</Label>
                {branchesLoading ? (
                  <div className="text-sm text-muted-foreground">جاري تحميل الفروع...</div>
                ) : (
                  <Select
                    value={formData.branchId}
                    onValueChange={(value) => setFormData({...formData, branchId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفرع" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch: any) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.arabicName || branch.englishName || branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* إسم العضو */}
              <div className="space-y-2">
                <Label htmlFor="name">إسم العضو *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="أدخل اسم العضو"
                />
              </div>

              {/* كود العضو - يظهر إن وجد وإلا رسالة توضيحية */}
              <div className="space-y-2">
                <Label htmlFor="memberCode">كود العضو</Label>
                <Input
                  id="memberCode"
                  value={formData.memberCode || "سيتم إنشاؤه تلقائياً"}
                  disabled
                  className="bg-gray-100 text-gray-600 cursor-not-allowed"
                  placeholder="سيتم إنشاؤه تلقائياً"
                />
                <p className="text-xs text-gray-500">سيتم إنشاء كود العضو تلقائياً عند الحفظ</p>
              </div>

              {/* رقم الموبايل */}
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الموبايل * (يجب أن يبدأ بـ 010 أو 010)</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({...formData, phone: value});
                    validatePhone(value);
                  }}
                  placeholder="010xxxxxxxx أو 010xxxxxxxx"
                  className={phoneError ? "border-red-500" : ""}
                />
                {phoneError && (
                  <p className="text-sm text-red-500">{phoneError}</p>
                )}
              </div>

              {/* الجنس */}
              <div className="space-y-2">
                <Label htmlFor="gender">الجنس *</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => setFormData({...formData, gender: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الجنس" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* رقم البطاقة */}
              <div className="space-y-2">
                <Label htmlFor="cardNumber">رقم البطاقة</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                  placeholder="أدخل رقم البطاقة (أي قيمة مقبولة)"
                  maxLength={255}
                />
              </div>

              {/* تاريخ الميلاد */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">تاريخ الميلاد *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-right font-normal",
                        !dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      {dateOfBirth ? (
                        format(dateOfBirth, "PPP", { locale: ar })
                      ) : (
                        <span>اختر تاريخ الميلاد</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={setDateOfBirth}
                      initialFocus
                      locale={ar}
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* العنوان - يأخذ عمودين */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">العنوان</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="أدخل العنوان الكامل"
                  rows={3}
                />
              </div>

              {/* صورة العضو */}
              <div className="space-y-2">
                <Label htmlFor="profilePicture">صورة العضو</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({...formData, profilePicture: file});
                      }
                    }}
                    className="hidden"
                  />
                  <Label
                    htmlFor="profilePicture"
                    className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4" />
                    اختر ملف
                  </Label>
                  {formData.profilePicture && (
                    <span className="text-sm text-muted-foreground">
                      {formData.profilePicture.name}
                    </span>
                  )}
                  {!formData.profilePicture && (
                    <span className="text-sm text-muted-foreground">No file chosen</span>
                  )}
                </div>
                {formData.profilePicture && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(formData.profilePicture)}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
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

        {/* Dialog تعديل عضو */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>تعديل بيانات العضو</DialogTitle>
              <DialogDescription>
                قم بتعديل بيانات العضو
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-memberCode">كود العضو</Label>
                <Input
                  id="edit-memberCode"
                  value={formData.memberCode || "غير متوفر"}
                  disabled
                  className="bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">الاسم *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="اسم العضو"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">رقم الهاتف *</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="رقم الهاتف"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">البريد الإلكتروني</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="البريد الإلكتروني"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-membershipType">نوع العضوية *</Label>
                  <Select value={formData.membershipType} onValueChange={(value) => setFormData({...formData, membershipType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع العضوية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="شهري">شهري</SelectItem>
                      <SelectItem value="ربع سنوي">ربع سنوي</SelectItem>
                      <SelectItem value="نصف سنوي">نصف سنوي</SelectItem>
                      <SelectItem value="سنوي">سنوي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">تاريخ البدء *</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">تاريخ الانتهاء *</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">العنوان</Label>
                <Textarea
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="العنوان"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">ملاحظات</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="ملاحظات إضافية"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog تأكيد الحذف */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من حذف العضو "{selectedMember?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
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

        {/* Dialog عرض جميع التفاصيل */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                تفاصيل العضو: {selectedMember?.name}
              </DialogTitle>
              <DialogDescription>
                عرض جميع بيانات العضو التفصيلية
              </DialogDescription>
            </DialogHeader>
            {selectedMember && (
              <div className="space-y-6 py-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="basic">البيانات الأساسية</TabsTrigger>
                    <TabsTrigger value="address">العنوان</TabsTrigger>
                    <TabsTrigger value="personal">الشخصية</TabsTrigger>
                    <TabsTrigger value="health">الصحية</TabsTrigger>
                    <TabsTrigger value="membership">الاشتراك</TabsTrigger>
                  </TabsList>

                  {/* البيانات الأساسية */}
                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">الاسم بالعربية</Label>
                        <p className="mt-1">{selectedMember.name || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">الاسم بالإنجليزية</Label>
                        <p className="mt-1">{selectedMember.nameEnglish || "-"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">رقم الهاتف الرئيسي</Label>
                        <p className="mt-1">{selectedMember.phone || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">رقم الهاتف الثانوي</Label>
                        <p className="mt-1">{selectedMember.phoneSecondary || "-"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">البريد الإلكتروني</Label>
                        <p className="mt-1">{selectedMember.email || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">الجنس</Label>
                        <p className="mt-1">{selectedMember.gender === "male" ? "ذكر" : selectedMember.gender === "female" ? "أنثى" : "-"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">تاريخ الميلاد</Label>
                        <p className="mt-1">{selectedMember.dateOfBirth || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">رقم الهوية / الإقامة</Label>
                        <p className="mt-1">{selectedMember.idNumber || "-"}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">الجنسية</Label>
                      <p className="mt-1">{selectedMember.nationality || "-"}</p>
                    </div>
                  </TabsContent>

                  {/* العنوان */}
                  <TabsContent value="address" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">الدولة</Label>
                        <p className="mt-1">{selectedMember.country || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">المدينة</Label>
                        <p className="mt-1">{selectedMember.city || "-"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">الحي</Label>
                        <p className="mt-1">{selectedMember.district || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">الشارع</Label>
                        <p className="mt-1">{selectedMember.street || "-"}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">الرمز البريدي</Label>
                      <p className="mt-1">{selectedMember.postalCode || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">العنوان التفصيلي</Label>
                      <p className="mt-1">{selectedMember.address || "-"}</p>
                    </div>
                    <div className="border-t pt-4 mt-4">
                      <h3 className="font-semibold mb-4">جهة الاتصال في حالات الطوارئ</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">اسم جهة الاتصال</Label>
                          <p className="mt-1">{selectedMember.emergencyContactName || "-"}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">رقم الهاتف</Label>
                          <p className="mt-1">{selectedMember.emergencyContactPhone || "-"}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label className="text-sm font-semibold text-gray-600">صلة القرابة</Label>
                        <p className="mt-1">
                          {selectedMember.emergencyContactRelation === "father" ? "أب" :
                           selectedMember.emergencyContactRelation === "mother" ? "أم" :
                           selectedMember.emergencyContactRelation === "brother" ? "أخ" :
                           selectedMember.emergencyContactRelation === "sister" ? "أخت" :
                           selectedMember.emergencyContactRelation === "spouse" ? "زوج/زوجة" :
                           selectedMember.emergencyContactRelation === "son" ? "ابن" :
                           selectedMember.emergencyContactRelation === "daughter" ? "ابنة" :
                           selectedMember.emergencyContactRelation === "friend" ? "صديق" :
                           selectedMember.emergencyContactRelation === "other" ? "آخر" : "-"}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* البيانات الشخصية */}
                  <TabsContent value="personal" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">الحالة الاجتماعية</Label>
                        <p className="mt-1">
                          {selectedMember.maritalStatus === "single" ? "أعزب" :
                           selectedMember.maritalStatus === "married" ? "متزوج" :
                           selectedMember.maritalStatus === "divorced" ? "مطلق" :
                           selectedMember.maritalStatus === "widowed" ? "أرمل" : "-"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">المهنة</Label>
                        <p className="mt-1">{selectedMember.occupation || "-"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">الطول (سم)</Label>
                        <p className="mt-1">{selectedMember.height || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">الوزن (كجم)</Label>
                        <p className="mt-1">{selectedMember.weight || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">فصيلة الدم</Label>
                        <p className="mt-1">{selectedMember.bloodType || "-"}</p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* البيانات الصحية */}
                  <TabsContent value="health" className="space-y-4 mt-4">
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">الحالة الصحية العامة</Label>
                      <p className="mt-1">
                        {selectedMember.healthStatus === "excellent" ? "ممتازة" :
                         selectedMember.healthStatus === "good" ? "جيدة" :
                         selectedMember.healthStatus === "fair" ? "متوسطة" :
                         selectedMember.healthStatus === "poor" ? "ضعيفة" : "-"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">الحساسيات</Label>
                      <p className="mt-1">{selectedMember.allergies || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">الحالات الطبية</Label>
                      <p className="mt-1">{selectedMember.medicalConditions || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">الأدوية المستخدمة</Label>
                      <p className="mt-1">{selectedMember.medications || "-"}</p>
                    </div>
                  </TabsContent>

                  {/* بيانات الاشتراك */}
                  <TabsContent value="membership" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">نوع العضوية</Label>
                        <p className="mt-1">{selectedMember.membershipType || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">طريقة الدفع المفضلة</Label>
                        <p className="mt-1">
                          {selectedMember.preferredPaymentMethod === "cash" ? "نقدي" :
                           selectedMember.preferredPaymentMethod === "card" ? "بطاقة ائتمانية" :
                           selectedMember.preferredPaymentMethod === "bank" ? "تحويل بنكي" :
                           selectedMember.preferredPaymentMethod === "online" ? "دفع إلكتروني" : "-"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">تاريخ البدء</Label>
                        <p className="mt-1">{selectedMember.startDate || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">تاريخ الانتهاء</Label>
                        <p className="mt-1">{selectedMember.endDate || "-"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">المدرب المفضل</Label>
                        <p className="mt-1">{selectedMember.preferredTrainer || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">المجموعة / الفئة المفضلة</Label>
                        <p className="mt-1">{selectedMember.preferredGroup || "-"}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">الهدف من اللياقة</Label>
                      <p className="mt-1">
                        {selectedMember.fitnessGoal === "weight-loss" ? "فقدان الوزن" :
                         selectedMember.fitnessGoal === "muscle-gain" ? "بناء العضلات" :
                         selectedMember.fitnessGoal === "endurance" ? "تحسين التحمل" :
                         selectedMember.fitnessGoal === "flexibility" ? "المرونة" :
                         selectedMember.fitnessGoal === "general-fitness" ? "اللياقة العامة" :
                         selectedMember.fitnessGoal === "rehabilitation" ? "إعادة تأهيل" :
                         selectedMember.fitnessGoal === "other" ? "أخرى" : "-"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">الرياضات المفضلة</Label>
                      <p className="mt-1">{selectedMember.preferredSports || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">ملاحظات إضافية</Label>
                      <p className="mt-1">{selectedMember.notes || "-"}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                إغلاق
              </Button>
              <Button onClick={() => {
                setIsViewDialogOpen(false);
                handleEdit(selectedMember);
              }} className="bg-blue-600 hover:bg-blue-700">
                <Edit className="w-4 h-4 ml-2" />
                تعديل
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default MembershipManagement;

