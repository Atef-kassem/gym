import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Save, 
  X, 
  Upload, 
  Image as ImageIcon,
  DollarSign,
  Wrench,
  Calendar,
  Car,
  Search,
  Package,
  RefreshCw
} from "lucide-react";
import { useGetAllWarehousesQuery } from "@/services/warehouseApi";
import { useGetAllSuppliersQuery } from "@/services/suppliersApi";
import { useGetAllMainCategoriesQuery } from "@/services/mainCategoryApi";
import { useGetSubCategoriesByMainQuery } from "@/services/subCategoryApi";
import { useGetAllBranchesQuery } from "@/services/branchesApi";
import { useCreateSparePartMutation } from "@/services/sparePartApi";
import { useCreateInventoryMutation, useSetStockMutation } from "@/services/inventoryApi";
import { useToast } from "@/hooks/use-toast";

interface SparePart {
  id?: string;
  code: string;
  nameAr: string;
  nameEn: string;
  type: "   مشروب ومنتجات";
  category: string;
  subcategory?: string;
  oem_number: string; // رقم  ة الأصلي
  aftermarket_number?: string; // رقم  ة البديل
  brand: string;
  manufacturer: string;
  unit: string;
  price: number;
  costPrice: number;
  wholesalePrice?: number;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  supplier: string;
  warranty: string; // فترة الضمان
  warrantyType: "أشهر" | "سنوات" | "كيلومترات";
  compatible_vehicles: string[]; // المركبات المتوافقة
  vehicle_years: string; // سنوات الصنع المتوافقة
  position: string; // موقع  ة في المشروب
  material?: string; // مادة التصنيع
  weight?: number; // الوزن
  dimensions?: string; // الأبعاد
  installation_difficulty: "سهل" | "متوسط" | "صعب"; // صعوبة التركيب
  installation_time?: number; // وقت التركيب بالدقائق
  tools_required?: string[]; // الأدوات المطلوبة
  warehouse: string;
  shelfLocation?: string;
  isOEM: boolean; //    أصلية أم بديلة
  condition: "جديد" | "مجدد" | "مستعمل";
  status: "نشط" | "غير نشط";
  description: string;
  image?: string;
  appliedBranches: string[];
  applyToAllBranches: boolean;
}

interface SparePartFormProps {
  editingSparePart?: SparePart | null;
  onSave: (sparePart: SparePart) => void;
  onCancel: () => void;
}

export const SparePartForm: React.FC<SparePartFormProps> = ({ editingSparePart, onSave, onCancel }) => {
  const [formData, setFormData] = useState<SparePart>({
    code: editingSparePart?.code || "",
    nameAr: editingSparePart?.nameAr || "",
    nameEn: editingSparePart?.nameEn || "",
    type: "   مشروب ومنتجات",
    category: editingSparePart?.category || "",
    subcategory: editingSparePart?.subcategory || "",
    oem_number: editingSparePart?.oem_number || "",
    aftermarket_number: editingSparePart?.aftermarket_number || "",
    brand: editingSparePart?.brand || "",
    manufacturer: editingSparePart?.manufacturer || "",
    unit: editingSparePart?.unit || "  ",
    price: editingSparePart?.price || 0,
    costPrice: editingSparePart?.costPrice || 0,
    wholesalePrice: editingSparePart?.wholesalePrice || 0,
    currentStock: editingSparePart?.currentStock || 0,
    minStock: editingSparePart?.minStock || 1,
    maxStock: editingSparePart?.maxStock || 50,
    reorderPoint: editingSparePart?.reorderPoint || 5,
    supplier: editingSparePart?.supplier || "",
    warranty: editingSparePart?.warranty || "12",
    warrantyType: editingSparePart?.warrantyType || "أشهر",
    compatible_vehicles: editingSparePart?.compatible_vehicles || [],
    vehicle_years: editingSparePart?.vehicle_years || "",
    position: editingSparePart?.position || "",
    material: editingSparePart?.material || "",
    weight: editingSparePart?.weight || 0,
    dimensions: editingSparePart?.dimensions || "",
    installation_difficulty: editingSparePart?.installation_difficulty || "متوسط",
    installation_time: editingSparePart?.installation_time || 0,
    tools_required: editingSparePart?.tools_required || [],
    warehouse: editingSparePart?.warehouse || "main",
    shelfLocation: editingSparePart?.shelfLocation || "",
    isOEM: editingSparePart?.isOEM || true,
    condition: editingSparePart?.condition || "جديد",
    status: editingSparePart?.status || "نشط",
    description: editingSparePart?.description || "",
    image: editingSparePart?.image || "",
    appliedBranches: editingSparePart?.appliedBranches || ["main"],
    applyToAllBranches: editingSparePart?.applyToAllBranches || false,
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [imagePreview, setImagePreview] = useState<string>(editingSparePart?.image || "");

  const { data: warehousesResp } = useGetAllWarehousesQuery(undefined as any);
  const warehousesList: Array<{ value: string; label: string; id: number }> = useMemo(() => {
    const arr = (warehousesResp as any)?.data?.warehouses || [];
    return arr.map((w: any) => ({ value: String(w.warehouse_id), label: w.name_ar || w.name_en || w.warehouse_code, id: w.warehouse_id }));
  }, [warehousesResp]);

  const { data: suppliersResp } = useGetAllSuppliersQuery(undefined as any);
  const suppliersList: Array<{ value: string; label: string; id: number }> = useMemo(() => {
    const arr = (suppliersResp as any)?.data?.suppliers || (suppliersResp as any)?.suppliers || [];
    return Array.isArray(arr) ? arr.map((s: any) => ({ value: String(s.supplier_id || s.id), label: s.name_ar || s.name_en || s.name, id: s.supplier_id || s.id })) : [];
  }, [suppliersResp]);

  const { data: categoriesResp } = useGetAllMainCategoriesQuery(undefined as any);
  const categoriesList: Array<{ value: string; label: string; id: number }> = useMemo(() => {
    const arr = (categoriesResp as any)?.data?.mainCategories || (categoriesResp as any)?.mainCategories || [];
    return Array.isArray(arr)
      ? arr.map((c: any) => ({ value: String(c.id), label: c.name || c.name_ar || c.name_en || `الفئة ${c.id}` , id: c.id }))
      : [];
  }, [categoriesResp]);
  // تمت إزالة رسائل الأخطاء (console.log)

  const selectedMainCategory = useMemo(() => {
    const parsed = Number(formData.category);
    return isNaN(parsed) ? undefined : parsed;
  }, [formData.category]);
  const { data: subcategoriesResp } = useGetSubCategoriesByMainQuery(selectedMainCategory as any, { skip: !selectedMainCategory } as any);
  const subcategoriesList: Array<{ value: string; label: string; id: number }> = useMemo(() => {
    const arr = (subcategoriesResp as any)?.data?.subCategories || (subcategoriesResp as any)?.subCategories || [];
    return Array.isArray(arr)
      ? arr.map((c: any) => ({ value: String(c.id), label: c.name || c.name_ar || c.name_en || `فرعي ${c.id}`, id: c.id }))
      : [];
  }, [subcategoriesResp]);

  const { data: branchesResp } = useGetAllBranchesQuery(undefined as any);
  const branchesList: Array<{ value: string; label: string; id: number }> = useMemo(() => {
    const arr = (branchesResp as any)?.data?.branches || (branchesResp as any)?.branches || [];
    return Array.isArray(arr) ? arr.map((b: any) => ({ value: String(b.id), label: b.arabicName || b.englishName, id: b.id })) : [];
  }, [branchesResp]);

  const [createSparePart] = useCreateSparePartMutation();
  const [createInventory] = useCreateInventoryMutation();
  const [setStock] = useSetStockMutation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // تحويل الحقول إلى ما يناسب API الخلفي
      const warehouseId = Number(formData.warehouse);
      const supplierId = suppliersList.find(s => s.value === formData.supplier)?.id || undefined;
      const mainCategoryId = selectedMainCategory;
      const subCategoryId = (() => {
        const parsed = Number(formData.subcategory);
        return isNaN(parsed) ? undefined : parsed;
      })();

      const payload = {
        sparePartCode: formData.code,
        arabicName: formData.nameAr,
        englishName: formData.nameEn,
        mainCategory_Id: mainCategoryId || null,
        subCategory_Id: subCategoryId ?? null,
        originalPartNumber: formData.oem_number,
        alternativePartNumber: formData.aftermarket_number || null,
        brand: formData.brand || null,
        manufacturer: formData.manufacturer || null,
        partStatus: formData.condition || "جديد",
        description: formData.description || null,
        compatibleVehicles: formData.compatible_vehicles || [],
        compatibleYears: formData.vehicle_years ? [formData.vehicle_years] : [],
        partLocationInCar: formData.position ? [formData.position] : [],
        warrantyPeriod: formData.warranty || null,
        warrantyType: formData.warrantyType || null,
        status: formData.status || "نشط",
        warehouse_id: isNaN(warehouseId) ? null : warehouseId,
        shelfLocation: formData.shelfLocation || null,
        currentStock: Number(formData.currentStock || 0),
        minimumStock: Number(formData.minStock || 0),
        maximumStock: Number(formData.maxStock || 0),
        reorderPoint: Number(formData.reorderPoint || 0),
        costPrice: Number(formData.costPrice || 0),
        sellingPrice: Number(formData.price || 0),
        wholesalePrice: Number(formData.wholesalePrice || 0),
        supplier_id: supplierId || null,
        branch_Id: branchesList[0]?.id || 1,
      } as any;

      const resp = await createSparePart(payload).unwrap();

      // إنشاء سجل مخزون أو ضبطه لل  
      if (!isNaN(warehouseId)) {
        const productId = String(payload.sparePartCode);
        const newStock = Number(formData.currentStock || 0);
        try {
          await createInventory({
            product_id: productId,
            warehouse_id: warehouseId,
            shelf_location: formData.shelfLocation || null,
            current_stock: newStock,
            min_stock: Number(formData.minStock || 0),
            max_stock: Number(formData.maxStock || 0),
            reorder_point: Number(formData.reorderPoint || 0),
          } as any).unwrap();
        } catch (inventoryError) {
          try {
            // إرسال البيانات بالشكل الذي يتوقعه الخادم
            const setStockData = { 
              productId, 
              warehouseId, 
              newStock: { newStock } // إرسال كائن يحتوي على newStock
            };
            
            await setStock(setStockData as any).unwrap();
          } catch (stockError) {
            console.error("❌ فشل في تحديث المخزون:", stockError);
            // لا نريد إيقاف العملية إذا فشل المخزون
          }
        }
      }

      // رسالة نجاح
      toast({ 
        title: "✅ تم الحفظ بنجاح", 
        description: "تم إنشاء       وربط المخزون بنجاح",
        duration: 5000, // عرض الرسالة لمدة 5 ثوان
        variant: "default"
      });
      
      // تفريغ الحقول بعد الحفظ الناجح
      const newCode = generateSparePartCode();
      setFormData({
        code: newCode,
        nameAr: "",
        nameEn: "",
        type: "   مشروب ومنتجات",
        category: "",
        subcategory: "",
        oem_number: "",
        aftermarket_number: "",
        brand: "",
        manufacturer: "",
        unit: "  ",
        price: 0,
        costPrice: 0,
        wholesalePrice: 0,
        currentStock: 0,
        minStock: 1,
        maxStock: 50,
        reorderPoint: 5,
        supplier: "",
        warranty: "12",
        warrantyType: "أشهر",
        compatible_vehicles: [],
        vehicle_years: "",
        position: "",
        material: "",
        weight: 0,
        dimensions: "",
        installation_difficulty: "متوسط",
        installation_time: 0,
        tools_required: [],
        warehouse: "main",
        shelfLocation: "",
        isOEM: true,
        condition: "جديد",
        status: "نشط",
        description: "",
        image: "",
        appliedBranches: ["main"],
        applyToAllBranches: false,
      });
      
      // تفريغ معاينة الصورة
      setImagePreview("");
      
      // إعادة تعيين التبويب النشط
      setActiveTab("basic");
      
      // استدعاء onSave
      onSave(payload);
      
    } catch (error: any) {
      // رسالة خطأ
      console.error("خطأ في إنشاء      :", error);
      toast({ 
        title: "❌ خطأ في الحفظ", 
        description: error?.data?.message || "حدث خطأ أثناء إنشاء      ",
        variant: "destructive"
      });
    }
  };

  const updateFormData = (field: keyof SparePart, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Function to generate automatic spare part code
  const generateSparePartCode = () => {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SP-${timestamp}-${randomSuffix}`;
  };

  // Generate automatic spare part code when component mounts
  useEffect(() => {
    if (!editingSparePart && formData.code === "") {
      setFormData(prev => ({
        ...prev,
        code: generateSparePartCode(),
      }));
    }
  }, [editingSparePart, formData.code]);

  const categories = [
    "نظام المحرك",
    "نظام الفرامل",
    "نظام التعليق",
    "نظام التوجيه",
    "نظام الكهرباء",
    "أجزاء الجسم الخارجي",
    "المكونات الداخلية",
    "نظام التبريد",
    "نظام العادم",
    "الإطارات والجنوط",
    "مستلزمات الصيانة"
  ];

  const subcategories = {
    "نظام المحرك": ["مكابس", "حلقات مكابس", "صمامات", "مضخة مياه", "فلتر زيت", "فلتر هواء"],
    "نظام الفرامل": ["أقراص فرامل", "فحمات فرامل", "سوائل فرامل", "خراطيم فرامل"],
    "نظام التعليق": ["مساعدات", "يايات", "مقابض توجيه", "كج.مي محاور"],
    "نظام التوجيه": ["عجلة قيادة", "مقود", "خراطيم هيدروليك", "مضخة باور"],
    "نظام الكهرباء": ["بطارية", "مولد", "أسلاك", "مصابيح", "حساسات"],
    "أجزاء الجسم الخارجي": ["مصدات", "مرايا", "أبواب", "زجاج", "مقابض"],
    "المكونات الداخلية": ["مقاعد", "تابلوه", "مكيف هواء", "راديو"],
    "نظام التبريد": ["راديتر", "مروحة تبريد", "ترموستات", "خراطيم مياه"],
    "نظام العادم": ["عادم", "كاتم صوت", "حساس أكسجين"],
    "الإطارات والجنوط": ["إطارات", "جنوط", "صمامات هواء"],
    "مستلزمات الصيانة": ["زيوت", "سوائل", "مرشحات", "شموع إشعال"]
  };

  const vehicleBrands = [
    "تويوتا", "نيسان", "هيونداي", "كيا", "فورد", "شيفروليه", "هوندا", "مازدا", "ميتسوبيشي", "سوزوكي",
    "مرسيدس بنز", "BMW", "أودي", "فولكس واجن", "لكزس", "إنفينيتي", "جيب", "لاند روفر"
  ];

  const carPositions = [
    "الأمام الأيمن", "الأمام الأيسر", "الخلف الأيمن", "الخلف الأيسر",
    "المحرك", "علبة التج.م", "نظام العادم", "نظام التبريد",
    "المقصورة الداخلية", "الصندوق الخلفي", "السقف"
  ];

  const commonTools = [
    "مفتاح ربط", "مفك براغي", "كماشة", "مفتاح إنجليزي", "مفتاح سوكت",
    "رافعة مشروب", "حامل مشروب", "مقياس عزم", "مفتاح شرارة", "مفتاح فلتر زيت"
  ];

  const warehouses = warehousesList;

  const branches = branchesList;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        updateFormData("image", result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">إضافة    مشروب ومنتجات جديدة</h2>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => {
            onCancel();
          }}>
            <X className="h-4 w-4 ml-2" />
            إلغاء
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 ml-2" />
            حفظ      
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
          <TabsTrigger value="compatibility">التوافق</TabsTrigger>
          <TabsTrigger value="inventory">المخزون</TabsTrigger>
          <TabsTrigger value="technical">المعلومات الفنية</TabsTrigger>
          <TabsTrigger value="additional">معلومات إضافية</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                المعلومات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">كود       *</Label>
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
                      onClick={() => updateFormData("code", generateSparePartCode())}
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
                  <Label htmlFor="oem_number">رقم  ة الأصلي (OEM) *</Label>
                  <Input
                    id="oem_number"
                    value={formData.oem_number}
                    onChange={(e) => updateFormData("oem_number", e.target.value)}
                    placeholder="12345-67890"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aftermarket_number">رقم  ة البديل</Label>
                  <Input
                    id="aftermarket_number"
                    value={formData.aftermarket_number}
                    onChange={(e) => updateFormData("aftermarket_number", e.target.value)}
                    placeholder="رقم  ة البديلة"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isOEM"
                    checked={formData.isOEM}
                    onCheckedChange={(checked) => updateFormData("isOEM", checked)}
                  />
                  <Label htmlFor="isOEM">   أصلية (OEM)</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameAr">اسم  ة بالعربية *</Label>
                  <Input
                    id="nameAr"
                    value={formData.nameAr}
                    onChange={(e) => updateFormData("nameAr", e.target.value)}
                    placeholder="فلتر زيت المحرك"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameEn">اسم  ة بالإنجليزية</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => updateFormData("nameEn", e.target.value)}
                    placeholder="Engine Oil Filter"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">الفئة الرئيسية *</Label>
                  <Select value={String(formData.category || "")} onValueChange={(value) => updateFormData("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesList.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory">الفئة الفرعية</Label>
                  <Select value={String(formData.subcategory || "")} onValueChange={(value) => updateFormData("subcategory", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة الفرعية" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategoriesList.map((sc) => (
                        <SelectItem key={sc.id} value={String(sc.id)}>
                          {sc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">حالة  ة</Label>
                  <Select value={formData.condition} onValueChange={(value) => updateFormData("condition", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="جديد">جديد</SelectItem>
                      <SelectItem value="مجدد">مجدد</SelectItem>
                      <SelectItem value="مستعمل">مستعمل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">العلامة التجارية *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => updateFormData("brand", e.target.value)}
                    placeholder="مثل: Bosch, Mann"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">الشركة المصنعة</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => updateFormData("manufacturer", e.target.value)}
                    placeholder="اسم الشركة المصنعة"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  placeholder="وصف      ..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vehicle Compatibility Tab */}
        <TabsContent value="compatibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                توافق المركبات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>المركبات المتوافقة</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {vehicleBrands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`vehicle-${brand}`}
                        checked={formData.compatible_vehicles.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData("compatible_vehicles", [...formData.compatible_vehicles, brand]);
                          } else {
                            updateFormData("compatible_vehicles", formData.compatible_vehicles.filter(v => v !== brand));
                          }
                        }}
                      />
                      <Label htmlFor={`vehicle-${brand}`} className="text-sm">
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle_years">سنوات الصنع المتوافقة</Label>
                  <Input
                    id="vehicle_years"
                    value={formData.vehicle_years}
                    onChange={(e) => updateFormData("vehicle_years", e.target.value)}
                    placeholder="مثل: 2010-2020"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">موقع  ة في المشروب</Label>
                  <Select value={formData.position} onValueChange={(value) => updateFormData("position", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر موقع  ة" />
                    </SelectTrigger>
                    <SelectContent>
                      {carPositions.map((pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material">مادة التصنيع</Label>
                  <Input
                    id="material"
                    value={formData.material}
                    onChange={(e) => updateFormData("material", e.target.value)}
                    placeholder="مثل: ألومنيوم, حديد"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">الوزن (كجم)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => updateFormData("weight", Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dimensions">الأبعاد (طول × عرض × ارتفاع)</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) => updateFormData("dimensions", e.target.value)}
                    placeholder="مثل: 10 × 5 × 2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="installation_difficulty">صعوبة التركيب</Label>
                  <Select value={formData.installation_difficulty} onValueChange={(value) => updateFormData("installation_difficulty", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="سهل">سهل</SelectItem>
                      <SelectItem value="متوسط">متوسط</SelectItem>
                      <SelectItem value="صعب">صعب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="installation_time">وقت التركيب (دقائق)</Label>
                  <Input
                    id="installation_time"
                    type="number"
                    value={formData.installation_time}
                    onChange={(e) => updateFormData("installation_time", Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tools_required">الأدوات المطلوبة</Label>
                  <Select value={(formData.tools_required || []).join(", ")} onValueChange={(value) => updateFormData("tools_required", value.split(","))}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الأدوات المطلوبة" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonTools.map((tool) => (
                        <SelectItem key={tool} value={tool}>
                          {tool}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                المخزون
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentStock">المخزون الحالي *</Label>
                  <Input
                    id="currentStock"
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) => updateFormData("currentStock", Number(e.target.value))}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">الحد الأدنى للمخزون *</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => updateFormData("minStock", Number(e.target.value))}
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxStock">الحد الأقصى للمخزون *</Label>
                  <Input
                    id="maxStock"
                    type="number"
                    value={formData.maxStock}
                    onChange={(e) => updateFormData("maxStock", Number(e.target.value))}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reorderPoint">نقطة الطلب *</Label>
                  <Input
                    id="reorderPoint"
                    type="number"
                    value={formData.reorderPoint}
                    onChange={(e) => updateFormData("reorderPoint", Number(e.target.value))}
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="costPrice">سعر التكلفة *</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    value={formData.costPrice}
                    onChange={(e) => updateFormData("costPrice", Number(e.target.value))}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wholesalePrice">سعر التجارة</Label>
                  <Input
                    id="wholesalePrice"
                    type="number"
                    value={formData.wholesalePrice}
                    onChange={(e) => updateFormData("wholesalePrice", Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="warranty">فترة الضمان *</Label>
                  <Input
                    id="warranty"
                    type="number"
                    value={formData.warranty}
                    onChange={(e) => updateFormData("warranty", e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warrantyType">نوع الضمان *</Label>
                  <Select value={formData.warrantyType} onValueChange={(value) => updateFormData("warrantyType", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="أشهر">أشهر</SelectItem>
                      <SelectItem value="سنوات">سنوات</SelectItem>
                      <SelectItem value="كيلومترات">كيلومترات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Information Tab */}
        <TabsContent value="technical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                المعلومات الفنية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">سعر البيع *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => updateFormData("price", Number(e.target.value))}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">وحدة القياس</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => updateFormData("unit", e.target.value)}
                    placeholder="  "
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adminNotes">ملاحظات إدارية</Label>
                <Textarea
                  id="adminNotes"
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  placeholder="ملاحظات إدارية حول      ..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional Information Tab */}
        <TabsContent value="additional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                معلومات إضافية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">المورد *</Label>
                  <Select value={formData.supplier} onValueChange={(value) => updateFormData("supplier", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المورد" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliersList.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warehouse">المستودع *</Label>
                  <Select value={formData.warehouse} onValueChange={(value) => updateFormData("warehouse", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستودع" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((w) => (
                        <SelectItem key={w.id} value={String(w.id)}>
                          {w.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shelfLocation">موقع الرف في المستودع</Label>
                  <Input
                    id="shelfLocation"
                    value={formData.shelfLocation}
                    onChange={(e) => updateFormData("shelfLocation", e.target.value)}
                    placeholder="مثل: A1-B2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appliedBranches">الفروع المطبق عليها</Label>
                  <Select value={(formData.appliedBranches || []).join(", ")} onValueChange={(value) => updateFormData("appliedBranches", value.split(","))}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفروع" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => (
                        <SelectItem key={b.id} value={String(b.id)}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applyToAllBranches">تطبيق على جميع الفروع</Label>
                  <Switch
                    id="applyToAllBranches"
                    checked={formData.applyToAllBranches}
                    onCheckedChange={(checked) => updateFormData("applyToAllBranches", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">الحالة *</Label>
                  <Select value={formData.status} onValueChange={(value) => updateFormData("status", value)}>
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
                <Label htmlFor="image">صورة  ة</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="h-10 w-10 object-cover rounded-md" />
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