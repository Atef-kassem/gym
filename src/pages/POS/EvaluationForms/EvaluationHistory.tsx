import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Filter, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockEvaluations = [
  {
    id: 1,
    invoiceNumber: "INV-2024-001",
    plateNumber: "أ ب ج 1234",
    customerName: "أحمد علي",
    overallRating: "excellent",
    date: "2024-01-15",
    employee: "محمد أحمد",
    servicePath: "مسار VIP"
  },
  {
    id: 2,
    invoiceNumber: "INV-2024-002", 
    plateNumber: "د هـ و 5678",
    customerName: "فاطمة محمد",
    overallRating: "good",
    date: "2024-01-15",
    employee: "علي محمد",
    servicePath: "مسار ال  الشامل"
  },
  {
    id: 3,
    invoiceNumber: "INV-2024-003",
    plateNumber: "ز ح ط 9876",
    customerName: "خالد الأحمد",
    overallRating: "poor",
    date: "2024-01-14",
    employee: "فهد الخالد",
    servicePath: "مسار ال  السريع"
  }
];

export default function EvaluationHistory() {
  const navigate = useNavigate();
  const [filterRating, setFilterRating] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const getRatingBadge = (rating: string) => {
    const ratingConfig = {
      excellent: { label: "ممتاز", variant: "default" as const, color: "bg-green-100 text-green-800" },
      good: { label: "جيد", variant: "secondary" as const, color: "bg-blue-100 text-blue-800" },
      acceptable: { label: "مقبول", variant: "outline" as const, color: "bg-yellow-100 text-yellow-800" },
      poor: { label: "سيئ", variant: "destructive" as const, color: "bg-red-100 text-red-800" }
    };
    
    return ratingConfig[rating as keyof typeof ratingConfig] || { label: rating, variant: "outline" as const, color: "bg-gray-100 text-gray-800" };
  };

  const filteredEvaluations = mockEvaluations.filter(evaluation => {
    const matchesRating = !filterRating || filterRating === "all" || evaluation.overallRating === filterRating;
    const matchesSearch = !searchTerm || 
      evaluation.customerName.includes(searchTerm) ||
      evaluation.plateNumber.includes(searchTerm) ||
      evaluation.invoiceNumber.includes(searchTerm);
    return matchesRating && matchesSearch;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/pos/evaluation-management")}
          >
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">سجل التقييمات</h1>
            <p className="text-muted-foreground">تاريخ وسجل جميع تقييمات العملاء</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 ml-2" />
          تصدير البيانات
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في التقييمات (رقم الايصال، اسم العميل، رقم اللوحة)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 ml-2" />
                  <SelectValue placeholder="تصفية حسب التقييم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التقييمات</SelectItem>
                  <SelectItem value="excellent">ممتاز</SelectItem>
                  <SelectItem value="good">جيد</SelectItem>
                  <SelectItem value="acceptable">مقبول</SelectItem>
                  <SelectItem value="poor">سيئ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>نتائج البحث ({filteredEvaluations.length} تقييم)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvaluations.map((evaluation) => {
              const badge = getRatingBadge(evaluation.overallRating);
              return (
                <div
                  key={evaluation.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold">{evaluation.customerName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {evaluation.plateNumber} • {evaluation.invoiceNumber}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{evaluation.servicePath}</p>
                      <p className="text-sm text-muted-foreground">{evaluation.employee}</p>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={badge.color}>
                        {badge.label}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">{evaluation.date}</p>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {filteredEvaluations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد تقييمات تطابق معايير البحث
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}