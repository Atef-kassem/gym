import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Settings, 
  Search, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Star,
  Eye,
  Edit,
  Trash2,
  Filter,
  Calendar,
  User,
  MessageSquare,
  BarChart3,
  Brain,
  Zap,
  TrendingUp,
  Phone,
  Mail,
  FileText,
  UserCheck,
  ClipboardList
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ServiceRequest {
  id: string;
  title: string;
  type: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  requester: string;
  assignee?: string;
  createdDate: string;
  dueDate: string;
  description: string;
  category: string;
  estimatedTime?: string;
  satisfactionRating?: number;
}

const GeneralServices = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const serviceRequests: ServiceRequest[] = [
    {
      id: "REQ-001",
      title: "طلب صيانة أجهزة الكمبيوتر",
      type: "IT Support",
      priority: "high",
      status: "in_progress",
      requester: "أحمد محمد",
      assignee: "فريق الدعم التقني",
      createdDate: "2024-01-15",
      dueDate: "2024-01-17",
      description: "مشاكل في أداء أجهزة الكمبيوتر بقسم المحاسبة",
      category: "تقنية المعلومات",
      estimatedTime: "4 ساعات",
      satisfactionRating: 4.5
    },
    {
      id: "REQ-002",
      title: "طلب تجديد بطاقات الهوية",
      type: "HR Service",
      priority: "medium",
      status: "pending",
      requester: "فاطمة علي",
      createdDate: "2024-01-14",
      dueDate: "2024-01-20",
      description: "تجديد بطاقات الهوية للموظفين الجدد",
      category: "الموارد البشرية",
      estimatedTime: "2 أيام"
    },
    {
      id: "REQ-003",
      title: "طلب تنظيف إضافي للمكاتب",
      type: "Facility Service",
      priority: "low",
      status: "completed",
      requester: "خالد أحمد",
      assignee: "فريق النظافة",
      createdDate: "2024-01-12",
      dueDate: "2024-01-15",
      description: "تنظيف عميق لمكاتب الطابق الثالث",
      category: "الخدمات العامة",
      estimatedTime: "6 ساعات",
      satisfactionRating: 5.0
    }
  ];

  const serviceCategories = [
    { value: "all", label: "جميع الطلبات", count: serviceRequests.length },
    { value: "it", label: "تقنية المعلومات", count: 45, color: "bg-blue-500" },
    { value: "hr", label: "الموارد البشرية", count: 23, color: "bg-green-500" },
    { value: "facility", label: "الخدمات العامة", count: 34, color: "bg-purple-500" },
    { value: "finance", label: "الشؤون المالية", count: 18, color: "bg-orange-500" },
    { value: "admin", label: "الشؤون الإدارية", count: 29, color: "bg-pink-500" }
  ];

  const stats = [
    {
      title: "إجمالي الطلبات",
      value: "1,247",
      change: "+23",
      icon: ClipboardList,
      color: "text-blue-500"
    },
    {
      title: "قيد التنفيذ",
      value: "89",
      change: "+12",
      icon: Clock,
      color: "text-orange-500"
    },
    {
      title: "مكتملة",
      value: "1,098",
      change: "+45",
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      title: "متوسط الرضا",
      value: "4.7/5",
      change: "+0.2",
      icon: Star,
      color: "text-yellow-500"
    }
  ];

  const aiInsights = [
    {
      title: "ذروة الطلبات المتوقعة",
      description: "نتوقع زيادة 30% في طلبات IT يوم الاثنين",
      status: "warning",
      recommendation: "زيادة فريق الدعم التقني"
    },
    {
      title: "تحسين معدل الاستجابة",
      description: "معدل الاستجابة تحسن بنسبة 25% هذا الشهر",
      status: "success",
      recommendation: "الحفاظ على الأداء الحالي"
    },
    {
      title: "طلبات متكررة مكتشفة",
      description: "15 طلب متكرر يمكن أتمتتها",
      status: "info",
      recommendation: "إنشاء حلول تلقائية للطلبات المتكررة"
    }
  ];

  const quickActions = [
    { title: "طلب جديد", icon: Plus, color: "bg-blue-500", description: "إنشاء طلب خدمة جديد" },
    { title: "الطلبات العاجلة", icon: AlertTriangle, color: "bg-red-500", description: "عرض الطلبات عالية الأولوية" },
    { title: "تقييم الخدمات", icon: Star, color: "bg-yellow-500", description: "تقييمات العملاء" },
    { title: "فريق العمل", icon: UserCheck, color: "bg-green-500", description: "إدارة فرق الخدمة" }
  ];

  const filteredRequests = serviceRequests.filter(request => 
    (selectedStatus === "all" || request.status === selectedStatus) &&
    (request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     request.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
     request.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleAction = (action: string, requestId: string) => {
    toast({
      title: "تم تنفيذ العملية",
      description: `تم ${action} الطلب ${requestId} بنجاح`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">إدارة الخدمات العامة</h1>
            <p className="text-muted-foreground">إدارة شاملة لطلبات الخدمات وتتبع الأداء مدعومة بالذكاء الاصطناعي</p>
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              الإجراءات السريعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex-col gap-2 hover:scale-105 transition-transform"
                    onClick={() => toast({ title: action.title, description: action.description })}
                  >
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{action.title}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Brain className="h-5 w-5" />
              رؤى الذكاء الاصطناعي
            </CardTitle>
            <CardDescription>
              تحليلات ذكية لتحسين كفاءة الخدمات
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
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requests">طلبات الخدمة</TabsTrigger>
            <TabsTrigger value="teams">فرق العمل</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-6">
            {/* Controls */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>إدارة طلبات الخدمة</CardTitle>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    طلب جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="البحث في الطلبات..."
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
                      <Calendar className="h-4 w-4 ml-2" />
                      التاريخ
                    </Button>
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "all", label: "الكل" },
                    { value: "pending", label: "قيد الانتظار" },
                    { value: "in_progress", label: "قيد التنفيذ" },
                    { value: "completed", label: "مكتمل" },
                    { value: "cancelled", label: "ملغي" }
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

            {/* Service Categories */}
            <Card>
              <CardHeader>
                <CardTitle>الفئات الخدمية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {serviceCategories.slice(1).map((category) => (
                    <div key={category.value} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className={`w-12 h-12 ${category.color} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                        <Settings className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{category.label}</h3>
                      <p className="text-2xl font-bold text-slate-800">{category.count}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requests Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  قائمة الطلبات ({filteredRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الطلب</TableHead>
                      <TableHead>العنوان</TableHead>
                      <TableHead>مقدم الطلب</TableHead>
                      <TableHead>الفئة</TableHead>
                      <TableHead>الأولوية</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>تاريخ الاستحقاق</TableHead>
                      <TableHead>التقييم</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.title}</p>
                            <p className="text-xs text-muted-foreground">{request.type}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-500" />
                            {request.requester}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.category}</Badge>
                        </TableCell>
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
                             request.status === "pending" ? "قيد الانتظار" : "ملغي"}
                          </Badge>
                        </TableCell>
                        <TableCell>{request.dueDate}</TableCell>
                        <TableCell>
                          {request.satisfactionRating ? (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm">{request.satisfactionRating}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
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

          <TabsContent value="teams">
            <Card>
              <CardHeader>
                <CardTitle>إدارة فرق العمل</CardTitle>
                <CardDescription>
                  إدارة فرق الخدمة وتوزيع المهام
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">إدارة فرق العمل قيد التطوير</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>تحليلات الأداء</CardTitle>
                <CardDescription>
                  إحصائيات وتحليلات شاملة لأداء الخدمات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لوحة التحليلات قيد التطوير</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الخدمات</CardTitle>
                <CardDescription>
                  تخصيص إعدادات النظام وفئات الخدمات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">صفحة الإعدادات قيد التطوير</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GeneralServices;