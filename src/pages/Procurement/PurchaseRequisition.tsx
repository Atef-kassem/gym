import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Save, Send, FileText, Search, Calendar, AlertCircle, CheckCircle, Clock, ShoppingCart, Package, Users, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateRequisitionMutation, useSearchItemsQuery, useListRequisitionsQuery } from "@/services/procurementApi";

const PurchaseRequisition = () => {
  const { toast } = useToast();
  const [createRequisition, { isLoading: creating }] = useCreateRequisitionMutation();
  const [activeTab, setActiveTab] = useState("new");
  const [requisition, setRequisition] = useState({
    requestNumber: "PR-2024-001",
    requestType: "",
    requestingDepartment: "",
    requiredDate: "",
    priority: "normal",
    notes: "",
    items: [
      { id: 1, name: "", quantity: "", unit: "", specifications: "", estimatedPrice: "" }
    ]
  });

  // إغلاق البحث عند النقر خارج الحقول
  const handleClickOutside = () => {
    setActiveSearchItemId(null);
    setSearchQuery("");
  };

  // تنظيف البحث عند إضافة عنصر جديد
  const addItem = () => {
    setRequisition({
      ...requisition,
      items: [...requisition.items, { 
        id: Date.now(), 
        name: "", 
        quantity: "", 
        unit: "", 
        specifications: "", 
        estimatedPrice: "" 
      }]
    });
    // تنظيف البحث عند إضافة عنصر جديد
    setSearchQuery("");
    setActiveSearchItemId(null);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchItemId, setActiveSearchItemId] = useState<number | null>(null);
  
  // البحث عن جميع المنتجات (بدون فلتر) للتأكد من وجود البيانات
  const { data: allItemsData, isLoading: loadingAllItems } = useSearchItemsQuery(
    { type: requisition.requestType, q: "" },
    { 
      skip: !requisition.requestType,
      refetchOnMountOrArgChange: true
    }
  );

  // البحث عن منتجات محددة عند الكتابة
  const { data: searchResults, isLoading: searching } = useSearchItemsQuery(
    { type: requisition.requestType, q: searchQuery },
    { 
      skip: !requisition.requestType || !searchQuery || searchQuery.length < 2,
      refetchOnMountOrArgChange: true
    }
  );

  // إضافة console.log للتشخيص
  console.log('نوع الطلب:', requisition.requestType);
  console.log('استعلام البحث:', searchQuery);
  console.log('بيانات جميع المنتجات:', allItemsData);
  console.log('نتائج البحث:', searchResults);
  console.log('جاري التحميل:', loadingAllItems);
  console.log('جاري البحث:', searching);

  const { data: requisitionsData, refetch } = useListRequisitionsQuery({});

  const removeItem = (id: number) => {
    setRequisition({
      ...requisition,
      items: requisition.items.filter(item => item.id !== id)
    });
  };

  const updateItem = (id: number, field: string, value: string) => {
    console.log(`updateItem - id: ${id}, field: ${field}, value: ${value}`);
    console.log('قبل التحديث:', requisition.items.find(item => item.id === id));
    
    const newRequisition = {
      ...requisition,
      items: requisition.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    };
    
    setRequisition(newRequisition);
    
    // طباعة العنصر بعد التحديث
    const updatedItem = newRequisition.items.find(item => item.id === id);
    console.log('بعد التحديث:', updatedItem);
  };

  // دالة جديدة لملء جميع بيانات المنتج في مرة واحدة
  const fillProductData = (itemId: number, productData: any) => {
    console.log('ملء بيانات المنتج:', productData);
    console.log('الوحدة:', productData.unit);
    console.log('السعر:', productData.price);
    console.log('المواصفات:', productData.description || productData.specifications);
    
    setRequisition(prev => ({
      ...prev,
      items: prev.items.map(prevItem => 
        prevItem.id === itemId ? {
          ...prevItem,
          name: productData.name,
          unit: productData.unit || '  ',
          estimatedPrice: productData.price ? String(productData.price) : '',
          specifications: productData.description || productData.specifications || '',
          productId: productData.id
        } : prevItem
      )
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        requestNumber: requisition.requestNumber,
        requestType: requisition.requestType,
        requestingDepartment: requisition.requestingDepartment,
        requiredDate: requisition.requiredDate,
        priority: requisition.priority === 'urgent' ? 'urgent' : requisition.priority === 'low' ? 'low' : 'normal',
        notes: requisition.notes,
        status: 'draft',
        items: requisition.items.map(it => ({
          name: it.name,
          quantity: String(it.quantity || ''),
          unit: it.unit,
          specifications: it.specifications,
          estimatedPrice: String(it.estimatedPrice || ''),
        })),
      };
      const res = await createRequisition(payload).unwrap();
      await refetch();
      toast({ title: "تم حفظ طلب الشراء", description: `تم الحفظ برقم: ${res?.id || ''}` });
    } catch (e: any) {
      toast({ title: "فشل الحفظ", description: e?.data?.message || "حدث خطأ", variant: "destructive" });
    }
  };

  const handleSubmit = async () => {
    try {
      const payload: any = {
        // اترك requestNumber ليتولد تلقائياً لتفادي التعارض
        requestType: requisition.requestType,
        requestingDepartment: requisition.requestingDepartment,
        requiredDate: requisition.requiredDate,
        priority: requisition.priority,
        notes: requisition.notes,
        status: 'pending',
        createdBy: 1,
        items: requisition.items
          .filter((it) => (it.name || '').trim() !== '')
          .map((it) => ({
            name: it.name,
            quantity: String(it.quantity || ''),
            unit: it.unit,
            specifications: it.specifications,
            estimatedPrice: String(it.estimatedPrice || ''),
          })),
      };
      const res = await createRequisition(payload).unwrap();
      await refetch();
      toast({ title: 'تم إرسال طلب الشراء', description: `تم إرسال طلب الشراء للموافقة بنجاح (ID: ${res?.id || ''})` });
      // إعادة تهيئة بسيطة للنموذج
      setRequisition({
        requestNumber: requisition.requestNumber,
        requestType: '',
        requestingDepartment: '',
        requiredDate: '',
        priority: 'normal',
        notes: '',
        items: [ { id: 1, name: '', quantity: '', unit: '', specifications: '', estimatedPrice: '' } ],
      });
    } catch (e: any) {
      toast({ title: 'تعذر الإرسال', description: e?.data?.message || 'حدث خطأ', variant: 'destructive' });
    }
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
      "مرفوض": <AlertCircle className="w-3 h-3 mr-1" />
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as "default" | "destructive" | "secondary"} className="font-medium">
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      "urgent": "destructive",
      "normal": "default",
      "low": "secondary"
    };

    const labels = {
      "urgent": "عاجل",
      "normal": "عادي",
      "low": "منخفض"
    };

    return (
      <Badge variant={variants[priority as keyof typeof variants] as "default" | "destructive" | "secondary"} className="font-medium">
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6" onClick={handleClickOutside}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full shadow-lg">
            <ShoppingCart className="w-10 h-10 text-white" />
          </div>
        <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              طلبات الشراء الداخلية
            </h1>
            <p className="text-lg text-slate-600 mt-2">
              إدارة وتتبع جميع طلبات الشراء الداخلية بكفاءة عالية
          </p>
        </div>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">إجمالي الطلبات</p>
                  <p className="text-2xl font-bold text-slate-900">{(requisitionsData?.data || []).length}</p>
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
                  <p className="text-2xl font-bold text-slate-900">
                    {(requisitionsData?.data || []).filter((req: any) => req.status === 'approved').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">بانتظار الموافقة</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {(requisitionsData?.data || []).filter((req: any) => req.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg p-1 rounded-xl">
            <TabsTrigger 
              value="new" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
            >
            <Plus className="ml-2 h-4 w-4" />
            طلب شراء جديد
          </TabsTrigger>
            <TabsTrigger 
              value="list"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
            >
            <FileText className="ml-2 h-4 w-4" />
            قائمة الطلبات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b border-blue-100">
                <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="w-6 h-6 text-blue-600" />
                  </div>
                  إنشاء طلب شراء جديد
                </CardTitle>
                <CardDescription className="text-slate-600 text-lg">
                  تعبئة بيانات طلب الشراء الداخلي بكافة التفاصيل المطلوبة
                </CardDescription>
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-200 rounded-full">
                      <span className="text-blue-700 text-lg">💡</span>
                    </div>
                    <div>
                      <p className="text-blue-800 font-medium mb-1">نصيحة مهمة:</p>
                      <p className="text-blue-700 text-sm leading-relaxed">
                        عند الوقوف على حقل البحث، ستظهر جميع المنتجات المتاحة. 
                  يمكنك الكتابة للبحث عن منتج محدد أو اختيار من القائمة مباشرة.
                </p>
                    </div>
                  </div>
              </div>
            </CardHeader>
              <CardContent className="p-8 space-y-8">
              {/* المعلومات الأساسية */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    المعلومات الأساسية
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="requestNumber" className="text-slate-700 font-medium">رقم الطلب</Label>
                  <Input 
                    id="requestNumber" 
                    value={requisition.requestNumber}
                    disabled
                        className="bg-slate-50 border-slate-200 text-slate-600"
                  />
                </div>
                    <div className="space-y-3">
                      <Label htmlFor="requestType" className="text-slate-700 font-medium">نوع الطلب</Label>
                  <Select 
                    value={requisition.requestType}
                    onValueChange={(value) => {
                      setRequisition({...requisition, requestType: value});
                      setSearchQuery("");
                      setActiveSearchItemId(null);
                      
                      if (value) {
                        toast({ 
                          title: "تم تغيير نوع الطلب", 
                          description: `سيتم تحميل المنتجات المتاحة في نوع: ${value}` 
                        });
                      }
                    }}
                  >
                        <SelectTrigger className="border-slate-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="اختر نوع الطلب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="materials">مواد استهلاكية</SelectItem>
                      <SelectItem value="equipment">أجهزة ومعدات</SelectItem>
                      <SelectItem value="spares">مشروب ومنتجات</SelectItem>
                      <SelectItem value="services">خدمات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                    <div className="space-y-3">
                      <Label htmlFor="department" className="text-slate-700 font-medium">الجهة الطالبة</Label>
                  <Select 
                    value={requisition.requestingDepartment}
                    onValueChange={(value) => setRequisition({...requisition, requestingDepartment: value})}
                  >
                        <SelectTrigger className="border-slate-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="اختر الجهة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">قسم الصيانة</SelectItem>
                      <SelectItem value="sales">قسم المبيعات</SelectItem>
                      <SelectItem value="admin">الإدارة العامة</SelectItem>
                      <SelectItem value="operations">العمليات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="requiredDate" className="text-slate-700 font-medium flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" />
                        تاريخ الحاجة الفعلي
                      </Label>
                  <Input 
                    id="requiredDate" 
                    type="date"
                    value={requisition.requiredDate}
                    onChange={(e) => setRequisition({...requisition, requiredDate: e.target.value})}
                        className="border-slate-200 hover:border-blue-300 focus:border-blue-500 transition-colors"
                  />
                </div>
                    <div className="space-y-3">
                      <Label htmlFor="priority" className="text-slate-700 font-medium">أولوية الطلب</Label>
                  <Select 
                    value={requisition.priority}
                    onValueChange={(value) => setRequisition({...requisition, priority: value})}
                  >
                        <SelectTrigger className="border-slate-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">عاجل</SelectItem>
                      <SelectItem value="normal">عادي</SelectItem>
                      <SelectItem value="low">منخفض</SelectItem>
                    </SelectContent>
                  </Select>
                    </div>
                </div>
              </div>

              {/* الأصناف المطلوبة */}
                <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      الأصناف المطلوبة
                    </h3>
                    <Button 
                      onClick={addItem} 
                      variant="outline" 
                      size="sm"
                      className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-colors"
                    >
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة صنف
                  </Button>
                </div>

                  <div className="space-y-6">
                  {requisition.items.map((item, index) => (
                      <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-slate-50">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            <div className="space-y-3">
                              <Label className="text-slate-700 font-medium">اسم الصنف</Label>
                                                      <div className="relative">
                              <Input 
                                placeholder="ابحث عن المنتج (اكتب اسم أو كود المنتج)"
                                value={item.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateItem(item.id, 'name', val);
                                  setSearchQuery(val);
                                  setActiveSearchItemId(item.id);
                                  
                                  requisition.items.forEach(otherItem => {
                                    if (otherItem.id !== item.id) {
                                      updateItem(otherItem.id, 'name', otherItem.name);
                                    }
                                  });
                                }}
                                onFocus={() => {
                                  setActiveSearchItemId(item.id);
                                  if (item.name && item.name.length >= 2) {
                                    setSearchQuery(item.name);
                                  }
                                }}
                                onBlur={() => {
                                  setTimeout(() => setActiveSearchItemId(null), 200);
                                }}
                                  className="border-slate-200 hover:border-blue-300 focus:border-blue-500 transition-colors"
                              />
                                                        {activeSearchItemId === item.id && (
                                  <div className="absolute z-20 mt-2 w-full max-h-64 overflow-auto rounded-xl border border-slate-200 bg-white shadow-2xl">
                                    {/* عرض رسالة عند عدم اختيار نوع الطلب */}
                                    {!requisition.requestType && (
                                      <div className="p-4 text-center text-sm text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                          <div className="text-lg">⚠️</div>
                                          <div>يرجى اختيار نوع الطلب أولاً</div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* عرض رسالة عند اختيار نوع الطلب ولكن لا توجد منتجات */}
                                    {requisition.requestType && !loadingAllItems && (!allItemsData?.data || allItemsData.data.length === 0) && (
                                      <div className="p-4 text-center text-sm text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                          <div className="text-lg">📦</div>
                                          <div>لا توجد منتجات في نوع "{requisition.requestType}"</div>
                                          <div className="text-xs">تأكد من وجود منتجات في هذا النوع</div>
                                        </div>
                                      </div>
                                    )}

                                    {/* عرض رسالة التحميل */}
                                    {requisition.requestType && loadingAllItems && (
                                      <div className="p-4 text-center text-sm text-slate-600">
                                        <div className="flex items-center justify-center gap-2">
                                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                          جاري تحميل المنتجات...
                                        </div>
                                      </div>
                                    )}

                                    {/* عرض جميع المنتجات عند عدم وجود بحث */}
                                    {requisition.requestType && !loadingAllItems && allItemsData?.data && allItemsData.data.length > 0 && (!searchQuery || searchQuery.length < 2) && (
                                      <>
                                        <div className="p-3 text-xs text-slate-500 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                                          جميع المنتجات ({allItemsData.data.length} منتج)
                                        </div>
                                        {allItemsData.data.map((res: any) => (
                                          <button
                                            key={`${res.code}-${res.id}`}
                                            type="button"
                                            className="w-full text-right px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 text-sm transition-colors border-b border-slate-100 last:border-b-0"
                                            onClick={() => {
                                              console.log('تم اختيار المنتج:', res);
                                              if (!res.name) {
                                                console.error('خطأ: اسم المنتج غير موجود!');
                                                toast({ 
                                                  title: "خطأ", 
                                                  description: "اسم المنتج غير موجود في البيانات", 
                                                  variant: "destructive" 
                                                });
                                                return;
                                              }
                                              
                                              fillProductData(item.id, res);
                                              setSearchQuery("");
                                              setActiveSearchItemId(null);
                                              
                                              toast({ 
                                                title: "تم اختيار المنتج", 
                                                description: `تم تعبئة بيانات ${res.name} تلقائياً` 
                                              });
                                            }}
                                          >
                                            <div className="font-medium text-slate-800">{res.name}</div>
                                            <div className="text-xs text-slate-500 mt-1">
                                              {res.code} • {res.unit} • {res.price ? `${res.price} جنيه مصري` : 'غير محدد'}
                                            </div>
                                          </button>
                                        ))}
                                      </>
                                    )}

                                    {/* عرض نتائج البحث عند الكتابة */}
                                    {requisition.requestType && searchQuery && searchQuery.length >= 2 && (
                                  <>
                                    {searching ? (
                                          <div className="p-4 text-center text-sm text-slate-600">
                                        <div className="flex items-center justify-center gap-2">
                                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                          جاري البحث...
                                        </div>
                                      </div>
                                        ) : searchResults?.data && searchResults.data.length > 0 ? (
                                      <>
                                            <div className="p-3 text-xs text-slate-500 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                                          نتائج البحث: {searchResults.data.length} منتج
                                        </div>
                                        {searchResults.data.map((res: any) => (
                                          <button
                                            key={`${res.code}-${res.id}`}
                                            type="button"
                                                className="w-full text-right px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 text-sm transition-colors border-b border-slate-100 last:border-b-0"
                                            onClick={() => {
                                                  console.log('تم اختيار المنتج من البحث:', res);
                                              if (!res.name) {
                                                console.error('خطأ: اسم المنتج غير موجود!');
                                                toast({ 
                                                  title: "خطأ", 
                                                  description: "اسم المنتج غير موجود في البيانات", 
                                                  variant: "destructive" 
                                                });
                                                return;
                                              }
                                              
                                              fillProductData(item.id, res);
                                              setSearchQuery("");
                                              setActiveSearchItemId(null);
                                              
                                              toast({ 
                                                title: "تم اختيار المنتج", 
                                                description: `تم تعبئة بيانات ${res.name} تلقائياً` 
                                              });
                                            }}
                                          >
                                                <div className="font-medium text-slate-800">{res.name}</div>
                                                <div className="text-xs text-slate-500 mt-1">
                                              {res.code} • {res.unit} • {res.price ? `${res.price} جنيه مصري` : 'غير محدد'}
                                            </div>
                                          </button>
                                        ))}
                                      </>
                                    ) : searchQuery.length >= 2 ? (
                                          <div className="p-4 text-center text-sm text-slate-500">
                                        لا توجد نتائج للبحث عن "{searchQuery}"
                                      </div>
                                    ) : null}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                            <div className="space-y-3">
                              <Label className="text-slate-700 font-medium">الكمية</Label>
                          <Input 
                            type="number"
                            placeholder="0"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                                className="border-slate-200 hover:border-blue-300 focus:border-blue-500 transition-colors"
                          />
                        </div>
                            <div className="space-y-3">
                              <Label className="text-slate-700 font-medium">الوحدة</Label>
                          <Select 
                            value={item.unit}
                            onValueChange={(value) => updateItem(item.id, 'unit', value)}
                          >
                                <SelectTrigger className="border-slate-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
                              <SelectValue placeholder="الوحدة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="piece">  </SelectItem>
                              <SelectItem value="meter">متر</SelectItem>
                              <SelectItem value="liter">لتر</SelectItem>
                              <SelectItem value="kg">كيلوجرام</SelectItem>
                              <SelectItem value="box">صندوق</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                            <div className="space-y-3">
                              <Label className="text-slate-700 font-medium">السعر التقديري</Label>
                          <Input 
                            type="number"
                            placeholder="0.00"
                            value={item.estimatedPrice}
                            onChange={(e) => updateItem(item.id, 'estimatedPrice', e.target.value)}
                                className="border-slate-200 hover:border-blue-300 focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div className="flex items-end">
                          {requisition.items.length > 1 && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeItem(item.id)}
                                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                            >
                              حذف
                            </Button>
                          )}
                        </div>
                      </div>
                          <div className="mt-6 space-y-3">
                            <Label className="text-slate-700 font-medium">المواصفات والوصف</Label>
                        <Textarea 
                          placeholder="وصف تفصيلي للمادة ومواصفاتها الفنية"
                          value={item.specifications}
                          onChange={(e) => updateItem(item.id, 'specifications', e.target.value)}
                              className="border-slate-200 hover:border-blue-300 focus:border-blue-500 transition-colors resize-none"
                              rows={3}
                        />
                      </div>
                        </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* الملاحظات */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    ملاحظات إضافية
                  </h3>
                <Textarea 
                  id="notes"
                  placeholder="أي ملاحظات أو تعليمات خاصة"
                  value={requisition.notes}
                  onChange={(e) => setRequisition({...requisition, notes: e.target.value})}
                    className="border-slate-200 hover:border-blue-300 focus:border-blue-500 transition-colors resize-none"
                    rows={4}
                />
              </div>

              {/* أزرار الإجراء */}
                <div className="flex gap-4 justify-end pt-6 border-t border-slate-200">
                  <Button 
                    variant="outline" 
                    onClick={handleSave}
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors px-8"
                  >
                  <Save className="ml-2 h-4 w-4" />
                  حفظ كمسودة
                </Button>
                  <Button 
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                  >
                  <Send className="ml-2 h-4 w-4" />
                  إرسال للموافقة
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg border-b border-slate-200">
                <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <FileText className="w-6 h-6 text-slate-600" />
                  </div>
                  قائمة طلبات الشراء
                </CardTitle>
                <CardDescription className="text-slate-600 text-lg">
                  عرض وإدارة جميع طلبات الشراء الداخلية
                </CardDescription>
            </CardHeader>
              <CardContent className="p-8">
              {/* شريط البحث والفلاتر */}
                <div className="flex flex-col lg:flex-row items-center gap-4 mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex-1 w-full">
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input 
                      placeholder="البحث برقم الطلب أو الجهة..." 
                        className="pl-10 border-slate-200 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
                <Select>
                    <SelectTrigger className="w-48 border-slate-200 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="حالة الطلب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="pending">بانتظار الموافقة</SelectItem>
                    <SelectItem value="approved">معتمد</SelectItem>
                    <SelectItem value="rejected">مرفوض</SelectItem>
                  </SelectContent>
                </Select>
                  <Button variant="outline" className="border-slate-200 hover:border-blue-300 transition-colors">
                  <Calendar className="ml-2 h-4 w-4" />
                  تصفية بالتاريخ
                </Button>
              </div>

              {/* جدول الطلبات */}
                <div className="overflow-hidden rounded-xl border border-slate-200">
              <Table>
                <TableHeader>
                      <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50 hover:bg-slate-100">
                        <TableHead className="text-slate-700 font-semibold">رقم الطلب</TableHead>
                        <TableHead className="text-slate-700 font-semibold">الجهة الطالبة</TableHead>
                        <TableHead className="text-slate-700 font-semibold">التاريخ</TableHead>
                        <TableHead className="text-slate-700 font-semibold">عدد الأصناف</TableHead>
                        <TableHead className="text-slate-700 font-semibold">القيمة التقديرية</TableHead>
                        <TableHead className="text-slate-700 font-semibold">الحالة</TableHead>
                        <TableHead className="text-slate-700 font-semibold">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(requisitionsData?.data || []).map((req: any) => (
                        <TableRow key={req.id} className="hover:bg-slate-50 transition-colors">
                          <TableCell className="font-medium text-slate-800">{req.requestNumber}</TableCell>
                          <TableCell className="text-slate-700">{req.requestingDepartment}</TableCell>
                          <TableCell className="text-slate-700">{new Date(req.createdAt).toISOString().split('T')[0]}</TableCell>
                          <TableCell className="text-slate-700">{req.itemsCount ?? '-'}</TableCell>
                          <TableCell className="text-slate-700 font-medium">{req.estimatedValue ?? '-'} جنيه</TableCell>
                          <TableCell>
                            {getStatusBadge(
                        req.status === 'draft' ? 'بانتظار الموافقة' : req.status === 'approved' ? 'معتمد' : req.status === 'rejected' ? 'مرفوض' : 'بانتظار الموافقة'
                            )}
                          </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-colors">
                                عرض
                              </Button>
                              <Button variant="outline" size="sm" className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                                تعديل
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
      </Tabs>
      </div>
    </div>
  );
};

export default PurchaseRequisition;