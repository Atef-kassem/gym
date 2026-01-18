import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  useGetAllLockerSubscriptionsQuery,
  useGetLockerStatisticsQuery,
  useDeleteLockerMutation,
} from "@/services/lockersApi";
import {
  Plus, Search, Edit, Trash2, Lock, Filter, Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LockersList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBranch, setFilterBranch] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: branchesData } = useGetAllBranchesQuery(undefined as any);
  const branches = Array.isArray(branchesData?.data) ? branchesData.data : [];

  // جلب اشتراكات اللوكر من API
  const { data: lockersData, isLoading: lockersLoading, refetch: refetchLockers } = useGetAllLockerSubscriptionsQuery({
    search: searchQuery,
    mainBranchId: filterBranch !== "all" ? filterBranch : undefined,
    status: filterStatus !== "all" ? filterStatus : undefined,
  });
  const lockers = Array.isArray(lockersData?.data) ? lockersData.data : [];

  // جلب الإحصائيات
  const { data: statisticsData } = useGetLockerStatisticsQuery();
  const statistics = statisticsData?.data || {};

  // Mutations
  const [deleteLocker] = useDeleteLockerMutation();

  // تحويل التاريخ من yyyy-mm-dd إلى dd/mm/yyyy
  const convertDateFromISO = (dateStr: string): string => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return "";
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  };

  // حساب حالة الاشتراك
  const getSubscriptionStatus = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return "غير محدد";
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (today < start) return "قادم";
    if (today > end) return "منتهي";
    return "نشط";
  };

  // فلترة اللوكر - يتم في API
  const filteredLockers = lockers;

  // إحصائيات - يتم جلبها من API
  const stats = {
    total: statistics.total || 0,
    active: statistics.activeSubscriptions || 0,
    expired: statistics.expiredSubscriptions || 0,
  };

  const getStatusBadge = (startDate: string, endDate: string) => {
    const status = getSubscriptionStatus(startDate, endDate);
    if (status === "نشط") {
      return <Badge className="bg-green-500">نشط</Badge>;
    } else if (status === "منتهي") {
      return <Badge variant="destructive">منتهي</Badge>;
    } else {
      return <Badge className="bg-blue-500">قادم</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان والبحث */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">قائمة اللوكر</h1>
            <p className="text-gray-600 mt-1">إدارة اشتراكات اللوكر</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن لوكر..."
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
              {(filterBranch !== "all" || filterStatus !== "all") && (
                <Badge className="bg-blue-500">{[filterBranch, filterStatus].filter(f => f !== "all").length}</Badge>
              )}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/gym/add-locker")}>
              <Plus className="w-5 h-5 ml-2" />
              إضافة لوكر جديد
            </Button>
          </div>
        </div>

        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي اللوكر</span>
                <Lock className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>النشطة</span>
                <Lock className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>المنتهية</span>
                <Lock className="w-5 h-5 text-red-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.expired}</div>
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
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">الفرع</label>
                  <Select value={filterBranch} onValueChange={setFilterBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الفروع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الفروع</SelectItem>
                      {branches.map((branch: any) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.arabicName || branch.englishName || branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">الحالة</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الحالات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="نشط">نشط</SelectItem>
                      <SelectItem value="منتهي">منتهي</SelectItem>
                      <SelectItem value="قادم">قادم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* الجدول */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                قائمة اللوكر ({filteredLockers.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">رقم الإشتراك</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الفرع الرئيسي</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الفرع الفرعي</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">اسم العميل</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">نوع الاشتراك</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">رقم اللوكر</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">من</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">إلى</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">قيمة الإشتراك</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLockers.map((locker) => (
                    <tr key={locker.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-sm">{locker.subscriptionNumber}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        {branches.find((b: any) => b.id === locker.mainBranchId)?.arabicName ||
                          branches.find((b: any) => b.id === locker.mainBranchId)?.englishName ||
                          branches.find((b: any) => b.id === locker.mainBranchId)?.name || "-"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        {branches.find((b: any) => b.id === locker.subBranchId)?.arabicName ||
                          branches.find((b: any) => b.id === locker.subBranchId)?.englishName ||
                          branches.find((b: any) => b.id === locker.subBranchId)?.name || "-"}
                      </td>
                      <td className="py-3 px-4 font-semibold whitespace-nowrap">{locker.customerName}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        {typeof locker.subscriptionType === "string"
                          ? locker.subscriptionType
                          : locker.subscriptionType?.name || "-"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm font-semibold">{locker.lockerNumber}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        {locker.subscriptionStartDate ? (locker.subscriptionStartDate.includes('/') ? locker.subscriptionStartDate : convertDateFromISO(locker.subscriptionStartDate)) : "-"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">
                        {locker.subscriptionEndDate ? (locker.subscriptionEndDate.includes('/') ? locker.subscriptionEndDate : convertDateFromISO(locker.subscriptionEndDate)) : "-"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm">{parseFloat(locker.subscriptionValue || 0).toLocaleString()}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getStatusBadge(locker.subscriptionStartDate, locker.subscriptionEndDate)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" title="تعديل" className="hover:bg-blue-50">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" title="حذف" className="hover:bg-red-50">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredLockers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Lock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>لا توجد نتائج مطابقة</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LockersList;

