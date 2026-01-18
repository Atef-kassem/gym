import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar, Search, Clock, Users, DollarSign, TrendingUp,
  Loader2, User, BookOpen, Mail, Phone, Briefcase, Award,
  CalendarDays, FileText, CreditCard
} from "lucide-react";
import {
  useGetAllTrainersQuery,
  useGetTrainerDetailsQuery,
} from "@/services/trainersApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TrainerSearch = () => {
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>("");
  const [searchType, setSearchType] = useState<"month" | "range">("month");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  
  const { toast } = useToast();
  
  // Fetch trainers
  const { data: trainersData, isLoading: isLoadingTrainers } = useGetAllTrainersQuery({});
  
  // Fetch trainer details
  const { data: trainerDetailsData, isLoading: isLoadingDetails, refetch: refetchDetails } = useGetTrainerDetailsQuery(
    {
      trainerId: selectedTrainerId,
      month: searchType === "month" && selectedMonth ? selectedMonth : undefined,
      year: searchType === "month" && selectedYear ? selectedYear : undefined,
      startDate: searchType === "range" && startDate ? startDate : undefined,
      endDate: searchType === "range" && endDate ? endDate : undefined,
    },
    {
      skip: !selectedTrainerId,
    }
  );
  
  // Normalize trainers data
  const trainers = useMemo(() => {
    if (!trainersData) return [];
    if (Array.isArray(trainersData)) return trainersData;
    if (trainersData.data && Array.isArray(trainersData.data)) return trainersData.data;
    if (trainersData.success && trainersData.data && Array.isArray(trainersData.data)) return trainersData.data;
    return [];
  }, [trainersData]);
  
  // Normalize trainer details
  const trainerDetails = useMemo(() => {
    if (!trainerDetailsData) return null;
    return trainerDetailsData.data || trainerDetailsData;
  }, [trainerDetailsData]);
  
  // Get months list
  const months = [
    { value: "1", label: "يناير" },
    { value: "2", label: "فبراير" },
    { value: "3", label: "مارس" },
    { value: "4", label: "أبريل" },
    { value: "5", label: "مايو" },
    { value: "6", label: "يونيو" },
    { value: "7", label: "يوليو" },
    { value: "8", label: "أغسطس" },
    { value: "9", label: "سبتمبر" },
    { value: "10", label: "أكتوبر" },
    { value: "11", label: "نوفمبر" },
    { value: "12", label: "ديسمبر" },
  ];
  
  // Get years list (current year and past 5 years)
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearsList = [];
    for (let i = 0; i < 6; i++) {
      yearsList.push((currentYear - i).toString());
    }
    return yearsList;
  }, []);
  
  // Handle search
  const handleSearch = () => {
    if (!selectedTrainerId) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار المدرب",
        variant: "destructive",
      });
      return;
    }
    
    if (searchType === "month" && !selectedMonth) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار الشهر",
        variant: "destructive",
      });
      return;
    }
    
    if (searchType === "range" && (!startDate || !endDate)) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار تاريخ البداية والنهاية",
        variant: "destructive",
      });
      return;
    }
    
    refetchDetails();
  };
  
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
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">بحث عن المدرب</h1>
            <p className="text-gray-600 mt-1">عرض تفاصيل المدرب وإحصائياته</p>
          </div>
        </div>

        {/* Search Filters */}
        <Card>
          <CardHeader>
            <CardTitle>معايير البحث</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اختر المدرب *</Label>
                <Select
                  value={selectedTrainerId || undefined}
                  onValueChange={setSelectedTrainerId}
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
                <Label>نوع البحث</Label>
                <Select
                  value={searchType}
                  onValueChange={(value: "month" | "range") => setSearchType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">البحث بالشهور</SelectItem>
                    <SelectItem value="range">البحث من فترة إلى فترة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {searchType === "month" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الشهر *</Label>
                  <Select
                    value={selectedMonth}
                    onValueChange={setSelectedMonth}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الشهر" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>السنة</Label>
                  <Select
                    value={selectedYear}
                    onValueChange={setSelectedYear}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>من تاريخ *</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>إلى تاريخ *</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <Button
              onClick={handleSearch}
              disabled={isLoadingDetails || !selectedTrainerId}
              className="w-full md:w-auto"
            >
              {isLoadingDetails ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري البحث...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 ml-2" />
                  بحث
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Trainer Details */}
        {isLoadingDetails ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : trainerDetails ? (
          <>
            {/* Trainer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  معلومات المدرب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="text-sm">الاسم</span>
                    </div>
                    <p className="font-semibold text-lg">{trainerDetails.trainer?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">البريد الإلكتروني</span>
                    </div>
                    <p className="font-semibold">{trainerDetails.trainer?.email || "غير متوفر"}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">الهاتف</span>
                    </div>
                    <p className="font-semibold">{trainerDetails.trainer?.phone || "غير متوفر"}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">التخصص</span>
                    </div>
                    <p className="font-semibold">{trainerDetails.trainer?.specialization || "غير محدد"}</p>
                  </div>
                  {trainerDetails.trainer?.experience && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Award className="w-4 h-4" />
                        <span className="text-sm">سنوات الخبرة</span>
                      </div>
                      <p className="font-semibold">{trainerDetails.trainer.experience} سنة</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">إجمالي الحصص</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {trainerDetails.statistics?.totalClasses || 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">عدد الأيام</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {trainerDetails.statistics?.totalDays || 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">إجمالي الحجوزات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {trainerDetails.statistics?.totalEnrollments || 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">عدد الأعضاء</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    {trainerDetails.statistics?.totalMembers || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Salary and Earnings */}
            {trainerDetails.salary && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card className="border-l-4 border-l-indigo-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">المرتب الأساسي</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-indigo-600">
                      {parseFloat(trainerDetails.statistics?.baseSalary || 0).toLocaleString()} جم
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-teal-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">نسبة الحصص (%)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-teal-600">
                      {trainerDetails.salary?.classCommissionPercentage || 0}%
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-cyan-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">إيرادات الحصص</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-cyan-600">
                      {parseFloat(trainerDetails.statistics?.totalClassEarnings || 0).toLocaleString()} جم
                    </div>
                  </CardContent>
                </Card>
              <Card className="border-l-4 border-l-pink-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">عمولة الحصص</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-pink-600">
                    {parseFloat(trainerDetails.statistics?.totalClassCommission || 0).toLocaleString()} جم
                  </div>
                </CardContent>
              </Card>
              {trainerDetails.statistics?.totalSubscriptions > 0 && (
                <>
                  <Card className="border-l-4 border-l-violet-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">إيرادات الاشتراكات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-violet-600">
                        {parseFloat(trainerDetails.statistics?.totalSubscriptionEarnings || 0).toLocaleString()} جم
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-fuchsia-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">عمولة الاشتراكات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-fuchsia-600">
                        {parseFloat(trainerDetails.statistics?.totalSubscriptionCommission || 0).toLocaleString()} جم
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
              <Card className="border-l-4 border-l-emerald-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">الإجمالي</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">
                    {parseFloat(trainerDetails.statistics?.totalEarnings || 0).toLocaleString()} جم
                  </div>
                </CardContent>
              </Card>
              </div>
            )}

            {/* Subscriptions */}
            {trainerDetails.subscriptions && trainerDetails.subscriptions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    الاشتراكات ({trainerDetails.subscriptions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>رقم الاشتراك</TableHead>
                          <TableHead>اسم العميل</TableHead>
                          <TableHead>نوع الاشتراك</TableHead>
                          <TableHead>العضو</TableHead>
                          <TableHead>تاريخ البداية</TableHead>
                          <TableHead>تاريخ النهاية</TableHead>
                          <TableHead>القيمة</TableHead>
                          <TableHead>المدفوع</TableHead>
                          <TableHead>المتبقي</TableHead>
                          <TableHead>الحالة</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trainerDetails.subscriptions.map((subscription: any) => (
                          <TableRow key={subscription.id}>
                            <TableCell className="font-medium">{subscription.subscriptionNumber}</TableCell>
                            <TableCell>{subscription.customerName}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{subscription.subscriptionType}</Badge>
                              {subscription.isSpecial && (
                                <Badge className="bg-purple-500 ml-2">خاص</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {subscription.member ? (
                                <div>
                                  <div className="font-medium">{subscription.member.name}</div>
                                  <div className="text-sm text-gray-500">{subscription.member.memberCode}</div>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>{subscription.subscriptionStartDate}</TableCell>
                            <TableCell>{subscription.subscriptionEndDate}</TableCell>
                            <TableCell className="font-semibold">
                              {parseFloat(subscription.subscriptionValue || 0).toLocaleString()} جم
                            </TableCell>
                            <TableCell className="text-green-600">
                              {parseFloat(subscription.paidAmount || 0).toLocaleString()} جم
                            </TableCell>
                            <TableCell className="text-red-600">
                              {parseFloat(subscription.remainingAmount || 0).toLocaleString()} جم
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  subscription.status === "active"
                                    ? "bg-green-500"
                                    : subscription.status === "expired"
                                    ? "bg-gray-500"
                                    : "bg-blue-500"
                                }
                              >
                                {subscription.status === "active"
                                  ? "نشط"
                                  : subscription.status === "expired"
                                  ? "منتهي"
                                  : "قادم"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Classes by Date */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  الحصص
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!trainerDetails.classes || Object.keys(trainerDetails.classes).length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    لا توجد حصص في الفترة المحددة
                  </div>
                ) : (
                  <Tabs defaultValue={Object.keys(trainerDetails.classes)[0]} className="w-full">
                    <TabsList className="grid w-full grid-cols-auto gap-2 overflow-x-auto">
                      {Object.keys(trainerDetails.classes)
                        .sort()
                        .reverse()
                        .map((date) => (
                          <TabsTrigger key={date} value={date}>
                            {formatDate(date)}
                          </TabsTrigger>
                        ))}
                    </TabsList>
                    {Object.entries(trainerDetails.classes)
                      .sort(([a], [b]) => b.localeCompare(a))
                      .map(([date, classes]: [string, any]) => (
                        <TabsContent key={date} value={date} className="mt-4">
                          <div className="space-y-4">
                            {classes.map((classRecord: any) => (
                              <Card key={classRecord.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-3">
                                        <h4 className="text-lg font-semibold">{classRecord.className}</h4>
                                        {getStatusBadge(classRecord.status)}
                                      </div>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center gap-2">
                                          <Clock className="w-4 h-4" />
                                          <span>{classRecord.startTime} - {classRecord.endTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Users className="w-4 h-4" />
                                          <span>{classRecord.enrollments}/{classRecord.maxCapacity}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <DollarSign className="w-4 h-4" />
                                          <span>السعر: {parseFloat(classRecord.price || 0).toLocaleString()} جم</span>
                                        </div>
                                        {trainerDetails.salary && (
                                          <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4" />
                                            <span>
                                              العمولة: {(
                                                (parseFloat(classRecord.price || 0) * classRecord.enrollments * 
                                                parseFloat(trainerDetails.salary.classCommissionPercentage || 0)) / 100
                                              ).toLocaleString()} جم
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Members */}
                                      {classRecord.members && classRecord.members.length > 0 && (
                                        <div className="mt-4 border-t pt-4">
                                          <h5 className="font-semibold mb-2 flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            الأعضاء ({classRecord.members.length})
                                          </h5>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {classRecord.members.map((member: any) => (
                                              <Badge
                                                key={member.id}
                                                variant="outline"
                                                className="flex items-center gap-2 justify-start p-2"
                                              >
                                                <User className="w-3 h-3" />
                                                <span>{member.name} ({member.memberCode})</span>
                                                {member.attendanceStatus === "attended" && (
                                                  <Badge className="bg-green-500 ml-auto">حاضر</Badge>
                                                )}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </TabsContent>
                      ))}
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </>
        ) : selectedTrainerId ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              اختر معايير البحث واضغط على زر البحث
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              اختر المدرب واختر معايير البحث
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
};

export default TrainerSearch;

