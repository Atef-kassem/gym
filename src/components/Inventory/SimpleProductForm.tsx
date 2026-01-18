import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, X, Upload, Package, Hash, DollarSign, Box } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateProductMutation, useUpdateProductMutation } from "@/services/productApi";
import { getImageUrl } from "@/utils/imageHelpers";

interface SimpleProduct {
  product_id?: string;
  name_ar?: string;
  selling_price?: number;
  current_stock?: number;
  image_url?: string;
}

interface SimpleProductFormProps {
  editingProduct?: SimpleProduct | null;
  onSave: () => void;
  onCancel: () => void;
}

export const SimpleProductForm: React.FC<SimpleProductFormProps> = ({
  editingProduct,
  onSave,
  onCancel,
}) => {
  const { toast } = useToast();
  const [nameAr, setNameAr] = useState(editingProduct?.name_ar || "");
  const [productId, setProductId] = useState(editingProduct?.product_id || "");
  const [sellingPrice, setSellingPrice] = useState(
    editingProduct?.selling_price?.toString() || ""
  );
  const [currentStock, setCurrentStock] = useState(
    editingProduct?.current_stock?.toString() || ""
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    editingProduct?.image_url ? getImageUrl(editingProduct.image_url) || null : null
  );

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const isLoading = isCreating || isUpdating;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith("image/")) {
        toast({
          title: "خطأ",
          description: "الرجاء اختيار ملف صورة",
          variant: "destructive",
        });
        return;
      }

      // التحقق من حجم الملف (5MB كحد أقصى)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "خطأ",
          description: "حجم الصورة يجب أن يكون أقل من 5MB",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      
      // عرض معاينة الصورة
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من الحقول المطلوبة
    if (!nameAr.trim()) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال اسم المنتج",
        variant: "destructive",
      });
      return;
    }

    if (!productId.trim()) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال كود المنتج",
        variant: "destructive",
      });
      return;
    }

    if (!sellingPrice || parseFloat(sellingPrice) <= 0) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال سعر صحيح للمنتج",
        variant: "destructive",
      });
      return;
    }

    if (!currentStock || parseInt(currentStock) < 0) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال كمية صحيحة للمنتج",
        variant: "destructive",
      });
      return;
    }

    try {
      // إنشاء FormData
      const formData = new FormData();
      formData.append("name_ar", nameAr.trim());
      formData.append("product_id", productId.trim());
      formData.append("selling_price", parseFloat(sellingPrice).toString());
      formData.append("current_stock", parseInt(currentStock).toString());
      
      // إضافة الحقول الاختيارية للـ API
      formData.append("name_en", nameAr.trim()); // استخدام نفس الاسم
      formData.append("status", "active");
      formData.append("unit_of_measure", "وحدة");
      formData.append("category_id", "1"); // قيمة افتراضية
      formData.append("cost_price", "0");
      
      // إضافة الصورة إذا كانت موجودة
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingProduct?.product_id) {
        // تحديث المنتج
        await updateProduct({
          id: editingProduct.product_id,
          updatedProduct: formData,
        }).unwrap();
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث المنتج بنجاح",
        });
      } else {
        // إنشاء منتج جديد
        await createProduct(formData).unwrap();
        toast({
          title: "تم الحفظ بنجاح",
          description: "تم إضافة المنتج بنجاح",
        });
      }

      onSave();
    } catch (error: any) {
      console.error("❌ خطأ في حفظ المنتج:", error);
      toast({
        title: "خطأ",
        description:
          error?.data?.message ||
          error?.message ||
          "حدث خطأ أثناء حفظ المنتج",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* اسم المنتج */}
        <div className="space-y-2">
          <Label htmlFor="name_ar" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            اسم المنتج <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name_ar"
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            placeholder="أدخل اسم المنتج"
            required
            disabled={isLoading}
          />
        </div>

        {/* كود المنتج */}
        <div className="space-y-2">
          <Label htmlFor="product_id" className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            كود المنتج <span className="text-red-500">*</span>
          </Label>
          <Input
            id="product_id"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="أدخل كود المنتج"
            required
            disabled={isLoading || !!editingProduct?.product_id}
            className={editingProduct?.product_id ? "bg-gray-100" : ""}
          />
          {editingProduct?.product_id && (
            <p className="text-xs text-gray-500">
              لا يمكن تعديل كود المنتج
            </p>
          )}
        </div>

        {/* سعر المنتج */}
        <div className="space-y-2">
          <Label htmlFor="selling_price" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            سعر المنتج <span className="text-red-500">*</span>
          </Label>
          <Input
            id="selling_price"
            type="number"
            min="0"
            step="0.01"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            placeholder="0.00"
            required
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500">السعر بالجنيه</p>
        </div>

        {/* كمية المنتج */}
        <div className="space-y-2">
          <Label htmlFor="current_stock" className="flex items-center gap-2">
            <Box className="h-4 w-4" />
            كمية المنتج <span className="text-red-500">*</span>
          </Label>
          <Input
            id="current_stock"
            type="number"
            min="0"
            value={currentStock}
            onChange={(e) => setCurrentStock(e.target.value)}
            placeholder="0"
            required
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500">الكمية المتاحة</p>
        </div>
      </div>

      {/* صورة المنتج */}
      <div className="space-y-2">
        <Label htmlFor="image" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          صورة المنتج
        </Label>
        <div className="space-y-4">
          {imagePreview && (
            <div className="relative w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="معاينة الصورة"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex items-center gap-4">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isLoading}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500">
              اختر صورة للمنتج (PNG, JPG, JPEG - حد أقصى 5MB)
            </p>
          </div>
        </div>
      </div>

      {/* ملاحظة */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>ملاحظة:</strong> الحقول المميزة بـ <span className="text-red-500">*</span> إلزامية
        </p>
      </div>
    </form>
  );
};

