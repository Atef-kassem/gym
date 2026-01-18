import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building2, User, Calendar, Clock, FileText } from "lucide-react";

interface EmploymentInfoTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

const EmploymentInfoTab = ({ formData, setFormData }: EmploymentInfoTabProps) => {
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const departments = [
    "الصيانة", "الاستقبال", "المالية", "الموارد البشرية", "التسويق", 
    "المبيعات", "خدمة العملاء", "تقنية المعلومات", "الجودة", "الإدارة العامة"
  ];

  const positions = [
    "فني صيانة سيارات", "مستقبل عملاء", "محاسب", "مدير", "مشرف",
    "موظف مبيعات", "خدمة عملاء", "مطور", "مصمم", "أخصائي"
  ];

  const branches = [
    "الفرع الرئيسي", "فرع شمال الرياض", "فرع جنوب الرياض", 
    "فرع الدمام", "فرع جدة", "فرع مكة"
  ];

  const workSchedules = [
    "دوام كامل (8 ساعات)", "دوام جزئي (4 ساعات)", "وردية صباحية", 
    "وردية مسائية", "وردية ليلية", "دوام مرن", "عمل عن بعد"
  ];

  const contractTypes = [
    "عقد دائم", "عقد مؤقت", "عقد تجربة", "عقد موسمي", 
    "عقد استشاري", "عقد بدوام جزئي", "عقد مشروع"
  ];

  return (
    <div className="space-y-6">
      {/* المعلومات الوظيفية الأساسية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            المعلومات الوظيفية الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">الرقم الوظيفي *</Label>
            <Input
              id="employeeId"
              value={formData.employeeId || ""}
              onChange={(e) => handleInputChange("employeeId", e.target.value)}
              placeholder="EMP001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hireDate">تاريخ التعيين *</Label>
            <Input
              id="hireDate"
              type="date"
              value={formData.hireDate || ""}
              onChange={(e) => handleInputChange("hireDate", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">المسمى الوظيفي *</Label>
            <Select value={formData.position || ""} onValueChange={(value) => handleInputChange("position", value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر المسمى الوظيفي" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((position) => (
                  <SelectItem key={position} value={position}>{position}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">القسم / الإدارة *</Label>
            <Select value={formData.department || ""} onValueChange={(value) => handleInputChange("department", value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر القسم" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch">الفرع / الموقع *</Label>
            <Select value={formData.branch || ""} onValueChange={(value) => handleInputChange("branch", value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الفرع" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manager">المدير المباشر</Label>
            <Input
              id="manager"
              value={formData.manager || ""}
              onChange={(e) => handleInputChange("manager", e.target.value)}
              placeholder="اسم المدير المباشر"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeLevel">الدرجة / الرتبة الوظيفية</Label>
            <Select value={formData.employeeLevel || ""} onValueChange={(value) => handleInputChange("employeeLevel", value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الدرجة الوظيفية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="junior">مبتدئ</SelectItem>
                <SelectItem value="intermediate">متوسط</SelectItem>
                <SelectItem value="senior">متقدم</SelectItem>
                <SelectItem value="lead">قائد فريق</SelectItem>
                <SelectItem value="supervisor">مشرف</SelectItem>
                <SelectItem value="manager">مدير</SelectItem>
                <SelectItem value="senior_manager">مدير أول</SelectItem>
                <SelectItem value="director">مدير عام</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeStatus">حالة الموظف *</Label>
            <Select value={formData.employeeStatus || ""} onValueChange={(value) => handleInputChange("employeeStatus", value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر حالة الموظف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="on_leave">في إجازة</SelectItem>
                <SelectItem value="suspended">موقوف</SelectItem>
                <SelectItem value="terminated">منتهي الخدمة</SelectItem>
                <SelectItem value="probation">فترة تجربة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* جدول العمل والعقد */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            جدول العمل والعقد
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workSchedule">جدول العمل / الوردية *</Label>
            <Select value={formData.workSchedule || ""} onValueChange={(value) => handleInputChange("workSchedule", value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر جدول العمل" />
              </SelectTrigger>
              <SelectContent>
                {workSchedules.map((schedule) => (
                  <SelectItem key={schedule} value={schedule}>{schedule}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractType">طريقة التوظيف *</Label>
            <Select value={formData.contractType || ""} onValueChange={(value) => handleInputChange("contractType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع العقد" />
              </SelectTrigger>
              <SelectContent>
                {contractTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractStartDate">تاريخ بداية العقد</Label>
            <Input
              id="contractStartDate"
              type="date"
              value={formData.contractStartDate || ""}
              onChange={(e) => handleInputChange("contractStartDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractEndDate">تاريخ نهاية العقد</Label>
            <Input
              id="contractEndDate"
              type="date"
              value={formData.contractEndDate || ""}
              onChange={(e) => handleInputChange("contractEndDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="probationPeriod">فترة التجربة (بالأشهر)</Label>
            <Input
              id="probationPeriod"
              type="number"
              value={formData.probationPeriod || ""}
              onChange={(e) => handleInputChange("probationPeriod", e.target.value)}
              placeholder="3"
              min="0"
              max="12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="probationEndDate">تاريخ انتهاء فترة التجربة</Label>
            <Input
              id="probationEndDate"
              type="date"
              value={formData.probationEndDate || ""}
              onChange={(e) => handleInputChange("probationEndDate", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* تفاصيل إضافية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            تفاصيل إضافية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobDescription">الوصف الوظيفي</Label>
            <Textarea
              id="jobDescription"
              value={formData.jobDescription || ""}
              onChange={(e) => handleInputChange("jobDescription", e.target.value)}
              placeholder="وصف تفصيلي للمهام والمسؤوليات"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualifications">المؤهلات المطلوبة</Label>
            <Textarea
              id="qualifications"
              value={formData.qualifications || ""}
              onChange={(e) => handleInputChange("qualifications", e.target.value)}
              placeholder="المؤهلات والخبرات المطلوبة للوظيفة"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportingStructure">الهيكل الإداري</Label>
            <Textarea
              id="reportingStructure"
              value={formData.reportingStructure || ""}
              onChange={(e) => handleInputChange("reportingStructure", e.target.value)}
              placeholder="تفاصيل الهيكل الإداري وسلسلة التقارير"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmploymentInfoTab;