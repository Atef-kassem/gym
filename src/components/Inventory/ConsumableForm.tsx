import { useState, useEffect, useCallback } from "react";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Zap,
  Save,
  X,
  Upload,
  AlertTriangle,
  Droplets,
  Package,
  RefreshCw,
} from "lucide-react";
import { useGetAllCategoriesQuery } from "@/services/categoriesApi";
import { useGetAllSuppliersQuery } from "@/services/suppliersApi";
import { useGetAllBranchesQuery } from "@/services/branchesApi";
import { useCreateConsumableMutation, useUpdateConsumableMutation } from "@/services/consumableApi";
import { useGetAllWarehousesQuery } from "@/services/warehouseApi";
import { getImageUrl } from "@/utils/imageHelpers";

interface Consumable {
  id?: string;
  code: string;
  nameAr: string;
  nameEn: string;
  type: "مستهلكات";
  categoryId: number;
  unitId: number;
  consumptionRate: number;
  unitCost: number;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  supplierId: number;
  endDate?: string;
  batchNumber?: string;
  warehouseId: number;
  shelfLocation: string;
  storageConditions?: string;
  isActive: boolean;
  description: string;
  attachmentImage?: string;
  branchId: number;
}

interface ConsumableFormProps {
  editingConsumable?: Consumable | null;
  onSave: (item: Consumable) => void;
  onCancel: () => void;
}

export const ConsumableForm: React.FC<ConsumableFormProps> = ({
  editingConsumable,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Consumable>({
    code: editingConsumable?.code || "",
    nameAr: editingConsumable?.nameAr || "",
    nameEn: editingConsumable?.nameEn || "",
    type: "مستهلكات",
    categoryId: editingConsumable?.categoryId || 0,
    unitId: editingConsumable?.unitId || 1, // Default to first unit
    consumptionRate: editingConsumable?.consumptionRate || 0,
    unitCost: editingConsumable?.unitCost || 0,
    currentStock: editingConsumable?.currentStock || 0,
    minStock: editingConsumable?.minStock || 5,
    maxStock: editingConsumable?.maxStock || 100,
    reorderPoint: editingConsumable?.reorderPoint || 10,
    supplierId: editingConsumable?.supplierId || 0,
    endDate: editingConsumable?.endDate || "",
    batchNumber: editingConsumable?.batchNumber || "",
    warehouseId: editingConsumable?.warehouseId || 0,
    shelfLocation: editingConsumable?.shelfLocation || "",
    storageConditions: editingConsumable?.storageConditions || "",
    isActive: editingConsumable?.isActive ?? true,
    description: editingConsumable?.description || "",
    attachmentImage: editingConsumable?.attachmentImage || "",
    branchId: editingConsumable?.branchId || 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    editingConsumable?.attachmentImage ? (getImageUrl(editingConsumable.attachmentImage) || "") : ""
  );
  const [activeTab, setActiveTab] = useState("basic");
  const [error, setError] = useState<string | null>(null);

  // Fetch dynamic data from APIs
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useGetAllCategoriesQuery(undefined);
  const {
    data: suppliersData,
    isLoading: isSuppliersLoading,
    error: suppliersError,
  } = useGetAllSuppliersQuery(undefined);
  console.log("suppliersData", suppliersData);
  const {
    data: warehousesData,
    isLoading: isWarehousesLoading,
    error: warehousesError,
  } = useGetAllWarehousesQuery(undefined);
  const {
    data: branchesData,
    isLoading: isBranchesLoading,
    error: branchesError,
  } = useGetAllBranchesQuery(undefined);
  const [createConsumable, { isLoading: isCreating }] =
    useCreateConsumableMutation();
  const [updateConsumable, { isLoading: isUpdating }] =
    useUpdateConsumableMutation();

  // Function to generate automatic consumable code
  const generateConsumableCode = useCallback(() => {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const code = `CNS-${timestamp}-${randomSuffix}`;
    return code;
  }, []);

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

  const categories = safeNormalizeData(categoriesData, "categories");
  const suppliers = safeNormalizeData(suppliersData, "suppliers");
  const warehouses = safeNormalizeData(warehousesData, "warehouses");
  const branches = safeNormalizeData(branchesData, "branches");
  
  // Debug: طباعة البيانات المحملة
  console.log("🔍 البيانات المحملة:", {
    categories: {
      count: categories.length,
      first: categories[0],
      sample: categories.slice(0, 3)
    },
    warehouses: {
      count: warehouses.length,
      first: warehouses[0],
      sample: warehouses.slice(0, 3)
    },
    branches: {
      count: branches.length,
      first: branches[0],
      sample: branches.slice(0, 3)
    }
  });
  
  console.log("🏭 warehouses normalized:", warehouses);
  console.log("🏭 warehousesData structure:", {
    isArray: Array.isArray(warehousesData),
    hasData: warehousesData?.data,
    dataIsArray: Array.isArray(warehousesData?.data),
    dataWarehouses: warehousesData?.data?.warehouses,
    directWarehouses: warehousesData?.warehouses
  });

  const units = [
    { id: 1, name: "لتر" },
    { id: 2, name: "ملليلتر" },
    { id: 3, name: "كيلوجرام" },
    { id: 4, name: "جرام" },
    { id: 5, name: "  " },
    { id: 6, name: "متر" },
    { id: 7, name: "علبة" },
    { id: 8, name: "زجاجة" },
  ];

  const storageConditionOptions = [
    "درجة حرارة الغرفة",
    "بارد وجاف",
    "مبرد (2-8°م)",
    "مجمد (-18°م)",
    "بعيداً عن أشعة الشمس",
    "في مكان جيد التهوية",
  ];

  const updateFormData = (field: keyof Consumable, value: any) => {
    console.log(`Updating ${field} with value:`, value);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Generate automatic consumable code and set default values when component mounts
  useEffect(() => {
    if (!editingConsumable) {
      const newCode = generateConsumableCode();
      
      // Set default values from available data
      const defaultCategoryId = categories.length > 0 ? categories[0].category_id : 0;
      const defaultUnitId = units.length > 0 ? units[0].id : 1;
      const defaultWarehouseId = warehouses.length > 0 ? warehouses[0].warehouse_id : 0;
      const defaultBranchId = branches.length > 0 ? branches[0].id || branches[0].branch_id : 0;
      
      setFormData((prev) => ({
        ...prev,
        code: newCode,
        categoryId: defaultCategoryId,
        unitId: defaultUnitId,
        warehouseId: defaultWarehouseId,
        branchId: defaultBranchId,
      }));
    }
  }, [editingConsumable, generateConsumableCode, categories, warehouses, branches]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // التحقق من الحقول المطلوبة
    if (!formData.code) {
      setError("يرجى إدخال كود المادة المستهلكة");
      return;
    }
    
    if (!formData.nameAr) {
      setError("يرجى إدخال اسم المادة بالعربية");
      return;
    }
    
    if (!formData.nameEn) {
      setError("يرجى إدخال اسم المادة بالإنجليزية");
      return;
    }
    
    if (formData.categoryId <= 0) {
      setError("يرجى اختيار فئة للمادة المستهلكة");
      return;
    }
    
    if (formData.unitId <= 0) {
      setError("يرجى اختيار وحدة قياس للمادة المستهلكة");
      return;
    }
    
    if (formData.consumptionRate <= 0) {
      setError("يرجى إدخال معدل الاستهلاك");
      return;
    }
    
    if (formData.unitCost <= 0) {
      setError("يرجى إدخال تكلفة الوحدة");
      return;
    }
    
    if (formData.warehouseId <= 0) {
      setError("يرجى اختيار مستودع للمادة المستهلكة");
      return;
    }
    
    if (!formData.shelfLocation) {
      setError("يرجى إدخال موقع الرف");
      return;
    }
    
    if (formData.minStock < 0) {
      setError("الحد الأدنى للمخزون يجب أن يكون صفر أو أكثر");
      return;
    }
    
    if (formData.maxStock <= formData.minStock) {
      setError("الحد الأقصى للمخزون يجب أن يكون أكبر من الحد الأدنى");
      return;
    }
    
    if (formData.branchId <= 0) {
      setError("يرجى اختيار فرع للمادة المستهلكة");
      return;
    }

    // تحضير البيانات للإرسال مع معالجة القيم الفارغة
    const formDataToSend = new FormData();
    
    // إضافة الحقول الأساسية
    formDataToSend.append("code", formData.code);
    formDataToSend.append("nameAr", formData.nameAr);
    formDataToSend.append("nameEn", formData.nameEn);
    formDataToSend.append("type", formData.type);
    
    // إضافة الحقول المطلوبة مع التحقق من القيم
    if (formData.categoryId > 0) {
      formDataToSend.append("categoryId", String(formData.categoryId));
    }
    
    if (formData.unitId > 0) {
      formDataToSend.append("unitId", String(formData.unitId));
    }
    
    if (formData.consumptionRate > 0) {
      formDataToSend.append("consumptionRate", String(formData.consumptionRate));
    }
    
    if (formData.unitCost > 0) {
      formDataToSend.append("unitCost", String(formData.unitCost));
    }
    
    // إضافة الحقول الاختيارية
    formDataToSend.append("currentStock", String(formData.currentStock || 0));
    formDataToSend.append("minStock", String(formData.minStock || 5));
    formDataToSend.append("maxStock", String(formData.maxStock || 100));
    formDataToSend.append("reorderPoint", String(formData.reorderPoint || 10));
    
    // إضافة المورد إذا تم اختياره
    if (formData.supplierId > 0) {
      formDataToSend.append("supplierId", String(formData.supplierId));
    }
    
    // إضافة المستودع إذا تم اختياره
    if (formData.warehouseId > 0) {
      formDataToSend.append("warehouseId", String(formData.warehouseId));
    }
    
    // إضافة الفرع إذا تم اختياره
    if (formData.branchId > 0) {
      formDataToSend.append("branchId", String(formData.branchId));
    }
    
    // إضافة الحقول الاختيارية الأخرى
    if (formData.endDate) {
      formDataToSend.append("endDate", formData.endDate);
    }
    
    if (formData.batchNumber) {
      formDataToSend.append("batchNumber", formData.batchNumber);
    }
    
    if (formData.shelfLocation) {
      formDataToSend.append("shelfLocation", formData.shelfLocation);
    }
    
    if (formData.storageConditions) {
      formDataToSend.append("storageConditions", formData.storageConditions);
    }
    
    formDataToSend.append("isActive", String(formData.isActive));
    
    if (formData.description) {
      formDataToSend.append("description", formData.description);
    }

    if (imageFile) {
      formDataToSend.append("attachmentImage", imageFile);
      console.log('📸 إضافة صورة جديدة للـ FormData');
    } else if (editingConsumable && editingConsumable.attachmentImage) {
      // إذا كنا في وضع التعديل ولم يتم اختيار صورة جديدة، احتفظ بالصورة القديمة
      formDataToSend.append("attachmentImage", editingConsumable.attachmentImage);
      console.log('📸 الاحتفاظ بالصورة القديمة:', editingConsumable.attachmentImage);
    }

    // طباعة البيانات المرسلة للتشخيص
    console.log("📤 البيانات المرسلة:", {
      code: formData.code,
      nameAr: formData.nameAr,
      nameEn: formData.nameEn,
      categoryId: formData.categoryId,
      unitId: formData.unitId,
      warehouseId: formData.warehouseId,
      branchId: formData.branchId,
      formDataToSend: Object.fromEntries(formDataToSend.entries())
    });

    try {
      if (editingConsumable && editingConsumable.id) {
        // تحديث مادة مستهلكة موجودة
        await updateConsumable({
          id: editingConsumable.id,
          updatedConsumable: formDataToSend
        }).unwrap();
        console.log('✅ تم تحديث المادة المستهلكة بنجاح');
      } else {
        // إنشاء مادة مستهلكة جديدة
        await createConsumable(formDataToSend).unwrap();
        console.log('✅ تم إنشاء المادة المستهلكة بنجاح');
      }
      onSave(formData);
    } catch (err) {
      setError(editingConsumable ? "فشل في تحديث المادة المستهلكة. حاول مرة أخرى." : "فشل في إنشاء المادة المستهلكة. حاول مرة أخرى.");
      console.error("Error with consumable:", err);
    }
  };

  const calculateMonthlyCost = () => {
    const dailyUsage = formData.consumptionRate * 10;
    const monthlyUsage = dailyUsage * 30;
    return monthlyUsage * formData.unitCost;
  };

  // Render error message if any API call fails
  if (categoriesError || suppliersError || warehousesError || branchesError) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
        خطأ في تحميل البيانات: يرجى التحقق من اتصالك بالإنترنت أو المحاولة
        لاحقًا.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">
          {editingConsumable ? "تعديل مادة مستهلكة" : "إضافة مواد مستهلكة جديدة"}
        </h2>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 ml-2" />
            إلغاء
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating}>
            <Save className="h-4 w-4 ml-2" />
            {(isCreating || isUpdating) ? "جارٍ الحفظ..." : editingConsumable ? "تحديث المادة المستهلكة" : "حفظ المادة المستهلكة"}
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
          <TabsTrigger value="consumption">الاستهلاك</TabsTrigger>
          <TabsTrigger value="inventory">المخزون</TabsTrigger>
          <TabsTrigger value="safety">السلامة والتخزين</TabsTrigger>
          <TabsTrigger value="additional">معلومات إضافية</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                المعلومات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">كود المادة المستهلكة *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => updateFormData("code", e.target.value)}
                      placeholder="سيتم التوليد تلقائياً"
                      required
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateFormData("code", generateConsumableCode())}
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
                  <Label htmlFor="categoryId">الفئة</Label>
                  <Select
                    value={String(formData.categoryId)}
                    onValueChange={(value) =>
                      updateFormData("categoryId", Number(value))
                    }
                    disabled={isCategoriesLoading || categories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isCategoriesLoading
                            ? "جارٍ التحميل..."
                            : categories.length === 0
                            ? "لا يوجد فئات متاحة"
                            : formData.categoryId
                            ? categories.find(
                                (c: any) =>
                                  c.category_id === formData.categoryId
                              )?.name_ar || "اختر الفئة"
                            : "اختر الفئة"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length > 0 ? (
                        categories.map((category: any) => (
                          <SelectItem
                            key={category.category_id}
                            value={String(category.category_id)}
                          >
                            {category.name_ar}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          لا يوجد فئات متاحة
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {categories.length === 0 && !isCategoriesLoading && (
                    <p className="text-sm text-gray-500 mt-1">
                      لا يوجد فئات متاحة. يرجى إضافة فئات أولاً.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameAr">اسم المادة بالعربية *</Label>
                  <Input
                    id="nameAr"
                    value={formData.nameAr}
                    onChange={(e) => updateFormData("nameAr", e.target.value)}
                    placeholder="صابون   مركز"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameEn">اسم المادة بالإنجليزية *</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => updateFormData("nameEn", e.target.value)}
                    placeholder="Concentrated Wash Soap"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unitId">وحدة القياس *</Label>
                  <Select
                    value={String(formData.unitId)}
                    onValueChange={(value) =>
                      updateFormData("unitId", Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الوحدة" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={String(unit.id)}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isActive">الحالة</Label>
                  <Select
                    value={formData.isActive ? "نشط" : "غير نشط"}
                    onValueChange={(value) =>
                      updateFormData("isActive", value === "نشط")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نشط">نشط</SelectItem>
                      <SelectItem value="غير نشط">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>
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
                  placeholder="وصف المادة المستهلكة..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consumption" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                معدل الاستهلاك
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="consumptionRate">
                    معدل الاستهلاك لكل خدمة *
                  </Label>
                  <Input
                    id="consumptionRate"
                    type="number"
                    value={formData.consumptionRate}
                    onChange={(e) =>
                      updateFormData(
                        "consumptionRate",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    min="0"
                    step="0.01"
                    placeholder="الكمية المستهلكة لكل خدمة"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitCost">تكلفة الوحدة الواحدة (جنيه مصري) *</Label>
                  <Input
                    id="unitCost"
                    type="number"
                    value={formData.unitCost}
                    onChange={(e) =>
                      updateFormData(
                        "unitCost",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {formData.consumptionRate > 0 && formData.unitCost > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">تحليل التكلفة</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">تكلفة لكل خدمة:</span>
                      <p className="font-medium text-blue-600">
                        {(formData.consumptionRate * formData.unitCost).toFixed(
                          2
                        )}{" "}
                        جنيه مصري
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        التكلفة الشهرية المقدرة:
                      </span>
                      <p className="font-medium text-orange-600">
                        {calculateMonthlyCost().toFixed(2)} جنيه مصري
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        عدد الخدمات المتاحة:
                      </span>
                      <p className="font-medium text-green-600">
                        {formData.consumptionRate > 0
                          ? Math.floor(
                              formData.currentStock / formData.consumptionRate
                            )
                          : 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                إدارة المخزون
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="warehouseId">المستودع *</Label>
                  <Select
                    value={String(formData.warehouseId)}
                    onValueChange={(value) =>
                      updateFormData("warehouseId", Number(value))
                    }
                    disabled={isWarehousesLoading || warehouses.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isWarehousesLoading
                            ? "جارٍ التحميل..."
                            : warehouses.length === 0
                            ? "لا يوجد مستودعات متاحة"
                            : formData.warehouseId
                            ? warehouses.find(
                                (w: any) => w.warehouse_id === formData.warehouseId
                              )?.name_ar || "اختر المستودع"
                            : "اختر المستودع"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.length > 0 ? (
                        warehouses.map((warehouse: any) => (
                          <SelectItem
                            key={warehouse.warehouse_id}
                            value={String(warehouse.warehouse_id)}
                          >
                            {warehouse.name_ar}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          لا يوجد مستودعات متاحة
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {warehouses.length === 0 && !isWarehousesLoading && (
                    <p className="text-sm text-gray-500 mt-1">
                      لا يوجد مستودعات متاحة. يرجى إضافة مستودعات أولاً.
                    </p>
                  )}


                </div>
                <div className="space-y-2">
                  <Label htmlFor="shelfLocation">موقع الرف *</Label>
                  <Input
                    id="shelfLocation"
                    value={formData.shelfLocation}
                    onChange={(e) =>
                      updateFormData("shelfLocation", e.target.value)
                    }
                    placeholder="مثل: C-01-05"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentStock">المخزون الحالي</Label>
                  <Input
                    id="currentStock"
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) =>
                      updateFormData(
                        "currentStock",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">الحد الأدنى *</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={formData.minStock}
                    onChange={(e) =>
                      updateFormData(
                        "minStock",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStock">الحد الأقصى *</Label>
                  <Input
                    id="maxStock"
                    type="number"
                    value={formData.maxStock}
                    onChange={(e) =>
                      updateFormData(
                        "maxStock",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reorderPoint">نقطة إعادة الطلب</Label>
                  <Input
                    id="reorderPoint"
                    type="number"
                    value={formData.reorderPoint}
                    onChange={(e) =>
                      updateFormData(
                        "reorderPoint",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplierId">المورد</Label>
                  <Select
                    value={String(formData.supplierId)}
                    onValueChange={(value) =>
                      updateFormData("supplierId", Number(value))
                    }
                    disabled={isSuppliersLoading || suppliers.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isSuppliersLoading
                            ? "جارٍ التحميل..."
                            : suppliers.length === 0
                            ? "لا يوجد موردين متاحين"
                            : formData.supplierId
                            ? suppliers.find(
                                (s: any) =>
                                  s.supplier_id === formData.supplierId
                              )?.name_ar || "اختر المورد"
                            : "اختر المورد"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.length > 0 ? (
                        suppliers.map((supplier: any) => (
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
                  {suppliers.length === 0 && !isSuppliersLoading && (
                    <p className="text-sm text-gray-500 mt-1">
                      لا يوجد موردين متاحين. يرجى إضافة موردين أولاً.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">تاريخ الانتهاء</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateFormData("endDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batchNumber">رقم الدفعة</Label>
                  <Input
                    id="batchNumber"
                    value={formData.batchNumber}
                    onChange={(e) =>
                      updateFormData("batchNumber", e.target.value)
                    }
                    placeholder="رقم دفعة الإنتاج"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branchId">الفرع *</Label>
                <Select
                  value={String(formData.branchId)}
                  onValueChange={(value) =>
                    updateFormData("branchId", Number(value))
                  }
                  disabled={isBranchesLoading || branches.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isBranchesLoading
                          ? "جارٍ التحميل..."
                          : branches.length === 0
                          ? "لا يوجد فروع متاحة"
                          : formData.branchId
                          ? branches.find(
                              (b: any) => b.id === formData.branchId
                            )?.arabicName || "اختر الفرع"
                          : "اختر الفرع"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.length > 0 ? (
                      branches.map((branch: any) => (
                        <SelectItem key={branch.id} value={String(branch.id)}>
                          {branch.arabicName}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        لا يوجد فروع متاحة
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {branches.length === 0 && !isBranchesLoading && (
                  <p className="text-sm text-gray-500 mt-1">
                    لا يوجد فروع متاحة. يرجى إضافة فروع أولاً.
                  </p>
                )}
              </div>

              {formData.currentStock <= formData.reorderPoint && (
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-700">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">تحذير: المخزون منخفض</span>
                  </div>
                  <p className="text-orange-600 text-sm mt-1">
                    المخزون الحالي ({formData.currentStock}) أقل من أو يساوي
                    نقطة إعادة الطلب ({formData.reorderPoint}). يُنصح بطلب
                    المزيد من هذه المادة.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                السلامة وظروف التخزين
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storageConditions">ظروف التخزين</Label>
                <Select
                  value={formData.storageConditions}
                  onValueChange={(value) =>
                    updateFormData("storageConditions", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر ظروف التخزين" />
                  </SelectTrigger>
                  <SelectContent>
                    {storageConditionOptions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">إرشادات السلامة</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• احفظ المادة في مكان جاف وبارد</li>
                  <li>• تجنب التعرض المباشر لأشعة الشمس</li>
                  <li>• استخدم معدات الحماية الشخصية</li>
                  <li>• اقرأ بطاقة السلامة قبل الاستخدام</li>
                  <li>• تأكد من التهوية الجيدة في منطقة التخزين</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="additional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                صورة المادة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="image-upload">صورة المادة المستهلكة</Label>
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
                        alt="معاينة المادة"
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
