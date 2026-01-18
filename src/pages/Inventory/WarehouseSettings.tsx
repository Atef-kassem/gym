import { useState, useEffect } from "react";
import { 
  Save, Settings, Lock, Shield, AlertTriangle, Package, Users, BarChart3, 
  Clock, Bell, FileText, Database, Truck, MapPin, Eye, ToggleLeft, ToggleRight, 
  Plus, ArrowLeft, CheckCircle, XCircle, Zap, Star, Crown, Sparkles,
  Globe, Wifi, Power, RefreshCw, Download, Upload, Trash2, Copy,
  Activity, TrendingUp, Target, Award, Heart, Layers, Palette,
  Monitor, Smartphone, Tablet, Edit, Search, Filter, Grid,
  TreePine, FolderTree, Tag, Hash, Percent, Calendar, Clock3,
  Archive, BookOpen, Bookmark, ChevronsUpDown, ChevronRight,
  ChevronDown, MoreHorizontal, Move3D, Shuffle, Factory, Globe2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  useGetAllCategoriesQuery, 
  useCreateCategoryMutation, 
  useUpdateCategoryMutation, 
  useDeleteCategoryMutation 
} from "@/services/categoriesApi";
import { 
  useGetAllUnitTemplatesQuery,
  useCreateUnitTemplateMutation,
  useUpdateUnitTemplateMutation,
  useDeleteUnitTemplateMutation
} from "@/services/unitTemplateApi";
import { 
  useGetAllManufacturersQuery,
  useCreateManufacturerMutation,
  useUpdateManufacturerMutation,
  useDeleteManufacturerMutation
} from "@/services/manufacturersApi";
import {
  useGetAllBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation
} from "@/services/brandsApi";

interface WarehouseSettings {
  // إعدادات عامة
  allowNegativeStock: boolean;
  requireStockApproval: boolean;
  autoGenerateCode: boolean;
  codePrefix: string;
  minimumStockAlert: boolean;
  maximumStockAlert: boolean;
  
  // إعدادات الصلاحيات
  allowManagerEdit: boolean;
  allowSupervisorEdit: boolean;
  requireApprovalForTransfer: boolean;
  allowDirectSale: boolean;
  
  // إعدادات التنبيهات
  lowStockThreshold: number;
  criticalStockThreshold: number;
  expiryWarningDays: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  
  // إعدادات الجرد
  inventoryFrequency: string;
  requireReasonForAdjustment: boolean;
  autoLockExpiredItems: boolean;
  trackItemMovements: boolean;
  
  // إعدادات التكلفة
  costingMethod: string;
  allowCostUpdate: boolean;
  requireCostApproval: boolean;
  
  // إعدادات التقارير
  defaultReportPeriod: string;
  includeInactiveItems: boolean;
  showDetailedMovements: boolean;
}

interface Category {
  category_id: string;
  name_ar: string;
  name_en: string;
  description?: string;
  parent_category_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: Category[];
  parent?: Category;
  products?: any[];
  subcategories?: Category[];
}

interface UnitConversion {
  fromUnit: string;
  toUnit: string;
  factor: number;
  formula?: string;
}

interface UnitTemplate {
  template_id: string;
  name_ar: string;
  name_en: string;
  code: string;
  description?: string;
  base_unit: string;
  is_active: boolean;
  conversions: UnitConversion[];
  created_at: string;
  updated_at: string;
  usage_count: number;
  category: string;
}

interface UnitTemplateFormData {
  name_ar: string;
  name_en: string;
  code: string;
  description: string;
  base_unit: string;
  is_active: boolean;
  conversions: UnitConversion[];
  category: string;
}

interface CategoryFormData {
  name_ar: string;
  name_en: string;
  description: string;
  parent_category_id?: string;
  is_active: boolean;
}

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedCard = ({ children, className = "", delay = 0 }: AnimatedCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default function WarehouseSettings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("general");
  
  // API hooks for categories
  const { data: categoriesData, isLoading: categoriesLoading, refetch: refetchCategories } = useGetAllCategoriesQuery();
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdatingCategory }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeletingCategory }] = useDeleteCategoryMutation();

  // API hooks for unit templates
  const { data: unitTemplatesData, isLoading: unitTemplatesLoading, refetch: refetchUnitTemplates } = useGetAllUnitTemplatesQuery();
  const [createUnitTemplate, { isLoading: isCreatingTemplate }] = useCreateUnitTemplateMutation();
  const [updateUnitTemplate, { isLoading: isUpdatingTemplate }] = useUpdateUnitTemplateMutation();
  const [deleteUnitTemplate, { isLoading: isDeletingTemplate }] = useDeleteUnitTemplateMutation();
  
  // States for categories management
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  
  // States for unit templates management
  const [unitTemplates, setUnitTemplates] = useState<UnitTemplate[]>([]);
  const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false);
  const [isEditTemplateOpen, setIsEditTemplateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<UnitTemplate | null>(null);
  const [templateSearchTerm, setTemplateSearchTerm] = useState("");
  const [templateForm, setTemplateForm] = useState<UnitTemplateFormData>({
    name_ar: "",
    name_en: "",
    code: "",
    description: "",
    base_unit: "",
    is_active: true,
    conversions: [],
    category: "general",
  });
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name_ar: "",
    name_en: "",
    description: "",
    parent_category_id: undefined,
    is_active: true,
  });

  // Manufacturers state and API
  const { data: manufacturersData, isLoading: manufacturersLoading, refetch: refetchManufacturers } = useGetAllManufacturersQuery();
  const [createManufacturer] = useCreateManufacturerMutation();
  const [updateManufacturer] = useUpdateManufacturerMutation();
  const [deleteManufacturer] = useDeleteManufacturerMutation();
  const [manufacturers, setManufacturers] = useState<any[]>([]);

  useEffect(() => {
    if ((manufacturersData as any)?.data?.manufacturers) {
      const arr = (manufacturersData as any).data.manufacturers;
      setManufacturers(Array.isArray(arr) ? arr : []);
    } else if ((manufacturersData as any)?.data) {
      const arr = (manufacturersData as any).data;
      setManufacturers(Array.isArray(arr) ? arr : []);
    } else if ((manufacturersData as any)?.manufacturers) {
      const arr = (manufacturersData as any).manufacturers;
      setManufacturers(Array.isArray(arr) ? arr : []);
    } else if (Array.isArray(manufacturersData)) {
      setManufacturers(manufacturersData as any[]);
    }
  }, [manufacturersData]);

  // Brands state and API
  const { data: brandsData, isLoading: brandsLoading, refetch: refetchBrands } = useGetAllBrandsQuery();
  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();
  const [brands, setBrands] = useState<any[]>([]);
  const [isAddManufacturerOpen, setIsAddManufacturerOpen] = useState(false);
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  const [manufacturerForm, setManufacturerForm] = useState<{ name_ar: string; name_en: string; is_active: boolean }>({ name_ar: "", name_en: "", is_active: true });
  const [brandForm, setBrandForm] = useState<{ name_ar: string; name_en: string; is_active: boolean }>({ name_ar: "", name_en: "", is_active: true });

  useEffect(() => {
    if ((brandsData as any)?.data?.brands) {
      const arr = (brandsData as any).data.brands;
      setBrands(Array.isArray(arr) ? arr : []);
    } else if ((brandsData as any)?.data) {
      const arr = (brandsData as any).data;
      setBrands(Array.isArray(arr) ? arr : []);
    } else if ((brandsData as any)?.brands) {
      const arr = (brandsData as any).brands;
      setBrands(Array.isArray(arr) ? arr : []);
    } else if (Array.isArray(brandsData)) {
      setBrands(brandsData as any[]);
    }
  }, [brandsData]);

  const handleCreateManufacturer = async () => {
    if (!manufacturerForm.name_ar || !manufacturerForm.name_en) {
      toast({ title: "❌ بيانات ناقصة", description: "يرجى إدخال الاسم بالعربية والإنجليزية", variant: "destructive" });
      return;
    }
    try {
      const result: any = await createManufacturer(manufacturerForm as any).unwrap();
      const created = result?.data?.manufacturer || result?.manufacturer || result;
      if (created) {
        setManufacturers((prev:any[]) => Array.isArray(prev) ? [...prev, created] : [created]);
      }
      setIsAddManufacturerOpen(false);
      setManufacturerForm({ name_ar: "", name_en: "", is_active: true });
      refetchManufacturers();
      toast({ title: "✅ تم الإضافة", description: "تم إضافة الشركة المصنعة بنجاح" });
    } catch (e) {
      toast({ title: "❌ فشل الإضافة", description: "حدث خطأ أثناء الإضافة" , variant: "destructive"});
    }
  };

  const handleCreateBrand = async () => {
    if (!brandForm.name_ar || !brandForm.name_en) {
      toast({ title: "❌ بيانات ناقصة", description: "يرجى إدخال الاسم بالعربية والإنجليزية", variant: "destructive" });
      return;
    }
    // optimistic add (temp id defined outside try/catch for rollback)
    const tempId = Date.now();
    const optimistic = { brand_id: tempId, ...brandForm } as any;
    setBrands((prev:any[]) => Array.isArray(prev) ? [...prev, optimistic] : [optimistic]);
    try {
      const result: any = await createBrand(brandForm as any).unwrap();
      const created = result?.data?.brand || result?.brand || result;
      // sync with server
      await refetchBrands();
      setIsAddBrandOpen(false);
      setBrandForm({ name_ar: "", name_en: "", is_active: true });
      toast({ title: "✅ تم الإضافة", description: "تم إضافة العلامة التجارية بنجاح" });
    } catch (e) {
      // rollback optimistic
      setBrands((prev:any[]) => prev.filter((b:any) => (b.brand_id ?? b.id) !== undefined && (b.brand_id ?? b.id) !== tempId));
      toast({ title: "❌ فشل الإضافة", description: "حدث خطأ أثناء الإضافة" , variant: "destructive"});
    }
  };

  // Initialize categories from API
  useEffect(() => {
    if (categoriesData?.data) {
      setCategories(categoriesData.data);
    }
  }, [categoriesData]);
    
    // Initialize unit templates with sample data
  // Initialize unit templates from API
  useEffect(() => {
    if (unitTemplatesData?.data) {
      setUnitTemplates(unitTemplatesData.data);
    }
  }, [unitTemplatesData]);
  
  const [settings, setSettings] = useState<WarehouseSettings>({
    // إعدادات عامة
    allowNegativeStock: false,
    requireStockApproval: true,
    autoGenerateCode: true,
    codePrefix: "WH",
    minimumStockAlert: true,
    maximumStockAlert: false,
    
    // إعدادات الصلاحيات
    allowManagerEdit: true,
    allowSupervisorEdit: false,
    requireApprovalForTransfer: true,
    allowDirectSale: false,
    
    // إعدادات التنبيهات
    lowStockThreshold: 10,
    criticalStockThreshold: 5,
    expiryWarningDays: 30,
    emailNotifications: true,
    smsNotifications: false,
    
    // إعدادات الجرد
    inventoryFrequency: "شهريًا",
    requireReasonForAdjustment: true,
    autoLockExpiredItems: true,
    trackItemMovements: true,
    
    // إعدادات التكلفة
    costingMethod: "FIFO",
    allowCostUpdate: false,
    requireCostApproval: true,
    
    // إعدادات التقارير
    defaultReportPeriod: "شهريًا",
    includeInactiveItems: false,
    showDetailedMovements: true,
  });

  const handleSettingChange = (key: keyof WarehouseSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // تأثير بصري عند التغيير
    toast({
      title: "تم التعديل",
      description: "تم تحديث الإعداد بنجاح",
      duration: 1000,
    });
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setSaveProgress(0);
    
    try {
      // محاكاة عملية الحفظ مع شريط التقدم
      for (let i = 0; i <= 100; i += 10) {
        setSaveProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // هنا سيتم حفظ الإعدادات في قاعدة البيانات
      toast({
        title: "✅ تم الحفظ بنجاح",
        description: "تم حفظ جميع إعدادات المخازن والمستودعات بنجاح",
      });
    } catch (error) {
      toast({
        title: "❌ خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الإعدادات، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSaveProgress(0);
    }
  };

  const handleResetSettings = () => {
    setSettings({
      allowNegativeStock: false,
      requireStockApproval: true,
      autoGenerateCode: true,
      codePrefix: "WH",
      minimumStockAlert: true,
      maximumStockAlert: false,
      allowManagerEdit: true,
      allowSupervisorEdit: false,
      requireApprovalForTransfer: true,
      allowDirectSale: false,
      lowStockThreshold: 10,
      criticalStockThreshold: 5,
      expiryWarningDays: 30,
      emailNotifications: true,
      smsNotifications: false,
      inventoryFrequency: "شهريًا",
      requireReasonForAdjustment: true,
      autoLockExpiredItems: true,
      trackItemMovements: true,
      costingMethod: "FIFO",
      allowCostUpdate: false,
      requireCostApproval: true,
      defaultReportPeriod: "شهريًا",
      includeInactiveItems: false,
      showDetailedMovements: true,
    });
    
    toast({
      title: "🔄 تم إعادة التعيين",
      description: "تم إعادة جميع الإعدادات للقيم الافتراضية",
    });
  };

  const handleBackToDashboard = () => {
    navigate('/inventory/dashboard');
    toast({
      title: "🏠 العودة للمخزون",
      description: "تم الانتقال إلى لوحة تحكم المخزون",
    });
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `warehouse-settings-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "📤 تم التصدير",
      description: "تم تصدير إعدادات المخزون بنجاح",
    });
  };

  const importSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            const importedSettings = JSON.parse(e.target.result);
            setSettings(importedSettings);
            toast({
              title: "📥 تم الاستيراد",
              description: "تم استيراد الإعدادات بنجاح",
            });
          } catch (error) {
            toast({
              title: "❌ خطأ في الاستيراد",
              description: "الملف غير صالح أو تالف",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Category management functions
  const handleAddCategory = () => {
    setIsAddCategoryOpen(true);
    setCategoryForm({
      name_ar: "",
      name_en: "",
      description: "",
      parent_category_id: "none",
      is_active: true,
    });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name_ar: category.name_ar,
      name_en: category.name_en,
      description: category.description || "",
      parent_category_id: category.parent_category_id || "none",
      is_active: category.is_active,
    });
    setIsEditCategoryOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const category = categories.find(c => c.category_id === categoryId);
    if (!category) return;

    try {
      await deleteCategory(categoryId).unwrap();
      
      // Remove the category from local state immediately
      setCategories(prev => prev.filter(c => c.category_id !== categoryId));
      
      toast({
        title: "✅ تم الحذف بنجاح",
        description: `تم حذف فئة "${category.name_ar}" بنجاح`,
      });
      
      // Refresh categories from server as backup
      refetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "❌ خطأ في الحذف",
        description: "حدث خطأ أثناء حذف الفئة",
        variant: "destructive",
      });
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name_ar || !categoryForm.name_en) {
      toast({
        title: "❌ بيانات ناقصة",
        description: "يرجى ملء اسم الفئة بالعربية والإنجليزية على الأقل",
        variant: "destructive",
      });
      return;
    }

    try {
      const categoryData = {
        name_ar: categoryForm.name_ar,
        name_en: categoryForm.name_en,
        description: categoryForm.description,
        parent_category_id: categoryForm.parent_category_id === "none" ? null : categoryForm.parent_category_id,
        is_active: categoryForm.is_active,
      };

      if (editingCategory) {
        // Update existing category
        const result = await updateCategory({
          id: editingCategory.category_id,
          updatedCategory: categoryData
        }).unwrap();
        
        // Update the category in local state immediately
        if (result?.data?.category) {
          setCategories(prev => prev.map(c => 
            c.category_id === editingCategory.category_id ? result.data.category : c
          ));
        }
        
        toast({
          title: "✅ تم التحديث بنجاح",
          description: `تم تحديث فئة "${categoryForm.name_ar}" بنجاح`,
        });
      } else {
        // Create new category
        const result = await createCategory(categoryData).unwrap();
        
        // Add the new category to local state immediately
        if (result?.data?.category) {
          setCategories(prev => [...prev, result.data.category]);
        }
        
        toast({
          title: "✅ تم الإضافة بنجاح",
          description: `تم إضافة فئة "${categoryForm.name_ar}" بنجاح`,
        });
      }

      // Reset form and close dialogs
      setIsAddCategoryOpen(false);
      setIsEditCategoryOpen(false);
      setEditingCategory(null);
      setCategoryForm({
        name_ar: "",
        name_en: "",
        description: "",
        parent_category_id: undefined,
        is_active: true,
      });
      
      // Refresh categories
      refetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "❌ خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الفئة",
        variant: "destructive",
      });
    }
  };

  // Unit template management functions
  const handleAddTemplate = () => {
    setIsAddTemplateOpen(true);
    setTemplateForm({
      name_ar: "",
      name_en: "",
      code: "",
      description: "",
      base_unit: "",
      is_active: true,
      conversions: [],
      category: "general",
    });
  };

  const handleEditTemplate = (template: UnitTemplate) => {
    setEditingTemplate(template);
    setTemplateForm({
      name_ar: template.name_ar,
      name_en: template.name_en,
      code: template.code,
      description: template.description || "",
      base_unit: template.base_unit,
      is_active: template.is_active,
      conversions: [...template.conversions],
      category: template.category,
    });
    setIsEditTemplateOpen(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    const template = unitTemplates.find(t => t.template_id === templateId);
    if (!template) return;

    try {
      await deleteUnitTemplate(templateId).unwrap();
      
      // Remove from local state immediately
      setUnitTemplates(prev => prev.filter(t => t.template_id !== templateId));
      
      toast({
        title: "✅ تم الحذف بنجاح",
        description: `تم حذف قالب "${template.name_ar}" بنجاح`,
      });
      
      // Refetch as backup
      refetchUnitTemplates();
    } catch (error) {
      console.error('Delete template API error:', error);
      toast({
        title: "❌ خطأ في الحذف",
        description: "حدث خطأ أثناء حذف القالب",
        variant: "destructive",
      });
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateForm.name_ar || !templateForm.code || !templateForm.base_unit) {
      toast({
        title: "❌ بيانات ناقصة",
        description: "يرجى ملء الحقول المطلوبة: الاسم، الرمز، الوحدة الأساسية",
        variant: "destructive",
      });
      return;
    }

    if (templateForm.conversions.length === 0) {
      toast({
        title: "❌ تحويلات مطلوبة",
        description: "يجب إضافة تحويل واحد على الأقل",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingTemplate) {
        // Update existing template
        const result = await updateUnitTemplate({
          id: editingTemplate.template_id,
          updatedTemplate: {
            name_ar: templateForm.name_ar,
            name_en: templateForm.name_en,
            code: templateForm.code,
            description: templateForm.description,
            base_unit: templateForm.base_unit,
            is_active: templateForm.is_active,
            conversions: templateForm.conversions,
            category: templateForm.category,
          }
        }).unwrap();

        // Update local state immediately
        setUnitTemplates(prev => prev.map(t => 
          t.template_id === editingTemplate.template_id ? result.data.template : t
        ));

        toast({
          title: "✅ تم التحديث بنجاح",
          description: `تم تحديث قالب "${templateForm.name_ar}" بنجاح`,
        });
      } else {
        // Create new template
        const result = await createUnitTemplate({
          name_ar: templateForm.name_ar,
          name_en: templateForm.name_en,
          code: templateForm.code,
          description: templateForm.description,
          base_unit: templateForm.base_unit,
          is_active: templateForm.is_active,
          conversions: templateForm.conversions,
          category: templateForm.category,
        }).unwrap();

        // Add to local state immediately
        setUnitTemplates(prev => [...prev, result.data.template]);

        toast({
          title: "✅ تم الإضافة بنجاح",
          description: `تم إضافة قالب "${templateForm.name_ar}" بنجاح`,
        });
      }

      // Refetch as backup
      refetchUnitTemplates();

      setIsAddTemplateOpen(false);
      setIsEditTemplateOpen(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error('Save template API error:', error);
      toast({
        title: "❌ خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ القالب",
        variant: "destructive",
      });
    }
  };

  const addConversion = () => {
    setTemplateForm(prev => ({
      ...prev,
      conversions: [...prev.conversions, { fromUnit: "", toUnit: "", factor: 1, formula: "" }]
    }));
  };

  const updateConversion = (index: number, field: keyof UnitConversion, value: string | number) => {
    setTemplateForm(prev => ({
      ...prev,
      conversions: prev.conversions.map((conv, i) => 
        i === index ? { ...conv, [field]: value } : conv
      )
    }));
  };

  const removeConversion = (index: number) => {
    setTemplateForm(prev => ({
      ...prev,
      conversions: prev.conversions.filter((_, i) => i !== index)
    }));
  };

  const exportTemplates = () => {
    const exportData = {
      templates: unitTemplates,
      exportDate: new Date().toISOString(),
      totalTemplates: unitTemplates.length,
      activeTemplates: unitTemplates.filter(t => t.is_active).length,
      totalUsage: unitTemplates.reduce((sum, t) => sum + t.usage_count, 0),
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `unit-templates-export-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "📤 تم التصدير بنجاح",
      description: `تم تصدير ${unitTemplates.length} قالب وحدة إلى ملف JSON`,
    });
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Additional functions for buttons
  const exportCategories = () => {
    const exportData = {
      categories: categories,
      exportDate: new Date().toISOString(),
      totalCategories: categories.length,
      activeCategories: categories.filter(c => c.is_active).length,
      totalItems: categories.reduce((sum, c) => sum + (c.products?.length || 0), 0),
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `categories-export-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "📤 تم التصدير بنجاح",
      description: `تم تصدير ${categories.length} فئة إلى ملف JSON`,
    });
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'tree' ? 'list' : 'tree');
    toast({
      title: viewMode === 'tree' ? "📋 العرض القائمة" : "🌳 العرض الشجري",
      description: `تم تغيير وضع العرض إلى ${viewMode === 'tree' ? 'القائمة' : 'الشجري'}`,
    });
  };

  const expandAllCategories = () => {
    const allCategoryIds = new Set(categories.map(c => c.category_id));
    setExpandedCategories(allCategoryIds);
    toast({
      title: "🔍 توسيع الكل",
      description: "تم توسيع جميع الفئات",
    });
  };

  const collapseAllCategories = () => {
    setExpandedCategories(new Set());
    toast({
      title: "📁 طي الكل", 
      description: "تم طي جميع الفئات",
    });
  };

  const getActiveCategories = () => {
    return categories.filter(c => c.is_active);
  };

  const getSubcategories = () => {
    return categories.filter(c => c.parent_category_id);
  };

  const renderCategoryTree = (cats: Category[], level: number = 0) => {
    return cats
      .filter(cat => searchTerm === "" || 
        cat.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.name_en.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(category => (
        <div key={category.category_id} className={`${level > 0 ? 'ml-6' : ''}`}>
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 mb-2">
            <div className="flex items-center gap-4">
              {category.subcategories && category.subcategories.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                  onClick={() => toggleCategoryExpansion(category.category_id)}
                    className="h-6 w-6 p-0"
                  >
                  {expandedCategories.has(category.category_id) ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </Button>
                )}
                <div 
                className="w-4 h-4 rounded-full bg-blue-500"
                />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900">{category.name_ar}</h4>
                {!category.is_active && (
                    <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                      غير نشط
                    </Badge>
                  )}
                </div>
              {category.name_en && (
                <p className="text-sm text-gray-500">{category.name_en}</p>
                )}
                {category.description && (
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                )}
              </div>
            </div>
            
          {expandedCategories.has(category.category_id) && category.subcategories && (
            <div className="ml-4">
              {renderCategoryTree(category.subcategories, level + 1)}
            </div>
          )}
        </div>
      ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6">
      {/* Header with enhanced design */}
      <AnimatedCard className="mb-8" delay={0}>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <Button
                variant="outline"
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 hover:scale-105 transition-all duration-300 bg-white/60 backdrop-blur-sm border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              >
                <ArrowLeft className="h-4 w-4" />
                العودة للمخزون
              </Button>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  ⚙️ إعدادات المخازن المتقدمة
                </h1>
                <p className="text-gray-600 text-lg">
                  لوحة تحكم شاملة لإعداد وتخصيص قواعد وسياسات إدارة المخازن والمستودعات
                </p>
              </div>
            </div>
            
            {/* Action buttons with enhanced design */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={exportSettings}
                className="gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 hover:scale-105 transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                تصدير
              </Button>
              
              <Button 
                variant="outline" 
                onClick={importSettings}
                className="gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 hover:scale-105 transition-all duration-300"
              >
                <Upload className="w-4 h-4" />
                استيراد
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleResetSettings}
                className="gap-2 bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 hover:scale-105 transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة تعيين
              </Button>
              
              <Button 
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    حفظ الإعدادات
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Progress bar for saving */}
          {isLoading && (
            <div className="mt-4">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                <span className="text-sm text-gray-600">جاري حفظ الإعدادات...</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {saveProgress}%
                </Badge>
              </div>
              <Progress value={saveProgress} className="h-2 bg-blue-100" />
            </div>
          )}
          
          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-700">إعدادات نشطة</p>
                  <p className="text-xl font-bold text-blue-800">12</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-700">إعدادات محفوظة</p>
                  <p className="text-xl font-bold text-green-800">8</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-700">صلاحيات محددة</p>
                  <p className="text-xl font-bold text-purple-800">4</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-orange-700">تنبيهات مفعلة</p>
                  <p className="text-xl font-bold text-orange-800">3</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedCard>

      <AnimatedCard delay={200}>
        <Tabs defaultValue="general" className="w-full" onValueChange={setActiveSection}>
          <TabsList className="grid w-full grid-cols-9 p-2 bg-gradient-to-r from-white via-blue-50/50 to-white border border-blue-200 shadow-xl rounded-xl backdrop-blur-sm">
            {/* <TabsTrigger 
              value="general" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:bg-blue-50 rounded-lg text-sm font-medium"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:block">الإعدادات العامة</span>
              <span className="md:hidden">عام</span>
            </TabsTrigger>
            <TabsTrigger 
              value="permissions" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:bg-purple-50 rounded-lg text-sm font-medium"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden md:block">الصلاحيات</span>
              <span className="md:hidden">صلاحيات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="alerts" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:bg-orange-50 rounded-lg text-sm font-medium"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden md:block">التنبيهات</span>
              <span className="md:hidden">تنبيهات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="inventory" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:bg-green-50 rounded-lg text-sm font-medium"
            >
              <Package className="w-4 h-4" />
              <span className="hidden md:block">الجرد والتكلفة</span>
              <span className="md:hidden">جرد</span>
            </TabsTrigger> */}
            <TabsTrigger 
              value="categories" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:bg-cyan-50 rounded-lg text-sm font-medium"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden md:block">إدارة الفئات</span>
              <span className="md:hidden">فئات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="manufacturers" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:bg-indigo-50 rounded-lg text-sm font-medium"
            >
              <Factory className="w-4 h-4" />
              <span className="hidden md:block">الشركات المصنعة</span>
              <span className="md:hidden">مصنعون</span>
            </TabsTrigger>
            <TabsTrigger 
              value="brands" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-rose-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:bg-pink-50 rounded-lg text-sm font-medium"
            >
              <Award className="w-4 h-4" />
              <span className="hidden md:block">العلامات التجارية</span>
              <span className="md:hidden">علامات</span>
            </TabsTrigger>
            {/* <TabsTrigger 
              value="unit-templates" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:bg-violet-50 rounded-lg text-sm font-medium"
            >
              <Database className="w-4 h-4" />
              <span className="hidden md:block">قوالب الوحدات</span>
              <span className="md:hidden">قوالب</span>
            </TabsTrigger> */}
            <TabsTrigger 
              value="reports" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:bg-teal-50 rounded-lg text-sm font-medium"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:block">التقارير</span>
              <span className="md:hidden">تقارير</span>
            </TabsTrigger>
          </TabsList>

        {/* الإعدادات العامة */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  إدارة المخزون
                </CardTitle>
                <CardDescription>
                  الإعدادات المتعلقة بإدارة وتتبع المخزون
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="negative-stock" className="text-sm font-medium">
                    السماح بالمخزون السالب
                  </Label>
                  <Switch
                    id="negative-stock"
                    checked={settings.allowNegativeStock}
                    onCheckedChange={(checked) => handleSettingChange('allowNegativeStock', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="stock-approval" className="text-sm font-medium">
                    مطالبة بموافقة على حركات المخزون
                  </Label>
                  <Switch
                    id="stock-approval"
                    checked={settings.requireStockApproval}
                    onCheckedChange={(checked) => handleSettingChange('requireStockApproval', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="min-alert" className="text-sm font-medium">
                    تنبيه الحد الأدنى للمخزون
                  </Label>
                  <Switch
                    id="min-alert"
                    checked={settings.minimumStockAlert}
                    onCheckedChange={(checked) => handleSettingChange('minimumStockAlert', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="max-alert" className="text-sm font-medium">
                    تنبيه الحد الأقصى للمخزون
                  </Label>
                  <Switch
                    id="max-alert"
                    checked={settings.maximumStockAlert}
                    onCheckedChange={(checked) => handleSettingChange('maximumStockAlert', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary-blue" />
                  ترقيم المستودعات
                </CardTitle>
                <CardDescription>
                  إعدادات ترقيم وتكويد المستودعات الجديدة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-code" className="text-sm font-medium">
                    ترقيم تلقائي للمستودعات
                  </Label>
                  <Switch
                    id="auto-code"
                    checked={settings.autoGenerateCode}
                    onCheckedChange={(checked) => handleSettingChange('autoGenerateCode', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="code-prefix">بادئة رمز المستودع</Label>
                  <Input
                    id="code-prefix"
                    value={settings.codePrefix}
                    onChange={(e) => handleSettingChange('codePrefix', e.target.value)}
                    placeholder="مثال: WH"
                    className="focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* إعدادات الصلاحيات */}
        <TabsContent value="permissions" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-warning" />
                  صلاحيات الموظفين
                </CardTitle>
                <CardDescription>
                  تحديد صلاحيات مديري ومشرفي المستودعات
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="manager-edit" className="text-sm font-medium">
                    السماح لمدير المستودع بالتعديل
                  </Label>
                  <Switch
                    id="manager-edit"
                    checked={settings.allowManagerEdit}
                    onCheckedChange={(checked) => handleSettingChange('allowManagerEdit', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="supervisor-edit" className="text-sm font-medium">
                    السماح للمشرف بالتعديل
                  </Label>
                  <Switch
                    id="supervisor-edit"
                    checked={settings.allowSupervisorEdit}
                    onCheckedChange={(checked) => handleSettingChange('allowSupervisorEdit', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="transfer-approval" className="text-sm font-medium">
                    مطالبة بموافقة على النقل بين المستودعات
                  </Label>
                  <Switch
                    id="transfer-approval"
                    checked={settings.requireApprovalForTransfer}
                    onCheckedChange={(checked) => handleSettingChange('requireApprovalForTransfer', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="direct-sale" className="text-sm font-medium">
                    السماح بالبيع المباشر من المستودع
                  </Label>
                  <Switch
                    id="direct-sale"
                    checked={settings.allowDirectSale}
                    onCheckedChange={(checked) => handleSettingChange('allowDirectSale', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* إعدادات التنبيهات */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  تنبيهات المخزون
                </CardTitle>
                <CardDescription>
                  إعداد التنبيهات المتعلقة بمستويات المخزون
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="low-stock">حد التنبيه للمخزون المنخفض</Label>
                  <Input
                    id="low-stock"
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={(e) => handleSettingChange('lowStockThreshold', parseInt(e.target.value))}
                    className="focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="critical-stock">حد التنبيه للمخزون الحرج</Label>
                  <Input
                    id="critical-stock"
                    type="number"
                    value={settings.criticalStockThreshold}
                    onChange={(e) => handleSettingChange('criticalStockThreshold', parseInt(e.target.value))}
                    className="focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiry-warning">تنبيه انتهاء الصلاحية (بالأيام)</Label>
                  <Input
                    id="expiry-warning"
                    type="number"
                    value={settings.expiryWarningDays}
                    onChange={(e) => handleSettingChange('expiryWarningDays', parseInt(e.target.value))}
                    className="focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-secondary-blue" />
                  طرق التنبيه
                </CardTitle>
                <CardDescription>
                  اختيار طرق إرسال التنبيهات والإشعارات
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="text-sm font-medium">
                    إشعارات البريد الإلكتروني
                  </Label>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications" className="text-sm font-medium">
                    إشعارات الرسائل النصية
                  </Label>
                  <Switch
                    id="sms-notifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* إعدادات الجرد والتكلفة */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  إعدادات الجرد
                </CardTitle>
                <CardDescription>
                  سياسات وإعدادات جرد المخزون
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inventory-frequency">دورية الجرد</Label>
                  <Select
                    value={settings.inventoryFrequency}
                    onValueChange={(value) => handleSettingChange('inventoryFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="أسبوعيًا">أسبوعيًا</SelectItem>
                      <SelectItem value="شهريًا">شهريًا</SelectItem>
                      <SelectItem value="ربع سنوي">ربع سنوي</SelectItem>
                      <SelectItem value="نصف سنوي">نصف سنوي</SelectItem>
                      <SelectItem value="سنويًا">سنويًا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="require-reason" className="text-sm font-medium">
                    مطالبة بسبب التعديل
                  </Label>
                  <Switch
                    id="require-reason"
                    checked={settings.requireReasonForAdjustment}
                    onCheckedChange={(checked) => handleSettingChange('requireReasonForAdjustment', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-lock-expired" className="text-sm font-medium">
                    قفل الأصناف منتهية الصلاحية تلقائيًا
                  </Label>
                  <Switch
                    id="auto-lock-expired"
                    checked={settings.autoLockExpiredItems}
                    onCheckedChange={(checked) => handleSettingChange('autoLockExpiredItems', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="track-movements" className="text-sm font-medium">
                    تتبع حركات الأصناف
                  </Label>
                  <Switch
                    id="track-movements"
                    checked={settings.trackItemMovements}
                    onCheckedChange={(checked) => handleSettingChange('trackItemMovements', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-success" />
                  إعدادات التكلفة
                </CardTitle>
                <CardDescription>
                  طرق حساب وإدارة تكلفة المخزون
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="costing-method">طريقة حساب التكلفة</Label>
                  <Select
                    value={settings.costingMethod}
                    onValueChange={(value) => handleSettingChange('costingMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FIFO">الوارد أولاً صادر أولاً (FIFO)</SelectItem>
                      <SelectItem value="LIFO">الوارد أخيراً صادر أولاً (LIFO)</SelectItem>
                      <SelectItem value="WAC">متوسط التكلفة المرجح</SelectItem>
                      <SelectItem value="SPECIFIC">التكلفة المحددة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="allow-cost-update" className="text-sm font-medium">
                    السماح بتحديث التكلفة
                  </Label>
                  <Switch
                    id="allow-cost-update"
                    checked={settings.allowCostUpdate}
                    onCheckedChange={(checked) => handleSettingChange('allowCostUpdate', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="cost-approval" className="text-sm font-medium">
                    مطالبة بموافقة على تحديث التكلفة
                  </Label>
                  <Switch
                    id="cost-approval"
                    checked={settings.requireCostApproval}
                    onCheckedChange={(checked) => handleSettingChange('requireCostApproval', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* إعدادات التقارير */}
        <TabsContent value="reports" className="space-y-6">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-secondary-blue" />
                إعدادات التقارير
              </CardTitle>
              <CardDescription>
                تخصيص إعدادات التقارير وعرض البيانات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="default-period">الفترة الافتراضية للتقارير</Label>
                  <Select
                    value={settings.defaultReportPeriod}
                    onValueChange={(value) => handleSettingChange('defaultReportPeriod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="يوميًا">يوميًا</SelectItem>
                      <SelectItem value="أسبوعيًا">أسبوعيًا</SelectItem>
                      <SelectItem value="شهريًا">شهريًا</SelectItem>
                      <SelectItem value="ربع سنوي">ربع سنوي</SelectItem>
                      <SelectItem value="سنويًا">سنويًا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-inactive" className="text-sm font-medium">
                    تضمين الأصناف غير النشطة في التقارير
                  </Label>
                  <Switch
                    id="include-inactive"
                    checked={settings.includeInactiveItems}
                    onCheckedChange={(checked) => handleSettingChange('includeInactiveItems', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="detailed-movements" className="text-sm font-medium">
                    عرض تفاصيل الحركات في التقارير
                  </Label>
                  <Switch
                    id="detailed-movements"
                    checked={settings.showDetailedMovements}
                    onCheckedChange={(checked) => handleSettingChange('showDetailedMovements', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إدارة الفئات */}
        <TabsContent value="categories" className="space-y-6">
          <AnimatedCard delay={300}>
            <Card className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <FolderTree className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-white">إدارة فئات الأصناف</CardTitle>
                      <CardDescription className="text-blue-100 mt-1">
                        إنشاء وتنظيم الفئات الهرمية للأصناف والمنتجات بشكل متقدم
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {categories.length} فئة
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {/* Controls and Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="البحث في الفئات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/70 border-blue-200 focus:border-blue-400 focus:ring-blue-200"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddCategory}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      إضافة فئة جديدة
                    </Button>
                    
                    <Button
                      onClick={toggleViewMode}
                      variant="outline"
                      className={`transition-all duration-300 hover:scale-105 ${
                        viewMode === 'tree' 
                          ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100' 
                          : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      <TreePine className="w-4 h-4 mr-2" />
                      {viewMode === 'tree' ? 'عرض شجري ✓' : 'عرض قائمة'}
                    </Button>
                    
                    <Button
                      onClick={exportCategories}
                      variant="outline"
                      className="bg-white/70 border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:scale-105 transition-all duration-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      تصدير ({categories.length})
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="bg-white/70 border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:scale-105 transition-all duration-300"
                        >
                          <MoreHorizontal className="w-4 h-4 mr-2" />
                          المزيد
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 bg-white shadow-xl border border-gray-200 rounded-lg z-50">
                        <DropdownMenuItem onClick={expandAllCategories} className="hover:bg-blue-50 cursor-pointer">
                          <ChevronsUpDown className="h-4 w-4 mr-2" />
                          توسيع الكل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={collapseAllCategories} className="hover:bg-blue-50 cursor-pointer">
                          <ChevronDown className="h-4 w-4 mr-2" />
                          طي الكل
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="hover:bg-blue-50 cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          استيراد فئات
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-blue-50 cursor-pointer">
                          <Shuffle className="h-4 w-4 mr-2" />
                          إعادة ترتيب
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Categories Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <FolderTree className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-700">إجمالي الفئات</p>
                        <p className="text-xl font-bold text-blue-800">{categories.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-green-700">فئات نشطة</p>
                        <p className="text-xl font-bold text-green-800">
                          {getActiveCategories().length}
                        </p>
                        <div className="text-xs text-green-600 mt-1">
                          {((getActiveCategories().length / categories.length) * 100).toFixed(1)}% من الإجمالي
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-700">إجمالي الأصناف</p>
                        <p className="text-xl font-bold text-purple-800">
                          {categories.reduce((sum, c) => sum + (c.products?.length || 0), 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500 rounded-lg">
                        <Layers className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-orange-700">فئات فرعية</p>
                        <p className="text-xl font-bold text-orange-800">
                          {getSubcategories().length}
                        </p>
                        <div className="text-xs text-orange-600 mt-1">
                          {categories.length - getSubcategories().length} فئة رئيسية
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Categories List */}
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 max-h-96 overflow-y-auto">

                  {categoriesLoading ? (
                    <div className="text-center py-12">
                      <RefreshCw className="w-16 h-16 mx-auto text-gray-400 mb-4 animate-spin" />
                      <p className="text-gray-600 font-medium mb-2">جاري تحميل الفئات...</p>
                    </div>
                  ) : categories && categories.length > 0 ? (
                    <div className="space-y-2">
                      {viewMode === 'tree' ? (
                        renderCategoryTree(categories)
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {categories
                            .filter(cat => searchTerm === "" || 
                              cat.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              cat.name_en.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(category => (
                              <div key={category.category_id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className="w-4 h-4 rounded-full bg-blue-500"
                                    />
                                    {!category.is_active && (
                                      <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                                        غير نشط
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-white shadow-xl border border-gray-200 rounded-lg z-50">
                                      <DropdownMenuItem onClick={() => handleEditCategory(category)} className="hover:bg-blue-50 cursor-pointer">
                                        <Edit className="h-4 h-4 mr-2" />
                                        تعديل
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleAddCategory()} className="hover:bg-green-50 cursor-pointer">
                                        <Plus className="h-4 h-4 mr-2" />
                                        إضافة فئة فرعية
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        onClick={() => handleDeleteCategory(category.category_id)}
                                        className="text-red-600 hover:bg-red-50 cursor-pointer"
                                      >
                                        <Trash2 className="h-4 h-4 mr-2" />
                                        حذف
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-1">{category.name_ar}</h4>
                                  {category.name_en && (
                                    <p className="text-sm text-gray-500 mb-2">{category.name_en}</p>
                                  )}
                                  {category.description && (
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
                                  )}
                                  <div className="flex items-center justify-between">
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                      {category.products?.length || 0} صنف
                                    </Badge>
                                    {category.parent_category_id && (
                                      <Badge variant="outline" className="text-xs">
                                        فرعية
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FolderTree className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 font-medium mb-2">لا توجد فئات متاحة</p>
                      <p className="text-sm text-gray-500 mb-4">
                        ابدأ بإضافة فئة جديدة لتنظيم الأصناف
                      </p>
                      <Button onClick={handleAddCategory} className="gap-2">
                        <Plus className="w-4 h-4" />
                        إضافة أول فئة
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Add Category Dialog */}
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-600" />
                  إضافة فئة جديدة
                </DialogTitle>
                <DialogDescription>
                  املأ البيانات التالية لإنشاء فئة جديدة للأصناف
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category-name-ar">اسم الفئة بالعربية *</Label>
                    <Input
                      id="category-name-ar"
                      value={categoryForm.name_ar}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, name_ar: e.target.value }))}
                      placeholder="مثل: زيوت المحركات"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category-name-en">الاسم بالإنجليزية *</Label>
                    <Input
                      id="category-name-en"
                      value={categoryForm.name_en}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, name_en: e.target.value }))}
                      placeholder="Engine Oils"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent-category">الفئة الأب</Label>
                    <Select
                      value={categoryForm.parent_category_id || "none"}
                      onValueChange={(value) => setCategoryForm(prev => ({ ...prev, parent_category_id: value === "none" ? undefined : value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفئة الأب (اختياري)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">بدون فئة أب (فئة رئيسية)</SelectItem>
                        {categories.filter(c => !c.parent_category_id).map(category => (
                          <SelectItem key={category.category_id} value={category.category_id}>
                            {category.name_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category-status">حالة الفئة</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="category-status"
                        checked={categoryForm.is_active}
                        onCheckedChange={(checked) => setCategoryForm(prev => ({ ...prev, is_active: checked }))}
                      />
                      <Label htmlFor="category-status" className="text-sm">
                        {categoryForm.is_active ? "نشطة" : "غير نشطة"}
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category-description">وصف الفئة</Label>
                  <Textarea
                    id="category-description"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="وصف تفصيلي للفئة ومحتوياتها..."
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                  إلغاء
                </Button>
                <Button 
                  onClick={handleSaveCategory} 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isCreatingCategory || isUpdatingCategory}
                >
                  {isCreatingCategory || isUpdatingCategory ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                  <Save className="w-4 h-4 mr-2" />
                  حفظ الفئة
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Category Dialog */}
          <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-blue-600" />
                  تعديل الفئة
                </DialogTitle>
                <DialogDescription>
                  تعديل بيانات الفئة المحددة
                </DialogDescription>
              </DialogHeader>
              
              {/* Same form as add category */}
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-category-name-ar">اسم الفئة بالعربية *</Label>
                    <Input
                      id="edit-category-name-ar"
                      value={categoryForm.name_ar}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, name_ar: e.target.value }))}
                      placeholder="مثل: زيوت المحركات"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-category-name-en">الاسم بالإنجليزية *</Label>
                    <Input
                      id="edit-category-name-en"
                      value={categoryForm.name_en}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, name_en: e.target.value }))}
                      placeholder="Engine Oils"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-parent-category">الفئة الأب</Label>
                    <Select
                      value={categoryForm.parent_category_id || "none"}
                      onValueChange={(value) => setCategoryForm(prev => ({ ...prev, parent_category_id: value === "none" ? undefined : value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفئة الأب (اختياري)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">بدون فئة أب (فئة رئيسية)</SelectItem>
                        {categories.filter(c => !c.parent_category_id && c.category_id !== editingCategory?.category_id).map(category => (
                          <SelectItem key={category.category_id} value={category.category_id}>
                            {category.name_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-category-status">حالة الفئة</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="edit-category-status"
                        checked={categoryForm.is_active}
                        onCheckedChange={(checked) => setCategoryForm(prev => ({ ...prev, is_active: checked }))}
                      />
                      <Label htmlFor="edit-category-status" className="text-sm">
                        {categoryForm.is_active ? "نشطة" : "غير نشطة"}
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-category-description">وصف الفئة</Label>
                  <Textarea
                    id="edit-category-description"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="وصف تفصيلي للفئة ومحتوياتها..."
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>
                  إلغاء
                </Button>
                <Button 
                  onClick={handleSaveCategory} 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isCreatingCategory || isUpdatingCategory}
                >
                  {isCreatingCategory || isUpdatingCategory ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                  <Save className="w-4 h-4 mr-2" />
                  حفظ التعديلات
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* إدارة الشركات المصنعة */}
        <TabsContent value="manufacturers" className="space-y-6">
          <AnimatedCard delay={400}>
            <Card className="bg-gradient-to-br from-indigo-50 via-blue-50/50 to-white border border-indigo-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Factory className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-white">إدارة الشركات المصنعة</CardTitle>
                      <CardDescription className="text-indigo-100 mt-1">
                        إدارة معلومات الشركات المصنعة للمنتجات والمواد الخام
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {manufacturers.length} شركة مصنعة
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {/* Controls and Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="البحث في الشركات المصنعة..."
                        className="pl-10 bg-white/70 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-200"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsAddManufacturerOpen(true)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      إضافة شركة مصنعة جديدة
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="bg-white/70 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 hover:scale-105 transition-all duration-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      تصدير
                    </Button>
                  </div>
                </div>

                {/* Manufacturers Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500 rounded-lg">
                        <Factory className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-indigo-700">إجمالي الشركات</p>
                        <p className="text-xl font-bold text-indigo-800">{manufacturers.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-green-700">شركات نشطة</p>
                        <p className="text-xl font-bold text-green-800">{manufacturers.filter((m:any)=> m.is_active !== false).length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-700">إجمالي المنتجات</p>
                        <p className="text-xl font-bold text-blue-800">0</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Globe2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-700">دول ممثلة</p>
                        <p className="text-xl font-bold text-purple-800">0</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manufacturers List */}
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 max-h-96 overflow-y-auto">
                  {manufacturersLoading ? (
                    <div className="text-center py-12">
                      <RefreshCw className="w-8 h-8 mx-auto text-gray-400 mb-2 animate-spin" />
                      <p className="text-gray-500">جاري تحميل الشركات المصنعة...</p>
                    </div>
                  ) : manufacturers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {manufacturers.map((m:any) => (
                        <div key={m.manufacturer_id || m.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{m.name_ar || m.name || 'بدون اسم'}</h4>
                            {m.is_active === false ? (
                              <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">غير نشط</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">نشط</Badge>
                            )}
                          </div>
                          {m.name_en && <p className="text-sm text-gray-500">{m.name_en}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Factory className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 font-medium mb-2">لا توجد شركات مصنعة متاحة</p>
                      <p className="text-sm text-gray-500 mb-4">ابدأ بإضافة شركة مصنعة جديدة لإدارة المنتجات</p>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        إضافة أول شركة مصنعة
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Add Manufacturer Dialog */}
          <Dialog open={isAddManufacturerOpen} onOpenChange={setIsAddManufacturerOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-green-600" />
                  إضافة شركة مصنعة جديدة
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الاسم بالعربية *</Label>
                    <Input value={manufacturerForm.name_ar} onChange={(e)=>setManufacturerForm(prev=>({...prev, name_ar: e.target.value}))} />
                  </div>
                  <div className="space-y-2">
                    <Label>الاسم بالإنجليزية *</Label>
                    <Input value={manufacturerForm.name_en} onChange={(e)=>setManufacturerForm(prev=>({...prev, name_en: e.target.value}))} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="manufacturer-active" checked={manufacturerForm.is_active} onCheckedChange={(checked)=>setManufacturerForm(prev=>({...prev, is_active: checked}))} />
                  <Label htmlFor="manufacturer-active">نشط</Label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={()=>setIsAddManufacturerOpen(false)}>إلغاء</Button>
                <Button onClick={handleCreateManufacturer} className="bg-green-600 hover:bg-green-700">حفظ</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* إدارة العلامات التجارية */}
        <TabsContent value="brands" className="space-y-6">
          <AnimatedCard delay={500}>
            <Card className="bg-gradient-to-br from-pink-50 via-rose-50/50 to-white border border-pink-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-white">إدارة العلامات التجارية</CardTitle>
                      <CardDescription className="text-pink-100 mt-1">
                        إدارة العلامات التجارية والماركات العالمية والمحلية
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {brands.length} علامة تجارية
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {/* Controls and Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="البحث في العلامات التجارية..."
                        className="pl-10 bg-white/70 border-pink-200 focus:border-pink-400 focus:ring-pink-200"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsAddBrandOpen(true)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      إضافة علامة تجارية جديدة
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="bg-white/70 border-pink-200 hover:bg-pink-50 hover:border-pink-300 hover:scale-105 transition-all duration-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      تصدير
                    </Button>
                  </div>
                </div>

                {/* Brands Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl border border-pink-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-500 rounded-lg">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-pink-700">إجمالي العلامات</p>
                        <p className="text-xl font-bold text-pink-800">{brands.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-green-700">علامات نشطة</p>
                        <p className="text-xl font-bold text-green-800">{brands.filter((b:any)=> b.is_active !== false).length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-700">إجمالي المنتجات</p>
                        <p className="text-xl font-bold text-blue-800">0</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Star className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-700">علامات مميزة</p>
                        <p className="text-xl font-bold text-purple-800">0</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Brands List */}
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 max-h-96 overflow-y-auto">
                  {brandsLoading ? (
                    <div className="text-center py-12">
                      <RefreshCw className="w-8 h-8 mx-auto text-gray-400 mb-2 animate-spin" />
                      <p className="text-gray-500">جاري تحميل العلامات التجارية...</p>
                    </div>
                  ) : brands.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {brands.map((b:any) => (
                        <div key={b.brand_id || b.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{b.name_ar || b.name || 'بدون اسم'}</h4>
                            {b.is_active === false ? (
                              <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">غير نشط</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">نشط</Badge>
                            )}
                          </div>
                          {b.name_en && <p className="text-sm text-gray-500">{b.name_en}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 font-medium mb-2">لا توجد علامات تجارية متاحة</p>
                      <p className="text-sm text-gray-500 mb-4">ابدأ بإضافة علامة تجارية جديدة لإدارة المنتجات</p>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        إضافة أول علامة تجارية
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Add Brand Dialog */}
          <Dialog open={isAddBrandOpen} onOpenChange={setIsAddBrandOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-green-600" />
                  إضافة علامة تجارية جديدة
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الاسم بالعربية *</Label>
                    <Input value={brandForm.name_ar} onChange={(e)=>setBrandForm(prev=>({...prev, name_ar: e.target.value}))} />
                  </div>
                  <div className="space-y-2">
                    <Label>الاسم بالإنجليزية *</Label>
                    <Input value={brandForm.name_en} onChange={(e)=>setBrandForm(prev=>({...prev, name_en: e.target.value}))} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="brand-active" checked={brandForm.is_active} onCheckedChange={(checked)=>setBrandForm(prev=>({...prev, is_active: checked}))} />
                  <Label htmlFor="brand-active">نشط</Label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={()=>setIsAddBrandOpen(false)}>إلغاء</Button>
                <Button onClick={handleCreateBrand} className="bg-green-600 hover:bg-green-700">حفظ</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* قوالب الوحدات */}
        <TabsContent value="unit-templates" className="space-y-6">
          <AnimatedCard delay={400}>
            <Card className="bg-gradient-to-br from-violet-50 via-purple-50/50 to-white border border-violet-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-white">إدارة قوالب تحويل الوحدات</CardTitle>
                      <CardDescription className="text-violet-100 mt-1">
                        إنشاء وإدارة قوالب متقدمة لتحويل الوحدات (حبة → درزن → كرتون)
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {unitTemplates.length} قالب
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {/* Controls and Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="البحث في قوالب الوحدات..."
                        value={templateSearchTerm}
                        onChange={(e) => setTemplateSearchTerm(e.target.value)}
                        className="pl-10 bg-white/70 border-violet-200 focus:border-violet-400 focus:ring-violet-200"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddTemplate}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      إضافة قالب جديد
                    </Button>
                    
                    <Button
                      onClick={exportTemplates}
                      variant="outline"
                      className="bg-white/70 border-violet-200 hover:bg-violet-50 hover:border-violet-300 hover:scale-105 transition-all duration-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      تصدير ({unitTemplates.length})
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="bg-white/70 border-violet-200 hover:bg-violet-50 hover:border-violet-300 hover:scale-105 transition-all duration-300"
                        >
                          <MoreHorizontal className="w-4 h-4 mr-2" />
                          المزيد
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 bg-white shadow-xl border border-gray-200 rounded-lg z-50">
                        <DropdownMenuItem className="hover:bg-violet-50 cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          استيراد قوالب
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-violet-50 cursor-pointer">
                          <Copy className="h-4 w-4 mr-2" />
                          نسخ احتياطية
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="hover:bg-violet-50 cursor-pointer">
                          <Shuffle className="h-4 w-4 mr-2" />
                          إعادة ترتيب
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Templates Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-4 rounded-xl border border-violet-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-violet-500 rounded-lg">
                        <Database className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-violet-700">إجمالي القوالب</p>
                        <p className="text-xl font-bold text-violet-800">{unitTemplates.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-green-700">قوالب نشطة</p>
                        <p className="text-xl font-bold text-green-800">
                          {unitTemplates.filter(t => t.is_active).length}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-700">إجمالي الاستخدام</p>
                        <p className="text-xl font-bold text-blue-800">
                          {unitTemplates.reduce((sum, t) => sum + t.usage_count, 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500 rounded-lg">
                        <Move3D className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-orange-700">إجمالي التحويلات</p>
                        <p className="text-xl font-bold text-orange-800">
                          {unitTemplates.reduce((sum, t) => sum + t.conversions.length, 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Templates List */}
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 max-h-96 overflow-y-auto">
                  {unitTemplatesLoading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="w-8 h-8 mx-auto text-gray-400 mb-2 animate-spin" />
                      <p className="text-gray-500">جاري تحميل قوالب الوحدات...</p>
                    </div>
                  ) : unitTemplates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {unitTemplates
                        .filter(template => templateSearchTerm === "" || 
                          template.name_ar.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
                          template.code.toLowerCase().includes(templateSearchTerm.toLowerCase()))
                        .map(template => (
                          <div key={template.template_id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs font-mono">
                                  {template.code}
                                </Badge>
                                {!template.is_active && (
                                  <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                                    غير نشط
                                  </Badge>
                                )}
                                <Badge className="text-xs bg-blue-100 text-blue-700">
                                  {template.category}
                                </Badge>
                              </div>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white shadow-xl border border-gray-200 rounded-lg z-50">
                                  <DropdownMenuItem onClick={() => handleEditTemplate(template)} className="hover:bg-blue-50 cursor-pointer">
                                    <Edit className="h-4 w-4 mr-2" />
                                    تعديل
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="hover:bg-green-50 cursor-pointer">
                                    <Copy className="h-4 w-4 mr-2" />
                                    نسخ القالب
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteTemplate(template.template_id)}
                                    className="text-red-600 hover:bg-red-50 cursor-pointer"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    حذف
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-900 mb-1">{template.name_ar}</h4>
                              {template.name_en && (
                                <p className="text-sm text-gray-500 mb-2">{template.name_en}</p>
                              )}
                              {template.description && (
                                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                              )}
                              <div className="flex items-center gap-2 mb-3">
                                <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                                  الوحدة الأساسية: {template.base_unit}
                                </Badge>
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  {template.usage_count} استخدام
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Conversions Preview */}
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">التحويلات المتاحة:</h5>
                              {template.conversions.slice(0, 2).map((conversion, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm bg-gray-50 rounded p-2">
                                  <span className="font-medium">{conversion.fromUnit}</span>
                                  <ArrowLeft className="h-3 w-3 text-gray-400" />
                                  <span className="font-medium">{conversion.toUnit}</span>
                                  <span className="text-gray-500 ml-auto">×{conversion.factor}</span>
                                </div>
                              ))}
                              {template.conversions.length > 2 && (
                                <p className="text-xs text-gray-500 text-center">
                                  +{template.conversions.length - 2} تحويل إضافي
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Database className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 font-medium mb-2">لا توجد قوالب وحدات متاحة</p>
                      <p className="text-sm text-gray-500 mb-4">
                        ابدأ بإضافة قالب جديد لتحويل الوحدات
                      </p>
                      <Button onClick={handleAddTemplate} className="gap-2">
                        <Plus className="w-4 h-4" />
                        إضافة أول قالب
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Add Template Dialog */}
          <Dialog open={isAddTemplateOpen} onOpenChange={setIsAddTemplateOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-600" />
                  إضافة قالب وحدة جديد
                </DialogTitle>
                <DialogDescription>
                  املأ البيانات التالية لإنشاء قالب جديد لتحويل الوحدات
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">اسم القالب *</Label>
                    <Input
                      id="template-name"
                      value={templateForm.name_ar}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, name_ar: e.target.value }))}
                      placeholder="مثل: قالب الأعداد الكبيرة"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="template-name-en">الاسم بالإنجليزية</Label>
                    <Input
                      id="template-name-en"
                      value={templateForm.name_en}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, name_en: e.target.value }))}
                      placeholder="Large Quantity Template"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-code">رمز القالب *</Label>
                    <Input
                      id="template-code"
                      value={templateForm.code}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="LQT"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="base-unit">الوحدة الأساسية *</Label>
                    <Input
                      id="base-unit"
                      value={templateForm.base_unit}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, base_unit: e.target.value }))}
                      placeholder="حبة"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="template-category">فئة القالب</Label>
                    <Select
                      value={templateForm.category}
                      onValueChange={(value) => setTemplateForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">عام</SelectItem>
                        <SelectItem value="liquids">سوائل</SelectItem>
                        <SelectItem value="weight">أوزان</SelectItem>
                        <SelectItem value="length">أطوال</SelectItem>
                        <SelectItem value="area">مساحات</SelectItem>
                        <SelectItem value="volume">أحجام</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template-description">وصف القالب</Label>
                  <Textarea
                    id="template-description"
                    value={templateForm.description}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="وصف تفصيلي للقالب واستخداماته..."
                    rows={3}
                  />
                </div>
                
                {/* Unit Conversions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">تحويلات الوحدات *</h4>
                    <Button onClick={addConversion} size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      إضافة تحويل
                    </Button>
                  </div>
                  
                  {templateForm.conversions.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <Move3D className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">لا توجد تحويلات مضافة</p>
                      <p className="text-sm text-gray-400 mb-4">يجب إضافة تحويل واحد على الأقل</p>
                      <Button onClick={addConversion} size="sm" className="gap-2">
                        <Plus className="w-4 h-4" />
                        إضافة أول تحويل
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {templateForm.conversions.map((conversion, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 bg-gray-50 rounded-lg">
                          <div className="col-span-3">
                            <Label className="text-xs">من الوحدة</Label>
                            <Input
                              value={conversion.fromUnit}
                              onChange={(e) => updateConversion(index, 'fromUnit', e.target.value)}
                              placeholder="مثل: حبة"
                              className="text-sm"
                            />
                          </div>
                          
                          <div className="col-span-3">
                            <Label className="text-xs">إلى الوحدة</Label>
                            <Input
                              value={conversion.toUnit}
                              onChange={(e) => updateConversion(index, 'toUnit', e.target.value)}
                              placeholder="مثل: درزن"
                              className="text-sm"
                            />
                          </div>
                          
                          <div className="col-span-2">
                            <Label className="text-xs">المعامل</Label>
                            <Input
                              type="number"
                              value={conversion.factor}
                              onChange={(e) => updateConversion(index, 'factor', parseFloat(e.target.value) || 1)}
                              placeholder="12"
                              className="text-sm"
                            />
                          </div>
                          
                          <div className="col-span-3">
                            <Label className="text-xs">المعادلة (اختياري)</Label>
                            <Input
                              value={conversion.formula || ""}
                              onChange={(e) => updateConversion(index, 'formula', e.target.value)}
                              placeholder="العدد ÷ 12"
                              className="text-sm"
                            />
                          </div>
                          
                          <div className="col-span-1 flex justify-center">
                            <Button
                              onClick={() => removeConversion(index)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="template-status"
                    checked={templateForm.is_active}
                    onCheckedChange={(checked) => setTemplateForm(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="template-status" className="text-sm">
                    {templateForm.is_active ? "قالب نشط" : "قالب غير نشط"}
                  </Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddTemplateOpen(false)}>
                  إلغاء
                </Button>
                <Button 
                  onClick={handleSaveTemplate} 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isCreatingTemplate || isUpdatingTemplate}
                >
                  {isCreatingTemplate || isUpdatingTemplate ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                  <Save className="w-4 h-4 mr-2" />
                  حفظ القالب
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Template Dialog */}
          <Dialog open={isEditTemplateOpen} onOpenChange={setIsEditTemplateOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-blue-600" />
                  تعديل قالب الوحدة
                </DialogTitle>
                <DialogDescription>
                  تعديل بيانات وتحويلات القالب المحدد
                </DialogDescription>
              </DialogHeader>
              
              {/* Same form as add template */}
              <div className="grid gap-6 py-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-template-name">اسم القالب *</Label>
                    <Input
                      id="edit-template-name"
                      value={templateForm.name_ar}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, name_ar: e.target.value }))}
                      placeholder="مثل: قالب الأعداد الكبيرة"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-template-name-en">الاسم بالإنجليزية</Label>
                    <Input
                      id="edit-template-name-en"
                      value={templateForm.name_en}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, name_en: e.target.value }))}
                      placeholder="Large Quantity Template"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-template-code">رمز القالب *</Label>
                    <Input
                      id="edit-template-code"
                      value={templateForm.code}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="LQT"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-base-unit">الوحدة الأساسية *</Label>
                    <Input
                      id="edit-base-unit"
                      value={templateForm.base_unit}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, base_unit: e.target.value }))}
                      placeholder="حبة"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-template-category">فئة القالب</Label>
                    <Select
                      value={templateForm.category}
                      onValueChange={(value) => setTemplateForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">عام</SelectItem>
                        <SelectItem value="liquids">سوائل</SelectItem>
                        <SelectItem value="weight">أوزان</SelectItem>
                        <SelectItem value="length">أطوال</SelectItem>
                        <SelectItem value="area">مساحات</SelectItem>
                        <SelectItem value="volume">أحجام</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-template-description">وصف القالب</Label>
                  <Textarea
                    id="edit-template-description"
                    value={templateForm.description}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="وصف تفصيلي للقالب واستخداماته..."
                    rows={3}
                  />
                </div>
                
                {/* Unit Conversions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">تحويلات الوحدات *</h4>
                    <Button onClick={addConversion} size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      إضافة تحويل
                    </Button>
                  </div>
                  
                  {templateForm.conversions.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <Move3D className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">لا توجد تحويلات مضافة</p>
                      <p className="text-sm text-gray-400 mb-4">يجب إضافة تحويل واحد على الأقل</p>
                      <Button onClick={addConversion} size="sm" className="gap-2">
                        <Plus className="w-4 h-4" />
                        إضافة أول تحويل
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {templateForm.conversions.map((conversion, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 bg-gray-50 rounded-lg">
                          <div className="col-span-3">
                            <Label className="text-xs">من الوحدة</Label>
                            <Input
                              value={conversion.fromUnit}
                              onChange={(e) => updateConversion(index, 'fromUnit', e.target.value)}
                              placeholder="مثل: حبة"
                              className="text-sm"
                            />
                          </div>
                          
                          <div className="col-span-3">
                            <Label className="text-xs">إلى الوحدة</Label>
                            <Input
                              value={conversion.toUnit}
                              onChange={(e) => updateConversion(index, 'toUnit', e.target.value)}
                              placeholder="مثل: درزن"
                              className="text-sm"
                            />
                          </div>
                          
                          <div className="col-span-2">
                            <Label className="text-xs">المعامل</Label>
                            <Input
                              type="number"
                              value={conversion.factor}
                              onChange={(e) => updateConversion(index, 'factor', parseFloat(e.target.value) || 1)}
                              placeholder="12"
                              className="text-sm"
                            />
                          </div>
                          
                          <div className="col-span-3">
                            <Label className="text-xs">المعادلة (اختياري)</Label>
                            <Input
                              value={conversion.formula || ""}
                              onChange={(e) => updateConversion(index, 'formula', e.target.value)}
                              placeholder="العدد ÷ 12"
                              className="text-sm"
                            />
                          </div>
                          
                          <div className="col-span-1 flex justify-center">
                            <Button
                              onClick={() => removeConversion(index)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-template-status"
                    checked={templateForm.is_active}
                    onCheckedChange={(checked) => setTemplateForm(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="edit-template-status" className="text-sm">
                    {templateForm.is_active ? "قالب نشط" : "قالب غير نشط"}
                  </Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditTemplateOpen(false)}>
                  إلغاء
                </Button>
                <Button 
                  onClick={handleSaveTemplate} 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isCreatingCategory || isUpdatingCategory}
                >
                  {isCreatingCategory || isUpdatingCategory ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                  <Save className="w-4 h-4 mr-2" />
                  حفظ التعديلات
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        </Tabs>
      </AnimatedCard>
    </div>
  );
}