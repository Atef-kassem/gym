import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, UserCheck, AlertTriangle } from "lucide-react";

interface AttendanceLeaveTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

const AttendanceLeaveTab = ({ formData, setFormData }: AttendanceLeaveTabProps) => {
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLeaveBalanceChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      leaveBalance: { ...formData.leaveBalance, [field]: value }
    });
  };

  const handleAttendanceChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      attendance: { ...formData.attendance, [field]: value }
    });
  };

  return (
    <div className="space-y-6">
      {/* أرصدة الإجازات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            أرصدة الإجازات الحالية
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="annualLeave">الإجازة السنوية</Label>
            <Input
              id="annualLeave"
              type="number"
              value={formData.leaveBalance?.annual || ""}
              onChange={(e) => handleLeaveBalanceChange("annual", e.target.value)}
              placeholder="30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sickLeave">الإجازة المرضية</Label>
            <Input
              id="sickLeave"
              type="number"
              value={formData.leaveBalance?.sick || ""}
              onChange={(e) => handleLeaveBalanceChange("sick", e.target.value)}
              placeholder="15"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyLeave">الإجازة الطارئة</Label>
            <Input
              id="emergencyLeave"
              type="number"
              value={formData.leaveBalance?.emergency || ""}
              onChange={(e) => handleLeaveBalanceChange("emergency", e.target.value)}
              placeholder="5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maternityleave">إجازة الأمومة</Label>
            <Input
              id="maternityleave"
              type="number"
              value={formData.leaveBalance?.maternity || ""}
              onChange={(e) => handleLeaveBalanceChange("maternity", e.target.value)}
              placeholder="70"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hajjLeave">إجازة الحج</Label>
            <Input
              id="hajjLeave"
              type="number"
              value={formData.leaveBalance?.hajj || ""}
              onChange={(e) => handleLeaveBalanceChange("hajj", e.target.value)}
              placeholder="15"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unpaidLeave">الإجازة بدون راتب</Label>
            <Input
              id="unpaidLeave"
              type="number"
              value={formData.leaveBalance?.unpaid || ""}
              onChange={(e) => handleLeaveBalanceChange("unpaid", e.target.value)}
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      {/* معلومات الحضور والانصراف */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            معلومات الحضور والانصراف
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workSchedule">جدول العمل</Label>
            <Select value={formData.attendance?.schedule || ""} onValueChange={(value) => handleAttendanceChange("schedule", value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر جدول العمل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ثابت">دوام ثابت</SelectItem>
                <SelectItem value="مرن">دوام مرن</SelectItem>
                <SelectItem value="ورديات">نظام الورديات</SelectItem>
                <SelectItem value="جزئي">دوام جزئي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workingHours">ساعات العمل اليومية</Label>
            <Input
              id="workingHours"
              type="number"
              value={formData.attendance?.dailyHours || ""}
              onChange={(e) => handleAttendanceChange("dailyHours", e.target.value)}
              placeholder="8"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkInTime">وقت الحضور</Label>
            <Input
              id="checkInTime"
              type="time"
              value={formData.attendance?.checkInTime || ""}
              onChange={(e) => handleAttendanceChange("checkInTime", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkOutTime">وقت الانصراف</Label>
            <Input
              id="checkOutTime"
              type="time"
              value={formData.attendance?.checkOutTime || ""}
              onChange={(e) => handleAttendanceChange("checkOutTime", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="overtime">الساعات الإضافية (هذا الشهر)</Label>
            <Input
              id="overtime"
              type="number"
              value={formData.attendance?.overtime || ""}
              onChange={(e) => handleAttendanceChange("overtime", e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="breakTime">فترة الاستراحة (دقيقة)</Label>
            <Input
              id="breakTime"
              type="number"
              value={formData.attendance?.breakTime || ""}
              onChange={(e) => handleAttendanceChange("breakTime", e.target.value)}
              placeholder="60"
            />
          </div>
        </CardContent>
      </Card>

      {/* الغيابات والتأخيرات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            الغيابات والتأخيرات
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="absences">مجموع الغيابات (هذا العام)</Label>
            <Input
              id="absences"
              type="number"
              value={formData.attendance?.totalAbsences || ""}
              onChange={(e) => handleAttendanceChange("totalAbsences", e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lateness">عدد التأخيرات (هذا الشهر)</Label>
            <Input
              id="lateness"
              type="number"
              value={formData.attendance?.monthlyLateness || ""}
              onChange={(e) => handleAttendanceChange("monthlyLateness", e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="earlyLeaves">الانصراف المبكر (هذا الشهر)</Label>
            <Input
              id="earlyLeaves"
              type="number"
              value={formData.attendance?.monthlyEarlyLeaves || ""}
              onChange={(e) => handleAttendanceChange("monthlyEarlyLeaves", e.target.value)}
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      {/* ملاحظات الحضور */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            ملاحظات الحضور
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="attendanceNotes">ملاحظات خاصة بالحضور والانصراف</Label>
            <Textarea
              id="attendanceNotes"
              value={formData.attendance?.notes || ""}
              onChange={(e) => handleAttendanceChange("notes", e.target.value)}
              placeholder="أي ملاحظات خاصة حول جدول العمل أو الحضور..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceLeaveTab;