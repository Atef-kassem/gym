import React from "react";
import { AddItemForm } from "@/components/Inventory/AddItemForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AddItemPage() {
  const navigate = useNavigate();

  const handleSave = () => {
    // يمكن إضافة منطق إضافي هنا مثل إعادة التوجيه
    console.log("تم حفظ الصنف بنجاح");
    navigate("/inventory"); // العودة إلى صفحة المخزون
  };

  const handleCancel = () => {
    navigate("/inventory"); // العودة إلى صفحة المخزون
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/inventory")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة للمخزون
            </Button>
          </div>
          
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                إضافة صنف جديد
              </CardTitle>
              <p className="text-gray-600 mt-2">
                أضف خدمات أو منتجات أو مستهلكات أو مشروب ومنتجات جديدة إلى النظام
              </p>
            </CardHeader>
          </Card>
        </div>

        {/* Form */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <AddItemForm onSave={handleSave} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 