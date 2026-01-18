import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, AlertCircle, CheckCircle, Clock } from "lucide-react";

const MaintenanceDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم الصيانة</h1>
          <p className="text-gray-600 mt-1">نظرة شاملة على أعمال الصيانة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">إجمالي طلبات الصيانة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">125</div>
              <p className="text-sm text-gray-500 mt-1">طلب صيانة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">قيد التنفيذ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">28</div>
              <p className="text-sm text-gray-500 mt-1">طلب قيد المعالجة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">مكتملة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">85</div>
              <p className="text-sm text-gray-500 mt-1">طلب مكتمل</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">طارئة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">12</div>
              <p className="text-sm text-gray-500 mt-1">طلب عاجل</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;

