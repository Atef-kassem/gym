import { useState } from "react";
import { useListApprovalsQuery, useActionApprovalMutation } from "@/services/procurementApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  MessageSquare, 
  Eye, 
  Search, 
  Calendar, 
  Clock, 
  AlertCircle, 
  FileText,
  User,
  Building,
  DollarSign,
  Package,
  Shield,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type HistoryEntry = { action: string; user: string; date: string; time: string; notes?: string };
type RequestItem = { name: string; quantity: number; unit: string; specifications: string; estimatedPrice: string };
type PendingRequest = {
  id: number;
  number: string;
  requester: string;
  department: string;
  date: string;
  priority: string;
  estimatedValue: string;
  itemsCount: number;
  currentApprover: string;
  daysWaiting: number;
  status: string;
  items: RequestItem[];
  history: HistoryEntry[];
};

const ApprovalWorkflow = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null);
  const [approvalAction, setApprovalAction] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");

  const { data: approvalsData, refetch } = useListApprovalsQuery({ status: 'pending' });
  const { data: approvedData } = useListApprovalsQuery({ status: 'approved' });
  const [doApproval] = useActionApprovalMutation();
  const pendingRequests = (approvalsData?.data || []).map((r: any) => ({
    id: r.id,
    number: r.requestNumber,
    requester: r.createdBy || '—',
    department: r.requestingDepartment,
    date: (r.createdAt || '').split('T')[0],
    priority: r.priority === 'urgent' ? 'عاجل' : r.priority === 'low' ? 'منخفض' : 'عادي',
    estimatedValue: r.estimatedValue || '-',
    itemsCount: r.items?.length || 0,
    currentApprover: '—',
    daysWaiting: 0,
    status: 'بانتظار الموافقة',
    items: (r.items || []).map((it: any) => ({ name: it.name, quantity: Number(it.quantity)||0, unit: it.unit, specifications: it.specifications, estimatedPrice: String(it.estimatedPrice||'') })),
    history: [],
  }));

  const approvedRequests = (approvedData?.data || []).map((r: any) => {
    const items = Array.isArray(r.items) ? r.items : [];
    const estimatedValue = items.reduce((sum: number, it: any) => sum + Number(it.estimatedPrice || 0), 0);
    return {
      id: r.id,
      number: r.requestNumber,
      requester: r.createdBy || '—',
      department: r.requestingDepartment,
      date: (r.createdAt || '').split('T')[0],
      approvedDate: (r.updatedAt || '').split('T')[0],
      approver: '—',
      estimatedValue: String(estimatedValue),
      status: 'معتمد',
    };
  });

  const handleApproval = async (action: string) => {
    if (!selectedRequest) return;
    try {
      await doApproval({ id: selectedRequest.id, action, notes: approvalNotes }).unwrap();
      await refetch();
      const messages = { approve: "تم اعتماد طلب الشراء بنجاح", reject: "تم رفض طلب الشراء", return: "تم إرجاع طلب الشراء للتعديل" };
      toast({ title: messages[action as keyof typeof messages], description: `طلب رقم ${selectedRequest.number}` });
    } catch (e: any) {
      toast({ title: "خطأ", description: e?.data?.message || 'تعذر تنفيذ الإجراء', variant: 'destructive' });
    }
    setSelectedRequest(null);
    setApprovalNotes("");
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      "عاجل": "destructive",
      "عادي": "default", 
      "منخفض": "secondary"
    };

    return (
      <Badge variant={variants[priority as keyof typeof variants] as "destructive" | "default" | "secondary"} className="font-medium">
        {priority}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      "بانتظار الموافقة": "secondary",
      "معتمد": "default",
      "مرفوض": "destructive"
    };

    const icons = {
      "بانتظار الموافقة": <Clock className="w-3 h-3 mr-1" />,
      "معتمد": <CheckCircle className="w-3 h-3 mr-1" />,
      "مرفوض": <XCircle className="w-3 h-3 mr-1" />
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as "default" | "destructive" | "secondary"} className="font-medium">
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
        <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
              دورة الموافقات
            </h1>
            <p className="text-lg text-slate-600 mt-2">
              إدارة موافقات طلبات الشراء ومتابعة سير العمليات بكفاءة عالية
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">بانتظار الموافقة</p>
                  <p className="text-2xl font-bold text-slate-900">{pendingRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">الطلبات المعتمدة</p>
                  <p className="text-2xl font-bold text-slate-900">{approvedRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">معدل الموافقة</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {pendingRequests.length + approvedRequests.length > 0 
                      ? Math.round((approvedRequests.length / (pendingRequests.length + approvedRequests.length)) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
      </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border-0 shadow-lg p-1 rounded-xl">
            <TabsTrigger 
              value="pending" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
            >
            <Clock className="ml-2 h-4 w-4" />
            بانتظار الموافقة ({pendingRequests.length})
          </TabsTrigger>
            <TabsTrigger 
              value="approved"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
            >
            <CheckCircle className="ml-2 h-4 w-4" />
            معتمدة ({approvedRequests.length})
          </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
            >
            <FileText className="ml-2 h-4 w-4" />
            سجل الموافقات
          </TabsTrigger>
        </TabsList>

        {/* الطلبات بانتظار الموافقة */}
        <TabsContent value="pending" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg border-b border-orange-100">
                <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  طلبات الشراء بانتظار الموافقة
                </CardTitle>
                <CardDescription className="text-slate-600 text-lg">
                  قائمة بجميع طلبات الشراء التي تحتاج موافقة فورية
                </CardDescription>
            </CardHeader>
              <CardContent className="p-8">
              {/* شريط البحث والفلاتر */}
                <div className="flex flex-col lg:flex-row items-center gap-4 mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex-1 w-full">
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input 
                      placeholder="البحث برقم الطلب أو اسم الطالب..." 
                        className="pl-10 border-slate-200 focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>
                <Select>
                    <SelectTrigger className="w-48 border-slate-200 focus:border-orange-500 transition-colors">
                    <SelectValue placeholder="أولوية الطلب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأولويات</SelectItem>
                    <SelectItem value="urgent">عاجل</SelectItem>
                    <SelectItem value="normal">عادي</SelectItem>
                    <SelectItem value="low">منخفض</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger className="w-48 border-slate-200 focus:border-orange-500 transition-colors">
                    <SelectValue placeholder="القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأقسام</SelectItem>
                    <SelectItem value="maintenance">قسم الصيانة</SelectItem>
                    <SelectItem value="sales">قسم المبيعات</SelectItem>
                    <SelectItem value="admin">الإدارة العامة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* جدول الطلبات */}
                <div className="overflow-hidden rounded-xl border border-slate-200">
              <Table>
                <TableHeader>
                      <TableRow className="bg-gradient-to-r from-slate-50 to-orange-50 hover:bg-slate-100">
                        <TableHead className="text-slate-700 font-semibold">رقم الطلب</TableHead>
                        <TableHead className="text-slate-700 font-semibold">الطالب</TableHead>
                        <TableHead className="text-slate-700 font-semibold">القسم</TableHead>
                        <TableHead className="text-slate-700 font-semibold">التاريخ</TableHead>
                        <TableHead className="text-slate-700 font-semibold">الأولوية</TableHead>
                        <TableHead className="text-slate-700 font-semibold">القيمة التقديرية</TableHead>
                        <TableHead className="text-slate-700 font-semibold">عدد الأصناف</TableHead>
                        <TableHead className="text-slate-700 font-semibold">أيام الانتظار</TableHead>
                        <TableHead className="text-slate-700 font-semibold">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                        <TableRow key={request.id} className="hover:bg-slate-50 transition-colors">
                          <TableCell className="font-medium text-slate-800">{request.number}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                              <div className="p-2 bg-blue-100 rounded-full">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                          {request.requester}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                              <div className="p-2 bg-green-100 rounded-full">
                                <Building className="h-4 w-4 text-green-600" />
                              </div>
                          {request.department}
                        </div>
                      </TableCell>
                          <TableCell className="text-slate-700">{request.date}</TableCell>
                      <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                              <div className="p-1 bg-green-100 rounded-full">
                          <DollarSign className="h-4 w-4 text-green-600" />
                              </div>
                              <span className="font-medium text-green-700">{request.estimatedValue} جنيه</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                              <div className="p-1 bg-blue-100 rounded-full">
                          <Package className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="font-medium">{request.itemsCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                            <Badge variant={request.daysWaiting > 3 ? "destructive" : "secondary"} className="font-medium">
                          {request.daysWaiting} أيام
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                                  className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 transition-colors"
                            >
                              <Eye className="ml-2 h-4 w-4" />
                              مراجعة
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh]">
                                <DialogHeader className="bg-gradient-to-r from-slate-50 to-orange-50 rounded-t-lg p-6">
                                  <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                      <FileText className="w-6 h-6 text-orange-600" />
                                    </div>
                                    مراجعة طلب الشراء - {request.number}
                                  </DialogTitle>
                                  <DialogDescription className="text-slate-600 text-lg">
                                مراجعة تفاصيل الطلب واتخاذ قرار الموافقة
                              </DialogDescription>
                            </DialogHeader>
                            
                            <ScrollArea className="max-h-[60vh]">
                                  <div className="space-y-6 p-6">
                                {/* معلومات الطلب الأساسية */}
                                    <div className="space-y-4">
                                      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        معلومات الطلب الأساسية
                                      </h3>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                          <Label className="text-slate-600 font-medium">رقم الطلب</Label>
                                          <div className="font-medium text-slate-800 p-2 bg-slate-50 rounded-lg">{request.number}</div>
                                  </div>
                                  <div className="space-y-2">
                                          <Label className="text-slate-600 font-medium">الطالب</Label>
                                          <div className="font-medium text-slate-800 p-2 bg-slate-50 rounded-lg">{request.requester}</div>
                                  </div>
                                  <div className="space-y-2">
                                          <Label className="text-slate-600 font-medium">القسم</Label>
                                          <div className="font-medium text-slate-800 p-2 bg-slate-50 rounded-lg">{request.department}</div>
                                  </div>
                                  <div className="space-y-2">
                                          <Label className="text-slate-600 font-medium">تاريخ الطلب</Label>
                                          <div className="font-medium text-slate-800 p-2 bg-slate-50 rounded-lg">{request.date}</div>
                                  </div>
                                  <div className="space-y-2">
                                          <Label className="text-slate-600 font-medium">الأولوية</Label>
                                          <div className="p-2 bg-slate-50 rounded-lg">{getPriorityBadge(request.priority)}</div>
                                  </div>
                                  <div className="space-y-2">
                                          <Label className="text-slate-600 font-medium">القيمة التقديرية</Label>
                                          <div className="font-medium text-green-700 p-2 bg-green-50 rounded-lg">{request.estimatedValue} جنيه</div>
                                        </div>
                                  </div>
                                </div>

                                    <Separator className="bg-slate-200" />

                                {/* الأصناف المطلوبة */}
                                <div className="space-y-4">
                                      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        الأصناف المطلوبة
                                      </h3>
                                      <div className="overflow-hidden rounded-xl border border-slate-200">
                                  <Table>
                                    <TableHeader>
                                            <TableRow className="bg-gradient-to-r from-slate-50 to-green-50">
                                              <TableHead className="text-slate-700 font-semibold">اسم الصنف</TableHead>
                                              <TableHead className="text-slate-700 font-semibold">الكمية</TableHead>
                                              <TableHead className="text-slate-700 font-semibold">الوحدة</TableHead>
                                              <TableHead className="text-slate-700 font-semibold">المواصفات</TableHead>
                                              <TableHead className="text-slate-700 font-semibold">السعر التقديري</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {request.items.map((item, index) => (
                                              <TableRow key={index} className="hover:bg-slate-50">
                                                <TableCell className="font-medium text-slate-800">{item.name}</TableCell>
                                                <TableCell className="text-slate-700">{item.quantity}</TableCell>
                                                <TableCell className="text-slate-700">{item.unit}</TableCell>
                                                <TableCell className="max-w-xs text-slate-600">{item.specifications}</TableCell>
                                                <TableCell className="text-green-700 font-medium">{item.estimatedPrice} جنيه</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                      </div>
                                </div>

                                    <Separator className="bg-slate-200" />

                                {/* سجل العمليات */}
                                <div className="space-y-4">
                                      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        سجل العمليات
                                      </h3>
                                  <div className="space-y-3">
                                        {request.history.length > 0 ? (
                                          request.history.map((entry, index) => (
                                            <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
                                              <div className="w-3 h-3 rounded-full bg-blue-500 mt-2"></div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 text-sm">
                                                  <span className="font-medium text-slate-800">{entry.action}</span>
                                                  <span className="text-slate-400">•</span>
                                                  <span className="text-slate-600">{entry.user}</span>
                                                  <span className="text-slate-400">•</span>
                                                  <span className="text-slate-600">{entry.date} - {entry.time}</span>
                                          </div>
                                          {entry.notes && (
                                                  <div className="text-sm text-slate-600 mt-2 p-2 bg-white rounded-lg border border-slate-200">{entry.notes}</div>
                                          )}
                                        </div>
                                            </div>
                                          ))
                                        ) : (
                                          <div className="text-center py-6 text-slate-500">
                                            <Clock className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                                            <p>لا توجد سجلات عمليات بعد</p>
                                          </div>
                                        )}
                                  </div>
                                </div>

                                    <Separator className="bg-slate-200" />

                                {/* ملاحظات الموافقة */}
                                <div className="space-y-4">
                                      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                        ملاحظات وقرار الموافقة
                                      </h3>
                                  <Textarea 
                                    placeholder="إضافة ملاحظات أو سبب الرفض/الإرجاع..."
                                    value={approvalNotes}
                                    onChange={(e) => setApprovalNotes(e.target.value)}
                                    rows={3}
                                        className="border-slate-200 focus:border-orange-500 transition-colors resize-none"
                                  />
                                </div>
                              </div>
                            </ScrollArea>

                                <DialogFooter className="bg-gradient-to-r from-slate-50 to-orange-50 p-6 rounded-b-lg">
                                  <div className="flex gap-3 w-full">
                                <Button 
                                  variant="destructive" 
                                  onClick={() => handleApproval('reject')}
                                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                  <XCircle className="ml-2 h-4 w-4" />
                                  رفض الطلب
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => handleApproval('return')}
                                      className="flex-1 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 transition-colors"
                                >
                                  <RotateCcw className="ml-2 h-4 w-4" />
                                  إرجاع للتعديل
                                </Button>
                                <Button 
                                  onClick={() => handleApproval('approve')}
                                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                  <CheckCircle className="ml-2 h-4 w-4" />
                                  اعتماد الطلب
                                </Button>
                              </div>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* الطلبات المعتمدة */}
        <TabsContent value="approved" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg border-b border-green-100">
                <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  الطلبات المعتمدة
                </CardTitle>
                <CardDescription className="text-slate-600 text-lg">
                  قائمة بجميع طلبات الشراء المعتمدة والمكتملة
                </CardDescription>
            </CardHeader>
              <CardContent className="p-8">
                <div className="overflow-hidden rounded-xl border border-slate-200">
              <Table>
                <TableHeader>
                      <TableRow className="bg-gradient-to-r from-slate-50 to-green-50 hover:bg-slate-100">
                        <TableHead className="text-slate-700 font-semibold">رقم الطلب</TableHead>
                        <TableHead className="text-slate-700 font-semibold">الطالب</TableHead>
                        <TableHead className="text-slate-700 font-semibold">القسم</TableHead>
                        <TableHead className="text-slate-700 font-semibold">تاريخ الطلب</TableHead>
                        <TableHead className="text-slate-700 font-semibold">تاريخ الاعتماد</TableHead>
                        <TableHead className="text-slate-700 font-semibold">المعتمد من</TableHead>
                        <TableHead className="text-slate-700 font-semibold">القيمة التقديرية</TableHead>
                        <TableHead className="text-slate-700 font-semibold">الحالة</TableHead>
                        <TableHead className="text-slate-700 font-semibold">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedRequests.map((request) => (
                        <TableRow key={request.id} className="hover:bg-slate-50 transition-colors">
                          <TableCell className="font-medium text-slate-800">{request.number}</TableCell>
                          <TableCell className="text-slate-700">{request.requester}</TableCell>
                          <TableCell className="text-slate-700">{request.department}</TableCell>
                          <TableCell className="text-slate-700">{request.date}</TableCell>
                          <TableCell className="text-slate-700">{request.approvedDate}</TableCell>
                          <TableCell className="text-slate-700">{request.approver}</TableCell>
                          <TableCell className="text-green-700 font-medium">{request.estimatedValue} جنيه</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-colors">
                            <Eye className="ml-2 h-4 w-4" />
                            عرض
                          </Button>
                              <Button variant="outline" size="sm" className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                            <FileText className="ml-2 h-4 w-4" />
                            طباعة
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* سجل الموافقات */}
        <TabsContent value="history" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b border-blue-100">
                <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  سجل جميع الموافقات
                </CardTitle>
                <CardDescription className="text-slate-600 text-lg">
                  سجل شامل لجميع عمليات الموافقة والرفض والإرجاع
                </CardDescription>
            </CardHeader>
              <CardContent className="p-8">
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
                    <FileText className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">لا توجد سجلات</h3>
                  <p className="text-slate-500">سيتم عرض سجل الموافقات هنا عند وجود عمليات</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default ApprovalWorkflow;