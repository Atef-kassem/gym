import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, Calculator, CheckCircle, XCircle, AlertTriangle, FileText } from "lucide-react";

interface OffboardingTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

const OffboardingTab = ({ formData, setFormData }: OffboardingTabProps) => {
  const handleOffboardingChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      offboarding: { ...formData.offboarding, [field]: value }
    });
  };

  const handleClearanceChange = (department: string, status: boolean) => {
    const clearanceList = formData.offboarding?.clearanceList || {};
    handleOffboardingChange("clearanceList", {
      ...clearanceList,
      [department]: status
    });
  };

  const handleFinalSettlementChange = (field: string, value: string) => {
    handleOffboardingChange("finalSettlement", {
      ...formData.offboarding?.finalSettlement,
      [field]: value
    });
  };

  const clearanceDepartments = [
    { id: "hr", name: "الموارد البشرية" },
    { id: "finance", name: "المالية" },
    { id: "it", name: "تقنية المعلومات" },
    { id: "security", name: "الأمن" },
    { id: "assets", name: "العهد والممتلكات" },
    { id: "manager", name: "المدير المباشر" },
    { id: "library", name: "المكتبة" },
    { id: "medical", name: "الطبي" }
  ];

  const isActive = formData.status !== "منتهي" && formData.status !== "مستقيل";

  return (
    <div className="space-y-6">
      {isActive ? (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-700">
              <AlertTriangle className="w-5 h-5" />
              <span>هذا الموظف ما زال نشطاً في النظام. بيانات إنهاء الخدمة ستظهر عند تحديث حالة الموظف.</span>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* معلومات إنهاء الخدمة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            معلومات إنهاء الخدمة
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="terminationDate">تاريخ إنهاء الخدمة</Label>
            <Input
              id="terminationDate"
              type="date"
              value={formData.offboarding?.terminationDate || ""}
              onChange={(e) => handleOffboardingChange("terminationDate", e.target.value)}
              disabled={isActive}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastWorkingDay">آخر يوم عمل</Label>
            <Input
              id="lastWorkingDay"
              type="date"
              value={formData.offboarding?.lastWorkingDay || ""}
              onChange={(e) => handleOffboardingChange("lastWorkingDay", e.target.value)}
              disabled={isActive}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="terminationReason">سبب إنهاء الخدمة</Label>
            <Select 
              value={formData.offboarding?.terminationReason || ""} 
              onValueChange={(value) => handleOffboardingChange("terminationReason", value)}
              disabled={isActive}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختج.مبب إنهاء الخدمة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="استقالة">استقالة</SelectItem>
                <SelectItem value="انتهاء عقد">انتهاء عقد</SelectItem>
                <SelectItem value="تقاعد">تقاعد</SelectItem>
                <SelectItem value="فصل">فصل</SelectItem>
                <SelectItem value="إنهاء خدمات">إنهاء خدمات</SelectItem>
                <SelectItem value="وفاة">وفاة</SelectItem>
                <SelectItem value="نقل">نقل لجهة أخرى</SelectItem>
                <SelectItem value="أخرى">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="terminationType">نوع الإنهاء</Label>
            <Select 
              value={formData.offboarding?.terminationType || ""} 
              onValueChange={(value) => handleOffboardingChange("terminationType", value)}
              disabled={isActive}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع الإنهاء" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ودي">إنهاء ودي</SelectItem>
                <SelectItem value="غير ودي">إنهاء غير ودي</SelectItem>
                <SelectItem value="قانوني">إنهاء قانوني</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="terminationDetails">تفاصيل إنهاء الخدمة</Label>
            <Textarea
              id="terminationDetails"
              value={formData.offboarding?.terminationDetails || ""}
              onChange={(e) => handleOffboardingChange("terminationDetails", e.target.value)}
              placeholder="تفاصيل وملاحظات حول إنهاء الخدمة..."
              rows={3}
              disabled={isActive}
            />
          </div>
        </CardContent>
      </Card>

      {/* قائمة إخلاء الطرف */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            قائمة إخلاء الطرف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clearanceDepartments.map((dept) => (
              <div key={dept.id} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={dept.id}
                  checked={formData.offboarding?.clearanceList?.[dept.id] || false}
                  onCheckedChange={(checked) => handleClearanceChange(dept.id, checked as boolean)}
                  disabled={isActive}
                />
                <Label htmlFor={dept.id} className="flex items-center gap-2">
                  {formData.offboarding?.clearanceList?.[dept.id] ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  {dept.name}
                </Label>
              </div>
            ))}
          </div>

          {!isActive && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">حالة إخلاء الطرف:</span>
                <Badge 
                  variant={
                    clearanceDepartments.every(dept => formData.offboarding?.clearanceList?.[dept.id]) 
                      ? "default" 
                      : "secondary"
                  }
                >
                  {clearanceDepartments.every(dept => formData.offboarding?.clearanceList?.[dept.id]) 
                    ? "مكتمل" 
                    : "غير مكتمل"}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                تم إنجاز {clearanceDepartments.filter(dept => formData.offboarding?.clearanceList?.[dept.id]).length} من {clearanceDepartments.length} إجراءات
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* التسوية المالية النهائية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            التسوية المالية النهائية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="finalSalary">الراتب النهائي</Label>
              <Input
                id="finalSalary"
                type="number"
                value={formData.offboarding?.finalSettlement?.finalSalary || ""}
                onChange={(e) => handleFinalSettlementChange("finalSalary", e.target.value)}
                placeholder="0.00"
                disabled={isActive}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vacationBalance">رصيد الإجازات</Label>
              <Input
                id="vacationBalance"
                type="number"
                value={formData.offboarding?.finalSettlement?.vacationBalance || ""}
                onChange={(e) => handleFinalSettlementChange("vacationBalance", e.target.value)}
                placeholder="0.00"
                disabled={isActive}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endOfServiceBenefit">مكافأة نهاية الخدمة</Label>
              <Input
                id="endOfServiceBenefit"
                type="number"
                value={formData.offboarding?.finalSettlement?.endOfServiceBenefit || ""}
                onChange={(e) => handleFinalSettlementChange("endOfServiceBenefit", e.target.value)}
                placeholder="0.00"
                disabled={isActive}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="overtime">الساعات الإضافية</Label>
              <Input
                id="overtime"
                type="number"
                value={formData.offboarding?.finalSettlement?.overtime || ""}
                onChange={(e) => handleFinalSettlementChange("overtime", e.target.value)}
                placeholder="0.00"
                disabled={isActive}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deductions">الخصومات</Label>
              <Input
                id="deductions"
                type="number"
                value={formData.offboarding?.finalSettlement?.deductions || ""}
                onChange={(e) => handleFinalSettlementChange("deductions", e.target.value)}
                placeholder="0.00"
                disabled={isActive}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loans">السلف والقروض</Label>
              <Input
                id="loans"
                type="number"
                value={formData.offboarding?.finalSettlement?.loans || ""}
                onChange={(e) => handleFinalSettlementChange("loans", e.target.value)}
                placeholder="0.00"
                disabled={isActive}
              />
            </div>
          </div>

          {!isActive && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>صافي المستحقات:</span>
                <span className="text-primary">
                  {(
                    (parseFloat(formData.offboarding?.finalSettlement?.finalSalary || "0")) +
                    (parseFloat(formData.offboarding?.finalSettlement?.vacationBalance || "0")) +
                    (parseFloat(formData.offboarding?.finalSettlement?.endOfServiceBenefit || "0")) +
                    (parseFloat(formData.offboarding?.finalSettlement?.overtime || "0")) -
                    (parseFloat(formData.offboarding?.finalSettlement?.deductions || "0")) -
                    (parseFloat(formData.offboarding?.finalSettlement?.loans || "0"))
                  ).toFixed(2)} جنيه مصري
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ملاحظات إخلاء الطرف */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            ملاحظات إخلاء الطرف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hrNotes">ملاحظات الموارد البشرية</Label>
            <Textarea
              id="hrNotes"
              value={formData.offboarding?.hrNotes || ""}
              onChange={(e) => handleOffboardingChange("hrNotes", e.target.value)}
              placeholder="ملاحظات قسم الموارد البشرية..."
              rows={3}
              disabled={isActive}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="managerNotes">ملاحظات المدير المباشر</Label>
            <Textarea
              id="managerNotes"
              value={formData.offboarding?.managerNotes || ""}
              onChange={(e) => handleOffboardingChange("managerNotes", e.target.value)}
              placeholder="ملاحظات المدير المباشر..."
              rows={3}
              disabled={isActive}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exitInterviewNotes">ملاحظات مقابلة الخروج</Label>
            <Textarea
              id="exitInterviewNotes"
              value={formData.offboarding?.exitInterviewNotes || ""}
              onChange={(e) => handleOffboardingChange("exitInterviewNotes", e.target.value)}
              placeholder="ملاحظات من مقابلة الخروج..."
              rows={3}
              disabled={isActive}
            />
          </div>
        </CardContent>
      </Card>

      {!isActive && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-4">
              <Button className="flex-1">
                <FileText className="w-4 h-4 mr-2" />
                طباعة شهادة الخدمة
              </Button>
              <Button variant="outline" className="flex-1">
                <FileText className="w-4 h-4 mr-2" />
                طباعة إخلاء الطرف
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OffboardingTab;