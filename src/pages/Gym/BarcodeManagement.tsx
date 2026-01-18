import { useState, useMemo, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useGetAllBranchesQuery } from "@/services/branchesApi";
import {
  useGetAllMembersQuery,
} from "@/services/membersApi";
import {
  Barcode,
  Search,
  Filter,
  Download,
  Printer,
  RefreshCw,
  Eye,
  QrCode,
  FileText,
  Calendar,
  Users,
  Building,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Settings,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const BarcodeManagement = () => {
  const { toast } = useToast();
  
  // State للبحث
  const [searchQuery, setSearchQuery] = useState("");
  
  // State للفلاتر (أكثر من 10 فلاتر)
  const [filters, setFilters] = useState({
    branchId: "all",
    status: "all",
    gender: "all",
    membershipType: "all",
    dateFrom: "",
    dateTo: "",
    memberCode: "",
    phone: "",
    email: "",
    hasBarcode: "all",
    createdBy: "all",
    sortBy: "newest",
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // جلب الفروع
  const { data: branchesData, isLoading: branchesLoading } = useGetAllBranchesQuery(undefined as any);
  const branches = Array.isArray(branchesData?.data) ? branchesData.data : [];
  
  // جلب الأعضاء
  const { data: membersData, isLoading: membersLoading, refetch: refetchMembers } = useGetAllMembersQuery({
    search: searchQuery,
    branchId: filters.branchId !== "all" ? filters.branchId : undefined,
    status: filters.status !== "all" ? filters.status : undefined,
  });
  const members = Array.isArray(membersData?.data) ? membersData.data : [];
  
  // فلترة الأعضاء بناءً على جميع الفلاتر
  const filteredMembers = useMemo(() => {
    return members.filter((member: any) => {
      // فلتر الفرع
      if (filters.branchId !== "all" && member.branchId !== parseInt(filters.branchId)) {
        return false;
      }
      
      // فلتر الحالة
      if (filters.status !== "all") {
        if (filters.status === "active" && !member.isActive) return false;
        if (filters.status === "inactive" && member.isActive) return false;
      }
      
      // فلتر الجنس
      if (filters.gender !== "all" && member.gender !== filters.gender) {
        return false;
      }
      
      // فلتر نوع العضوية
      if (filters.membershipType !== "all") {
        const memberType = member.membershipType?.name || member.membershipType || "";
        if (memberType !== filters.membershipType) return false;
      }
      
      // فلتر كود العضو
      if (filters.memberCode && !member.memberCode?.toLowerCase().includes(filters.memberCode.toLowerCase())) {
        return false;
      }
      
      // فلتر رقم الهاتف
      if (filters.phone && !member.phone?.includes(filters.phone)) {
        return false;
      }
      
      // فلتر البريد الإلكتروني
      if (filters.email && !member.email?.toLowerCase().includes(filters.email.toLowerCase())) {
        return false;
      }
      
      // فلتر تاريخ من
      if (filters.dateFrom && member.createdAt) {
        const memberDate = new Date(member.createdAt);
        const filterDate = new Date(filters.dateFrom);
        if (memberDate < filterDate) return false;
      }
      
      // فلتر تاريخ إلى
      if (filters.dateTo && member.createdAt) {
        const memberDate = new Date(member.createdAt);
        const filterDate = new Date(filters.dateTo);
        if (memberDate > filterDate) return false;
      }
      
      // فلتر وجود الباركود
      if (filters.hasBarcode !== "all") {
        const hasCode = member.memberCode && member.memberCode.length > 0;
        if (filters.hasBarcode === "yes" && !hasCode) return false;
        if (filters.hasBarcode === "no" && hasCode) return false;
      }
      
      return true;
    }).sort((a: any, b: any) => {
      // الترتيب
      if (filters.sortBy === "newest") {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      } else if (filters.sortBy === "oldest") {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      } else if (filters.sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      } else if (filters.sortBy === "code") {
        return (a.memberCode || "").localeCompare(b.memberCode || "");
      }
      return 0;
    });
  }, [members, filters]);
  
  // إحصائيات
  const stats = useMemo(() => {
    return {
      total: filteredMembers.length,
      active: filteredMembers.filter((m: any) => m.isActive).length,
      inactive: filteredMembers.filter((m: any) => !m.isActive).length,
      withBarcode: filteredMembers.filter((m: any) => m.memberCode).length,
      withoutBarcode: filteredMembers.filter((m: any) => !m.memberCode).length,
      male: filteredMembers.filter((m: any) => m.gender === "male").length,
      female: filteredMembers.filter((m: any) => m.gender === "female").length,
    };
  }, [filteredMembers]);
  
  // إعادة تعيين الفلاتر
  const resetFilters = () => {
    setFilters({
      branchId: "all",
      status: "all",
      gender: "all",
      membershipType: "all",
      dateFrom: "",
      dateTo: "",
      memberCode: "",
      phone: "",
      email: "",
      hasBarcode: "all",
      createdBy: "all",
      sortBy: "newest",
    });
    setSearchQuery("");
  };
  
  // طباعة الباركود
  const handlePrintBarcode = (member: any) => {
    // TODO: تنفيذ طباعة الباركود
    toast({
      title: "طباعة الباركود",
      description: `سيتم طباعة باركود العضو ${member.name}`,
    });
  };
  
  // تصدير الباركود
  const handleExportBarcodes = () => {
    if (selectedMembers.length === 0) {
      toast({
        title: "تحذير",
        description: "يرجى اختيار الأعضاء للتصدير",
        variant: "destructive",
      });
      return;
    }
    // TODO: تنفيذ تصدير الباركود
    toast({
      title: "تصدير الباركود",
      description: `سيتم تصدير ${selectedMembers.length} باركود`,
    });
  };
  
  // توليد الباركود (SVG بسيط)
  const generateBarcodeSVG = (code: string) => {
    // توليد باركود بسيط (يمكن استبداله بمكتبة متخصصة)
    const bars = code.split("").map((char, i) => {
      const width = (char.charCodeAt(0) % 3) + 1;
      return `<rect x="${i * 4}" y="0" width="${width}" height="40" fill="black"/>`;
    }).join("");
    
    return `
      <svg width="${code.length * 4 + 20}" height="60" xmlns="http://www.w3.org/2000/svg">
        ${bars}
        <text x="${code.length * 2}" y="55" font-family="Arial" font-size="10" text-anchor="middle">${code}</text>
      </svg>
    `;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* العنوان والبحث */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Barcode className="w-8 h-8 text-blue-600" />
              إدارة الباركود
            </h1>
            <p className="text-gray-600 mt-1">إدارة وعرض أكواد الباركود للأعضاء</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن عضو..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              الفلاتر
              {Object.values(filters).filter(f => f !== "all" && f !== "" && f !== "newest").length > 0 && (
                <Badge className="bg-blue-500">
                  {Object.values(filters).filter(f => f !== "all" && f !== "" && f !== "newest").length}
                </Badge>
              )}
            </Button>
            <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              إعادة تعيين
            </Button>
            <Button variant="outline" onClick={handleExportBarcodes} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="flex items-center gap-2"
            >
              {viewMode === "grid" ? <FileText className="w-4 h-4" /> : <Barcode className="w-4 h-4" />}
              {viewMode === "grid" ? "قائمة" : "شبكة"}
            </Button>
          </div>
        </div>
        
        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>إجمالي الأعضاء</span>
                <Users className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>أعضاء نشطون</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>مع باركود</span>
                <Barcode className="w-5 h-5 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.withBarcode}</div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <span>بدون باركود</span>
                <XCircle className="w-5 h-5 text-orange-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.withoutBarcode}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* الفلاتر */}
        {showFilters && (
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  الفلاتر المتقدمة
                </span>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* فلتر الفرع */}
                <div className="space-y-2">
                  <Label>الفرع</Label>
                  <Select
                    value={filters.branchId}
                    onValueChange={(value) => setFilters({...filters, branchId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الفروع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الفروع</SelectItem>
                      {branches.map((branch: any) => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
                          {branch.arabicName || branch.englishName || branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* فلتر الحالة */}
                <div className="space-y-2">
                  <Label>الحالة</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters({...filters, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الحالات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* فلتر الجنس */}
                <div className="space-y-2">
                  <Label>الجنس</Label>
                  <Select
                    value={filters.gender}
                    onValueChange={(value) => setFilters({...filters, gender: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="الكل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="male">ذكر</SelectItem>
                      <SelectItem value="female">أنثى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* فلتر نوع العضوية */}
                <div className="space-y-2">
                  <Label>نوع العضوية</Label>
                  <Select
                    value={filters.membershipType}
                    onValueChange={(value) => setFilters({...filters, membershipType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الأنواع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      <SelectItem value="شهري">شهري</SelectItem>
                      <SelectItem value="ربع سنوي">ربع سنوي</SelectItem>
                      <SelectItem value="نصف سنوي">نصف سنوي</SelectItem>
                      <SelectItem value="سنوي">سنوي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* فلتر كود العضو */}
                <div className="space-y-2">
                  <Label>كود العضو</Label>
                  <Input
                    placeholder="ابحث بكود العضو"
                    value={filters.memberCode}
                    onChange={(e) => setFilters({...filters, memberCode: e.target.value})}
                  />
                </div>
                
                {/* فلتر رقم الهاتف */}
                <div className="space-y-2">
                  <Label>رقم الهاتف</Label>
                  <Input
                    placeholder="ابحث برقم الهاتف"
                    value={filters.phone}
                    onChange={(e) => setFilters({...filters, phone: e.target.value})}
                  />
                </div>
                
                {/* فلتر البريد الإلكتروني */}
                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <Input
                    type="email"
                    placeholder="ابحث بالبريد الإلكتروني"
                    value={filters.email}
                    onChange={(e) => setFilters({...filters, email: e.target.value})}
                  />
                </div>
                
                {/* فلتر تاريخ من */}
                <div className="space-y-2">
                  <Label>تاريخ من</Label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  />
                </div>
                
                {/* فلتر تاريخ إلى */}
                <div className="space-y-2">
                  <Label>تاريخ إلى</Label>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  />
                </div>
                
                {/* فلتر وجود الباركود */}
                <div className="space-y-2">
                  <Label>وجود الباركود</Label>
                  <Select
                    value={filters.hasBarcode}
                    onValueChange={(value) => setFilters({...filters, hasBarcode: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="الكل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="yes">مع باركود</SelectItem>
                      <SelectItem value="no">بدون باركود</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* فلتر الترتيب */}
                <div className="space-y-2">
                  <Label>الترتيب حسب</Label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => setFilters({...filters, sortBy: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="الترتيب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">الأحدث أولاً</SelectItem>
                      <SelectItem value="oldest">الأقدم أولاً</SelectItem>
                      <SelectItem value="name">الاسم (أ-ي)</SelectItem>
                      <SelectItem value="code">الكود (أ-ي)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={resetFilters}>
                  إعادة تعيين
                </Button>
                <Button onClick={() => setShowFilters(false)}>
                  تطبيق الفلاتر
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* عرض الباركود */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member: any) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {member.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <CardTitle className="text-sm">{member.name}</CardTitle>
                        <p className="text-xs text-gray-500">{member.memberCode || "بدون كود"}</p>
                      </div>
                    </div>
                    {member.isActive ? (
                      <Badge className="bg-green-500">نشط</Badge>
                    ) : (
                      <Badge variant="destructive">غير نشط</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* الباركود */}
                  <div className="flex justify-center items-center bg-white p-4 border rounded-lg">
                    {member.memberCode ? (
                      <div 
                        className="barcode-container"
                        dangerouslySetInnerHTML={{ __html: generateBarcodeSVG(member.memberCode) }}
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <Barcode className="w-16 h-16 mx-auto mb-2" />
                        <p className="text-sm">لا يوجد باركود</p>
                      </div>
                    )}
                  </div>
                  
                  {/* معلومات إضافية */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {branches.find((b: any) => b.id === member.branchId)?.arabicName || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{member.phone || "-"}</span>
                    </div>
                  </div>
                  
                  {/* أزرار الإجراءات */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handlePrintBarcode(member)}
                      disabled={!member.memberCode}
                    >
                      <Printer className="w-4 h-4 ml-1" />
                      طباعة
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        // TODO: عرض تفاصيل الباركود
                        toast({
                          title: "تفاصيل الباركود",
                          description: `كود العضو: ${member.memberCode}`,
                        });
                      }}
                    >
                      <Eye className="w-4 h-4 ml-1" />
                      عرض
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>قائمة الباركود ({filteredMembers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-right py-3 px-4 font-semibold">الاسم</th>
                      <th className="text-right py-3 px-4 font-semibold">كود العضو</th>
                      <th className="text-right py-3 px-4 font-semibold">الفرع</th>
                      <th className="text-right py-3 px-4 font-semibold">الهاتف</th>
                      <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                      <th className="text-right py-3 px-4 font-semibold">الباركود</th>
                      <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member: any) => (
                      <tr key={member.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{member.name}</td>
                        <td className="py-3 px-4 font-mono text-sm">{member.memberCode || "-"}</td>
                        <td className="py-3 px-4">
                          {branches.find((b: any) => b.id === member.branchId)?.arabicName || "-"}
                        </td>
                        <td className="py-3 px-4">{member.phone || "-"}</td>
                        <td className="py-3 px-4">
                          {member.isActive ? (
                            <Badge className="bg-green-500">نشط</Badge>
                          ) : (
                            <Badge variant="destructive">غير نشط</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {member.memberCode ? (
                            <div 
                              className="barcode-container inline-block"
                              dangerouslySetInnerHTML={{ __html: generateBarcodeSVG(member.memberCode) }}
                            />
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePrintBarcode(member)}
                              disabled={!member.memberCode}
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredMembers.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Barcode className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">لا توجد نتائج</p>
                  <p className="text-sm mt-2">جرب تغيير الفلاتر أو البحث</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BarcodeManagement;

