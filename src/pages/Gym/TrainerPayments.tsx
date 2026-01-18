import { useState, useMemo } from "react";
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
  DollarSign, Plus, Search, Edit, Trash2, Save,
  Loader2, Users, Percent
} from "lucide-react";
import {
  useGetAllTrainersQuery,
  useGetAllTrainerSalariesQuery,
  useCreateTrainerSalaryMutation,
  useUpdateTrainerSalaryMutation,
  useDeleteTrainerSalaryMutation,
} from "@/services/trainersApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TrainerSalary {
  id: number;
  trainerId: number;
  baseSalary: number;
  classCommissionPercentage: number;
  subscriptionCommissionPercentage: number;
  isActive: boolean;
  effectiveDate: string;
  endDate: string | null;
  notes: string | null;
  trainer?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    specialization: string;
  };
}

const TrainerPayments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<TrainerSalary | null>(null);
  
  const { toast } = useToast();
  
  // Fetch trainers
  const { data: trainersData, isLoading: isLoadingTrainers } = useGetAllTrainersQuery({});
  
  // Fetch salaries
  const { data: salariesData, isLoading: isLoadingSalaries, refetch: refetchSalaries } = useGetAllTrainerSalariesQuery({
    trainerId: selectedTrainerId || undefined,
  });
  
  // Mutations
  const [createSalary, { isLoading: isCreating }] = useCreateTrainerSalaryMutation();
  const [updateSalary, { isLoading: isUpdating }] = useUpdateTrainerSalaryMutation();
  const [deleteSalary, { isLoading: isDeleting }] = useDeleteTrainerSalaryMutation();
  
  // Form state
  const [formData, setFormData] = useState({
    trainerId: "",
    baseSalary: "",
    classCommissionPercentage: "",
    subscriptionCommissionPercentage: "",
    effectiveDate: new Date().toISOString().split('T')[0],
    endDate: "",
    notes: "",
    isActive: true,
  });
  
  // Normalize trainers data
  const trainers = useMemo(() => {
    if (!trainersData) return [];
    if (Array.isArray(trainersData)) return trainersData;
    if (trainersData.data && Array.isArray(trainersData.data)) return trainersData.data;
    if (trainersData.success && trainersData.data && Array.isArray(trainersData.data)) return trainersData.data;
    return [];
  }, [trainersData]);
  
  // Normalize salaries data
  const salaries = useMemo(() => {
    if (!salariesData) return [];
    if (Array.isArray(salariesData)) return salariesData;
    if (salariesData.data && Array.isArray(salariesData.data)) return salariesData.data;
    return [];
  }, [salariesData]);
  
  // Filter salaries by search
  const filteredSalaries = useMemo(() => {
    if (!searchQuery) return salaries;
    const query = searchQuery.toLowerCase();
    return salaries.filter((salary: TrainerSalary) => {
      const trainerName = salary.trainer?.name?.toLowerCase() || "";
      const trainerEmail = salary.trainer?.email?.toLowerCase() || "";
      const trainerPhone = salary.trainer?.phone?.toLowerCase() || "";
      return trainerName.includes(query) || trainerEmail.includes(query) || trainerPhone.includes(query);
    });
  }, [salaries, searchQuery]);
  
  // Open dialog for creating new salary
  const handleOpenDialog = () => {
    setEditingSalary(null);
    setFormData({
      trainerId: "",
      baseSalary: "",
      classCommissionPercentage: "",
      subscriptionCommissionPercentage: "",
      effectiveDate: new Date().toISOString().split('T')[0],
      endDate: "",
      notes: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  };
  
  // Open dialog for editing salary
  const handleEdit = (salary: TrainerSalary) => {
    setEditingSalary(salary);
    setFormData({
      trainerId: salary.trainerId.toString(),
      baseSalary: salary.baseSalary.toString(),
      classCommissionPercentage: salary.classCommissionPercentage.toString(),
      subscriptionCommissionPercentage: salary.subscriptionCommissionPercentage.toString(),
      effectiveDate: salary.effectiveDate ? salary.effectiveDate.split('T')[0] : new Date().toISOString().split('T')[0],
      endDate: salary.endDate ? salary.endDate.split('T')[0] : "",
      notes: salary.notes || "",
      isActive: salary.isActive,
    });
    setIsDialogOpen(true);
  };
  
  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا السجل؟")) return;
    
    try {
      await deleteSalary(id).unwrap();
      toast({
        title: "نجح",
        description: "تم حذف السجل بنجاح",
      });
      refetchSalaries();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "فشل حذف السجل",
        variant: "destructive",
      });
    }
  };
  
  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const salaryData = {
        trainerId: parseInt(formData.trainerId),
        baseSalary: parseFloat(formData.baseSalary),
        classCommissionPercentage: parseFloat(formData.classCommissionPercentage),
        subscriptionCommissionPercentage: parseFloat(formData.subscriptionCommissionPercentage),
        effectiveDate: formData.effectiveDate,
        endDate: formData.endDate || null,
        notes: formData.notes || null,
        isActive: formData.isActive,
      };
      
      if (editingSalary) {
        await updateSalary({ id: editingSalary.id, ...salaryData }).unwrap();
        toast({
          title: "نجح",
          description: "تم تحديث السجل بنجاح",
        });
      } else {
        await createSalary(salaryData).unwrap();
        toast({
          title: "نجح",
          description: "تم إنشاء السجل بنجاح",
        });
      }
      
      setIsDialogOpen(false);
      refetchSalaries();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error?.data?.message || "فشل حفظ السجل",
        variant: "destructive",
      });
    }
  };
  
  // Calculate total earnings (example calculation)
  const calculateTotalEarnings = (salary: TrainerSalary) => {
    // This is a placeholder - you would calculate based on actual classes and subscriptions
    return salary.baseSalary;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">أجور المدربين</h1>
          <p className="text-muted-foreground">إدارة مرتبات المدربين ونسب العمولات</p>
        </div>
        <Button onClick={handleOpenDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة مرتب جديد
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والفلترة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="ابحث عن مدرب..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>فلترة حسب المدرب</Label>
              <Select value={selectedTrainerId || "all"} onValueChange={(value) => setSelectedTrainerId(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع المدربين" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المدربين</SelectItem>
                  {trainers.map((trainer: any) => (
                    <SelectItem key={trainer.id} value={trainer.id.toString()}>
                      {trainer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Salaries Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            قائمة الأجور
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingSalaries ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredSalaries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد سجلات أجور
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم المدرب</TableHead>
                    <TableHead>المرتب الأساسي</TableHead>
                    <TableHead>نسبة الحصص (%)</TableHead>
                    <TableHead>نسبة الاشتراكات (%)</TableHead>
                    <TableHead>تاريخ البدء</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSalaries.map((salary: TrainerSalary) => (
                    <TableRow key={salary.id}>
                      <TableCell className="font-medium">
                        {salary.trainer?.name || "غير محدد"}
                      </TableCell>
                      <TableCell>
                        {salary.baseSalary.toLocaleString()} جنيه
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                          {salary.classCommissionPercentage}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                          {salary.subscriptionCommissionPercentage}%
                        </div>
                      </TableCell>
                      <TableCell>
                        {salary.effectiveDate ? new Date(salary.effectiveDate).toLocaleDateString('ar-SA') : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={salary.isActive ? "default" : "secondary"}>
                          {salary.isActive ? "نشط" : "غير نشط"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(salary)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(salary.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSalary ? "تعديل مرتب المدرب" : "إضافة مرتب جديد"}
            </DialogTitle>
            <DialogDescription>
              {editingSalary ? "قم بتعديل بيانات المرتب" : "أدخل بيانات المرتب الجديد"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="trainerId">المدرب *</Label>
                <Select
                  value={formData.trainerId || undefined}
                  onValueChange={(value) => setFormData({ ...formData, trainerId: value })}
                  required
                  disabled={!!editingSalary}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المدرب" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainers.map((trainer: any) => (
                      <SelectItem key={trainer.id} value={trainer.id.toString()}>
                        {trainer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="baseSalary">المرتب الأساسي (جنيه) *</Label>
                <Input
                  id="baseSalary"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.baseSalary}
                  onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                  required
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="classCommissionPercentage">نسبة العمولة من الحصص (%) *</Label>
                <Input
                  id="classCommissionPercentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.classCommissionPercentage}
                  onChange={(e) => setFormData({ ...formData, classCommissionPercentage: e.target.value })}
                  required
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subscriptionCommissionPercentage">نسبة العمولة من الاشتراكات (%) *</Label>
                <Input
                  id="subscriptionCommissionPercentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.subscriptionCommissionPercentage}
                  onChange={(e) => setFormData({ ...formData, subscriptionCommissionPercentage: e.target.value })}
                  required
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">تاريخ البدء *</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">تاريخ الانتهاء (اختياري)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <textarea
                  id="notes"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="أدخل أي ملاحظات إضافية..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingSalary ? "تحديث" : "إنشاء"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainerPayments;

