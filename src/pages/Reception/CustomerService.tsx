import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { BranchSelector } from "@/components/BranchSelector";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Eye,
  Phone,
  User,
  Calendar,
  Star,
  TrendingUp,
  Headphones,
  MessageCircle,
  Mail,
  Flag,
  ArrowUp,
  Timer,
  UserCheck,
  AlertCircle
} from "lucide-react";

const ticketStatuses = [
  { value: "open", label: "مفتوح", color: "bg-red-100 text-red-800", icon: AlertTriangle },
  { value: "in-progress", label: "قيد المعالجة", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  { value: "pending", label: "في الانتظار", color: "bg-blue-100 text-blue-800", icon: Timer },
  { value: "resolved", label: "تم الحل", color: "bg-green-100 text-green-800", icon: CheckCircle },
  { value: "closed", label: "مغلق", color: "bg-gray-100 text-gray-800", icon: Flag }
];

const priorityLevels = [
  { value: "low", label: "منخفضة", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "متوسطة", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "عالية", color: "bg-orange-100 text-orange-800" },
  { value: "urgent", label: "عاجل", color: "bg-red-100 text-red-800" }
];

const ticketCategories = [
  "شكوى على الخدمة",
  "مشكلة في الايصال",
  "استفسار عام",
  "طلب استرداد",
  "تقييم سلبي",
  "اقتراح تحسين",
  "مشكلة تقنية",
  "أخرى"
];

const mockTickets = [
  {
    id: "T-001",
    customerName: "أحمد محمد",
    customerPhone: "0501234567",
    subject: "عدم رضا عن جودة التنظيف",
    category: "شكوى على الخدمة",
    priority: "high",
    status: "open",
    assignedTo: "سارة أحمد",
    createdAt: "2024-01-15T10:30:00",
    lastUpdate: "2024-01-15T10:30:00",
    description: "العميل غير راضٍ عن جودة التنظيف الداخلي للمشروب، يطلب إعادة الخدمة",
    responses: [
      {
        id: 1,
        author: "سارة أحمد",
        message: "تم التواصل مع العميل وسيتم إعادة الخدمة مجاناً",
        timestamp: "2024-01-15T10:45:00",
        type: "staff"
      }
    ],
    sla: {
      responseTime: "15 دقيقة",
      resolutionTime: "2 ساعة",
      escalated: false
    }
  },
  {
    id: "T-002",
    customerName: "فاطمة علي",
    customerPhone: "0509876543",
    subject: "خطأ في المبلغ المخصوم",
    category: "مشكلة في الايصال",
    priority: "medium",
    status: "in-progress",
    assignedTo: "محمد خالد",
    createdAt: "2024-01-15T09:15:00",
    lastUpdate: "2024-01-15T11:00:00",
    description: "تم خصم مبلغ إضافي غير صحيح من بطاقة العميلة",
    responses: [
      {
        id: 1,
        author: "محمد خالد",
        message: "تم مراجعة الايصال مع قسم المالية",
        timestamp: "2024-01-15T09:30:00",
        type: "staff"
      },
      {
        id: 2,
        author: "فاطمة علي",
        message: "متى سيتم استرداد المبلغ؟",
        timestamp: "2024-01-15T10:00:00",
        type: "customer"
      }
    ],
    sla: {
      responseTime: "30 دقيقة",
      resolutionTime: "4 ساعات",
      escalated: false
    }
  },
  {
    id: "T-003",
    customerName: "محمد سالم",
    customerPhone: "0507654321",
    subject: "استفسار عن العضوية VIP",
    category: "استفسار عام",
    priority: "low",
    status: "resolved",
    assignedTo: "نورا أحمد",
    createdAt: "2024-01-15T08:00:00",
    lastUpdate: "2024-01-15T08:30:00",
    description: "العميل يريد معرفة مزايا العضوية VIP وكيفية الاشتراك",
    responses: [
      {
        id: 1,
        author: "نورا أحمد",
        message: "تم إرسال كافة التفاصيل للعميل عبر الواتساب",
        timestamp: "2024-01-15T08:15:00",
        type: "staff"
      }
    ],
    sla: {
      responseTime: "15 دقيقة",
      resolutionTime: "30 دقيقة",
      escalated: false
    }
  }
];

export default function CustomerService() {
  const [tickets, setTickets] = useState(mockTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    customerName: "",
    customerPhone: "",
    subject: "",
    category: "",
    priority: "medium",
    description: ""
  });
  const [newResponse, setNewResponse] = useState("");
  const { toast } = useToast();

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customerPhone.includes(searchTerm) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getStatusConfig = (status: string) => {
    return ticketStatuses.find(s => s.value === status) || ticketStatuses[0];
  };

  const getPriorityConfig = (priority: string) => {
    return priorityLevels.find(p => p.value === priority) || priorityLevels[1];
  };

  const handleCreateTicket = () => {
    if (!newTicket.customerName || !newTicket.subject || !newTicket.category) {
      toast({
        title: "خطأ",
        description: "يرجى إكمال جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const ticket = {
      id: `T-${String(tickets.length + 1).padStart(3, '0')}`,
      ...newTicket,
      status: "open",
      assignedTo: null,
      createdAt: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      responses: [],
      sla: {
        responseTime: "لم يتم الرد",
        resolutionTime: "غير محدد",
        escalated: false
      }
    };

    setTickets(prev => [ticket, ...prev]);
    setNewTicket({
      customerName: "",
      customerPhone: "",
      subject: "",
      category: "",
      priority: "medium",
      description: ""
    });
    setIsNewTicketOpen(false);

    toast({
      title: "تم إنشاء التذكرة بنجاح",
      description: `رقم التذكرة: ${ticket.id}`
    });
  };

  const handleAddResponse = () => {
    if (!newResponse.trim() || !selectedTicket) return;

    const response = {
      id: selectedTicket.responses.length + 1,
      author: "موظف خدمة العملاء",
      message: newResponse,
      timestamp: new Date().toISOString(),
      type: "staff"
    };

    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { 
              ...ticket, 
              responses: [...ticket.responses, response],
              lastUpdate: new Date().toISOString(),
              status: ticket.status === "open" ? "in-progress" : ticket.status
            }
          : ticket
      )
    );

    setSelectedTicket(prev => ({
      ...prev,
      responses: [...prev.responses, response]
    }));

    setNewResponse("");

    toast({
      title: "تم إضافة الرد",
      description: "تم إضافة ردك على التذكرة بنجاح"
    });
  };

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: newStatus, lastUpdate: new Date().toISOString() }
          : ticket
      )
    );

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => ({ ...prev, status: newStatus }));
    }

    toast({
      title: "تم تحديث الحالة",
      description: `تم تغيير حالة التذكرة إلى ${getStatusConfig(newStatus).label}`
    });
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in-progress").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
    avgResponseTime: "25 دقيقة"
  };

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Branch Selector */}
      <BranchSelector />
      {/* Header */}
      <div className="flex justify-between items-center animate-slide-in-right">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            خدمة العملاء
          </h1>
          <p className="text-muted-foreground animate-fade-in" style={{animationDelay: '200ms'}}>
            إدارة تذاكر الدعم والشكاوى والاستفسارات
          </p>
        </div>
        
        <div className="flex gap-3 animate-scale-in">
          <Button variant="outline" size="sm" className="hover-scale shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/50">
            <Headphones className="h-4 w-4 ml-2" />
            مركز الاتصالات
          </Button>
          
          <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/30 transition-all duration-300 hover-scale">
                <Plus className="h-4 w-4 ml-2" />
                تذكرة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  إنشاء تذكرة جديدة
                </DialogTitle>
                <DialogDescription>
                  إضافة شكوى أو استفسار جديد من العميل مع البحث الذكي عن العملاء الموجودين
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* قسم معلومات العميل */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    معلومات العميل
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="customerSearch">البحث عن عميل موجود</Label>
                      <div className="relative">
                        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="customerSearch"
                          placeholder="ابحث بالاسم أو رقم الجوال أو رقم اللوحة..."
                          className="pr-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        أو أدخل معلومات عميل جديد أدناه
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="customerName">اسم العميل *</Label>
                      <Input
                        id="customerName"
                        value={newTicket.customerName}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, customerName: e.target.value }))}
                        placeholder="أدخل اسم العميل"
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="customerPhone">رقم الجوال *</Label>
                      <Input
                        id="customerPhone"
                        value={newTicket.customerPhone}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, customerPhone: e.target.value }))}
                        placeholder="05xxxxxxxx"
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="plateNumber">رقم اللوحة (اختياري)</Label>
                      <Input
                        id="plateNumber"
                        placeholder="ABC 1234"
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">البريد الإلكتروني (اختياري)</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        placeholder="example@email.com"
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                {/* قسم تفاصيل التذكرة */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    تفاصيل التذكرة
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subject">موضوع التذكرة *</Label>
                      <Input
                        id="subject"
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="وصف مختصر ووافي للمشكلة أو الاستفسار"
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="category">التصنيف *</Label>
                        <Select 
                          value={newTicket.category} 
                          onValueChange={(value) => {
                            setNewTicket(prev => ({ ...prev, category: value }));
                            // تحديد الأولوية تلقائياً حسب التصنيف
                            if (value === "شكوى على الخدمة" || value === "تقييم سلبي") {
                              setNewTicket(prev => ({ ...prev, priority: "high" }));
                            } else if (value === "طلب استرداد") {
                              setNewTicket(prev => ({ ...prev, priority: "medium" }));
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر التصنيف" />
                          </SelectTrigger>
                          <SelectContent>
                            {ticketCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="priority">الأولوية</Label>
                        <Select value={newTicket.priority} onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الأولوية" />
                          </SelectTrigger>
                          <SelectContent>
                            {priorityLevels.map((priority) => (
                              <SelectItem key={priority.value} value={priority.value}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${priority.color.includes('green') ? 'bg-green-500' : 
                                    priority.color.includes('yellow') ? 'bg-yellow-500' : 
                                    priority.color.includes('orange') ? 'bg-orange-500' : 'bg-red-500'}`} />
                                  {priority.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="source">مصدر التذكرة</Label>
                        <Select defaultValue="reception">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reception">الاستقبال</SelectItem>
                            <SelectItem value="phone">هاتف</SelectItem>
                            <SelectItem value="email">بريد إلكتروني</SelectItem>
                            <SelectItem value="whatsapp">واتساب</SelectItem>
                            <SelectItem value="social">وسائل التواصل</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">تفاصيل التذكرة *</Label>
                      <Textarea
                        id="description"
                        value={newTicket.description}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="تفاصيل مفصلة عن المشكلة أو الاستفسار، تاريخ الحادثة، الخدمات المطلوبة، إلخ..."
                        className="min-h-[120px] focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                {/* قسم معلومات إضافية */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    معلومات إضافية
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lastServiceDate">تاريخ آخر خدمة (اختياري)</Label>
                      <Input
                        id="lastServiceDate"
                        type="date"
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="assignTo">تعيين إلى موظف</Label>
                      <Select defaultValue="">
                        <SelectTrigger>
                          <SelectValue placeholder="اختر موظف (اختياري)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sara">سارة أحمد - خدمة العملاء</SelectItem>
                          <SelectItem value="mohammed">محمد خالد - مدير العمليات</SelectItem>
                          <SelectItem value="ali">علي حسن - فني أول</SelectItem>
                          <SelectItem value="noor">نور العلي - خدمة العملاء</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="attachments">المرفقات (اختياري)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <input type="file" multiple accept="image/*,application/pdf" className="hidden" id="attachments" />
                      <label htmlFor="attachments" className="cursor-pointer">
                        <div className="text-gray-500">
                          <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p>اسحب الملفات هنا أو انقر للتحديد</p>
                          <p className="text-xs">PNG, JPG, PDF حتى 10MB</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewTicketOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreateTicket}>
                  <MessageSquare className="h-4 w-4 ml-2" />
                  إنشاء التذكرة
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 animate-scale-in">
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50 animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي التذاكر</p>
                <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">مفتوحة</p>
                <p className="text-2xl font-bold text-red-600">{stats.open}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">قيد المعالجة</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">تم الحل</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">متوسط الاستجابة</p>
                <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
              </div>
              <Timer className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث بالاسم، رقم الجوال، رقم التذكرة، الموضوع، أو التصنيف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-1 top-1 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchTerm("")}
                  >
                    ×
                  </Button>
                )}
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {ticketStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="الأولوية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأولويات</SelectItem>
                {priorityLevels.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التصنيفات</SelectItem>
                {ticketCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle>تذاكر الدعم ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد تذاكر مطابقة للفلاتر المحددة</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const statusConfig = getStatusConfig(ticket.status);
                const priorityConfig = getPriorityConfig(ticket.priority);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary text-primary-foreground rounded-lg p-2">
                                <MessageSquare className="h-4 w-4" />
                              </div>
                              <div>
                                <h3 className="font-semibold flex items-center gap-2">
                                  {ticket.id}
                                  <Badge className={statusConfig.color}>
                                    <StatusIcon className="h-3 w-3 ml-1" />
                                    {statusConfig.label}
                                  </Badge>
                                  <Badge className={priorityConfig.color}>
                                    {priorityConfig.label}
                                  </Badge>
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(ticket.createdAt).toLocaleString('ar-SA')}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium">{ticket.subject}</h4>
                            <p className="text-sm text-muted-foreground">{ticket.category}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{ticket.customerName}</div>
                                <div className="text-muted-foreground">{ticket.customerPhone}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">
                                  {ticket.assignedTo || "لم يتم التعيين"}
                                </div>
                                <div className="text-muted-foreground">موظف مسؤول</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{ticket.sla.responseTime}</div>
                                <div className="text-muted-foreground">وقت الاستجابة</div>
                              </div>
                            </div>
                          </div>

                          {ticket.description && (
                            <div className="bg-gray-50 p-2 rounded text-sm">
                              {ticket.description}
                            </div>
                          )}

                          {ticket.responses.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                              <MessageCircle className="h-4 w-4 inline ml-1" />
                              {ticket.responses.length} رد
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 mr-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 ml-1" />
                            عرض
                          </Button>
                          
                          {ticket.status !== "resolved" && ticket.status !== "closed" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(ticket.id, "in-progress")}
                              >
                                معالجة
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(ticket.id, "resolved")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                حل
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ticket Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل التذكرة {selectedTicket?.id}</DialogTitle>
            <DialogDescription>
              معلومات مفصلة والردود على تذكرة الدعم
            </DialogDescription>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-6">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">التفاصيل</TabsTrigger>
                  <TabsTrigger value="conversation">المحادثة</TabsTrigger>
                  <TabsTrigger value="actions">الإجراءات</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">معلومات التذكرة</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div><strong>الموضوع:</strong> {selectedTicket.subject}</div>
                        <div><strong>التصنيف:</strong> {selectedTicket.category}</div>
                        <div><strong>الأولوية:</strong> {getPriorityConfig(selectedTicket.priority).label}</div>
                        <div><strong>الحالة:</strong> {getStatusConfig(selectedTicket.status).label}</div>
                        <div><strong>تاريخ الإنشاء:</strong> {new Date(selectedTicket.createdAt).toLocaleString('ar-SA')}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">معلومات العميل</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div><strong>الاسم:</strong> {selectedTicket.customerName}</div>
                        <div><strong>الجوال:</strong> {selectedTicket.customerPhone}</div>
                        <div><strong>الموظف المسؤول:</strong> {selectedTicket.assignedTo || "لم يتم التعيين"}</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {selectedTicket.description && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">تفاصيل التذكرة</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{selectedTicket.description}</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="conversation" className="space-y-4">
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {selectedTicket.responses.map((response) => (
                      <Card key={response.id} className={response.type === "customer" ? "ml-8" : "mr-8"}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium">{response.author}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(response.timestamp).toLocaleString('ar-SA')}
                            </div>
                          </div>
                          <p className="text-sm">{response.message}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <Label>إضافة رد جديد:</Label>
                        <Textarea
                          value={newResponse}
                          onChange={(e) => setNewResponse(e.target.value)}
                          placeholder="اكتب ردك هنا..."
                          className="min-h-[100px]"
                        />
                        <Button onClick={handleAddResponse} disabled={!newResponse.trim()}>
                          <MessageCircle className="h-4 w-4 ml-2" />
                          إرسال الرد
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="actions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">إجراءات التذكرة</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        {ticketStatuses.map((status) => (
                          <Button
                            key={status.value}
                            variant={selectedTicket.status === status.value ? "default" : "outline"}
                            onClick={() => handleStatusChange(selectedTicket.id, status.value)}
                            className="justify-start"
                          >
                            <status.icon className="h-4 w-4 ml-2" />
                            {status.label}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}