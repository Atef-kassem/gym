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
import { useGetInvitationsByStatusQuery } from "@/services/appManagementApi";
import { Calendar, Search, Filter, Download, UserCheck, Building } from "lucide-react";

const AttendedInvitations = () => {
  const { toast } = useToast();
  const { data: branchesData } = useGetAllBranchesQuery(undefined as any);
  const branches = Array.isArray(branchesData?.data) ? branchesData.data : [];
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBranch, setFilterBranch] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // جلب الدعوات المسجلة حضور
  const { data: invitationsData } = useGetInvitationsByStatusQuery("attended");
  const invitations = Array.isArray(invitationsData?.data) ? invitationsData.data : [];

  const filteredInvitations = invitations.filter(inv => {
    const matchesSearch = !searchQuery ||
      inv.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.recipientEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBranch = filterBranch === "all" || inv.branchId === filterBranch;
    
    return matchesSearch && matchesBranch;
  });

  const stats = { total: invitations.length };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-blue-600" />
              الدعوات المسجلة حضور بالفرع
            </h1>
            <p className="text-gray-600 mt-1">الدعوات التي تم تسجيل حضورها في الفروع</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث..."
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
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </Button>
          </div>
        </div>

        {/* البطاقات الإحصائية */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              إجمالي الدعوات المسجلة حضور
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          </CardContent>
        </Card>

        {/* الفلاتر */}
        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    الفرع
                  </label>
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
              </div>
            </CardContent>
          </Card>
        )}

        {/* الجدول */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الدعوات المسجلة حضور ({filteredInvitations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">اسم المستلم</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">البريد الإلكتروني</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الفرع</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">تاريخ الحضور</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvitations.map((inv) => (
                    <tr key={inv.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 whitespace-nowrap">{inv.recipientName}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{inv.recipientEmail}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {branches.find((b: any) => b.id === inv.branchId)?.arabicName ||
                         branches.find((b: any) => b.id === inv.branchId)?.englishName ||
                         branches.find((b: any) => b.id === inv.branchId)?.name || "-"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{inv.attendanceDate}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge className="bg-blue-500">حاضر</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredInvitations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <UserCheck className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>لا توجد دعوات مسجلة حضور</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendedInvitations;

