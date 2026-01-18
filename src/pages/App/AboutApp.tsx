import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useGetAboutAppQuery, useUpdateAboutAppMutation } from "@/services/appManagementApi";
import { Save, Info, Smartphone } from "lucide-react";

const AboutApp = () => {
  const { toast } = useToast();
  const { data: aboutAppData, isLoading } = useGetAboutAppQuery();
  const [updateAboutApp] = useUpdateAboutAppMutation();
  
  const [formData, setFormData] = useState({
    appName: "",
    appVersion: "",
    description: "",
    features: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    privacyPolicy: "",
    termsOfService: ""
  });

  useEffect(() => {
    if (aboutAppData?.data) {
      setFormData({
        appName: aboutAppData.data.appName || "",
        appVersion: aboutAppData.data.appVersion || "",
        description: aboutAppData.data.description || "",
        features: aboutAppData.data.features || "",
        contactEmail: aboutAppData.data.contactEmail || "",
        contactPhone: aboutAppData.data.contactPhone || "",
        website: aboutAppData.data.website || "",
        privacyPolicy: aboutAppData.data.privacyPolicy || "",
        termsOfService: aboutAppData.data.termsOfService || ""
      });
    }
  }, [aboutAppData]);

  const handleSave = async () => {
    try {
      await updateAboutApp(formData).unwrap();
      toast({
        title: "نجح",
        description: "تم حفظ معلومات التطبيق بنجاح"
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حفظ المعلومات",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* العنوان */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Smartphone className="w-8 h-8 text-blue-600" />
              عن التطبيق
            </h1>
            <p className="text-muted-foreground mt-1">معلومات وبيانات التطبيق</p>
          </div>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 ml-2" />
            حفظ
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              معلومات التطبيق
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appName">اسم التطبيق *</Label>
                <Input
                  id="appName"
                  value={formData.appName}
                  onChange={(e) => setFormData({...formData, appName: e.target.value})}
                  placeholder="أدخل اسم التطبيق"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appVersion">نسخة التطبيق *</Label>
                <Input
                  id="appVersion"
                  value={formData.appVersion}
                  onChange={(e) => setFormData({...formData, appVersion: e.target.value})}
                  placeholder="1.0.0"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="أدخل وصف التطبيق"
                  rows={4}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="features">المميزات</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  placeholder="أدخل مميزات التطبيق"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">البريد الإلكتروني</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  placeholder="info@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">رقم الهاتف</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  placeholder="+1234567890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">الموقع الإلكتروني</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="privacyPolicy">سياسة الخصوصية</Label>
                <Input
                  id="privacyPolicy"
                  type="url"
                  value={formData.privacyPolicy}
                  onChange={(e) => setFormData({...formData, privacyPolicy: e.target.value})}
                  placeholder="رابط سياسة الخصوصية"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="termsOfService">شروط الخدمة</Label>
                <Input
                  id="termsOfService"
                  type="url"
                  value={formData.termsOfService}
                  onChange={(e) => setFormData({...formData, termsOfService: e.target.value})}
                  placeholder="رابط شروط الخدمة"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutApp;

