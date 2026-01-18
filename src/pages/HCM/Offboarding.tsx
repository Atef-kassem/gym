import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock, AlertCircle, FileText, Users, Calculator } from "lucide-react";
import { toast } from "@/hooks/use-toast";


export default function Offboarding() {
  const [selectedBranch, setSelectedBranch] = useState("all");

  const offboardingCases = [
    {
      id: "OFF001",
      employeeName: "أحمد محمد علي",
      employeeId: "EMP001",
      department: "الفنيين",
      terminationType: "استقالة",
      lastWorkDay: "2024-01-30",
      status: "في المراجعة",
      progress: 45,
      clearanceItems: [
        { item: "تسليم العهدة", status: "مكتمل", responsible: "المستودع" },
        { item: "تسليم الزي الموحد", status: "معلق", responsible: "الموارد البشرية" },
        { item: "إرجاع بطاقة الدخول", status: "مكتمل", responsible: "الأمن" },
        { item: "تعطيل الحسابات", status: "معلق", responsible: "تقنية المعلومات" }
      ]
    },
    {
      id: "OFF002",
      employeeName: "فاطمة خالد",
      employeeId: "EMP002",
      department: "الإدارة",
      terminationType: "انتهاء عقد",
      lastWorkDay: "2024-01-25",
      status: "مكتمل",
      progress: 100,
      clearanceItems: [
        { item: "تسليم العهدة", status: "مكتمل", responsible: "المستودع" },
        { item: "تسليم الزي الموحد", status: "مكتمل", responsible: "الموارد البشرية" },
        { item: "إرجاع بطاقة الدخول", status: "مكتمل", responsible: "الأمن" },
        { item: "تعطيل الحسابات", status: "مكتمل", responsible: "تقنية المعلومات" }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مكتمل": return "bg-green-500";
      case "في المراجعة": return "bg-yellow-500";
      case "معلق": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "مكتمل": return <CheckCircle className="h-4 w-4" />;
      case "في المراجعة": return <Clock className="h-4 w-4" />;
      case "معلق": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">نهاية الخدمة وإخلاء الطرف</h1>
            <p className="text-slate-600 mt-2">إدارة عمليات إنهاء الخدمة وإخلاء الطرف</p>
          </div>
          <div className="flex gap-4">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-300"
              onClick={() => {
                toast({
                  title: "بدء إجراء جديد",
                  description: "جاري فتح نموذج إجراءات إنهاء الخدمة...",
                });
              }}
            >
              <Users className="ml-2 h-4 w-4 animate-pulse" />
              بدء إجراء جديد
            </Button>
          </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="group border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-fade-in bg-gradient-to-br from-white to-slate-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-slate-800 transition-colors duration-300">الحالات النشطة</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 group-hover:animate-pulse transition-colors duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300">8</div>
            <p className="text-xs text-muted-foreground group-hover:text-blue-600 transition-colors duration-300">+2 عن الشهر الماضي</p>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-fade-in bg-gradient-to-br from-white to-slate-50/30" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-slate-800 transition-colors duration-300">مكتملة هذا الشهر</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground group-hover:text-green-600 group-hover:animate-pulse transition-colors duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300">12</div>
            <p className="text-xs text-muted-foreground group-hover:text-green-600 transition-colors duration-300">+20% عن الشهر الماضي</p>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-fade-in bg-gradient-to-br from-white to-slate-50/30" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-slate-800 transition-colors duration-300">متوسط وقت الإكمال</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground group-hover:text-orange-600 group-hover:animate-pulse transition-colors duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300">5.2</div>
            <p className="text-xs text-muted-foreground group-hover:text-orange-600 transition-colors duration-300">أيام</p>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-fade-in bg-gradient-to-br from-white to-slate-50/30" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-slate-800 transition-colors duration-300">إجمالي المستحقات</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground group-hover:text-purple-600 group-hover:animate-pulse transition-colors duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300">850,000</div>
            <p className="text-xs text-muted-foreground group-hover:text-purple-600 transition-colors duration-300">جنيه مصري</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">الحالات النشطة</TabsTrigger>
          <TabsTrigger value="completed">المكتملة</TabsTrigger>
          <TabsTrigger value="settlement">التسوية المالية</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="space-y-4">
            {offboardingCases.filter(c => c.status !== "مكتمل").map((offCase) => (
              <Card key={offCase.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{offCase.employeeName}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {offCase.employeeId} - {offCase.department}
                      </p>
                    </div>
                    <div className="text-left">
                      <Badge className={getStatusColor(offCase.status)}>
                        {getStatusIcon(offCase.status)}
                        <span className="mr-1">{offCase.status}</span>
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        نوع النهاية: {offCase.terminationType}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>تقدم الإجراءات</span>
                        <span>{offCase.progress}%</span>
                      </div>
                      <Progress value={offCase.progress} className="w-full" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {offCase.clearanceItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{item.item}</p>
                            <p className="text-sm text-muted-foreground">{item.responsible}</p>
                          </div>
                          <Badge variant={item.status === "مكتمل" ? "default" : "destructive"}>
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => toast({ title: "عرض التفاصيل", description: "جاري تحميل تفاصيل الحالة..." })}>عرض التفاصيل</Button>
                      <Button onClick={() => toast({ title: "متابعة الإجراءات", description: "جاري فتح نموذج المتابعة..." })}>متابعة الإجراءات</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الحالات المكتملة</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الموظف</TableHead>
                    <TableHead>القسم</TableHead>
                    <TableHead>نوع النهاية</TableHead>
                    <TableHead>تاريخ الإكمال</TableHead>
                    <TableHead>المستحقات</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offboardingCases.filter(c => c.status === "مكتمل").map((offCase) => (
                    <TableRow key={offCase.id}>
                      <TableCell className="font-medium">{offCase.employeeName}</TableCell>
                      <TableCell>{offCase.department}</TableCell>
                      <TableCell>{offCase.terminationType}</TableCell>
                      <TableCell>{offCase.lastWorkDay}</TableCell>
                      <TableCell>25,000 جنيه</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => toast({ title: "عرض التقرير", description: "جاري تحميل تقرير إنهاء الخدمة..." })}>عرض التقرير</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settlement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>التسوية المالية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="employee-search">البحث عن موظف</Label>
                    <Input id="employee-search" placeholder="اسم الموظف أو الرقم الوظيفي" />
                  </div>
                  <div>
                    <Label htmlFor="termination-type">نوع إنهاء الخدمة</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الإنهاء" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resignation">استقالة</SelectItem>
                        <SelectItem value="termination">فصل</SelectItem>
                        <SelectItem value="retirement">تقاعد</SelectItem>
                        <SelectItem value="contract-end">انتهاء عقد</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="service-years">سنوات الخدمة</Label>
                    <Input id="service-years" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="last-salary">آخر راتب</Label>
                    <Input id="last-salary" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="leave-balance">رصيد الإجازات</Label>
                    <Input id="leave-balance" type="number" placeholder="0" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Textarea id="notes" placeholder="أي ملاحظات إضافية..." />
                </div>
                
                <Button className="w-full" onClick={() => toast({ title: "احتساب المستحقات", description: "جاري حساب مستحقات نهاية الخدمة..." })}>
                  <Calculator className="ml-2 h-4 w-4" />
                  احتساب المستحقات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}