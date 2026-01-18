import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, MapPin, Calendar, PieChart, Edit2, Trash2, Settings as SettingsIcon, List, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import API hooks
import {
  useGetAllDropdownDefinitionsQuery,
  useCreateDropdownDefinitionMutation,
  useUpdateDropdownDefinitionMutation,
  useDeleteDropdownDefinitionMutation,
  useToggleDefinitionStatusMutation,
  useAddValueToDefinitionMutation,
  useRemoveValueFromDefinitionMutation,
  useGetAllSupplierCategoriesQuery,
  useCreateSupplierCategoryMutation,
  useUpdateSupplierCategoryMutation,
  useDeleteSupplierCategoryMutation,
  useToggleCategoryStatusMutation,
  useGetAllSupplyRegionsQuery,
  useCreateSupplyRegionMutation,
  useUpdateSupplyRegionMutation,
  useDeleteSupplyRegionMutation,
  useToggleRegionStatusMutation,
  useAddBranchToRegionMutation,
  useRemoveBranchFromRegionMutation,
  useGetAllPaymentTermsQuery,
  useCreatePaymentTermMutation,
  useUpdatePaymentTermMutation,
  useDeletePaymentTermMutation,
  useToggleTermStatusMutation,
  useGetSettingsStatisticsQuery,
} from "@/services/supplierSettingsApi";

// Types
interface SupplierCategory {
  id: string;
  name: string;
  description: string;
  active: boolean;
  color?: string;
  icon?: string;
}

interface SupplyRegion {
  id: string;
  name: string;
  branches: string[];
  active: boolean;
  country?: string;
  city?: string;
  district?: string;
}

interface PaymentTerm {
  id: string;
  name: string;
  days: number;
  description: string;
  type?: string;
  active?: boolean;
}

interface DropdownDefinition {
  id: string;
  name: string;
  category: string;
  values: string[];
  active: boolean;
  description?: string;
}

const SupplierSettings = () => {
  const { toast } = useToast();

  // API Queries
  const { data: dropdownDefinitionsData, isLoading: isLoadingDefinitions } = useGetAllDropdownDefinitionsQuery();
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetAllSupplierCategoriesQuery();
  const { data: regionsData, isLoading: isLoadingRegions } = useGetAllSupplyRegionsQuery();
  const { data: paymentTermsData, isLoading: isLoadingPaymentTerms } = useGetAllPaymentTermsQuery();
  const { data: statisticsData, isLoading: isLoadingStatistics } = useGetSettingsStatisticsQuery();

  // API Mutations
  const [createDropdownDefinition] = useCreateDropdownDefinitionMutation();
  const [updateDropdownDefinition] = useUpdateDropdownDefinitionMutation();
  const [deleteDropdownDefinition] = useDeleteDropdownDefinitionMutation();
  const [toggleDefinitionStatus] = useToggleDefinitionStatusMutation();
  const [addValueToDefinition] = useAddValueToDefinitionMutation();
  const [removeValueFromDefinition] = useRemoveValueFromDefinitionMutation();

  const [createSupplierCategory] = useCreateSupplierCategoryMutation();
  const [updateSupplierCategory] = useUpdateSupplierCategoryMutation();
  const [deleteSupplierCategory] = useDeleteSupplierCategoryMutation();
  const [toggleCategoryStatus] = useToggleCategoryStatusMutation();

  const [createSupplyRegion] = useCreateSupplyRegionMutation();
  const [updateSupplyRegion] = useUpdateSupplyRegionMutation();
  const [deleteSupplyRegion] = useDeleteSupplyRegionMutation();
  const [toggleRegionStatus] = useToggleRegionStatusMutation();
  const [addBranchToRegion] = useAddBranchToRegionMutation();
  const [removeBranchFromRegion] = useRemoveBranchFromRegionMutation();

  const [createPaymentTerm] = useCreatePaymentTermMutation();
  const [updatePaymentTerm] = useUpdatePaymentTermMutation();
  const [deletePaymentTerm] = useDeletePaymentTermMutation();
  const [toggleTermStatus] = useToggleTermStatusMutation();

  // Extract data from API responses
  const dropdownDefinitions = dropdownDefinitionsData?.data?.definitions || [];
  const categories = categoriesData?.data?.categories || [];
  const regions = regionsData?.data?.regions || [];
  const paymentTerms = paymentTermsData?.data?.terms || [];
  const statistics = statisticsData?.data;

  // State لإضافة تعريف جديد
  const [newDefinition, setNewDefinition] = useState<Partial<DropdownDefinition>>({
    values: [],
    active: true
  });
  const [showAddDefinitionForm, setShowAddDefinitionForm] = useState(false);
  const [newValueInput, setNewValueInput] = useState("");

  // Form states
  const [newCategory, setNewCategory] = useState({ name: "", description: "", active: true });
  const [newRegion, setNewRegion] = useState({ name: "", branches: [], active: true, country: "المملكة العربية المصرية", city: "" });
  const [newPaymentTerm, setNewPaymentTerm] = useState({ name: "", days: 0, description: "", type: "immediate" });

  // Functions
  const addCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "خطأ في التسجيل",
        description: "يرجى إدخال اسم التصنيف",
        variant: "destructive",
      });
      return;
    }

    try {
      await createSupplierCategory(newCategory).unwrap();
      setNewCategory({ name: "", description: "", active: true });
      
      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة التصنيف الجديد",
      });
    } catch (error) {
      toast({
        title: "خطأ في الإضافة",
        description: "فشل في إضافة التصنيف",
        variant: "destructive",
      });
    }
  };

  // وظائف التعريفات المنسدلة
  const addDefinition = async () => {
    if (!newDefinition.name || !newDefinition.category || !Array.isArray(newDefinition.values) || newDefinition.values.length === 0) {
      toast({
        title: "خطأ في الإدخال",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      await createDropdownDefinition(newDefinition as DropdownDefinition).unwrap();
      setNewDefinition({
        values: [],
        active: true
      });
      setShowAddDefinitionForm(false);
      setNewValueInput("");
      
      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة التعريف الجديد",
      });
    } catch (error) {
      toast({
        title: "خطأ في الإضافة",
        description: "فشل في إضافة التعريف",
        variant: "destructive",
      });
    }
  };

  const addValueToDefinitionHandler = async (definitionId: string, value: string) => {
    if (!value.trim()) return;

    try {
      await addValueToDefinition({ id: definitionId, value: value.trim() }).unwrap();
      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة القيمة الجديدة",
      });
    } catch (error) {
      toast({
        title: "خطأ في الإضافة",
        description: "فشل في إضافة القيمة",
        variant: "destructive",
      });
    }
  };

  const removeValueFromDefinitionHandler = async (definitionId: string, valueIndex: number) => {
    try {
      await removeValueFromDefinition({ id: definitionId, valueIndex }).unwrap();
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف القيمة",
      });
    } catch (error) {
      toast({
        title: "خطأ في الحذف",
        description: "فشل في حذف القيمة",
        variant: "destructive",
      });
    }
  };

  const toggleDefinitionStatusHandler = async (definitionId: string) => {
    try {
      await toggleDefinitionStatus(definitionId).unwrap();
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تغيير حالة التعريف",
      });
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "فشل في تغيير حالة التعريف",
        variant: "destructive",
      });
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteSupplierCategory(id).unwrap();
      toast({
        title: "تم الحذف",
        description: "تم حذف التصنيف بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في الحذف",
        description: "فشل في حذف التصنيف",
        variant: "destructive",
      });
    }
  };

  const toggleCategoryStatusHandler = async (id: string) => {
    try {
      await toggleCategoryStatus(id).unwrap();
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تغيير حالة التصنيف",
      });
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "فشل في تغيير حالة التصنيف",
        variant: "destructive",
      });
    }
  };

  const addRegion = async () => {
    if (!newRegion.name.trim()) {
      toast({
        title: "خطأ في التسجيل",
        description: "يرجى إدخال اسم المنطقة",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const regionData = {
        ...newRegion,
        branches: ["فرع رئيسي"],
      };
      
      await createSupplyRegion(regionData).unwrap();
      setNewRegion({ name: "", branches: [], active: true, country: "المملكة العربية المصرية", city: "" });
      
      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة منطقة التوريد الجديدة",
      });
    } catch (error) {
      toast({
        title: "خطأ في الإضافة",
        description: "فشل في إضافة المنطقة",
        variant: "destructive",
      });
    }
  };

  const deleteRegion = async (id: string) => {
    try {
      await deleteSupplyRegion(id).unwrap();
      toast({
        title: "تم الحذف",
        description: "تم حذف المنطقة بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في الحذف",
        description: "فشل في حذف المنطقة",
        variant: "destructive",
      });
    }
  };

  const addPaymentTerm = async () => {
    if (!newPaymentTerm.name.trim()) {
      toast({
        title: "خطأ في التسجيل",
        description: "يرجى إدخال اسم شرط الدفع",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const termData = {
        ...newPaymentTerm,
        active: true,
      };
      
      await createPaymentTerm(termData).unwrap();
      setNewPaymentTerm({ name: "", days: 0, description: "", type: "immediate" });
      
      toast({
        title: "تم الإضافة بنجاح",
        description: "تم إضافة شرط الدفع الجديد",
      });
    } catch (error) {
      toast({
        title: "خطأ في الإضافة",
        description: "فشل في إضافة شرط الدفع",
        variant: "destructive",
      });
    }
  };

  const deletePaymentTermHandler = async (id: string) => {
    try {
      await deletePaymentTerm(id).unwrap();
      toast({
        title: "تم الحذف",
        description: "تم حذف شرط الدفع بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في الحذف",
        description: "فشل في حذف شرط الدفع",
        variant: "destructive",
      });
    }
  };

  // Loading states
  if (isLoadingDefinitions || isLoadingCategories || isLoadingRegions || isLoadingPaymentTerms) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6 font-cairo">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6 font-cairo">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Animated Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-white via-blue-50/50 to-indigo-50/30 p-8 rounded-2xl border border-white/60 shadow-2xl backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary-blue/5"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/20 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative flex items-center gap-4 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary-blue rounded-2xl blur-lg opacity-30 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-r from-primary to-secondary-blue rounded-2xl shadow-lg">
                <SettingsIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                إعدادات الموردين
              </h1>
              <p className="text-lg text-gray-600 font-medium">تكوين وإدارة تصنيفات الموردين ومناطق التوريد وشروط الدفع بطريقة احترافية</p>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="definitions" className="w-full">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 via-indigo-100/30 to-purple-100/50 rounded-2xl blur-xl"></div>
            <TabsList className="relative grid w-full grid-cols-4 p-2 bg-white/80 backdrop-blur-md border-2 border-white/60 shadow-2xl rounded-2xl">
              <TabsTrigger 
                value="definitions" 
                className="flex items-center gap-3 text-gray-700 font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-indigo-500/25 transition-all duration-500 rounded-xl hover:bg-indigo-50 hover:text-indigo-700"
              >
                <Database className="w-5 h-5" />
                <span className="hidden lg:inline font-semibold">التعريفات المنسدلة</span>
                <span className="lg:hidden font-semibold">التعريفات</span>
              </TabsTrigger>
              <TabsTrigger 
                value="categories" 
                className="flex items-center gap-3 text-gray-700 font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-blue-500/25 transition-all duration-500 rounded-xl hover:bg-blue-50 hover:text-blue-700"
              >
                <Package className="w-5 h-5" />
                <span className="hidden lg:inline font-semibold">تصنيفات الموردين</span>
                <span className="lg:hidden font-semibold">التصنيفات</span>
              </TabsTrigger>
              <TabsTrigger 
                value="regions" 
                className="flex items-center gap-3 text-gray-700 font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-emerald-500/25 transition-all duration-500 rounded-xl hover:bg-emerald-50 hover:text-emerald-700"
              >
                <MapPin className="w-5 h-5" />
                <span className="hidden lg:inline font-semibold">مناطق التوريد</span>
                <span className="lg:hidden font-semibold">المناطق</span>
              </TabsTrigger>
              <TabsTrigger 
                value="payment" 
                className="flex items-center gap-3 text-gray-700 font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-purple-500/25 transition-all duration-500 rounded-xl hover:bg-purple-50 hover:text-purple-700"
              >
                <Calendar className="w-5 h-5" />
                <span className="hidden lg:inline font-semibold">شروط الدفع</span>
                <span className="lg:hidden font-semibold">الدفع</span>
              </TabsTrigger>
              <TabsTrigger 
                value="advanced" 
                className="flex items-center gap-3 text-gray-700 font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-orange-500/25 transition-all duration-500 rounded-xl hover:bg-orange-50 hover:text-orange-700"
              >
                <SettingsIcon className="w-5 h-5" />
                <span className="hidden lg:inline font-semibold">إعدادات متقدمة</span>
                <span className="lg:hidden font-semibold">متقدم</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="definitions" 
                  className="group relative flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-gray-600 font-semibold transition-all duration-500 hover:text-gray-900 data-[state=active]:text-white data-[state=active]:shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 opacity-0 data-[state=active]:opacity-100 transition-all duration-500 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl"></div>
                  <Database className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative z-10 text-sm font-bold">التعريفات المنسدلة</span>
                </TabsTrigger>
            </TabsList>
          </div>

          {/* تصنيفات الموردين */}
          <TabsContent value="categories" className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-indigo-100/20 to-purple-100/30 rounded-3xl blur-2xl"></div>
              <Card className="relative shadow-2xl border-0 bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                <CardHeader className="bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 backdrop-blur-sm">
                  <CardTitle className="flex items-center gap-4 text-gray-800">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-md opacity-30 animate-pulse"></div>
                      <div className="relative p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">تصنيفات الموردين</h3>
                      <CardDescription className="text-gray-600 mt-1 font-medium">إنشاء وإدارة تصنيفات الموردين حسب نوع المنتجات والخدمات</CardDescription>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  {/* Add New Category Form */}
                  <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/50 p-6 rounded-2xl border border-gray-200/50 shadow-inner">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-blue-600" />
                      إضافة تصنيف جديد
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="categoryName" className="text-sm font-semibold text-gray-700">اسم التصنيف</Label>
                        <Input
                          id="categoryName"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="مثل: مورد مواد كيميائية"
                          className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 hover:border-blue-300"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="categoryDesc" className="text-sm font-semibold text-gray-700">وصف التصنيف</Label>
                        <Textarea
                          id="categoryDesc"
                          value={newCategory.description}
                          onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="وصف تفصيلي للتصنيف"
                          rows={3}
                          className="border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 hover:border-blue-300 resize-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={newCategory.active}
                          onCheckedChange={(checked) => setNewCategory(prev => ({ ...prev, active: checked }))}
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <Label className="text-sm font-medium text-gray-700">تفعيل التصنيف</Label>
                      </div>
                      <Button 
                        onClick={addCategory} 
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        إضافة التصنيف
                      </Button>
                    </div>
                  </div>

                  {/* Categories List */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-indigo-600" />
                      التصنيفات الحالية
                    </h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                      {categories.map((category, index) => (
                        <div 
                          key={category.id} 
                          className="group relative flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50/50 border-2 border-gray-100 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-blue-200"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex-1">
                            <h5 className="font-bold text-gray-900 text-lg mb-1">{category.name}</h5>
                            <p className="text-gray-600 text-sm leading-relaxed">{category.description}</p>
                          </div>
                          <div className="relative flex items-center gap-4">
                            <Switch
                              checked={category.active}
                              onCheckedChange={() => toggleCategoryStatusHandler(category.id)}
                              className="data-[state=checked]:bg-green-600"
                            />
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteCategory(category.id)}
                              className="p-3 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-300 transform hover:scale-110"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* مناطق التوريد */}
          <TabsContent value="regions" className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/30 via-teal-100/20 to-green-100/30 rounded-3xl blur-2xl"></div>
              <Card className="relative shadow-2xl border-0 bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500"></div>
                <CardHeader className="bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-green-50/80 backdrop-blur-sm">
                  <CardTitle className="flex items-center gap-4 text-gray-800">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-md opacity-30 animate-pulse"></div>
                      <div className="relative p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">مناطق التوريد</h3>
                      <CardDescription className="text-gray-600 mt-1 font-medium">ربط الموردين بالمناطق الجغرافية والفروع المختلفة</CardDescription>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  {/* Add New Region Form */}
                  <div className="bg-gradient-to-r from-gray-50/80 to-emerald-50/50 p-6 rounded-2xl border border-gray-200/50 shadow-inner">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-emerald-600" />
                      إضافة منطقة توريد جديدة
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="regionName" className="text-sm font-semibold text-gray-700">اسم المنطقة</Label>
                        <Input
                          id="regionName"
                          value={newRegion.name}
                          onChange={(e) => setNewRegion(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="مثل: المنطقة الشرقية"
                          className="h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl transition-all duration-300 hover:border-emerald-300"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">الفروع المشمولة</Label>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={newRegion.active}
                            onCheckedChange={(checked) => setNewRegion(prev => ({ ...prev, active: checked }))}
                            className="data-[state=checked]:bg-emerald-600"
                          />
                          <Label className="text-sm font-medium text-gray-700">تفعيل المنطقة</Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button 
                        onClick={addRegion}
                        className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        إضافة المنطقة
                      </Button>
                    </div>
                  </div>

                  {/* Regions List */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-teal-600" />
                      المناطق الحالية
                    </h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                      {regions.map((region, index) => (
                        <div 
                          key={region.id} 
                          className="group relative flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50/50 border-2 border-gray-100 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-emerald-200"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex-1">
                            <h5 className="font-bold text-gray-900 text-lg mb-2">{region.name}</h5>
                            <div className="flex flex-wrap gap-2">
                              {region.branches.map((branch, idx) => (
                                <Badge 
                                  key={idx} 
                                  variant="outline" 
                                  className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 transition-colors"
                                >
                                  {branch}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="relative flex items-center gap-4">
                            <Badge 
                              variant={region.active ? "default" : "secondary"}
                              className={region.active 
                                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg" 
                                : "bg-gray-200 text-gray-600"
                              }
                            >
                              {region.active ? "فعال" : "غير فعال"}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteRegion(region.id)}
                              className="p-3 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-300 transform hover:scale-110"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* شروط الدفع */}
          <TabsContent value="payment" className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100/30 via-pink-100/20 to-rose-100/30 rounded-3xl blur-2xl"></div>
              <Card className="relative shadow-2xl border-0 bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>
                <CardHeader className="bg-gradient-to-r from-purple-50/80 via-pink-50/60 to-rose-50/80 backdrop-blur-sm">
                  <CardTitle className="flex items-center gap-4 text-gray-800">
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-500 rounded-2xl blur-md opacity-30 animate-pulse"></div>
                      <div className="relative p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">شروط الدفع</h3>
                      <CardDescription className="text-gray-600 mt-1 font-medium">تحديد وإدارة سياسات الدفع المختلفة للموردين</CardDescription>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  {/* Add New Payment Term Form */}
                  <div className="bg-gradient-to-r from-gray-50/80 to-purple-50/50 p-6 rounded-2xl border border-gray-200/50 shadow-inner">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-purple-600" />
                      إضافة شرط دفع جديد
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="termName" className="text-sm font-semibold text-gray-700">اسم شرط الدفع</Label>
                        <Input
                          id="termName"
                          value={newPaymentTerm.name}
                          onChange={(e) => setNewPaymentTerm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="مثل: دفع آجل 60 يوم"
                          className="h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-300 hover:border-purple-300"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="termDays" className="text-sm font-semibold text-gray-700">عدد الأيام</Label>
                        <Input
                          id="termDays"
                          type="number"
                          value={newPaymentTerm.days}
                          onChange={(e) => setNewPaymentTerm(prev => ({ ...prev, days: Number(e.target.value) }))}
                          placeholder="0"
                          className="h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-300 hover:border-purple-300"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="termDesc" className="text-sm font-semibold text-gray-700">وصف الشرط</Label>
                        <Textarea
                          id="termDesc"
                          value={newPaymentTerm.description}
                          onChange={(e) => setNewPaymentTerm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="وصف تفصيلي لشرط الدفع"
                          rows={2}
                          className="border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all duration-300 hover:border-purple-300 resize-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button 
                        onClick={addPaymentTerm}
                        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        إضافة الشرط
                      </Button>
                    </div>
                  </div>

                  {/* Payment Terms List */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-pink-600" />
                      شروط الدفع الحالية
                    </h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                      {paymentTerms.map((term, index) => (
                        <div 
                          key={term.id} 
                          className="group relative flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50/50 border-2 border-gray-100 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-purple-200"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h5 className="font-bold text-gray-900 text-lg">{term.name}</h5>
                              <Badge 
                                variant="outline" 
                                className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 transition-colors"
                              >
                                {term.days} يوم
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">{term.description}</p>
                          </div>
                          <div className="relative flex items-center gap-4">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deletePaymentTermHandler(term.id)}
                              className="p-3 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-300 transform hover:scale-110"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* تاب التعريفات المنسدلة */}
          <TabsContent value="definitions" className="mt-8">
            <div className="space-y-6">
              {/* إضافة تعريف جديد */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 to-indigo-50/80 backdrop-blur-md border-0 shadow-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                <CardHeader className="bg-gradient-to-r from-indigo-50/80 to-purple-50/60 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                        <Database className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                          التعريفات المنسدلة
                        </CardTitle>
                      </div>
                    </div>
                    <Button 
                      onClick={() => {
                        if (!showAddDefinitionForm) {
                          // إعادة تعيين النموذج عند فتحه
                          setNewDefinition({
                            values: [],
                            active: true
                          });
                          setNewValueInput("");
                        }
                        setShowAddDefinitionForm(!showAddDefinitionForm);
                      }}
                      className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة تعريف جديد
                    </Button>
                  </div>
                </CardHeader>
                
                {showAddDefinitionForm && (
                  <CardContent className="p-6 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="defName">اسم التعريف</Label>
                        <Input
                          id="defName"
                          value={newDefinition.name || ""}
                          onChange={(e) => setNewDefinition(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="مثال: طرق الدفع"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="defCategory">الفئة</Label>
                        <Input
                          id="defCategory"
                          value={newDefinition.category || ""}
                          onChange={(e) => setNewDefinition(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="مثال: payment"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <Label htmlFor="defDescription">الوصف (اختياري)</Label>
                      <textarea
                        id="defDescription"
                        value={newDefinition.description || ""}
                        onChange={(e) => setNewDefinition(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="وصف تفصيلي للتعريف"
                        rows={3}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Switch
                          id="defActive"
                          checked={newDefinition.active ?? true}
                          onCheckedChange={(checked) => setNewDefinition(prev => ({ ...prev, active: checked }))}
                        />
                        <Label htmlFor="defActive">نشط</Label>
                      </div>
                      <Label>القيم</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          value={newValueInput}
                          onChange={(e) => setNewValueInput(e.target.value)}
                          placeholder="أدخل قيمة جديدة"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              if (newValueInput.trim()) {
                                setNewDefinition(prev => ({
                                  ...prev,
                                  values: Array.isArray(prev.values) ? [...prev.values, newValueInput.trim()] : [newValueInput.trim()]
                                }));
                                setNewValueInput("");
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            if (newValueInput.trim()) {
                              setNewDefinition(prev => ({
                                ...prev,
                                values: Array.isArray(prev.values) ? [...prev.values, newValueInput.trim()] : [newValueInput.trim()]
                              }));
                              setNewValueInput("");
                            }
                          }}
                        >
                          إضافة
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Array.isArray(newDefinition.values) && newDefinition.values.map((value, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="flex items-center gap-1 px-3 py-1"
                          >
                            {value}
                            <button
                              type="button"
                              onClick={() => {
                                setNewDefinition(prev => ({
                                  ...prev,
                                  values: Array.isArray(prev.values) ? prev.values.filter((_, i) => i !== index) : []
                                }));
                              }}
                              className="ml-1 text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={addDefinition}>حفظ التعريف</Button>
                      <Button variant="outline" onClick={() => {
                        setShowAddDefinitionForm(false);
                        setNewDefinition({
                          values: [],
                          active: true
                        });
                        setNewValueInput("");
                      }}>إلغاء</Button>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* قائمة التعريفات */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dropdownDefinitions.map((definition) => (
                  <Card key={definition.id} className="relative overflow-hidden bg-gradient-to-br from-white/95 to-gray-50/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md">
                            <List className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-gray-900">{definition.name}</CardTitle>
                            <div className="text-sm text-gray-500 font-medium">الفئة: {definition.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={definition.active}
                            onCheckedChange={() => toggleDefinitionStatusHandler(definition.id)}
                          />
                          <Badge variant={definition.active ? "default" : "secondary"}>
                            {definition.active ? "نشط" : "معطل"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">القيم المتاحة ({definition.values.length})</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {definition.values.map((value, valueIndex) => (
                              <Badge 
                                key={valueIndex} 
                                variant="outline" 
                                className="flex items-center gap-1 px-2 py-1 bg-white/80 hover:bg-gray-50 transition-colors duration-200"
                              >
                                {value}
                                <button
                                  type="button"
                                  onClick={() => removeValueFromDefinitionHandler(definition.id, valueIndex)}
                                  className="ml-1 text-red-500 hover:text-red-700 transition-colors duration-200"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t border-gray-100">
                          <div className="flex gap-2">
                            <Input
                              placeholder="إضافة قيمة جديدة..."
                              className="flex-1"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  const input = e.target as HTMLInputElement;
                                  if (input.value.trim()) {
                                    addValueToDefinitionHandler(definition.id, input.value.trim());
                                    input.value = "";
                                  }
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                if (input.value.trim()) {
                                  addValueToDefinitionHandler(definition.id, input.value.trim());
                                  input.value = "";
                                }
                              }}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

        {/* إعدادات متقدمة */}
        <TabsContent value="advanced" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* إعدادات النظام */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <SettingsIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  إعدادات النظام
                </CardTitle>
                <CardDescription>إعدادات عامة لنظام إدارة الموردين</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">تفعيل تقييم الموردين التلقائي</p>
                    <p className="text-sm text-gray-600">تقييم تلقائي شهري للموردين</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">إشعارات انتهاء العقود</p>
                    <p className="text-sm text-gray-600">تنبيه قبل 30 يوم من انتهاء العقد</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">موافقة متعددة المستويات</p>
                    <p className="text-sm text-gray-600">طلب موافقة من عدة مدراء</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* الملخص السريع */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <PieChart className="w-5 h-5 text-green-600" />
                  </div>
                  ملخص الإعدادات
                </CardTitle>
                <CardDescription>نظرة سريعة على إعدادات النظام الحالية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
                    <div className="text-sm text-gray-600">التصنيفات</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{regions.length}</div>
                    <div className="text-sm text-gray-600">المناطق</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{paymentTerms.length}</div>
                    <div className="text-sm text-gray-600">شروط الدفع</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{categories.filter(c => c.active).length}</div>
                    <div className="text-sm text-gray-600">نشط</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary-blue hover:from-primary/90 hover:to-secondary-blue/90 text-white shadow-lg">
                    حفظ جميع الإعدادات
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupplierSettings;