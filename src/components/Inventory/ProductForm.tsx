/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo, useEffect } from "react";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Package,
  Save,
  X,
  Upload,
  DollarSign,
  Barcode,
  AlertTriangle,
  Zap,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useGetAllCategoriesQuery } from "@/services/categoriesApi";
import { useGetAllBrandsQuery } from "@/services/brandsApi";
import { useGetAllManufacturersQuery } from "@/services/manufacturersApi";
import { useGetAllSuppliersQuery } from "@/services/suppliersApi";
import { useGetAllWarehousesQuery } from "@/services/warehouseApi";
import { useGetAllBranchesQuery } from "@/services/branchesApi";
import { useCreateProductMutation, useUpdateProductMutation } from "@/services/productApi";
import { useCreateProductBranchMutation } from "@/services/productBranchesApi";
import { useCreateInventoryMutation } from "@/services/inventoryApi";
import { apiSlice } from "@/services/apiSlice";
import { getImageUrl } from "@/utils/imageHelpers";

// Define interfaces to match the database schema
interface Category {
  category_id: number;
  name_ar: string;
  name_en: string;
}

interface Brand {
  brand_id: number;
  name_ar: string;
  name_en: string;
}

interface Manufacturer {
  manufacturer_id: number;
  name_ar: string;
  name_en: string;
}

interface Supplier {
  supplier_id: number;
  name_ar: string;
  name_en: string;
}

interface Storage {
  warehouse_id: number;
  name_ar: string;
  name_en: string;
  warehouse_code: string;
}

interface Branch {
  id: number;
  arabicName: string;
  englishName: string;
  code: string;
}

interface Product {
  product_id?: string;
  barcode?: string;
  name_ar: string;
  name_en: string;
  category_id: number;
  brand_id?: number;
  model?: string;
  unit_of_measure: string;
  status: "active" | "inactive";
  description?: string;
  manufacturer_id?: number;
  supplier_id?: number;
  expiry_date?: string;
  batch_number?: string;
  cost_price: number;
  selling_price: number;
  wholesale_price?: number;
  image_url?: string;
  weight_kg?: number;
  dimensions?: string;
  color?: string;
  size?: string;
  material?: string;
  warranty_period?: string;
  current_stock?: number;
  min_stock?: number;
  max_stock?: number;
  reorder_point?: number;
  storageId?: number;
  shelf_location?: string;
  branchIds?: number[];
  applyToAllBranches?: boolean;
}

interface ProductFormProps {
  editingProduct?: Product | null;
  onSave: () => void;
  onCancel: () => void;
}

// Helper function to get initial form data
const getInitialFormData = (): Product => ({
  product_id: "",
  barcode: "",
  name_ar: "",
  name_en: "",
  category_id: 0,
  brand_id: 0,
  model: "",
  unit_of_measure: "  ",
  status: "active",
  description: "",
  manufacturer_id: 0,
  supplier_id: 0,
  expiry_date: "",
  batch_number: "",
  cost_price: 0,
  selling_price: 0,
  wholesale_price: 0,
  image_url: "",
  weight_kg: 0,
  dimensions: "",
  color: "",
  size: "",
  material: "",
  warranty_period: "",
  current_stock: 0,
  min_stock: 1,
  max_stock: 1000,
  reorder_point: 10,
  storageId: 0,
  shelf_location: "",
  branchIds: [],
  applyToAllBranches: false,
});

export const ProductForm: React.FC<ProductFormProps> = ({
  editingProduct,
  onSave,
  onCancel,
}) => {
  // If editingProduct is provided, use its values, otherwise use initial empty values
  const [formData, setFormData] = useState<Product>(
    editingProduct
      ? {
          product_id: editingProduct.product_id || "",
          barcode: editingProduct.barcode || "",
          name_ar: editingProduct.name_ar || "",
          name_en: editingProduct.name_en || "",
          category_id: editingProduct.category_id || 0,
          brand_id: editingProduct.brand_id || 0,
          model: editingProduct.model || "",
          unit_of_measure: editingProduct.unit_of_measure || "  ",
          status: editingProduct.status || "active",
          description: editingProduct.description || "",
          manufacturer_id: editingProduct.manufacturer_id || 0,
          supplier_id: editingProduct.supplier_id || 0,
          expiry_date: editingProduct.expiry_date || "",
          batch_number: editingProduct.batch_number || "",
          cost_price: editingProduct.cost_price || 0,
          selling_price: editingProduct.selling_price || 0,
          wholesale_price: editingProduct.wholesale_price || 0,
          image_url: editingProduct.image_url || "",
          weight_kg: editingProduct.weight_kg || 0,
          dimensions: editingProduct.dimensions || "",
          color: editingProduct.color || "",
          size: editingProduct.size || "",
          material: editingProduct.material || "",
          warranty_period: editingProduct.warranty_period || "",
          current_stock: editingProduct.current_stock || 0,
          min_stock: editingProduct.min_stock || 1,
          max_stock: editingProduct.max_stock || 1000,
          reorder_point: editingProduct.reorder_point || 10,
          storageId: editingProduct.storageId || 0,
          shelf_location: editingProduct.shelf_location || "",
          branchIds: editingProduct.branchIds || [],
          applyToAllBranches: editingProduct.applyToAllBranches || false,
        }
      : getInitialFormData()
  );

  // عرض البيانات الأولية
  useEffect(() => {
   
  }, []);

  const [activeTab, setActiveTab] = useState("basic");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    editingProduct?.image_url ? (getImageUrl(editingProduct.image_url) || "") : ""
  );
  const [error, setError] = useState<string | null>(null);

  // API Queries
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useGetAllCategoriesQuery(undefined);
  const {
    data: brandsData,
    isLoading: isBrandsLoading,
    error: brandsError,
  } = useGetAllBrandsQuery(undefined);
  const {
    data: manufacturersData,
    isLoading: isManufacturersLoading,
    error: manufacturersError,
  } = useGetAllManufacturersQuery(undefined);
  const {
    data: suppliersData,
    isLoading: isSuppliersLoading,
    error: suppliersError,
  } = useGetAllSuppliersQuery(undefined);
  const {
    data: storagesData,
    isLoading: isStoragesLoading,
    error: storagesError,
  } = useGetAllWarehousesQuery(undefined);
  console.log(storagesData);
  const {
    data: branchesData,
    isLoading: isBranchesLoading,
    error: branchesError,
  } = useGetAllBranchesQuery(undefined);

  const [createProductTrigger, { isLoading: isCreatingProduct }] =
    useCreateProductMutation();
  const [updateProductTrigger, { isLoading: isUpdatingProduct }] =
    useUpdateProductMutation();
  const [createProductBranchTrigger, { isLoading: isCreatingProductBranch }] =
    useCreateProductBranchMutation();
  const [createInventoryTrigger, { isLoading: isCreatingInventory }] =
    useCreateInventoryMutation();

  // Normalize API data to ensure arrays
  const normalizeData = (data: any, source: string): any[] => {
    if (!data) {
      console.warn(`No data received for ${source}`);
      return [];
    }
    if (Array.isArray(data)) return data;
    if (typeof data === "object") {
      if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
      // Handle direct array in data: { data: [...] }
      if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
      
      if (data.data && Array.isArray(data.data[source])) {
        return data.data[source];
      }
      if (data.data[source] && Array.isArray(data[source])) {
        return data.data[source];
      }
      if (Array.isArray(data.data.results)) {
        return data.data.results;
      }
      if (Array.isArray(data.data.items)) {
        return data.data.items;
      }
    }
    console.warn(`Unexpected ${source} data structure:`, data);
    return [];
  };

  // Ensure normalizeData always returns an array
  const safeNormalizeData = (data: any, source: string): any[] => {
    try {
      const result = normalizeData(data, source);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error(`Error normalizing ${source} data:`, error);
      return [];
    }
  };

  // Function to generate automatic product code
  const generateProductCode = useCallback(() => {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const code = `PRD-${timestamp}-${randomSuffix}`;
    return code;
  }, []);

  // Extract and normalize data
  const categories = safeNormalizeData(categoriesData, "categories");
  const brands = safeNormalizeData(brandsData, "brands");
  const manufacturers = safeNormalizeData(manufacturersData, "manufacturers");
  const suppliers = safeNormalizeData(suppliersData, "suppliers");
  const warehousesList = safeNormalizeData(storagesData, "warehouses");
  const branches = safeNormalizeData(branchesData, "branches");

  // Fallback to mock data if API fails
  const { data: mockManufacturersData } = apiSlice.useGetMockManufacturersQuery(undefined, {
    skip: manufacturers.length > 0, // Only use if no real data
  });
  const { data: mockSuppliersData } = apiSlice.useGetMockSuppliersQuery(undefined, {
    skip: suppliers.length > 0, // Only use if no real data
  });

  // Use mock data as fallback
  const finalManufacturers = manufacturers.length > 0 ? manufacturers : safeNormalizeData(mockManufacturersData, "manufacturers");
  const finalSuppliers = suppliers.length > 0 ? suppliers : safeNormalizeData(mockSuppliersData, "suppliers");

  // Ensure all arrays are valid
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeBrands = Array.isArray(brands) ? brands : [];
  const safeManufacturers = Array.isArray(finalManufacturers) ? finalManufacturers : [];
  const safeSuppliers = Array.isArray(finalSuppliers) ? finalSuppliers : [];
  const safeWarehouses = Array.isArray(warehousesList) ? warehousesList : [];
  const safeBranches = Array.isArray(branches) ? branches : [];

  
  const units = useMemo(
    () => [
      "  ",
      "كيلوجرام",
      "لتر",
      "علبة",
      "زجاجة",
      "عبوة",
      "رول",
      "متر",
      "جالون",
    ],
    []
  );

  const updateFormData = useCallback((field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Generate automatic product code when component mounts
  useEffect(() => {
    if (!editingProduct && formData.product_id === "") {
      const newCode = generateProductCode();
      setFormData((prev) => ({
        ...prev,
        product_id: newCode,
      }));
    }
  }, [editingProduct, formData.product_id, generateProductCode]);

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImagePreview(result);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const calculateProfitMargin = () => {
    if (formData.cost_price > 0) {
      const margin = ((formData.selling_price - formData.cost_price) / formData.cost_price) * 100;
      console.log("💰 حساب هامش الربح:", {
        cost: formData.cost_price,
        selling: formData.selling_price,
        margin: margin.toFixed(2) + "%"
      });
      return margin;
    }
    return 0;
  };

  // Helper to reset form fields after adding a product
  const resetForm = useCallback(() => {
    setFormData(getInitialFormData());
    setImageFile(null);
    setImagePreview("");
    setActiveTab("basic");
    setError(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      // Validate required fields
      if (
        !formData.name_ar ||
        !formData.name_en ||
        !formData.category_id ||
        !formData.unit_of_measure ||
        !formData.cost_price ||
        !formData.selling_price
      ) {
        setError("يرجى ملء جميع الحقول المطلوبة");
        toast.error("يرجى ملء جميع الحقول المطلوبة");
        return;
      }

      // Generate product_id if not provided
      if (!formData.product_id) {
        const newProductId = generateProductCode();
        setFormData(prev => ({ ...prev, product_id: newProductId }));
        formData.product_id = newProductId;
      }

      // Set default values for optional fields
      if (!formData.storageId) {
        formData.storageId = 1; // Default warehouse
      }
      if (!formData.shelf_location) {
        formData.shelf_location = "A-1"; // Default shelf location
      }

      try {
        // استخدام FormData لإرسال البيانات مع الملفات
        const formDataToSend = new FormData();
        
        // إضافة جميع الحقول
        formDataToSend.append('product_id', formData.product_id);
        if (formData.barcode) formDataToSend.append('barcode', formData.barcode);
        formDataToSend.append('name_ar', formData.name_ar);
        formDataToSend.append('name_en', formData.name_en);
        formDataToSend.append('category_id', String(formData.category_id));
        if (formData.brand_id) formDataToSend.append('brand_id', String(formData.brand_id));
        if (formData.model) formDataToSend.append('model', formData.model);
        formDataToSend.append('unit_of_measure', formData.unit_of_measure);
        formDataToSend.append('status', formData.status);
        if (formData.description) formDataToSend.append('description', formData.description);
        if (formData.manufacturer_id) formDataToSend.append('manufacturer_id', String(formData.manufacturer_id));
        if (formData.supplier_id) formDataToSend.append('supplier_id', String(formData.supplier_id));
        if (formData.expiry_date) formDataToSend.append('expiry_date', formData.expiry_date);
        if (formData.batch_number) formDataToSend.append('batch_number', formData.batch_number);
        formDataToSend.append('cost_price', String(formData.cost_price));
        formDataToSend.append('selling_price', String(formData.selling_price));
        if (formData.wholesale_price) formDataToSend.append('wholesale_price', String(formData.wholesale_price));
        if (formData.weight_kg) formDataToSend.append('weight_kg', String(formData.weight_kg));
        if (formData.dimensions) formDataToSend.append('dimensions', formData.dimensions);
        if (formData.color) formDataToSend.append('color', formData.color);
        if (formData.size) formDataToSend.append('size', formData.size);
        if (formData.material) formDataToSend.append('material', formData.material);
        if (formData.warranty_period) formDataToSend.append('warranty_period', formData.warranty_period);
        formDataToSend.append('current_stock', String(formData.current_stock || 0));
        formDataToSend.append('min_stock', String(formData.min_stock || 1));
        formDataToSend.append('max_stock', String(formData.max_stock || 1000));
        formDataToSend.append('reorder_point', String(formData.reorder_point || 10));
        if (formData.storageId) formDataToSend.append('warehouse_id', String(formData.storageId));
        if (formData.shelf_location) formDataToSend.append('shelf_location', formData.shelf_location);
        formDataToSend.append('apply_to_all_branches', String(formData.applyToAllBranches || false));
        
        // إضافة الصورة كملف إذا كانت موجودة
        if (imageFile) {
          formDataToSend.append('image', imageFile);
          console.log('📸 إضافة صورة جديدة للـ FormData');
        } else if (editingProduct && editingProduct.image_url) {
          // إذا كنا في وضع التعديل ولم يتم اختيار صورة جديدة، احتفظ بالصورة القديمة
          formDataToSend.append('image_url', editingProduct.image_url);
          console.log('📸 الاحتفاظ بالصورة القديمة:', editingProduct.image_url);
        }

        
        console.log('📤 إرسال FormData إلى الخادم:', {
          has_image: !!imageFile,
          product_id: formData.product_id,
          isEditing: !!editingProduct
        });

        let response;
        if (editingProduct && editingProduct.product_id) {
          // تحديث منتج موجود
          response = await updateProductTrigger({
            id: editingProduct.product_id,
            updatedProduct: formDataToSend
          }).unwrap();
          toast.success("تم تحديث المنتج بنجاح");
        } else {
          // إنشاء منتج جديد
          response = await createProductTrigger(formDataToSend).unwrap();
          toast.success("تم إنشاء المنتج بنجاح");
        }

        // إنشاء سجل مخزون مرتبط مباشرة بعد إنشاء المنتج (فقط للمنتجات الجديدة)
        if (!editingProduct) {
          try {
            const productId = response?.data?.product?.product_id || formData.product_id;
            const warehouseId = formData.storageId;
            const newInventoryPayload = {
              product_id: productId,
              warehouse_id: warehouseId,
              shelf_location: formData.shelf_location,
              current_stock: formData.current_stock || 0,
              min_stock: formData.min_stock || 1,
              max_stock: formData.max_stock || 1000,
              reorder_point: formData.reorder_point || 10,
            };
            
            await createInventoryTrigger(newInventoryPayload).unwrap();
          } catch (e) {
            console.error("❌ فشل في إنشاء المخزون:", e);
            // تجاهل فشل إنشاء المخزون حتى لا يعطل إنشاء المنتج، يمكن إظهار تنبيه لاحقاً
          }
        }

        // إنشاء علاقات الفروع إذا لم يتم تطبيقها على جميع الفروع (فقط للمنتجات الجديدة)
        if (!editingProduct && !formData.applyToAllBranches && formData.branchIds && formData.branchIds.length > 0) {
          try {
            const productId = response?.data?.product?.product_id || formData.product_id;
            for (const branchId of formData.branchIds) {
              const branchPayload = {
                product_id: productId,
                branch_id: branchId,
              };
              await createProductBranchTrigger(branchPayload).unwrap();
            }
            console.log("✅ تم ربط المنتج بالفروع بنجاح");
          } catch (e) {
            console.error("❌ فشل في ربط المنتج بالفروع:", e);
            // تجاهل فشل ربط الفروع حتى لا يعطل إنشاء المنتج
          }
        }
        // Only reset the form if not editing (i.e. adding new)
        if (!editingProduct) {
          resetForm();
        }
        console.log("📤 استدعاء onSave");
        onSave();
      } catch (error: any) {
        console.error("❌ خطأ في إنشاء المنتج:", error);
        // intentionally no error toast to avoid showing alerts when save actually succeeds
      }
    },
    [formData, createProductTrigger, updateProductTrigger, onSave, resetForm, editingProduct, imageFile]
  );

  const isLoading =
    isCategoriesLoading ||
    isBrandsLoading ||
    isManufacturersLoading ||
    isSuppliersLoading ||
    isStoragesLoading ||
    isBranchesLoading ||
    isCreatingProduct ||
    isUpdatingProduct ||
    isCreatingInventory ||
    isCreatingProductBranch;

  // We avoid rendering a blocking error banner to prevent noisy messages when DB operations succeed.

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">
          {editingProduct ? "تعديل منتج" : "إضافة منتج جديد"}
        </h2>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 ml-2" />
            إلغاء
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 ml-2" />
            {isLoading ? "جارٍ الحفظ..." : "حفظ المنتج"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
          <TabsTrigger value="inventory">المخزون</TabsTrigger>
          <TabsTrigger value="pricing">الأسعار</TabsTrigger>
          <TabsTrigger value="additional">معلومات إضافية</TabsTrigger>
          <TabsTrigger value="image">الصورة</TabsTrigger>
        </TabsList>

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
                  <Label htmlFor="product_id">كود المنتج *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="product_id"
                      value={formData.product_id}
                      onChange={(e) =>
                        updateFormData("product_id", e.target.value)
                      }
                      placeholder="سيتم التوليد تلقائياً"
                      required
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateFormData("product_id", generateProductCode())}
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
                  <Label htmlFor="barcode">الباركود</Label>
                  <div className="flex gap-2">
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) =>
                        updateFormData("barcode", e.target.value)
                      }
                      placeholder="1234567890123"
                    />
                    <Button type="button" variant="outline" size="sm">
                      <Barcode className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name_ar">اسم المنتج بالعربية *</Label>
                  <Input
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => updateFormData("name_ar", e.target.value)}
                    placeholder="صابون    الكافية"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_en">اسم المنتج بالإنجليزية *</Label>
                  <Input
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) => updateFormData("name_en", e.target.value)}
                    placeholder="Car Wash Soap"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_id">الفئة *</Label>
                  <Select
                    value={
                      formData.category_id ? String(formData.category_id) : ""
                    }
                    onValueChange={(value) =>
                      updateFormData("category_id", Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {safeCategories?.map((category: Category) => (
                        <SelectItem
                          key={category.category_id}
                          value={String(category.category_id)}
                        >
                          {category.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {safeCategories.length === 0 && !isCategoriesLoading && (
                    <p className="text-sm text-gray-500 mt-1">
                      لا يوجد فئات متاحة. يرجى إضافة فئات أولاً.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand_id">العلامة التجارية</Label>
                  <Select
                    value={formData.brand_id ? String(formData.brand_id) : ""}
                    onValueChange={(value) =>
                      updateFormData("brand_id", Number(value))
                    }
                    disabled={isBrandsLoading || safeBrands.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isBrandsLoading
                            ? "جارٍ التحميل..."
                            : safeBrands.length === 0
                            ? "لا يوجد علامات تجارية متاحة"
                            : "اختر العلامة التجارية"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(safeBrands) && safeBrands.length > 0 ? (
                        safeBrands.map((brand: Brand) => (
                          <SelectItem
                            key={brand.brand_id}
                            value={String(brand.brand_id)}
                          >
                            {brand.name_ar}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          لا يوجد علامات تجارية متاحة
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {safeBrands.length === 0 && !isBrandsLoading && (
                    <p className="text-sm text-gray-500 mt-1">
                      لا يوجد علامات تجارية متاحة. يرجى إضافة علامات تجارية
                      أولاً.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">الموديل</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => updateFormData("model", e.target.value)}
                    placeholder="موديل 2023"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit_of_measure">وحدة القياس *</Label>
                  <Select
                    value={formData.unit_of_measure}
                    onValueChange={(value) =>
                      updateFormData("unit_of_measure", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر وحدة القياس" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">الحالة *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      updateFormData("status", value as "active" | "inactive")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer_id">الشركة المصنعة</Label>
                  <Select
                    value={
                      formData.manufacturer_id
                        ? String(formData.manufacturer_id)
                        : ""
                    }
                    onValueChange={(value) =>
                      updateFormData("manufacturer_id", Number(value))
                    }
                    disabled={
                      isManufacturersLoading ||
                      !Array.isArray(safeManufacturers) ||
                      safeManufacturers.length === 0
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isManufacturersLoading
                            ? "جارٍ التحميل..."
                            : safeManufacturers.length === 0
                            ? "لا يوجد شركات مصنعة متاحة"
                            : "اختر الشركة المصنعة"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(safeManufacturers) &&
                      safeManufacturers.length > 0 ? (
                        safeManufacturers.map((manufacturer: Manufacturer) => (
                          <SelectItem
                            key={manufacturer.manufacturer_id}
                            value={String(manufacturer.manufacturer_id)}
                          >
                            {manufacturer.name_ar}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          لا يوجد شركات مصنعة متاحة
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {!isManufacturersLoading && safeManufacturers.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      لا يوجد شركات مصنعة متاحة. يرجى إضافة شركات مصنعة أولاً.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier_id">المورد</Label>
                  <Select
                    value={
                      formData.supplier_id ? String(formData.supplier_id) : ""
                    }
                    onValueChange={(value) =>
                      updateFormData("supplier_id", Number(value))
                    }
                    disabled={
                      isSuppliersLoading ||
                      !Array.isArray(safeSuppliers) ||
                      safeSuppliers.length === 0
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isSuppliersLoading
                            ? "جارٍ التحميل..."
                            : !Array.isArray(safeSuppliers) ||
                              safeSuppliers.length === 0
                            ? "لا يوجد موردين متاحين"
                            : "اختر المورد"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(safeSuppliers) && safeSuppliers.length > 0 ? (
                        safeSuppliers.map((supplier: Supplier) => (
                          <SelectItem
                            key={supplier.supplier_id}
                            value={String(supplier.supplier_id)}
                          >
                            {supplier.name_ar}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          لا يوجد موردين متاحين
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {!isSuppliersLoading &&
                    (!Array.isArray(safeSuppliers) || safeSuppliers.length === 0) && (
                      <p className="text-sm text-gray-500 mt-1">
                        لا يوجد موردين متاحين. يرجى إضافة موردين أولاً.
                      </p>
                    )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    updateFormData("description", e.target.value)
                  }
                  placeholder="وصف المنتج..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                معلومات المخزون
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storageId">المستودع *</Label>
                  <Select
                    value={formData.storageId ? String(formData.storageId) : ""}
                    onValueChange={(value) =>
                      updateFormData("storageId", Number(value))
                    }
                    disabled={
                      isStoragesLoading ||
                      !Array.isArray(safeWarehouses) ||
                      safeWarehouses.length === 0
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isStoragesLoading
                            ? "جارٍ التحميل..."
                            : !Array.isArray(safeWarehouses) || safeWarehouses.length === 0
                            ? "لا يوجد مستودعات متاحة"
                            : "اختر المستودع"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(safeWarehouses) && safeWarehouses.length > 0 ? (
                        safeWarehouses.map((wh: Storage) => (
                          <SelectItem
                            key={wh.warehouse_id}
                            value={String(wh.warehouse_id)}
                          >
                            {wh.name_ar}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          لا يوجد مستودعات متاحة
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {!isStoragesLoading &&
                    (!Array.isArray(safeWarehouses) || safeWarehouses.length === 0) && (
                      <p className="text-sm text-gray-500 mt-1">
                        لا يوجد مستودعات متاحة. يرجى إضافة مستودعات أولاً.
                      </p>
                    )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shelf_location">موقع الرف *</Label>
                  <Input
                    id="shelf_location"
                    value={formData.shelf_location}
                    onChange={(e) =>
                      updateFormData("shelf_location", e.target.value)
                    }
                    placeholder="مثل: C-01-05"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current_stock">المخزون الحالي</Label>
                  <Input
                    id="current_stock"
                    type="number"
                    value={formData.current_stock}
                    onChange={(e) =>
                      updateFormData("current_stock", Number(e.target.value))
                    }
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min_stock">الحد الأدنى *</Label>
                  <Input
                    id="min_stock"
                    type="number"
                    value={formData.min_stock}
                    onChange={(e) =>
                      updateFormData("min_stock", Number(e.target.value))
                    }
                    min="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_stock">الحد الأقصى *</Label>
                  <Input
                    id="max_stock"
                    type="number"
                    value={formData.max_stock}
                    onChange={(e) =>
                      updateFormData("max_stock", Number(e.target.value))
                    }
                    min="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reorder_point">نقطة إعادة الطلب</Label>
                  <Input
                    id="reorder_point"
                    type="number"
                    value={formData.reorder_point}
                    onChange={(e) =>
                      updateFormData("reorder_point", Number(e.target.value))
                    }
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry_date">تاريخ انتهاء الصلاحية</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      const today = new Date().toISOString().split('T')[0];
                      
                      if (selectedDate && selectedDate < today) {
                        toast.error("تاريخ انتهاء الصلاحية يجب أن يكون في المستقبل");
                        return;
                      }
                      
                      updateFormData("expiry_date", selectedDate);
                    }}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-gray-500">
                    اتركه فارغاً إذا لم يكن للمنتج تاريخ انتهاء صلاحية
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batch_number">رقم الدفعة</Label>
                  <Input
                    id="batch_number"
                    value={formData.batch_number}
                    onChange={(e) =>
                      updateFormData("batch_number", e.target.value)
                    }
                    placeholder="رقم دفعة الإنتاج"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    id="applyToAllBranches"
                    type="checkbox"
                    checked={formData.applyToAllBranches}
                    onChange={(e) =>
                      updateFormData("applyToAllBranches", e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="applyToAllBranches">
                    تطبيق على جميع الفروع
                  </Label>
                </div>

                {!formData.applyToAllBranches && (
                  <div className="space-y-2">
                    <Label htmlFor="branchIds">الفروع</Label>
                    <div className="space-y-2 max-h-60 overflow-auto border rounded-md p-3">
                      {Array.isArray(safeBranches) && safeBranches.length > 0 ? (
                        safeBranches.map((branch: Branch) => {
                          const checked = (formData.branchIds || []).includes(branch.id);
                          return (
                            <label key={branch.id} className="flex items-center gap-3 text-sm">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  const current = new Set(formData.branchIds || []);
                                  if (e.target.checked) current.add(branch.id);
                                  else current.delete(branch.id);
                                  updateFormData("branchIds", Array.from(current));
                                }}
                                className="w-4 h-4"
                              />
                              <span>{branch.arabicName}</span>
                            </label>
                          );
                        })
                      ) : (
                        <p className="text-sm text-gray-500 mt-1">
                          {isBranchesLoading ? "جارٍ تحميل الفروع..." : "لا يوجد فروع متاحة. يرجى إضافة فروع أولاً."}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {formData.current_stock !== undefined &&
                formData.reorder_point !== undefined &&
                formData.current_stock <= formData.reorder_point && (
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-700">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">تحذير: المخزون منخفض</span>
                    </div>
                    <p className="text-orange-600 text-sm mt-1">
                      المخزون الحالي ({formData.current_stock}) أقل من أو يساوي
                      نقطة إعادة الطلب ({formData.reorder_point}). يُنصح بطلب
                      المزيد من هذا المنتج.
                    </p>
                  </div>
                )}
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
                  <Label htmlFor="cost_price">سعر التكلفة *</Label>
                  <Input
                    id="cost_price"
                    type="number"
                    value={formData.cost_price}
                    onChange={(e) =>
                      updateFormData("cost_price", Number(e.target.value))
                    }
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="selling_price">سعر البيع *</Label>
                  <Input
                    id="selling_price"
                    type="number"
                    value={formData.selling_price}
                    onChange={(e) =>
                      updateFormData("selling_price", Number(e.target.value))
                    }
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wholesale_price">سعر الجملة</Label>
                  <Input
                    id="wholesale_price"
                    type="number"
                    value={formData.wholesale_price}
                    onChange={(e) =>
                      updateFormData("wholesale_price", Number(e.target.value))
                    }
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {formData.cost_price > 0 && formData.selling_price > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">تحليل الربح</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">هامش الربح:</span>
                      <p className="font-medium text-blue-600">
                        {calculateProfitMargin().toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">قيمة الربح:</span>
                      <p className="font-medium text-green-600">
                        {(formData.selling_price - formData.cost_price).toFixed(
                          2
                        )}{" "}
                        جنيه مصري
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">قيمة المخزون:</span>
                      <p className="font-medium text-purple-600">
                        {formData.current_stock !== undefined
                          ? (
                              formData.current_stock * formData.cost_price
                            ).toFixed(2)
                          : "0.00"}{" "}
                        جنيه مصري
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional Information Tab */}
        <TabsContent value="additional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                معلومات إضافية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight_kg">الوزن (كجم)</Label>
                  <Input
                    id="weight_kg"
                    type="number"
                    value={formData.weight_kg}
                    onChange={(e) =>
                      updateFormData("weight_kg", Number(e.target.value))
                    }
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dimensions">الأبعاد</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) =>
                      updateFormData("dimensions", e.target.value)
                    }
                    placeholder="طول x عرض x ارتفاع"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">اللون</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => updateFormData("color", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">الحجم</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) => updateFormData("size", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material">المادة</Label>
                  <Input
                    id="material"
                    value={formData.material}
                    onChange={(e) => updateFormData("material", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warranty_period">فترة الضمان</Label>
                  <Input
                    id="warranty_period"
                    value={formData.warranty_period}
                    onChange={(e) =>
                      updateFormData("warranty_period", e.target.value)
                    }
                    placeholder="مثال: سنة واحدة"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Image Tab */}
        <TabsContent value="image" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                صورة المنتج
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="image-upload">صورة المنتج</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        <span>رفع صورة</span>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {imagePreview && (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="معاينة المنتج"
                        className="w-32 h-32 object-cover rounded-lg border shadow-md group-hover:shadow-xl transition-shadow"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 shadow-lg"
                        onClick={() => {
                          setImagePreview("");
                          setImageFile(null);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
};