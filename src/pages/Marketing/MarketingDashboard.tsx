import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Target, DollarSign } from "lucide-react";

const MarketingDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-rose-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم التسويق</h1>
          <p className="text-gray-600 mt-1">نظرة شاملة على أنشطة التسويق والمبيعات</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-pink-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الحملات النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-600">12</div>
              <p className="text-sm text-gray-500 mt-1">حملة نشطة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">التحويلات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">45%</div>
              <p className="text-sm text-gray-500 mt-1">معدل التحويل</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">العملاء المحتملين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">245</div>
              <p className="text-sm text-gray-500 mt-1">عميل محتمل</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">المبيعات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">125K ج.م</div>
              <p className="text-sm text-gray-500 mt-1">إجمالي المبيعات</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarketingDashboard;

