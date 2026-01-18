import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle, Search, Calendar, Clock, Users,
  TrendingUp, TrendingDown, Filter
} from "lucide-react";

const MemberAttendance = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // بيانات وهمية للحضور
  const todayAttendance = [
    {
      id: 1,
      memberName: "أحمد محمد",
      checkIn: "08:30",
      checkOut: "10:15",
      duration: "1:45",
      status: "حاضر"
    },
    {
      id: 2,
      memberName: "فاطمة علي",
      checkIn: "09:00",
      checkOut: "-",
      duration: "مستمر",
      status: "حاضر"
    },
    {
      id: 3,
      memberName: "محمد حسن",
      checkIn: "14:30",
      checkOut: "-",
      duration: "مستمر",
      status: "حاضر"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">حضور الأعضاء</h1>
            <p className="text-gray-600 mt-1">تتبع حضور وانصراف الأعضاء</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث عن عضو..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-5 h-5 ml-2" />
              تصفية
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Calendar className="w-5 h-5 ml-2" />
              تقرير شهري
            </Button>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الحضور اليوم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">156</div>
              <p className="text-sm text-gray-500 mt-1">عضو حضر اليوم</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">المستمرون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">28</div>
              <p className="text-sm text-gray-500 mt-1">عضو داخل النادي</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">نسبة الحضور</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">78.5%</div>
              <p className="text-sm text-gray-500 mt-1">متوسط الحضور</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">المعدل اليومي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">2.3 س</div>
              <p className="text-sm text-gray-500 mt-1">متوسط المدة</p>
            </CardContent>
          </Card>
        </div>

        {/* التبويبات */}
        <Tabs defaultValue="today" className="space-y-4">
          <TabsList>
            <TabsTrigger value="today">حضور اليوم</TabsTrigger>
            <TabsTrigger value="monthly">الحضور الشهري</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  حضور اليوم - {new Date().toLocaleDateString('ar-EG')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-4 font-semibold">اسم العضو</th>
                        <th className="text-right py-3 px-4 font-semibold">وقت الدخول</th>
                        <th className="text-right py-3 px-4 font-semibold">وقت الخروج</th>
                        <th className="text-right py-3 px-4 font-semibold">المدة</th>
                        <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayAttendance.map((attendance) => (
                        <tr key={attendance.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-semibold">{attendance.memberName}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-green-500" />
                              {attendance.checkIn}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {attendance.checkOut !== "-" ? (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-red-500" />
                                {attendance.checkOut}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">{attendance.duration}</td>
                          <td className="py-3 px-4">
                            <Badge className="bg-green-500">{attendance.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <Card>
              <CardHeader>
                <CardTitle>الحضور الشهري</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>مخطط الحضور الشهري سيظهر هنا</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>تقارير الحضور</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        تقرير الحضور الأسبوعي
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        تحميل التقرير
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        تقرير الأعضاء الأكثر حضوراً
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        تحميل التقرير
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default MemberAttendance;

