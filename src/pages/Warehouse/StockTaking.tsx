import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  ClipboardCheck, Plus, Search, Save, CheckCircle, XCircle, Calculator
} from "lucide-react";

const StockTaking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stockTakings, setStockTakings] = useState([
    {
      id: 1,
      warehouse: "مستودع الرئيسي",
      date: "2024-01-20",
      items: 150,
      status: "مكتمل",
      differences: 5
    },
    {
      id: 2,
      warehouse: "مستودع الفرع 1",
      date: "2024-01-25",
      items: 120,
      status: "قيد التنفيذ",
      differences: 0
    },
    {
      id: 3,
      warehouse: "مستودع التوزيع",
      date: "2024-01-22",
      items: 90,
      status: "مكتمل",
      differences: 2
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    warehouse: "",
    date: ""
  });
  const { toast } = useToast();

  const handleAdd = () => {
    setFormData({
      warehouse: "",
      date: new Date().toISOString().split('T')[0]
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.warehouse || !formData.date) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newStockTaking = {
      id: stockTakings.length + 1,
      warehouse: formData.warehouse,
      date: formData.date,
      items: 0,
      status: "قيد التنفيذ",
      differences: 0
    };
    
    setStockTakings([...stockTakings, newStockTaking]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إنشاء جرد جديد بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">جرد المخزون</h1>
            <p className="text-gray-600 mt-1">إجراء جرد للمخزون والتحقق من الكميات</p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="البحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              جرد جديد
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5" />
              عمليات الجرد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">المستودع</th>
                    <th className="text-right py-3 px-4 font-semibold">تاريخ الجرد</th>
                    <th className="text-right py-3 px-4 font-semibold">عدد العناصر</th>
                    <th className="text-right py-3 px-4 font-semibold">الفروقات</th>
                    <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {stockTakings.map((stockTaking) => (
                    <tr key={stockTaking.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{stockTaking.warehouse}</td>
                      <td className="py-3 px-4">{stockTaking.date}</td>
                      <td className="py-3 px-4">{stockTaking.items} عنصر</td>
                      <td className="py-3 px-4">
                        <Badge className={stockTaking.differences > 0 ? "bg-red-500" : "bg-green-500"}>
                          {stockTaking.differences} فروق
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={stockTaking.status === "مكتمل" ? "bg-green-500" : "bg-amber-500"}>
                          {stockTaking.status === "مكتمل" ? <CheckCircle className="w-3 h-3 ml-1" /> : <XCircle className="w-3 h-3 ml-1" />}
                          {stockTaking.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>جرد جديد</DialogTitle>
              <DialogDescription>ابدأ عملية جرد جديدة للمخزون</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="warehouse">المستودع *</Label>
                <Select value={formData.warehouse} onValueChange={(value) => setFormData({...formData, warehouse: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المستودع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مستودع الرئيسي">مستودع الرئيسي</SelectItem>
                    <SelectItem value="مستودع الفرع 1">مستودع الفرع 1</SelectItem>
                    <SelectItem value="مستودع التوزيع">مستودع التوزيع</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">تاريخ الجرد *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveAdd} className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 ml-2" /> بدء الجرد
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StockTaking;

