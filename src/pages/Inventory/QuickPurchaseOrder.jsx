import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Plus, Save, Send, FileText, Search, Calendar, Package, 
  CheckCircle, Clock, AlertCircle, Eye, Trash2, Edit, X,
  ShoppingCart, TrendingUp, DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetSuppliersQuery } from "@/store/suppliersApi";
import { useGetAllProductsQuery } from "@/services/productApi";
import { 
  useGetQuickPurchaseOrdersQuery,
  useCreateQuickPurchaseOrderMutation,
  useUpdateQuickPurchaseOrderMutation,
  useDeleteQuickPurchaseOrderMutation,
  useChangeQuickPurchaseOrderStatusMutation,
  useGetQuickPurchaseOrderStatisticsQuery
} from "@/store/quickPurchaseOrdersApi";

const QuickPurchaseOrder = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("new");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    supplierId: "",
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: "",
    notes: ""
  });

  // قائمة المنتجات المختارة
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  // بيانات المنتج الجديد المراد إضافته
  const [newProduct, setNewProduct] = useState({
    productId: "",
    productName: "",
    quantity: "",
    unit: "وحدة",
    price: ""
  });

  const { data: suppliersData, isLoading: suppliersLoading } = useGetSuppliersQuery({ q: "" }, {
    skip: !localStorage.getItem("authToken")
  });
  const { data: productsData, isLoading: productsLoading } = useGetAllProductsQuery(undefined, {
    skip: !localStorage.getItem("authToken")
  });
  const { data: ordersData, isLoading: ordersLoading, refetch } = useGetQuickPurchaseOrdersQuery({ 
    page: 1, 
    limit: 100 
  }, {
    skip: !localStorage.getItem("authToken")
  });
  const { data: statsData } = useGetQuickPurchaseOrderStatisticsQuery({}, {
    skip: !localStorage.getItem("authToken")
  });

  const [createOrder, { isLoading: isCreating }] = useCreateQuickPurchaseOrderMutation();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateQuickPurchaseOrderMutation();
  const [deleteOrder] = useDeleteQuickPurchaseOrderMutation();
  const [changeStatus] = useChangeQuickPurchaseOrderStatusMutation();

  // Normalize products data
  const normalizeProducts = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data?.data?.products && Array.isArray(data.data.products)) return data.data.products;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.products && Array.isArray(data.products)) return data.products;
    return [];
  };

  const suppliers = suppliersData?.data || [];
  const products = normalizeProducts(productsData);
  const orders = ordersData?.data?.orders || [];
  const stats = statsData?.data || {};

  // تجميع الأوامر حسب orderNumber
  const groupedOrders = useMemo(() => {
    const groups = {};
    orders.forEach(order => {
      const orderNumber = order.orderNumber;
      if (!groups[orderNumber]) {
        groups[orderNumber] = {
          orderNumber: orderNumber,
          supplier: order.supplier?.supplierName || '-',
          supplierId: order.supplierId,
          orderDate: order.orderDate,
          expectedDeliveryDate: order.expectedDeliveryDate,
          status: order.status,
          notes: order.notes,
          createdBy: order.createdBy,
          items: []
        };
      }
      groups[orderNumber].items.push(order);
    });
    return Object.values(groups);
  }, [orders]);

  // حساب الإجمالي الكلي لكل مجموعة
  const calculateGroupTotal = (group) => {
    return group.items.reduce((sum, item) => {
      return sum + (parseFloat(item.totalAmount) || 0);
    }, 0);
  };

  // حساب إجمالي الكميات لكل مجموعة
  const calculateGroupQuantity = (group) => {
    return group.items.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) || 0);
    }, 0);
  };

  // Debug: log products data
  useEffect(() => {
    console.log("📦 Products Data:", {
      rawData: productsData,
      normalized: products,
      count: products.length,
      firstProduct: products[0]
    });
  }, [productsData, products]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNewProductChange = (field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductSelect = (productId) => {
    if (!productId || !products || products.length === 0) {
      console.warn("⚠️ No products available or invalid productId:", productId);
      return;
    }
    
    const product = products.find(p => {
      const id = p.id || p.product_id || p.productId;
      return id === parseInt(productId) || id?.toString() === productId;
    });
    
    if (product) {
      setNewProduct({
        productId: productId,
        productName: product.nameAr || product.name_ar || product.productName || product.name || "",
        unit: product.unit || product.unitName || "وحدة",
        quantity: "",
        price: (product.price || product.sellingPrice || product.salePrice || "").toString()
      });
    } else {
      console.warn("⚠️ Product not found:", productId, "Available products:", products.map(p => ({ id: p.id || p.product_id, name: p.nameAr || p.name_ar || p.productName })));
    }
  };

  // إضافة منتج جديد إلى القائمة
  const handleAddProduct = () => {
    if (!newProduct.productName) {
      toast({
        title: "خطأ",
        description: "يجب اختيار أو إدخال اسم المنتج",
        variant: "destructive"
      });
      return;
    }

    if (!newProduct.quantity || parseFloat(newProduct.quantity) <= 0) {
      toast({
        title: "خطأ",
        description: "يجب إدخال كمية صحيحة",
        variant: "destructive"
      });
      return;
    }

    const productToAdd = {
      id: Date.now(), // معرف مؤقت
      productId: newProduct.productId || null,
      productName: newProduct.productName,
      quantity: parseFloat(newProduct.quantity),
      unit: newProduct.unit || "وحدة",
      price: parseFloat(newProduct.price) || 0
    };

    setSelectedProducts(prev => [...prev, productToAdd]);
    
    // إعادة تعيين المنتج الجديد
    setNewProduct({
      productId: "",
      productName: "",
      quantity: "",
      unit: "وحدة",
      price: ""
    });
  };

  // حذف منتج من القائمة
  const handleRemoveProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  // تحديث منتج في القائمة
  const handleUpdateProduct = (productId, field, value) => {
    setSelectedProducts(prev => 
      prev.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            [field]: field === 'quantity' || field === 'price' ? parseFloat(value) || 0 : value
          };
        }
        return p;
      })
    );
  };

  // حساب الإجمالي لكل منتج
  const calculateProductTotal = (product) => {
    const quantity = product.quantity || 0;
    const price = product.price || 0;
    return (quantity * price).toFixed(2);
  };

  // حساب الإجمالي الكلي
  const calculateGrandTotal = () => {
    const total = selectedProducts.reduce((sum, product) => {
      const quantity = product.quantity || 0;
      const price = product.price || 0;
      return sum + (quantity * price);
    }, 0);
    return total.toFixed(2);
  };

  const resetForm = () => {
    setFormData({
      supplierId: "",
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: "",
      notes: ""
    });
    setSelectedProducts([]);
    setNewProduct({
      productId: "",
      productName: "",
      quantity: "",
      unit: "وحدة",
      price: ""
    });
    setEditMode(false);
    setSelectedOrder(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.supplierId) {
      toast({
        title: "خطأ",
        description: "يجب اختيار المورد",
        variant: "destructive"
      });
      return;
    }

    if (!selectedProducts || selectedProducts.length === 0) {
      toast({
        title: "خطأ",
        description: "يجب إضافة منتج واحد على الأقل",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editMode && selectedOrder) {
        // في وضع التعديل، نحدث الأمر المحدد فقط (نأخذ المنتج الأول)
        const firstProduct = selectedProducts[0];
        const quantity = parseFloat(firstProduct.quantity) || 0;
        const price = parseFloat(firstProduct.price) || 0;
        const totalAmount = quantity * price;
        
        const orderData = {
          supplierId: parseInt(formData.supplierId),
          productId: firstProduct.productId ? parseInt(firstProduct.productId) : undefined,
          productName: firstProduct.productName,
          quantity: quantity,
          unit: firstProduct.unit || "وحدة",
          price: price,
          totalAmount: totalAmount,
          orderDate: formData.orderDate,
          expectedDeliveryDate: formData.expectedDeliveryDate || undefined,
          notes: formData.notes
        };
        
        await updateOrder({ id: selectedOrder.id, data: orderData }).unwrap();
        toast({
          title: "تم التحديث",
          description: "تم تحديث أمر الشراء السريع بنجاح"
        });
      } else {
        // في وضع الإنشاء، ننشئ رقم أمر واحد لجميع المنتجات
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 5).toUpperCase();
        const orderNumber = `QPO-${timestamp}-${random}`;
        
        // ننشئ أمر شراء لكل منتج بنفس رقم الأمر
        const orderPromises = selectedProducts.map(product => {
          const quantity = parseFloat(product.quantity) || 0;
          const price = parseFloat(product.price) || 0;
          const totalAmount = quantity * price;
          
          const orderData = {
            orderNumber: orderNumber, // نفس رقم الأمر لجميع المنتجات
            supplierId: parseInt(formData.supplierId),
            productId: product.productId ? parseInt(product.productId) : undefined,
            productName: product.productName,
            quantity: quantity,
            unit: product.unit || "وحدة",
            price: price,
            totalAmount: totalAmount,
            orderDate: formData.orderDate,
            expectedDeliveryDate: formData.expectedDeliveryDate || undefined,
            notes: formData.notes
          };
          return createOrder(orderData).unwrap();
        });

        await Promise.all(orderPromises);
        
        toast({
          title: "تم الحفظ",
          description: `تم إنشاء أمر شراء واحد برقم ${orderNumber} يحتوي على ${selectedProducts.length} منتج`
        });
      }

      resetForm();
      refetch();
      setActiveTab("list");
    } catch (error) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "حدث خطأ أثناء حفظ أمر الشراء",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (order) => {
    setFormData({
      supplierId: order.supplierId?.toString() || "",
      orderDate: order.orderDate || new Date().toISOString().split('T')[0],
      expectedDeliveryDate: order.expectedDeliveryDate || "",
      notes: order.notes || ""
    });
    // إضافة المنتج المحدد إلى القائمة
    setSelectedProducts([{
      id: Date.now(),
      productId: order.productId || null,
      productName: order.productName || "",
      quantity: order.quantity || 0,
      unit: order.unit || "وحدة",
      price: order.price || 0
    }]);
    setSelectedOrder(order);
    setEditMode(true);
    setActiveTab("new");
  };

  const handleDelete = async (orderId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الأمر؟")) {
      try {
        await deleteOrder(orderId).unwrap();
        toast({
          title: "تم الحذف",
          description: "تم حذف أمر الشراء بنجاح"
        });
        refetch();
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء الحذف",
          variant: "destructive"
        });
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await changeStatus({ id: orderId, status: newStatus }).unwrap();
      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة الأمر بنجاح"
      });
      refetch();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الحالة",
        variant: "destructive"
      });
    }
  };

  // تغيير حالة جميع الأوامر في مجموعة
  const handleGroupStatusChange = async (group, newStatus) => {
    try {
      const promises = group.items.map(item => 
        changeStatus({ id: item.id, status: newStatus }).unwrap()
      );
      await Promise.all(promises);
      toast({
        title: "تم التحديث",
        description: `تم تحديث حالة جميع منتجات الأمر ${group.orderNumber} بنجاح`
      });
      refetch();
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الحالة",
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'مسودة': 'bg-gray-100 text-gray-800',
      'مرسل': 'bg-blue-100 text-blue-800',
      'مؤكد': 'bg-green-100 text-green-800',
      'مكتمل': 'bg-purple-100 text-purple-800',
      'ملغي': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي الطلبات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalOrders || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي المبلغ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {(stats.totalAmount || 0).toLocaleString()} ج.م
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الطلبات النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {orders.filter(o => o.status !== 'ملغي' && o.status !== 'مكتمل').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* التبويبات */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">أمر شراء سريع</CardTitle>
                <CardDescription>إنشاء وإدارة أوامر الشراء السريعة</CardDescription>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {/* أزرار التبويب */}
              <div className="flex gap-2 border-b">
                <Button
                  variant={activeTab === "new" ? "default" : "ghost"}
                  onClick={() => setActiveTab("new")}
                  className="rounded-b-none"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  {editMode ? "تعديل طلب" : "طلب جديد"}
                </Button>
                <Button
                  variant={activeTab === "list" ? "default" : "ghost"}
                  onClick={() => setActiveTab("list")}
                  className="rounded-b-none"
                >
                  <FileText className="w-4 h-4 ml-2" />
                  قائمة الطلبات
                </Button>
              </div>

              {/* محتوى التبويبات */}
              {activeTab === "new" && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {editMode && (
                    <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Edit className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-900">وضع التعديل</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={resetForm}
                      >
                        <X className="w-4 h-4 ml-1" />
                        إلغاء
                      </Button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* المورد */}
                    <div className="space-y-2">
                      <Label htmlFor="supplier">المورد *</Label>
                      <Select 
                        value={formData.supplierId} 
                        onValueChange={(value) => handleInputChange('supplierId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المورد" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers && suppliers.length > 0 ? (
                            suppliers.map((supplier) => {
                              const supplierId = supplier.id || supplier.supplier_id;
                              return (
                                <SelectItem key={supplierId} value={supplierId ? supplierId.toString() : "0"}>
                                  {supplier.supplierName || supplier.name_ar}
                                </SelectItem>
                              );
                            })
                          ) : (
                            <div className="p-2 text-center text-gray-500 text-sm">لا توجد موردين</div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* إضافة منتج جديد */}
                  <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg">إضافة منتج</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* المنتج */}
                        <div className="space-y-2">
                          <Label htmlFor="newProduct">المنتج (اختياري)</Label>
                          <Select 
                            value={newProduct.productId || ""} 
                            onValueChange={handleProductSelect}
                            disabled={productsLoading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر منتج" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {productsLoading ? (
                                <div className="p-2 text-center text-gray-500 text-sm">جاري التحميل...</div>
                              ) : products && products.length > 0 ? (
                                products.map((product) => {
                                  const productId = product.id || product.product_id || product.productId;
                                  const productName = product.nameAr || product.name_ar || product.productName || product.name || "منتج بدون اسم";
                                  return (
                                    <SelectItem 
                                      key={productId || Math.random()} 
                                      value={productId ? productId.toString() : "0"}
                                    >
                                      {productName}
                                    </SelectItem>
                                  );
                                })
                              ) : (
                                <div className="p-2 text-center text-gray-500 text-sm">لا توجد منتجات متاحة</div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* اسم المنتج */}
                        <div className="space-y-2">
                          <Label htmlFor="newProductName">اسم المنتج *</Label>
                          <Input
                            id="newProductName"
                            value={newProduct.productName}
                            onChange={(e) => handleNewProductChange('productName', e.target.value)}
                            placeholder="اسم المنتج"
                          />
                        </div>

                        {/* الكمية */}
                        <div className="space-y-2">
                          <Label htmlFor="newQuantity">الكمية *</Label>
                          <Input
                            id="newQuantity"
                            type="number"
                            step="0.01"
                            value={newProduct.quantity}
                            onChange={(e) => handleNewProductChange('quantity', e.target.value)}
                            placeholder="الكمية"
                          />
                        </div>

                        {/* الوحدة */}
                        <div className="space-y-2">
                          <Label htmlFor="newUnit">الوحدة</Label>
                          <Input
                            id="newUnit"
                            value={newProduct.unit}
                            onChange={(e) => handleNewProductChange('unit', e.target.value)}
                            placeholder="الوحدة"
                          />
                        </div>

                        {/* السعر */}
                        <div className="space-y-2">
                          <Label htmlFor="newPrice">السعر</Label>
                          <Input
                            id="newPrice"
                            type="number"
                            step="0.01"
                            value={newProduct.price}
                            onChange={(e) => handleNewProductChange('price', e.target.value)}
                            placeholder="السعر"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={handleAddProduct}
                        className="mt-4 w-full"
                        variant="outline"
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة منتج
                      </Button>
                    </CardContent>
                  </Card>

                  {/* قائمة المنتجات المختارة */}
                  {selectedProducts.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>المنتجات المختارة ({selectedProducts.length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>اسم المنتج</TableHead>
                                <TableHead>الكمية</TableHead>
                                <TableHead>الوحدة</TableHead>
                                <TableHead>السعر</TableHead>
                                <TableHead>الإجمالي</TableHead>
                                <TableHead>الإجراءات</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedProducts.map((product) => (
                                <TableRow key={product.id}>
                                  <TableCell>
                                    <Input
                                      value={product.productName}
                                      onChange={(e) => handleUpdateProduct(product.id, 'productName', e.target.value)}
                                      className="min-w-[150px]"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={product.quantity}
                                      onChange={(e) => handleUpdateProduct(product.id, 'quantity', e.target.value)}
                                      className="w-24"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      value={product.unit}
                                      onChange={(e) => handleUpdateProduct(product.id, 'unit', e.target.value)}
                                      className="w-20"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={product.price}
                                      onChange={(e) => handleUpdateProduct(product.id, 'price', e.target.value)}
                                      className="w-24"
                                    />
                                  </TableCell>
                                  <TableCell className="font-semibold text-green-600">
                                    {calculateProductTotal(product)} ج.م
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleRemoveProduct(product.id)}
                                    >
                                      <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* الإجمالي الكلي */}
                  {selectedProducts.length > 0 && (
                    <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-semibold text-gray-700">الإجمالي الكلي:</span>
                          <span className="text-3xl font-bold text-green-600">
                            {calculateGrandTotal()} ج.م
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* تاريخ الطلب */}
                    <div className="space-y-2">
                      <Label htmlFor="orderDate">تاريخ الطلب *</Label>
                      <Input
                        id="orderDate"
                        type="date"
                        value={formData.orderDate}
                        onChange={(e) => handleInputChange('orderDate', e.target.value)}
                        required
                      />
                    </div>

                    {/* تاريخ التسليم المتوقع */}
                    <div className="space-y-2">
                      <Label htmlFor="expectedDeliveryDate">تاريخ التسليم المتوقع</Label>
                      <Input
                        id="expectedDeliveryDate"
                        type="date"
                        value={formData.expectedDeliveryDate}
                        onChange={(e) => handleInputChange('expectedDeliveryDate', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* الملاحظات */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">ملاحظات</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="أدخل أي ملاحظات إضافية"
                      rows={3}
                    />
                  </div>

                  {/* أزرار الحفظ */}
                  <div className="flex gap-3">
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={isCreating || isUpdating}
                    >
                      <Save className="w-4 h-4 ml-2" />
                      {editMode ? "تحديث الطلب" : "حفظ الطلب"}
                    </Button>
                    {editMode && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={resetForm}
                      >
                        إلغاء
                      </Button>
                    )}
                  </div>
                </form>
              )}

              {activeTab === "list" && (
                <div className="space-y-4">
                  {ordersLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">جاري التحميل...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">لا توجد أوامر شراء</p>
                      <Button 
                        className="mt-4"
                        onClick={() => setActiveTab("new")}
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        إنشاء أمر جديد
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>رقم الأمر</TableHead>
                            <TableHead>المورد</TableHead>
                            <TableHead>المنتجات</TableHead>
                            <TableHead>إجمالي الكمية</TableHead>
                            <TableHead>الإجمالي الكلي</TableHead>
                            <TableHead>التاريخ</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead>الإجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {groupedOrders.map((group) => (
                            <TableRow key={group.orderNumber}>
                              <TableCell className="font-medium">{group.orderNumber}</TableCell>
                              <TableCell>{group.supplier}</TableCell>
                              <TableCell>
                                <div className="space-y-1 max-w-[400px]">
                                  {group.items.map((item, idx) => (
                                    <div key={item.id} className="text-sm flex items-center justify-between gap-2 p-1 bg-muted/20 rounded">
                                      <div className="flex items-center gap-2 flex-1">
                                        <span className="font-medium min-w-[100px]">{item.productName}</span>
                                        <span className="text-muted-foreground text-xs">
                                          {item.quantity} {item.unit} × {item.price?.toLocaleString()} ج.م
                                        </span>
                                      </div>
                                      <span className="text-primary font-semibold min-w-[80px] text-left">
                                        {item.totalAmount?.toLocaleString()} ج.م
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="font-semibold">
                                {calculateGroupQuantity(group).toFixed(2)}
                              </TableCell>
                              <TableCell className="font-bold text-green-600 text-lg">
                                {calculateGroupTotal(group).toLocaleString()} ج.م
                              </TableCell>
                              <TableCell>{new Date(group.orderDate).toLocaleDateString('ar-EG')}</TableCell>
                              <TableCell>
                                <Badge className={getStatusBadge(group.status)}>
                                  {group.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      // عرض جميع منتجات هذا الأمر في dialog
                                      const allOrdersForThisNumber = orders.filter(o => o.orderNumber === group.orderNumber);
                                      if (allOrdersForThisNumber.length > 0) {
                                        // إنشاء كائن مؤقت يحتوي على جميع المنتجات
                                        const combinedOrder = {
                                          ...group,
                                          allItems: allOrdersForThisNumber,
                                          totalAmount: calculateGroupTotal(group)
                                        };
                                        setSelectedOrder(combinedOrder);
                                        setDialogOpen(true);
                                      }
                                    }}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      // تعديل أول أمر في المجموعة (أو يمكن إضافة منطق أفضل)
                                      if (group.items.length > 0) {
                                        handleEdit(group.items[0]);
                                      }
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={async () => {
                                      if (window.confirm(`هل أنت متأكد من حذف جميع منتجات الأمر ${group.orderNumber}؟ (${group.items.length} منتج)`)) {
                                        try {
                                          // حذف جميع الأوامر في هذه المجموعة
                                          const deletePromises = group.items.map(item => 
                                            handleDelete(item.id)
                                          );
                                          await Promise.all(deletePromises);
                                          toast({
                                            title: "تم الحذف",
                                            description: `تم حذف جميع منتجات الأمر ${group.orderNumber} بنجاح`
                                          });
                                          refetch();
                                        } catch (error) {
                                          toast({
                                            title: "خطأ",
                                            description: "حدث خطأ أثناء الحذف",
                                            variant: "destructive"
                                          });
                                        }
                                      }
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* مودال التفاصيل */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              {/* معلومات الأمر الأساسية */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">رقم الأمر</Label>
                  <p className="font-semibold">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <Label className="text-gray-600">الحالة</Label>
                  <Badge className={getStatusBadge(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-600">المورد</Label>
                  <p className="font-semibold">{selectedOrder.supplier?.supplierName || selectedOrder.supplier || '-'}</p>
                </div>
                <div>
                  <Label className="text-gray-600">تاريخ الطلب</Label>
                  <p className="font-semibold">{new Date(selectedOrder.orderDate).toLocaleDateString('ar-EG')}</p>
                </div>
                {selectedOrder.expectedDeliveryDate && (
                  <div>
                    <Label className="text-gray-600">تاريخ التسليم المتوقع</Label>
                    <p className="font-semibold">{new Date(selectedOrder.expectedDeliveryDate).toLocaleDateString('ar-EG')}</p>
                  </div>
                )}
              </div>

              {/* عرض المنتجات - إذا كان مجموعة */}
              {(selectedOrder.items || selectedOrder.allItems) ? (
                <div className="border-t pt-4">
                  <Label className="text-gray-600 mb-2 block">المنتجات ({selectedOrder.items?.length || selectedOrder.allItems?.length})</Label>
                  <div className="space-y-2">
                    {(selectedOrder.items || selectedOrder.allItems || []).map((item, idx) => (
                      <div key={item.id || idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} {item.unit} × {item.price?.toLocaleString()} ج.م
                          </p>
                        </div>
                        <p className="font-semibold text-green-600">{item.totalAmount?.toLocaleString()} ج.م</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold">الإجمالي الكلي:</Label>
                      <p className="text-2xl font-bold text-green-600">
                        {calculateGroupTotal(selectedOrder).toLocaleString()} ج.م
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* عرض منتج واحد */
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">المنتج</Label>
                      <p className="font-semibold">{selectedOrder.productName}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">الكمية</Label>
                      <p className="font-semibold">{selectedOrder.quantity} {selectedOrder.unit}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">السعر</Label>
                      <p className="font-semibold">{selectedOrder.price?.toLocaleString()} ج.م</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">الإجمالي</Label>
                      <p className="font-semibold text-green-600">{selectedOrder.totalAmount?.toLocaleString()} ج.م</p>
                    </div>
                  </div>
                </>
              )}

              {selectedOrder.notes && (
                <div className="border-t pt-4">
                  <Label className="text-gray-600">ملاحظات</Label>
                  <p className="mt-1">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => {
                    if (selectedOrder.items || selectedOrder.allItems) {
                      // إذا كانت مجموعة، غير حالة جميع المنتجات
                      handleGroupStatusChange(selectedOrder, value);
                    } else {
                      // منتج واحد
                      handleStatusChange(selectedOrder.id, value);
                      setDialogOpen(false);
                    }
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="تغيير الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مسودة">مسودة</SelectItem>
                    <SelectItem value="مرسل">مرسل</SelectItem>
                    <SelectItem value="مؤكد">مؤكد</SelectItem>
                    <SelectItem value="مكتمل">مكتمل</SelectItem>
                    <SelectItem value="ملغي">ملغي</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuickPurchaseOrder;

