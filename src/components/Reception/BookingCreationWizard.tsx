import { useState, useCallback, useEffect, useMemo } from "react";
import { 
  CalendarIcon, 
  Clock,
  User, 
  Car, 
  Building2, 
  CreditCard, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Star,
  Zap,
  Timer,
  Search,
  Plus,
  Check,
  ChevronsUpDown,
  FileText,
  Table as TableIcon,
  Users,
  Package,
  ShoppingCart,
  Receipt,
  DollarSign,
  Trash2,
  Percent
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAdvancedBookingSystem, type AdvancedBookingData } from "@/hooks/useAdvancedBookingSystem";
import { useTableManagement } from "@/hooks/useTableManagement";
import { useGetActiveServicesQuery, useGetAllServicesQuery } from "@/services/serviceApi";
import { useCreateBookingMutation } from "@/services/bookingApi";
import { useGetCustomersQuery } from "@/services/customersApi";
import { useGetAllBranchesQuery } from "@/services/branchesApi";
import { useGetAllProductsQuery } from "@/services/productApi";
import { useGetAllConsumablesQuery } from "@/services/consumableApi";
import { useCreateQuickSaleMutation } from "@/services/quickSaleApi";
import { getImageUrl } from "@/utils/imageHelpers";
import { TimeSlotPicker } from "./TimeSlotPicker";
import { InvoiceDialog } from "./InvoiceDialog";
import { useShift } from "@/contexts/ShiftContext";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface BookingCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// تم إزالة جميع البيانات الوهمية - سيتم استخدام البيانات الحقيقية من API

export function BookingCreationWizard({ open, onOpenChange }: BookingCreationWizardProps) {
  console.log("BookingCreationWizard rendered with open:", open);
  
  const { toast } = useToast();
  const { createBooking } = useAdvancedBookingSystem();
  const { tables, fetchTables } = useTableManagement();
  const [createBookingMutation] = useCreateBookingMutation();
  const [createQuickSaleMutation] = useCreateQuickSaleMutation();
  const { data: customersData, isLoading: customersLoading, error: customersError } = useGetCustomersQuery({ limit: 100 });
  const { data: branchesData, isLoading: branchesLoading, error: branchesError } = useGetAllBranchesQuery(undefined as any);
  const { data: servicesData, isLoading: servicesLoading, error: servicesError } = useGetActiveServicesQuery({});
  const { data: allServicesData } = useGetAllServicesQuery(undefined);
  const { data: productsData, isLoading: productsLoading } = useGetAllProductsQuery(undefined);
  const { data: consumablesData, isLoading: consumablesLoading } = useGetAllConsumablesQuery(undefined);
  
  // حالة التبويب النشط - البيع السريع كافتراضي
  const [activeTab, setActiveTab] = useState<'quick-sale' | 'booking'>('quick-sale');
  
  // حالات البيع السريع
  const [quickSaleTab, setQuickSaleTab] = useState('items');
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [quickSaleServiceType, setQuickSaleServiceType] = useState<'product' | 'service'>('product');
  const [quickSaleSearchTerm, setQuickSaleSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('نقد');
  const [discount, setDiscount] = useState(0);
  const [quickSaleCustomer, setQuickSaleCustomer] = useState<any | null>(null);
  
  // جلب الفروع من API مباشرة وإنشاء نسخة قابلة للتعديل
  const branches: any[] = Array.isArray(branchesData?.data) ? [...branchesData.data] : [];
  
  // دمج المنتجات والمواد المستهلكة (مشترك بين البيع السريع والحجز)
  const allProductsArr = Array.isArray(productsData?.data) ? productsData.data : Array.isArray(productsData?.data?.products) ? productsData.data.products : [];
  const allConsumablesArr = Array.isArray(consumablesData?.data) ? consumablesData.data : [];
  const allProducts = [...allProductsArr, ...allConsumablesArr];
  
  // Debug: Log branches data
  console.log("🔍 Branches API Response:", branchesData);
  console.log("🔍 Branches:", branches);
  console.log("🔍 Branches loading:", branchesLoading);
  console.log("🔍 Branches error:", branchesError);
  
  // Prevent rapid open/close cycles
  const [isStable, setIsStable] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsStable(true), 100);
    return () => clearTimeout(timer);
  }, [open]);

  // إعادة تعيين الحالة عند فتح النافذة
  useEffect(() => {
    if (open) {
      setShowSuccessMessage(false);
      setIsSubmitting(false);
    }
  }, [open]);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [openCustomerCombo, setOpenCustomerCombo] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [customerLocation, setCustomerLocation] = useState<{lat: number, lng: number} | null>(null);
  const [nearestBranch, setNearestBranch] = useState<string | null>(null);
  const [availableTables, setAvailableTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemType, setItemType] = useState<'service' | 'product'>('service');
  const [bookingSearchTerm, setBookingSearchTerm] = useState('');
  
  // حالة الايصال (مشتركة بين البيع السريع والحجز)
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  
  // جلب الوردية المختارة
  const { selectedShift } = useShift();
  
  // إعادة تعيين حالة البيع السريع عند تغيير التبويب
  useEffect(() => {
    if (open && activeTab === 'quick-sale') {
      setQuickSaleTab('items');
      setCartItems([]);
      setSelectedBranchId('');
      setPaymentAmount('');
      setDiscount(0);
      setQuickSaleCustomer(null);
      setQuickSaleSearchTerm('');
    }
  }, [open, activeTab]);
  
  // دالة normalize للبيانات
  const normalize = (data: any, key?: string) => {
    if (!data) return [] as any[];
    if (Array.isArray(data)) return data as any[];
    if (key) {
      const fromRoot = (data as any)[key];
      if (Array.isArray(fromRoot)) return fromRoot as any[];
      const fromDataKey = (data as any)?.data && (data as any).data[key];
      if (Array.isArray(fromDataKey)) return fromDataKey as any[];
    }
    if (Array.isArray((data as any)?.data)) return (data as any).data as any[];
    return [] as any[];
  };
  
  // استخراج بيانات البيع السريع
  const allServicesArr = normalize(allServicesData, "services");
  const allQuickSaleProducts = [...allProductsArr, ...allConsumablesArr];
  
  // فلترة العناصر للبيع السريع
  const filteredQuickSaleItems = useMemo(() => {
    const items = quickSaleServiceType === 'service' ? allServicesArr : allQuickSaleProducts;
    if (!quickSaleSearchTerm) return items;
    
    return items.filter((item: any) => {
      const searchLower = quickSaleSearchTerm.toLowerCase();
      const itemName = item.arabicName || item.englishName || item.name_ar || item.nameAr || item.name || '';
      const itemCode = item.serviceCode || item.product_id || item.code || '';
      return itemName.toLowerCase().includes(searchLower) || itemCode.toLowerCase().includes(searchLower);
    });
  }, [quickSaleServiceType, quickSaleSearchTerm, allServicesArr, allQuickSaleProducts]);
  
  // إضافة عنصر للسلة
  const handleAddToCart = (item: any) => {
    const itemName = item.arabicName || item.englishName || item.name_ar || item.nameAr || item.name || 'عنصر';
    const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price || item.selling_price || item.unitCost || 0);
    const itemCode = item.serviceCode || item.product_id || item.code || item.id || '';
    
    const newItem = {
      id: item.id || item.product_id,
      name: itemName,
      type: quickSaleServiceType,
      code: itemCode,
      price: itemPrice,
      quantity: 1,
      total: itemPrice
    };
    
    setCartItems([...cartItems, newItem]);
    toast({
      title: "تمت الإضافة",
      description: `تم إضافة ${itemName} إلى السلة`,
    });
  };
  
  // حذف عنصر من السلة
  const handleRemoveFromCart = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };
  
  // تحديث كمية عنصر في السلة
  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) {
      handleRemoveFromCart(index);
      return;
    }
    const updatedItems = [...cartItems];
    updatedItems[index].quantity = quantity;
    updatedItems[index].total = updatedItems[index].price * quantity;
    setCartItems(updatedItems);
  };
  
  // حساب الإجماليات للبيع السريع
  const calculateQuickSaleTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = (subtotal * discount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxRate = 0.15; // 15% VAT
    const tax = afterDiscount * taxRate;
    const total = afterDiscount + tax;
    
    return { subtotal, discountAmount, afterDiscount, tax, total };
  };
  
  // إرسال البيع السريع
  const handleQuickSaleSubmit = async () => {
    if (!selectedBranchId) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار الفرع",
        variant: "destructive"
      });
      return;
    }
    
    if (cartItems.length === 0) {
      toast({
        title: "خطأ",
        description: "يرجى إضافة عناصر إلى السلة",
        variant: "destructive"
      });
      return;
    }
    
    const totals = calculateQuickSaleTotals();
    
    try {
      const quickSaleData = {
        branchId: selectedBranchId,
        shiftId: selectedShift?.id || null,
        customerId: quickSaleCustomer?.id || null,
        customerName: quickSaleCustomer?.name || 'عميل نقدي',
        customerPhone: quickSaleCustomer?.phone || '',
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type,
          code: item.code,
          quantity: item.quantity,
          price: item.price,
          total: item.total
        })),
        subtotal: totals.subtotal,
        discount: totals.discountAmount,
        tax: totals.tax,
        total: totals.total,
        paymentMethod: paymentMethod,
        paymentAmount: parseFloat(paymentAmount) || totals.total
      };
      
      const result = await createQuickSaleMutation(quickSaleData).unwrap();
      
      // إعداد بيانات الايصال
      const selectedBranch = branches.find((b: any) => b.id === selectedBranchId);
      const invoice = {
        invoiceNumber: result?.data?.id?.toString() || `QS-${Date.now()}`,
        invoiceDate: new Date(),
        type: 'quick-sale' as const,
        customerName: quickSaleCustomer?.name || 'عميل نقدي',
        customerPhone: quickSaleCustomer?.phone || '',
        customerEmail: quickSaleCustomer?.email || '',
        branchName: selectedBranch?.arabicName || selectedBranch?.englishName || 'الفرع الرئيسي',
        branchAddress: selectedBranch?.address || '',
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          code: item.code,
          quantity: item.quantity,
          price: item.price,
          discount: 0,
          total: item.total,
          type: item.type
        })),
        subtotal: totals.subtotal,
        discount: totals.discountAmount,
        tax: totals.tax,
        total: totals.total,
        paymentMethod: paymentMethod,
        notes: '',
      };
      
      // إعادة تعيين الحالة
      setCartItems([]);
      setSelectedBranchId('');
      setPaymentAmount('');
      setDiscount(0);
      setQuickSaleCustomer(null);
      setQuickSaleTab('items');
      
      // إظهار الايصال
      setInvoiceData(invoice);
      setShowInvoice(true);
      
      toast({
        title: "نجح",
        description: "تم إتمام البيع بنجاح",
      });
      
    } catch (error) {
      console.error("Error creating quick sale:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إتمام البيع",
        variant: "destructive"
      });
    }
  };
  
  const [formData, setFormData] = useState<Partial<AdvancedBookingData>>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    services: [],
    branchId: "",
    tableId: "",
    tableName: "",
    tableNumber: "",
    tableCapacity: 0,
    tableLocation: "",
    date: "",
    time: "",
    notes: "",
    specialRequests: [],
    communicationPreferences: {
      sms: true,
      email: false,
      push: false,
      whatsapp: false
    }
  });

  const steps = [
    { id: 1, title: "معلومات العميل", icon: User },
    { id: 2, title: "اختيار الفرع", icon: Building2 },
    { id: 3, title: "اختيار الطاولة", icon: MapPin },
    { id: 4, title: "الخدمات والمنتجات", icon: Package },
    { id: 5, title: "الموعد والوقت", icon: CalendarIcon },
    { id: 6, title: "مراجعة وتأكيد", icon: CheckCircle }
  ];

  const resolveItemImage = useCallback((item: any, type: "service" | "product") => {
    const extractCandidate = (source: any): string | undefined => {
      if (!source) return undefined;
      if (typeof source === "string") return source;
      if (typeof source === "object") {
        if (typeof source.url === "string") return source.url;
        if (typeof source.path === "string") return source.path;
      }
      return undefined;
    };

    const baseCandidates = [
      extractCandidate(item.image),
      extractCandidate(item.imageUrl),
      extractCandidate(item.image_url),
      extractCandidate(item.img_url),
      extractCandidate(item.picture),
      extractCandidate(item.thumbnail),
      extractCandidate(item.attachmentImage),
      extractCandidate(item.previewImage),
      extractCandidate(item.coverImage),
      extractCandidate(item.icon),
    ];

    const extendedCandidates =
      type === "product"
        ? [
            extractCandidate(item.productImage),
            extractCandidate(item.mainImage),
            extractCandidate(item.featuredImage),
          ]
        : [
            extractCandidate(item.serviceImage),
            extractCandidate(item.logo),
            extractCandidate(item.bannerImage),
          ];

    for (const candidate of [...baseCandidates, ...extendedCandidates]) {
      if (candidate) {
        const normalized = getImageUrl(candidate);
        if (normalized) {
          return normalized;
        }
      }
    }

    return null;
  }, []);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get customer location and find nearest branch
  const getCustomerLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCustomerLocation({ lat: latitude, lng: longitude });
          
          // Find nearest branch
          let nearestId: string | null = null;
          let shortestDistance = Infinity;
          
          branches.forEach(branch => {
            const distance = calculateDistance(
              latitude, longitude,
              branch.coordinates.lat, branch.coordinates.lng
            );
            if (distance < shortestDistance) {
              shortestDistance = distance;
              nearestId = branch.id;
            }
          });
          
          setNearestBranch(nearestId);
          const nearestBranchName = branches.find(b => b.id === nearestId)?.name || 'غير محدد';
          toast({
            title: "تم تحديد الموقع",
            description: `أقرب فرع لك: ${nearestBranchName} (${shortestDistance.toFixed(1)} كم)`,
          });
        },
        (error) => {
          toast({
            title: "تعذر تحديد الموقع",
            description: "يرجى السماح بالوصول إلى الموقع أو اختيار الفرع يدوياً",
            variant: "destructive"
          });
        }
      );
    }
  };

  const calculateTotals = useCallback(() => {
    const basePrice = formData.services?.reduce((sum, service) => {
      const price = typeof service.price === 'string' ? parseFloat(service.price) : service.price;
      return sum + (isNaN(price) ? 0 : price);
    }, 0) || 0;
    
    const totalPrice = basePrice;
    
    const totalDuration = formData.services?.reduce((sum, service) => {
      const duration = typeof service.duration === 'string' ? parseInt(service.duration) : service.duration;
      return sum + (isNaN(duration) ? 0 : duration);
    }, 0) || 0;
    
    return { 
      totalPrice: Math.round(totalPrice * 100) / 100, // تقريب لرقمين عشريين
      totalDuration, 
      basePrice: Math.round(basePrice * 100) / 100 
    };
  }, [formData.services]);

  // Get real customers from API وإنشاء نسخة قابلة للتعديل
  const realCustomers = Array.isArray(customersData?.data) ? [...customersData.data] : [];
  
  // Debug: Log customers data
  console.log("🔍 Customers API Response:", customersData);
  console.log("🔍 Real customers:", realCustomers);
  console.log("🔍 Customers loading:", customersLoading);
  console.log("🔍 Customers error:", customersError);
  
  // Filter customers based on search
  const filteredCustomers = realCustomers.filter((customer: any) =>
    customer.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
    customer.phone?.includes(searchValue) ||
    customer.email?.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Filter available tables based on selected branch وإنشاء نسخة قابلة للتعديل
  const filteredAvailableTables = Array.isArray(availableTables) 
    ? [...availableTables].filter(table => 
        table.branchId === formData.branchId && table.status === 'available'
      )
    : [];

  // Handle customer selection
  const handleCustomerSelect = (customer: any) => {
    setSelectedCustomer(customer);
    setFormData(prev => ({
      ...prev,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email || ''
    }));
    setSearchValue(customer.name);
    setOpenCustomerCombo(false);
    setIsNewCustomer(false);
  };

  // Handle new customer
  const handleNewCustomer = () => {
    setSelectedCustomer(null);
    setFormData(prev => ({
      ...prev,
      customerName: searchValue,
      customerPhone: "",
      customerEmail: ""
    }));
    setOpenCustomerCombo(false);
    setIsNewCustomer(true);
  };

  // Handle date selection - TimeSlotPicker handles loading time slots from API
  const handleDateSelect = async (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTimeSlot("");
    
    if (date) {
      const dateString = format(date, "yyyy-MM-dd");
      setFormData(prev => ({ ...prev, date: dateString }));
    }
  };

  // Handle time slot selection  
  const handleTimeSlotSelect = (timeSlot: string) => {
    if (timeSlot && timeSlot.trim()) {
      setSelectedTimeSlot(timeSlot);
      setFormData(prev => ({ ...prev, time: timeSlot }));
    }
  };

  const canProceedToNextStep = () => {
    console.log("Current step:", currentStep);
    console.log("Form data:", formData);
    console.log("Selected date:", selectedDate);
    console.log("Selected time slot:", selectedTimeSlot);
    
    switch (currentStep) {
      case 1:
        const step1Valid = formData.customerName && formData.customerPhone;
        console.log("Step 1 valid:", step1Valid);
        return step1Valid;
      case 2:
        const step2Valid = formData.branchId;
        console.log("Step 2 valid:", step2Valid);
        return step2Valid;
      case 3:
        const step3Valid = formData.tableId;
        console.log("Step 3 valid:", step3Valid);
        return step3Valid;
      case 4:
        const step4Valid = formData.services && formData.services.length > 0;
        console.log("Step 4 valid:", step4Valid);
        return step4Valid;
      case 5:
        const step5Valid = selectedDate && selectedTimeSlot && selectedTimeSlot.trim() !== "";
        console.log("Step 5 valid:", step5Valid, "Date:", selectedDate, "Time:", selectedTimeSlot);
        return step5Valid;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleServiceToggle = (item: any) => {
    setFormData(prev => {
      const currentServices = prev.services || [];
      const exists = currentServices.find(s => s.id === item.id);
      
      if (exists) {
        return {
          ...prev,
          services: currentServices.filter(s => s.id !== item.id)
        };
      } else {
        // تحويل price و duration إلى أرقام للتأكد من صحة الحسابات
        const itemWithNumbers = {
          ...item,
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
          duration: typeof item.duration === 'string' ? parseInt(item.duration) : item.duration,
          type: item.type || 'service' // إضافة النوع
        };
        
        return {
          ...prev,
          services: [...currentServices, itemWithNumbers]
        };
      }
    });
  };

  // Handle table selection
  const handleTableSelect = (table: any) => {
    setSelectedTable(table);
    setFormData(prev => ({
      ...prev,
      tableId: table.id,
      tableName: table.name,
      tableNumber: table.tableNumber,
      tableCapacity: table.capacity,
      tableLocation: table.location
    }));
  };

  // Load available tables when branch changes
  useEffect(() => {
    if (formData.branchId) {
      fetchTables({ branchId: formData.branchId, status: 'available' }).then(tables => {
        setAvailableTables(tables);
      });
    } else {
      setAvailableTables([]);
      setSelectedTable(null);
      setFormData(prev => ({ 
        ...prev, 
        tableId: "",
        tableName: "",
        tableNumber: "",
        tableCapacity: 0,
        tableLocation: ""
      }));
    }
  }, [formData.branchId, fetchTables]);

  const handleSubmit = async () => {
    // Validate required fields before submission
    if (!selectedDate || !selectedTimeSlot || !selectedTimeSlot.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى التأكد من اختيار التاريخ والوقت",
        variant: "destructive"
      });
      return;
    }

    if (!formData.tableId) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى اختيار الطاولة",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { totalPrice, totalDuration } = calculateTotals();
      
      const bookingData = {
        customerName: formData.customerName || '',
        customerPhone: formData.customerPhone || '',
        customerEmail: formData.customerEmail || '',
        branchId: formData.branchId || '',
        tableId: formData.tableId || '',
        shiftId: selectedShift?.id || null, // إضافة معرف الوردية
        date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : '',
        time: selectedTimeSlot,
        services: formData.services || [],
        notes: formData.notes || ''
      };

      const result = await createBookingMutation(bookingData).unwrap();
      
      // إعداد بيانات الايصال
      const selectedBranch = branches.find((b: any) => b.id === formData.branchId);
      const taxRate = 0.15; // 15% VAT
      const subtotal = totalPrice;
      const taxAmount = subtotal * taxRate;
      const total = subtotal + taxAmount;
      
      const invoice = {
        invoiceNumber: result?.data?.id?.toString() || `BOOKING-${Date.now()}`,
        invoiceDate: new Date(),
        type: 'booking' as const,
        customerName: formData.customerName || '',
        customerPhone: formData.customerPhone || '',
        customerEmail: formData.customerEmail || '',
        branchName: selectedBranch?.arabicName || selectedBranch?.englishName || 'الفرع الرئيسي',
        branchAddress: selectedBranch?.address || '',
        items: (formData.services || []).map((service: any) => ({
          id: service.id,
          name: service.name,
          code: service.id?.toString() || '',
          quantity: 1,
          price: typeof service.price === 'number' ? service.price : parseFloat(service.price) || 0,
          discount: 0,
          total: typeof service.price === 'number' ? service.price : parseFloat(service.price) || 0,
          type: 'service' as const
        })),
        subtotal: subtotal,
        discount: 0,
        tax: taxAmount,
        total: total,
        paymentMethod: 'عند الوصول',
        notes: formData.notes || '',
        // معلومات الحجز
        bookingDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : '',
        bookingTime: selectedTimeSlot,
        tableName: selectedTable?.name || formData.tableName || '',
        tableNumber: selectedTable?.tableNumber || formData.tableNumber || ''
      };
      
      // إظهار رسالة النجاح لفترة قصيرة
      setShowSuccessMessage(true);
      
      // إخفاء نافذة الحجز وعرض الايصال بعد 2 ثانية
      setTimeout(() => {
        resetFormAndClose();
        setInvoiceData(invoice);
        setShowInvoice(true);
      }, 2000);
      
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "خطأ في إنشاء الحجز",
        description: "حدث خطأ أثناء إنشاء الحجز. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  // دالة لإعادة تعيين النموذج وإغلاق النافذة
  const resetFormAndClose = () => {
    setFormData({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      services: [],
      branchId: "",
      tableId: "",
      tableName: "",
      tableNumber: "",
      tableCapacity: 0,
      tableLocation: "",
      date: "",
      time: "",
      notes: "",
      specialRequests: [],
      communicationPreferences: {
        sms: true,
        email: false,
        push: false,
        whatsapp: false
      }
    });
    setSelectedCustomer(null);
    setSelectedTable(null);
    setSelectedDate(undefined);
    setSelectedTimeSlot("");
    setCurrentStep(1);
    setShowSuccessMessage(false);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* معلومات العميل */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                معلومات العميل
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="customerName">اسم العميل *</Label>
                {customersLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="mr-2 text-sm text-muted-foreground">جاري تحميل العملاء...</span>
                  </div>
                ) : customersError ? (
                  <div className="p-4 text-center text-red-600">
                    <p className="text-sm">خطأ في تحميل العملاء</p>
                    <p className="text-xs text-muted-foreground mt-1">يرجى المحاولة مرة أخرى</p>
                  </div>
                ) : (
                  <Popover open={openCustomerCombo} onOpenChange={setOpenCustomerCombo}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCustomerCombo}
                        className="w-full justify-between"
                      >
                        {formData.customerName || "البحث عن عميل أو إضافة جديد..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-background border shadow-lg z-50" align="start">
                      <Command className="bg-background">
                        <CommandInput 
                          placeholder="ابحث بالاسم، الجوال، أو البريد..." 
                          value={searchValue}
                          onValueChange={setSearchValue}
                          className="border-none focus:ring-0"
                        />
                        <CommandList className="bg-background">
                          <CommandEmpty className="py-6 text-center text-sm">
                            <div className="space-y-2">
                              <p>لا توجد نتائج للبحث "{searchValue}"</p>
                              {searchValue && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={handleNewCustomer}
                                  className="w-full"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  إضافة "{searchValue}" كعميل جديد
                                </Button>
                              )}
                            </div>
                          </CommandEmpty>
                          {filteredCustomers.length > 0 && (
                            <CommandGroup heading="العملاء الحاليون">
                              {filteredCustomers.map((customer: any) => (
                                <CommandItem
                                  key={customer.id}
                                  onSelect={() => handleCustomerSelect(customer)}
                                  className="cursor-pointer hover:bg-muted p-3"
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${
                                      selectedCustomer?.id === customer.id ? "opacity-100" : "opacity-0"
                                    }`}
                                  />
                                  <div className="flex flex-col w-full">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{customer.name}</span>
                                    <Badge variant="secondary" className="text-xs">
                                      {customer.customerType === 'Individual' ? 'فرد' : 
                                       customer.customerType === 'Company' ? 'شركة' : 'مجموعة'}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {customer.phone} • {customer.email || 'لا يوجد بريد إلكتروني'}
                                  </div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                          {searchValue && filteredCustomers.length > 0 && (
                            <CommandGroup>
                              <CommandItem onSelect={handleNewCustomer} className="cursor-pointer">
                                <Plus className="h-4 w-4 mr-2" />
                                إضافة "{searchValue}" كعميل جديد
                              </CommandItem>
                            </CommandGroup>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
                {selectedCustomer && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <Check className="h-4 w-4" />
                      <span className="text-sm font-medium">تم تحديد العميل: {selectedCustomer.name}</span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      {selectedCustomer.customerType === 'Individual' ? 'عميل فردي' : 
                       selectedCustomer.customerType === 'Company' ? 'عميل شركة' : 'عميل مجموعة'} • 
                      {selectedCustomer.totalVisits || 0} زيارة • 
                      {selectedCustomer.totalSpent || 0} جنيه مصري إجمالي المشتريات
                    </div>
                  </div>
                )}
                {isNewCustomer && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Plus className="h-4 w-4" />
                      <span className="text-sm font-medium">عميل جديد: {formData.customerName}</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      سيتم إضافة هذا العميل إلى قاعدة البيانات
                    </p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">رقم الجوال *</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="+966xxxxxxxxx"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">البريد الإلكتروني</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                    placeholder="example@email.com"
                  />
                </div>
              </div>
            </div>


            {/* تفضيلات التواصل */}
            <div className="space-y-3">
              <Label>تفضيلات التواصل</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span>الرسائل النصية</span>
                  <Switch
                    checked={formData.communicationPreferences?.sms}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      communicationPreferences: {
                        ...prev.communicationPreferences!,
                        sms: checked
                      }
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>البريد الإلكتروني</span>
                  <Switch
                    checked={formData.communicationPreferences?.email}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      communicationPreferences: {
                        ...prev.communicationPreferences!,
                        email: checked
                      }
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">اختيار الفرع</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={getCustomerLocation}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                تحديد أقرب فرع
              </Button>
            </div>
            
            <div className="grid gap-4">
              {branchesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">جاري تحميل الفروع...</p>
                </div>
              ) : branchesError ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-500">خطأ في تحميل الفروع</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    يرجى المحاولة مرة أخرى
                  </p>
                </div>
              ) : branches.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد فروع متاحة</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    يرجى إضافة فروع أولاً
                  </p>
                </div>
              ) : (
                branches
                  .sort((a: any, b: any) => {
                    // Sort by nearest branch first if location is available
                    if (customerLocation) {
                      const distanceA = calculateDistance(
                        customerLocation.lat, customerLocation.lng,
                        a.coordinates?.lat || 0, a.coordinates?.lng || 0
                      );
                      const distanceB = calculateDistance(
                        customerLocation.lat, customerLocation.lng,
                        b.coordinates?.lat || 0, b.coordinates?.lng || 0
                      );
                      return distanceA - distanceB;
                    }
                    return 0;
                  })
                  .map((branch: any) => {
                  const isNearest = nearestBranch === branch.id;
                  const distance = customerLocation ? 
                    calculateDistance(
                      customerLocation.lat, customerLocation.lng,
                      branch.coordinates?.lat || 0, branch.coordinates?.lng || 0
                    ) : null;
                  
                  return (
                    <Card 
                      key={branch.id}
                      className={`cursor-pointer transition-all duration-300 ${
                        formData.branchId === branch.id 
                          ? "ring-2 ring-primary bg-primary/5" 
                          : isNearest 
                          ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-950/20"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, branchId: branch.id }))}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{branch.arabicName || branch.englishName}</h3>
                              {isNearest && (
                                <Badge className="bg-green-600 text-white text-xs">
                                  الأقرب
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {branch.address || 'غير محدد'}
                              {distance && (
                                <span className="text-green-600 font-medium">
                                  ({distance.toFixed(1)} كم)
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span className="text-sm">{tables.filter((t: any) => t.branchId === branch.id).length} طاولة</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {branch.code || branch.id}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{branch.workingHours || '24/7'}</div>
                            <div className="text-xs text-muted-foreground">
                              {branch.status === 'active' ? 'نشط' : 'غير نشط'}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">اختيار الطاولة</h3>
              <p className="text-sm text-muted-foreground">
                اختر الطاولة المناسبة من الطاولات المتاحة في الفرع المحدد
              </p>
            </div>
            
            {filteredAvailableTables.length === 0 ? (
              <div className="text-center py-8">
                <TableIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا توجد طاولات متاحة في هذا الفرع</p>
                <p className="text-sm text-muted-foreground mt-2">
                  يرجى اختيار فرع آخر أو المحاولة لاحقاً
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredAvailableTables.map((table) => (
                  <Card 
                    key={table.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedTable?.id === table.id 
                        ? "ring-2 ring-primary bg-primary/5" 
                        : "hover:shadow-md"
                    }`}
                    onClick={() => handleTableSelect(table)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{table.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">رقم {table.tableNumber}</Badge>
                            <div className="flex items-center gap-1 text-sm">
                              <Users className="h-3 w-3" />
                              {table.capacity} كرسي
                            </div>
                            {table.location && (
                              <div className="flex items-center gap-1 text-sm">
                                <MapPin className="h-3 w-3" />
                                {table.location}
                              </div>
                            )}
                          </div>
                          {table.description && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {table.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800">
                            متاحة
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {selectedTable && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    تم اختيار الطاولة: {selectedTable.name} (رقم {selectedTable.tableNumber})
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  السعة: {selectedTable.capacity} كرسي
                  {selectedTable.location && ` • الموقع: ${selectedTable.location}`}
                </p>
              </div>
            )}
          </div>
        );

      case 4:
        const servicesArr = Array.isArray(servicesData?.data?.services) ? servicesData.data.services : [];
        const allItems = itemType === 'service' ? servicesArr : allProducts;
        const isLoading = (itemType === 'service' ? servicesLoading : (productsLoading || consumablesLoading));
        
        // فلترة العناصر بناءً على البحث
        const filteredItems = bookingSearchTerm 
          ? allItems.filter((item: any) => {
              const searchLower = bookingSearchTerm.toLowerCase();
              const itemName = item.arabicName || item.englishName || item.name_ar || item.nameAr || item.name || '';
              const itemCode = item.serviceCode || item.product_id || item.code || '';
              return itemName.toLowerCase().includes(searchLower) || itemCode.toLowerCase().includes(searchLower);
            })
          : allItems;
        
        return (
          <div className="space-y-4">
            {/* اختيار نوع العنصر والبحث */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>نوع العنصر</Label>
                <Select value={itemType} onValueChange={(value: any) => { setItemType(value); setBookingSearchTerm(''); }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        خدمات ({servicesArr.length})
                      </div>
                    </SelectItem>
                    <SelectItem value="product">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        منتجات ({allProducts.length})
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>البحث</Label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={`ابحث عن ${itemType === 'product' ? 'منتج' : 'خدمة'}...`}
                    value={bookingSearchTerm}
                    onChange={(e) => setBookingSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
            </div>
            
            {/* التخطيط الرئيسي: العناصر المتاحة والعناصر المحددة جنباً إلى جنب */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* العناصر المحددة على اليسار */}
              <div className="lg:col-span-4 order-2 lg:order-1">
                <Card className="sticky top-4 h-fit">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      العناصر المحددة ({formData.services?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!formData.services || formData.services.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">لم يتم اختيار عناصر</p>
                        <p className="text-xs mt-1">اضغط على الخدمات/المنتجات</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="max-h-[400px] overflow-y-auto space-y-2">
                          {formData.services.map((service: any, index) => (
                            <Card key={index} className="p-3 bg-muted/30">
                              <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-sm line-clamp-2">{service.name}</div>
                                    <Badge variant="outline" className="text-xs mt-1">
                                      {service.type === 'product' ? 'منتج' : 'خدمة'}
                                    </Badge>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleServiceToggle(service)}
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                <div className="flex justify-between items-center pt-2 border-t">
                                  <span className="text-xs text-muted-foreground">السعر:</span>
                                  <span className="font-bold text-primary">
                                    {(typeof service.price === 'number' ? service.price : parseFloat(service.price) || 0).toFixed(2)} جنيه
                                  </span>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>

                        {/* ملخص الإجمالي */}
                        <Card className="bg-gradient-to-br from-primary/10 to-primary/20 border-primary/30">
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between font-bold text-lg">
                                <span>المجموع:</span>
                                <span className="text-primary">{calculateTotals().totalPrice.toFixed(2)} جنيه</span>
                              </div>
                              {calculateTotals().totalDuration > 0 && (
                                <div className="flex justify-between text-sm text-muted-foreground">
                                  <span>المدة:</span>
                                  <span>{calculateTotals().totalDuration} دقيقة</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* العناصر المتاحة على اليمين */}
              <div className="lg:col-span-8 order-1 lg:order-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {itemType === 'service' ? <Zap className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                      {itemType === 'product' ? 'المنتجات المتاحة' : 'الخدمات المتاحة'}
                    </CardTitle>
                    <CardDescription>
                      اضغط على أي عنصر لإضافته ({filteredItems.length} عنصر متاح)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground mt-2">جاري تحميل البيانات...</p>
              </div>
                    ) : servicesError && itemType === 'service' ? (
              <div className="text-center py-8">
                <p className="text-red-500">خطأ في تحميل الخدمات</p>
                <p className="text-sm text-muted-foreground mt-2">
                  يرجى المحاولة مرة أخرى
                </p>
              </div>
                    ) : filteredItems.length === 0 ? (
              <div className="text-center py-8">
                <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          {bookingSearchTerm ? 'لا توجد نتائج للبحث' : `لا توجد ${itemType === 'product' ? 'منتجات' : 'خدمات'} متاحة`}
                        </p>
              </div>
            ) : (
                      <div className="max-h-[450px] overflow-y-auto">
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredItems.map((item: any) => {
                    const isSelected = formData.services?.some(s => s.id === item.id);
                    const itemImage = resolveItemImage(item, itemType) || null;
                    const itemName = item.arabicName || item.englishName || item.name_ar || item.nameAr || item.name || 'عنصر';
                    const itemCode = item.serviceCode || item.product_id || item.code || item.id || '';
                    const itemCategory = item.category?.arabicName || item.category?.name_ar || '';
                    const itemPrice = typeof item.price === 'number' ? item.price : 
                                     parseFloat(item.price || item.selling_price || item.unitCost || 0);
                    const itemDuration = item.duration || 30;
                    const itemPriority = item.priority || 'standard';
                    
                  return (
                    <Card 
                        key={item.id || item.product_id}
                        className={`group cursor-pointer transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                          isSelected ? "ring-2 ring-primary bg-primary/5 shadow-lg" : "hover:shadow-lg hover:border-primary"
                      }`}
                      onClick={() => handleServiceToggle({
                          id: item.id || item.product_id,
                          name: itemName,
                          category: itemCategory || 'عام',
                          duration: itemDuration,
                          price: itemPrice,
                          priority: itemPriority,
                          type: itemType,
                          code: itemCode
                        })}
                      >
                        <CardContent className="p-0">
                          {/* صورة الخدمة/المنتج */}
                          <div className="relative w-full h-40 bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
                            {itemImage ? (
                              <img 
                                src={itemImage} 
                                alt={itemName}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  target.onerror = null;
                                  target.src = "/placeholder.svg";
                                }}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                {itemType === 'product' ? (
                                  <Package className="w-16 h-16 text-muted-foreground/40" />
                                ) : (
                                  <Zap className="w-16 h-16 text-muted-foreground/40" />
                                )}
                              </div>
                            )}
                            
                            {/* شارة التصنيف */}
                            {itemCategory && (
                              <Badge 
                                variant="secondary" 
                                className="absolute top-2 right-2 text-xs shadow-lg bg-white/90 backdrop-blur-sm"
                              >
                                {itemCategory}
                              </Badge>
                            )}
                            
                            {/* شارة النوع */}
                            <Badge 
                              variant="outline" 
                              className="absolute top-2 left-2 text-xs shadow-lg bg-white/90 backdrop-blur-sm"
                            >
                              {itemType === 'product' ? 'منتج' : 'خدمة'}
                            </Badge>
                            
                            {/* علامة الاختيار */}
                            {isSelected && (
                              <div className="absolute bottom-2 left-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                                <Check className="w-5 h-5 text-white" />
                          </div>
                            )}
                            
                            {/* شارة مميز */}
                            {itemPriority === "premium" && (
                              <Badge className="absolute bottom-2 right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs shadow-lg">
                                <Star className="w-3 h-3 ml-1" />
                                مميز
                              </Badge>
                            )}
                          </div>
                          
                          {/* معلومات العنصر */}
                          <div className="p-3 space-y-2">
                            <div className="min-h-[2.5rem]">
                              <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                {itemName}
                              </h4>
                        </div>
                            
                            {item.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {item.description}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                {itemType === 'service' ? (
                                  <>
                                    <Timer className="w-3 h-3" />
                                    {itemDuration} دقيقة
                                  </>
                                ) : (
                                  <>
                                    <Package className="w-3 h-3" />
                                    {item.unit_of_measure || item.unitId || 'قطعة'}
                                  </>
                            )}
                      </div>
                  </div>
                            
                            <div className="pt-2 border-t">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-lg font-bold text-primary">
                                    {itemPrice.toFixed(2)}
                    </div>
                                  <div className="text-xs text-muted-foreground">جنيه مصري</div>
                    </div>
                              </div>
                            </div>
                            
                            {/* زر الاختيار */}
                            <Button 
                              size="sm" 
                              className={`w-full mt-2 transition-all ${
                                isSelected 
                                  ? 'bg-primary text-white' 
                                  : 'bg-primary/10 text-primary hover:bg-primary hover:text-white group-hover:bg-primary group-hover:text-white'
                              }`}
                            >
                              {isSelected ? (
                                <>
                                  <Check className="w-4 h-4 ml-1" />
                                  محدد
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 ml-1" />
                                  اختيار
                                </>
                              )}
                            </Button>
                  </div>
                </CardContent>
              </Card>
                  );
                  })}
                        </div>
                      </div>
            )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <CalendarIcon className="h-16 w-16 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">اختيار الموعد والوقت</h3>
              <p className="text-muted-foreground">اختر التاريخ والوقت المناسب حسب الفرع المحدد</p>
            </div>

            {formData.branchId ? (
              <div className="bg-muted/30 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <Building2 className="h-5 w-5" />
                  <span className="font-medium">
                    الفرع المحدد: {branches.find(b => b.id === formData.branchId)?.name}
                  </span>
                </div>
                
                <TimeSlotPicker
                  selectedDate={selectedDate}
                  selectedTime={selectedTimeSlot}
                  branchId={formData.branchId}
                  onDateChange={(date) => {
                    setSelectedDate(date);
                    if (date) {
                      setFormData(prev => ({ ...prev, date: format(date, "yyyy-MM-dd") }));
                    }
                  }}
                  onTimeChange={(time) => {
                    setSelectedTimeSlot(time);
                    setFormData(prev => ({ ...prev, time }));
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-lg">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  يرجى اختيار الفرع أولاً
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(2)}
                  className="mt-3"
                >
                  العودة لاختيار الفرع
                </Button>
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            {showSuccessMessage ? (
              <div className="text-center space-y-4">
                <div className="animate-pulse">
                  <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-green-600">تم الحجز بنجاح! 🎉</h3>
                  <p className="text-lg text-muted-foreground">
                    تم تأكيد حجزك في {branches.find(b => b.id === formData.branchId)?.arabicName || branches.find(b => b.id === formData.branchId)?.englishName}
                  </p>
                  <p className="text-base text-muted-foreground">
                    في {selectedDate ? format(selectedDate, "PPP", { locale: ar }) : ''} الساعة {selectedTimeSlot}
                  </p>
                  {selectedTable && (
                    <p className="text-sm text-muted-foreground">
                      الطاولة: {selectedTable.name} (رقم {selectedTable.tableNumber})
                    </p>
                  )}
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-green-700">
                    ستصلك رسالة تأكيد على رقم الجوال: {formData.customerPhone}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">مراجعة الحجز</h3>
                  <p className="text-muted-foreground">تأكد من صحة البيانات قبل التأكيد</p>
                </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">معلومات العميل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>الاسم:</strong> {formData.customerName}</div>
                  <div><strong>الجوال:</strong> {formData.customerPhone}</div>
                  {formData.customerEmail && (
                    <div><strong>البريد:</strong> {formData.customerEmail}</div>
                  )}
                </CardContent>
              </Card>


              <Card>
                <CardHeader>
                  <CardTitle className="text-base">تفاصيل الحجز</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>الفرع:</strong> {branches.find(b => b.id === formData.branchId)?.name}</div>
                  {selectedTable && (
                    <div><strong>الطاولة:</strong> {selectedTable.name} (رقم {selectedTable.tableNumber})</div>
                  )}
                  <div><strong>التاريخ:</strong> {formData.date}</div>
                  <div><strong>الوقت:</strong> {formData.time}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">الخدمات والمنتجات والتكلفة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {formData.services?.map((service: any, index) => (
                      <div key={index} className="flex justify-between items-center text-sm bg-muted/30 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {(service as any).type === 'product' ? 'منتج' : 'خدمة'}
                          </Badge>
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <span className="font-bold text-primary">{(typeof service.price === 'number' ? service.price : parseFloat(service.price) || 0).toFixed(2)} جنيه</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-3 pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>المجموع النهائي:</span>
                      <span className="text-primary">{calculateTotals().totalPrice.toFixed(2)} جنيه مصري</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Don't render if not stable to prevent rapid open/close
  if (!isStable) {
    return null;
  }

  // محتوى البيع السريع
  const renderQuickSaleContent = () => {
    const totals = calculateQuickSaleTotals();

  return (
      <Tabs value={quickSaleTab} onValueChange={setQuickSaleTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            المنتجات والخدمات
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            الدفع
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            التأكيد
          </TabsTrigger>
        </TabsList>

        {/* تبويب المنتجات والخدمات */}
        <TabsContent value="items" className="mt-4 space-y-4">
          {/* اختيار الفرع */}
          <div className="space-y-2">
            <Label>الفرع *</Label>
            <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الفرع" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch: any) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.arabicName || branch.englishName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* اختيار نوع العنصر والبحث */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>نوع العنصر</Label>
              <Select value={quickSaleServiceType} onValueChange={(value: any) => { setQuickSaleServiceType(value); setQuickSaleSearchTerm(''); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      خدمات ({allServicesArr.length})
            </div>
                  </SelectItem>
                  <SelectItem value="product">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      منتجات ({allQuickSaleProducts.length})
          </div>
                  </SelectItem>
                </SelectContent>
              </Select>
          </div>
            <div>
              <Label>البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={`ابحث عن ${quickSaleServiceType === 'product' ? 'منتج' : 'خدمة'}...`}
                  value={quickSaleSearchTerm}
                  onChange={(e) => setQuickSaleSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
          </div>

          {/* عرض العناصر */}
          <div className="max-h-[400px] overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredQuickSaleItems.map((item: any) => {
                const itemImage = resolveItemImage(item, quickSaleServiceType) || null;
                const itemName = item.arabicName || item.englishName || item.name_ar || item.nameAr || item.name || 'عنصر';
                const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price || item.selling_price || item.unitCost || 0);
                
              return (
                  <Card key={item.id || item.product_id} className="cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-0">
                      <div className="relative w-full h-32 bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
                        {itemImage ? (
                          <img src={itemImage} alt={itemName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            {quickSaleServiceType === 'product' ? (
                              <Package className="w-12 h-12 text-muted-foreground/40" />
                            ) : (
                              <Zap className="w-12 h-12 text-muted-foreground/40" />
                            )}
                  </div>
                        )}
                </div>
                      <div className="p-3">
                        <h4 className="font-semibold text-sm line-clamp-2">{itemName}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-lg font-bold text-primary">{itemPrice.toFixed(2)} ج.م</div>
                          <Button size="sm" onClick={() => handleAddToCart(item)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              );
            })}
          </div>
        </div>

          {/* السلة */}
          {cartItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">السلة ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.price.toFixed(2)} ج.م × {item.quantity}</div>
        </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(index, parseInt(e.target.value) || 1)}
                          className="w-16 h-8"
                        />
                        <span className="font-bold w-20 text-right">{item.total.toFixed(2)} ج.م</span>
          <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFromCart(index)}
                          className="text-red-500 hover:text-red-700"
          >
                          <Trash2 className="h-4 w-4" />
          </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between font-bold text-lg">
                    <span>الإجمالي:</span>
                    <span className="text-primary">{totals.subtotal.toFixed(2)} ج.م</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* تبويب الدفع */}
        <TabsContent value="payment" className="mt-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">السلة فارغة</p>
              <Button onClick={() => setQuickSaleTab('items')} className="mt-4">
                إضافة عناصر
              </Button>
            </div>
              ) : (
                <>
              {/* ملخص السلة */}
              <Card>
                <CardHeader>
                  <CardTitle>ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-medium">{item.total.toFixed(2)} ج.م</span>
                    </div>
                  ))}
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between">
                      <span>المجموع الفرعي:</span>
                      <span>{totals.subtotal.toFixed(2)} ج.م</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>الخصم:</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={discount}
                          onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                          className="w-20 h-8"
                        />
                        <span>%</span>
                      </div>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>مبلغ الخصم:</span>
                        <span>-{totals.discountAmount.toFixed(2)} ج.م</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>الضريبة (15%):</span>
                      <span>{totals.tax.toFixed(2)} ج.م</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>الإجمالي:</span>
                      <span className="text-primary">{totals.total.toFixed(2)} ج.م</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* طريقة الدفع */}
              <div className="space-y-2">
                <Label>طريقة الدفع *</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="نقد">نقد</SelectItem>
                    <SelectItem value="فيزا">فيزا</SelectItem>
                    <SelectItem value="ماستركارد">ماستركارد</SelectItem>
                    <SelectItem value="محفظة إلكترونية">محفظة إلكترونية</SelectItem>
                    <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* مبلغ الدفع */}
              <div className="space-y-2">
                <Label>مبلغ الدفع</Label>
                <Input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder={totals.total.toFixed(2)}
                />
                <p className="text-xs text-muted-foreground">
                  اتركه فارغاً لاستخدام الإجمالي الكامل: {totals.total.toFixed(2)} ج.م
                </p>
              </div>
                </>
              )}
        </TabsContent>

        {/* تبويب التأكيد */}
        <TabsContent value="summary" className="mt-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">السلة فارغة</p>
              <Button onClick={() => setQuickSaleTab('items')} className="mt-4">
                إضافة عناصر
            </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>مراجعة الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">الفرع:</Label>
                    <p className="text-sm">{branches.find((b: any) => b.id === selectedBranchId)?.arabicName || branches.find((b: any) => b.id === selectedBranchId)?.englishName || 'غير محدد'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">العناصر:</Label>
                    <div className="mt-2 space-y-2">
                      {cartItems.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span>{item.total.toFixed(2)} ج.م</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>المجموع الفرعي:</span>
                      <span>{totals.subtotal.toFixed(2)} ج.م</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>الخصم ({discount}%):</span>
                        <span>-{totals.discountAmount.toFixed(2)} ج.م</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>الضريبة (15%):</span>
                      <span>{totals.tax.toFixed(2)} ج.م</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl border-t pt-2">
                      <span>الإجمالي:</span>
                      <span className="text-primary">{totals.total.toFixed(2)} ج.م</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">طريقة الدفع:</Label>
                    <p className="text-sm">{paymentMethod}</p>
                  </div>
                </CardContent>
              </Card>

            <Button 
                onClick={handleQuickSaleSubmit}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
            >
                <CheckCircle className="h-5 w-5 ml-2" />
                تأكيد البيع
            </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[95vw] max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                بيع سريع
              </DialogTitle>
              <DialogDescription>
                للعملاء المسجلين - إجراءات مبسطة
              </DialogDescription>
        </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                console.log("Close button clicked");
                onOpenChange(false);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </Button>
          </div>
        </DialogHeader>

        {/* محتوى البيع السريع مباشرة */}
        {renderQuickSaleContent()}
      </DialogContent>
    </Dialog>
    
    {/* نافذة الايصال */}
    <InvoiceDialog
      open={showInvoice}
      onOpenChange={(open) => {
        setShowInvoice(open);
        if (!open) {
          setInvoiceData(null);
        }
      }}
      invoiceData={invoiceData}
    />
    </>
  );
}