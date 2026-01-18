import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  ArrowRight,
  Lock,
  Unlock,
  RotateCcw,
  TrendingUp,
  Activity
} from "lucide-react";

const AccountingOperationsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for financial years
  const financialYears = [
    {
      id: 1,
      year: "2024",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "active",
      isOpen: true,
      postingProgress: 85,
      totalTransactions: 15420,
      postedTransactions: 13107
    },
    {
      id: 2,
      year: "2023",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      status: "closed",
      isOpen: false,
      postingProgress: 100,
      totalTransactions: 18650,
      postedTransactions: 18650
    },
    {
      id: 3,
      year: "2022",
      startDate: "2022-01-01",
      endDate: "2022-12-31",
      status: "closed",
      isOpen: false,
      postingProgress: 100,
      totalTransactions: 16890,
      postedTransactions: 16890
    }
  ];

  const pendingOperations = [
    {
      id: 1,
      type: "posting",
      description: "ترحيل قيود شهر ديسمبر 2024",
      priority: "high",
      dueDate: "2024-12-31",
      progress: 75
    },
    {
      id: 2,
      type: "adjustment",
      description: "تسويات نهاية السنة المالية",
      priority: "medium",
      dueDate: "2024-12-30",
      progress: 30
    },
    {
      id: 3,
      type: "reconciliation",
      description: "تسوية حسابات البنوك",
      priority: "high",
      dueDate: "2024-12-28",
      progress: 90
    }
  ];

  const handleOpenFinancialYear = (year: string) => {
    console.log(`Opening financial year: ${year}`);
  };

  const handleCloseFinancialYear = (year: string) => {
    console.log(`Closing financial year: ${year}`);
  };

  const handlePostTransactions = (yearId: number) => {
    console.log(`Posting transactions for year: ${yearId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة العمليات المحاسبية</h1>
          <p className="text-muted-foreground">إدارة السنوات المالية والترحيل والعمليات المحاسبية</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            تقرير العمليات
          </Button>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            سنة مالية جديدة
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">السنة المالية النشطة</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2024</div>
            <p className="text-xs text-muted-foreground">
              متبقي 28 يوم
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المعاملات</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,420</div>
            <p className="text-xs text-muted-foreground">
              +2.5% من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المعاملات المرحلة</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13,107</div>
            <p className="text-xs text-muted-foreground">
              85% مكتملة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العمليات المعلقة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              تحتاج متابعة
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert for pending operations */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          يوجد 3 عمليات محاسبية معلقة تحتاج للمتابعة قبل إقفال السنة المالية
        </AlertDescription>
      </Alert>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="financial-years">السنوات المالية</TabsTrigger>
          <TabsTrigger value="posting">الترحيل</TabsTrigger>
          <TabsTrigger value="operations">العمليات المعلقة</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Year Status */}
            <Card>
              <CardHeader>
                <CardTitle>حالة السنة المالية الحالية</CardTitle>
                <CardDescription>2024 (يناير - ديسمبر)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>تقدم الترحيل</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="w-full" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>إجمالي المعاملات:</span>
                    <span>15,420</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>المعاملات المرحلة:</span>
                    <span>13,107</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>المعاملات المعلقة:</span>
                    <span>2,313</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>إجراءات سريعة</CardTitle>
                <CardDescription>العمليات المحاسبية الأساسية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Unlock className="h-4 w-4 mr-2" />
                  فتح سنة مالية جديدة
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  ترحيل المعاملات
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Lock className="h-4 w-4 mr-2" />
                  إقفال السنة المالية
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  تقرير العمليات
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial-years" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إدارة السنوات المالية</CardTitle>
              <CardDescription>فتح وإقفال السنوات المالية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialYears.map((year) => (
                  <div key={year.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">السنة المالية {year.year}</h3>
                        <Badge variant={year.status === "active" ? "default" : "secondary"}>
                          {year.status === "active" ? "نشطة" : "مقفلة"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {year.isOpen ? (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleCloseFinancialYear(year.year)}
                          >
                            <Lock className="h-4 w-4 mr-1" />
                            إقفال
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleOpenFinancialYear(year.year)}
                          >
                            <Unlock className="h-4 w-4 mr-1" />
                            إعادة فتح
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePostTransactions(year.id)}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          ترحيل
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">تاريخ البداية:</span>
                        <div className="font-medium">{year.startDate}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">تاريخ النهاية:</span>
                        <div className="font-medium">{year.endDate}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">نسبة الترحيل:</span>
                        <div className="font-medium">{year.postingProgress}%</div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>تقدم الترحيل</span>
                        <span>{year.postedTransactions.toLocaleString()} من {year.totalTransactions.toLocaleString()}</span>
                      </div>
                      <Progress value={year.postingProgress} className="w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إدارة الترحيل</CardTitle>
              <CardDescription>ترحيل المعاملات والقيود المحاسبية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Posting Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">13,107</div>
                    <div className="text-sm text-muted-foreground">معاملات مرحلة</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">2,313</div>
                    <div className="text-sm text-muted-foreground">معاملات معلقة</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600">15</div>
                    <div className="text-sm text-muted-foreground">معاملات خاطئة</div>
                  </div>
                </div>

                {/* Posting Actions */}
                <div className="space-y-3">
                  <Button className="w-full justify-between" size="lg">
                    <span className="flex items-center">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      ترحيل جميع المعاملات المعلقة
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-between" size="lg">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      ترحيل معاملات فترة محددة
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-between" size="lg">
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      مراجعة المعاملات المرحلة
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>العمليات المعلقة</CardTitle>
              <CardDescription>العمليات المحاسبية التي تحتاج متابعة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingOperations.map((operation) => (
                  <div key={operation.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <h4 className="font-medium">{operation.description}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={operation.priority === "high" ? "destructive" : "secondary"}>
                            {operation.priority === "high" ? "عالية" : "متوسطة"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            موعد الاستحقاق: {operation.dueDate}
                          </span>
                        </div>
                      </div>
                      <Button size="sm">
                        متابعة
                        <ArrowRight className="h-4 w-4 mr-1" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>التقدم</span>
                        <span>{operation.progress}%</span>
                      </div>
                      <Progress value={operation.progress} className="w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountingOperationsDashboard;