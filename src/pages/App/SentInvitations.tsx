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
import { useGetInvitationsByStatusQuery } from "@/services/appManagementApi";
import {
  Mail, Search, Filter, Download, Send, Eye, Trash2
} from "lucide-react";

const SentInvitations = () => {
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // جلب جميع الدعوات المرسلة (status = pending أو accepted أو rejected)
  const { data: invitationsData, isLoading } = useGetInvitationsByStatusQuery("pending");
  const invitations = Array.isArray(invitationsData?.data) ? invitationsData.data : [];

  const filteredInvitations = useMemo(() => {
    return invitations.filter(inv => {
      const matchesSearch = !searchQuery ||
        inv.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.recipientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.invitationCode?.includes(searchQuery);
      
      const matchesStatus = filterStatus === "all" || inv.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [invitations, searchQuery, filterStatus]);

  const stats = useMemo(() => {
    const total = invitations.length;
    const pending = invitations.filter(i => i.status === "pending").length;
    const accepted = invitations.filter(i => i.status === "accepted").length;
    const rejected = invitations.filter(i => i.status === "rejected").length;

    return { total, pending, accepted, rejected };
  }, [invitations]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Send className="w-8 h-8 text-blue-600" />
              الدعوات المرسلة
            </h1>
            <p className="text-gray-600 mt-1">إدارة الدعوات المرسلة للأعضاء</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي الدعوات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">قيد الانتظار</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">مقبولة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.accepted}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">مرفوضة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* الفلاتر */}
        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">الحالة</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الحالات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="pending">قيد الانتظار</SelectItem>
                      <SelectItem value="accepted">مقبولة</SelectItem>
                      <SelectItem value="rejected">مرفوضة</SelectItem>
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
            <CardTitle>قائمة الدعوات المرسلة ({filteredInvitations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">اسم المستلم</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">البريد الإلكتروني</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">رقم الدعوة</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">تاريخ الإرسال</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الحالة</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvitations.map((inv) => (
                    <tr key={inv.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 whitespace-nowrap">{inv.recipientName}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{inv.recipientEmail}</td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono">{inv.invitationCode}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{inv.sentDate}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {inv.status === "pending" && <Badge className="bg-yellow-500">قيد الانتظار</Badge>}
                        {inv.status === "accepted" && <Badge className="bg-green-500">مقبولة</Badge>}
                        {inv.status === "rejected" && <Badge variant="destructive">مرفوضة</Badge>}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                            <Eye className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-red-50">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredInvitations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>لا توجد دعوات مرسلة</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SentInvitations;

