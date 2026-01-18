import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  Edit,
  Eye,
  Filter,
  Save,
  Download,
  Printer,
  DollarSign,
  Package,
  Building2,
  Percent,
  TrendingUp,
  MoreVertical,
  Settings,
  Clock,
  Calendar,
  User,
  CheckCircle,
  AlertTriangle,
  History,
  BarChart3,
  Tags,
  Star,
  Copy,
  RefreshCw,
  Loader2,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useBranch } from '@/contexts/BranchContext';
import { useBranchData } from '@/hooks/useBranchData';
import { 
  useGetAllProductsQuery, 
  useCreateProductMutation, 
  useUpdateProductMutation 
} from '@/services/productApi';

// Types
interface Product {
  product_id: string;
  id?: string;
  item_code: string;
  item_name: string;
  category: string;
  cost_price: number;
  selling_price: number;
  discount_percent?: number;
  currency: string;
  unit: string;
  vat: number;
  status: "active" | "inactive" | "discontinued";
  branch_id: string;
  branch_name: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  notes?: string;
  minimum_quantity?: number;
  maximum_quantity?: number;
  profit_margin?: number;
}

interface PriceHistory {
  id: string;
  old_price: number;
  new_price: number;
  change_date: string;
  changed_by: string;
  reason: string;
}

interface PriceTemplate {
  id: string;
  name: string;
  description: string;
  markup_percent: number;
  category: string;
  branch_ids: string[];
  is_default: boolean;
}

const PriceList = () => {
  const { toast } = useToast();
  const { selectedBranch } = useBranch();
  const { getActiveBranches } = useBranch();
  const { getWarehousesByBranch } = useBranchData();

  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showBulkUpdateModal, setBulkUpdateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [priceUpdateMode, setPriceUpdateMode] = useState<"single" | "bulk" | "template">("single");
  const [editForm, setEditForm] = useState({
    cost_price: 0,
    selling_price: 0,
    discount_percent: 0,
    vat: 15,
    reason: ""
  });
  const [newItemForm, setNewItemForm] = useState({
    item_code: "",
    item_name: "",
    category: "",
    cost_price: 0,
    selling_price: 0,
    unit: "خدمة",
    currency: "SAR",
    vat: 15,
    notes: ""
  });

  // State for product selection
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [filteredProductsForSelection, setFilteredProductsForSelection] = useState<Product[]>([]);
  const [bulkUpdateForm, setBulkUpdateForm] = useState({
    increase_percent: 0,
    target_category: "",
    reason: ""
  });

  // RTK Query hooks
  const { data: productsResponse, isLoading, error, refetch } = useGetAllProductsQuery(undefined as any);
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  // Local state
  const [categories, setCategories] = useState<string[]>([]);
  const [currencies] = useState(["SAR", "USD", "EUR"]);
  const [units] = useState(["خدمة", "لتر", "  ", "كيلو", "متر", "عبوة"]);

  // Helper functions to get product data
  const getItemName = (item: any): string => {
    if (!item) return 'غير محدد';
    if (typeof item === 'object') {
      return item.name_ar || item.name_en || item.item_name || 'غير محدد';
    }
    if (typeof item === 'string') {
      return item;
    }
    return 'غير محدد';
  };

  const getItemId = (item: any): string => {
    if (!item) return '';
    return item.product_id || item.id || '';
  };

  const getItemCode = (item: any): string => {
    if (!item) return 'غير محدد';
    if (typeof item === 'object') {
      return item.product_id || item.item_code || 'غير محدد';
    }
    if (typeof item === 'string') {
      return item;
    }
    return 'غير محدد';
  };

  const getItemCategoryName = (category: any): string => {
    if (!category) return 'غير محدد';
    if (typeof category === 'object' && category !== null) {
      return category.name_ar || category.name_en || 'غير محدد';
    }
    if (typeof category === 'string') {
      return category;
    }
    if (typeof category === 'number') {
      return category.toString();
    }
    return 'غير محدد';
  };

  const getItemCategoryId = (category: any): string => {
    if (!category) return '';
    if (typeof category === 'object' && category !== null) {
      return category.category_id || category.id || '';
    }
    return category || '';
  };

  const getItemCostPrice = (item: any): number => {
    if (!item) return 0;
    return item.cost_price || 0;
  };

  const getItemSellingPrice = (item: any): number => {
    if (!item) return 0;
    return item.selling_price || 0;
  };

  const getItemUnit = (item: any): string => {
    if (!item) return 'غير محدد';
    return item.unit || item.unit_of_measure || 'غير محدد';
  };

  const getItemCurrency = (item: any): string => {
    if (!item) return '';
    return item.currency || '';
  };

  const getItemStatus = (item: any): string => {
    if (!item) return 'غير محدد';
    return item.status || 'غير محدد';
  };

  const getItemBranchName = (item: any): string => {
    if (!item) return 'غير محدد';
    return item.branch_name || 'غير محدد';
  };

  // Extract products and categories from API response - using same method as OpeningStock
  const products = (productsResponse as any)?.data?.products ?? (productsResponse as any)?.products ?? [];
  
  useEffect(() => {
    if (products.length > 0) {
      console.log('First product data:', products[0]);
      console.log('Product keys:', Object.keys(products[0]));
      console.log('Product category type:', typeof products[0].category);
      console.log('Product category value:', products[0].category);
      
      const uniqueCategories = [...new Set(products.map((product: Product) => {
        // Handle case where category might be an object
        if (typeof product.category === 'object' && product.category !== null) {
          return product.category.name_ar || product.category.name_en || 'غير محدد';
        }
        if (typeof product.category === 'string') {
          return product.category;
        }
        if (typeof product.category === 'number') {
          return String(product.category);
        }
        return 'غير محدد';
      }))] as string[];
      setCategories(uniqueCategories);
      
      // Additional debugging for category objects
      const categoryObjects = products.filter((p: any) => typeof p.category === 'object' && p.category !== null);
      if (categoryObjects.length > 0) {
        console.log('Products with category objects:', categoryObjects.length);
        console.log('Sample category object:', categoryObjects[0].category);
      }
    }
  }, [products]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      toast({
        title: "خطأ في جلب البيانات",
        description: "فشل في جلب المنتجات من قاعدة البيانات",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // Filter products for selection
  useEffect(() => {
    // Ensure products is an array and has valid items
    if (!Array.isArray(products) || products.length === 0) {
      console.log('Products is not an array or empty:', products);
      setFilteredProductsForSelection([]);
      return;
    }

    console.log('Products available:', products.length);
    console.log('Product search term:', productSearchTerm);
    
    if (productSearchTerm.trim() === "") {
      // Show first 5 products when search is empty
      const firstProducts = products.slice(0, 5);
      console.log('Showing first 5 products:', firstProducts);
      setFilteredProductsForSelection(firstProducts);
      return;
    }

    const filtered = products.filter((product: Product) => 
      (getItemName(product)?.toLowerCase() || '').includes(productSearchTerm.toLowerCase()) ||
      (getItemCode(product)?.toLowerCase() || '').includes(productSearchTerm.toLowerCase()) ||
      (getItemCategoryName(product.category)?.toLowerCase() || '').includes(productSearchTerm.toLowerCase())
    );
    console.log('Filtered products:', filtered.length);
    setFilteredProductsForSelection(filtered.slice(0, 10)); // Limit to 10 results
  }, [productSearchTerm, products]);

  // Filter logic
  const filteredItems = Array.isArray(products) ? products.filter((item: Product) => {
    if (!item) return false;
    
    const matchesSearch = 
      (getItemName(item)?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (getItemCode(item)?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (getItemCategoryName(item.category)?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || getItemCategoryName(item.category) === categoryFilter;
    const matchesBranch = branchFilter === "all" || item.branch_id === branchFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesBranch && matchesStatus;
  }) : [];

  // Statistics
  const totalItems = Array.isArray(products) ? products.length : 0;
  const activeItems = Array.isArray(products) ? products.filter((item: Product) => item && item.status === "active").length : 0;
  const averagePrice = totalItems > 0 ? (Array.isArray(products) ? products.reduce((sum: number, item: Product) => sum + (item?.selling_price || 0), 0) : 0) / totalItems : 0;
  const totalRevenue = Array.isArray(products) ? products.reduce((sum: number, item: Product) => sum + ((item?.selling_price || 0) * (item?.minimum_quantity || 1)), 0) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200";
      case "inactive":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "discontinued":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleEditPrice = (item: Product) => {
    setSelectedItem(item);
    setEditForm({
      cost_price: item.cost_price,
      selling_price: item.selling_price,
      discount_percent: item.discount_percent || 0,
      vat: item.vat,
      reason: ""
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedItem) return;

    try {
      const updatedData = {
        cost_price: editForm.cost_price,
        selling_price: editForm.selling_price,
        discount_percent: editForm.discount_percent,
        vat: editForm.vat,
        reason: editForm.reason || "تعديل السعر"
      };

      const productId = getItemId(selectedItem);
      if (!productId) {
        toast({
          title: "خطأ",
          description: "معرف المنتج غير موجود",
          variant: "destructive"
        });
        return;
      }

      console.log('🔄 جاري تحديث المنتج:', {
        productId,
        updatedData,
        editForm
      });

      const result = await updateProduct({ 
        id: productId, 
        updatedProduct: updatedData 
      }).unwrap();
      
      console.log('✅ نتيجة التحديث:', result);
      
      // إعادة جلب البيانات لتحديث العرض
      await refetch();
      
      setShowEditModal(false);
      toast({
        title: "تم تحديث السعر بنجاح",
        description: `تم تحديث سعر ${getItemName(selectedItem)} بنجاح`,
      });
    } catch (error) {
      toast({
        title: "خطأ في تحديث السعر",
        description: "فشل في تحديث سعر المنتج",
        variant: "destructive"
      });
    }
  };

  const handleAddNewItem = () => {
    console.log('Opening add new item modal');
    console.log('Available products:', products.length);
    console.log('Available categories:', categories);
    
    setNewItemForm({
      item_code: "",
      item_name: "",
      category: categories.length > 0 ? categories[0] : "",
      cost_price: 0,
      selling_price: 0,
      unit: "خدمة",
      currency: "SAR",
      vat: 15,
      notes: ""
    });
    setProductSearchTerm("");
    setFilteredProductsForSelection([]);
    setShowProductSearch(false);
    setShowAddModal(true);
  };

  const handleSelectProduct = (product: Product) => {
    console.log('Selected product:', product);
    
    setNewItemForm({
      item_code: product.item_code,
      item_name: product.item_name,
      category: getItemCategoryName(product.category),
      cost_price: product.cost_price,
      selling_price: product.selling_price,
      unit: product.unit,
      currency: product.currency,
      vat: product.vat,
      notes: product.notes || ""
    });
    setProductSearchTerm("");
    setFilteredProductsForSelection([]);
    setShowProductSearch(false);
  };

  const handleSaveNewItem = async () => {
    if (!newItemForm.item_code || !newItemForm.item_name || !newItemForm.selling_price) {
      toast({
        title: "خطأ في الإدخال",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      const productData = {
        item_code: newItemForm.item_code,
        item_name: newItemForm.item_name,
        category: newItemForm.category,
        cost_price: newItemForm.cost_price,
        selling_price: newItemForm.selling_price,
        currency: newItemForm.currency,
        unit: newItemForm.unit,
        vat: newItemForm.vat,
        status: "active" as const,
        branch_id: selectedBranch?.id || "main",
        notes: newItemForm.notes,
      };

      await createProduct(productData).unwrap();
      setShowAddModal(false);
      toast({
        title: "تم إضافة المنتج بنجاح",
        description: `تم إضافة ${productData.item_name} لقائمة المنتجات`,
      });
    } catch (error) {
      toast({
        title: "خطأ في إضافة المنتج",
        description: "فشل في إضافة المنتج الجديد",
        variant: "destructive"
      });
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkUpdateForm.increase_percent || !bulkUpdateForm.target_category) {
      toast({
        title: "خطأ في الإدخال",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      // For now, we'll update each product individually
      // In the future, this can be optimized with a bulk update API endpoint
      const productsToUpdate = products.filter((p: Product) => getItemCategoryName(p.category) === bulkUpdateForm.target_category);
      
      for (const product of productsToUpdate) {
        const newSellingPrice = Math.round(product.selling_price * (1 + bulkUpdateForm.increase_percent / 100) * 100) / 100;
        const productId = getItemId(product);
        if (!productId) continue;
        
        await updateProduct({
          id: productId,
          updatedProduct: {
            selling_price: newSellingPrice,
            profit_margin: ((newSellingPrice - product.cost_price) / product.cost_price * 100),
          }
        }).unwrap();
      }
      
      setBulkUpdateModal(false);
      toast({
        title: "تم التحديث المجمع بنجاح",
        description: `تم تحديث أسعار فئة ${bulkUpdateForm.target_category} بنسبة ${bulkUpdateForm.increase_percent}%`,
      });
    } catch (error) {
      toast({
        title: "خطأ في التحديث المجمع",
        description: "فشل في تحديث الأسعار المجمعة",
        variant: "destructive"
      });
    }
  };

  const handleCopyToBranch = (item: Product) => {
    toast({
      title: "نسخ السعر",
              description: `سيتم نسخ سعر ${getItemName(item)} لفرع آخر`,
    });
  };

  const handleAddToFavorites = (item: Product) => {
    toast({
      title: "تم إضافة للمفضلة",
              description: `تم إضافة ${getItemName(item)} للمفضلة`,
    });
  };

  const handleViewHistory = (item: Product) => {
    setSelectedItem(item);
    setShowHistoryModal(true);
  };

  const handlePrint = () => {
    const printContent = `
      <html dir="rtl">
      <head>
        <title>قائمة الأسعار - ${selectedBranch?.name || "جميع الفروع"}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 8px; border: 1px solid #ddd; text-align: center; }
          th { background-color: #f5f5f5; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>قائمة الأسعار</h1>
          <h2>${selectedBranch?.name || "جميع الفروع"}</h2>
          <p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>رمز الصنف</th>
              <th>اسم الصنف</th>
              <th>الفئة</th>
              <th>السعر الأساسي</th>
              <th>سعر البيع</th>
              <th>الوحدة</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            ${filteredItems.map(item => `
              <tr>
                <td>${getItemCode(item)}</td>
                <td>${getItemName(item)}</td>
                <td>${getItemCategoryName(item.category)}</td>
                <td>${getItemCostPrice(item)} ${getItemCurrency(item)}</td>
                <td>${getItemSellingPrice(item)} ${getItemCurrency(item)}</td>
                <td>${getItemUnit(item)}</td>
                <td>${getItemStatus(item) === 'active' ? 'نشط' : getItemStatus(item) === 'inactive' ? 'غير نشط' : 'متوقف'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handleExport = () => {
    const csvData = [
      ['رمز الصنف', 'اسم الصنف', 'الفئة', 'السعر الأساسي', 'سعر البيع', 'العملة', 'الوحدة', 'الضريبة %', 'الحالة', 'الفرع', 'تاريخ الإنشاء', 'آخر تحديث'],
      ...filteredItems.map(item => [
        getItemCode(item),
        getItemName(item),
        getItemCategoryName(item.category),
        getItemCostPrice(item).toString(),
        getItemSellingPrice(item).toString(),
        getItemCurrency(item),
        getItemUnit(item),
        item.vat?.toString() || '0',
        getItemStatus(item),
        getItemBranchName(item),
        item.created_at || '',
        item.updated_at || ''
      ])
    ];

    const csvContent = csvData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `price_list_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "تم التصدير بنجاح",
      description: "تم تصدير قائمة الأسعار كملف CSV",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="container mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-700">جاري تحميل المنتجات...</h2>
            <p className="text-slate-500">يرجى الانتظار</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="container mx-auto space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-blue-600/20 to-indigo-600/20 rounded-3xl blur-3xl opacity-30"></div>
          <Card className="relative backdrop-blur-sm bg-white/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-blue-600/5 to-indigo-600/5"></div>
            <CardContent className="relative p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl shadow-lg">
                      <DollarSign className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        قائمة الأسعار
                      </h1>
                      <p className="text-lg text-slate-600 mt-1">إدارة أسعار المنتجات والخدمات بشكل احترافي حسب الفروع</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="hidden md:flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{totalItems}</div>
                    <div className="text-sm text-slate-500">إجمالي المنتجات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{activeItems}</div>
                    <div className="text-sm text-slate-500">المنتجات النشطة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{averagePrice.toFixed(0)} جنيه</div>
                    <div className="text-sm text-slate-500">متوسط السعر</div>
                  </div>
                </div>
              </div>

              {/* Branch Info */}
              <div className="mt-6 bg-gradient-to-br from-emerald-50 to-blue-50 p-4 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-xl">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">الفرع الحالي</h3>
                    <p className="text-slate-600">{selectedBranch?.name || "جميع الفروع"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm p-2 rounded-2xl shadow-lg border-0">
            <TabsTrigger 
              value="list" 
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Package className="w-4 h-4 mr-2" />
              قائمة الأسعار
            </TabsTrigger>
            <TabsTrigger 
              value="templates" 
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Tags className="w-4 h-4 mr-2" />
              قوالب الأسعار
            </TabsTrigger>
            <TabsTrigger 
              value="bulk" 
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              تحديث مجمع
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              التحليلات
            </TabsTrigger>
          </TabsList>

          {/* Main Price List Tab */}
          <TabsContent value="list" className="space-y-6 animate-fade-in">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="backdrop-blur-sm bg-white/80 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">إجمالي المنتجات</p>
                      <p className="text-3xl font-bold text-emerald-600">{totalItems}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/80 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">المنتجات النشطة</p>
                      <p className="text-3xl font-bold text-blue-600">{activeItems}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/80 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">متوسط السعر</p>
                      <p className="text-3xl font-bold text-purple-600">{averagePrice.toFixed(0)}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/80 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">الفئات</p>
                      <p className="text-3xl font-bold text-orange-600">{categories.length}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl">
                      <Tags className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Actions */}
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-emerald-100">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="البحث في المنتجات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10 bg-white/70 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="bg-white/70 border-slate-200 rounded-xl">
                        <SelectValue placeholder="الفئة" />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-xl shadow-xl">
                        <SelectItem value="all">جميع الفئات</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={branchFilter} onValueChange={setBranchFilter}>
                      <SelectTrigger className="bg-white/70 border-slate-200 rounded-xl">
                        <SelectValue placeholder="الفرع" />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-xl shadow-xl">
                        <SelectItem value="all">جميع الفروع</SelectItem>
                        {getActiveBranches().map(branch => (
                          <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-white/70 border-slate-200 rounded-xl">
                        <SelectValue placeholder="الحالة" />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-xl shadow-xl">
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="active">نشط</SelectItem>
                        <SelectItem value="inactive">غير نشط</SelectItem>
                        <SelectItem value="discontinued">متوقف</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button 
                      variant="outline" 
                      className="bg-white hover:bg-emerald-50 border-emerald-200 text-emerald-600 rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      فلترة متقدمة
                    </Button>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={handlePrint}
                      variant="outline"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      طباعة
                    </Button>
                    <Button 
                      onClick={handleExport}
                      variant="outline"
                      className="border-green-200 text-green-600 hover:bg-green-50 rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      تصدير
                    </Button>
                    <Button 
                      onClick={handleAddNewItem}
                      className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-xl px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      إضافة منتج جديد
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="text-center text-slate-700 font-medium">رمز المنتج</TableHead>
                        <TableHead className="text-center text-slate-700 font-medium">اسم المنتج</TableHead>
                        <TableHead className="text-center text-slate-700 font-medium">الفئة</TableHead>
                        <TableHead className="text-center text-slate-700 font-medium">سعر التكلفة</TableHead>
                        <TableHead className="text-center text-slate-700 font-medium">سعر البيع</TableHead>
                        <TableHead className="text-center text-slate-700 font-medium">هامش الربح</TableHead>
                        <TableHead className="text-center text-slate-700 font-medium">الوحدة</TableHead>
                        <TableHead className="text-center text-slate-700 font-medium">الحالة</TableHead>
                        <TableHead className="text-center text-slate-700 font-medium">الفرع</TableHead>
                        <TableHead className="text-center text-slate-700 font-medium">آخر تحديث</TableHead>
                        <TableHead className="text-center text-slate-700 font-medium">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item, index) => {
                        // Safety check to ensure item is valid
                        if (!item || typeof item !== 'object') {
                          console.warn('Invalid item found:', item);
                          return null;
                        }
                        
                        return (
                          <TableRow key={getItemId(item) || index} className={index % 2 === 0 ? "bg-white" : "bg-slate-25 hover:bg-slate-50"}>
                            <TableCell className="text-center font-mono text-emerald-600 font-medium">{getItemCode(item)}</TableCell>
                            <TableCell className="text-center font-medium">{getItemName(item)}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {getItemCategoryName(item.category)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center font-bold text-slate-600">{getItemCostPrice(item)} {getItemCurrency(item)}</TableCell>
                            <TableCell className="text-center font-bold text-emerald-600">{getItemSellingPrice(item)} {getItemCurrency(item)}</TableCell>
                            <TableCell className="text-center">
                              <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                                {item.profit_margin?.toFixed(1) || ((getItemSellingPrice(item) - getItemCostPrice(item)) / (getItemCostPrice(item) || 1) * 100).toFixed(1)}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">{getItemUnit(item)}</TableCell>
                            <TableCell className="text-center">
                              <Badge className={`${getStatusColor(getItemStatus(item))} rounded-full px-3 py-1`}>
                                {getItemStatus(item) === 'active' ? 'نشط' : getItemStatus(item) === 'inactive' ? 'غير نشط' : 'متوقف'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Building2 className="w-3 h-3 mr-1" />
                                {getItemBranchName(item)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center text-sm text-slate-500">
                              <div className="flex items-center justify-center gap-1">
                                <Clock className="w-3 h-3" />
                                {item.updated_at ? new Date(item.updated_at).toLocaleDateString('ar-SA') : 'غير محدد'}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="hover:bg-emerald-50 rounded-xl">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white rounded-xl shadow-xl border-0">
                                  <DropdownMenuItem className="hover:bg-blue-50" onClick={() => handleEditPrice(item)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    تعديل السعر
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="hover:bg-green-50" onClick={() => handleViewHistory(item)}>
                                    <History className="w-4 h-4 mr-2" />
                                    سجل التغييرات
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="hover:bg-purple-50" onClick={() => handleCopyToBranch(item)}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    نسخ لفرع آخر
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="hover:bg-orange-50" onClick={() => handleAddToFavorites(item)}>
                                    <Star className="w-4 h-4 mr-2" />
                                    إضافة للمفضلة
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {filteredItems.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 text-slate-300">💰</div>
                    <h3 className="text-xl font-semibold text-slate-600 mb-2">لا توجد منتجات بالمعايير المحددة</h3>
                    <p className="text-slate-500">جرب تغيير معايير البحث أو الفلترة</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Price Templates Tab */}
          <TabsContent value="templates" className="space-y-6 animate-fade-in">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-800">قوالب الأسعار</CardTitle>
                    <CardDescription className="text-slate-600">إدارة قوالب تسعير المنتجات والخدمات</CardDescription>
                  </div>
                  <Button 
                    onClick={() => setShowTemplateModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة قالب جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Templates will be implemented later */}
                  <div className="text-center py-12 col-span-full">
                    <div className="text-6xl mb-4 text-slate-300">📋</div>
                    <h3 className="text-xl font-semibold text-slate-600 mb-2">قوالب الأسعار</h3>
                    <p className="text-slate-500">ستتم إضافة قوالب الأسعار قريباً</p>
                  </div>
                  {[].map((template: any) => (
                    <Card key={template.id} className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                              {template.is_default && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                              {template.name}
                            </CardTitle>
                            <CardDescription className="mt-1">{template.description}</CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                تعديل
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="w-4 h-4 mr-2" />
                                نسخ
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">هامش الربح:</span>
                            <Badge className="bg-green-50 text-green-700 border-green-200">
                              <Percent className="w-3 h-3 mr-1" />
                              {template.markup_percent}%
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">الفئة:</span>
                            <Badge variant="outline">{template.category}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">الفروع:</span>
                            <span className="text-sm font-medium">{template.branch_ids.length} فرع</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <Button 
                            onClick={() => {}}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl"
                          >
                            تطبيق القالب
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bulk Update Tab */}
          <TabsContent value="bulk" className="space-y-6 animate-fade-in">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100">
                <CardTitle className="text-2xl font-bold text-slate-800">التحديث المجمع للأسعار</CardTitle>
                <CardDescription className="text-slate-600">تحديث أسعار متعددة في نفس الوقت</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200">
                      <h3 className="text-lg font-bold text-slate-800 mb-4">زيادة نسبية</h3>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-slate-700 font-medium">نسبة الزيادة (%)</Label>
                          <Input type="number" placeholder="10" className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-slate-700 font-medium">الفئة المستهدفة</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الفئة" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          onClick={() => setBulkUpdateModal(true)}
                          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          تطبيق الزيادة
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                      <h3 className="text-lg font-bold text-slate-800 mb-4">استيراد من ملف Excel</h3>
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center">
                          <div className="text-blue-500 text-4xl mb-2">📁</div>
                          <p className="text-slate-600">اسحب وأفلت ملف Excel هنا</p>
                          <p className="text-sm text-slate-500 mt-1">أو انقر للاختيار</p>
                        </div>
                        <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                          تحميل قالب Excel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="backdrop-blur-sm bg-white/80 shadow-xl rounded-2xl border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">إجمالي الإيرادات المتوقعة</p>
                      <p className="text-2xl font-bold text-emerald-600">{totalRevenue.toLocaleString()} جنيه</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

                                <Card className="backdrop-blur-sm bg-white/80 shadow-xl rounded-2xl border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-500">متوسط هامش الربح</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {products.length > 0 ? (products.reduce((sum: number, item: any) => sum + (item.profit_margin || 0), 0) / products.length).toFixed(1) : '0.0'}%
                          </p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl">
                          <Percent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

              <Card className="backdrop-blur-sm bg-white/80 shadow-xl rounded-2xl border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">أعلى سعر</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {Math.max(...products.map(item => getItemSellingPrice(item)))} جنيه
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/80 shadow-xl rounded-2xl border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">آخر تحديث</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {new Date().toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl">
                      <RefreshCw className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800">تحليلات الأسعار</CardTitle>
                <CardDescription>رؤى تفصيلية حول استراتيجية التسعير والأداء</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-emerald-600">إجمالي الأصناف</p>
                          <p className="text-3xl font-bold text-emerald-700">{products.length}</p>
                          <p className="text-xs text-emerald-500 mt-1">+12% عن الشهر الماضي</p>
                        </div>
                        <div className="p-3 bg-emerald-200 rounded-xl">
                          <Package className="w-6 h-6 text-emerald-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">متوسط هامش الربح</p>
                                                      <p className="text-3xl font-bold text-blue-700">
                              {products.length > 0 ? (products.reduce((acc: number, item: any) => acc + (item.profit_margin || 0), 0) / products.length).toFixed(1) : '0.0'}%
                            </p>
                          <p className="text-xs text-blue-500 mt-1">+2.5% عن الشهر الماضي</p>
                        </div>
                        <div className="p-3 bg-blue-200 rounded-xl">
                          <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600">أعلى سعر</p>
                          <p className="text-3xl font-bold text-purple-700">
                            {Math.max(...products.map(item => getItemSellingPrice(item)))} جنيه مصري
                          </p>
                          <p className="text-xs text-purple-500 mt-1">خدمة VIP الكاملة</p>
                        </div>
                        <div className="p-3 bg-purple-200 rounded-xl">
                          <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-orange-600">التحديثات الأخيرة</p>
                          <p className="text-3xl font-bold text-orange-700">23</p>
                          <p className="text-xs text-orange-500 mt-1">خلال آخر 7 أيام</p>
                        </div>
                        <div className="p-3 bg-orange-200 rounded-xl">
                          <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts and Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Price Distribution Chart */}
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-slate-700">توزيع الأسعار حسب الفئة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {categories.map((category, index) => {
                          const categoryItems = products.filter(item => getItemCategoryName(item.category) === category);
                          const avgPrice = categoryItems.length > 0 
                            ? categoryItems.reduce((acc, item) => acc + getItemSellingPrice(item), 0) / categoryItems.length 
                            : 0;
                          const percentage = (categoryItems.length / products.length) * 100;
                          
                          return (
                            <div key={category} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-600">{category}</span>
                                <div className="text-left">
                                  <span className="text-sm font-bold text-slate-700">{avgPrice.toFixed(0)} جنيه مصري</span>
                                  <span className="text-xs text-slate-500 block">({categoryItems.length} صنف)</span>
                                </div>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    index % 4 === 0 ? 'bg-emerald-500' :
                                    index % 4 === 1 ? 'bg-blue-500' :
                                    index % 4 === 2 ? 'bg-purple-500' : 'bg-orange-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <div className="text-xs text-slate-500">{percentage.toFixed(1)}% من إجمالي الأصناف</div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Profit Margin Analysis */}
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-slate-700">تحليل هوامش الربح</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { range: 'أقل من 10%', color: 'bg-red-500', items: products.filter(item => (item.profit_margin || 0) < 10) },
                          { range: '10% - 20%', color: 'bg-orange-500', items: products.filter(item => (item.profit_margin || 0) >= 10 && (item.profit_margin || 0) < 20) },
                          { range: '20% - 30%', color: 'bg-yellow-500', items: products.filter(item => (item.profit_margin || 0) >= 20 && (item.profit_margin || 0) < 30) },
                          { range: '30% - 50%', color: 'bg-emerald-500', items: products.filter(item => (item.profit_margin || 0) >= 30 && (item.profit_margin || 0) < 50) },
                          { range: 'أكثر من 50%', color: 'bg-blue-500', items: products.filter(item => (item.profit_margin || 0) >= 50) }
                        ].map((margin) => {
                          const percentage = (margin.items.length / products.length) * 100;
                          return (
                            <div key={margin.range} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-600">{margin.range}</span>
                                <span className="text-sm font-bold text-slate-700">{margin.items.length} صنف</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${margin.color}`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <div className="text-xs text-slate-500">{percentage.toFixed(1)}% من إجمالي الأصناف</div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Branch Performance */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-700">أداء الفروع</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                              {['الفرع الرئيسي', 'الفرع الشمالي', 'الفرع الجنوبي'].map((branch, index) => {
                          const branchItems = products.filter(item => getItemBranchName(item) === branch);
                          const avgMargin = branchItems.length > 0 
                            ? branchItems.reduce((acc, item) => acc + (item.profit_margin || 0), 0) / branchItems.length 
                            : 0;
                          const totalRevenue = branchItems.reduce((acc, item) => acc + getItemSellingPrice(item) * 10, 0); // Simulated revenue
                        
                        return (
                          <div key={branch} className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-3 mb-3">
                              <Building2 className="w-5 h-5 text-slate-600" />
                              <h3 className="font-semibold text-slate-700">{branch}</h3>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-600">عدد الأصناف</span>
                                <span className="font-medium">{branchItems.length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-600">متوسط الهامش</span>
                                <span className="font-medium text-emerald-600">{avgMargin.toFixed(1)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-600">الإيرادات المتوقعة</span>
                                <span className="font-medium text-blue-600">{totalRevenue.toLocaleString()} جنيه مصري</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Price Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-xl">
                  <Edit className="h-6 w-6 text-white" />
                </div>
                تعديل السعر
              </DialogTitle>
              <DialogDescription>
                تعديل سعر العنصر المحدد
              </DialogDescription>
            </DialogHeader>

            {selectedItem && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700 font-medium">اسم الصنف</Label>
                    <Input value={getItemName(selectedItem)} disabled className="bg-slate-50" />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">رمز الصنف</Label>
                    <Input value={getItemCode(selectedItem)} disabled className="bg-slate-50" />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">سعر التكلفة</Label>
                    <Input 
                      type="number" 
                      value={editForm.cost_price}
                      onChange={(e) => setEditForm(prev => ({ ...prev, cost_price: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">سعر البيع</Label>
                    <Input 
                      type="number" 
                      value={editForm.selling_price}
                      onChange={(e) => setEditForm(prev => ({ ...prev, selling_price: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">نسبة الخصم (%)</Label>
                    <Input 
                      type="number" 
                      value={editForm.discount_percent}
                      onChange={(e) => setEditForm(prev => ({ ...prev, discount_percent: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">الضريبة (%)</Label>
                    <Input 
                      type="number" 
                      value={editForm.vat}
                      onChange={(e) => setEditForm(prev => ({ ...prev, vat: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-slate-700 font-medium">سبب التغيير</Label>
                  <Input 
                    placeholder="أدخل سبب تغيير السعر..." 
                    value={editForm.reason}
                    onChange={(e) => setEditForm(prev => ({ ...prev, reason: e.target.value }))}
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <Button 
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                    className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl px-6 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    إلغاء
                  </Button>
                  <Button 
                    onClick={handleSaveEdit}
                    className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-xl px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    حفظ التغييرات
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Price History Modal */}
        <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                  <History className="h-6 w-6 text-white" />
                </div>
                سجل تغييرات السعر
              </DialogTitle>
              <DialogDescription>
                تاريخ تغييرات السعر للعنصر المحدد
              </DialogDescription>
            </DialogHeader>

            {selectedItem && (
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                        <h3 className="text-lg font-bold text-slate-800 mb-2">{getItemName(selectedItem)}</h3>
                  <p className="text-slate-600">رمز الصنف: {getItemCode(selectedItem)}</p>
                  <p className="text-slate-600">السعر الحالي: {selectedItem?.selling_price || 0} {selectedItem?.currency || ''}</p>
                </div>

                <div className="text-center py-12">
                  <div className="text-6xl mb-4 text-slate-300">📊</div>
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">سجل تغييرات السعر</h3>
                  <p className="text-slate-500">ستتم إضافة سجل تغييرات الأسعار قريباً</p>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-200">
                  <Button 
                    variant="outline"
                    onClick={() => setShowHistoryModal(false)}
                    className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl px-6 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    إغلاق
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add New Item Modal */}
        <Dialog open={showAddModal} onOpenChange={(open) => {
          setShowAddModal(open);
          if (!open) {
            setProductSearchTerm("");
            setFilteredProductsForSelection([]);
            setShowProductSearch(false);
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-xl">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                إضافة سعر جديد
              </DialogTitle>
              <DialogDescription>
                إضافة عنصر جديد لقائمة الأسعار
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Product Selection Section */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">اختيار المنتج</h3>
                
                {/* Debug Info */}
                <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-xs text-yellow-700">
                    <strong>معلومات التشخيص:</strong> إجمالي المنتجات المتاحة: {products.length} | 
                    المنتجات المعروضة: {filteredProductsForSelection.length}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => {
                        setShowProductSearch(true);
                        setFilteredProductsForSelection(products.slice(0, 5));
                      }}
                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                    >
                      عرض 5 منتجات
                    </button>
                    <button
                      onClick={() => {
                        setShowProductSearch(false);
                        setFilteredProductsForSelection([]);
                      }}
                      className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                    >
                      إخفاء
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="ابحث عن منتج موجود..."
                      value={productSearchTerm}
                      onChange={(e) => {
                        setProductSearchTerm(e.target.value);
                        setShowProductSearch(true);
                      }}
                      onFocus={() => setShowProductSearch(true)}
                      className="pr-10 bg-white/70 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {productSearchTerm && (
                      <button
                        onClick={() => {
                          setProductSearchTerm("");
                          setShowProductSearch(false);
                          setFilteredProductsForSelection([]);
                        }}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Product Search Results */}
                  {showProductSearch && (
                    <div className="max-h-60 overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-lg relative">
                      <div className="sticky top-0 bg-white p-2 border-b border-slate-200">
                        <div className="text-sm text-slate-600 text-center">
                          {productSearchTerm ? `نتائج البحث: ${filteredProductsForSelection.length} منتج` : "أحدث المنتجات"}
                        </div>
                      </div>
                      
                      {filteredProductsForSelection.length > 0 ? (
                        filteredProductsForSelection.map((product) => (
                          <div
                            key={getItemId(product)}
                            onClick={() => handleSelectProduct(product)}
                            className="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-slate-800">{product.item_name}</div>
                                <div className="text-sm text-slate-600">رمز: {product.item_code}</div>
                                <div className="text-sm text-slate-500">{getItemCategoryName(product.category)}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-emerald-600">{product.selling_price} {product.currency}</div>
                                <div className="text-sm text-slate-500">{product.unit}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-slate-500">
                          <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                          <p>{productSearchTerm ? "لم يتم العثور على منتجات" : "لا توجد منتجات متاحة"}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details Form */}
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">تفاصيل المنتج</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700 font-medium">رمز الصنف *</Label>
                    <Input 
                      value={newItemForm.item_code}
                      onChange={(e) => setNewItemForm(prev => ({ ...prev, item_code: e.target.value }))}
                      placeholder="SRV001"
                      className="bg-white/70"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">اسم الصنف *</Label>
                    <Input 
                      value={newItemForm.item_name}
                      onChange={(e) => setNewItemForm(prev => ({ ...prev, item_name: e.target.value }))}
                      placeholder="  خارجي عادي"
                      className="bg-white/70"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">الفئة</Label>
                    <Select 
                      value={newItemForm.category} 
                      onValueChange={(value) => setNewItemForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">الوحدة</Label>
                    <Select 
                      value={newItemForm.unit} 
                      onValueChange={(value) => setNewItemForm(prev => ({ ...prev, unit: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الوحدة" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map(unit => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">سعر التكلفة</Label>
                    <Input 
                      type="number" 
                      value={newItemForm.cost_price}
                      onChange={(e) => setNewItemForm(prev => ({ ...prev, cost_price: parseFloat(e.target.value) || 0 }))}
                      placeholder="25"
                      className="bg-white/70"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">سعر البيع *</Label>
                    <Input 
                      type="number" 
                      value={newItemForm.selling_price}
                      onChange={(e) => setNewItemForm(prev => ({ ...prev, selling_price: parseFloat(e.target.value) || 0 }))}
                      placeholder="30"
                      className="bg-white/70"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">العملة</Label>
                    <Select 
                      value={newItemForm.currency} 
                      onValueChange={(value) => setNewItemForm(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر العملة" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map(currency => (
                          <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">الضريبة (%)</Label>
                    <Input 
                      type="number" 
                      value={newItemForm.vat}
                      onChange={(e) => setNewItemForm(prev => ({ ...prev, vat: parseFloat(e.target.value) || 0 }))}
                      placeholder="15"
                      className="bg-white/70"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-slate-700 font-medium">ملاحظات</Label>
                  <Input 
                    value={newItemForm.notes}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="ملاحظات إضافية..."
                    className="bg-white/70"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Button 
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl px-6 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  إلغاء
                </Button>
                <Button 
                  onClick={handleSaveNewItem}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-xl px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  حفظ السعر
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Bulk Update Modal */}
        <Dialog open={showBulkUpdateModal} onOpenChange={setBulkUpdateModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                التحديث المجمع للأسعار
              </DialogTitle>
              <DialogDescription>
                تحديث أسعار فئة كاملة بنسبة محددة
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <Label className="text-slate-700 font-medium">نسبة الزيادة (%) *</Label>
                <Input 
                  type="number" 
                  value={bulkUpdateForm.increase_percent}
                  onChange={(e) => setBulkUpdateForm(prev => ({ ...prev, increase_percent: parseFloat(e.target.value) || 0 }))}
                  placeholder="10"
                />
              </div>
              <div>
                <Label className="text-slate-700 font-medium">الفئة المستهدفة *</Label>
                <Select 
                  value={bulkUpdateForm.target_category} 
                  onValueChange={(value) => setBulkUpdateForm(prev => ({ ...prev, target_category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-700 font-medium">سبب التحديث</Label>
                <Input 
                  value={bulkUpdateForm.reason}
                  onChange={(e) => setBulkUpdateForm(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="زيادة التكاليف التشغيلية..."
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Button 
                  variant="outline"
                  onClick={() => setBulkUpdateModal(false)}
                  className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl px-6 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  إلغاء
                </Button>
                <Button 
                  onClick={handleBulkUpdate}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  تطبيق التحديث
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PriceList;