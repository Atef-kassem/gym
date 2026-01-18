import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useGetInvitationsByStatusQuery } from "@/services/appManagementApi";
import { XCircle, Search, Download } from "lucide-react";

const RejectedInvitations = () => {
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");

  // جلب الدعوات المرفوضة
  const { data: invitationsData } = useGetInvitationsByStatusQuery("rejected");
  const invitations = Array.isArray(invitationsData?.data) ? invitationsData.data : [];

  const filteredInvitations = invitations.filter(inv => {
    return !searchQuery ||
      inv.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.recipientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.rejectionReason?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const stats = { total: invitations.length };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-600" />
              الدعوات المرفوضة
            </h1>
            <p className="text-gray-600 mt-1">الدعوات التي تم رفضها</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </Button>
          </div>
        </div>

        {/* البطاقات الإحصائية */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي الدعوات المرفوضة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.total}</div>
          </CardContent>
        </Card>

        {/* الجدول */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الدعوات المرفوضة ({filteredInvitations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">اسم المستلم</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">البريد الإلكتروني</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">رقم الدعوة</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">تاريخ الرفض</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">سبب الرفض</th>
                    <th className="text-right py-3 px-4 font-semibold whitespace-nowrap">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvitations.map((inv) => (
                    <tr key={inv.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 whitespace-nowrap">{inv.recipientName}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{inv.recipientEmail}</td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono">{inv.invitationCode}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{inv.rejectedDate}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{inv.rejectionReason || "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge variant="destructive">مرفوضة</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredInvitations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <XCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>لا توجد دعوات مرفوضة</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RejectedInvitations;

