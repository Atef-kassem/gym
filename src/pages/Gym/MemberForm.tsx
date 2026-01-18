import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useGetAllMembersQuery } from "@/services/membersApi";
import {
  useGetAllSubscriptionsQuery,
} from "@/services/subscriptionsApi";
import { useGetAllBranchesQuery } from "@/services/branchesApi";
import {
  User, Search, FileText, Receipt, Calendar as CalendarIcon,
  Phone, Mail, MapPin, CreditCard, Building, CheckCircle, XCircle,
  Download, Printer, BarChart3, DollarSign
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const MemberForm = () => {
  const { toast } = useToast();
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [memberData, setMemberData] = useState<any>(null);
  const [normalSubscriptions, setNormalSubscriptions] = useState<any[]>([]);
  const [specialSubscriptions, setSpecialSubscriptions] = useState<any[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  // جلب الأعضاء
  const { data: membersData } = useGetAllMembersQuery({} as any);
  const members = Array.isArray(membersData?.data) ? membersData.data : [];

  // جلب الفروع
  const { data: branchesData } = useGetAllBranchesQuery(undefined as any);
  const branches = Array.isArray(branchesData?.data) ? branchesData.data : [];

  // جلب الاشتراكات العادية
  const { data: normalSubsData } = useGetAllSubscriptionsQuery({
    memberId: selectedMemberId || undefined,
    isSpecial: false,
  });
  
  // جلب الاشتراكات الخاصة
  const { data: specialSubsData } = useGetAllSubscriptionsQuery({
    memberId: selectedMemberId || undefined,
    isSpecial: true,
  });

  // تحديث البيانات عند اختيار عضو
  useEffect(() => {
    if (selectedMemberId) {
      const member = members.find((m: any) => m.id === parseInt(selectedMemberId));
      if (member) {
        setMemberData(member);
      } else {
        setMemberData(null);
      }
    } else {
      setMemberData(null);
    }
  }, [selectedMemberId, members]);

  // تحديث الاشتراكات
  useEffect(() => {
    if (normalSubsData?.data) {
      const subs = Array.isArray(normalSubsData.data) ? normalSubsData.data : [];
      // فلترة حسب memberId إذا كان موجوداً
      if (selectedMemberId) {
        setNormalSubscriptions(subs.filter((sub: any) => 
          sub.memberId === parseInt(selectedMemberId) || 
          (sub.member && sub.member.id === parseInt(selectedMemberId))
        ));
      } else {
        setNormalSubscriptions(subs);
      }
    } else {
      setNormalSubscriptions([]);
    }
  }, [normalSubsData, selectedMemberId]);

  useEffect(() => {
    if (specialSubsData?.data) {
      const subs = Array.isArray(specialSubsData.data) ? specialSubsData.data : [];
      // فلترة حسب memberId إذا كان موجوداً
      if (selectedMemberId) {
        setSpecialSubscriptions(subs.filter((sub: any) => 
          sub.memberId === parseInt(selectedMemberId) || 
          (sub.member && sub.member.id === parseInt(selectedMemberId))
        ));
      } else {
        setSpecialSubscriptions(subs);
      }
    } else {
      setSpecialSubscriptions([]);
    }
  }, [specialSubsData, selectedMemberId]);

  // تحويل التاريخ
  const convertDateFromISO = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    try {
      return new Date(dateStr);
    } catch {
      return undefined;
    }
  };

  // حساب حالة الاشتراك
  const getSubscriptionStatus = (startDate: string, endDate: string): string => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (today < start) return "قادم";
    if (today > end) return "منتهي";
    return "نشط";
  };

  const getStatusBadge = (startDate: string, endDate: string) => {
    const status = getSubscriptionStatus(startDate, endDate);
    if (status === "نشط") {
      return <Badge className="bg-green-500">نشط</Badge>;
    } else if (status === "منتهي") {
      return <Badge variant="destructive">منتهي</Badge>;
    } else {
      return <Badge className="bg-blue-500">قادم</Badge>;
    }
  };

  const handlePrint = async () => {
    if (!memberData || !printRef.current) {
      toast({
        title: "تحذير",
        description: "يرجى اختيار عضو أولاً",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "جاري التحضير للطباعة...",
        description: "يرجى الانتظار",
      });

      // إخفاء العناصر غير المرغوبة للطباعة
      const printElement = printRef.current;
      const originalDisplay: { [key: string]: string } = {};
      const hiddenElements = printElement.querySelectorAll('.print\\:hidden');
      hiddenElements.forEach((el: any) => {
        originalDisplay[el.className] = el.style.display;
        el.style.display = 'none';
      });

      // إنشاء canvas من HTML - نفس الطريقة المستخدمة في PDF
      const canvas = await html2canvas(printElement, {
        useCORS: true,
        logging: false,
      });

      // استعادة العناصر المخفية
      hiddenElements.forEach((el: any) => {
        el.style.display = originalDisplay[el.className] || '';
      });

      const imgData = canvas.toDataURL('image/png');

      // إنشاء HTML للطباعة مع الصورة
      const printContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>استمارة عضو - ${memberData.name || memberData.memberCode || 'غير محدد'}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: 'Arial', 'Tahoma', sans-serif;
                background: #fff;
                padding: 0;
                margin: 0;
              }
              
              @page {
                size: A4;
                margin: 0;
              }
              
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
                
                img {
                  width: 100% !important;
                  height: auto !important;
                  page-break-inside: avoid;
                }
              }
              
              .print-content {
                width: 100%;
                margin: 0;
                padding: 0;
              }
              
              .print-content img {
                width: 100%;
                height: auto;
                display: block;
                page-break-inside: avoid;
              }
            </style>
          </head>
          <body>
            <div class="print-content">
              <img src="${imgData}" alt="استمارة عضو" />
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  };
                }, 500);
              };
            </script>
          </body>
        </html>
      `;

      // فتح نافذة الطباعة
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        toast({
          title: "تم التحضير",
          description: "تم فتح نافذة الطباعة",
        });
      } else {
        throw new Error('تم حظر النوافذ المنبثقة. يرجى السماح بالنوافذ المنبثقة.');
      }
    } catch (error: any) {
      console.error('خطأ في الطباعة:', error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء الطباعة",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async () => {
    if (!memberData || !printRef.current) {
      toast({
        title: "تحذير",
        description: "يرجى اختيار عضو أولاً",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "جاري التحميل...",
        description: "يرجى الانتظار بينما يتم إنشاء ملف PDF",
      });

      // إخفاء العناصر غير المرغوبة للطباعة
      const printElement = printRef.current;
      const originalDisplay: { [key: string]: string } = {};
      const hiddenElements = printElement.querySelectorAll('.print\\:hidden');
      hiddenElements.forEach((el: any) => {
        originalDisplay[el.className] = el.style.display;
        el.style.display = 'none';
      });

      // إنشاء canvas من HTML
      const canvas = await html2canvas(printElement, {
        useCORS: true,
        logging: false,
      });

      // استعادة العناصر المخفية
      hiddenElements.forEach((el: any) => {
        el.style.display = originalDisplay[el.className] || '';
      });

      const imgData = canvas.toDataURL('image/png');
      
      // حساب أبعاد PDF
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // إنشاء PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // إضافة الصورة الأولى
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // إضافة صفحات إضافية إذا لزم الأمر
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // حفظ الملف
      const fileName = `استمارة_عضو_${memberData.name || memberData.memberCode || 'غير_محدد'}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      pdf.save(fileName);

      toast({
        title: "نجح",
        description: "تم تحميل ملف PDF بنجاح",
      });
    } catch (error) {
      console.error('خطأ في إنشاء PDF:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء ملف PDF",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      {/* CSS للطباعة */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:max-w-full {
            max-width: 100% !important;
          }
          .print\\:space-y-4 > * + * {
            margin-top: 1rem !important;
          }
          .print\\:text-xl {
            font-size: 1.25rem !important;
          }
          .print\\:text-3xl {
            font-size: 1.875rem !important;
          }
          .print\\:text-sm {
            font-size: 0.875rem !important;
          }
          .print\\:text-xs {
            font-size: 0.75rem !important;
          }
          .print\\:border {
            border-width: 1px !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:bg-gray-50 {
            background-color: #f9fafb !important;
          }
          .print\\:w-20 {
            width: 5rem !important;
          }
          .print\\:h-20 {
            height: 5rem !important;
          }
          .print\\:w-16 {
            width: 4rem !important;
          }
          .print\\:h-16 {
            height: 4rem !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6 print:p-0">
        <div className="max-w-7xl mx-auto space-y-6 print:max-w-full">
        
        {/* العنوان والبحث */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">استمارة عضو</h1>
            <p className="text-gray-600 mt-1">عرض تفاصيل العضو واشتراكاته</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              طباعة
            </Button>
            <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تحميل
            </Button>
          </div>
        </div>

        {/* اختيار العضو */}
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              اختيار العضو
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="memberSelect">اختر العضو</Label>
              <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر العضو لعرض تفاصيله" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member: any) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name} {member.memberCode ? `(${member.memberCode})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* استمارة العضو */}
        {memberData && (
          <div ref={printRef} className="space-y-6 print:space-y-4">
            {/* رأس الاستمارة - اللوجو واسم المشروع */}
            <Card className="print:border-0 print:shadow-none border-2 border-blue-200 shadow-xl">
              <CardContent className="p-8 print:p-6 bg-gradient-to-br from-blue-50 to-white">
                <div className="flex items-center justify-between border-b-4 border-blue-600 pb-8 mb-8 print:border-b-3 print:pb-6 print:mb-6">
                  <div className="flex items-center gap-6">
                    {/* اللوجو */}
                    <div className="w-28 h-28 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-blue-200 print:w-24 print:h-24">
                      <img 
                        src="/logo.jpeg" 
                        alt="Meta Codecx Logo" 
                        className="w-24 h-24 object-contain rounded-xl print:w-20 print:h-20"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLElement).parentElement;
                          if (parent && !parent.querySelector('.fallback-text')) {
                            const text = document.createElement('div');
                            text.className = 'fallback-text text-5xl font-bold text-white print:text-4xl';
                            text.textContent = 'SG';
                            parent.appendChild(text);
                          }
                        }}
                      />
                    </div>
                    {/* اسم المشروع */}
                    <div>
                      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3 print:text-4xl print:mb-2">
                        Meta Codecx
                      </h1>
                      <p className="text-xl text-gray-700 font-semibold print:text-lg">نادي SWAT الرياضي</p>
                      <p className="text-base text-blue-600 font-medium mt-2 print:text-sm">استمارة عضو</p>
                    </div>
                  </div>
                  <div className="text-left bg-white rounded-lg p-4 shadow-md border border-gray-200 print:shadow-none print:border print:p-3">
                    <p className="text-gray-600 text-sm font-medium mb-1 print:text-xs">تاريخ الطباعة:</p>
                    <p className="font-bold text-lg text-gray-900 print:text-base">{format(new Date(), "PPP", { locale: ar })}</p>
                    <p className="text-xs text-gray-500 mt-1 print:text-xs">{format(new Date(), "HH:mm", { locale: ar })}</p>
                  </div>
                </div>

                {/* بيانات العضو الأساسية */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-6 mb-8">
                  <div className="space-y-5 bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-md print:shadow-none print:border print:p-4">
                    <h2 className="text-2xl font-bold text-gray-900 border-b-3 border-blue-600 pb-3 flex items-center gap-2 print:text-xl print:pb-2">
                      <User className="w-6 h-6 text-blue-600" />
                      بيانات العضو
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow print:shadow-none print:border">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <Label className="text-gray-500 text-xs font-medium block mb-1">الاسم</Label>
                          <p className="font-bold text-lg text-gray-900">{memberData.name || "-"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow print:shadow-none print:border">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <Label className="text-gray-500 text-xs font-medium block mb-1">كود العضو</Label>
                          <p className="font-bold text-lg text-gray-900">{memberData.memberCode || "-"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow print:shadow-none print:border">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Phone className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <Label className="text-gray-500 text-xs font-medium block mb-1">رقم الهاتف</Label>
                          <p className="font-bold text-base text-gray-900">{memberData.phone || "-"}</p>
                        </div>
                      </div>

                      {memberData.email && (
                        <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow print:shadow-none print:border">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-6 h-6 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <Label className="text-gray-500 text-xs font-medium block mb-1">البريد الإلكتروني</Label>
                            <p className="font-bold text-base text-gray-900">{memberData.email}</p>
                          </div>
                        </div>
                      )}

                      {memberData.address && (
                        <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow print:shadow-none print:border">
                          <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-teal-600" />
                          </div>
                          <div className="flex-1">
                            <Label className="text-gray-500 text-xs font-medium block mb-1">العنوان</Label>
                            <p className="font-bold text-base text-gray-900">{memberData.address}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-5 bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-md print:shadow-none print:border print:p-4">
                    <h2 className="text-2xl font-bold text-gray-900 border-b-3 border-blue-600 pb-3 flex items-center gap-2 print:text-xl print:pb-2">
                      <FileText className="w-6 h-6 text-blue-600" />
                      معلومات إضافية
                    </h2>
                    
                    <div className="space-y-4">
                      {memberData.gender && (
                        <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm print:shadow-none print:border">
                          <Label className="text-gray-500 text-xs font-medium block mb-1">الجنس</Label>
                          <p className="font-bold text-base text-gray-900">{memberData.gender === "male" ? "ذكر" : memberData.gender === "female" ? "أنثى" : memberData.gender}</p>
                        </div>
                      )}

                      {memberData.dateOfBirth && (
                        <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm print:shadow-none print:border">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <CalendarIcon className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <Label className="text-gray-500 text-xs font-medium block mb-1">تاريخ الميلاد</Label>
                            <p className="font-bold text-base text-gray-900">
                              {(() => {
                                const date = convertDateFromISO(memberData.dateOfBirth);
                                return date ? format(date, "PPP", { locale: ar }) : memberData.dateOfBirth;
                              })()}
                            </p>
                          </div>
                        </div>
                      )}

                      {memberData.joinDate && (
                        <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm print:shadow-none print:border">
                          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                            <CalendarIcon className="w-6 h-6 text-pink-600" />
                          </div>
                          <div className="flex-1">
                            <Label className="text-gray-500 text-xs font-medium block mb-1">تاريخ الانضمام</Label>
                            <p className="font-bold text-base text-gray-900">
                              {(() => {
                                const date = convertDateFromISO(memberData.joinDate);
                                return date ? format(date, "PPP", { locale: ar }) : memberData.joinDate;
                              })()}
                            </p>
                          </div>
                        </div>
                      )}

                      {memberData.membershipType && (
                        <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm print:shadow-none print:border">
                          <Label className="text-gray-500 text-xs font-medium block mb-1">نوع العضوية</Label>
                          <p className="font-bold text-base text-gray-900">{memberData.membershipType}</p>
                        </div>
                      )}

                      <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm print:shadow-none print:border">
                        <Label className="text-gray-500 text-xs font-medium block mb-2">حالة العضوية</Label>
                        <div>
                          {memberData.isActive === true || memberData.isActive === 1 || memberData.active === true || memberData.active === 1 ? (
                            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 text-sm font-bold shadow-md">نشط</Badge>
                          ) : (
                            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 text-sm font-bold shadow-md">غير نشط</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* الاشتراكات العادية */}
                {normalSubscriptions.length > 0 && (
                  <div className="mb-8 bg-white rounded-xl border border-gray-200 shadow-lg p-6 print:shadow-none print:border print:p-4">
                    <h2 className="text-2xl font-bold text-gray-900 border-b-3 border-blue-600 pb-3 mb-6 flex items-center gap-2 print:text-xl print:pb-2 print:mb-4">
                      <Receipt className="w-6 h-6 text-blue-600" />
                      الاشتراكات العادية
                    </h2>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full border-collapse print:text-sm">
                        <thead>
                          <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                            <th className="border border-blue-500 py-4 px-4 text-right font-bold text-sm">رقم الإيصال</th>
                            <th className="border border-blue-500 py-4 px-4 text-right font-bold text-sm">الفرع</th>
                            <th className="border border-blue-500 py-4 px-4 text-right font-bold text-sm">نوع الاشتراك</th>
                            <th className="border border-blue-500 py-4 px-4 text-right font-bold text-sm">من</th>
                            <th className="border border-blue-500 py-4 px-4 text-right font-bold text-sm">إلى</th>
                            <th className="border border-blue-500 py-4 px-4 text-right font-bold text-sm">قيمة الاشتراك</th>
                            <th className="border border-blue-500 py-4 px-4 text-right font-bold text-sm">المدفوع</th>
                            <th className="border border-blue-500 py-4 px-4 text-right font-bold text-sm">الباقي</th>
                            <th className="border border-blue-500 py-4 px-4 text-right font-bold text-sm">الحالة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {normalSubscriptions.map((subscription: any) => (
                            <tr key={subscription.id} className="hover:bg-gray-50">
                              <td className="border border-gray-300 py-2 px-4">{subscription.receiptNumber || "-"}</td>
                              <td className="border border-gray-300 py-2 px-4">
                                {branches.find((b: any) => b.id === subscription.branchId)?.arabicName ||
                                  branches.find((b: any) => b.id === subscription.branchId)?.englishName ||
                                  branches.find((b: any) => b.id === subscription.branchId)?.name || "-"}
                              </td>
                              <td className="border border-gray-300 py-2 px-4">{subscription.subscriptionType || "-"}</td>
                              <td className="border border-gray-300 py-2 px-4">
                                {subscription.subscriptionStartDate ? (
                                  (() => {
                                    const date = convertDateFromISO(subscription.subscriptionStartDate);
                                    return date ? format(date, "PPP", { locale: ar }) : subscription.subscriptionStartDate;
                                  })()
                                ) : "-"}
                              </td>
                              <td className="border border-gray-300 py-2 px-4">
                                {subscription.subscriptionEndDate ? (
                                  (() => {
                                    const date = convertDateFromISO(subscription.subscriptionEndDate);
                                    return date ? format(date, "PPP", { locale: ar }) : subscription.subscriptionEndDate;
                                  })()
                                ) : "-"}
                              </td>
                              <td className="border border-gray-300 py-2 px-4">{parseFloat(subscription.subscriptionValue || 0).toLocaleString()}</td>
                              <td className="border border-gray-300 py-2 px-4 text-green-600">{parseFloat(subscription.paidAmount || 0).toLocaleString()}</td>
                              <td className="border border-gray-300 py-2 px-4 text-red-600">{parseFloat(subscription.remainingAmount || 0).toLocaleString()}</td>
                              <td className="border border-gray-300 py-2 px-4">
                                {subscription.subscriptionStartDate && subscription.subscriptionEndDate ? (
                                  getStatusBadge(subscription.subscriptionStartDate, subscription.subscriptionEndDate)
                                ) : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* الاشتراكات الخاصة */}
                {specialSubscriptions.length > 0 && (
                  <div className="mb-8 bg-white rounded-xl border border-gray-200 shadow-lg p-6 print:shadow-none print:border print:p-4">
                    <h2 className="text-2xl font-bold text-gray-900 border-b-3 border-purple-600 pb-3 mb-6 flex items-center gap-2 print:text-xl print:pb-2 print:mb-4">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                      الاشتراكات الخاصة
                    </h2>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full border-collapse print:text-sm">
                        <thead>
                          <tr className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                            <th className="border border-purple-500 py-4 px-4 text-right font-bold text-sm">رقم الإيصال</th>
                            <th className="border border-purple-500 py-4 px-4 text-right font-bold text-sm">الفرع</th>
                            <th className="border border-purple-500 py-4 px-4 text-right font-bold text-sm">نوع الاشتراك</th>
                            <th className="border border-purple-500 py-4 px-4 text-right font-bold text-sm">من</th>
                            <th className="border border-purple-500 py-4 px-4 text-right font-bold text-sm">إلى</th>
                            <th className="border border-purple-500 py-4 px-4 text-right font-bold text-sm">قيمة الاشتراك</th>
                            <th className="border border-purple-500 py-4 px-4 text-right font-bold text-sm">المدفوع</th>
                            <th className="border border-purple-500 py-4 px-4 text-right font-bold text-sm">الباقي</th>
                            <th className="border border-purple-500 py-4 px-4 text-right font-bold text-sm">الحالة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {specialSubscriptions.map((subscription: any, index: number) => (
                            <tr key={subscription.id} className={`hover:bg-purple-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="border border-gray-200 py-3 px-4 font-medium">{subscription.receiptNumber || "-"}</td>
                              <td className="border border-gray-200 py-3 px-4">
                                {branches.find((b: any) => b.id === subscription.branchId)?.arabicName ||
                                  branches.find((b: any) => b.id === subscription.branchId)?.englishName ||
                                  branches.find((b: any) => b.id === subscription.branchId)?.name || "-"}
                              </td>
                              <td className="border border-gray-200 py-3 px-4 font-medium">{subscription.subscriptionType || "-"}</td>
                              <td className="border border-gray-200 py-3 px-4">
                                {subscription.subscriptionStartDate ? (
                                  (() => {
                                    const date = convertDateFromISO(subscription.subscriptionStartDate);
                                    return date ? format(date, "PPP", { locale: ar }) : subscription.subscriptionStartDate;
                                  })()
                                ) : "-"}
                              </td>
                              <td className="border border-gray-200 py-3 px-4">
                                {subscription.subscriptionEndDate ? (
                                  (() => {
                                    const date = convertDateFromISO(subscription.subscriptionEndDate);
                                    return date ? format(date, "PPP", { locale: ar }) : subscription.subscriptionEndDate;
                                  })()
                                ) : "-"}
                              </td>
                              <td className="border border-gray-200 py-3 px-4 font-bold text-gray-900">{parseFloat(subscription.subscriptionValue || 0).toLocaleString()} ج.م</td>
                              <td className="border border-gray-200 py-3 px-4 text-green-600 font-bold">{parseFloat(subscription.paidAmount || 0).toLocaleString()} ج.م</td>
                              <td className="border border-gray-200 py-3 px-4 text-red-600 font-bold">{parseFloat(subscription.remainingAmount || 0).toLocaleString()} ج.م</td>
                              <td className="border border-gray-200 py-3 px-4">
                                {subscription.subscriptionStartDate && subscription.subscriptionEndDate ? (
                                  getStatusBadge(subscription.subscriptionStartDate, subscription.subscriptionEndDate)
                                ) : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ملخص */}
                <div className="mt-8 pt-8 border-t-4 border-gradient-to-r from-blue-500 to-purple-500 bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg print:shadow-none print:border print:mt-6 print:pt-6 print:p-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 print:text-xl print:mb-4">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    ملخص الإحصائيات
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 shadow-lg hover:shadow-xl transition-shadow print:shadow-none print:border">
                      <CardContent className="p-6 print:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-sm font-medium mb-2">إجمالي الاشتراكات</p>
                            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 text-xl font-bold shadow-md">
                              {normalSubscriptions.length + specialSubscriptions.length}
                            </Badge>
                          </div>
                          <Receipt className="w-12 h-12 text-blue-500 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 shadow-lg hover:shadow-xl transition-shadow print:shadow-none print:border">
                      <CardContent className="p-6 print:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-sm font-medium mb-2">الاشتراكات النشطة</p>
                            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 text-xl font-bold shadow-md">
                              {[...normalSubscriptions, ...specialSubscriptions].filter((sub: any) => 
                                sub.subscriptionStartDate && sub.subscriptionEndDate &&
                                getSubscriptionStatus(sub.subscriptionStartDate, sub.subscriptionEndDate) === "نشط"
                              ).length}
                            </Badge>
                          </div>
                          <CheckCircle className="w-12 h-12 text-green-500 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300 shadow-lg hover:shadow-xl transition-shadow print:shadow-none print:border">
                      <CardContent className="p-6 print:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-sm font-medium mb-2">إجمالي المدفوع</p>
                            <span className="font-extrabold text-green-600 text-2xl block print:text-xl">
                              {([...normalSubscriptions, ...specialSubscriptions].reduce((sum: number, sub: any) => 
                                sum + parseFloat(sub.paidAmount || 0), 0
                              )).toLocaleString()} <span className="text-sm font-normal">ج.م</span>
                            </span>
                          </div>
                          <DollarSign className="w-12 h-12 text-emerald-500 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* رسالة عند عدم اختيار عضو */}
        {!memberData && selectedMemberId === "" && (
          <Card>
            <CardContent className="p-12 text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 text-lg">يرجى اختيار عضو لعرض استمارته</p>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </>
  );
};

export default MemberForm;

