import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, Settings, Smartphone, Headphones, Download,
  FileText, TrendingUp, Users, DollarSign, Calendar
} from "lucide-react";

const ReportsAndSettings = () => {
  // بيانات وهمية للتقارير
  const reports = [
    { id: 1, name: "تقرير الإيرادات الشهري", type: "مالي", date: "2024-01-25" },
    { id: 2, name: "تقرير الحضور", type: "حضور", date: "2024-01-25" },
    { id: 3, name: "تقرير المدربين", type: "مدربين", date: "2024-01-24" },
    { id: 4, name: "تقرير الأعضاء", type: "أعضاء", date: "2024-01-24" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العنوان */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">التقارير والإعدادات</h1>
          <p className="text-gray-600 mt-1">التقارير والإعدادات والدعم</p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">التقارير المتاحة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">24</div>
              <p className="text-sm text-gray-500 mt-1">تقرير جاهز</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">التطبيق المحمول</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">1,250</div>
              <p className="text-sm text-gray-500 mt-1">مستخدم نشط</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-gray-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الإعدادات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">15</div>
              <p className="text-sm text-gray-500 mt-1">إعدادات متاحة</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">الدعم الفني</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <p className="text-sm text-gray-500 mt-1">متاح دائماً</p>
            </CardContent>
          </Card>
        </div>

        {/* التبويبات */}
        <Tabs defaultValue="reports" className="space-y-4">
          <TabsList>
            <TabsTrigger value="reports">التقارير والتحليلات</TabsTrigger>
            <TabsTrigger value="mobile">التطبيق المحمول</TabsTrigger>
            <TabsTrigger value="settings">إعدادات النادي</TabsTrigger>
            <TabsTrigger value="support">الدعم الفني</TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  التقارير والتحليلات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        التقارير المالية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">تقارير الإيرادات والمصروفات</p>
                      <Button variant="outline" className="w-full">
                        <FileText className="w-4 h-4 ml-2" />
                        عرض التقارير
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        تقارير الأعضاء
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">تقارير العضوية والحضور</p>
                      <Button variant="outline" className="w-full">
                        <FileText className="w-4 h-4 ml-2" />
                        عرض التقارير
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        تقارير الأداء
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">تقارير أداء النادي</p>
                      <Button variant="outline" className="w-full">
                        <FileText className="w-4 h-4 ml-2" />
                        عرض التقارير
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        تقارير الجدولة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">تقارير الحصص والبيع</p>
                      <Button variant="outline" className="w-full">
                        <FileText className="w-4 h-4 ml-2" />
                        عرض التقارير
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* التقارير الأخيرة */}
                <Card>
                  <CardHeader>
                    <CardTitle>التقارير الأخيرة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {reports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div>
                            <div className="font-semibold">{report.name}</div>
                            <div className="text-sm text-gray-500">{report.date}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{report.type}</Badge>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mobile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  التطبيق المحمول
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-l-4 border-l-green-500">
                      <CardHeader>
                        <CardTitle className="text-sm">المستخدمون النشطون</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">1,250</div>
                        <p className="text-sm text-gray-500">مستخدم نشط</p>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <CardTitle className="text-sm">التقييم</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">4.8</div>
                        <p className="text-sm text-gray-500">من 5 نجوم</p>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-purple-500">
                      <CardHeader>
                        <CardTitle className="text-sm">التحديثات</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">v2.1.5</div>
                        <p className="text-sm text-gray-500">آخر إصدار</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="text-center py-8 text-gray-500">
                    <Smartphone className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>إعدادات التطبيق المحمول سيظهر هنا</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  إعدادات النادي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle>الإعدادات العامة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">إعدادات النادي الأساسية</p>
                      <Button variant="outline" className="w-full">
                        تعديل الإعدادات
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle>الصلاحيات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">إدارة الصلاحيات والأدوار</p>
                      <Button variant="outline" className="w-full">
                        إدارة الصلاحيات
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle>الإشعارات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">إعدادات الإشعارات</p>
                      <Button variant="outline" className="w-full">
                        تعديل الإشعارات
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle>الأمان</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">إعدادات الأمان</p>
                      <Button variant="outline" className="w-full">
                        تعديل الأمان
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="w-5 h-5" />
                  الدعم الفني
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <Headphones className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                    <h3 className="text-xl font-semibold mb-2">الدعم الفني ومركز المساعدة</h3>
                    <p className="text-gray-600 mb-6">نحن هنا لمساعدتك في أي وقت</p>
                    <div className="flex gap-3 justify-center">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Headphones className="w-5 h-5 ml-2" />
                        تواصل معنا
                      </Button>
                      <Button variant="outline">
                        <FileText className="w-5 h-5 ml-2" />
                        دليل المستخدم
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">البريد الإلكتروني</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">support@gym.com</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">الهاتف</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">+20 123 456 7890</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">ساعات العمل</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">24/7</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default ReportsAndSettings;

