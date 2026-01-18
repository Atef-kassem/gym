import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, TrendingUp, Download, FileText } from "lucide-react";

const WarehouseReports = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تقارير المستودعات</h1>
          <p className="text-gray-600 mt-1">تقارير شاملة عن المستودعات والمخزون</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-purple-600" />
                تقرير المخزون
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">تقرير شامل عن المخزون الحالي</p>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 ml-2" />
                تصدير
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                تقرير الحركة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">تقرير حركة المخزون</p>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 ml-2" />
                تصدير
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                تقرير الجرد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">تقارير عمليات الجرد</p>
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

export default WarehouseReports;

