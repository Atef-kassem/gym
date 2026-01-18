import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, TrendingUp, Download, FileText, DollarSign } from "lucide-react";

const MaintenanceReports = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تقارير الصيانة</h1>
          <p className="text-gray-600 mt-1">تقارير شاملة عن أعمال الصيانة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-orange-600" />
                تقرير الطلبات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">تقرير شامل عن طلبات الصيانة</p>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 ml-2" />
                تصدير
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                تقرير التكاليف
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">تقرير تكاليف الصيانة</p>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 ml-2" />
                تصدير
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                تقرير الأداء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">تقرير أداء الفنيين</p>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 ml-2" />
                تصدير
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceReports;

