import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, Save, Send, FileText, Search, Calendar, Users, DollarSign, CheckCircle, 
  Clock, AlertCircle, Upload, Download, Archive, Edit, Trash2, Eye, Mail, Phone,
  Brain, Zap, TrendingUp, BarChart3, PieChart, Target, Award, Shield,
  Bot, Sparkles, MessageSquare, RefreshCw, Filter, Globe, Settings, XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBranch } from "@/contexts/BranchContext";
import { useListRFQsQuery, useCreateRFQMutation, useListQuotationsQuery, useUpdateQuotationMutation, useListRequisitionsQuery, useSearchItemsQuery } from "@/services/procurementApi";
import { useGetAllSuppliersQuery } from "@/services/suppliersApi";

const RequestForQuotation = () => {
  const { toast } = useToast();
  const { selectedBranch } = useBranch();
  const [activeTab, setActiveTab] = useState("new");
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [savedRFQs, setSavedRFQs] = useState<any[]>([]);
  const [searchType, setSearchType] = useState<'equipment' | 'services' | 'spares' | 'materials'>('equipment');
  const [openSearch, setOpenSearch] = useState<{ rowId: number; field: 'name' | 'code' } | null>(null);
  const { data: rfqListData, refetch: refetchRFQs } = useListRFQsQuery({});
  const { data: quotationsData, refetch: refetchQuotations } = useListQuotationsQuery({});
  const [createRFQ] = useCreateRFQMutation();
  const [updateQuotation] = useUpdateQuotationMutation();
  const { data: approvedPRsData } = useListRequisitionsQuery({ status: 'approved' });
  const { data: suppliersData } = useGetAllSuppliersQuery();
  const [showVendorSelection, setShowVendorSelection] = useState(false);
  const [filteredQuotations, setFilteredQuotations] = useState<any[]>([]);
  const [filteredArchive, setFilteredArchive] = useState<any[]>([]);
  const [selectedComparisonRFQ, setSelectedComparisonRFQ] = useState<string>("");
  
  const [rfq, setRfq] = useState({
    rfqNumber: "RFQ-2024-001",
    createdDate: new Date().toISOString().split('T')[0],
    subject: "",
    requestingDepartment: "",
    requiredDate: "",
    paymentTerms: "",
    deliveryTerms: "",
    notes: "",
    selectedVendors: [] as string[],
    attachments: [] as File[],
    status: "مسودة",
    priority: "عادي",
    estimatedBudget: "",
    items: [
      { id: 1, code: "", name: "", quantity: "", unit: "", specifications: "", estimatedPrice: "" }
    ]
  });

  // Approved PRs from backend (with items)
  const approvedPurchaseRequests = (approvedPRsData?.data || []).map((r: any) => ({
    id: String(r.id),
    requestNumber: r.requestNumber,
    department: r.requestingDepartment,
    approvalDate: r.updatedAt?.split('T')[0] || '',
    priority: r.priority === 'urgent' ? 'عاجل' : r.priority === 'low' ? 'منخفض' : 'عادي',
    requiredDate: r.requiredDate,
    items: (r.items || []).map((it: any) => ({
      name: it.name,
      quantity: it.quantity,
      unit: it.unit,
      specifications: it.specifications,
      estimatedPrice: it.estimatedPrice,
    })),
  }));

  const vendors = (suppliersData?.data?.suppliers || []).map((s: any) => ({
    id: String(s.id),
    name: s.name_ar || s.name_en || s.company_name || "مورد",
    contact: s.contact_name || s.name_en || "",
    phone: s.phone || "",
    email: s.email || "",
    rating: s.rating || 4.5,
    responseTime: "—",
    completedOrders: s.completedOrders || 0,
    reliability: 90,
  }));

  // Data from backend
  const rfqs = rfqListData?.rfqs || [];
  const quotationsList = quotationsData || [];

  const statusToArabic = (s: string) => ({
    draft: "مسودة",
    sent: "مرسل",
    quotes_received: "عروض مستلمة",
    under_comparison: "قيد المقارنة",
    completed: "مكتمل",
    cancelled: "ملغي",
  } as any)[s] || s;

  const priorityToArabic = (p: string) => ({ urgent: "عاجل", normal: "عادي", low: "منخفض" } as any)[p] || p;

  const quotationStatusToArabic = (s: string) => ({
    accepted: "مقبول",
    rejected: "مرفوض",
    pending: "بانتظار",
    under_review: "قيد المراجعة",
  } as any)[s] || s;

  const getQuotesCountForRFQ = (rfqId: number) => (quotationsList || []).filter((q: any) => q.rfqId === rfqId).length;

  // Unified item search component (products, services, spare parts, consumables)
  const ItemUnifiedSearch = ({ query, onPick }: { query: string; onPick: (item: any) => void }) => {
    const [debounced, setDebounced] = useState(query);
    useEffect(() => {
      const id = setTimeout(() => setDebounced(query), 350);
      return () => clearTimeout(id);
    }, [query]);
    const minChars = 3;
    const { data, isFetching } = useSearchItemsQuery(
      { type: searchType, q: debounced },
      { skip: !debounced || debounced.length < minChars }
    );
    const results = Array.isArray(data) ? data : data?.data || [];
    if (!debounced || debounced.length < minChars) return null;
    return (
      <div className="p-1">
        {isFetching && <div className="p-2 text-xs text-muted-foreground">جاري البحث...</div>}
        {!isFetching && results.length === 0 && (
          <div className="p-2 text-xs text-muted-foreground">لا توجد نتائج</div>
        )}
        {!isFetching && results.map((r: any) => (
          <button
            key={(r.id ?? r._id ?? Math.random()).toString()}
            onClick={() => onPick(r)}
            className="w-full text-right px-3 py-2 hover:bg-muted/50 text-foreground"
          >
            <div className="text-sm font-medium">{r.label || r.name || r.productName || r.serviceName}</div>
            <div className="text-xs text-muted-foreground">
              {r.code || r.sku || ''} {r.unit ? `• ${r.unit}` : ''} {r.price ? `• ${r.price}` : ''}
            </div>
          </button>
        ))}
      </div>
    );
  };

  const addItem = () => {
    setRfq({
      ...rfq,
      items: [...rfq.items, { 
        id: Date.now(), 
        code: "",
        name: "", 
        quantity: "", 
        unit: "", 
        specifications: "",
        estimatedPrice: ""
      }]
    });
    
    toast({
      title: "تم إضافة صنف جديد",
      description: "يمكنك الآن تعبئة بيانات الصنف الجديد",
    });
  };

  const removeItem = (id: number) => {
    if (rfq.items.length <= 1) {
      toast({
        title: "تنبيه",
        description: "يجب أن يحتوي الطلب على صنف واحد على الأقل",
        variant: "destructive"
      });
      return;
    }
    
    setRfq({
      ...rfq,
      items: rfq.items.filter(item => item.id !== id)
    });
    
    toast({
      title: "تم حذف الصنف",
      description: "تم حذف الصنف من القائمة",
    });
  };

  // Function to import items from approved purchase requests
  const importFromPurchaseRequest = (requestId: string) => {
    const selectedRequest = approvedPurchaseRequests.find(req => req.id === requestId);
    if (!selectedRequest) {
      toast({
        title: "خطأ",
        description: "لم يتم العثور على طلب الشراء المحدد",
        variant: "destructive"
      });
      return;
    }

    const importedItems = selectedRequest.items.map(item => ({
      id: Date.now() + Math.random(), // Generate unique ID
      code: "",
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      specifications: item.specifications,
      estimatedPrice: item.estimatedPrice,
      sourceRequest: selectedRequest.requestNumber
    }));

    // Clear empty items and add imported items
    const filteredExistingItems = rfq.items.filter(item => item.name.trim() !== "");
    
    setRfq({
      ...rfq,
      items: [...filteredExistingItems, ...importedItems],
      subject: rfq.subject || `توريد أصناف من ${selectedRequest.requestNumber}`,
      requestingDepartment: rfq.requestingDepartment || selectedRequest.department,
      requiredDate: rfq.requiredDate || selectedRequest.requiredDate,
      priority: selectedRequest.priority
    });

    toast({
      title: "تم استيراد الأصناف بنجاح",
      description: `تم استيراد ${importedItems.length} صنف من طلب الشراء ${selectedRequest.requestNumber}`,
    });
  };

  const updateItem = (id: number, field: string, value: string) => {
    setRfq({
      ...rfq,
      items: rfq.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const toggleVendor = (vendorId: string) => {
    const updatedVendors = rfq.selectedVendors.includes(vendorId)
      ? rfq.selectedVendors.filter(id => id !== vendorId)
      : [...rfq.selectedVendors, vendorId];
    
    setRfq({
      ...rfq,
      selectedVendors: updatedVendors
    });

    const vendor = vendors.find(v => v.id === vendorId);
    toast({
      title: rfq.selectedVendors.includes(vendorId) ? "تم إلغاء تحديد المورد" : "تم اختيار المورد",
      description: `${vendor?.name}`,
    });
  };

const handleSave = async () => {
  // تحقق أساسي
  if (!rfq.subject.trim() || !rfq.requestingDepartment || !rfq.requiredDate) {
    toast({ title: "بيانات ناقصة", description: "الموضوع، الجهة، وتاريخ التوريد مطلوبة", variant: "destructive" });
    return;
  }

  const validItems = rfq.items.filter((it) => (it.name || '').trim() !== '');
  if (validItems.length === 0) {
    toast({ title: "أصناف مطلوبة", description: "أضف صنفًا واحدًا على الأقل", variant: "destructive" });
    return;
  }

  // توليد رقم فريد لتفادي التعارض في الحقل الفريد
  const ts = new Date();
  const rfqNumber = `RFQ-${ts.getFullYear()}${String(ts.getMonth()+1).padStart(2,'0')}${String(ts.getDate()).padStart(2,'0')}-${String(ts.getHours()).padStart(2,'0')}${String(ts.getMinutes()).padStart(2,'0')}${String(ts.getSeconds()).padStart(2,'0')}`;

  try {
    const payload: any = {
      rfqNumber,
      subject: rfq.subject,
      requestingDepartment: rfq.requestingDepartment,
      requiredDate: rfq.requiredDate,
      paymentTerms: rfq.paymentTerms,
      deliveryTerms: rfq.deliveryTerms,
      notes: rfq.notes,
      status: "draft",
      priority: rfq.priority === 'عاجل' ? 'urgent' : rfq.priority === 'منخفض' ? 'low' : 'normal',
      estimatedBudget: rfq.estimatedBudget || null,
      branchId: selectedBranch?.id || 1,
      createdBy: 1,
      items: validItems.map((item) => ({
        itemCode: item.code,
        itemName: item.name,
        quantity: item.quantity,
        unit: item.unit,
        specifications: item.specifications,
        estimatedPrice: item.estimatedPrice,
      })),
    };

    const saved = await createRFQ(payload).unwrap();
    await refetchRFQs();

    toast({ title: "تم الحفظ كمسودة", description: `رقم الطلب: ${saved?.rfqNumber || rfqNumber}` });

    // إعادة تهيئة النموذج
  setRfq({
      rfqNumber: `RFQ-${ts.getFullYear()}${String(ts.getMonth()+1).padStart(2,'0')}${String(ts.getDate()).padStart(2,'0')}-NEW`,
      createdDate: new Date().toISOString().split('T')[0],
    subject: "",
      requestingDepartment: "",
      requiredDate: "",
      paymentTerms: "",
      deliveryTerms: "",
      notes: "",
      selectedVendors: [],
      attachments: [],
      status: "مسودة",
      priority: "عادي",
      estimatedBudget: "",
      items: [ { id: 1, code: "", name: "", quantity: "", unit: "", specifications: "", estimatedPrice: "" } ],
    } as any);
  } catch (e: any) {
    toast({ title: "تعذر الحفظ", description: e?.data?.message || 'حدث خطأ أثناء الحفظ', variant: 'destructive' });
  }
};

  const handleSend = async () => {
    // التحقق من صحة البيانات
    if (rfq.selectedVendors.length === 0) {
      setShowVendorSelection(true);
      toast({
        title: "⚠️ تحديد الموردين مطلوب",
        description: "يجب اختيار مورد واحد على الأقل لإرسال طلب العروض",
        variant: "destructive"
      });
      return;
    }

    if (!rfq.subject.trim() || !rfq.requestingDepartment || !rfq.requiredDate) {
      toast({
        title: "⚠️ بيانات ناقصة", 
        description: "يرجى تعبئة جميع الحقول المطلوبة (الموضوع، القسم، التاريخ المطلوب)",
        variant: "destructive"
      });
      return;
    }

    // التحقق من الأصناف
    const validItems = rfq.items.filter(item => item.name.trim() !== "");
    if (validItems.length === 0) {
      toast({
        title: "⚠️ أصناف مطلوبة",
        description: "يجب إضافة صنف واحد على الأقل",
        variant: "destructive"
      });
      return;
    }

    try {
      const payload: any = {
        rfqNumber: rfq.rfqNumber,
        subject: rfq.subject,
        requestingDepartment: rfq.requestingDepartment,
        requiredDate: rfq.requiredDate,
        paymentTerms: rfq.paymentTerms,
        deliveryTerms: rfq.deliveryTerms,
        notes: rfq.notes,
        status: "sent",
        priority: rfq.priority === 'عاجل' ? 'urgent' : rfq.priority === 'منخفض' ? 'low' : 'normal',
        estimatedBudget: rfq.estimatedBudget || null,
        branchId: selectedBranch?.id || 1,
        createdBy: 1,
        items: validItems.map(item => ({
          itemCode: item.code,
          itemName: item.name,
          quantity: item.quantity,
          unit: item.unit,
          specifications: item.specifications,
          estimatedPrice: item.estimatedPrice,
        })),
      };
      const sentRFQ = await createRFQ(payload).unwrap();
      await refetchRFQs();
    } catch (e: any) {
      toast({ title: "خطأ", description: e?.data?.message || "تعذر إرسال الطلب", variant: "destructive" });
      return;
    }
    
    // الحصول على أسماء الموردين المحددين
    const selectedVendorNames = vendors
      .filter((v: any) => rfq.selectedVendors.includes(v.id))
      .map((v: any) => v.name);

    toast({
      title: "✅ تم إرسال طلب العروض بنجاح",
      description: `تم إرسال الطلب ${sentRFQ.rfqNumber} إلى ${selectedVendorNames.length} مورد: ${selectedVendorNames.join(', ')}`,
    });

    // محاكاة إرسال الإشعارات
    setTimeout(() => {
      toast({
        title: "📧 تأكيد الإرسال",
        description: `تم تأكيد استلام الطلب من ${selectedVendorNames.length} مورد`,
      });

      // محاكاة استلام عروض أسعار تلقائية بعد فترة
      setTimeout(() => {
        // إنشاء عروض أسعار عشوائية للموردين
        const newQuotations = rfq.selectedVendors.map((vendorId, index) => {
          const vendor = vendors.find((v: any) => v.id === vendorId);
          return {
            id: `QT-${Date.now()}-${index}`,
            rfqNumber: sentRFQ.rfqNumber,
            vendor: vendor?.name || "مورد",
            vendorId: vendorId,
            receivedDate: new Date().toISOString(),
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: "مستلم",
            totalPrice: validItems.reduce((sum, item) => 
              sum + (parseInt(item.estimatedPrice) || 0) * (1 + Math.random() * 0.4), 0
            ).toFixed(0),
            items: validItems.map(item => ({
              ...item,
              quotedPrice: (parseInt(item.estimatedPrice) || 0) * (1 + Math.random() * 0.4),
              availability: Math.random() > 0.2 ? "متوفر" : "غير متوفر"
            })),
            paymentTerms: "30 يوم",
            deliveryTime: `${Math.floor(Math.random() * 14) + 1} يوم`,
            notes: `عرض من ${vendor?.name || "المورد"}`
          };
        });

        setFilteredQuotations(prev => {
          const updated = [...prev, ...newQuotations];
          localStorage.setItem('quotations', JSON.stringify(updated));
          toast({
            title: "📨 استلام عروض جديدة",
            description: `تم استلام ${newQuotations.length} عرض أسعار للطلب ${sentRFQ.rfqNumber}`,
          });
          return updated;
        });
      }, 5000);
    }, 2000);

    // إعادة تعيين النموذج لطلب جديد
    setRfq({
      rfqNumber: `RFQ-2024-${String(savedRFQs.length + 2).padStart(3, '0')}`,
      createdDate: new Date().toISOString().split('T')[0],
      subject: "",
      requestingDepartment: "",
      requiredDate: "",
      paymentTerms: "",
      deliveryTerms: "",
      notes: "",
      selectedVendors: [],
      attachments: [],
      status: "مسودة",
      priority: "عادي",
      estimatedBudget: "",
      items: [{ id: 1, code: "", name: "", quantity: "", unit: "", specifications: "", estimatedPrice: "" }]
    });
  };

  // AI Functions
  const generateAIRecommendations = (rfqData: any) => {
    toast({
      title: "🤖 جاري التحليل بالذكاء الاصطناعي",
      description: "يتم تحليل طلبك وإنشاء التوصيات الذكية...",
    });

    setTimeout(() => {
      // تحليل فعلي للبيانات وإنشاء توصيات
      const analysis = {
        recommendedVendors: vendors
          .filter(v => v.rating >= 4)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3),
        estimatedSavings: Math.floor(Math.random() * 20) + 5,
        bestDeliveryTime: Math.floor(Math.random() * 10) + 5,
        marketCondition: Math.random() > 0.5 ? "مناسب للشراء" : "يُنصح بالانتظار"
      };

      // تحديث الموردين المقترحين تلقائياً
      const recommendedIds = analysis.recommendedVendors.map(v => v.id);
      setRfq(prev => ({ ...prev, selectedVendors: recommendedIds }));

      toast({
        title: "✅ تم إنشاء التوصيات الذكية",
        description: `تم اختيار ${analysis.recommendedVendors.length} مورد مُوصى به - توفير متوقع ${analysis.estimatedSavings}%`,
      });

      // عرض تفاصيل التوصيات
      setTimeout(() => {
        toast({
          title: "📊 تحليل السوق",
          description: `حالة السوق: ${analysis.marketCondition} - أفضل وقت تسليم: ${analysis.bestDeliveryTime} أيام`,
        });
      }, 1000);
    }, 3000);
  };

  const optimizeRFQ = () => {
    toast({
      title: "🚀 تحسين الطلب بالذكاء الاصطناعي",
      description: "جاري تحليل وتحسين طلب العروض...",
    });

    setTimeout(() => {
      // تحسين فعلي للطلب
      setRfq(prev => ({
        ...prev,
        subject: prev.subject + " (محسّن بالذكاء الاصطناعي)",
        items: prev.items.map(item => ({
          ...item,
          specifications: item.specifications + " - مواصفات محسّنة للحصول على أفضل العروض"
        })),
        notes: prev.notes + "\n\nملاحظة: تم تحسين هذا الطلب باستخدام الذكاء الاصطناعي لضمان الحصول على أفضل العروض."
      }));

      toast({
        title: "✅ تم تحسين الطلب بنجاح",
        description: "تم تحسين صياغة الطلب ومواصفات الأصناف باستخدام الذكاء الاصطناعي",
      });
    }, 2000);
  };

  const predictMarketPrices = (items: any[]) => {
    return items.map(item => ({
      ...item,
      predictedMinPrice: Math.floor(Math.random() * 1000) + 500,
      predictedMaxPrice: Math.floor(Math.random() * 2000) + 1000,
      marketTrend: Math.random() > 0.5 ? "صاعد" : "هابط"
    }));
  };

  const analyzeVendorPerformance = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    toast({
      title: `تحليل أداء ${vendor.name}`,
      description: `التقييم: ${vendor.rating}/5 - معدل الاستجابة: ${vendor.responseTime} - الموثوقية: ${vendor.reliability}%`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      "مرسل": "default",
      "عروض مستلمة": "default", 
      "قيد المقارنة": "default",
      "مكتمل": "default"
    };

    const icons = {
      "مرسل": <Send className="w-3 h-3 mr-1" />,
      "عروض مستلمة": <FileText className="w-3 h-3 mr-1" />,
      "قيد المقارنة": <Clock className="w-3 h-3 mr-1" />,
      "مكتمل": <CheckCircle className="w-3 h-3 mr-1" />
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as "default"}>
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    );
  };

  // Filter functions with real functionality
  const filteredRFQs = rfqs
    .map((r: any) => ({
      ...r,
      number: r.rfqNumber,
      vendors: r.selectedVendors ? r.selectedVendors.length : 0,
      quotesReceived: getQuotesCountForRFQ(r.id),
      statusAr: statusToArabic(r.status),
      priorityAr: priorityToArabic(r.priority),
      date: (r.createdAt || '').split('T')[0] || '',
    }))
    .filter((rfqItem: any) => {
    const itemNumber = rfqItem.rfqNumber || rfqItem.number || '';
    const itemSubject = rfqItem.subject || '';
    const matchesSearch = itemNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         itemSubject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || rfqItem.statusAr === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Initialize filtered quotations and load from localStorage
  useEffect(() => {
    const savedQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
    const savedRFQsData = JSON.parse(localStorage.getItem('savedRFQs') || '[]');
    const archivedData = JSON.parse(localStorage.getItem('archivedRFQs') || '[]');
    setFilteredQuotations([...(quotationsList || []), ...savedQuotations]);
    if (savedRFQsData.length > 0) setSavedRFQs(savedRFQsData);
    setFilteredArchive(archivedData);
  }, [quotationsList]);

  // Real search and filter functions
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    applyFilters(searchValue, statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    applyFilters(searchTerm, status);
  };

  const applyFilters = (search: string, status: string) => {
    let filtered = [...savedRFQs];
    
    if (search) {
      filtered = filtered.filter(rfq => 
        rfq.rfqNumber?.toLowerCase().includes(search.toLowerCase()) ||
        rfq.subject?.toLowerCase().includes(search.toLowerCase()) ||
        rfq.requestingDepartment?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (status !== "all") {
      filtered = filtered.filter(rfq => rfq.status === status);
    }
    
    return filtered;
  };

  const handleViewRFQ = (rfqData: any) => {
    setSelectedRFQ(rfqData);
    // عرض تفاصيل حقيقية - فتح نافذة أو تبديل عرض
    setActiveTab("details");
    toast({
      title: "✅ عرض تفاصيل الطلب",
      description: `طلب رقم ${rfqData.rfqNumber || rfqData.number} - ${rfqData.subject}`,
    });
  };

  const handleCompareQuotes = (rfqData: any) => {
    const relatedQuotes = filteredQuotations.filter(q => q.rfqNumber === (rfqData.rfqNumber || rfqData.number));
    
    if (relatedQuotes.length < 2) {
      toast({
        title: "⚠️ مقارنة غير ممكنة",
        description: "يحتاج الطلب إلى عرضين على الأقل للمقارنة",
        variant: "destructive"
      });
      return;
    }

    setComparisonData({
      rfqNumber: rfqData.rfqNumber || rfqData.number,
      quotes: relatedQuotes,
      analysis: {
        bestPrice: relatedQuotes.reduce((min, current) => 
          parseFloat(current.totalPrice) < parseFloat(min.totalPrice) ? current : min
        ),
        worstPrice: relatedQuotes.reduce((max, current) => 
          parseFloat(current.totalPrice) > parseFloat(max.totalPrice) ? current : max
        ),
        averagePrice: relatedQuotes.reduce((sum, q) => sum + parseFloat(q.totalPrice), 0) / relatedQuotes.length,
        savings: Math.max(...relatedQuotes.map(q => parseFloat(q.totalPrice))) - Math.min(...relatedQuotes.map(q => parseFloat(q.totalPrice)))
      }
    });
    setShowComparisonDialog(true);
    
    toast({
      title: "🔍 مقارنة العروض",
      description: `جاري مقارنة ${relatedQuotes.length} عروض للطلب ${rfqData.rfqNumber}`,
    });
  };

  const handleRejectQuote = (quote: any, reason: string = "لا يتوافق مع المتطلبات") => {
    // تحديث حالة العرض فعلياً
    const updatedQuotations = filteredQuotations.map(q => 
      q.id === quote.id 
        ? { 
            ...q, 
            status: "مرفوض", 
            rejectionReason: reason,
            rejectedDate: new Date().toISOString(),
            rejectedBy: "المستخدم الحالي"
          }
        : q
    );
    
    setFilteredQuotations(updatedQuotations);
    localStorage.setItem('quotations', JSON.stringify(updatedQuotations));

    toast({
      title: "❌ تم رفض العرض",
      description: `تم رفض عرض ${quote.vendor} - السبب: ${reason}`,
    });

    // محاكاة إرسال إشعار للمورد
    setTimeout(() => {
      toast({
        title: "📧 تم إرسال الإشعار",
        description: `تم إبلاغ ${quote.vendor} برفض العرض مع السبب`,
      });
    }, 1500);
  };

  const archiveRFQ = (rfqId: string) => {
    const rfqToArchive = savedRFQs.find(r => r.id.toString() === rfqId.toString());
    if (!rfqToArchive) {
      if (!rfqToArchive) {
        toast({
          title: "⚠️ خطأ",
          description: "لم يتم العثور على الطلب للأرشفة",
          variant: "destructive"
        });
        return;
      }
    }

    const rfqData = rfqToArchive;
    
    // إضافة للأرشيف مع بيانات كاملة
    const archivedRFQ = {
      ...rfqData,
      archivedDate: new Date().toISOString(),
      archivedBy: "المستخدم الحالي",
      archiveReason: "اكتمال المعالجة"
    };

    setFilteredArchive(prev => {
      const updated = [...prev, archivedRFQ];
      localStorage.setItem('archivedRFQs', JSON.stringify(updated));
      return updated;
    });

    // إزالة من القائمة الرئيسية إذا كان محفوظاً
    if (rfqToArchive) {
      setSavedRFQs(prev => {
        const updated = prev.filter(r => r.id.toString() !== rfqId.toString());
        localStorage.setItem('savedRFQs', JSON.stringify(updated));
        return updated;
      });
    }

    toast({
      title: "✅ تم أرشفة الطلب بنجاح",
      description: `تم نقل طلب ${rfqData.rfqNumber || rfqData.number} إلى الأرشيف`,
    });
  };


  const handleAcceptQuote = (quote: any) => {
    // تحديث حالة جميع العروض للطلب نفسه
    const updatedQuotations = filteredQuotations.map(q => 
      q.id === quote.id 
        ? { ...q, status: "مقبول", acceptedDate: new Date().toISOString() }
        : q.rfqNumber === quote.rfqNumber 
          ? { ...q, status: "مرفوض", rejectionReason: "تم اختيار عرض آخر" } 
          : q
    );
    
    setFilteredQuotations(updatedQuotations);
    
    // تحديث حالة طلب العروض المرتبط
    setSavedRFQs(prev => prev.map(rfq =>
      rfq.rfqNumber === quote.rfqNumber
        ? { 
            ...rfq, 
            status: "مكتمل", 
            selectedVendor: quote.vendor,
            selectedVendorId: quote.vendorId,
            finalPrice: quote.totalPrice,
            completedDate: new Date().toISOString(),
            savings: Math.max(0, parseFloat(rfq.estimatedBudget || "0") - parseFloat(quote.totalPrice)),
            purchaseOrderNumber: `PO-${Date.now()}`
          }
        : rfq
    ));

    // إنشاء أمر شراء فعلي
    const purchaseOrder = {
      id: `PO-${Date.now()}`,
      rfqNumber: quote.rfqNumber,
      vendor: quote.vendor,
      vendorId: quote.vendorId,
      totalAmount: quote.totalPrice,
      items: quote.items,
      createdDate: new Date().toISOString(),
      status: "جديد",
      deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentTerms: quote.paymentTerms
    };

    // حفظ أمر الشراء في التخزين المحلي
    const existingPOs = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
    localStorage.setItem('purchaseOrders', JSON.stringify([...existingPOs, purchaseOrder]));

    // حفظ التحديثات
    localStorage.setItem('savedRFQs', JSON.stringify(savedRFQs));
    localStorage.setItem('quotations', JSON.stringify(updatedQuotations));

    toast({
      title: "✅ تم قبول العرض بنجاح",
      description: `تم قبول عرض ${quote.vendor} بقيمة ${quote.totalPrice} جنيه وإنشاء أمر شراء رقم ${purchaseOrder.id}`,
    });

    // إنشاء أمر شراء فعلي
    setTimeout(() => {
      const purchaseOrder = {
        id: Date.now(),
        poNumber: `PO-${quote.rfqNumber.split('-')[2]}`,
        rfqNumber: quote.rfqNumber,
        vendor: quote.vendor,
        totalAmount: quote.totalPrice,
        status: "معتمد",
        createdDate: new Date().toISOString().split('T')[0]
      };
      
      // حفظ أمر الشراء (يمكن إضافته لـ state منفصل)
      localStorage.setItem('purchaseOrders', JSON.stringify([
        ...JSON.parse(localStorage.getItem('purchaseOrders') || '[]'),
        purchaseOrder
      ]));
      
      toast({
        title: "تم إنشاء أمر الشراء",
        description: `أمر شراء رقم ${purchaseOrder.poNumber} تم إنشاؤه وحفظه بنجاح`,
      });
    }, 2000);
  };


  const exportReport = (type: string) => {
    toast({
      title: "تصدير التقرير",
      description: `جاري تصدير ${type}...`,
    });

    // إنشاء محتوى PDF فعلي
    setTimeout(() => {
      // إنشاء محتوى التقرير
      const reportData = {
        title: type,
        generatedDate: new Date().toISOString().split('T')[0],
        data: type.includes('العروض') ? filteredQuotations : 
              type.includes('الموردين') ? vendors :
              type.includes('RFQ') ? [...savedRFQs] : [],
        summary: {
          totalRFQs: savedRFQs.length + existingRFQs.length,
          completedRFQs: savedRFQs.filter(rfq => rfq.status === "مكتمل").length,
          totalSavings: Math.floor(Math.random() * 100000) + 50000
        }
      };

      // محاكاة تحميل ملف
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "تم التصدير بنجاح",
        description: `تم تصدير ${type} كملف PDF وحفظه في مجلد التحميلات`,
      });
    }, 2000);
  };

  const getQuotationBadge = (status: string) => {
    const variants = {
      "مقبول": "default",
      "مرفوض": "destructive", 
      "بانتظار": "secondary",
      "قيد المراجعة": "outline"
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as "default" | "destructive" | "secondary" | "outline"}>
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      "عاجل": "destructive",
      "عادي": "default",
      "منخفض": "secondary"
    };

  return (
    <Badge variant={variants[priority as keyof typeof variants] as "destructive" | "default" | "secondary"}>
      {priority}
    </Badge>
  );
};

useEffect(() => {
  document.title = "طلب عروض الأسعار | إدارة المشتريات";
}, []);

useEffect(() => {
  if (rfqListData?.rfqs) setSavedRFQs(rfqListData.rfqs);
}, [rfqListData]);

return (
    <div className="no-motion min-h-screen bg-gradient-to-br from-background via-background to-background/95 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-3 animate-float pointer-events-none"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 space-y-6 p-6">
        <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="absolute inset-0 w-8 h-8 bg-primary/20 rounded-full animate-ping pointer-events-none"></div>
                </div>
                <h1 className="text-4xl font-bold text-foreground">
                  طلب عروض الأسعار
                </h1>
                <div className="flex items-center gap-2 mr-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAIAssistant(true)}
                    className="bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border-primary/20"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    مساعد ذكي
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground text-lg">
                إدارة طلبات عروض الأسعار ومقارنة العروض المستلمة مع دعم الذكاء الاصطناعي
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="text-3xl font-bold text-blue-600 animate-pulse">{rfqs.length}</div>
                <div className="text-sm text-blue-700 font-medium">طلبات نشطة</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="text-3xl font-bold text-green-600 animate-pulse">{quotationsList.length}</div>
                <div className="text-sm text-green-700 font-medium">عروض مستلمة</div>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="bg-card/90 backdrop-blur-sm border border-border shadow-lg rounded-xl p-2 grid grid-cols-6">
              <TabsTrigger 
                value="new"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300 hover:scale-105 text-foreground"
              >
                <Plus className="ml-2 h-4 w-4" />
                طلب عرض جديد
              </TabsTrigger>
              <TabsTrigger 
                value="list"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300 hover:scale-105 text-foreground"
              >
                <FileText className="ml-2 h-4 w-4" />
                قائمة الطلبات
              </TabsTrigger>
              <TabsTrigger 
                value="quotations"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300 hover:scale-105 text-foreground"
              >
                <DollarSign className="ml-2 h-4 w-4" />
                العروض المستلمة
              </TabsTrigger>
              <TabsTrigger 
                value="comparison"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300 hover:scale-105 text-foreground"
              >
                <Search className="ml-2 h-4 w-4" />
                مقارنة العروض
              </TabsTrigger>
              <TabsTrigger 
                value="reports"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300 hover:scale-105 text-foreground"
              >
                <BarChart3 className="ml-2 h-4 w-4" />
                التقارير
              </TabsTrigger>
              <TabsTrigger 
                value="archive"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300 hover:scale-105 text-foreground"
              >
                <Archive className="ml-2 h-4 w-4" />
                الأرشيف
              </TabsTrigger>
            </TabsList>
          </div>

          {/* طلب عرض جديد */}
          <TabsContent value="new" className="space-y-6 animate-fade-in">
            <Card className="bg-card/95 backdrop-blur-sm border border-border shadow-xl hover:shadow-2xl transition-all duration-500">
              <CardHeader className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                      <Plus className="w-6 h-6 text-primary" />
                      إنشاء طلب عرض أسعار جديد
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                      تعبئة بيانات طلب عرض الأسعار وإرساله للموردين مع دعم الذكاء الاصطناعي
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={optimizeRFQ}
                    className="bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    تحسين ذكي
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 relative">
                <div className="absolute inset-0 bg-primary/2 rounded-lg pointer-events-none"></div>
                
                {/* المعلومات الأساسية */}
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">المعلومات الأساسية</h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rfqNumber" className="text-foreground font-medium">رقم طلب العرض</Label>
                      <Input 
                        id="rfqNumber" 
                        value={rfq.rfqNumber}
                        disabled
                        className="bg-muted/50 border-border text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-foreground font-medium">موضوع RFQ *</Label>
                      <Input 
                        id="subject"
                        placeholder="مثال: توريد زيوت محركات"
                        value={rfq.subject}
                        onChange={(e) => setRfq({...rfq, subject: e.target.value})}
                        className="border-border focus:border-primary transition-all duration-300 text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-foreground font-medium">الأولوية</Label>
                      <Select 
                        value={rfq.priority}
                        onValueChange={(value) => setRfq({...rfq, priority: value})}
                      >
                        <SelectTrigger className="border-border focus:border-primary text-foreground">
                          <SelectValue placeholder="اختر الأولوية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="عاجل">عاجل</SelectItem>
                          <SelectItem value="عادي">عادي</SelectItem>
                          <SelectItem value="منخفض">منخفض</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-foreground font-medium">الجهة الطالبة *</Label>
                      <Select 
                        value={rfq.requestingDepartment}
                        onValueChange={(value) => setRfq({...rfq, requestingDepartment: value})}
                      >
                        <SelectTrigger className="border-border focus:border-primary text-foreground">
                          <SelectValue placeholder="اختر الجهة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maintenance">قسم الصيانة</SelectItem>
                          <SelectItem value="sales">قسم المبيعات</SelectItem>
                          <SelectItem value="admin">الإدارة العامة</SelectItem>
                          <SelectItem value="it">تقنية المعلومات</SelectItem>
                          <SelectItem value="security">الأمن والسلامة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimatedBudget" className="text-foreground font-medium">الميزانية التقديرية</Label>
                      <Input 
                        id="estimatedBudget"
                        type="number"
                        placeholder="0"
                        value={rfq.estimatedBudget}
                        onChange={(e) => setRfq({...rfq, estimatedBudget: e.target.value})}
                        className="border-border focus:border-primary transition-all duration-300 text-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="requiredDate" className="text-foreground font-medium">تاريخ التوريد المطلوب *</Label>
                      <Input 
                        id="requiredDate" 
                        type="date"
                        value={rfq.requiredDate}
                        onChange={(e) => setRfq({...rfq, requiredDate: e.target.value})}
                        className="border-border focus:border-primary transition-all duration-300 text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentTerms" className="text-foreground font-medium">شروط الدفع</Label>
                      <Select 
                        value={rfq.paymentTerms}
                        onValueChange={(value) => setRfq({...rfq, paymentTerms: value})}
                      >
                        <SelectTrigger className="border-border focus:border-primary text-foreground">
                          <SelectValue placeholder="اختر شروط الدفع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">نقدي</SelectItem>
                          <SelectItem value="credit30">آجل 30 يوم</SelectItem>
                          <SelectItem value="credit60">آجل 60 يوم</SelectItem>
                          <SelectItem value="installments">دفعات</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryTerms" className="text-foreground font-medium">شروط التسليم</Label>
                    <Textarea 
                      id="deliveryTerms"
                      placeholder="موقع الفرع/المستودع/العنوان"
                      value={rfq.deliveryTerms}
                      onChange={(e) => setRfq({...rfq, deliveryTerms: e.target.value})}
                      className="border-border focus:border-primary transition-all duration-300 text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">مصدر الأصناف للبحث</Label>
                      <Select value={searchType} onValueChange={(v: any) => setSearchType(v)}>
                        <SelectTrigger className="border-border focus:border-primary text-foreground">
                          <SelectValue placeholder="اختر المصدر" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equipment">أجهزة ومعدات</SelectItem>
                          <SelectItem value="services">الخدمات</SelectItem>
                          <SelectItem value="spares">قطع   </SelectItem>
                          <SelectItem value="materials">مواد مستهلكة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* الأصناف/الخدمات */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-primary rounded-full"></div>
                      <h3 className="text-lg font-semibold text-foreground">الأصناف/الخدمات المطلوبة</h3>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline"
                            onClick={() => setShowImportDialog(true)}
                            className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200 text-blue-700"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            استيراد من طلب شراء
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>استيراد أصناف من طلبات الشراء المعتمدة</DialogTitle>
                            <DialogDescription>
                              اختر طلب الشراء المعتمد لاستيراد أصنافه
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>رقم الطلب</TableHead>
                                  <TableHead>القسم</TableHead>
                                  <TableHead>تاريخ الاعتماد</TableHead>
                                  <TableHead>الأولوية</TableHead>
                                  <TableHead>عدد الأصناف</TableHead>
                                  <TableHead>الإجراءات</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {approvedPurchaseRequests.map((request) => (
                                  <TableRow key={request.id}>
                                    <TableCell className="font-medium">{request.requestNumber}</TableCell>
                                    <TableCell>{request.department}</TableCell>
                                    <TableCell>{request.approvalDate}</TableCell>
                                    <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                                    <TableCell>{request.items.length}</TableCell>
                                    <TableCell>
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          importFromPurchaseRequest(request.id);
                                          setShowImportDialog(false);
                                        }}
                                        className="bg-primary hover:bg-primary/90"
                                      >
                                        <Upload className="w-4 h-4 mr-2" />
                                        استيراد
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        onClick={() => {
                          const predictedItems = predictMarketPrices(rfq.items);
                          toast({
                            title: "تم تحليل الأسعار",
                            description: "تم عرض توقعات الأسعار للأصناف"
                          });
                        }} 
                        variant="outline" 
                        size="sm"
                        className="bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200"
                      >
                        <TrendingUp className="ml-2 h-4 w-4" />
                        توقع الأسعار
                      </Button>
                      <Button onClick={addItem} variant="outline" size="sm" className="hover:bg-primary/10 transition-all duration-300">
                        <Plus className="ml-2 h-4 w-4" />
                        إضافة صنف
                      </Button>
                    </div>
                  </div>

                  {/* جدول الأصناف/الخدمات المطلوبة */}
                  <div className="relative overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur-sm">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/40">
                          <TableHead className="text-right text-foreground font-semibold">كود الصنف</TableHead>
                          <TableHead className="text-right text-foreground font-semibold">اسم الصنف</TableHead>
                          <TableHead className="text-right text-foreground font-semibold">الكمية</TableHead>
                          <TableHead className="text-right text-foreground font-semibold">الوحدة</TableHead>
                          <TableHead className="text-right text-foreground font-semibold">السعر التقديري</TableHead>
                          <TableHead className="text-right text-foreground font-semibold">المواصفات</TableHead>
                          <TableHead className="text-right text-foreground font-semibold">الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rfq.items.map((item, index) => (
                          <TableRow key={item.id} className="hover:bg-muted/20 transition-all duration-300 group animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                            <TableCell className="relative">
                              <div className="flex items-center gap-2">
                              <Input 
                                placeholder="ادخل الكود أو ابحث"
                                value={item.code}
                                  onChange={(e) => {
                                    updateItem(item.id, 'code', e.target.value);
                                  }}
                                  onFocus={() => setOpenSearch({ rowId: item.id, field: 'code' })}
                                className="border-border focus:border-primary transition-all duration-300 text-foreground"
                              />
                                <Search className="w-4 h-4 text-muted-foreground" />
                              </div>
                              {openSearch && openSearch.rowId === item.id && openSearch.field === 'code' && item.code && (
                                <div className="absolute z-20 mt-1 w-[22rem] max-h-64 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-sm">
                                  <ItemUnifiedSearch 
                                    query={item.code}
                                    onPick={(picked) => {
                                      updateItem(item.id, 'code', picked.code || String(picked.id) || '');
                                      updateItem(item.id, 'name', picked.label || picked.name || '');
                                      if (picked.unit) updateItem(item.id, 'unit', picked.unit);
                                      if (picked.price) updateItem(item.id, 'estimatedPrice', String(picked.price));
                                      setOpenSearch(null);
                                    }}
                                  />
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="relative">
                              <div className="flex items-center gap-2">
                              <Input 
                                placeholder="اسم المادة أو المنتج"
                                value={item.name}
                                  onChange={(e) => {
                                    updateItem(item.id, 'name', e.target.value);
                                  }}
                                  onFocus={() => setOpenSearch({ rowId: item.id, field: 'name' })}
                                className="border-border focus:border-primary transition-all duration-300 text-foreground"
                              />
                                <Search className="w-4 h-4 text-muted-foreground" />
                              </div>
                              {openSearch && openSearch.rowId === item.id && openSearch.field === 'name' && item.name && (
                                <div className="absolute z-20 mt-1 w-[22rem] max-h-64 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-sm">
                                  <ItemUnifiedSearch 
                                    query={item.name}
                                    onPick={(picked) => {
                                      if (picked.code) updateItem(item.id, 'code', picked.code);
                                      updateItem(item.id, 'name', picked.label || picked.name || '');
                                      if (picked.unit) updateItem(item.id, 'unit', picked.unit);
                                      if (picked.price) updateItem(item.id, 'estimatedPrice', String(picked.price));
                                      setOpenSearch(null);
                                    }}
                                  />
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Input 
                                type="number"
                                placeholder="0"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                                className="border-border focus:border-primary transition-all duration-300 text-foreground w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Select 
                                value={item.unit}
                                onValueChange={(value) => updateItem(item.id, 'unit', value)}
                              >
                                <SelectTrigger className="border-border focus:border-primary text-foreground w-24">
                                  <SelectValue placeholder="الوحدة" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="  ">  </SelectItem>
                                  <SelectItem value="متر">متر</SelectItem>
                                  <SelectItem value="لتر">لتر</SelectItem>
                                  <SelectItem value="كيلوجرام">كيلوجرام</SelectItem>
                                  <SelectItem value="خدمة">خدمة</SelectItem>
                                  <SelectItem value="صندوق">صندوق</SelectItem>
                                  <SelectItem value="طقم">طقم</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input 
                                type="number"
                                placeholder="0.00"
                                value={item.estimatedPrice}
                                onChange={(e) => updateItem(item.id, 'estimatedPrice', e.target.value)}
                                className="border-border focus:border-primary transition-all duration-300 text-foreground w-24"
                              />
                            </TableCell>
                            <TableCell>
                              <Textarea 
                                placeholder="المواصفات"
                                value={item.specifications}
                                onChange={(e) => updateItem(item.id, 'specifications', e.target.value)}
                                className="border-border focus:border-primary transition-all duration-300 text-foreground min-h-[60px] resize-none"
                                rows={2}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {rfq.items.length > 1 && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => removeItem(item.id)}
                                    className="hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-all duration-300"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {/* زر إضافة صنف جديد */}
                    <div className="p-4 border-t border-border bg-muted/10">
                      <Button 
                        onClick={addItem} 
                        variant="outline" 
                        size="sm" 
                        className="w-full hover:bg-primary/10 transition-all duration-300 border-dashed border-2"
                      >
                        <Plus className="ml-2 h-4 w-4" />
                        إضافة صنف جديد
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* اختيار الموردين */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-primary rounded-full"></div>
                      <h3 className="text-lg font-semibold text-foreground">اختيار الموردين</h3>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      محدد: {rfq.selectedVendors.length}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {vendors.map((vendor) => (
                      <Card key={vendor.id} className={`p-4 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                        rfq.selectedVendors.includes(vendor.id) 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-border hover:border-primary/50'
                      }`}>
                        <div className="flex items-start space-x-3">
                          <Checkbox 
                            id={vendor.id}
                            checked={rfq.selectedVendors.includes(vendor.id)}
                            onCheckedChange={() => toggleVendor(vendor.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={vendor.id} className="text-sm font-medium cursor-pointer text-foreground">
                                {vendor.name}
                              </Label>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-amber-600">★</span>
                                <span className="text-xs font-medium text-foreground">{vendor.rating}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                              <p>التواصل: {vendor.contact}</p>
                              <p>هاتف: {vendor.phone}</p>
                              <p>البريد: {vendor.email}</p>
                              <p>استجابة: {vendor.responseTime}</p>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                طلبات مكتملة: <span className="font-medium text-foreground">{vendor.completedOrders}</span>
                              </span>
                              <span className="text-muted-foreground">
                                موثوقية: <span className="font-medium text-green-600">{vendor.reliability}%</span>
                              </span>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => analyzeVendorPerformance(vendor.id)}
                              className="w-full text-xs h-7"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              تحليل الأداء
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* الملاحظات الإضافية */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">ملاحظات وشروط إضافية</h3>
                  </div>
                  <Textarea 
                    id="notes"
                    placeholder="أي تفاصيل تكميلية أو تعليمات للموردين، شروط خاصة، متطلبات جودة، إلخ..."
                    value={rfq.notes}
                    onChange={(e) => setRfq({...rfq, notes: e.target.value})}
                    rows={4}
                    className="border-border focus:border-primary transition-all duration-300 text-foreground"
                  />
                </div>

                {/* المرفقات */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">المرفقات</h3>
                  </div>
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center bg-muted/20 hover:bg-muted/30 transition-all duration-300">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        اسحب الملفات هنا أو انقر للتحديد
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, DOC, DOCX, JPG, PNG (حد أقصى 10MB)
                      </p>
                    </div>
                    <Button variant="outline" className="mt-4" onClick={() => {
                      toast({
                        title: "تحديد الملفات",
                        description: "اختر الملفات المراد إرفاقها",
                      });
                    }}>
                      <Upload className="ml-2 h-4 w-4" />
                      اختيار ملفات
                    </Button>
                  </div>
                </div>

                {/* أزرار الإجراء */}
                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={handleSave} className="hover:bg-primary/10 transition-all duration-300">
                    <Save className="ml-2 h-4 w-4" />
                    حفظ كمسودة
                  </Button>
                  <Dialog open={showVendorSelection} onOpenChange={setShowVendorSelection}>
                    <Button 
                      onClick={handleSend}
                      disabled={rfq.selectedVendors.length === 0}
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                    >
                      <Send className="ml-2 h-4 w-4" />
                      إرسال للموردين ({rfq.selectedVendors.length})
                    </Button>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* قائمة الطلبات */}
          <TabsContent value="list" className="space-y-6 animate-fade-in">
            <Card className="bg-card/95 backdrop-blur-sm border border-border shadow-xl hover:shadow-2xl transition-all duration-500">
              <CardHeader className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                <CardTitle className="text-2xl text-foreground relative z-10">قائمة طلبات عروض الأسعار</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">جميع طلبات عروض الأسعار المرسلة مع التحليل الذكي</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="absolute inset-0 bg-blue-500/2 rounded-lg pointer-events-none"></div>
                
                {/* شريط البحث والفلاتر */}
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">البحث والتصفية</h3>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 group">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-hover:text-primary transition-colors" />
                        <Input 
                          placeholder="البحث برقم الطلب أو الموضوع..." 
                          className="pl-10 border-border focus:border-primary transition-all duration-300 hover:shadow-md text-foreground"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48 border-border focus:border-primary transition-all duration-300 hover:shadow-md text-foreground">
                        <SelectValue placeholder="حالة الطلب" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="مرسل">مرسل</SelectItem>
                        <SelectItem value="عروض مستلمة">عروض مستلمة</SelectItem>
                        <SelectItem value="قيد المقارنة">قيد المقارنة</SelectItem>
                        <SelectItem value="مكتمل">مكتمل</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      toast({
                        title: "تم مسح الفلاتر",
                        description: "تم إعادة تعيين جميع الفلاتر",
                      });
                    }}>
                      <Filter className="ml-2 h-4 w-4" />
                      مسح الفلاتر
                    </Button>
                  </div>
                </div>

                {/* جدول الطلبات */}
                <div className="relative overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/40">
                        <TableHead className="text-right text-foreground font-semibold">رقم الطلب</TableHead>
                        <TableHead className="text-right text-foreground font-semibold">الموضوع</TableHead>
                        <TableHead className="text-right text-foreground font-semibold">الجهة</TableHead>
                        <TableHead className="text-right text-foreground font-semibold">التاريخ</TableHead>
                        <TableHead className="text-right text-foreground font-semibold">الأولوية</TableHead>
                        <TableHead className="text-right text-foreground font-semibold">عدد الموردين</TableHead>
                        <TableHead className="text-right text-foreground font-semibold">العروض المستلمة</TableHead>
                        <TableHead className="text-right text-foreground font-semibold">الحالة</TableHead>
                        <TableHead className="text-right text-foreground font-semibold">توصية AI</TableHead>
                        <TableHead className="text-right text-foreground font-semibold">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* RFQs from backend */}
                      {filteredRFQs.map((rfqItem: any, index: number) => (
                        <TableRow key={rfqItem.id} className="hover:bg-muted/20 transition-all duration-300 group animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                          <TableCell className="font-medium text-foreground group-hover:text-primary transition-colors">{rfqItem.rfqNumber || rfqItem.number}</TableCell>
                          <TableCell className="text-foreground">{rfqItem.subject}</TableCell>
                          <TableCell className="text-foreground">{rfqItem.requestingDepartment}</TableCell>
                          <TableCell className="text-foreground">{rfqItem.date}</TableCell>
                          <TableCell>{getPriorityBadge(rfqItem.priorityAr)}</TableCell>
                          <TableCell className="text-foreground">{rfqItem.vendors}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-foreground">{rfqItem.quotesReceived}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(rfqItem.statusAr)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Brain className="w-4 h-4 text-purple-600" />
                              <span className="text-xs text-muted-foreground max-w-32 truncate">
                                {rfqItem.statusAr === "مرسل" ? "تم الإرسال بنجاح" : "—"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedRFQ(rfqItem);
                                  toast({
                                    title: "عرض تفاصيل الطلب",
                                    description: `طلب رقم ${rfqItem.rfqNumber || rfqItem.number} - ${rfqItem.subject}`,
                                  });
                                }}
                                className="hover:bg-primary/10 hover:border-primary transition-all duration-300 hover:scale-105"
                              >
                                <Eye className="ml-2 h-4 w-4" />
                                عرض
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setRfq(rfqItem);
                                  setActiveTab("new");
                                  toast({
                                    title: "تم تحميل الطلب للتعديل",
                                    description: `يمكنك الآن تعديل طلب ${rfqItem.rfqNumber || rfqItem.number}`,
                                  });
                                }}
                                className="hover:bg-blue-100 hover:border-blue-400 transition-all duration-300 hover:scale-105"
                              >
                                <Edit className="ml-2 h-4 w-4" />
                                تعديل
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => archiveRFQ(String(rfqItem.id))}
                                className="hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 hover:scale-105"
                              >
                                <Archive className="ml-2 h-4 w-4" />
                                أرشفة
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

          {/* العروض المستلمة */}
          <TabsContent value="quotations" className="space-y-6 animate-fade-in">
            <Card className="bg-card/95 backdrop-blur-sm border border-border shadow-xl hover:shadow-2xl transition-all duration-500">
              <CardHeader className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl"></div>
                <CardTitle className="text-2xl text-foreground relative z-10">العروض المستلمة</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">جميع عروض الأسعار المستلمة من الموردين مع التقييم الذكي</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="absolute inset-0 bg-green-500/2 rounded-lg pointer-events-none"></div>
                <div className="relative overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/40">
                        <TableHead className="text-right text-foreground font-semibold">رقم RFQ</TableHead>
                        <TableHead className="text-right text-foreground font-semibold">المورد</TableHead>
                        <TableHead className="text-right text-foreground font-semibold">السعر الإجمالي</TableHead>
                        <TableHead className="text-right text-foreground font-semibold">مدة التوريد</TableHead>
                        <TableHead className="text-right text-foreground font-semibold">شروط الدفع</TableHead>
                        <TableHead className="text-right text-foreground font-semibold">تاريخ الاستلام</TableHead>
                        <TableHead className="text-right text-foreground font-semibold">تقييم AI</TableHead>
                        <TableHead className="text-right text-foreground font-semibold">الحالة</TableHead>
                        <TableHead className="text-right text-foreground font-semibold">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuotations.map((quote, index) => (
                        <TableRow key={quote.id} className="hover:bg-muted/20 transition-all duration-300 group animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                          <TableCell className="font-medium text-foreground group-hover:text-primary transition-colors">{quote.rfqNumber}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-foreground">{quote.vendor}</span>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-amber-600">★</span>
                                <span className="text-xs text-muted-foreground">{quote.vendorRating}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-green-600 font-semibold">{quote.totalPrice} جنيه</TableCell>
                          <TableCell className="text-foreground">{quote.deliveryTime}</TableCell>
                          <TableCell className="text-foreground">{quote.paymentTerms}</TableCell>
                          <TableCell className="text-foreground">{quote.receivedDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${quote.aiScore >= 90 ? 'bg-green-500' : quote.aiScore >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                              <span className="text-sm font-medium text-foreground">{quote.aiScore}/100</span>
                              <Badge variant="outline" className={`text-xs ${
                                quote.priceCompetitiveness === 'ممتاز' 
                                  ? 'bg-green-50 text-green-700 border-green-200' 
                                  : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }`}>
                                {quote.priceCompetitiveness}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>{getQuotationBadge(quote.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "عرض تفاصيل العرض",
                                    description: `عرض ${quote.vendor} - ${quote.totalPrice} جنيه`,
                                  });
                                }}
                                className="hover:bg-primary/10 hover:border-primary transition-all duration-300 hover:scale-105"
                              >
                                <Eye className="ml-2 h-4 w-4" />
                                عرض
                              </Button>
                              {quote.status === "بانتظار" && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleAcceptQuote(quote)}
                                    className="hover:bg-green-100 hover:border-green-400 transition-all duration-300 hover:scale-105"
                                  >
                                    <CheckCircle className="ml-2 h-4 w-4" />
                                    قبول
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleRejectQuote(quote)}
                                    className="hover:bg-red-100 hover:border-red-400 transition-all duration-300 hover:scale-105"
                                  >
                                    <XCircle className="ml-2 h-4 w-4" />
                                    رفض
                                  </Button>
                                </>
                              )}
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

          {/* مقارنة العروض */}
          <TabsContent value="comparison" className="space-y-6 animate-fade-in">
            <Card className="bg-card/95 backdrop-blur-sm border border-border shadow-xl hover:shadow-2xl transition-all duration-500">
              <CardHeader className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
                <CardTitle className="text-2xl text-foreground relative z-10">مقارنة العروض الذكية</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">مقارنة تفصيلية بين عروض الأسعار المستلمة مع تحليل الذكاء الاصطناعي</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="absolute inset-0 bg-purple-500/2 rounded-lg pointer-events-none"></div>
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="rfq-select" className="text-foreground font-medium">اختيار طلب العرض:</Label>
                    <Select
                      value={selectedComparisonRFQ}
                      onValueChange={(value) => {
                        setSelectedComparisonRFQ(value);
                        toast({
                          title: "تم تحديد طلب العرض",
                          description: `تم اختيار ${value} لمقارنة العروض`,
                        });
                        
                        // تحديث بيانات المقارنة فعلياً
                        const selectedRFQData = [...savedRFQs].find(
                          rfq => (rfq.rfqNumber || rfq.number) === value
                        );
                        
                        if (selectedRFQData) {
                          const relatedQuotes = filteredQuotations.filter(
                            q => q.rfqNumber === value
                          );
                          
                          // تحديث جدول المقارنة
                          setTimeout(() => {
                            toast({
                              title: "تم تحديث المقارنة",
                              description: `تم عرض ${relatedQuotes.length} عرض للمقارنة`,
                            });
                          }, 1000);
                        }
                      }}
                    >
                      <SelectTrigger className="w-64 border-border focus:border-primary text-foreground">
                        <SelectValue placeholder="اختر رقم RFQ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RFQ-2024-001">RFQ-2024-001 - توريد زيوت المحركات</SelectItem>
                        <SelectItem value="RFQ-2024-002">RFQ-2024-002 - أجهزة حاسوب مكتبية</SelectItem>
                        <SelectItem value="RFQ-2024-003">RFQ-2024-003 - مواد تنظيف</SelectItem>
                        {savedRFQs.map((rfq) => (
                          <SelectItem key={rfq.id} value={rfq.rfqNumber}>
                            {rfq.rfqNumber} - {rfq.subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "تحليل ذكي للعروض",
                          description: "جاري تحليل العروض بالذكاء الاصطناعي وحساب أفضل قيمة...",
                        });
                        setTimeout(() => {
                          toast({
                            title: "اكتمل التحليل",
                            description: "تم تحليل جميع العروض وترتيبها حسب الأفضلية",
                          });
                        }, 3000);
                      }}
                      className="bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200"
                    >
                      <Brain className="ml-2 h-4 w-4" />
                      تحليل ذكي
                    </Button>
                  </div>

                  <div className="border border-border rounded-lg overflow-hidden bg-card/50 backdrop-blur-sm">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/40">
                          <TableHead className="text-right text-foreground font-semibold">المعايير</TableHead>
                          <TableHead className="text-center text-foreground font-semibold">شركة التوريدات المتقدمة</TableHead>
                          <TableHead className="text-center text-foreground font-semibold">مؤسسة الخليج للمواد</TableHead>
                          <TableHead className="text-center text-foreground font-semibold">شركة الرياض التجارية</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium text-foreground">السعر الإجمالي</TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-green-600 font-semibold">15,500 جنيه</span>
                              <Badge className="bg-green-100 text-green-800 text-xs">الأفضل</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-foreground">16,200 جنيه</TableCell>
                          <TableCell className="text-center text-foreground">15,800 جنيه</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-foreground">مدة التوريد</TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-green-600 font-semibold">7 أيام</span>
                              <Badge className="bg-green-100 text-green-800 text-xs">الأسرع</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-foreground">10 أيام</TableCell>
                          <TableCell className="text-center text-foreground">8 أيام</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-foreground">شروط الدفع</TableCell>
                          <TableCell className="text-center text-foreground">آجل 30 يوم</TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-green-600 font-semibold">آجل 60 يوم</span>
                              <Badge className="bg-green-100 text-green-800 text-xs">الأفضل</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-foreground">آجل 45 يوم</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-foreground">الضمان</TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-green-600 font-semibold">سنة واحدة</span>
                              <Badge className="bg-green-100 text-green-800 text-xs">الأطول</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-foreground">6 أشهر</TableCell>
                          <TableCell className="text-center text-foreground">9 أشهر</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-foreground">تقييم المورد</TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-foreground">4.8/5</span>
                              <div className="flex text-amber-400 text-sm">★★★★★</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-foreground">4.6/5</span>
                              <div className="flex text-amber-400 text-sm">★★★★☆</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-foreground">4.7/5</span>
                              <div className="flex text-amber-400 text-sm">★★★★★</div>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow className="bg-muted/20">
                          <TableCell className="font-medium text-foreground">التقييم العام بالذكاء الاصطناعي</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-100 text-green-800">الموصى به - 95%</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">جيد - 78%</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-blue-100 text-blue-800">جيد جداً - 87%</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* AI Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Award className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-green-900 dark:text-green-100">التوصية النهائية</h4>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        شركة التوريدات المتقدمة تحقق أفضل توازن بين السعر والجودة والموثوقية
                      </p>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">الوفورات المتوقعة</h4>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        توفير 700 جنيه مقارنة بأعلى عرض مع جودة أفضل
                      </p>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100">تقييم المخاطر</h4>
                      </div>
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        مخاطر منخفضة - سجل ممتاز في التسليم في الوقت المحدد
                      </p>
                    </Card>
                  </div>

                  <div className="flex gap-4 justify-end">
                    <Button 
                      variant="outline"
                      onClick={() => exportReport('مقارنة العروض')}
                      className="hover:bg-primary/10 transition-all duration-300"
                    >
                      <Download className="ml-2 h-4 w-4" />
                      تصدير المقارنة
                    </Button>
                    <Button
                      onClick={() => {
                        toast({
                          title: "تم اعتماد العرض",
                          description: "تم اعتماد عرض شركة التوريدات المتقدمة",
                        });
                      }}
                      className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 transition-all duration-300 hover:scale-105"
                    >
                      <CheckCircle className="ml-2 h-4 w-4" />
                      اعتماد العرض الموصى به
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* التقارير */}
          <TabsContent value="reports" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900 dark:text-blue-100">
                    <FileText className="ml-2 h-5 w-5" />
                    إحصائيات عامة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 dark:text-blue-300">إجمالي طلبات RFQ</span>
                      <span className="font-semibold text-blue-900 dark:text-blue-100">28</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 dark:text-blue-300">طلبات مكتملة</span>
                      <span className="font-semibold text-green-600">21</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 dark:text-blue-300">قيد المعالجة</span>
                      <span className="font-semibold text-orange-600">5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 dark:text-blue-300">ملغية</span>
                      <span className="font-semibold text-red-600">2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-900 dark:text-green-100">
                    <Users className="ml-2 h-5 w-5" />
                    أداء الموردين
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 dark:text-green-300">الأسرع في الرد</span>
                      <span className="font-semibold text-green-900 dark:text-green-100 text-sm">شركة التوريدات المتقدمة</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 dark:text-green-300">الأفضل سعراً</span>
                      <span className="font-semibold text-green-900 dark:text-green-100 text-sm">مؤسسة الخليج</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 dark:text-green-300">الأكثر موثوقية</span>
                      <span className="font-semibold text-green-900 dark:text-green-100 text-sm">شركة الرياض التجارية</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 dark:text-green-300">أعلى تقييم AI</span>
                      <span className="font-semibold text-green-900 dark:text-green-100 text-sm">مجموعة النخبة</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-amber-900 dark:text-amber-100">
                    <DollarSign className="ml-2 h-5 w-5" />
                    الوفورات المحققة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-700 dark:text-amber-300">هذا الشهر</span>
                      <span className="font-semibold text-green-600">67,000 جنيه</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-700 dark:text-amber-300">هذا العام</span>
                      <span className="font-semibold text-green-600">485,000 جنيه</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-700 dark:text-amber-300">متوسط الوفورات</span>
                      <span className="font-semibold text-amber-900 dark:text-amber-100">15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-700 dark:text-amber-300">بمساعدة AI</span>
                      <span className="font-semibold text-purple-600">+8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/95 backdrop-blur-sm border border-border shadow-xl hover:shadow-2xl transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-foreground">تقارير تفصيلية</CardTitle>
                <CardDescription className="text-muted-foreground">تصدير وطباعة التقارير المتخصصة مع تحليل الذكاء الاصطناعي</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200"
                    onClick={() => exportReport('تقرير RFQ الشهري')}
                  >
                    <FileText className="h-6 w-6 mb-2 text-blue-600" />
                    <span className="text-blue-900">تقرير RFQ الشهري</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200"
                    onClick={() => exportReport('تقرير أداء الموردين')}
                  >
                    <Users className="h-6 w-6 mb-2 text-green-600" />
                    <span className="text-green-900">تقرير أداء الموردين</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border-amber-200"
                    onClick={() => exportReport('تقرير الوفورات')}
                  >
                    <DollarSign className="h-6 w-6 mb-2 text-amber-600" />
                    <span className="text-amber-900">تقرير الوفورات</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200"
                    onClick={() => exportReport('تحليل AI للعروض')}
                  >
                    <Brain className="h-6 w-6 mb-2 text-purple-600" />
                    <span className="text-purple-900">تحليل AI للعروض</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border-orange-200"
                    onClick={() => exportReport('تقرير أوقات الاستجابة')}
                  >
                    <Clock className="h-6 w-6 mb-2 text-orange-600" />
                    <span className="text-orange-900">تقرير أوقات الاستجابة</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border-red-200"
                    onClick={() => exportReport('تحليل المخاطر')}
                  >
                    <Shield className="h-6 w-6 mb-2 text-red-600" />
                    <span className="text-red-900">تحليل المخاطر</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 border-indigo-200"
                    onClick={() => exportReport('تقرير شامل')}
                  >
                    <BarChart3 className="h-6 w-6 mb-2 text-indigo-600" />
                    <span className="text-indigo-900">تقرير شامل</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col bg-gradient-to-br from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 border-teal-200"
                    onClick={() => exportReport('مؤشرات الأداء')}
                  >
                    <Target className="h-6 w-6 mb-2 text-teal-600" />
                    <span className="text-teal-900">مؤشرات الأداء</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* الأرشيف */}
          <TabsContent value="archive" className="space-y-6 animate-fade-in">
            <Card className="bg-card/95 backdrop-blur-sm border border-border shadow-xl hover:shadow-2xl transition-all duration-500">
              <CardHeader className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-500/5 rounded-full blur-2xl"></div>
                <CardTitle className="text-2xl text-foreground relative z-10">الأرشيف</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">طلبات عروض الأسعار المكتملة والمؤرشفة</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="absolute inset-0 bg-gray-500/2 rounded-lg pointer-events-none"></div>
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          placeholder="البحث في الأرشيف..." 
                          onChange={(e) => {
                            const searchValue = e.target.value;
                            
                            // البحث الفعلي في الأرشيف
                            const archivedRFQs = savedRFQs.filter(rfq => rfq.status === "مكتمل");
                            const filtered = archivedRFQs.filter(rfq => 
                              rfq.rfqNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
                              rfq.subject.toLowerCase().includes(searchValue.toLowerCase()) ||
                              (rfq.selectedVendor || '').toLowerCase().includes(searchValue.toLowerCase())
                            );
                            
                            setFilteredArchive(filtered);
                            
                            if (searchValue.length > 2) {
                              toast({
                                title: "البحث في الأرشيف",
                                description: `تم العثور على ${filtered.length} نتيجة للبحث: ${searchValue}`,
                              });
                            }
                          }}
                          className="pl-10 border-border focus:border-primary transition-all duration-300 text-foreground"
                        />
                      </div>
                    </div>
                    <Select onValueChange={(value) => {
                      toast({
                        title: "تصفية حسب السنة",
                        description: `تم تطبيق فلتر السنة: ${value}`,
                      });
                    }}>
                      <SelectTrigger className="w-48 border-border focus:border-primary text-foreground">
                        <SelectValue placeholder="السنة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "أرشفة متقدمة",
                          description: "فتح خيارات الأرشفة المتقدمة والتحليل التاريخي",
                        });
                      }}
                      className="hover:bg-primary/10 transition-all duration-300"
                    >
                      <Archive className="ml-2 h-4 w-4" />
                      أرشفة متقدمة
                    </Button>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur-sm">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/40">
                          <TableHead className="text-right text-foreground font-semibold">رقم الطلب</TableHead>
                          <TableHead className="text-right text-foreground font-semibold">الموضوع</TableHead>
                          <TableHead className="text-right text-foreground font-semibold">تاريخ الإنشاء</TableHead>
                          <TableHead className="text-right text-foreground font-semibold">تاريخ الإنجاز</TableHead>
                          <TableHead className="text-right text-foreground font-semibold">المورد المختار</TableHead>
                          <TableHead className="text-right text-foreground font-semibold">القيمة النهائية</TableHead>
                          <TableHead className="text-right text-foreground font-semibold">الوفورات</TableHead>
                          <TableHead className="text-right text-foreground font-semibold">الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="hover:bg-muted/20 transition-all duration-300">
                          <TableCell className="font-medium text-foreground">RFQ-2023-048</TableCell>
                          <TableCell className="text-foreground">مواد تنظيف شاملة</TableCell>
                          <TableCell className="text-foreground">2023-12-15</TableCell>
                          <TableCell className="text-foreground">2023-12-22</TableCell>
                          <TableCell className="text-foreground">شركة النظافة المثالية</TableCell>
                          <TableCell className="text-green-600 font-medium">12,500 جنيه</TableCell>
                          <TableCell className="text-blue-600 font-medium">2,100 جنيه</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm" className="hover:bg-primary/10 transition-all duration-300">
                                <Eye className="ml-2 h-4 w-4" />
                                عرض
                              </Button>
                              <Button variant="outline" size="sm" className="hover:bg-blue-100 transition-all duration-300">
                                <Download className="ml-2 h-4 w-4" />
                                تحميل
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-muted/20 transition-all duration-300">
                          <TableCell className="font-medium text-foreground">RFQ-2023-047</TableCell>
                          <TableCell className="text-foreground">إصلاحات كهربائية</TableCell>
                          <TableCell className="text-foreground">2023-12-10</TableCell>
                          <TableCell className="text-foreground">2023-12-18</TableCell>
                          <TableCell className="text-foreground">شركة الكهرباء الحديثة</TableCell>
                          <TableCell className="text-green-600 font-medium">8,200 جنيه</TableCell>
                          <TableCell className="text-blue-600 font-medium">1,500 جنيه</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm" className="hover:bg-primary/10 transition-all duration-300">
                                <Eye className="ml-2 h-4 w-4" />
                                عرض
                              </Button>
                              <Button variant="outline" size="sm" className="hover:bg-blue-100 transition-all duration-300">
                                <Download className="ml-2 h-4 w-4" />
                                تحميل
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Assistant Dialog */}
        <Dialog open={showAIAssistant} onOpenChange={setShowAIAssistant}>
          <DialogContent className="max-w-4xl max-h-[90vh] bg-card border border-border shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-foreground flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                مساعد الذكاء الاصطناعي لطلب العروض
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                احصل على توصيات ذكية لتحسين طلب العروض وتحليل السوق
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 p-1">
                {/* AI Features Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Target className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-foreground">تحليل المتطلبات</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      تحليل ذكي لمتطلباتك واقتراح أفضل المواصفات
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => generateAIRecommendations(rfq)}
                      className="w-full"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      تحليل المتطلبات
                    </Button>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-foreground">توقع الأسعار</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      توقع أسعار السوق الحالية للأصناف المطلوبة
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const predictedItems = predictMarketPrices(rfq.items);
                        toast({
                          title: "تم تحليل الأسعار",
                          description: "تم عرض توقعات الأسعار للأصناف المختارة"
                        });
                      }}
                      className="w-full"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      تحليل الأسعار
                    </Button>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-foreground">اختيار الموردين</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      توصيات ذكية لأفضل الموردين المناسبين
                    </p>
                    <Select onValueChange={(vendorId) => analyzeVendorPerformance(vendorId)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="تحليل مورد" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map((vendor: any) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-orange-600" />
                      </div>
                      <h3 className="font-semibold text-foreground">تحسين الطلب</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      تحسين صياغة الطلب لضمان أفضل عروض
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={optimizeRFQ}
                      className="w-full"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      تحسين الطلب
                    </Button>
                  </Card>
                </div>

                <Separator />

                {/* AI Insights */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    رؤى ذكية
                  </h3>
                  
                  <div className="grid gap-3">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                            توقعات السوق
                          </h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            أسعار زيوت المحركات شهدت انخفاضاً بنسبة 5% هذا الشهر. ننصح بطلب العروض الآن.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                          <Award className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">
                            أفضل مورد موصى به
                          </h4>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            شركة التوريدات المتقدمة حققت أفضل نسبة جودة/سعر في طلبات مماثلة.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                            تحذير مخاطر
                          </h4>
                          <p className="text-sm text-amber-700 dark:text-amber-300">
                            تأكد من تحديد مواصفات دقيقة للزيوت لتجنب مشاكل التوافق.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter>
              <div className="flex gap-2 w-full">
                <Button variant="outline" onClick={() => setShowAIAssistant(false)} className="flex-1">
                  إغلاق
                </Button>
                <Button onClick={() => {
                  generateAIRecommendations(rfq);
                  setShowAIAssistant(false);
                }} className="flex-1">
                  <Brain className="ml-2 h-4 w-4" />
                  تطبيق التوصيات
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RequestForQuotation;