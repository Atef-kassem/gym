import React, { useState, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Plus,
  Trash2,
  Package,
  ShoppingCart,
  DollarSign,
  Receipt,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Percent,
  Car,
  Clock,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { useGetAllBranchesQuery } from '@/services/branchesApi';
import { useGetActiveServicesQuery, useGetAllServicesQuery } from '@/services/serviceApi';
import { useGetAllProductsQuery } from '@/services/productApi';
import { useGetAllConsumablesQuery } from '@/services/consumableApi';
import { useCreateQuickSaleMutation } from '@/services/quickSaleApi';
import { InvoiceDialog } from './InvoiceDialog';
import { useShift } from '@/contexts/ShiftContext';
import { getImageUrl } from '@/utils/imageHelpers';

interface QuickSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CartItem {
  id: string;
  type: 'product' | 'service';
  code: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
}

export const QuickSaleDialog: React.FC<QuickSaleDialogProps> = ({ open, onOpenChange }) => {
  const [currentTab, setCurrentTab] = useState('items');
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [serviceType, setServiceType] = useState<'product' | 'service'>('product');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('نقد');
  
  // حالة الايصال
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  
  // جلب الوردية المختارة
  const { selectedShift } = useShift();

  // جلب بيانات الفروع
  const { data: branchesData } = useGetAllBranchesQuery({});
  const branches = Array.isArray(branchesData?.data) 
    ? branchesData.data 
    : branchesData?.data?.branches || branchesData?.branches || [];

  // جلب البيانات من جميع المصادر
  const { data: servicesData, isLoading: isServicesLoading } = useGetAllServicesQuery(undefined);
  const { data: activeServicesData } = useGetActiveServicesQuery(undefined);
  const { data: productsData, isLoading: isProductsLoading } = useGetAllProductsQuery(undefined);
  const { data: consumablesData, isLoading: isConsumablesLoading } = useGetAllConsumablesQuery(undefined);

  // Normalize helper (نفس الطريقة المستخدمة في Items.tsx)
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

  // استخراج البيانات
  let servicesArr = normalize(servicesData, "services");
  if (!servicesArr.length) {
    servicesArr = normalize(activeServicesData, "services");
  }
  const productsArr = normalize(productsData, "products");
  const consumablesArr = normalize(consumablesData, "data");

  // Debug: Log data
  console.log("🔍 QuickSale - Data loaded:", {
    services: servicesArr.length,
    products: productsArr.length,
    consumables: consumablesArr.length
  });

  // Mutation لإنشاء البيع السريع
  const [createQuickSale, { isLoading: isCreating }] = useCreateQuickSaleMutation();

  // دمج جميع العناصر القابلة للبيع
  const allProducts = [...productsArr, ...consumablesArr];
  const allServices = servicesArr;
  
  const resolveItemImage = useCallback((item: any, type: "product" | "service") => {
    const extractCandidate = (source: any): string | undefined => {
      if (!source) return undefined;
      if (typeof source === "string") return source;
      if (typeof source === "object") {
        if (typeof source.url === "string") return source.url;
        if (typeof source.path === "string") return source.path;
      }
      return undefined;
    };

    const sharedCandidates = [
      extractCandidate(item.image),
      extractCandidate(item.imageUrl),
      extractCandidate(item.image_url),
      extractCandidate(item.img_url),
      extractCandidate(item.picture),
      extractCandidate(item.thumbnail),
      extractCandidate(item.previewImage),
      extractCandidate(item.coverImage),
      extractCandidate(item.icon),
    ];

    const specificCandidates =
      type === "product"
        ? [
            extractCandidate(item.productImage),
            extractCandidate(item.mainImage),
            extractCandidate(item.featuredImage),
            extractCandidate(item.attachmentImage),
            extractCandidate(item.product_image),
          ]
        : [
            extractCandidate(item.serviceImage),
            extractCandidate(item.logo),
            extractCandidate(item.bannerImage),
          ];

    for (const candidate of [...sharedCandidates, ...specificCandidates]) {
      if (candidate) {
        const normalized = getImageUrl(candidate);
        if (normalized) {
          return normalized;
        }
      }
    }

    return null;
  }, []);

  const isLoading = isServicesLoading || isProductsLoading || isConsumablesLoading;
  
  console.log("🔍 QuickSale - Final counts:", {
    allProducts: allProducts.length,
    allServices: allServices.length,
    isLoading
  });

  // Filter items based on search - جميع المنتجات والخدمات متاحة بغض النظر عن الفرع
  const filteredItems = useMemo(() => {
    // اختيار المصدر بناءً على نوع العنصر
    const items = serviceType === 'product' ? allProducts : allServices;
    
    console.log("🔍 QuickSale - Filtering items:", {
      serviceType,
      searchTerm,
      totalItems: items.length,
      sampleItems: items.slice(0, 3)
    });
    
    if (!searchTerm) return items;
    
    const filtered = items.filter((item: any) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.arabicName?.toLowerCase().includes(searchLower) ||
        item.englishName?.toLowerCase().includes(searchLower) ||
        item.serviceName?.toLowerCase().includes(searchLower) ||
        item.serviceCode?.toLowerCase().includes(searchLower) ||
        item.name_ar?.toLowerCase().includes(searchLower) ||
        item.name_en?.toLowerCase().includes(searchLower) ||
        item.nameAr?.toLowerCase().includes(searchLower) ||
        item.nameEn?.toLowerCase().includes(searchLower) ||
        item.code?.toLowerCase().includes(searchLower) ||
        item.product_id?.toLowerCase().includes(searchLower)
      );
    });
    
    console.log("🔍 QuickSale - Filtered items:", filtered.length);
    return filtered;
  }, [serviceType, searchTerm, allProducts, allServices]);

  // Add item to cart - يدعم بيانات من API (نفس طريقة Items.tsx)
  const addToCart = (item: any) => {
    const existingItem = cartItems.find(ci => ci.id === item.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(ci =>
        ci.id === item.id
          ? { ...ci, quantity: ci.quantity + 1, total: (ci.quantity + 1) * ci.price * (1 - ci.discount / 100) }
          : ci
      ));
      toast.success('تم زيادة الكمية');
    } else {
      // استخراج البيانات من الخدمة/المنتج (دعم جميع التنسيقات)
      const itemName = item.name_ar || item.arabicName || item.serviceName || item.nameAr || item.name || 'عنصر غير معروف';
      const itemCode = item.serviceCode || item.product_id || item.code || item.id?.toString() || 'N/A';
      const itemPrice = parseFloat(
        item.price || 
        item.servicePrice || 
        item.selling_price || 
        item.unitCost || 
        0
      );
      
      const newItem: CartItem = {
        id: (item.id || item.product_id || Math.random()).toString(),
        type: serviceType,
        code: itemCode,
        name: itemName,
        price: itemPrice,
        quantity: 1,
        discount: 0,
        total: itemPrice
      };
      setCartItems([...cartItems, newItem]);
      toast.success('تمت إضافة العنصر إلى السلة');
    }
    
    setSearchTerm('');
  };

  // Update cart item
  const updateCartItem = (id: string, field: 'quantity' | 'discount', value: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        updatedItem.total = updatedItem.quantity * updatedItem.price * (1 - updatedItem.discount / 100);
        return updatedItem;
      }
      return item;
    }));
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success('تم إزالة العنصر');
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const totalDiscount = cartItems.reduce((sum, item) => sum + (item.quantity * item.price * item.discount / 100), 0);
  const taxRate = 0.15; // 15% VAT
  const taxAmount = (subtotal - totalDiscount) * taxRate;
  const grandTotal = subtotal - totalDiscount + taxAmount;
  
  const paidAmount = parseFloat(paymentAmount) || 0;
  const remainingAmount = grandTotal - paidAmount;

  // Handle submit
  const handleSubmit = async () => {
    if (cartItems.length === 0) {
      toast.error('يرجى إضافة منتجات أو خدمات');
      return;
    }
    if (!selectedBranchId) {
      toast.error('يرجى اختيار الفرع');
      return;
    }

    try {
      // تحضير بيانات البيع
      const saleData = {
        branchId: parseInt(selectedBranchId),
        shiftId: selectedShift?.id || null, // إضافة معرف الوردية
        items: cartItems.map(item => ({
          id: item.id,
          type: item.type,
          code: item.code,
          name: item.name,
          price: parseFloat(item.price.toString()),
          quantity: item.quantity,
          discount: item.discount,
          total: parseFloat(item.total.toString())
        })),
        subtotal: parseFloat(subtotal.toFixed(2)),
        discountAmount: parseFloat(totalDiscount.toFixed(2)),
        discountPercentage: cartItems.length > 0 
          ? (totalDiscount / subtotal * 100)
          : 0,
        taxAmount: parseFloat(taxAmount.toFixed(2)),
        taxPercentage: 15,
        totalAmount: parseFloat(grandTotal.toFixed(2)),
        paymentMethod: paymentMethod === 'نقد' ? 'cash' 
          : paymentMethod === 'بطاقة ائتمان' ? 'card'
          : paymentMethod === 'تحويل بنكي' ? 'transfer'
          : paymentMethod === 'محفظة إلكترونية' ? 'wallet'
          : 'cash'
      };

      const result = await createQuickSale(saleData).unwrap();
      
      toast.success('تم إنشاء البيع بنجاح! 🎉');
      
      // إعداد بيانات الايصال
      const selectedBranch = branches.find((b: any) => b.id.toString() === selectedBranchId);
      const invoice = {
        invoiceNumber: result?.data?.id?.toString() || `SALE-${Date.now()}`,
        invoiceDate: new Date(),
        type: 'sale' as const,
        customerName: 'عميل مباشر',
        customerPhone: '---',
        customerEmail: '',
        branchName: selectedBranch?.arabicName || selectedBranch?.englishName || 'الفرع الرئيسي',
        branchAddress: selectedBranch?.address || '',
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          code: item.code,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          total: item.total,
          type: item.type
        })),
        subtotal: parseFloat(subtotal.toFixed(2)),
        discount: parseFloat(totalDiscount.toFixed(2)),
        tax: parseFloat(taxAmount.toFixed(2)),
        total: parseFloat(grandTotal.toFixed(2)),
        paymentMethod: paymentMethod,
        notes: ''
      };
      
      // إغلاق نافذة البيع وعرض الايصال
      onOpenChange(false);
      setInvoiceData(invoice);
      setShowInvoice(true);
      
      // Reset بعد 1 ثانية
      setTimeout(() => {
        setCartItems([]);
        setPaymentAmount('');
        setCurrentTab('items');
        setSelectedBranchId('');
      }, 1000);
    } catch (error: any) {
      console.error('Error creating quick sale:', error);
      toast.error(error?.data?.message || 'حدث خطأ أثناء إنشاء البيع');
    }
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            بيع سريع
          </DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
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
              التحليل والتأكيد
            </TabsTrigger>
          </TabsList>

          {/* التاب الأول: المنتجات والخدمات */}
          <TabsContent value="items" className="mt-4">
            {/* اختيار الفرع ونوع الخدمة */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>نوع العنصر</Label>
                <Select value={serviceType} onValueChange={(value: any) => setServiceType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        خدمات ({allServices.length})
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
                <Label>الفرع * (لتسجيل مكان البيع)</Label>
                <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفرع" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch: any) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.arabicName || branch.englishName || branch.branchName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* التخطيط الرئيسي: المنتجات والسلة جنباً إلى جنب */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* السلة على اليسار */}
              <div className="lg:col-span-4 order-2 lg:order-1">
                <Card className="sticky top-4 h-fit">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        السلة ({cartItems.length})
                      </CardTitle>
                      {cartItems.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => setCartItems([])}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {cartItems.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">السلة فارغة</p>
                        <p className="text-xs mt-1">اضغط على المنتجات لإضافتها</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="max-h-[400px] overflow-y-auto space-y-2">
                          {cartItems.map((item) => (
                            <Card key={item.id} className="p-3 bg-muted/30">
                              <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-sm line-clamp-1">{item.name}</div>
                                    <div className="text-xs text-muted-foreground">{item.code}</div>
                                    <Badge variant="outline" className="text-xs mt-1">
                                      {item.type === 'product' ? 'منتج' : 'خدمة'}
                                    </Badge>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFromCart(item.id)}
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label className="text-xs">الكمية</Label>
                                    <Input
                                      type="number"
                                      min="1"
                                      value={item.quantity}
                                      onChange={(e) => updateCartItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                      className="h-8 text-sm"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">خصم %</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={item.discount}
                                      onChange={(e) => updateCartItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                                      className="h-8 text-sm"
                                    />
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center pt-2 border-t">
                                  <span className="text-xs text-muted-foreground">السعر:</span>
                                  <span className="font-bold text-green-600">{item.total.toFixed(2)} جنيه</span>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>

                        {/* إحصائيات السلة */}
                        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>المجموع الفرعي:</span>
                                <span className="font-medium">{subtotal.toFixed(2)} جنيه</span>
                              </div>
                              <div className="flex justify-between text-sm text-red-600">
                                <span>الخصم الكلي:</span>
                                <span className="font-medium">-{totalDiscount.toFixed(2)} جنيه</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>الضريبة (15%):</span>
                                <span className="font-medium">{taxAmount.toFixed(2)} جنيه</span>
                              </div>
                              <div className="flex justify-between text-lg font-bold border-t pt-2">
                                <span>الإجمالي:</span>
                                <span className="text-green-600">{grandTotal.toFixed(2)} جنيه</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* المنتجات على اليمين */}
              <div className="lg:col-span-8 order-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>البحث وإضافة {serviceType === 'product' ? 'منتجات' : 'خدمات'}</span>
                  <Badge variant="secondary" className="text-xs">
                    {filteredItems.length} عنصر متاح
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  جميع المنتجات والخدمات متاحة - الفرع يُستخدم فقط لتسجيل مكان البيع
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={`ابحث عن ${serviceType === 'product' ? 'منتج' : 'خدمة'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-2">جاري تحميل البيانات...</p>
                  </div>
                ) : filteredItems.length > 0 ? (
                  <>
                    <div className="text-sm text-muted-foreground mb-4">
                      اضغط على أي عنصر لإضافته إلى السلة ({filteredItems.length} عنصر متاح)
                    </div>
                    <div className="max-h-[500px] overflow-y-auto">
                      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredItems.slice(0, 100).map((item: any) => {
                        // دعم جميع تنسيقات الحقول من API
                        const itemName = item.name_ar || item.arabicName || item.serviceName || item.nameAr || item.name || 'عنصر';
                        const itemCode = item.serviceCode || item.product_id || item.code || item.id || 'N/A';
                        const itemPrice = parseFloat(
                          item.price || 
                          item.servicePrice || 
                          item.selling_price || 
                          item.unitCost || 
                          0
                        );
                        const itemDuration = item.duration || item.estimatedDuration || '-';
                        const itemCategory = item.category?.name_ar || item.category?.arabicName || item.categoryName || '';
                        const itemUnit = item.unit_of_measure || item.unit || item.unitId || '';
                        const itemImage = resolveItemImage(item, serviceType) || null;
                        
                        return (
                            <Card
                            key={item.id || item.product_id || Math.random()}
                              className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary overflow-hidden"
                            onClick={() => addToCart(item)}
                          >
                              <CardContent className="p-0">
                                {/* صورة المنتج/الخدمة */}
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
                                      {serviceType === 'product' ? (
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
                                </div>
                                
                                {/* معلومات المنتج/الخدمة */}
                                <div className="p-3 space-y-2">
                                  <div className="min-h-[2.5rem]">
                                    <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                      {itemName}
                                    </h4>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground font-mono">
                                      {itemCode}
                                    </span>
                                {itemUnit && (
                                  <Badge variant="outline" className="text-xs">
                                    {itemUnit}
                                  </Badge>
                                )}
                              </div>
                                  
                                  <div className="pt-2 border-t">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-lg font-bold text-green-600">
                                          {itemPrice.toFixed(2)}
                            </div>
                                        <div className="text-xs text-muted-foreground">جنيه مصري</div>
                                      </div>
                              {serviceType === 'service' && itemDuration !== '-' && (
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                          <Clock className="w-3 h-3" />
                                          {itemDuration} د
                                        </div>
                              )}
                            </div>
                          </div>
                                  
                                  {/* زر الإضافة */}
                                  <Button 
                                    size="sm" 
                                    className="w-full mt-2 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all group-hover:bg-primary group-hover:text-white"
                                  >
                                    <Plus className="w-4 h-4 ml-1" />
                                    إضافة
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                        );
                      })}
                      </div>
                      {filteredItems.length > 100 && (
                        <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30 rounded-lg mt-4">
                          يوجد {filteredItems.length - 100} عنصر إضافي - استخدم البحث للتصفية
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Package className="h-16 w-16 mx-auto mb-3 opacity-30" />
                    <p className="text-base font-medium mb-1">
                      {searchTerm ? 'لا توجد نتائج للبحث' : `لا توجد ${serviceType === 'product' ? 'منتجات' : 'خدمات'} متاحة`}
                    </p>
                    <p className="text-sm">
                      {searchTerm ? 'جرب كلمات بحث أخرى' : `يرجى إضافة ${serviceType === 'product' ? 'منتجات' : 'خدمات'} في النظام أولاً`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
                </div>
                  </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                إلغاء
              </Button>
              <Button
                onClick={() => {
                  if (cartItems.length === 0) {
                    toast.error('يرجى إضافة منتجات أو خدمات إلى السلة');
                    return;
                  }
                  setCurrentTab('payment');
                }}
                disabled={cartItems.length === 0}
              >
                التالي: الدفع
              </Button>
            </div>
          </TabsContent>

          {/* التاب الثاني: الدفع */}
          <TabsContent value="payment" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>تفاصيل الدفع</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* ملخص المبالغ */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">المبلغ الإجمالي:</span>
                      <span className="text-2xl font-bold text-blue-600">{grandTotal.toFixed(2)} جنيه</span>
                    </div>
                  </div>
                </div>

                {/* طريقة الدفع */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>طريقة الدفع</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="نقد">نقد</SelectItem>
                        <SelectItem value="بطاقة ائتمان">بطاقة ائتمان</SelectItem>
                        <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                        <SelectItem value="محفظة إلكترونية">محفظة إلكترونية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>المبلغ المدفوع</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* تفاصيل الدفع */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="text-sm text-gray-600 mb-1">المدفوع</div>
                      <div className="text-xl font-bold text-green-600">{paidAmount.toFixed(2)} جنيه</div>
                    </CardContent>
                  </Card>

                  <Card className={remainingAmount > 0 ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}>
                    <CardContent className="p-4 text-center">
                      <AlertCircle className={`h-8 w-8 mx-auto mb-2 ${remainingAmount > 0 ? 'text-red-600' : 'text-blue-600'}`} />
                      <div className="text-sm text-gray-600 mb-1">المتبقي</div>
                      <div className={`text-xl font-bold ${remainingAmount > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                        {remainingAmount.toFixed(2)} جنيه
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4 text-center">
                      <Percent className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                      <div className="text-sm text-gray-600 mb-1">الخصم الكلي</div>
                      <div className="text-xl font-bold text-yellow-600">{totalDiscount.toFixed(2)} جنيه</div>
                    </CardContent>
                  </Card>
                </div>

                {remainingAmount > 0 && (
                  <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm text-yellow-700">يوجد مبلغ متبقي لم يتم دفعه</span>
                  </div>
                )}

                {paidAmount > grandTotal && (
                  <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium text-blue-700">المبلغ المرتجع</div>
                      <div className="text-lg font-bold text-blue-600">{(paidAmount - grandTotal).toFixed(2)} جنيه</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setCurrentTab('items')}>
                السابق
              </Button>
              <Button onClick={() => setCurrentTab('summary')}>
                التالي: التحليل
              </Button>
            </div>
          </TabsContent>

          {/* التاب الثالث: التحليل والتأكيد */}
          <TabsContent value="summary" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  تحليل الايصال
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* معلومات أساسية */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600">الفرع</div>
                    <div className={`font-medium ${!selectedBranchId ? 'text-red-500' : ''}`}>
                      {selectedBranchId 
                        ? (branches.find((b: any) => b.id.toString() === selectedBranchId)?.arabicName || '-')
                        : 'لم يتم الاختيار ⚠️'
                      }
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">عدد العناصر</div>
                    <div className="font-medium">{cartItems.length}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">طريقة الدفع</div>
                    <div className="font-medium">{paymentMethod}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">حالة الدفع</div>
                    <Badge className={remainingAmount > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                      {remainingAmount > 0 ? 'جزئي' : 'مكتمل'}
                    </Badge>
                  </div>
                </div>

                {/* جدول العناصر */}
                <div>
                  <h4 className="font-semibold mb-3">تفاصيل العناصر</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>العنصر</TableHead>
                        <TableHead>الكمية</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>الخصم</TableHead>
                        <TableHead>الإجمالي</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-gray-500">{item.code}</div>
                            </div>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.price.toFixed(2)}</TableCell>
                          <TableCell>{item.discount}%</TableCell>
                          <TableCell className="font-bold">{item.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* التحليل المالي */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        تحليل المبيعات
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>عدد المنتجات:</span>
                          <span className="font-medium">{cartItems.filter(i => i.type === 'product').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>عدد الخدمات:</span>
                          <span className="font-medium">{cartItems.filter(i => i.type === 'service').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>إجمالي الكميات:</span>
                          <span className="font-medium">{cartItems.reduce((sum, i) => sum + i.quantity, 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>متوسط الخصم:</span>
                          <span className="font-medium">
                            {cartItems.length > 0 
                              ? (cartItems.reduce((sum, i) => sum + i.discount, 0) / cartItems.length).toFixed(1)
                              : 0}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        ملخص المدفوعات
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>المجموع الفرعي:</span>
                          <span className="font-medium">{subtotal.toFixed(2)} جنيه</span>
                        </div>
                        <div className="flex justify-between text-sm text-red-600">
                          <span>الخصم:</span>
                          <span className="font-medium">-{totalDiscount.toFixed(2)} جنيه</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>الضريبة:</span>
                          <span className="font-medium">+{taxAmount.toFixed(2)} جنيه</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2 text-green-600">
                          <span>الإجمالي:</span>
                          <span>{grandTotal.toFixed(2)} ریال</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* رسالة التأكيد */}
                {!selectedBranchId && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                    <div>
                      <div className="font-semibold text-red-800">يرجى اختيار الفرع</div>
                      <div className="text-sm text-red-600">الفرع مطلوب لتسجيل مكان البيع</div>
                    </div>
                  </div>
                )}
                
                {remainingAmount <= 0 && selectedBranchId ? (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="font-semibold text-green-800">جاهز للإتمام</div>
                      <div className="text-sm text-green-600">جميع المعلومات صحيحة والدفع مكتمل</div>
                    </div>
                  </div>
                ) : remainingAmount > 0 ? (
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-8 w-8 text-yellow-600" />
                    <div>
                      <div className="font-semibold text-yellow-800">تنبيه: دفع غير مكتمل</div>
                      <div className="text-sm text-yellow-600">المبلغ المتبقي: {remainingAmount.toFixed(2)} جنيه</div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setCurrentTab('payment')} disabled={isCreating}>
                السابق
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="bg-green-600 hover:bg-green-700"
                disabled={isCreating || !selectedBranchId}
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    إتمام البيع {!selectedBranchId && '(اختر الفرع)'}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
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
};
