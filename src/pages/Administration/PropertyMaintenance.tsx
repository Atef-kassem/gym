import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Building, 
  Wrench, 
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  MapPin,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Filter,
  User,
  Settings,
  BarChart3,
  Brain,
  Zap,
  TrendingUp,
  Shield,
  FileText,
  Wrench as Tool,
  Home,
  Lightbulb,
  Thermometer,
  Cpu
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Property {
  id: string;
  name: string;
  type: string;
  location: string;
  status: "excellent" | "good" | "fair" | "poor";
  value: number;
  lastInspection: string;
  nextMaintenance: string;
  maintenanceHistory: number;
  condition: number;
}

interface MaintenanceRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  type: "preventive" | "corrective" | "emergency";
  priority: "low" | "medium" | "high" | "urgent";
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  description: string;
  requestedBy: string;
  assignedTo?: string;
  cost?: number;
  startDate: string;
  completionDate?: string;
  estimatedHours: number;
  category: string;
}

const PropertyMaintenance = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const properties: Property[] = [
    {
      id: "PROP-001",
      name: "المبنى الرئيسي - الطابق الأول",
      type: "مكاتب إدارية",
      location: "الرياض - حي الملك فهد",
      status: "good",
      value: 2500000,
      lastInspection: "2024-01-10",
      nextMaintenance: "2024-03-15",
      maintenanceHistory: 15,
      condition: 85
    },
    {
      id: "PROP-002",
      name: "قاعة الاجتماعات الكبرى",
      type: "قاعات اجتماعات",
      location: "المبنى الرئيسي - الطابق الثاني",
      status: "excellent",
      value: 350000,
      lastInspection: "2024-01-08",
      nextMaintenance: "2024-04-01",
      maintenanceHistory: 8,
      condition: 95
    },
    {
      id: "PROP-003",
      name: "مولد الكهرباء الاحتياطي",
      type: "معدات فنية",
      location: "الطابق السفلي",
      status: "fair",
      value: 180000,
      lastInspection: "2024-01-05",
      nextMaintenance: "2024-02-01",
      maintenanceHistory: 25,
      condition: 70
    }
  ];

  const maintenanceRequests: MaintenanceRequest[] = [
    {
      id: "MAINT-001",
      propertyId: "PROP-001",
      propertyName: "المبنى الرئيسي - الطابق الأول",
      type: "preventive",
      priority: "medium",
      status: "scheduled",
      description: "صيانة دورية لأنظمة التكييف",
      requestedBy: "أحمد محمد",
      assignedTo: "فريق الصيانة الفنية",
      cost: 5500,
      startDate: "2024-02-01",
      estimatedHours: 8,
      category: "تكييف وتهوية"
    },
    {
      id: "MAINT-002",
      propertyId: "PROP-003",
      propertyName: "مولد الكهرباء الاحتياطي",
      type: "corrective",
      priority: "high",
      status: "in_progress",
      description: "إصلاح عطل في نظام الإشعال",
      requestedBy: "فاطمة علي",
      assignedTo: "مختص الكهرباء",
      cost: 2800,
      startDate: "2024-01-16",
      estimatedHours: 6,
      category: "كهرباء"
    },
    {
      id: "MAINT-003",
      propertyId: "PROP-002",
      propertyName: "قاعة الاجتماعات الكبرى",
      type: "preventive",
      priority: "low",
      status: "completed",
      description: "تنظيف وصيانة أجهزة العرض",
      requestedBy: "خالد أحمد",
      assignedTo: "فريق IT",
      cost: 850,
      startDate: "2024-01-12",
      completionDate: "2024-01-13",
      estimatedHours: 4,
      category: "تقنية المعلومات"
    }
  ];

  const stats = [
    {
      title: "إجمالي الممتلكات",
      value: "456",
      change: "+12",
      icon: Building,
      color: "text-blue-500"
    },
    {
      title: "أوامر الصيانة النشطة",
      value: "89",
      change: "+23",
      icon: Wrench,
      color: "text-orange-500"
    },
    {
      title: "معدل توفر الأصول",
      value: "94.8%",
      change: "+2.1%",
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      title: "تكلفة الصيانة الشهرية",
      value: "₹45,670",
      change: "-8%",
      icon: DollarSign,
      color: "text-purple-500"
    }
  ];

  const aiInsights = [
    {
      title: "توقع أعطال المولد",
      description: "احتمالية عطل المولد الاحتياطي 75% خلال الشهرين القادمين",
      status: "warning",
      recommendation: "جدولة صيانة وقائية عاجلة"
    },
    {
      title: "تحسين جدولة الصيانة",
      description: "يمكن توفير 15% من التكاليف بتحسين جدولة الصيانة الوقائية",
      status: "success",
      recommendation: "تطبيق الجدولة المحسنة"
    },
    {
      title: "اكتشاف أنماط الأعطال",
      description: "اكتشاف نمط متكرر في أعطال أنظمة التكييف",
      status: "info",
      recommendation: "فحص شامل لأنظمة التكييف"
    }
  ];

  const maintenanceCategories = [
    { name: "تكييف وتهوية", count: 45, color: "bg-blue-500", icon: Thermometer },
    { name: "كهرباء", count: 32, color: "bg-yellow-500", icon: Lightbulb },
    { name: "سباكة", count: 28, color: "bg-cyan-500", icon: Tool },
    { name: "تقنية المعلومات", count: 19, color: "bg-purple-500", icon: Cpu },
    { name: "أمن وسلامة", count: 15, color: "bg-red-500", icon: Shield },
    { name: "عام", count: 23, color: "bg-green-500", icon: Home }
  ];

  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = maintenanceRequests.filter(request => 
    (selectedStatus === "all" || request.status === selectedStatus) &&
    (request.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     request.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "bg-green-100 text-green-800";
      case "good": return "bg-blue-100 text-blue-800";
      case "fair": return "bg-yellow-100 text-yellow-800";
      case "poor": return "bg-red-100 text-red-800";
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "scheduled": return "bg-orange-100 text-orange-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const handleAction = (action: string, id: string) => {
    toast({
      title: "تم تنفيذ العملية",
      description: `تم ${action} العنصر ${id} بنجاح`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white">
            <Building className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">إدارة الممتلكات والصيانة</h1>
            <p className="text-muted-foreground">نظام متكامل لإدارة الأصول والصيانة الوقائية والعلاجية</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-1">{stat.change} هذا الشهر</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                      <IconComponent className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Maintenance Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tool className="h-5 w-5" />
              فئات الصيانة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {maintenanceCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <div key={index} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 ${category.color} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                    <p className="text-2xl font-bold text-slate-800">{category.count}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Brain className="h-5 w-5" />
              رؤى الذكاء الاصطناعي للصيانة
            </CardTitle>
            <CardDescription>
              تحليلات تنبؤية لتحسين كفاءة الصيانة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border shadow-sm">
                  <div className="flex items-start gap-3">
                    {insight.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                    {insight.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />}
                    {insight.status === 'info' && <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />}
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {insight.recommendation}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="properties">الممتلكات</TabsTrigger>
            <TabsTrigger value="maintenance">أوامر الصيانة</TabsTrigger>
            <TabsTrigger value="schedule">الجدولة</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            {/* Search and Controls */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>إدارة الممتلكات والأصول</CardTitle>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    إضافة ممتلك
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="البحث في الممتلكات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 ml-2" />
                      تصفية
                    </Button>
                    <Button variant="outline" size="sm">
                      <MapPin className="h-4 w-4 ml-2" />
                      الخريطة
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Properties Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  قائمة الممتلكات ({filteredProperties.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم الممتلك</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>الموقع</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>القيمة</TableHead>
                      <TableHead>مؤشر الحالة</TableHead>
                      <TableHead>آخر فحص</TableHead>
                      <TableHead>الصيانة القادمة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-medium">{property.name}</p>
                            <p className="text-xs text-muted-foreground">{property.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{property.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            {property.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(property.status)}>
                            {property.status === "excellent" ? "ممتاز" :
                             property.status === "good" ? "جيد" :
                             property.status === "fair" ? "مقبول" : "ضعيف"}
                          </Badge>
                        </TableCell>
                        <TableCell>{property.value.toLocaleString()} جنيه مصري</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={property.condition} className="w-16 h-2" />
                            <span className="text-sm">{property.condition}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{property.lastInspection}</TableCell>
                        <TableCell>{property.nextMaintenance}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => handleAction("عرض", property.id)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleAction("تعديل", property.id)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleAction("حذف", property.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            {/* Status Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "all", label: "الكل" },
                    { value: "scheduled", label: "مجدولة" },
                    { value: "in_progress", label: "قيد التنفيذ" },
                    { value: "completed", label: "مكتملة" },
                    { value: "cancelled", label: "ملغية" }
                  ].map((status) => (
                    <Button
                      key={status.value}
                      variant={selectedStatus === status.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedStatus(status.value)}
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Requests Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  أوامر الصيانة ({filteredRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الأمر</TableHead>
                      <TableHead>الممتلك</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>الوصف</TableHead>
                      <TableHead>الأولوية</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>المكلف</TableHead>
                      <TableHead>التكلفة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{request.propertyName}</p>
                            <Badge variant="outline" className="text-xs">{request.category}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            request.type === "preventive" ? "default" :
                            request.type === "corrective" ? "secondary" : "destructive"
                          }>
                            {request.type === "preventive" ? "وقائية" :
                             request.type === "corrective" ? "علاجية" : "طوارئ"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{request.description}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority === "urgent" ? "عاجل" :
                             request.priority === "high" ? "عالي" :
                             request.priority === "medium" ? "متوسط" : "منخفض"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status === "completed" ? "مكتمل" :
                             request.status === "in_progress" ? "قيد التنفيذ" :
                             request.status === "scheduled" ? "مجدول" : "ملغي"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-blue-500" />
                              <span className="text-sm">{request.assignedTo}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">غير محدد</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {request.cost ? `${request.cost.toLocaleString()} جنيه مصري` : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => handleAction("عرض", request.id)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleAction("تعديل", request.id)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleAction("إلغاء", request.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>جدولة الصيانة</CardTitle>
                <CardDescription>
                  تخطيط وجدولة أعمال الصيانة الوقائية والعلاجية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">جدولة الصيانة قيد التطوير</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>تقارير الممتلكات والصيانة</CardTitle>
                <CardDescription>
                  تقارير شاملة عن حالة الأصول وتكاليف الصيانة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لوحة التقارير قيد التطوير</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PropertyMaintenance;