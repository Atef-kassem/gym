import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvoiceDialog } from "@/components/Reception/InvoiceDialog";
import { ShiftSelectionDialog } from "@/components/Reception/ShiftSelectionDialog";
import { useGetAllBranchesQuery } from "@/services/branchesApi";
import { useGetAllServicesQuery } from "@/services/serviceApi";
import { useGetAllProductsQuery } from "@/services/productApi";
import { useGetAllConsumablesQuery } from "@/services/consumableApi";
import { useGetAllCategoriesQuery } from "@/services/categoriesApi";
import { useCreateQuickSaleMutation } from "@/services/quickSaleApi";
import { useShift } from "@/contexts/ShiftContext";
import { useToast } from "@/hooks/use-toast";
import { getImageUrl } from "@/utils/imageHelpers";
import { 
  ShoppingCart,
  Package,
  DollarSign,
  Search,
  Plus, 
  Minus,
  Trash2,
  CheckCircle,
  Zap, 
  Clock, 
  X,
  Percent,
  CreditCard,
  Grid3x3
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function CreateBooking() {
  const { toast } = useToast();
  const { selectedShift } = useShift();
  const [createQuickSaleMutation] = useCreateQuickSaleMutation();
  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false);
  
  // حالات البيع السريع
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [quickSaleServiceType, setQuickSaleServiceType] = useState<'product' | 'service'>('product');
  const [quickSaleSearchTerm, setQuickSaleSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('نقد');
  const [discount, setDiscount] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // عرض نافذة اختيار الوردية عند فتح الصفحة إذا لم تكن محددة
  useEffect(() => {
    if (!selectedShift) {
      setIsShiftDialogOpen(true);
    }
  }, [selectedShift]);

  // جلب البيانات من API
  const { data: branchesData, isLoading: branchesLoading } = useGetAllBranchesQuery(undefined as any);
  const { data: allServicesData } = useGetAllServicesQuery(undefined);
  const { data: productsData, isLoading: productsLoading } = useGetAllProductsQuery(undefined);
  const { data: consumablesData, isLoading: consumablesLoading } = useGetAllConsumablesQuery(undefined);
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery({ isActive: true });

  // جلب الفروع من API
  const branches: any[] = Array.isArray(branchesData?.data) ? [...branchesData.data] : [];

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

  // استخراج الفئات
  const categories = useMemo(() => {
    const cats = normalize(categoriesData, "categories");
    return cats.filter((cat: any) => cat.isActive !== false);
  }, [categoriesData]);

  // استخراج بيانات البيع السريع
  const allServicesArr = normalize(allServicesData, "services");
  const allProductsArr = Array.isArray(productsData?.data) ? productsData.data : Array.isArray(productsData?.data?.products) ? productsData.data.products : [];
  const allConsumablesArr = Array.isArray(consumablesData?.data) ? consumablesData.data : [];
  const allQuickSaleProducts = [...allProductsArr, ...allConsumablesArr];

  // فلترة العناصر للبيع السريع
  const filteredQuickSaleItems = useMemo(() => {
    let items = quickSaleServiceType === 'service' ? allServicesArr : allQuickSaleProducts;
    
    // فلترة حسب الفئة
    if (selectedCategoryId) {
      items = items.filter((item: any) => {
        const itemCategoryId = item.categoryId || item.category_id || item.category?.id;
        return itemCategoryId === selectedCategoryId || itemCategoryId === parseInt(selectedCategoryId);
      });
    }
    
    // فلترة حسب البحث
    if (quickSaleSearchTerm) {
      const searchLower = quickSaleSearchTerm.toLowerCase();
      items = items.filter((item: any) => {
        const itemName = item.arabicName || item.englishName || item.name_ar || item.nameAr || item.name || '';
        const itemCode = item.serviceCode || item.product_id || item.code || '';
        return itemName.toLowerCase().includes(searchLower) || itemCode.toLowerCase().includes(searchLower);
      });
    }
    
    return items;
  }, [quickSaleServiceType, quickSaleSearchTerm, selectedCategoryId, allServicesArr, allQuickSaleProducts]);

  // دالة resolveItemImage
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

  // إضافة عنصر للسلة
  const handleAddToCart = (item: any) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === (item.id || item.product_id));
    
    if (existingItem) {
      // إذا كان العنصر موجوداً، زيادة الكمية
      handleUpdateQuantity(
        cartItems.findIndex(cartItem => cartItem.id === (item.id || item.product_id)),
        existingItem.quantity + 1
      );
    } else {
      // إضافة عنصر جديد
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
    }
    
    toast({
      title: "تمت الإضافة",
      description: `تم إضافة ${item.arabicName || item.englishName || item.name} إلى السلة`,
      duration: 1500,
    });
  };

  // حذف عنصر من السلة
  const handleRemoveFromCart = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
    toast({
      title: "تم الحذف",
      description: "تم حذف العنصر من السلة",
      duration: 1500,
    });
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

  // حساب الإجماليات
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = (subtotal * discount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxRate = 0.15; // 15% VAT
    const tax = afterDiscount * taxRate;
    const total = afterDiscount + tax;
    
    return { subtotal, discountAmount, afterDiscount, tax, total };
  };

  const totals = calculateTotals();

  // تحويل طريقة الدفع من العربية إلى الإنجليزية (ENUM)
  const getPaymentMethodEnum = (arabicMethod: string): string => {
    const paymentMethodMap: Record<string, string> = {
      'نقد': 'cash',
      'فيزا': 'card',
      'ماستركارد': 'card',
      'محفظة إلكترونية': 'wallet',
      'تحويل بنكي': 'transfer'
    };
    return paymentMethodMap[arabicMethod] || 'cash';
  };

  // إتمام البيع
  const handleCompleteSale = async () => {
    if (!selectedShift) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار الوردية أولاً",
        variant: "destructive"
      });
      setIsShiftDialogOpen(true);
      return;
    }

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
    
    try {
      // تحويل طريقة الدفع إلى القيمة الإنجليزية
      const paymentMethodEnum = getPaymentMethodEnum(paymentMethod);
      
      const quickSaleData = {
        branchId: selectedBranchId,
        shiftId: selectedShift?.id || null,
        customerId: null,
        customerName: 'عميل نقدي',
        customerPhone: '',
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
        discountAmount: totals.discountAmount,
        discountPercentage: discount,
        taxAmount: totals.tax,
        taxPercentage: 15,
        totalAmount: totals.total,
        paymentMethod: paymentMethodEnum,
        paymentAmount: totals.total
      };
      
      const result = await createQuickSaleMutation(quickSaleData).unwrap();
      
      // إعداد بيانات الايصال
      const selectedBranch = branches.find((b: any) => b.id === selectedBranchId);
      const invoice = {
        invoiceNumber: result?.data?.id?.toString() || `QS-${Date.now()}`,
        invoiceDate: new Date(),
        type: 'quick-sale',
        customerName: 'عميل نقدي',
        customerPhone: '',
        customerEmail: '',
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
      setDiscount(0);
      setShowPaymentModal(false);
      
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

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 py-2">
            <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">نقطة البيع</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">نظام البيع السريع</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* اختيار الفرع */}
            <div className="w-48">
              {branchesLoading ? (
                <div className="flex items-center justify-center p-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                  <SelectTrigger className="h-10">
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
              )}
              </div>
              
            {/* عرض الوردية */}
              {selectedShift && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div 
                  className="w-6 h-6 rounded flex items-center justify-center"
                    style={{ backgroundColor: selectedShift.color || '#3b82f6' }}
                  >
                  <Clock className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-right">
                  <p className="text-xs font-medium text-gray-900 dark:text-white">{selectedShift.shiftName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedShift.startTime} - {selectedShift.endTime}
                    </p>
                  </div>
                  <Button
                  variant="ghost"
                    size="sm"
                    onClick={() => setIsShiftDialogOpen(true)}
                  className="h-6 w-6 p-0"
                  >
                  <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
        </div>
      </div>

      {/* Main Content - Side by Side Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Products/Services (70%) */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200 dark:border-gray-700">
          {/* Search and Filter Bar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder={`ابحث عن ${quickSaleServiceType === 'product' ? 'منتج' : 'خدمة'}...`}
                  value={quickSaleSearchTerm}
                  onChange={(e) => setQuickSaleSearchTerm(e.target.value)}
                  className="pr-10 h-11 text-base"
                />
              </div>
              
              {/* Type Toggle */}
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <Button
                  variant={quickSaleServiceType === 'service' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setQuickSaleServiceType('service');
                    setQuickSaleSearchTerm('');
                    setSelectedCategoryId(null);
                  }}
                  className="h-9 px-3 text-sm"
                >
                  <Zap className="h-3.5 w-3.5 ml-1.5" />
                  خدمات ({allServicesArr.length})
                </Button>
                <Button
                  variant={quickSaleServiceType === 'product' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setQuickSaleServiceType('product');
                    setQuickSaleSearchTerm('');
                    setSelectedCategoryId(null);
                  }}
                  className="h-9 px-3 text-sm"
                >
                  <Package className="h-3.5 w-3.5 ml-1.5" />
                  منتجات ({allQuickSaleProducts.length})
                </Button>
              </div>
            </div>
            
            {/* Categories Filter */}
            {categories.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <Grid3x3 className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">الفئات:</span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-hide">
                  <Button
                    variant={selectedCategoryId === null ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategoryId(null)}
                    className="h-7 px-2.5 text-xs whitespace-nowrap flex-shrink-0"
                  >
                    الكل
                  </Button>
                  {categories.map((category: any) => (
                    <Button
                      key={category.id || category.category_id}
                      variant={selectedCategoryId === String(category.id || category.category_id) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategoryId(String(category.id || category.category_id))}
                      className="h-7 px-2.5 text-xs whitespace-nowrap flex-shrink-0"
                    >
                      {category.arabicName || category.englishName || category.name_ar || category.name_en || category.name || 'فئة'}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {productsLoading || consumablesLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-500">جاري تحميل البيانات...</p>
                </div>
              </div>
            ) : filteredQuickSaleItems.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {quickSaleSearchTerm ? 'لا توجد نتائج للبحث' : `لا توجد ${quickSaleServiceType === 'product' ? 'منتجات' : 'خدمات'} متاحة`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                {filteredQuickSaleItems.map((item: any) => {
                  const itemImage = resolveItemImage(item, quickSaleServiceType);
                  const itemName = item.arabicName || item.englishName || item.name_ar || item.nameAr || item.name || 'عنصر';
                  const itemDescription = item.description || item.desc || item.details || '';
                  const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price || item.selling_price || item.unitCost || 0);
                  const cartItem = cartItems.find(ci => ci.id === (item.id || item.product_id));
                  
                  return (
                    <Card 
                      key={item.id || item.product_id} 
                      className="cursor-pointer hover:shadow-xl transition-all duration-200 border-2 hover:border-primary/50 group overflow-hidden"
                      onClick={() => handleAddToCart(item)}
                    >
                      <CardContent className="p-0">
                        {/* Image */}
                        <div className="relative w-full h-36 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                          {itemImage ? (
                            <img 
                              src={itemImage} 
                              alt={itemName} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.onerror = null;
                                target.src = "";
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              {quickSaleServiceType === 'product' ? (
                                <Package className="w-16 h-16 text-gray-300" />
                              ) : (
                                <Zap className="w-16 h-16 text-gray-300" />
                              )}
                            </div>
                          )}
                          
                          {/* Quantity Badge */}
                          {cartItem && cartItem.quantity > 0 && (
                            <div className="absolute top-2 left-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg">
                              {cartItem.quantity}
                            </div>
                          )}
                </div>
                
                        {/* Info */}
                        <div className="p-2.5">
                          <h4 className="font-semibold text-sm line-clamp-2 mb-1 min-h-[2rem] text-gray-900 dark:text-white leading-tight">
                            {itemName}
                          </h4>
                          {itemDescription && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-1.5 min-h-[2rem] leading-relaxed">
                              {itemDescription}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-base font-bold text-primary">
                              {itemPrice.toFixed(2)} ج.م
                            </span>
                            <Button 
                              size="sm" 
                              className="h-7 w-7 p-0 bg-primary hover:bg-primary/90"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(item);
                              }}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
              </CardContent>
            </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Cart (30%) */}
        <div className="w-full md:w-0 lg:w-[350px] flex flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          {/* Cart Header */}
          <div className="bg-primary text-white px-3 py-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShoppingCart className="h-3.5 w-3.5" />
                <h2 className="text-sm font-bold">السلة</h2>
                {cartItems.length > 0 && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-[10px] px-1 py-0">
                    {cartItems.length}
                  </Badge>
                )}
              </div>
              {cartItems.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCartItems([]);
                    setDiscount(0);
                  }}
                  className="text-white hover:bg-white/20 h-6 w-6 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
              
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-1 space-y-1">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <ShoppingCart className="h-10 w-10 text-gray-300 mb-1.5" />
                <p className="text-gray-500 text-xs mb-0.5">السلة فارغة</p>
                <p className="text-[10px] text-gray-400">اختر المنتجات من القائمة</p>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <Card key={index} className="border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-1">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[11px] mb-0 truncate text-gray-900 dark:text-white leading-tight">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">
                            {item.price.toFixed(2)} ج.م
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                            className="h-4 w-4 p-0"
                          >
                            <Minus className="h-2 w-2" />
                          </Button>
                          <span className="w-4 text-center font-semibold text-[10px]">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                            className="h-4 w-4 p-0"
                          >
                            <Plus className="h-2 w-2" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-0">
                        <p className="font-bold text-primary text-[11px]">
                          {item.total.toFixed(2)} ج.م
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFromCart(index)}
                          className="h-4 w-4 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 mt-0.5"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Cart Footer - Summary */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-1.5 space-y-1">
              {/* Discount */}
              <div className="flex items-center gap-1">
                <Label className="text-[11px] flex items-center gap-0.5 flex-1">
                  <Percent className="h-2.5 w-2.5" />
                  خصم (%)
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-14 h-6 text-center text-[10px]"
                />
              </div>

              <Separator className="my-0.5" />

              {/* Totals */}
              <div className="space-y-0 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-[11px]">المجموع الفرعي:</span>
                  <span className="font-medium text-[11px]">{totals.subtotal.toFixed(2)} ج.م</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 mt-0.5">
                    <span className="text-[11px]">الخصم ({discount}%):</span>
                    <span className="font-medium text-[11px]">-{totals.discountAmount.toFixed(2)} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between mt-0.5">
                  <span className="text-gray-600 dark:text-gray-400 text-[11px]">الضريبة (15%):</span>
                  <span className="font-medium text-[11px]">{totals.tax.toFixed(2)} ج.م</span>
                </div>
                <Separator className="my-0.5" />
                <div className="flex justify-between text-xs font-bold mt-0.5">
                  <span>الإجمالي:</span>
                  <span className="text-primary">{totals.total.toFixed(2)} ج.م</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-0">
                <Label className="text-[11px]">طريقة الدفع</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-7 text-[11px]">
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

              {/* Checkout Button */}
              <Button
                onClick={handleCompleteSale}
                className="w-full bg-green-600 hover:bg-green-700 h-8 text-xs font-semibold mt-1"
                size="lg"
              >
                <CreditCard className="h-3 w-3 ml-1" />
                إتمام البيع ({totals.total.toFixed(2)} ج.م)
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Dialog */}
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

      {/* Shift Selection Dialog */}
      <ShiftSelectionDialog
        open={isShiftDialogOpen}
        onOpenChange={setIsShiftDialogOpen}
        branchId={undefined}
      />
    </div>
  );
}