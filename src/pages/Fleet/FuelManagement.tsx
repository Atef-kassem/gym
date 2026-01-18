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
  Fuel, Plus, Search, Save, DollarSign, Truck, TrendingUp
} from "lucide-react";

const FuelManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fuelRecords, setFuelRecords] = useState([
    {
      id: 1,
      plateNumber: "أ ب ج 1234",
      date: "2024-01-25",
      fuelType: "بنزين",
      quantity: 50,
      price: 3500,
      driver: "أحمد محمد",
      station: "محطة بنزين أ"
    },
    {
      id: 2,
      plateNumber: "د هـ و 5678",
      date: "2024-01-25",
      fuelType: "ديزل",
      quantity: 80,
      price: 4800,
      driver: "فاطمة علي",
      station: "محطة ديزل ب"
    },
    {
      id: 3,
      plateNumber: "ز ح ط 9012",
      date: "2024-01-24",
      fuelType: "ديزل",
      quantity: 60,
      price: 3600,
      driver: "محمد حسن",
      station: "محطة ديزل ج"
    }
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: "",
    date: "",
    fuelType: "",
    quantity: "",
    price: "",
    driver: "",
    station: ""
  });
  const { toast } = useToast();

  const handleAdd = () => {
    setFormData({
      plateNumber: "",
      date: new Date().toISOString().split('T')[0],
      fuelType: "",
      quantity: "",
      price: "",
      driver: "",
      station: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveAdd = () => {
    if (!formData.plateNumber || !formData.date || !formData.fuelType || !formData.quantity || !formData.price) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const newRecord = {
      id: fuelRecords.length + 1,
      plateNumber: formData.plateNumber,
      date: formData.date,
      fuelType: formData.fuelType,
      quantity: parseFloat(formData.quantity),
      price: parseFloat(formData.price),
      driver: formData.driver || "-",
      station: formData.station || "-"
    };
    
    setFuelRecords([...fuelRecords, newRecord]);
    setIsAddDialogOpen(false);
    toast({
      title: "نجح",
      description: "تم إضافة سجل الوقود بنجاح"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الوقود</h1>
            <p className="text-gray-600 mt-1">تتبع استهلاك وتكاليف الوقود</p>
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
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAdd}>
              <Plus className="w-5 h-5 ml-2" />
              تسجيل وقود
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="w-5 h-5" />
              سجل الوقود
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">رقم اللوحة</th>
                    <th className="text-right py-3 px-4 font-semibold">التاريخ</th>
                    <th className="text-right py-3 px-4 font-semibold">نوع الوقود</th>
                    <th className="text-right py-3 px-4 font-semibold">الكمية (لتر)</th>
                    <th className="text-right py-3 px-4 font-semibold">السعر</th>
                    <th className="text-right py-3 px-4 font-semibold">السائق</th>
                    <th className="text-right py-3 px-4 font-semibold">المحطة</th>
                  </tr>
                </thead>
                <tbody>
                  {fuelRecords.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold font-mono">{record.plateNumber}</td>
                      <td className="py-3 px-4">{record.date}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{record.fuelType}</Badge>
                      </td>
                      <td className="py-3 px-4">{record.quantity} لتر</td>
                      <td className="py-3 px-4 font-bold text-green-600">{record.price.toLocaleString()} ج.م</td>
                      <td className="py-3 px-4">{record.driver}</td>
                      <td className="py-3 px-4">{record.station}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تسجيل وقود جديد</DialogTitle>
              <DialogDescription>أدخل بيانات تسجيل الوقود</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="plateNumber">رقم اللوحة *</Label>
                <Input
                  id="plateNumber"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({...formData, plateNumber: e.target.value})}
                  placeholder="رقم اللوحة"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">التاريخ *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelType">نوع الوقود *</Label>
                  <Select value={formData.fuelType} onValueChange={(value) => setFormData({...formData, fuelType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="بنزين">بنزين</SelectItem>
                      <SelectItem value="ديزل">ديزل</SelectItem>
                      <SelectItem value="كهرباء">كهرباء</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">الكمية (لتر) *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    placeholder="الكمية"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">السعر (ج.م) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="السعر"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driver">السائق</Label>
                  <Input
                    id="driver"
                    value={formData.driver}
                    onChange={(e) => setFormData({...formData, driver: e.target.value})}
                    placeholder="اسم السائق"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="station">المحطة</Label>
                  <Input
                    id="station"
                    value={formData.station}
                    onChange={(e) => setFormData({...formData, station: e.target.value})}
                    placeholder="اسم المحطة"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveAdd} className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="w-4 h-4 ml-2" /> حفظ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FuelManagement;

