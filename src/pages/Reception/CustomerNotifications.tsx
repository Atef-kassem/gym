import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Bell, 
  Send, 
  Phone, 
  Mail, 
  Smartphone,
  Settings,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Calendar,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react";

const notificationTypes = [
  { value: "sms", label: "رسالة نصية", icon: Smartphone },
  { value: "whatsapp", label: "واتساب", icon: MessageSquare },
  { value: "email", label: "بريد إلكتروني", icon: Mail },
  { value: "call", label: "مكالمة هاتفية", icon: Phone }
];

const notificationTemplates = [
  {
    id: "arrival_confirmation",
    name: "تأكيد وصول العميل",
    content: "مرحباً {customer_name}، تم تسجيل وصولك بنجاح. رقم تذكرتك: {ticket_number}. الوقت المتوقع للخدمة: {estimated_time}",
    variables: ["customer_name", "ticket_number", "estimated_time"],
    category: "استقبال"
  },
  {
    id: "service_ready",
    name: "إشعار جاهزية الخدمة",
    content: "عزيزي {customer_name}، سيارتك جاهزة للاستلام. يرجى التوجه لاستلام سيارتك. إجمالي المبلغ: {total_amount} جنيه",
    variables: ["customer_name", "total_amount"],
    category: "إتمام"
  },
  {
    id: "feedback_request",
    name: "طلب تقييم الخدمة",
    content: "شكراً لزيارتك {customer_name}! نرجو تقييم خدمتنا من خلال الرابط: {feedback_link}",
    variables: ["customer_name", "feedback_link"],
    category: "تقييم"
  },
  {
    id: "appointment_reminder",
    name: "تذكير بالموعد",
    content: "تذكير: لديك موعد غداً في {appointment_time}. للإلغاء أو التأجيل اتصل بنا على {phone_number}",
    variables: ["appointment_time", "phone_number"],
    category: "حجز"
  }
];

const mockNotifications = [
  {
    id: "N001",
    customerName: "أحمد محمد",
    customerPhone: "0501234567",
    type: "sms",
    template: "service_ready",
    status: "sent",
    sentAt: "2024-01-15T10:30:00",
    message: "عزيزي أحمد محمد، سيارتك جاهزة للاستلام. إجمالي المبلغ: 50 جنيه"
  },
  {
    id: "N002",
    customerName: "فاطمة علي",
    customerPhone: "0509876543",
    type: "whatsapp",
    template: "arrival_confirmation",
    status: "pending",
    sentAt: null,
    message: "مرحباً فاطمة علي، تم تسجيل وصولك بنجاح. رقم تذكرتك: A002"
  }
];

export default function CustomerNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedTemplate, setSelectedTemplate] = useState("custom-message");
  const [customMessage, setCustomMessage] = useState("");
  const [recipients, setRecipients] = useState("");
  const [notificationType, setNotificationType] = useState("sms");
  const [isNewNotificationOpen, setIsNewNotificationOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [autoNotifications, setAutoNotifications] = useState({
    arrivalConfirmation: true,
    serviceReady: true,
    feedbackRequest: true,
    appointmentReminder: true
  });
  const { toast } = useToast();

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.customerPhone.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || notification.status === filterStatus;
    const matchesType = filterType === "all" || notification.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleSendNotification = () => {
    if (!recipients || (selectedTemplate === "custom-message" && !customMessage) || (selectedTemplate !== "custom-message" && !notificationTemplates.find(t => t.id === selectedTemplate))) {
      toast({
        title: "خطأ",
        description: "يرجى إكمال جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const template = notificationTemplates.find(t => t.id === selectedTemplate);
    const message = selectedTemplate === "custom-message" ? customMessage : (template?.content || "");

    const newNotification = {
      id: `N${String(notifications.length + 1).padStart(3, '0')}`,
      customerName: "عميل متعدد", // In real app, this would be parsed from recipients
      customerPhone: recipients,
      type: notificationType,
      template: selectedTemplate === "custom-message" ? "custom" : selectedTemplate,
      status: "sent",
      sentAt: new Date().toISOString(),
      message: message
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Reset form
    setSelectedTemplate("custom-message");
    setCustomMessage("");
    setRecipients("");
    setIsNewNotificationOpen(false);

    toast({
      title: "تم إرسال الإشعار بنجاح",
      description: `تم إرسال ${recipients.split(',').length} إشعار`
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      sent: { label: "تم الإرسال", color: "bg-green-100 text-green-800" },
      pending: { label: "في الانتظار", color: "bg-yellow-100 text-yellow-800" },
      failed: { label: "فشل", color: "bg-red-100 text-red-800" },
      delivered: { label: "تم التسليم", color: "bg-blue-100 text-blue-800" }
    };
    return config[status] || config.pending;
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = notificationTypes.find(t => t.value === type);
    return typeConfig?.icon || MessageSquare;
  };

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center animate-slide-in-right">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            إشعارات العملاء
          </h1>
          <p className="text-muted-foreground animate-fade-in" style={{animationDelay: '200ms'}}>
            إدارة وإرسال الإشعارات والرسائل للعملاء
          </p>
        </div>
        
        <div className="flex gap-3 animate-scale-in">
          <Button variant="outline" className="hover-scale shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/50">
            <Settings className="h-4 w-4 ml-2" />
            إعدادات الإشعارات
          </Button>
          
          <Dialog open={isNewNotificationOpen} onOpenChange={setIsNewNotificationOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/30 transition-all duration-300 hover-scale">
                <Plus className="h-4 w-4 ml-2" />
                إشعار جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إرسال إشعار جديد</DialogTitle>
                <DialogDescription>
                  إرسال رسالة أو إشعار للعملاء
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>نوع الإشعار</Label>
                    <Select value={notificationType} onValueChange={setNotificationType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {notificationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>قالب الرسالة</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر قالب أو اكتب رسالة مخصصة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom-message">رسالة مخصصة</SelectItem>
                        {notificationTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>المستقبلون (أرقام الجوال مفصولة بفاصلة)</Label>
                  <Input
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    placeholder="0501234567, 0509876543"
                  />
                </div>

                <div>
                  <Label>محتوى الرسالة</Label>
                  {selectedTemplate && selectedTemplate !== "custom-message" ? (
                    <div className="p-3 bg-gray-50 rounded border">
                      <p className="text-sm">
                        {notificationTemplates.find(t => t.id === selectedTemplate)?.content}
                      </p>
                      {notificationTemplates.find(t => t.id === selectedTemplate)?.variables && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">المتغيرات المتاحة:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {notificationTemplates.find(t => t.id === selectedTemplate)?.variables.map((variable) => (
                              <Badge key={variable} variant="outline" className="text-xs">
                                {`{${variable}}`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="اكتب رسالتك المخصصة..."
                      className="min-h-[100px]"
                    />
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewNotificationOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSendNotification}>
                  <Send className="h-4 w-4 ml-2" />
                  إرسال الإشعار
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الإشعارات</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">تم الإرسال اليوم</p>
                <p className="text-2xl font-bold">{notifications.filter(n => n.status === "sent").length}</p>
              </div>
              <Send className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">معدل التسليم</p>
                <p className="text-2xl font-bold">98%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">معدل الاستجابة</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications">سجل الإشعارات</TabsTrigger>
          <TabsTrigger value="templates">قوالب الرسائل</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات التلقائية</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[250px]">
                  <Input
                    placeholder="ابحث بالاسم أو رقم الجوال..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="sent">تم الإرسال</SelectItem>
                    <SelectItem value="pending">في الانتظار</SelectItem>
                    <SelectItem value="failed">فشل</SelectItem>
                    <SelectItem value="delivered">تم التسليم</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    {notificationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <Card>
            <CardHeader>
              <CardTitle>سجل الإشعارات ({filteredNotifications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد إشعارات مطابقة للفلاتر المحددة</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => {
                    const statusConfig = getStatusBadge(notification.status);
                    const TypeIcon = getTypeIcon(notification.type);
                    
                    return (
                      <Card key={notification.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="bg-primary text-primary-foreground rounded-lg p-2">
                                  <TypeIcon className="h-4 w-4" />
                                </div>
                                <div>
                                  <h3 className="font-semibold">{notification.customerName}</h3>
                                  <p className="text-sm text-muted-foreground">{notification.customerPhone}</p>
                                </div>
                                <Badge className={statusConfig.color}>
                                  {statusConfig.label}
                                </Badge>
                                <Badge variant="outline">
                                  {notificationTypes.find(t => t.value === notification.type)?.label}
                                </Badge>
                              </div>
                              
                              <div className="bg-gray-50 p-3 rounded text-sm">
                                {notification.message}
                              </div>
                              
                              <div className="text-xs text-muted-foreground">
                                {notification.sentAt ? (
                                  <>تم الإرسال: {new Date(notification.sentAt).toLocaleString('ar-SA')}</>
                                ) : (
                                  "لم يتم الإرسال بعد"
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 mr-4">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 ml-1" />
                                عرض
                              </Button>
                              {notification.status === "pending" && (
                                <Button size="sm">
                                  <Send className="h-4 w-4 ml-1" />
                                  إرسال
                                </Button>
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
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>قوالب الرسائل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{template.name}</h3>
                            <Badge variant="outline">{template.category}</Badge>
                          </div>
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            {template.content}
                          </div>
                          {template.variables && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">المتغيرات:</p>
                              <div className="flex flex-wrap gap-1">
                                {template.variables.map((variable) => (
                                  <Badge key={variable} variant="outline" className="text-xs">
                                    {`{${variable}}`}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mr-4">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 ml-1" />
                            تعديل
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4 ml-1" />
                            حذف
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات التلقائية</CardTitle>
              <CardDescription>
                تفعيل أو إلغاء الإشعارات التلقائية للعملاء
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">تأكيد الوصول</h4>
                  <p className="text-sm text-muted-foreground">إرسال إشعار تلقائي عند وصول العميل</p>
                </div>
                <Switch 
                  checked={autoNotifications.arrivalConfirmation}
                  onCheckedChange={(checked) => 
                    setAutoNotifications(prev => ({ ...prev, arrivalConfirmation: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">جاهزية الخدمة</h4>
                  <p className="text-sm text-muted-foreground">إشعار العميل عند انتهاء الخدمة</p>
                </div>
                <Switch 
                  checked={autoNotifications.serviceReady}
                  onCheckedChange={(checked) => 
                    setAutoNotifications(prev => ({ ...prev, serviceReady: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">طلب التقييم</h4>
                  <p className="text-sm text-muted-foreground">طلب تقييم الخدمة بعد الانتهاء</p>
                </div>
                <Switch 
                  checked={autoNotifications.feedbackRequest}
                  onCheckedChange={(checked) => 
                    setAutoNotifications(prev => ({ ...prev, feedbackRequest: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">تذكير المواعيد</h4>
                  <p className="text-sm text-muted-foreground">تذكير العملاء بمواعيدهم المسبقة</p>
                </div>
                <Switch 
                  checked={autoNotifications.appointmentReminder}
                  onCheckedChange={(checked) => 
                    setAutoNotifications(prev => ({ ...prev, appointmentReminder: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}