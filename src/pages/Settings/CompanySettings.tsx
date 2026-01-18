import { useState, useRef, useEffect } from "react";
import { Save, Upload, Building, Phone, Mail, MapPin, FileText, Settings, Image, Folder, Shield, X, Eye, User, Key, PenTool, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  useGetCurrentCompanyQuery, 
  useUpdateCompanyMutation,
  useGetCompanyAttachmentsQuery,
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
  useGetCompanyAccountQuery,
  useUpsertCompanyAccountMutation,
  useUpdateAccountPasswordMutation
} from "@/services/companyApi";

export default function CompanySettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // API hooks
  const { data: companyData, isLoading: isLoadingCompany, refetch: refetchCompany, error: companyError } = useGetCurrentCompanyQuery();
  const [updateCompany, { isLoading: isUpdatingCompany }] = useUpdateCompanyMutation();
  
  const { data: attachmentsData, refetch: refetchAttachments } = useGetCompanyAttachmentsQuery(
    { id: companyData?.data?.company?.id || 1 },
    { skip: !companyData?.data?.company?.id }
  );
  const [uploadAttachment, { isLoading: isUploadingAttachment }] = useUploadAttachmentMutation();
  const [deleteAttachment, { isLoading: isDeletingAttachment }] = useDeleteAttachmentMutation();
  
  const { data: apiAccountData, refetch: refetchAccount } = useGetCompanyAccountQuery(
    companyData?.data?.company?.id || 1,
    { skip: !companyData?.data?.company?.id }
  );
  const [upsertAccount, { isLoading: isUpsertingAccount }] = useUpsertCompanyAccountMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdateAccountPasswordMutation();
  
  // File input refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const commercialRegisterRef = useRef<HTMLInputElement>(null);
  const taxCertificateRef = useRef<HTMLInputElement>(null);
  const businessLicenseRef = useRef<HTMLInputElement>(null);
  const qualityCertificateRef = useRef<HTMLInputElement>(null);
  const highQualityLogoRef = useRef<HTMLInputElement>(null);
  const facilityImagesRef = useRef<HTMLInputElement>(null);
  const otherAttachmentsRef = useRef<HTMLInputElement>(null);

  // Uploaded files state
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({
    logo: [],
    commercialRegister: [],
    taxCertificate: [],
    businessLicense: [],
    qualityCertificate: [],
    highQualityLogo: [],
    facilityImages: [],
    otherAttachments: []
  });

  // Preview state
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [formData, setFormData] = useState({
    nameAr: "مغاسل النجاح للمشروبات",
    nameEn: "Success Car Wash",
    commercialRegister: "1234567890",
    taxNumber: "300123456700003",
    phone: "+966501234567",
    mobile: "+966501234567",
    email: "info@successcarwash.com",
    website: "www.successcarwash.com",
    country: "المملكة العربية المصرية",
    city: "الرياض",
    district: "حي الملقا",
    street: "شارع الملك فهد",
    postalCode: "12345",
    location: "",
    description: "شركة رائدة في مجال خدمات   وتنظيف  الكافية"
  });

  // Account data state
  const [localAccountData, setLocalAccountData] = useState({
    username: "admin",
    password: "",
    confirmPassword: "",
    digitalSignature: ""
  });

  // Electronic signature file
  const digitalSignatureRef = useRef<HTMLInputElement>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);

  // Load company data when component mounts
  useEffect(() => {
    console.log('Company data loaded:', companyData);
    if (companyData?.data?.company) {
      console.log('Company object:', companyData.data.company);
      console.log('Company ID:', companyData.data.company.id);
      setFormData({
        nameAr: companyData.data.company.arabicName || "",
        nameEn: companyData.data.company.englishName || "",
        commercialRegister: companyData.data.company.commercialRegistrationNumber || "",
        taxNumber: companyData.data.company.taxRegistrationNumber || "",
        phone: companyData.data.company.phoneNumber || "",
        mobile: companyData.data.company.telephoneNumber || "",
        email: companyData.data.company.email || "",
        website: companyData.data.company.website || "",
        country: companyData.data.company.country || "",
        city: companyData.data.company.city || "",
        district: companyData.data.company.neighborhood || "",
        street: companyData.data.company.street || "",
        postalCode: companyData.data.company.postalCode || "",
        location: companyData.data.company.location || "",
        description: companyData.data.company.description || ""
      });
    }
  }, [companyData]);

  // Load account data when component mounts
  useEffect(() => {
    if (apiAccountData?.account) {
      setLocalAccountData(prev => ({
        ...prev,
        username: apiAccountData.account.username || "admin"
      }));
    }
  }, [apiAccountData]);

  // Load attachments when component mounts
  useEffect(() => {
    if (attachmentsData?.attachments) {
      const attachments = attachmentsData.attachments;
      const newUploadedFiles: Record<string, File[]> = {
        logo: [],
        commercialRegister: [],
        taxCertificate: [],
        businessLicense: [],
        qualityCertificate: [],
        highQualityLogo: [],
        facilityImages: [],
        otherAttachments: []
      };

      attachments.forEach(attachment => {
        // Convert attachment to File object for display
        // This is a simplified approach - in real app you'd need to fetch actual files
        const file = new File([], attachment.original_name, { type: attachment.mime_type });
        if (newUploadedFiles[attachment.file_type]) {
          newUploadedFiles[attachment.file_type].push(file);
        }
      });

      setUploadedFiles(newUploadedFiles);
    }
  }, [attachmentsData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAccountInputChange = (field: string, value: string) => {
    setLocalAccountData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignatureUpload = () => {
    digitalSignatureRef.current?.click();
  };

  const handleSignatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSignatureFile(file);
      toast({
        title: "تم رفع التوقيع الإلكتروني",
        description: `تم رفع ${file.name} بنجاح`,
        variant: "default",
      });
    }
  };

  const removeSignature = () => {
    setSignatureFile(null);
    if (digitalSignatureRef.current) {
      digitalSignatureRef.current.value = '';
    }
    toast({
      title: "تم حذف التوقيع",
      description: "تم حذف التوقيع الإلكتروني بنجاح",
      variant: "default",
    });
  };

  const handleFileUpload = (inputRef: React.RefObject<HTMLInputElement>, fileType: string) => {
    inputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0 && companyData?.data?.company?.id) {
      try {
        for (const file of files) {
          await uploadAttachment({
            id: companyData.data.company.id,
            fileType,
            file
          }).unwrap();
        }

        toast({
          title: "تم رفع الملف بنجاح",
          description: `تم رفع ${files.length > 1 ? files.length + ' ملفات' : files[0].name} بنجاح`,
          variant: "default",
        });

        // Refresh attachments
        refetchAttachments();
      } catch (error) {
        console.error('Error uploading file:', error);
        toast({
          title: "خطأ في رفع الملف",
          description: "حدث خطأ أثناء رفع الملف",
          variant: "destructive",
        });
      }
    }
  };

  const removeFile = async (fileType: string, fileIndex: number) => {
    if (!companyData?.data?.company?.id) return;

    try {
      const file = uploadedFiles[fileType][fileIndex];
      // In a real app, you'd need to get the attachment ID from the file
      // For now, we'll just remove it from local state
      setUploadedFiles(prev => ({
        ...prev,
        [fileType]: prev[fileType].filter((_, index) => index !== fileIndex)
      }));

      toast({
        title: "تم حذف الملف",
        description: "تم حذف الملف بنجاح",
        variant: "default",
      });
    } catch (error) {
      console.error('Error removing file:', error);
      toast({
        title: "خطأ في حذف الملف",
        description: "حدث خطأ أثناء حذف الملف",
        variant: "destructive",
      });
    }
  };

  const isImageFile = (file: File) => {
    return file.type.startsWith('image/');
  };

  const isPdfFile = (file: File) => {
    return file.type === 'application/pdf';
  };

  const openPreview = (file: File) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  };

  const getFileIcon = (file: File) => {
    if (isImageFile(file)) return <Image className="w-8 h-8 text-primary flex-shrink-0" />;
    if (isPdfFile(file)) return <FileText className="w-8 h-8 text-red-500 flex-shrink-0" />;
    return <Folder className="w-8 h-8 text-muted-foreground flex-shrink-0" />;
  };

  const handleAccountSave = async () => {
    // فحص إضافي للتأكد من وجود البيانات
    if (!companyData) {
      toast({
        title: "خطأ في البيانات",
        description: "لم يتم تحميل بيانات الشركة بعد. يرجى الانتظار أو إعادة تحميل الصفحة.",
        variant: "destructive",
      });
      return;
    }

    if (!companyData.data?.company) {
      toast({
        title: "خطأ في البيانات",
        description: "لم يتم العثور على بيانات الشركة. يرجى التأكد من تسجيل الدخول أو التواصل مع المسؤول.",
        variant: "destructive",
      });
      return;
    }

    if (!companyData.data?.company?.id) {
      toast({
        title: "خطأ في البيانات",
        description: "معرف الشركة غير صحيح. يرجى إعادة تحميل الصفحة أو التواصل مع المسؤول.",
        variant: "destructive",
      });
      return;
    }

    if (localAccountData.password !== localAccountData.confirmPassword) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمة المرور وتأكيدها غير متطابقين",
        variant: "destructive",
      });
      return;
    }

    try {
      const accountData = {
        username: localAccountData.username,
        email: formData.email,
        password: localAccountData.password,
        role: 'admin'
      };

      console.log('Updating account with company ID:', companyData.data.company.id);
      console.log('Account data:', accountData);

      await upsertAccount({ id: companyData.data.company.id, data: accountData }).unwrap();
      
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ بيانات الحساب بنجاح",
        variant: "default",
      });

      // Refresh account data
      refetchAccount();
      
      // Clear password fields
      setLocalAccountData(prev => ({
        ...prev,
        password: "",
        confirmPassword: ""
      }));
    } catch (error) {
      console.error('Error updating account:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ بيانات الحساب. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    // فحص إضافي للتأكد من وجود البيانات
    if (!companyData) {
      toast({
        title: "خطأ في البيانات",
        description: "لم يتم تحميل بيانات الشركة بعد. يرجى الانتظار أو إعادة تحميل الصفحة.",
        variant: "destructive",
      });
      return;
    }

    if (!companyData.data?.company) {
      toast({
        title: "خطأ في البيانات",
        description: "لم يتم العثور على بيانات الشركة. يرجى التأكد من تسجيل الدخول أو التواصل مع المسؤول.",
        variant: "destructive",
      });
      return;
    }

    if (!companyData.data?.company?.id) {
      toast({
        title: "خطأ في البيانات",
        description: "معرف الشركة غير صحيح. يرجى إعادة تحميل الصفحة أو التواصل مع المسؤول.",
        variant: "destructive",
      });
      return;
    }

    // تعيين حالة التحميل
    setIsLoading(true);

    try {
      const updateData = {
        arabicName: formData.nameAr,
        englishName: formData.nameEn,
        commercialRegistrationNumber: formData.commercialRegister,
        taxRegistrationNumber: formData.taxNumber,
        phoneNumber: formData.phone,
        telephoneNumber: formData.mobile,
        email: formData.email,
        website: formData.website,
        country: formData.country,
        city: formData.city,
        neighborhood: formData.district,
        street: formData.street,
        postalCode: formData.postalCode,
        location: formData.location,
        description: formData.description
      };

      console.log('Updating company with ID:', companyData.data.company.id);
      console.log('Update data:', updateData);

      await updateCompany({ id: companyData.data.company.id, data: updateData }).unwrap();
      
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ بيانات الشركة بنجاح",
        variant: "default",
      });

      // Refresh data
      refetchCompany();
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state or error
  if (isLoadingCompany) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">جاري تحميل بيانات الشركة...</p>
          <p className="text-sm text-muted-foreground mt-2">يرجى الانتظار...</p>
        </div>
      </div>
    );
  }

  // Debug: Log current state
  console.log('Current company data state:', {
    companyData,
    companyError,
    isLoadingCompany,
    hasCompany: !!companyData?.data?.company,
    companyId: companyData?.data?.company?.id
  });

  // Show error state
  if (companyError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">خطأ في تحميل البيانات</h2>
          <p className="text-muted-foreground mb-4">
            حدث خطأ أثناء تحميل بيانات الشركة. يرجى المحاولة مرة أخرى.
          </p>
          <Button onClick={() => refetchCompany()} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  // Show no company data state
  if (!companyData?.data?.company) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">لا توجد بيانات شركة</h2>
          <p className="text-muted-foreground mb-4">
            لم يتم العثور على بيانات الشركة. يرجى التأكد من تسجيل الدخول أو التواصل مع المسؤول.
          </p>
          <Button onClick={() => refetchCompany()} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary-blue bg-clip-text text-transparent">بيانات الشركة</h1>
          <p className="text-muted-foreground">إدارة المعلومات الأساسية للشركة</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isLoading} 
          className="gap-2 bg-gradient-to-r from-primary to-secondary-blue hover:from-primary/90 hover:to-secondary-blue/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="w-4 h-4" />
          {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6 p-1 bg-gradient-to-r from-card to-card/80 border shadow-lg">
          <TabsTrigger 
            value="basic" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <Building className="w-4 h-4" />
            البيانات الأساسية
          </TabsTrigger>
          <TabsTrigger 
            value="contact" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <Phone className="w-4 h-4" />
            معلومات الاتصال
          </TabsTrigger>
          <TabsTrigger 
            value="address" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <MapPin className="w-4 h-4" />
            العنوان
          </TabsTrigger>
          <TabsTrigger 
            value="legal" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <FileText className="w-4 h-4" />
            البيانات القانونية
          </TabsTrigger>
          <TabsTrigger 
            value="attachments" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <Folder className="w-4 h-4" />
            المرفقات
          </TabsTrigger>
          <TabsTrigger 
            value="account" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <User className="w-4 h-4" />
            بيانات الحساب
          </TabsTrigger>
        </TabsList>

        {/* البيانات الأساسية */}
        <TabsContent value="basic" className="space-y-6">
          <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-primary/5 border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Building className="w-4 h-4 text-primary" />
                </div>
                هوية الشركة
              </CardTitle>
              <CardDescription>المعلومات الأساسية والهوية البصرية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="nameAr" className="flex items-center gap-2">
                    <Building className="w-3 h-3 text-primary" />
                    اسم الشركة (عربي) *
                  </Label>
                  <Input
                    id="nameAr"
                    value={formData.nameAr}
                    onChange={(e) => handleInputChange("nameAr", e.target.value)}
                    placeholder="أدخل اسم الشركة بالعربية"
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="nameEn" className="flex items-center gap-2">
                    <Building className="w-3 h-3 text-secondary-blue" />
                    اسم الشركة (إنجليزي)
                  </Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => handleInputChange("nameEn", e.target.value)}
                    placeholder="أدخل اسم الشركة بالإنجليزية"
                    className="focus:ring-2 focus:ring-secondary-blue/20 transition-all duration-200"
                  />
                </div>
                
                {/* Logo Upload */}
                <div>
                  <Label className="flex items-center gap-2">
                    <Upload className="w-3 h-3 text-primary" />
                    شعار الشركة
                  </Label>
                  <input
                    type="file"
                    ref={logoInputRef}
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "logo")}
                  />
                  {uploadedFiles.logo.length === 0 ? (
                    <div 
                      onClick={() => handleFileUpload(logoInputRef, "logo")}
                      className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group"
                    >
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                      <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-200">اسحب وأفلت أو انقر لرفع الشعار</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG، JPG حتى 2MB</p>
                      <Button 
                        variant="outline" 
                        className="mt-3 group-hover:border-primary group-hover:text-primary transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileUpload(logoInputRef, "logo");
                        }}
                      >
                        اختيار ملف
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-2 space-y-4">
                      {uploadedFiles.logo.map((file, index) => (
                        <div key={index} className="space-y-3">
                          {/* File Info Row */}
                          <div className="flex items-center gap-3 p-3 border rounded-lg bg-gradient-to-r from-primary/5 to-primary/10">
                            {isImageFile(file) && (
                              <img 
                                src={URL.createObjectURL(file)} 
                                alt="شعار الشركة" 
                                className="w-12 h-12 object-cover rounded border"
                              />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFile("logo", index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          {/* Direct Preview */}
                          {isImageFile(file) && (
                            <div className="border rounded-lg p-4 bg-muted/30">
                              <p className="text-sm font-medium mb-3 text-center">معاينة مباشرة</p>
                              <div className="flex justify-center">
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  alt="معاينة الشعار" 
                                  className="max-w-full max-h-48 object-contain rounded-lg border shadow-sm"
                                />
                              </div>
                            </div>
                          )}
                          
                          {isPdfFile(file) && (
                            <div className="border rounded-lg p-4 bg-muted/30 text-center">
                              <FileText className="w-12 h-12 mx-auto text-red-500 mb-2" />
                              <p className="text-sm font-medium mb-2">ملف PDF</p>
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const url = URL.createObjectURL(file);
                                  window.open(url, '_blank');
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                فتح المعاينة
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        onClick={() => handleFileUpload(logoInputRef, "logo")}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        استبدال الشعار
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" className="flex items-center gap-2">
                    <FileText className="w-3 h-3 text-primary" />
                    وصف مختصر عن الشركة
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="وصف مختصر عن الشركة ونشاطها"
                    rows={4}
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* معلومات الاتصال */}
        <TabsContent value="contact" className="space-y-6">
          <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-secondary-blue/5 border-l-4 border-l-secondary-blue">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-4 h-4 text-secondary-blue" />
                </div>
                معلومات الاتصال
              </CardTitle>
              <CardDescription>طرق التواصل مع الشركة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-primary" />
                    الهاتف *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+966xxxxxxxxx"
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="mobile" className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-secondary-blue" />
                    الجوال
                  </Label>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                    placeholder="+966xxxxxxxxx"
                    className="focus:ring-2 focus:ring-secondary-blue/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-primary" />
                  البريد الإلكتروني *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="info@company.com"
                  className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              <div>
                <Label htmlFor="website" className="flex items-center gap-2">
                  <FileText className="w-3 h-3 text-secondary-blue" />
                  الموقع الإلكتروني
                </Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="www.company.com"
                  className="focus:ring-2 focus:ring-secondary-blue/20 transition-all duration-200"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* العنوان */}
        <TabsContent value="address" className="space-y-6">
          <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-success/5 border-l-4 border-l-success">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-4 h-4 text-success" />
                </div>
                العنوان
              </CardTitle>
              <CardDescription>موقع المقر الرئيسي للشركة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <Label htmlFor="country" className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-success" />
                    الدولة *
                  </Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    placeholder="الدولة"
                    className="focus:ring-2 focus:ring-success/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="flex items-center gap-2">
                    <Building className="w-3 h-3 text-primary" />
                    المدينة *
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="المدينة"
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="district" className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-secondary-blue" />
                    الحي
                  </Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleInputChange("district", e.target.value)}
                    placeholder="الحي"
                    className="focus:ring-2 focus:ring-secondary-blue/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode" className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-warning" />
                    الرمز البريدي
                  </Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    placeholder="12345"
                    className="focus:ring-2 focus:ring-warning/20 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <div>
                  <Label htmlFor="street" className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-success" />
                    الشارع *
                  </Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => handleInputChange("street", e.target.value)}
                    placeholder="الشارع"
                    className="focus:ring-2 focus:ring-success/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-primary" />
                    الموقع
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="وصف موقع الشركة أو إحداثيات GPS"
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* البيانات القانونية */}
        <TabsContent value="legal" className="space-y-6">
          <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-warning/5 border-l-4 border-l-warning">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-4 h-4 text-warning" />
                </div>
                البيانات القانونية
              </CardTitle>
              <CardDescription>المعلومات الرسمية والقانونية للشركة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="commercialRegister" className="flex items-center gap-2">
                    <FileText className="w-3 h-3 text-primary" />
                    السجل التجاري *
                  </Label>
                  <Input
                    id="commercialRegister"
                    value={formData.commercialRegister}
                    onChange={(e) => handleInputChange("commercialRegister", e.target.value)}
                    placeholder="رقم السجل التجاري"
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="taxNumber" className="flex items-center gap-2">
                    <FileText className="w-3 h-3 text-warning" />
                    الرقم الضريبي *
                  </Label>
                  <Input
                    id="taxNumber"
                    value={formData.taxNumber}
                    onChange={(e) => handleInputChange("taxNumber", e.target.value)}
                    placeholder="الرقم الضريبي"
                    className="focus:ring-2 focus:ring-warning/20 transition-all duration-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* المرفقات */}
        <TabsContent value="attachments" className="space-y-6">
          {/* مرفقات الهوية */}
          <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-primary/5 border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                مرفقات الهوية
              </CardTitle>
              <CardDescription>الوثائق الرسمية للشركة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* السجل التجاري */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-primary" />
                    السجل التجاري
                  </Label>
                  <input
                    type="file"
                    ref={commercialRegisterRef}
                    accept=".pdf,image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "commercialRegister")}
                  />
                  {uploadedFiles.commercialRegister.length === 0 ? (
                    <div 
                      onClick={() => handleFileUpload(commercialRegisterRef, "commercialRegister")}
                      className="border-2 border-dashed border-primary/25 rounded-lg p-4 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group"
                    >
                      <FileText className="w-8 h-8 mx-auto text-primary/60 mb-2 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                      <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-200">رفع صورة السجل التجاري</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF، JPG، PNG حتى 5MB</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 group-hover:border-primary group-hover:text-primary transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileUpload(commercialRegisterRef, "commercialRegister");
                        }}
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        اختيار ملف
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {uploadedFiles.commercialRegister.map((file, index) => (
                        <div key={index} className="space-y-3">
                          {/* File Info Row */}
                          <div className="flex items-center gap-3 p-3 border rounded-lg bg-gradient-to-r from-primary/5 to-primary/10">
                            <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFile("commercialRegister", index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          {/* Direct Preview */}
                          {isImageFile(file) && (
                            <div className="border rounded-lg p-4 bg-muted/30">
                              <p className="text-sm font-medium mb-3 text-center">معاينة مباشرة - السجل التجاري</p>
                              <div className="flex justify-center">
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  alt="معاينة السجل التجاري" 
                                  className="max-w-full max-h-64 object-contain rounded-lg border shadow-sm"
                                />
                              </div>
                            </div>
                          )}
                          
                          {isPdfFile(file) && (
                            <div className="border rounded-lg p-4 bg-muted/30 text-center">
                              <FileText className="w-12 h-12 mx-auto text-red-500 mb-2" />
                              <p className="text-sm font-medium mb-2">السجل التجاري - PDF</p>
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const url = URL.createObjectURL(file);
                                  window.open(url, '_blank');
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                فتح المعاينة
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        onClick={() => handleFileUpload(commercialRegisterRef, "commercialRegister")}
                        className="w-full"
                        size="sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        استبدال الملف
                      </Button>
                    </div>
                  )}
                </div>

                {/* الشهادة الضريبية */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-warning" />
                    الشهادة الضريبية
                  </Label>
                  <input
                    type="file"
                    ref={taxCertificateRef}
                    accept=".pdf,image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "taxCertificate")}
                  />
                  <div 
                    onClick={() => handleFileUpload(taxCertificateRef, "taxCertificate")}
                    className="border-2 border-dashed border-warning/25 rounded-lg p-4 text-center hover:border-warning/50 hover:bg-warning/5 transition-all duration-300 cursor-pointer group"
                  >
                    <FileText className="w-8 h-8 mx-auto text-warning/60 mb-2 group-hover:text-warning group-hover:scale-110 transition-all duration-300" />
                    <p className="text-sm text-muted-foreground group-hover:text-warning transition-colors duration-200">رفع الشهادة الضريبية</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF، JPG، PNG حتى 5MB</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3 group-hover:border-warning group-hover:text-warning transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileUpload(taxCertificateRef, "taxCertificate");
                      }}
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      اختيار ملف
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* مرفقات التراخيص */}
          <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-secondary-blue/5 border-l-4 border-l-secondary-blue">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-4 h-4 text-secondary-blue" />
                </div>
                التراخيص والشهادات
              </CardTitle>
              <CardDescription>تراخيص مزاولة النشاط</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* رخصة النشاط */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-secondary-blue" />
                    رخصة النشاط
                  </Label>
                  <input
                    type="file"
                    ref={businessLicenseRef}
                    accept=".pdf,image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "businessLicense")}
                  />
                  <div 
                    onClick={() => handleFileUpload(businessLicenseRef, "businessLicense")}
                    className="border-2 border-dashed border-secondary-blue/25 rounded-lg p-4 text-center hover:border-secondary-blue/50 hover:bg-secondary-blue/5 transition-all duration-300 cursor-pointer group"
                  >
                    <Shield className="w-8 h-8 mx-auto text-secondary-blue/60 mb-2 group-hover:text-secondary-blue group-hover:scale-110 transition-all duration-300" />
                    <p className="text-sm text-muted-foreground group-hover:text-secondary-blue transition-colors duration-200">رفع رخصة مزاولة النشاط</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF، JPG، PNG حتى 5MB</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3 group-hover:border-secondary-blue group-hover:text-secondary-blue transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileUpload(businessLicenseRef, "businessLicense");
                      }}
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      اختيار ملف
                    </Button>
                  </div>
                </div>

                {/* شهادة الجودة */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-success" />
                    شهادة الجودة
                  </Label>
                  <input
                    type="file"
                    ref={qualityCertificateRef}
                    accept=".pdf,image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "qualityCertificate")}
                  />
                  <div 
                    onClick={() => handleFileUpload(qualityCertificateRef, "qualityCertificate")}
                    className="border-2 border-dashed border-success/25 rounded-lg p-4 text-center hover:border-success/50 hover:bg-success/5 transition-all duration-300 cursor-pointer group"
                  >
                    <Shield className="w-8 h-8 mx-auto text-success/60 mb-2 group-hover:text-success group-hover:scale-110 transition-all duration-300" />
                    <p className="text-sm text-muted-foreground group-hover:text-success transition-colors duration-200">رفع شهادة الجودة</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF، JPG، PNG حتى 5MB</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3 group-hover:border-success group-hover:text-success transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileUpload(qualityCertificateRef, "qualityCertificate");
                      }}
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      اختيار ملف
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* مرفقات إضافية */}
          <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-success/5 border-l-4 border-l-success">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Folder className="w-4 h-4 text-success" />
                </div>
                مرفقات إضافية
              </CardTitle>
              <CardDescription>وثائق ومرفقات أخرى</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {/* شعار عالي الجودة */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Image className="w-4 h-4 text-primary" />
                    شعار عالي الجودة
                  </Label>
                  <input
                    type="file"
                    ref={highQualityLogoRef}
                    accept="image/png,image/svg+xml,.ai"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "highQualityLogo")}
                  />
                  {uploadedFiles.highQualityLogo.length === 0 ? (
                    <div 
                      onClick={() => handleFileUpload(highQualityLogoRef, "highQualityLogo")}
                      className="border-2 border-dashed border-primary/25 rounded-lg p-4 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group"
                    >
                      <Image className="w-8 h-8 mx-auto text-primary/60 mb-2 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                      <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-200">شعار للطباعة</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG، SVG، AI حتى 10MB</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 group-hover:border-primary group-hover:text-primary transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileUpload(highQualityLogoRef, "highQualityLogo");
                        }}
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        رفع
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {uploadedFiles.highQualityLogo.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-gradient-to-r from-primary/5 to-primary/10">
                          {isImageFile(file) ? (
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt="شعار عالي الجودة" 
                              className="w-8 h-8 object-cover rounded border flex-shrink-0"
                            />
                          ) : (
                            <Image className="w-8 h-8 text-primary flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPreview(file)}
                            className="text-primary hover:text-primary"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile("highQualityLogo", index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        onClick={() => handleFileUpload(highQualityLogoRef, "highQualityLogo")}
                        className="w-full"
                        size="sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        استبدال الشعار
                      </Button>
                    </div>
                  )}
                </div>

                {/* صور المنشآت */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Image className="w-4 h-4 text-secondary-blue" />
                    صور المنشآت
                  </Label>
                  <input
                    type="file"
                    ref={facilityImagesRef}
                    accept="image/png,image/jpeg,image/jpg"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "facilityImages")}
                  />
                  {uploadedFiles.facilityImages.length === 0 ? (
                    <div 
                      onClick={() => handleFileUpload(facilityImagesRef, "facilityImages")}
                      className="border-2 border-dashed border-secondary-blue/25 rounded-lg p-4 text-center hover:border-secondary-blue/50 hover:bg-secondary-blue/5 transition-all duration-300 cursor-pointer group"
                    >
                      <Image className="w-8 h-8 mx-auto text-secondary-blue/60 mb-2 group-hover:text-secondary-blue group-hover:scale-110 transition-all duration-300" />
                      <p className="text-sm text-muted-foreground group-hover:text-secondary-blue transition-colors duration-200">صور الفروع</p>
                      <p className="text-xs text-muted-foreground mt-1">JPG، PNG حتى 20MB</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 group-hover:border-secondary-blue group-hover:text-secondary-blue transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileUpload(facilityImagesRef, "facilityImages");
                        }}
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        رفع
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Images Grid with Direct Preview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {uploadedFiles.facilityImages.map((file, index) => (
                          <div key={index} className="space-y-3">
                            {/* File Info */}
                            <div className="flex items-center justify-between p-2 border rounded-lg bg-gradient-to-r from-secondary-blue/5 to-secondary-blue/10">
                              <span className="text-sm font-medium">{file.name}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFile("facilityImages", index)}
                                className="text-destructive hover:text-destructive"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            {/* Direct Image Preview */}
                            <div className="border rounded-lg p-3 bg-muted/30">
                              <img 
                                src={URL.createObjectURL(file)} 
                                alt={`صورة المنشأة ${index + 1}`} 
                                className="w-full h-32 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                              />
                              <p className="text-xs text-muted-foreground text-center mt-2">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => handleFileUpload(facilityImagesRef, "facilityImages")}
                        className="w-full"
                        size="sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        إضافة المزيد من الصور
                      </Button>
                    </div>
                  )}
                </div>

                {/* مرفقات أخرى */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Folder className="w-4 h-4 text-warning" />
                    مرفقات أخرى
                  </Label>
                  <input
                    type="file"
                    ref={otherAttachmentsRef}
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "otherAttachments")}
                  />
                  <div 
                    onClick={() => handleFileUpload(otherAttachmentsRef, "otherAttachments")}
                    className="border-2 border-dashed border-warning/25 rounded-lg p-4 text-center hover:border-warning/50 hover:bg-warning/5 transition-all duration-300 cursor-pointer group"
                  >
                    <Folder className="w-8 h-8 mx-auto text-warning/60 mb-2 group-hover:text-warning group-hover:scale-110 transition-all duration-300" />
                    <p className="text-sm text-muted-foreground group-hover:text-warning transition-colors duration-200">ملفات متنوعة</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF، DOC، XLS حتى 15MB</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3 group-hover:border-warning group-hover:text-warning transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileUpload(otherAttachmentsRef, "otherAttachments");
                      }}
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      رفع
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* بيانات الحساب */}
        <TabsContent value="account" className="space-y-6">
          <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-primary/5 border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <User className="w-4 h-4 text-primary" />
                </div>
                بيانات الحساب الإداري
              </CardTitle>
              <CardDescription>إعدادات اسم المستخدم وكلمة المرور</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <User className="w-3 h-3 text-primary" />
                    اسم المستخدم *
                  </Label>
                  <Input
                    id="username"
                    value={localAccountData.username}
                    onChange={(e) => handleAccountInputChange("username", e.target.value)}
                    placeholder="أدخل اسم المستخدم"
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Key className="w-3 h-3 text-secondary-blue" />
                    كلمة المرور الجديدة
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={localAccountData.password}
                    onChange={(e) => handleAccountInputChange("password", e.target.value)}
                    placeholder="أدخل كلمة المرور الجديدة"
                    className="focus:ring-2 focus:ring-secondary-blue/20 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Key className="w-3 h-3 text-warning" />
                  تأكيد كلمة المرور
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={localAccountData.confirmPassword}
                  onChange={(e) => handleAccountInputChange("confirmPassword", e.target.value)}
                  placeholder="أعد كتابة كلمة المرور"
                  className="focus:ring-2 focus:ring-warning/20 transition-all duration-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* التوقيع الإلكتروني */}
          <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-secondary-blue/5 border-l-4 border-l-secondary-blue">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <PenTool className="w-4 h-4 text-secondary-blue" />
                </div>
                التوقيع الإلكتروني
              </CardTitle>
              <CardDescription>رفع وإدارة التوقيع الإلكتروني للشركة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="file"
                ref={digitalSignatureRef}
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleSignatureChange}
              />

              {!signatureFile ? (
                <div 
                  onClick={handleSignatureUpload}
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-secondary-blue/50 hover:bg-secondary-blue/5 transition-all duration-300 cursor-pointer group"
                >
                  <PenTool className="w-8 h-8 mx-auto text-muted-foreground mb-2 group-hover:text-secondary-blue group-hover:scale-110 transition-all duration-300" />
                  <p className="text-sm text-muted-foreground group-hover:text-secondary-blue transition-colors duration-200">اسحب وأفلت أو انقر لرفع التوقيع الإلكتروني</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG، JPG حتى 2MB</p>
                  <Button 
                    variant="outline" 
                    className="mt-3 group-hover:border-secondary-blue group-hover:text-secondary-blue transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSignatureUpload();
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    اختيار ملف التوقيع
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* File Info Row */}
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-gradient-to-r from-secondary-blue/5 to-secondary-blue/10">
                    {isImageFile(signatureFile) && (
                      <img 
                        src={URL.createObjectURL(signatureFile)} 
                        alt="التوقيع الإلكتروني" 
                        className="w-12 h-12 object-cover rounded border"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{signatureFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(signatureFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={removeSignature}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Direct Preview */}
                  {isImageFile(signatureFile) && (
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <p className="text-sm font-medium mb-3 text-center">معاينة التوقيع الإلكتروني</p>
                      <div className="flex justify-center">
                        <img 
                          src={URL.createObjectURL(signatureFile)} 
                          alt="معاينة التوقيع" 
                          className="max-w-full max-h-32 object-contain rounded-lg border shadow-sm bg-white p-2"
                        />
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={handleSignatureUpload}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    استبدال التوقيع
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* File Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              معاينة الملف: {previewFile?.name}
            </DialogTitle>
          </DialogHeader>
          
          {previewFile && (
            <div className="mt-4">
              {isImageFile(previewFile) ? (
                <img 
                  src={URL.createObjectURL(previewFile)} 
                  alt="معاينة الملف" 
                  className="max-w-full max-h-[70vh] object-contain mx-auto rounded-lg border"
                />
              ) : isPdfFile(previewFile) ? (
                <div className="text-center p-8 border-2 border-dashed rounded-lg">
                  <FileText className="w-16 h-16 mx-auto text-red-500 mb-4" />
                  <p className="text-lg font-medium mb-2">ملف PDF</p>
                  <p className="text-sm text-muted-foreground mb-4">{previewFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    حجم الملف: {(previewFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => {
                      const url = URL.createObjectURL(previewFile);
                      window.open(url, '_blank');
                    }}
                  >
                    فتح في تبويب جديد
                  </Button>
                </div>
              ) : (
                <div className="text-center p-8 border-2 border-dashed rounded-lg">
                  <Folder className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">ملف غير مدعوم للمعاينة</p>
                  <p className="text-sm text-muted-foreground mb-4">{previewFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    نوع الملف: {previewFile.type || 'غير محدد'} | 
                    حجم الملف: {(previewFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}