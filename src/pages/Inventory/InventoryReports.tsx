import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  Package, 
  Warehouse, 
  DollarSign,
  BarChart3,
  Eye,
  Printer,
  Mail,
  Search
} from "lucide-react";
import { BranchSelector } from "@/components/BranchSelector";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InventoryReports = () => {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  const reportTypes = [
    {
      id: "stock-summary",
      title: "تقرير ملخص المخزون",
      description: "تقرير شامل لحالة المخزون الحالي",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "movement-details",
      title: "تقرير الحركات التفصيلي",
      description: "تفاصيل جميع الحركات المخزنية",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: "critical-items",
      title: "تقرير الأصناف الحرجة",
      description: "الأصناف التي وصلت للحد الأدنى",
      icon: FileText,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      id: "warehouse-performance",
      title: "تقرير أداء المستودعات",
      description: "تحليل أداء وكفاءة المستودعات",
      icon: Warehouse,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      id: "value-analysis",
      title: "تحليل قيمة المخزون",
      description: "تقرير القيم المالية للمخزون",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      id: "abc-analysis",
      title: "تحليل ABC للأصناف",
      description: "تصنيف الأصناف حسب الأهمية",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const sampleData = [
    { name: 'يناير', قيمة: 4000, حركات: 24 },
    { name: 'فبراير', قيمة: 3000, حركات: 18 },
    { name: 'مارس', قيمة: 2000, حركات: 28 },
    { name: 'أبريل', قيمة: 2780, حركات: 39 },
    { name: 'مايو', قيمة: 1890, حركات: 48 },
    { name: 'يونيو', قيمة: 2390, حركات: 38 }
  ];

  const handleGenerateReport = () => {
    if (!selectedReport) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار نوع التقرير",
        variant: "destructive",
      });
      return;
    }

    const reportName = reportTypes.find(r => r.id === selectedReport)?.title;
    
    toast({
      title: "تم إنشاء التقرير",
      description: `تم إنشاء ${reportName} بنجاح`,
    });
  };

  const handleExportReport = (format: string) => {
    toast({
      title: "تصدير التقرير",
      description: `سيتم تصدير التقرير بصيغة ${format}`,
    });
  };

  const handlePrintReport = () => {
    toast({
      title: "طباعة التقرير",
      description: "سيتم فتح نافذة الطباعة",
    });
  };

  const handleEmailReport = () => {
    toast({
      title: "إرسال التقرير",
      description: "سيتم إرسال التقرير عبر البريد الإلكتروني",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <BranchSelector />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            تقارير المخزون
          </h1>
          <p className="text-muted-foreground mt-2">إنشاء وإدارة تقارير المخزون التفصيلية</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Search className="w-4 h-4" />
            بحث متقدم
          </Button>
          <Button 
            onClick={handleGenerateReport}
            className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <FileText className="w-4 h-4" />
            إنشاء تقرير
          </Button>
        </div>
      </div>

      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">منشئ التقارير</TabsTrigger>
          <TabsTrigger value="templates">القوالب الجاهزة</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات المتقدمة</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          {/* Report Generator */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Filters */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  فلاتر التقرير
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">نوع التقرير</label>
                  <Select value={selectedReport} onValueChange={setSelectedReport}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع التقرير" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((report) => (
                        <SelectItem key={report.id} value={report.id}>
                          {report.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">الفرع</label>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع الفروع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الفروع</SelectItem>
                      <SelectItem value="main">الفرع الرئيسي</SelectItem>
                      <SelectItem value="branch1">فرع الرياض</SelectItem>
                      <SelectItem value="branch2">فرع جدة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">المستودع</label>
                  <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                    <SelectTrigger>
                      <SelectValue placeholder="جميع المستودعات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المستودعات</SelectItem>
                      <SelectItem value="main">المستودع الرئيسي</SelectItem>
                      <SelectItem value="secondary">المستودع الفرعي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <label className="text-sm font-medium">من تاريخ</label>
                  <Input 
                    type="date" 
                    value={dateFrom} 
                    onChange={(e) => setDateFrom(e.target.value)} 
                  />
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <label className="text-sm font-medium">إلى تاريخ</label>
                  <Input 
                    type="date" 
                    value={dateTo} 
                    onChange={(e) => setDateTo(e.target.value)} 
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleGenerateReport} className="flex-1">
                    إنشاء
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setSelectedReport("");
                    setDateFrom("");
                    setDateTo("");
                    setSelectedBranch("");
                    setSelectedWarehouse("");
                  }}>
                    مسح
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Report Types */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>أنواع التقارير المتاحة</CardTitle>
                <CardDescription>اختر نوع التقرير المناسب لاحتياجاتك</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportTypes.map((report) => {
                    const IconComponent = report.icon;
                    return (
                      <Card 
                        key={report.id}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                          selectedReport === report.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedReport(report.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${report.bgColor}`}>
                              <IconComponent className={`w-5 h-5 ${report.color}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">{report.title}</h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                {report.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Actions */}
          {selectedReport && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>إجراءات التقرير</CardTitle>
                <CardDescription>خيارات تصدير ومشاركة التقرير</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => handleExportReport('PDF')} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    تصدير PDF
                  </Button>
                  <Button onClick={() => handleExportReport('Excel')} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    تصدير Excel
                  </Button>
                  <Button onClick={handlePrintReport} variant="outline" className="gap-2">
                    <Printer className="w-4 h-4" />
                    طباعة
                  </Button>
                  <Button onClick={handleEmailReport} variant="outline" className="gap-2">
                    <Mail className="w-4 h-4" />
                    إرسال عبر البريد
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Eye className="w-4 h-4" />
                    معاينة
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTypes.map((template, index) => {
              const IconComponent = template.icon;
              return (
                <Card key={template.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${template.bgColor}`}>
                        <IconComponent className={`w-5 h-5 ${template.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <Badge variant="secondary" className="mt-1">قالب جاهز</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setSelectedReport(template.id);
                          handleGenerateReport();
                        }}
                        className="flex-1"
                      >
                        إنشاء الآن
                      </Button>
                      <Button size="sm" variant="outline">
                        معاينة
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>اتجاهات القيمة المخزنية</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sampleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="قيمة" stroke="#3B82F6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>عدد الحركات الشهرية</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sampleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="حركات" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryReports;