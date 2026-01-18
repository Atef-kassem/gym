import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User, MapPin, Phone, Mail, Calendar, Users, Globe } from "lucide-react";

interface PersonalInfoTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

const PersonalInfoTab = ({ formData, setFormData }: PersonalInfoTabProps) => {
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      address: { ...formData.address, [field]: value }
    });
  };

  const handleEmergencyChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      emergencyContact: { ...formData.emergencyContact, [field]: value }
    });
  };

  return (
    <div className="space-y-6">
      {/* البيانات الشخصية الأساسية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            البيانات الشخصية الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الكامل (عربي) *</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="الاسم الرباعي بالعربي"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nameEn">الاسم الكامل (إنجليزي) *</Label>
            <Input
              id="nameEn"
              value={formData.nameEn || ""}
              onChange={(e) => handleInputChange("nameEn", e.target.value)}
              placeholder="Full Name in English"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">الجنس *</Label>
            <Select value={formData.gender || ""} onValueChange={(value) => handleInputChange("gender", value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الجنس" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ذكر">ذكر</SelectItem>
                <SelectItem value="أنثى">أنثى</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">الجنسية *</Label>
            <Input
              id="nationality"
              value={formData.nationality || ""}
              onChange={(e) => handleInputChange("nationality", e.target.value)}
              placeholder="الجنسية"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">تاريخ الميلاد *</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate || ""}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthPlace">مكان الميلاد</Label>
            <Input
              id="birthPlace"
              value={formData.birthPlace || ""}
              onChange={(e) => handleInputChange("birthPlace", e.target.value)}
              placeholder="مكان الميلاد (اختياري)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maritalStatus">الحالة الاجتماعية *</Label>
            <Select value={formData.maritalStatus || ""} onValueChange={(value) => handleInputChange("maritalStatus", value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الحالة الاجتماعية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="أعزب">أعزب</SelectItem>
                <SelectItem value="متزوج">متزوج</SelectItem>
                <SelectItem value="مطلق">مطلق</SelectItem>
                <SelectItem value="أرمل">أرمل</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* معلومات الاتصال */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            معلومات الاتصال
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mobile">رقم الجوال *</Label>
            <Input
              id="mobile"
              value={formData.mobile || ""}
              onChange={(e) => handleInputChange("mobile", e.target.value)}
              placeholder="+966501234567"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input
              id="phone"
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="رقم الهاتف الأرضي"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">البريد الإلكتروني *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="example@company.com"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* العنوان الوطني */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            العنوان الوطني
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">الدولة *</Label>
            <Input
              id="country"
              value={formData.address?.country || ""}
              onChange={(e) => handleAddressChange("country", e.target.value)}
              placeholder="المملكة العربية المصرية"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">المدينة *</Label>
            <Input
              id="city"
              value={formData.address?.city || ""}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              placeholder="الرياض"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">الحي *</Label>
            <Input
              id="district"
              value={formData.address?.district || ""}
              onChange={(e) => handleAddressChange("district", e.target.value)}
              placeholder="الملقا"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">الشارع *</Label>
            <Input
              id="street"
              value={formData.address?.street || ""}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              placeholder="شارع الملك فهد"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">الرمز البريدي</Label>
            <Input
              id="postalCode"
              value={formData.address?.postalCode || ""}
              onChange={(e) => handleAddressChange("postalCode", e.target.value)}
              placeholder="12345"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullAddress">العنوان التفصيلي</Label>
            <Textarea
              id="fullAddress"
              value={formData.address?.fullAddress || ""}
              onChange={(e) => handleAddressChange("fullAddress", e.target.value)}
              placeholder="العنوان التفصيلي الكامل"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* جهة الاتصال للطوارئ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            جهة الاتصال للطوارئ
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyName">الاسم *</Label>
            <Input
              id="emergencyName"
              value={formData.emergencyContact?.name || ""}
              onChange={(e) => handleEmergencyChange("name", e.target.value)}
              placeholder="اسم جهة الاتصال"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">رقم الجوال *</Label>
            <Input
              id="emergencyPhone"
              value={formData.emergencyContact?.phone || ""}
              onChange={(e) => handleEmergencyChange("phone", e.target.value)}
              placeholder="+966501234567"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyRelation">صلة القرابة *</Label>
            <Select 
              value={formData.emergencyContact?.relation || ""} 
              onValueChange={(value) => handleEmergencyChange("relation", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر صلة القرابة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الزوج">الزوج</SelectItem>
                <SelectItem value="الزوجة">الزوجة</SelectItem>
                <SelectItem value="الوالد">الوالد</SelectItem>
                <SelectItem value="الوالدة">الوالدة</SelectItem>
                <SelectItem value="الأخ">الأخ</SelectItem>
                <SelectItem value="الأخت">الأخت</SelectItem>
                <SelectItem value="الابن">الابن</SelectItem>
                <SelectItem value="الابنة">الابنة</SelectItem>
                <SelectItem value="صديق">صديق</SelectItem>
                <SelectItem value="أخرى">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoTab;