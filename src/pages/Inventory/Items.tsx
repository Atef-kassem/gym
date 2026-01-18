import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Package,
  Edit,
  Eye,
  MoreVertical,
  Trash2,
  ArrowLeft,
  DollarSign,
  ShoppingCart,
  RefreshCw,
  FileText,
  Activity,
  Settings,
  TrendingUp,
  CheckCircle,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SimpleProductForm } from "@/components/Inventory/SimpleProductForm";
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
} from "@/services/productApi";
import { getImageUrl } from "@/utils/imageHelpers";

interface Product {
  product_id: string;
  name_ar: string;
  name_en: string;
  category?: { name_ar: string };
  unit_of_measure: string;
  selling_price: number;
  cost_price?: number;
  current_stock: number;
  status: string;
  description?: string;
  barcode?: string;
  supplier?: { name_ar: string };
  manufacturer?: { name_ar: string };
  expiry_date?: string;
  image_url?: string;
}

const Items = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch products data
  const {
    data: productsData,
    isLoading: isProductsLoading,
    refetch,
  } = useGetAllProductsQuery(undefined);

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Normalize products data
  const products: Product[] = useMemo(() => {
    if (!productsData) return [];
    // استجابة مباشرة كمصفوفة
    if (Array.isArray(productsData)) return productsData;
    // استجابة منسقة: { data: [...] }
    if (Array.isArray((productsData as any).data)) return (productsData as any).data;
    // استجابة منسقة: { products: [...] }
    if (Array.isArray((productsData as any).products)) return (productsData as any).products;
    // استجابة API الحالية: { status, data: { products, pagination } }
    const nestedProducts = (productsData as any)?.data?.products;
    if (Array.isArray(nestedProducts)) return nestedProducts;
    return [];
  }, [productsData]);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;

    const searchLower = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.name_ar?.toLowerCase().includes(searchLower) ||
        product.name_en?.toLowerCase().includes(searchLower) ||
        product.product_id?.toString().includes(searchLower) ||
        product.barcode?.toLowerCase().includes(searchLower)
    );
  }, [products, searchTerm]);

  // Statistics
  const statistics = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.status === "active").length;
    const totalValue = products.reduce(
      (sum, p) => sum + (p.selling_price || 0) * (p.current_stock || 0),
      0
    );

    return {
      totalProducts,
      activeProducts,
      totalValue,
    };
  }, [products]);

  // Handlers
  const handleBack = () => {
    navigate("/inventory");
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setActiveTab("add");
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setActiveTab("add");
  };

  const handleView = (product: Product) => {
    setViewingProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;

    try {
      await deleteProduct(deletingProduct.product_id).unwrap();
    toast({
        title: "تم الحذف بنجاح",
        description: `تم حذف المنتج "${deletingProduct.name_ar}" بنجاح`,
    });
      setIsDeleteDialogOpen(false);
      setDeletingProduct(null);
      refetch();
    } catch (error: any) {
    toast({
        title: "خطأ في الحذف",
        description: error?.data?.message || "حدث خطأ أثناء حذف المنتج",
        variant: "destructive",
    });
    }
  };

  const handleSaveSuccess = () => {
    toast({
      title: editingProduct ? "تم التحديث بنجاح" : "تم الحفظ بنجاح",
      description: editingProduct
        ? "تم تحديث المنتج بنجاح"
        : "تم إضافة المنتج بنجاح",
      });
    setEditingProduct(null);
    setActiveTab("list");
    refetch();
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setActiveTab("list");
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        نشط
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-200">غير نشط</Badge>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة للمخزون
            </Button>
            <div className="space-y-2">
              <h1 className="text-4xl font-black bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#0ea5e9] bg-clip-text text-transparent">
                إدارة المنتجات
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                إضافة وإدارة جميع المنتجات
              </p>
            </div>
          </div>
                  </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-2">
                    إجمالي المنتجات
                    </p>
                  <p className="text-4xl font-black text-blue-700">
                    {statistics.totalProducts}
                  </p>
                  </div>
                <Package className="h-12 w-12 text-blue-500" />
                </div>
              </CardContent>
            </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-2">
                    المنتجات النشطة
                  </p>
                  <p className="text-4xl font-black text-green-700">
                    {statistics.activeProducts}
                  </p>
                  </div>
                <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
              </CardContent>
            </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600 mb-2">
                    إجمالي القيمة
                </p>
                  <p className="text-3xl font-black text-amber-700">
                    {statistics.totalValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">جنيه</p>
                  </div>
                <DollarSign className="h-12 w-12 text-amber-500" />
                  </div>
              </CardContent>
            </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-lg">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              قائمة المنتجات
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {editingProduct ? "تعديل منتج" : "إضافة منتج جديد"}
            </TabsTrigger>
          </TabsList>

          {/* Products List Tab */}
          <TabsContent value="list" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div>
                <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      قائمة المنتجات
                </CardTitle>
                <CardDescription>
                      عرض وإدارة جميع المنتجات ({filteredProducts.length})
                </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                        placeholder="البحث في المنتجات..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                          />
                        </div>
                        <Button
                      onClick={handleAdd}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        >
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة منتج جديد
                        </Button>
                    <Button
                                  variant="outline"
                      onClick={() => refetch()}
                      disabled={isProductsLoading}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ml-2 ${
                          isProductsLoading ? "animate-spin" : ""
                        }`}
                      />
                      تحديث
                                  </Button>
                                </div>
                    </div>
              </CardHeader>
              <CardContent>
                {isProductsLoading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="h-8 w-8 mx-auto animate-spin text-blue-500 mb-4" />
                    <p className="text-gray-600">جاري تحميل المنتجات...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-600 mb-2">
                      {searchTerm
                        ? "لا توجد نتائج للبحث"
                        : "لا توجد منتجات متاحة"}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm
                        ? "جرب البحث بكلمات أخرى"
                        : "ابدأ بإضافة منتج جديد"}
                    </p>
                    {!searchTerm && (
                      <Button onClick={handleAdd}>
                        <Plus className="h-4 w-4 ml-2" />
                      إضافة منتج جديد
                    </Button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-right py-4 px-4 font-bold text-gray-700">
                            الصورة
                          </th>
                          <th className="text-right py-4 px-4 font-bold text-gray-700">
                            المنتج
                          </th>
                          <th className="text-right py-4 px-4 font-bold text-gray-700">
                            الكود / الباركود
                          </th>
                          <th className="text-right py-4 px-4 font-bold text-gray-700">
                            الفئة
                          </th>
                          <th className="text-right py-4 px-4 font-bold text-gray-700">
                            السعر
                          </th>
                          <th className="text-right py-4 px-4 font-bold text-gray-700">
                            الكمية
                          </th>
                          <th className="text-right py-4 px-4 font-bold text-gray-700">
                            الحالة
                          </th>
                          <th className="text-center py-4 px-4 font-bold text-gray-700">
                            الإجراءات
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product, index) => (
                          <tr
                            key={product.product_id}
                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                            }`}
                          >
                            <td className="py-4 px-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
                                {product.image_url ? (
                                    <img
                                    src={getImageUrl(product.image_url) || undefined}
                                    alt={product.name_ar}
                                    className="w-full h-full object-cover"
                                      onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                      }}
                                    />
                                  ) : (
                                  <Package className="w-8 h-8 text-white" />
                                  )}
                                </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-bold text-gray-900">
                                  {product.name_ar}
                                  </div>
                                {product.name_en && (
                                  <div className="text-sm text-gray-500">
                                    {product.name_en}
                                    </div>
                                  )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="space-y-1">
                                <div className="font-mono text-sm text-gray-700">
                                  {product.product_id}
                              </div>
                                {product.barcode && (
                                  <div className="text-xs text-gray-500">
                                    {product.barcode}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant="outline">
                                {product.category?.name_ar || "بدون فئة"}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-left">
                                <div className="font-bold text-lg text-blue-600">
                                  {product.selling_price?.toLocaleString() || 0}
                              </div>
                                <div className="text-xs text-gray-500">جنيه</div>
                  </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-left">
                                <div className="font-bold text-lg text-gray-700">
                                  {product.current_stock || 0}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {product.unit_of_measure || "وحدة"}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {getStatusBadge(product.status)}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleView(product)}
                                  title="عرض"
                                >
                                  <Eye className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(product)}
                                  title="تعديل"
                                >
                                  <Edit className="h-4 w-4 text-green-600" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      title="المزيد"
                                    >
                                      <MoreVertical className="h-4 w-4 text-gray-600" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => handleDelete(product)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 ml-2" />
                                      حذف المنتج
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add/Edit Product Tab */}
          <TabsContent value="add" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingProduct ? "تعديل منتج" : "إضافة منتج جديد"}
                </CardTitle>
                <CardDescription>
                  {editingProduct
                    ? "قم بتعديل بيانات المنتج"
                    : "أضف منتج جديد إلى المخزون"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleProductForm
                  editingProduct={
                    editingProduct
                      ? {
                          product_id: editingProduct.product_id,
                          name_ar: editingProduct.name_ar,
                          selling_price: editingProduct.selling_price,
                          current_stock: editingProduct.current_stock,
                          image_url: editingProduct.image_url,
                        }
                      : null
                  }
                  onSave={handleSaveSuccess}
                  onCancel={handleCancel}
                      />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Product Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                تفاصيل المنتج
              </DialogTitle>
            </DialogHeader>
            {viewingProduct && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      الاسم العربي
                    </h4>
                    <p className="font-medium text-lg">
                      {viewingProduct.name_ar}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      الاسم الإنجليزي
                    </h4>
                    <p className="text-gray-700">{viewingProduct.name_en}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      الكود
                    </h4>
                    <p className="font-mono text-sm">
                      {viewingProduct.product_id}
                    </p>
                  </div>
                  {viewingProduct.barcode && (
                  <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">
                        الباركود
                      </h4>
                      <p className="font-mono text-sm">
                        {viewingProduct.barcode}
                    </p>
                  </div>
                )}
                    <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      السعر
                    </h4>
                    <p className="font-bold text-xl text-green-600">
                      {viewingProduct.selling_price?.toLocaleString() || 0} جنيه
                    </p>
                    </div>
                    <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      الكمية
                    </h4>
                    <p className="font-bold text-lg">
                      {viewingProduct.current_stock || 0}{" "}
                      {viewingProduct.unit_of_measure || "وحدة"}
                    </p>
                    </div>
                    <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      الحالة
                    </h4>
                    {getStatusBadge(viewingProduct.status)}
                    </div>
                  {viewingProduct.category && (
                          <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">
                        الفئة
                      </h4>
                      <Badge variant="outline">
                        {viewingProduct.category.name_ar}
                      </Badge>
                            </div>
                  )}
                            </div>
                {viewingProduct.description && (
                          <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      الوصف
                    </h4>
                    <p className="text-gray-700">{viewingProduct.description}</p>
                            </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                تأكيد حذف المنتج
              </DialogTitle>
              <DialogDescription>
                هل أنت متأكد من حذف المنتج "
                {deletingProduct?.name_ar}"؟ لا يمكن التراجع عن هذا الإجراء.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 ml-2" />
                {isDeleting ? "جاري الحذف..." : "حذف المنتج"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
    </div>
    </div>
  );
};

export default Items;

