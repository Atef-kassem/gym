import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CreditCard, Building2, Shield, Plus, Minus, Calculator } from "lucide-react";
import { useState } from "react";

interface FinancialInfoTabProps {
  formData: any;
  setFormData: (data: any) => void;
}

const FinancialInfoTab = ({ formData, setFormData }: FinancialInfoTabProps) => {
  const [allowances, setAllowances] = useState(formData.allowances || []);
  const [deductions, setDeductions] = useState(formData.deductions || []);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleBankingChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      banking: { ...formData.banking, [field]: value }
    });
  };

  const handleInsuranceChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      insurance: { ...formData.insurance, [field]: value }
    });
  };

  const addAllowance = () => {
    const newAllowance = { type: "", amount: 0, description: "" };
    const updatedAllowances = [...allowances, newAllowance];
    setAllowances(updatedAllowances);
    setFormData({ ...formData, allowances: updatedAllowances });
  };

  const removeAllowance = (index: number) => {
    const updatedAllowances = allowances.filter((_: any, i: number) => i !== index);
    setAllowances(updatedAllowances);
    setFormData({ ...formData, allowances: updatedAllowances });
  };

  const updateAllowance = (index: number, field: string, value: string | number) => {
    const updatedAllowances = allowances.map((allowance: any, i: number) => 
      i === index ? { ...allowance, [field]: value } : allowance
    );
    setAllowances(updatedAllowances);
    setFormData({ ...formData, allowances: updatedAllowances });
  };

  const addDeduction = () => {
    const newDeduction = { type: "", amount: 0, description: "" };
    const updatedDeductions = [...deductions, newDeduction];
    setDeductions(updatedDeductions);
    setFormData({ ...formData, deductions: updatedDeductions });
  };

  const removeDeduction = (index: number) => {
    const updatedDeductions = deductions.filter((_: any, i: number) => i !== index);
    setDeductions(updatedDeductions);
    setFormData({ ...formData, deductions: updatedDeductions });
  };

  const updateDeduction = (index: number, field: string, value: string | number) => {
    const updatedDeductions = deductions.map((deduction: any, i: number) => 
      i === index ? { ...deduction, [field]: value } : deduction
    );
    setDeductions(updatedDeductions);
    setFormData({ ...formData, deductions: updatedDeductions });
  };

  const allowanceTypes = [
    "بدل سكن", "بدل نقل", "بدل طبي", "بدل اتصالات", "بدل وجبات",
    "بدل مواصلات", "بدل خطر", "بدل ساعات إضافية", "حافز أداء", "أخرى"
  ];

  const deductionTypes = [
    "تأمينات اجتماعية", "ضريبة دخل", "سلفة", "قرض", "تأمين طبي",
    "مخالفة", "غياب", "تأخير", "أخرى"
  ];

  const banks = [
    "البنك الأهلي المصري", "بنك الراجحي", "بنك الرياض", "ساب",
    "البنك المصري للاستثمار", "البنك المصري الفج.مي", "بنك الجزيرة",
    "البنك العربي الوطني", "بنك البلاد", "بنك الإنماء"
  ];

  const calculateTotalSalary = () => {
    const basicSalary = parseFloat(formData.basicSalary || "0");
    const totalAllowances = allowances.reduce((sum: number, allowance: any) => 
      sum + parseFloat(allowance.amount || "0"), 0);
    const totalDeductions = deductions.reduce((sum: number, deduction: any) => 
      sum + parseFloat(deduction.amount || "0"), 0);
    
    return basicSalary + totalAllowances - totalDeductions;
  };

  return (
    <div className="space-y-6">
      {/* الراتب الأساسي */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            معلومات الراتب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="basicSalary">الراتب الأساسي *</Label>
              <Input
                id="basicSalary"
                type="number"
                value={formData.basicSalary || ""}
                onChange={(e) => handleInputChange("basicSalary", parseFloat(e.target.value) || 0)}
                placeholder="8000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">العملة</Label>
              <Select value={formData.currency || "SAR"} onValueChange={(value) => handleInputChange("currency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر العملة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAR">جنيه مصري (SAR)</SelectItem>
                  <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                  <SelectItem value="EUR">يورو (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentFrequency">دورية الدفع</Label>
              <Select value={formData.paymentFrequency || "monthly"} onValueChange={(value) => handleInputChange("paymentFrequency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر دورية الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">شهري</SelectItem>
                  <SelectItem value="weekly">أسبوعي</SelectItem>
                  <SelectItem value="daily">يومي</SelectItem>
                  <SelectItem value="hourly">بالساعة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ملخص الراتب */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">إجمالي الراتب الصافي:</span>
              <Badge variant="secondary" className="text-lg bg-green-100 text-green-800">
                <Calculator className="w-4 h-4 mr-1" />
                {calculateTotalSalary().toLocaleString('ar-SA')} جنيه
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* البدلات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            البدلات والحوافز
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {allowances.map((allowance: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">بدل #{index + 1}</h4>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => removeAllowance(index)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>نوع البدل</Label>
                  <Select 
                    value={allowance.type || ""} 
                    onValueChange={(value) => updateAllowance(index, "type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع البدل" />
                    </SelectTrigger>
                    <SelectContent>
                      {allowanceTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>المبلغ</Label>
                  <Input
                    type="number"
                    value={allowance.amount || ""}
                    onChange={(e) => updateAllowance(index, "amount", parseFloat(e.target.value) || 0)}
                    placeholder="1000"
                  />
                </div>

                <div className="space-y-2">
                  <Label>الوصف</Label>
                  <Input
                    value={allowance.description || ""}
                    onChange={(e) => updateAllowance(index, "description", e.target.value)}
                    placeholder="وصف البدل"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addAllowance} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            إضافة بدل جديد
          </Button>
        </CardContent>
      </Card>

      {/* الخصومات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Minus className="w-5 h-5" />
            الخصومات والسلف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {deductions.map((deduction: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">خصم #{index + 1}</h4>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => removeDeduction(index)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>نوع الخصم</Label>
                  <Select 
                    value={deduction.type || ""} 
                    onValueChange={(value) => updateDeduction(index, "type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الخصم" />
                    </SelectTrigger>
                    <SelectContent>
                      {deductionTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>المبلغ</Label>
                  <Input
                    type="number"
                    value={deduction.amount || ""}
                    onChange={(e) => updateDeduction(index, "amount", parseFloat(e.target.value) || 0)}
                    placeholder="500"
                  />
                </div>

                <div className="space-y-2">
                  <Label>الوصف</Label>
                  <Input
                    value={deduction.description || ""}
                    onChange={(e) => updateDeduction(index, "description", e.target.value)}
                    placeholder="وصف الخصم"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addDeduction} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            إضافة خصم جديد
          </Button>
        </CardContent>
      </Card>

      {/* البيانات المصرفية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            البيانات المصرفية
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">اسم البنك *</Label>
            <Select 
              value={formData.banking?.bankName || ""} 
              onValueChange={(value) => handleBankingChange("bankName", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر البنك" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="iban">رقم الحساب البنكي (IBAN) *</Label>
            <Input
              id="iban"
              value={formData.banking?.iban || ""}
              onChange={(e) => handleBankingChange("iban", e.target.value)}
              placeholder="SA1234567890123456789012"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountHolderName">اسم صاحب الحساب</Label>
            <Input
              id="accountHolderName"
              value={formData.banking?.accountHolderName || ""}
              onChange={(e) => handleBankingChange("accountHolderName", e.target.value)}
              placeholder="كما هو مسجل في البنك"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branchCode">رمز الفرع</Label>
            <Input
              id="branchCode"
              value={formData.banking?.branchCode || ""}
              onChange={(e) => handleBankingChange("branchCode", e.target.value)}
              placeholder="رمز فرع البنك"
            />
          </div>
        </CardContent>
      </Card>

      {/* التأمينات والمزايا */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            التأمينات والمزايا
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gosiNumber">رقم التأمينات الاجتماعية (GOSI)</Label>
            <Input
              id="gosiNumber"
              value={formData.insurance?.gosiNumber || ""}
              onChange={(e) => handleInsuranceChange("gosiNumber", e.target.value)}
              placeholder="123456789"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalInsurance">التأمين الطبي</Label>
            <Input
              id="medicalInsurance"
              value={formData.insurance?.medicalInsurance || ""}
              onChange={(e) => handleInsuranceChange("medicalInsurance", e.target.value)}
              placeholder="رقم بوليصة التأمين الطبي"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wpsFileNumber">رقم ملف حماية الأجور (WPS)</Label>
            <Input
              id="wpsFileNumber"
              value={formData.insurance?.wpsFileNumber || ""}
              onChange={(e) => handleInsuranceChange("wpsFileNumber", e.target.value)}
              placeholder="رقم ملف WPS"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wpsStatus">حالة ملف حماية الأجور</Label>
            <Select 
              value={formData.insurance?.wpsStatus || ""} 
              onValueChange={(value) => handleInsuranceChange("wpsStatus", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر حالة الملف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="pending">قيد المعالجة</SelectItem>
                <SelectItem value="suspended">معلق</SelectItem>
                <SelectItem value="terminated">منتهي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialInfoTab;