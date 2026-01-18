import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Users, 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// بيانات البيع
const bookingsData = [
  {
    id: "BK001",
    customerName: "أحمد محمد",
    customerPhone: "+966501234567",
    branchId: "alolaya",
    branchName: "فرع العليا",
    service: "  كامل + تلميع",
    date: "2024-01-28",
    time: "10:00",
    status: "confirmed",
    price: 250,
    vehicleType: "سيدان",
    plateNumber: "أ ب ج 123",
    notes: "يفضل الخدمة السريعة"
  },
  {
    id: "BK002",
    customerName: "فاطمة علي",
    customerPhone: "+966507654321",
    branchId: "alshifa",
    branchName: "فرع الشفا",
    service: "  خارجي",
    date: "2024-01-28",
    time: "14:30",
    status: "pending",
    price: 80,
    vehicleType: "SUV",
    plateNumber: "ه و ز 456",
    notes: ""
  },
  {
    id: "BK003",
    customerName: "محمد سالم",
    customerPhone: "+966509876543",
    branchId: "alqaseem",
    branchName: "فرع القصيم",
    service: "تنظيف داخلي",
    date: "2024-01-29",
    time: "09:00",
    status: "completed",
    price: 120,
    vehicleType: "هاتشباك",
    plateNumber: "م ن س 789",
    notes: "عميل مميز"
  }
];

const branches = [
  { id: "all", name: "جميع الفروع" },
  { id: "alolaya", name: "فرع العليا" },
  { id: "alshifa", name: "فرع الشفا" },
  { id: "alqaseem", name: "فرع القصيم" }
];

const statusOptions = [
  { value: "all", label: "جميع الحالات" },
  { value: "pending", label: "قيد الانتظار" },
  { value: "confirmed", label: "مؤكد" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" }
];

export function BookingManagement() {
  const { toast } = useToast();
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">مؤكد</Badge>;
      case "pending":
        return <Badge variant="secondary">قيد الانتظار</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">مكتمل</Badge>;
      case "cancelled":
        return <Badge variant="destructive">ملغي</Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  const filteredBookings = bookingsData.filter(booking => {
    const matchesBranch = selectedBranch === "all" || booking.branchId === selectedBranch;
    const matchesStatus = selectedStatus === "all" || booking.status === selectedStatus;
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBranch && matchesStatus && matchesSearch;
  });

  const getBookingStats = () => {
    const total = filteredBookings.length;
    const confirmed = filteredBookings.filter(b => b.status === "confirmed").length;
    const pending = filteredBookings.filter(b => b.status === "pending").length;
    const completed = filteredBookings.filter(b => b.status === "completed").length;
    
    return { total, confirmed, pending, completed };
  };

  const stats = getBookingStats();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-xl border shadow-lg bg-card">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary animate-pulse" />
            إدارة البيع - متعدد الفروع
          </h1>
          <p className="text-muted-foreground">
            إدارة شاملة لحجوزات جميع الفروع
          </p>
        </div>
        <Button className="hover:scale-105 transition-all duration-300">
          <Plus className="h-4 w-4 mr-2" />
          حجز جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي البيع</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مؤكدة</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيد الانتظار</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مكتملة</CardTitle>
            <XCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث بالاسم أو رقم اللوحة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الفرع" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedBranch("all");
              setSelectedStatus("all");
            }}>
              <Filter className="h-4 w-4 mr-2" />
              إعادة تعيين
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة البيع</CardTitle>
          <CardDescription>
            عرض {filteredBookings.length} من {bookingsData.length} حجز
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{booking.customerName}</h3>
                      <p className="text-sm text-muted-foreground">
                        📞 {booking.customerPhone} • 🚗 {booking.plateNumber}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{booking.branchName}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(booking.status)}
                      <Badge variant="outline">{booking.service}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      📅 {booking.date} • 🕒 {booking.time}
                    </div>
                    <div className="font-bold text-lg text-primary mt-1">
                      {booking.price} جنيه مصري
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm">
                    <span className="text-muted-foreground">نوع المركبة: </span>
                    <span className="font-medium">{booking.vehicleType}</span>
                    {booking.notes && (
                      <span className="ml-4">
                        <span className="text-muted-foreground">ملاحظات: </span>
                        <span className="font-medium">{booking.notes}</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      عرض
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      تعديل
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-3 w-3 mr-1" />
                      حذف
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredBookings.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">لا توجد حجوزات</h3>
                <p className="text-muted-foreground">لا توجد حجوزات تطابق المعايير المحددة</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}