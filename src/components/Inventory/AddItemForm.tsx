/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Clock,
  Barcode,
  FolderPlus,
  Camera,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
} from "@/services/categoriesApi";
import { useGetAllBranchesQuery } from "@/services/branchesApi";
import { useCreateServiceMutation, useUpdateServiceMutation } from "@/services/serviceApi";
import { useCreateProductMutation } from "@/services/productApi";
import { useGetAllManufacturersQuery } from "@/services/manufacturersApi";
import { useGetAllSuppliersQuery } from "@/services/suppliersApi";
import {
  useGetAllStoragesQuery,
} from "@/services/storageApi";
import { useGetAllProductsQuery } from "@/services/productApi";
import { useGetAllConsumablesQuery } from "@/services/consumableApi";

// Interfaces
interface Category {
  category_id: number;
  name_ar: string;
  name_en: string;
}
interface Branch {
  id: number;
  arabicName: string;
  englishName: string;
  code: string;
}
interface ConsumableItem {
  itemId: string;
  itemName: string;
  itemNameEn: string;
  quantity: number;
  unit: string;
  cost: number;
  currentStock: number;
  minStock: number;
  maxStock: number;
}

interface Item {
  code: string;
  name_ar: string;
  nameEn: string;
  type: "خدمة" | "منتج" | "مستهلكات";
  serviceType?: string;
  category: string;
  unit: string;
  price: number;
  minPrice?: number;
  discountType?: "بدون خصم" | "نسبة" | "قيمة";
  discountValue?: number;
  taxType?: "مع ضريبة قيمة مضافة" | "بدون ضريبة";
  taxRate?: number;
  duration?: number;
  status: "نشط" | "غير نشط";
  appliedBranches: string[];
  applyToAllBranches: boolean;
  description?: string;
  administrativeNotes?: string;
  priceAfterDiscount?: number;
  executionUnit?: string;
  targetCarType?: string;
  imageUrl?: string;
  consumables: ConsumableItem[];
}
interface AddItemFormProps {
  editingItem?: any;
  onSave: () => void;
  onCancel: () => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({
  editingItem,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Item>(editingItem ? {
    code: editingItem.code || editingItem.serviceCode || "",
    name_ar: editingItem.nameAr || editingItem.arabicName || "",
    nameEn: editingItem.nameEn || editingItem.englishName || "",
    type: "خدمة",
    serviceType: editingItem.serviceType || "",
    category: editingItem.category || editingItem.categoryId?.toString() || "",
    unit: editingItem.unit || "خدمة",
    price: editingItem.price || 0,
    minPrice: editingItem.minPrice || editingItem.minimumPrice || 0,
    discountType: editingItem.discountType || "نسبة",
    discountValue: editingItem.discountValue || 0,
    taxType: editingItem.taxType || "مع ضريبة قيمة مضافة",
    taxRate: editingItem.taxRate || 15,
    duration: editingItem.duration || 0,
    status: editingItem.status || "نشط",
    appliedBranches: editingItem.appliedBranches || [],
    applyToAllBranches: editingItem.applyToAllBranches || false,
    description: editingItem.description || "",
    administrativeNotes: editingItem.administrativeNotes || editingItem.adminNotes || "",
    priceAfterDiscount: editingItem.priceAfterDiscount || 0,
    executionUnit: editingItem.executionUnit || "per_car",
    targetCarType: editingItem.targetCarType || editingItem.targetVehicle || "all_types",
    imageUrl: editingItem.imageUrl || editingItem.image || "",
    consumables: editingItem.consumables || editingItem.consumableMaterials || [],
  } : {
    code: "",
    name_ar: "",
    nameEn: "",
    type: "خدمة",
    serviceType: "",
    category: "",
    unit: "خدمة",
    price: 0,
    minPrice: 0,
    discountType: "نسبة",
    discountValue: 0,
    taxType: "مع ضريبة قيمة مضافة",
    taxRate: 15,
    duration: 0,
    status: "نشط",
    appliedBranches: [],
    applyToAllBranches: false,
    description: "",
    administrativeNotes: "",
    priceAfterDiscount: 0,
    executionUnit: "per_car",
    targetCarType: "all_types",
    imageUrl: "",
    consumables: [],
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [error, setError] = useState<string | null>(null);
  const [selectedConsumable, setSelectedConsumable] = useState<string>("");
  const [consumableQuantity, setConsumableQuantity] = useState<number>(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(editingItem?.imageUrl || editingItem?.image || "");

  // RTK Query Hooks
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useGetAllCategoriesQuery(undefined);
  const [createCategory] = useCreateCategoryMutation();
  const {
    data: branchesData,
    isLoading: isLoadingBranches,
    error: branchesError,
  } = useGetAllBranchesQuery(undefined);
  const [createService, { isLoading: isCreatingService }] =
    useCreateServiceMutation();
  const [updateService, { isLoading: isUpdatingService }] =
    useUpdateServiceMutation();
  const { data: productsData, isLoading: isLoadingProducts } = useGetAllProductsQuery(undefined);
  const { data: consumablesData, isLoading: isLoadingConsumables } = useGetAllConsumablesQuery(undefined);

  // Helper to normalize API responses
  const normalizeData = useCallback((data: any, source: string): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "object") {
      if (data.data && Array.isArray(data.data)) return data.data;
      if (data[source] && Array.isArray(data[source])) return data[source];
      if (Array.isArray(data.results)) return data.results;
      if (Array.isArray(data.items)) return data.items;
    }
    return [];
  }, []);

  // Function to generate automatic service code
  const generateServiceCode = useCallback(() => {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SVC-${timestamp}-${randomSuffix}`;
  }, []);

  // Normalized data for dropdowns
  const categories = useMemo(
    () => normalizeData(categoriesData, "categories"),
    [categoriesData, normalizeData]
  );
  const branches = useMemo(
    () => normalizeData(branchesData, "branches"),
    [branchesData, normalizeData]
  );
  const products = useMemo(
    () => normalizeData(productsData, "products"),
    [productsData, normalizeData]
  );

  // Map API data to form options
  const categoryOptions = categories.map((cat: Category) => ({
    value: cat.category_id.toString(),
    label: cat.name_ar,
    nameEn: cat.name_en,
  }));
  const branchOptions = branches.map((branch: Branch) => ({
    value: branch.id.toString(),
    label: branch.arabicName,
  }));

  // جلب المواد المستهلكة من جدول Consumables
  const consumableProducts = useMemo(
    () => normalizeData(consumablesData, "data"),
    [consumablesData, normalizeData]
  );

  const consumableOptions = useMemo(() => {
    return consumableProducts.map((consumable: any) => {
      console.log("🔍 معالجة مادة مستهلكة:", consumable);
      
      return {
        value: consumable.id?.toString() || consumable.code?.toString() || `consumable-${Date.now()}-${Math.random()}`,
        label: consumable.nameAr || consumable.name_ar || "مادة بدون اسم",
        nameEn: consumable.nameEn || consumable.name_en || "No Name",
        unit: consumable.unitId?.toString() || "  ",
        cost: consumable.unitCost || 0,
        currentStock: consumable.currentStock || 0,
        minStock: consumable.minStock || 0,
        maxStock: consumable.maxStock || 0,
      };
    });
  }, [consumableProducts]);

  // Debug: طباعة البيانات المجلوبة
  console.log("🔍 المواد المستهلكة:", {
    consumablesData,
    consumableProducts: consumableProducts.length,
    sample: consumableProducts.slice(0, 3),
    consumableOptions: consumableOptions.length > 0 ? consumableOptions.slice(0, 3) : []
  });

  // Initialize appliedBranches when branchesData is loaded
  useEffect(() => {
    if (branches.length > 0 && formData.applyToAllBranches) {
      setFormData((prev) => ({
        ...prev,
        appliedBranches: branches.map((b: Branch) => b.id.toString()),
      }));
    }
  }, [branches, formData.applyToAllBranches]);

  // Generate automatic service code when component mounts
  useEffect(() => {
    if (formData.code === "") {
      setFormData((prev) => ({
        ...prev,
        code: generateServiceCode(),
      }));
    }
  }, [generateServiceCode, formData.code]);

  // Update form data
  const updateFormData = useCallback((field: keyof Item, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // إضافة مادة مستهلكة
  const addConsumable = useCallback(() => {
    if (!selectedConsumable || consumableQuantity <= 0) {
      toast.error("يرجى اختيار مادة مستهلكة وكمية صحيحة");
      return;
    }

    console.log("🔍 محاولة إضافة مادة مستهلكة:", {
      selectedConsumable,
      consumableOptions: consumableOptions.map(o => ({ value: o.value, label: o.label })),
      selectedProduct: consumableOptions.find(p => p.value === selectedConsumable)
    });

    const selectedProduct = consumableOptions.find(p => p.value === selectedConsumable);
    if (!selectedProduct) {
      toast.error("لم يتم العثور على المادة المختارة");
      return;
    }

    // التحقق من عدم وجود المادة مسبقاً
    const existingIndex = formData.consumables.findIndex(c => c.itemId === selectedConsumable);
    if (existingIndex !== -1) {
      toast.error("هذه المادة موجودة مسبقاً في القائمة");
      return;
    }

    const newConsumable: ConsumableItem = {
      itemId: selectedProduct.value,
      itemName: selectedProduct.label,
      itemNameEn: selectedProduct.nameEn,
      quantity: consumableQuantity,
      unit: selectedProduct.unit,
      cost: selectedProduct.cost,
      currentStock: selectedProduct.currentStock,
      minStock: selectedProduct.minStock,
      maxStock: selectedProduct.maxStock,
    };

    setFormData(prev => ({
      ...prev,
      consumables: [...prev.consumables, newConsumable]
    }));

    // إعادة تعيين الحقول
    setSelectedConsumable("");
    setConsumableQuantity(1);
    toast.success("تم إضافة المادة المستهلكة بنجاح");
  }, [selectedConsumable, consumableQuantity, consumableOptions, formData.consumables]);

  // إزالة مادة مستهلكة
  const removeConsumable = useCallback((itemId: string) => {
    setFormData(prev => ({
      ...prev,
      consumables: prev.consumables.filter(c => c.itemId !== itemId)
    }));
    toast.success("تم إزالة المادة المستهلكة");
  }, []);

  // تحديث كمية مادة مستهلكة
  const updateConsumableQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      toast.error("الكمية يجب أن تكون أكبر من صفر");
      return;
    }

    setFormData(prev => ({
      ...prev,
      consumables: prev.consumables.map(c => 
        c.itemId === itemId ? { ...c, quantity: newQuantity } : c
      )
    }));
  }, []);

  // حساب إجمالي تكلفة المواد المستهلكة
  const totalConsumablesCost = useMemo(() => {
    return formData.consumables.reduce((total, item) => total + (item.cost * item.quantity), 0);
  }, [formData.consumables]);

  // Map UI values to API values
  const mapDiscountTypeToApi = (uiValue?: string) => {
    if (uiValue === "نسبة") return "percentage";
    if (uiValue === "قيمة") return "fixed";
    return "none";
  };
  const mapTaxTypeToApi = (uiValue?: string) => {
    if (uiValue === "مع ضريبة قيمة مضافة") return "with_vat";
    return "without_vat";
  };
  const mapStatusToApi = (uiValue?: string) => {
    if (uiValue === "نشط") return "active";
    return "inactive";
  };

  // Calculate price after discount
  const calculatePriceAfterDiscount = (
    price: number,
    discountType: string | undefined,
    discountValue: number | undefined
  ) => {
    if (!discountType || !discountValue || discountValue === 0) return price;
    if (discountType === "نسبة") {
      return price - (price * discountValue) / 100;
    }
    if (discountType === "قيمة") {
      return price - discountValue;
    }
    return price;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // تمت إزالة جميع عمليات التحقق (validation) هنا

    try {
      if (formData.type === "خدمة") {
        const branchesToApply = formData.applyToAllBranches
          ? branches.map((b: Branch) => b.id)
          : formData.appliedBranches.map(Number);

        const priceAfterDiscount = calculatePriceAfterDiscount(
          formData.price,
          formData.discountType,
          formData.discountValue
        );

        const basePayload = {
          serviceCode: formData.code,
          arabicName: formData.name_ar,
          englishName: formData.nameEn,
          description: formData.description,
          administrativeNotes: formData.administrativeNotes,
          price: formData.price,
          discountType: mapDiscountTypeToApi(formData.discountType),
          discountValue: formData.discountValue,
          priceAfterDiscount: priceAfterDiscount,
          minimumPrice: formData.minPrice,
          taxType: mapTaxTypeToApi(formData.taxType),
          taxRate: formData.taxRate,
          duration: formData.duration,
          unit: formData.unit === "خدمة" ? "service" : formData.unit,
          executionUnit: formData.executionUnit || "per_car",
          targetCarType: formData.targetCarType || "all_types",
          serviceType: formData.serviceType || "car_wash",
          categoryId: parseInt(formData.category),
          isActive: formData.status === "نشط",
          serviceStatus: mapStatusToApi(formData.status),
          imageUrl: imageFile ? undefined : formData.imageUrl, // سيتم رفع الصورة من الملف
          consumables: formData.consumables.map(item => ({
            itemId: item.itemId,
            itemName: item.itemName,
            quantity: item.quantity,
            unit: item.unit,
            cost: item.cost
          })),
          totalConsumablesCost: totalConsumablesCost
        };
        
        // إذا كانت هناك صورة، استخدم FormData
        if (imageFile) {
          const serviceFormData = new FormData();
          Object.keys(basePayload).forEach(key => {
            if (basePayload[key as keyof typeof basePayload] !== undefined) {
              if (key === 'consumables') {
                serviceFormData.append(key, JSON.stringify(basePayload[key as keyof typeof basePayload]));
              } else {
                serviceFormData.append(key, String(basePayload[key as keyof typeof basePayload]));
              }
            }
          });
          serviceFormData.append('image', imageFile);
          console.log('📸 إضافة صورة للخدمة');
          
          // استبدال basePayload بـ FormData
          if (editingItem && editingItem.id) {
            await updateService({
              id: editingItem.id,
              updatedService: serviceFormData
            }).unwrap();
            toast.success("تم تحديث الخدمة بنجاح!");
            onSave();
            return;
          }
        }

        if (editingItem && editingItem.id) {
          // تحديث خدمة موجودة
          await updateService({
            id: editingItem.id,
            updatedService: { ...basePayload, branchId: branchesToApply[0] || 1 }
          }).unwrap();
          toast.success("تم تحديث الخدمة بنجاح!");
          onSave();
        } else {
          // إنشاء خدمة جديدة في الفروع المحددة
          const createPromises = branchesToApply.map((branchId) =>
            createService({ ...basePayload, branchId }).unwrap()
          );

          const results = await Promise.allSettled(createPromises);
          const anySuccess = results.some((r) => r.status === "fulfilled");

          if (anySuccess) {
            toast.success("تم حفظ الخدمة بنجاح في الفروع المحددة!");
            onSave();
          } else {
            setError("تعذر حفظ الخدمة. الرجاء المحاولة مرة أخرى.");
          }
        }
      }
    } catch (err: any) {
      console.error("Failed to save item:", err);
      const errorMessage =
        err?.data?.message ||
        err?.error ||
        "تعذر حفظ الخدمة. الرجاء المحاولة مرة أخرى.";
      setError(errorMessage);
      // intentionally no error toast to avoid showing alerts when save actually succeeds
    }
  };

  const isAnyLoading =
    isLoadingCategories ||
    isLoadingBranches ||
    isLoadingProducts ||
    isLoadingConsumables ||
    isCreatingService ||
    isUpdatingService;

  // Display error if initial data fetching fails
  if (
    categoriesError ||
    branchesError
  ) {
    return (
      <div className="text-red-600 p-4 border border-red-400 rounded-md">
        <h3 className="font-bold mb-2">خطأ في تحميل البيانات الأساسية:</h3>
        <p>الرجاء التحقق من اتصالك بالإنترنت أو التواصل مع الدعم الفني.</p>
        {!!categoriesError && (
          <p>خطأ الفئات: {String((categoriesError as any)?.message ?? "")}</p>
        )}
        {!!branchesError && (
          <p>خطأ الفروع: {String((branchesError as any)?.message ?? "")}</p>
        )}
      </div>
    );
  }

  // معالج رفع الصورة
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary">
          {editingItem ? "تعديل خدمة" : "إضافة خدمة جديدة"}
        </h2>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 ml-2" />
            إلغاء
          </Button>
          <Button type="submit" disabled={isAnyLoading}>
            <Save className="h-4 w-4 ml-2" />
            {isAnyLoading ? "جارٍ الحفظ..." : editingItem ? "تحديث الخدمة" : "حفظ الخدمة"}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-[#1e3a8a]/10 via-[#2563eb]/10 to-[#0ea5e9]/10 p-1 rounded-xl">
          <TabsTrigger
            value="basic"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1e3a8a] data-[state=active]:to-[#2563eb] data-[state=active]:text-white"
          >
            المعلومات الأساسية
          </TabsTrigger>
          <TabsTrigger
            value="pricing"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1e3a8a] data-[state=active]:to-[#2563eb] data-[state=active]:text-white"
          >
            الأسعار
          </TabsTrigger>
          <TabsTrigger
            value="consumables"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1e3a8a] data-[state=active]:to-[#2563eb] data-[state=active]:text-white"
          >
            المواد المستهلكة
          </TabsTrigger>
          <TabsTrigger
            value="image"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1e3a8a] data-[state=active]:to-[#2563eb] data-[state=active]:text-white"
          >
            الصورة
          </TabsTrigger>
          <TabsTrigger
            value="branches"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1e3a8a] data-[state=active]:to-[#2563eb] data-[state=active]:text-white"
          >
            الفروع
          </TabsTrigger>
        </TabsList>
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                المعلومات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">كود الخدمة *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => updateFormData("code", e.target.value)}
                      placeholder="سيتم التوليد تلقائياً"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateFormData("code", generateServiceCode())}
                      title="توليد كود جديد"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    يتم توليد الكود تلقائياً، يمكنك تعديله يدوياً إذا لزم الأمر
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">نوع الصنف *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => updateFormData("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الصنف (مطلوب)" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                      <SelectItem value="خدمة">خدمة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name_ar">اسم الخدمة *</Label>
                  <Input
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => updateFormData("name_ar", e.target.value)}
                    placeholder="  مشروب كامل"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">فاعلية الخدمة</Label>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="status"
                      checked={formData.status === "نشط"}
                      onCheckedChange={(checked) =>
                        updateFormData("status", checked ? "نشط" : "غير نشط")
                      }
                    />
                    <Label htmlFor="status" className="text-sm font-medium">
                      {formData.status === "نشط" ? "نشط" : "موقوف"}
                    </Label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameEn">الاسم الإنجليزي</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => updateFormData("nameEn", e.target.value)}
                    placeholder="Full Car Wash"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceType">نوع الخدمة</Label>
                  <Input
                    id="serviceType"
                    value={formData.serviceType}
                    onChange={(e) => updateFormData("serviceType", e.target.value)}
                    placeholder="car_wash"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    placeholder="خدمة   كاملة للمشروب تشمل الشمع والتلميع"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="administrativeNotes">ملاحظات إدارية</Label>
                  <Textarea
                    id="administrativeNotes"
                    value={formData.administrativeNotes}
                    onChange={(e) => updateFormData("administrativeNotes", e.target.value)}
                    placeholder="يجب استخدام مواد عالية الجودة"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">التصنيف *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => updateFormData("category", value)}
                    disabled={categories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          categories.length === 0
                            ? "لا يوجد فئات متاحة"
                            : "اختر التصنيف"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                      {categoryOptions.map((category) => (
                        <SelectItem
                          key={category.value}
                          value={category.value}
                        >
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {categories.length === 0 && !isLoadingCategories && (
                    <p className="text-sm text-gray-500 mt-1">
                      لا يوجد فئات متاحة. يرجى إضافة فئات أولاً.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">رابط صورة الخدمة</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => updateFormData("imageUrl", e.target.value)}
                    placeholder="https://example.com/car-wash.jpg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit">الوحدة *</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => updateFormData("unit", e.target.value)}
                    placeholder="service"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="executionUnit">وحدة التنفيذ</Label>
                  <Input
                    id="executionUnit"
                    value={formData.executionUnit}
                    onChange={(e) => updateFormData("executionUnit", e.target.value)}
                    placeholder="per_car"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetCarType">نوع المشروب المستهدفة</Label>
                  <Input
                    id="targetCarType"
                    value={formData.targetCarType}
                    onChange={(e) => updateFormData("targetCarType", e.target.value)}
                    placeholder="all_types"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">المدة (دقائق)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration || ""}
                    onChange={(e) =>
                      updateFormData("duration", parseInt(e.target.value) || 0)
                    }
                    placeholder="45"
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                معلومات الأسعار
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">سعر الخدمة *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      updateFormData("price", parseFloat(e.target.value) || 0)
                    }
                    placeholder="150.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minPrice">أقل سعر للخدمة</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    value={formData.minPrice || ""}
                    onChange={(e) =>
                      updateFormData(
                        "minPrice",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="120.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountType">نوع الخصم</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value) =>
                      updateFormData("discountType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                      <SelectItem value="نسبة">نسبة مئوية (%)</SelectItem>
                      <SelectItem value="قيمة">قيمة ثابتة (جنيه)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountValue">
                    {formData.discountType === "نسبة"
                      ? "نسبة الخصم (%)"
                      : "قيمة الخصم (جنيه)"}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={formData.discountValue || ""}
                    onChange={(e) =>
                      updateFormData(
                        "discountValue",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder={
                      formData.discountType === "نسبة" ? "10" : "5.00"
                    }
                    min="0"
                    max={formData.discountType === "نسبة" ? "100" : undefined}
                    step="0.01"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxType">نوع الضريبة</Label>
                  <Select
                    value={formData.taxType}
                    onValueChange={(value) => updateFormData("taxType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                      <SelectItem value="مع ضريبة قيمة مضافة">
                        مع ضريبة قيمة مضافة
                      </SelectItem>
                      <SelectItem value="بدون ضريبة">بدون ضريبة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.taxType === "مع ضريبة قيمة مضافة" && (
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">معدل الضريبة (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      value={formData.taxRate || ""}
                      onChange={(e) =>
                        updateFormData(
                          "taxRate",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="15"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priceAfterDiscount">السعر بعد الخصم</Label>
                  <Input
                    id="priceAfterDiscount"
                    type="number"
                    value={calculatePriceAfterDiscount(
                      formData.price,
                      formData.discountType,
                      formData.discountValue
                    ).toFixed(2)}
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consumables Tab */}
        <TabsContent value="consumables" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                المواد المستهلكة المستخدمة في الخدمة
              </CardTitle>
              <CardDescription>
                تحديد المواد المستهلكة والكميات المستخدمة مع كل خدمة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* إضافة مادة مستهلكة جديدة */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">إضافة مادة مستهلكة جديدة</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="consumable-select">اختيار المادة</Label>
                    <Select
                      value={selectedConsumable}
                      onValueChange={setSelectedConsumable}
                      disabled={isLoadingProducts || consumableOptions.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          isLoadingProducts 
                            ? "جاري التحميل..." 
                            : consumableOptions.length === 0 
                              ? "لا توجد مواد مستهلكة متاحة"
                              : "اختر مادة مستهلكة"
                        } />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg z-50 max-h-60">
                        {consumableOptions.map((product) => (
                          <SelectItem key={product.value} value={product.value}>
                            <div className="flex flex-col">
                              <span className="font-medium">{product.label}</span>
                              <span className="text-xs text-gray-500">
                                {product.nameEn} - المخزون: {product.currentStock} {product.unit}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consumable-quantity">الكمية</Label>
                    <Input
                      id="consumable-quantity"
                      type="number"
                      value={consumableQuantity}
                      onChange={(e) => setConsumableQuantity(parseFloat(e.target.value) || 1)}
                      placeholder="1"
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <Button
                      type="button"
                      onClick={addConsumable}
                      disabled={!selectedConsumable || consumableQuantity <= 0}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      إضافة
                    </Button>
                  </div>
                </div>
              </div>

              {/* قائمة المواد المستهلكة المضافة */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800">المواد المستهلكة المضافة</h4>
                  <div className="text-sm text-gray-600">
                    إجمالي التكلفة: <span className="font-bold text-blue-600">{totalConsumablesCost.toFixed(2)} جنيه</span>
                  </div>
                </div>
                
                {formData.consumables.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <Package className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 mb-2">لا توجد مواد مستهلكة مضافة</p>
                    <p className="text-sm text-gray-500">قم بإضافة المواد المستهلكة المستخدمة في هذه الخدمة</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.consumables.map((consumable, index) => (
                      <Card key={consumable.itemId} className="border border-gray-200 hover:border-blue-300 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Package className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h5 className="font-semibold text-gray-900">{consumable.itemName}</h5>
                                  <p className="text-sm text-gray-500">{consumable.itemNameEn}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">الكمية:</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Input
                                      type="number"
                                      value={consumable.quantity}
                                      onChange={(e) => updateConsumableQuantity(consumable.itemId, parseFloat(e.target.value) || 1)}
                                      className="w-20 h-8 text-sm"
                                      min="0.01"
                                      step="0.01"
                                    />
                                    <span className="text-gray-800 font-medium">{consumable.unit}</span>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-600">التكلفة:</span>
                                  <p className="font-medium text-gray-800">{consumable.cost.toFixed(2)} جنيه</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">المخزون الحالي:</span>
                                  <p className={`font-medium ${
                                    consumable.currentStock <= consumable.minStock 
                                      ? 'text-red-600' 
                                      : consumable.currentStock <= consumable.maxStock * 0.3 
                                        ? 'text-orange-600' 
                                        : 'text-green-600'
                                  }`}>
                                    {consumable.currentStock} {consumable.unit}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-600">إجمالي التكلفة:</span>
                                  <p className="font-bold text-blue-600">{(consumable.cost * consumable.quantity).toFixed(2)} جنيه</p>
                                </div>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeConsumable(consumable.itemId)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* معلومات إضافية */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">معلومات مهمة:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• المواد المستهلكة ستؤثر على تكلفة الخدمة الإجمالية</li>
                  <li>• سيتم تتبع استهلاك المواد تلقائياً عند استخدام الخدمة</li>
                  <li>• تأكد من أن المخزون كافي لتقديم الخدمة</li>
                  <li>• يمكن تعديل الكميات في أي وقت قبل حفظ الخدمة</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branch Management Tab */}
        <TabsContent value="branches" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                الفروع المفعلة
              </CardTitle>
              <CardDescription>
                تحديد الفروع التي تتوفر فيها الخدمة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Switch
                  id="applyToAll"
                  checked={formData.applyToAllBranches}
                  onCheckedChange={(checked) => {
                    updateFormData("applyToAllBranches", checked);
                    if (checked && branches.length > 0) {
                      updateFormData(
                        "appliedBranches",
                        branches.map((b: Branch) => b.id.toString())
                      );
                    } else {
                      updateFormData("appliedBranches", []);
                    }
                  }}
                  disabled={isLoadingBranches || branches.length === 0}
                />
                <Label htmlFor="applyToAll" className="font-medium">
                  تفعيل في جميع الفروع
                </Label>
              </div>
              {!formData.applyToAllBranches && (
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">
                    اختيار الفروع
                  </Label>
                  {isLoadingBranches ? (
                    <div>جاري تحميل الفروع...</div>
                  ) : branchesError ? (
                    <div className="text-red-500">
                      خطأ في تحميل الفروع: {(branchesError as any).message}
                    </div>
                  ) : (
                    branchOptions.map((branch) => {
                      const isBranchSelected =
                        formData.appliedBranches.includes(branch.value);
                      return (
                        <Card
                          key={branch.value}
                          className={`transition-all duration-200 ${
                            isBranchSelected
                              ? "border-blue-500 bg-blue-50/50"
                              : "border-gray-200"
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id={branch.value}
                                checked={isBranchSelected}
                                onChange={(e) => {
                                  let newBranches = [...formData.appliedBranches];
                                  if (e.target.checked) {
                                    newBranches.push(branch.value);
                                  } else {
                                    newBranches = newBranches.filter((id) => id !== branch.value);
                                  }
                                  updateFormData("appliedBranches", newBranches);
                                }}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <Label
                                htmlFor={branch.value}
                                className="font-medium text-gray-900"
                              >
                                {branch.label}
                              </Label>
                              {isBranchSelected && (
                                <Badge
                                  variant="default"
                                  className="bg-blue-100 text-blue-800"
                                >
                                  مفعل
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                  {branches.length === 0 && !isLoadingBranches && (
                    <p className="text-sm text-gray-500 mt-1">
                      لا يوجد فروع متاحة. يرجى إضافة فروع أولاً.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isAnyLoading}
        >
          <X className="h-4 w-4 mr-2" />
          إلغاء
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-[#1e3a8a] to-[#0ea5e9] hover:from-[#1e40af] hover:to-[#06b6d4]"
          disabled={isAnyLoading}
        >
          <Save className="h-4 w-4 mr-2" />
          {isAnyLoading ? "جارٍ الحفظ..." : "حفظ الخدمة"}
        </Button>
      </div>
    </form>
  );
};
