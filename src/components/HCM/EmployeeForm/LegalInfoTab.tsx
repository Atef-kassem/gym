import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IdCard, FileImage, Upload, AlertTriangle, CheckCircle, Calendar } from "lucide-react";

interface LegalInfoTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

const LegalInfoTab = ({ formData, setFormData }: LegalInfoTabProps) => {
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDocumentChange = (docType: string, field: string, value: string) => {
    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        [docType]: { ...formData.documents?.[docType], [field]: value }
      }
    });
  };

  const getExpiryStatus = (expiryDate: string) => {
    if (!expiryDate) return null;
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />منتهي</Badge>;
    } else if (diffDays <= 30) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800"><AlertTriangle className="w-3 h-3 mr-1" />ينتهي خلال {diffDays} يوم</Badge>;
    } else if (diffDays <= 90) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Calendar className="w-3 h-3 mr-1" />ينتهي خلال {diffDays} يوم</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />ساري</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* الهوية الوطنية / الإقامة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IdCard className="w-5 h-5" />
            الهوية الوطنية / الإقامة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="identityType">نوع الوثيقة *</Label>
              <Select 
                value={formData.identityType || ""} 
                onValueChange={(value) => handleInputChange("identityType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الوثيقة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national_id">هوية وطنية</SelectItem>
                  <SelectItem value="residence_id">إقامة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="identityNumber">رقم الهوية / الإقامة *</Label>
              <Input
                id="identityNumber"
                value={formData.identityNumber || ""}
                onChange={(e) => handleInputChange("identityNumber", e.target.value)}
                placeholder="1234567890"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="identityIssueDate">تاريخ الإصدار</Label>
              <Input
                id="identityIssueDate"
                type="date"
                value={formData.identityIssueDate || ""}
                onChange={(e) => handleInputChange("identityIssueDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="identityExpiryDate">تاريخ الانتهاء *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="identityExpiryDate"
                  type="date"
                  value={formData.identityExpiryDate || ""}
                  onChange={(e) => handleInputChange("identityExpiryDate", e.target.value)}
                  required
                />
                {getExpiryStatus(formData.identityExpiryDate)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>صورة الهوية / الإقامة</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">اسحب وأفلت الملف هنا أو انقر للاختيار</p>
              <Button variant="outline" className="mt-2">
                <Upload className="w-4 h-4 mr-2" />
                رفع الصورة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* جواز السفر */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="w-5 h-5" />
            جواز السفر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passportNumber">رقم جواز السفر</Label>
              <Input
                id="passportNumber"
                value={formData.passportNumber || ""}
                onChange={(e) => handleInputChange("passportNumber", e.target.value)}
                placeholder="A12345678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passportIssueDate">تاريخ الإصدار</Label>
              <Input
                id="passportIssueDate"
                type="date"
                value={formData.passportIssueDate || ""}
                onChange={(e) => handleInputChange("passportIssueDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passportExpiryDate">تاريخ الانتهاء</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="passportExpiryDate"
                  type="date"
                  value={formData.passportExpiryDate || ""}
                  onChange={(e) => handleInputChange("passportExpiryDate", e.target.value)}
                />
                {getExpiryStatus(formData.passportExpiryDate)}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passportIssuePlace">مكان الإصدار</Label>
              <Input
                id="passportIssuePlace"
                value={formData.passportIssuePlace || ""}
                onChange={(e) => handleInputChange("passportIssuePlace", e.target.value)}
                placeholder="الرياض"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>صورة جواز السفر</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">اسحب وأفلت الملف هنا أو انقر للاختيار</p>
              <Button variant="outline" className="mt-2">
                <Upload className="w-4 h-4 mr-2" />
                رفع الصورة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* رخصة العمل */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="w-5 h-5" />
            رخصة العمل (للمقيمين)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workPermitNumber">رقم رخصة العمل</Label>
              <Input
                id="workPermitNumber"
                value={formData.workPermitNumber || ""}
                onChange={(e) => handleInputChange("workPermitNumber", e.target.value)}
                placeholder="WP123456789"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workPermitIssueDate">تاريخ الإصدار</Label>
              <Input
                id="workPermitIssueDate"
                type="date"
                value={formData.workPermitIssueDate || ""}
                onChange={(e) => handleInputChange("workPermitIssueDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workPermitExpiryDate">تاريخ الانتهاء</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="workPermitExpiryDate"
                  type="date"
                  value={formData.workPermitExpiryDate || ""}
                  onChange={(e) => handleInputChange("workPermitExpiryDate", e.target.value)}
                />
                {getExpiryStatus(formData.workPermitExpiryDate)}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workPermitStatus">حالة الرخصة</Label>
              <Select 
                value={formData.workPermitStatus || ""} 
                onValueChange={(value) => handleInputChange("workPermitStatus", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر حالة الرخصة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشطة</SelectItem>
                  <SelectItem value="expired">منتهية</SelectItem>
                  <SelectItem value="pending_renewal">قيد التجديد</SelectItem>
                  <SelectItem value="cancelled">ملغية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>صورة رخصة العمل</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">اسحب وأفلت الملف هنا أو انقر للاختيار</p>
              <Button variant="outline" className="mt-2">
                <Upload className="w-4 h-4 mr-2" />
                رفع الصورة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalInfoTab;