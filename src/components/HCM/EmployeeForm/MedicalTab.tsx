import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Shield, AlertTriangle, Phone, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface MedicalTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

const MedicalTab = ({ formData, setFormData }: MedicalTabProps) => {
  const [newIncident, setNewIncident] = useState({
    date: "",
    type: "",
    description: "",
    treatment: "",
    severity: "طفيف"
  });

  const handleMedicalChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      medical: { ...formData.medical, [field]: value }
    });
  };

  const handleInsuranceChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      medical: { 
        ...formData.medical, 
        insurance: { ...formData.medical?.insurance, [field]: value }
      }
    });
  };

  const handleIncidentsChange = (incidents: any[]) => {
    setFormData({
      ...formData,
      medical: {
        ...formData.medical,
        incidents: incidents
      }
    });
  };

  const addIncident = () => {
    if (newIncident.date && newIncident.type && newIncident.description) {
      const incidents = formData.medical?.incidents || [];
      handleIncidentsChange([...incidents, { ...newIncident, id: Date.now() }]);
      setNewIncident({
        date: "",
        type: "",
        description: "",
        treatment: "",
        severity: "طفيف"
      });
    }
  };

  const removeIncident = (incidentId: number) => {
    const incidents = formData.medical?.incidents || [];
    handleIncidentsChange(incidents.filter((incident: any) => incident.id !== incidentId));
  };

  return (
    <div className="space-y-6">
      {/* التأمين الطبي */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            التأمين الطبي
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="insuranceProvider">مزود التأمين</Label>
            <Input
              id="insuranceProvider"
              value={formData.medical?.insurance?.provider || ""}
              onChange={(e) => handleInsuranceChange("provider", e.target.value)}
              placeholder="اسم شركة التأمين"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="policyNumber">رقم الوثيقة</Label>
            <Input
              id="policyNumber"
              value={formData.medical?.insurance?.policyNumber || ""}
              onChange={(e) => handleInsuranceChange("policyNumber", e.target.value)}
              placeholder="رقم وثيقة التأمين"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverageType">نوع التغطية</Label>
            <Select value={formData.medical?.insurance?.coverageType || ""} onValueChange={(value) => handleInsuranceChange("coverageType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع التغطية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="أساسية">تغطية أساسية</SelectItem>
                <SelectItem value="شاملة">تغطية شاملة</SelectItem>
                <SelectItem value="ممتازة">تغطية ممتازة</SelectItem>
                <SelectItem value="vip">تغطية VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="insuranceExpiry">تاريخ انتهاء التأمين</Label>
            <Input
              id="insuranceExpiry"
              type="date"
              value={formData.medical?.insurance?.expiryDate || ""}
              onChange={(e) => handleInsuranceChange("expiryDate", e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="insuranceNotes">ملاحظات التأمين</Label>
            <Textarea
              id="insuranceNotes"
              value={formData.medical?.insurance?.notes || ""}
              onChange={(e) => handleInsuranceChange("notes", e.target.value)}
              placeholder="أي ملاحظات خاصة بالتأمين..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* الحالة الصحية العامة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            الحالة الصحية العامة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodType">فصيلة الدم</Label>
              <Select value={formData.medical?.bloodType || ""} onValueChange={(value) => handleMedicalChange("bloodType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر فصيلة الدم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">الحساسية</Label>
              <Input
                id="allergies"
                value={formData.medical?.allergies || ""}
                onChange={(e) => handleMedicalChange("allergies", e.target.value)}
                placeholder="أي حساسية معروفة"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medications">الأدوية المستمرة</Label>
              <Input
                id="medications"
                value={formData.medical?.medications || ""}
                onChange={(e) => handleMedicalChange("medications", e.target.value)}
                placeholder="أي أدوية يتناولها بانتظام"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastCheckup">آخر فحص طبي</Label>
              <Input
                id="lastCheckup"
                type="date"
                value={formData.medical?.lastCheckup || ""}
                onChange={(e) => handleMedicalChange("lastCheckup", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chronicConditions">الأمراض المزمنة</Label>
            <Textarea
              id="chronicConditions"
              value={formData.medical?.chronicConditions || ""}
              onChange={(e) => handleMedicalChange("chronicConditions", e.target.value)}
              placeholder="أي أمراض مزمنة أو حالات صحية مستمرة..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalNotes">ملاحظات طبية عامة</Label>
            <Textarea
              id="medicalNotes"
              value={formData.medical?.generalNotes || ""}
              onChange={(e) => handleMedicalChange("generalNotes", e.target.value)}
              placeholder="أي ملاحظات طبية أخرى..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* إضافة حادث/مرض جديد */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            إضافة حادث أو حالة مرضية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="incidentDate">التاريخ</Label>
              <Input
                id="incidentDate"
                type="date"
                value={newIncident.date}
                onChange={(e) => setNewIncident({...newIncident, date: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="incidentType">النوع</Label>
              <Select value={newIncident.type} onValueChange={(value) => setNewIncident({...newIncident, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الحادث" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="حادث عمل">حادث عمل</SelectItem>
                  <SelectItem value="مرض مهني">مرض مهني</SelectItem>
                  <SelectItem value="إصابة">إصابة</SelectItem>
                  <SelectItem value="مرض عام">مرض عام</SelectItem>
                  <SelectItem value="حساسية">حساسية</SelectItem>
                  <SelectItem value="أخرى">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">درجة الخطورة</Label>
              <Select value={newIncident.severity} onValueChange={(value) => setNewIncident({...newIncident, severity: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر درجة الخطورة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="طفيف">طفيف</SelectItem>
                  <SelectItem value="متوسط">متوسط</SelectItem>
                  <SelectItem value="شديد">شديد</SelectItem>
                  <SelectItem value="خطير">خطير</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment">العلاج المقدم</Label>
              <Input
                id="treatment"
                value={newIncident.treatment}
                onChange={(e) => setNewIncident({...newIncident, treatment: e.target.value})}
                placeholder="العلاج أو الإسعافات المقدمة"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="incidentDescription">وصف الحادث</Label>
            <Textarea
              id="incidentDescription"
              value={newIncident.description}
              onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
              placeholder="وصف تفصيلي للحادث أو الحالة المرضية..."
              rows={3}
            />
          </div>

          <Button onClick={addIncident} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            إضافة الحادث
          </Button>
        </CardContent>
      </Card>

      {/* سجل الحوادث والأمراض */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            سجل الحوادث والأمراض
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(!formData.medical?.incidents || formData.medical.incidents.length === 0) ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد حوادث أو حالات مرضية مسجلة
            </div>
          ) : (
            <div className="space-y-4">
              {formData.medical.incidents.map((incident: any, index: number) => (
                <div key={incident.id || index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">{incident.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          incident.severity === "خطير" || incident.severity === "شديد" ? "destructive" :
                          incident.severity === "متوسط" ? "secondary" : "default"
                        }
                      >
                        {incident.severity}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeIncident(incident.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">التاريخ:</span> {incident.date}
                    </div>
                    {incident.treatment && (
                      <div>
                        <span className="font-medium">العلاج:</span> {incident.treatment}
                      </div>
                    )}
                  </div>
                  
                  {incident.description && (
                    <div className="text-sm">
                      <span className="font-medium">الوصف:</span> {incident.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* جهة الاتصال للطوارئ الطبية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            الاتصال الطبي للطوارئ
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyDoctorName">اسم الطبيب المعالج</Label>
            <Input
              id="emergencyDoctorName"
              value={formData.medical?.emergencyDoctor?.name || ""}
              onChange={(e) => handleMedicalChange("emergencyDoctor", {...formData.medical?.emergencyDoctor, name: e.target.value})}
              placeholder="اسم الطبيب"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyDoctorPhone">رقم الطبيب</Label>
            <Input
              id="emergencyDoctorPhone"
              value={formData.medical?.emergencyDoctor?.phone || ""}
              onChange={(e) => handleMedicalChange("emergencyDoctor", {...formData.medical?.emergencyDoctor, phone: e.target.value})}
              placeholder="+966501234567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyHospital">المستشفى المفضل</Label>
            <Input
              id="emergencyHospital"
              value={formData.medical?.preferredHospital || ""}
              onChange={(e) => handleMedicalChange("preferredHospital", e.target.value)}
              placeholder="اسم المستشفى"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyHospitalPhone">رقم المستشفى</Label>
            <Input
              id="emergencyHospitalPhone"
              value={formData.medical?.hospitalPhone || ""}
              onChange={(e) => handleMedicalChange("hospitalPhone", e.target.value)}
              placeholder="رقم هاتف المستشفى"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalTab;