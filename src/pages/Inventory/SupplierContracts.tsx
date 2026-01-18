import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format, differenceInDays, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Calendar as CalendarIcon, 
  FileText, 
  Download, 
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  Building,
  DollarSign,
  Timer,
  MoreVertical,
  X,
  FileSignature,
  Shield,
  Target,
  Activity,
  TrendingUp,
  Award,
  Brain
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AIContractManagement from "@/components/Inventory/AIContractManagement";

// Types
interface Contract {
  id: number;
  contractNumber: string;
  supplierId: number | null;
  supplierName: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  contractType: string;
  contractValue: number;
  paymentTerms: string;
  description: string;
  mainTerms: string;
  contractDocument: string;
  status: string;
  nextRenewalDate?: Date;
  responsibleEmployee: string;
  notes: string;
  createdAt: Date;
  renewalHistory: ContractAction[];
}

interface ContractAction {
  id: string;
  contractId: string;
  actionType: string;
  actionDate: Date;
  description: string;
  performedBy: string;
}

// Backend integration
interface BackendContract {
  contract_id: number;
  contract_number: string;
  supplier_id?: number | null;
  supplier_name?: string | null;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  contract_type?: string | null;
  contract_value?: number | string | null;
  payment_terms?: string | null;
  description?: string | null;
  main_terms?: string | null;
  contract_document?: string | null;
  status: string;
  responsible_employee?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Supplier interface for the dropdown
interface Supplier {
  supplier_id: number;
  name_ar: string;
  name_en: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  tax_number?: string;
  website?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const SupplierContracts = () => {
  const { toast } = useToast();

  // API configuration
  const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || "https://metagym.metacodecx.com";

  // Helper functions
  const mapBackendToUi = (b: BackendContract): Contract => {
    const start = new Date(b.start_date);
    const end = new Date(b.end_date);
    const duration = Math.max(1, Math.round(differenceInDays(end, start) / 30));
    return {
      id: b.contract_id,
      contractNumber: b.contract_number,
      supplierId: b.supplier_id ?? null,
      supplierName: b.supplier_name ?? "",
      startDate: start,
      endDate: end,
      duration,
      contractType: b.contract_type ?? "",
      contractValue: typeof b.contract_value === "string" ? parseFloat(b.contract_value) : (b.contract_value ?? 0),
      paymentTerms: b.payment_terms ?? "",
      description: b.description ?? "",
      mainTerms: b.main_terms ?? "",
      contractDocument: b.contract_document ?? "",
      status: b.status,
      responsibleEmployee: b.responsible_employee ?? "",
      notes: b.notes ?? "",
      createdAt: b.created_at ? new Date(b.created_at) : new Date(),
      renewalHistory: [],
    };
  };

  const toDateOnly = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const mapUiToBackend = (c: Partial<Contract>): Partial<BackendContract> => ({
    contract_number: c.contractNumber || `CT-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
    supplier_id: c.supplierId ?? null,
    supplier_name: c.supplierName || "",
    start_date: c.startDate ? toDateOnly(c.startDate) : toDateOnly(new Date()),
    end_date: c.endDate ? toDateOnly(c.endDate) : toDateOnly(addDays(new Date(), 30)),
    contract_type: c.contractType || "",
    contract_value: c.contractValue ?? 0,
    payment_terms: c.paymentTerms || "",
    description: c.description || "",
    main_terms: c.mainTerms || "",
    contract_document: c.contractDocument || "",
    status: c.status || "ساري",
    responsible_employee: c.responsibleEmployee || "",
    notes: c.notes || "",
  });

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);

  // Enhanced state management
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [contractTypeFilter, setContractTypeFilter] = useState("الكل");
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // New contract form
  const [newContract, setNewContract] = useState({
    supplierName: "",
    startDate: new Date(),
    endDate: new Date(),
    contractType: "",
    contractValue: "",
    paymentTerms: "",
    description: "",
    mainTerms: "",
    responsibleEmployee: "",
    notes: "",
    // إضافة الحقول المفقودة
    activity: "",
    commercialRecord: "",
    taxNumber: "",
    mobile: "",
    email: "",
    country: "",
    city: "",
    contactPerson: "",
    address: "",
  });

  // Get contract status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ساري": return "bg-green-100 text-green-800";
      case "منتهي": return "bg-red-100 text-red-800";
      case "موقوف": return "bg-yellow-100 text-yellow-800";
      case "قيد التجديد": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Check if contract is expiring soon
  const isExpiringSoon = (endDate: Date) => {
    const daysUntilExpiry = differenceInDays(endDate, new Date());
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  // Filter contracts
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "الكل" || contract.status === statusFilter;
    const matchesType = contractTypeFilter === "الكل" || contract.contractType === contractTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const fetchSuppliers = async () => {
    try {
      setIsLoadingSuppliers(true);
      const res = await fetch(`${API_BASE_URL}/api/v1/suppliers?limit=1000`);
      if (!res.ok) throw new Error("فشل جلب الموردين");
      const json = await res.json();
      const list: Supplier[] = json?.data?.suppliers || [];
      setSuppliers(list);
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message || "تعذر تحميل الموردين", variant: "destructive" });
    } finally {
      setIsLoadingSuppliers(false);
    }
  };

  const fetchContracts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/v1/supplier-contracts?limit=1000`);
      if (!res.ok) throw new Error("فشل جلب العقود");
      const json = await res.json();
      const list: BackendContract[] = json?.data?.contracts || json?.data?.contracts || json?.data || [];
      setContracts(Array.isArray(list) ? list.map(mapBackendToUi) : []);
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message || "تعذر تحميل العقود", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
    fetchSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Enhanced functions for contract management
  const editContract = (contract: Contract) => {
    setSelectedContract(contract);
    setNewContract({
      supplierName: contract.supplierName,
      startDate: contract.startDate,
      endDate: contract.endDate,
      contractType: contract.contractType,
      contractValue: contract.contractValue.toString(),
      paymentTerms: contract.paymentTerms,
      description: contract.description,
      mainTerms: contract.mainTerms,
      responsibleEmployee: contract.responsibleEmployee,
      notes: contract.notes,
    });
    setShowEditForm(true);
  };

  const viewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setShowViewDialog(true);
  };

  const deleteContract = async (contractId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/supplier-contracts/${contractId}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error("فشل حذف العقد");
    setContracts(prev => prev.filter(contract => contract.id !== contractId));
      toast({ title: "تم حذف العقد بنجاح", description: "تم حذف العقد من النظام" });
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message || "تعذر حذف العقد", variant: "destructive" });
    }
  };

  const updateContract = async () => {
    if (!selectedContract || !newContract.supplierName || !newContract.contractType) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إكمال الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    try {
      const payload = mapUiToBackend({
      ...selectedContract,
      supplierName: newContract.supplierName,
      startDate: newContract.startDate,
      endDate: newContract.endDate,
      contractType: newContract.contractType,
      contractValue: parseFloat(newContract.contractValue) || 0,
      paymentTerms: newContract.paymentTerms,
      description: newContract.description,
      mainTerms: newContract.mainTerms,
      responsibleEmployee: newContract.responsibleEmployee,
        notes: newContract.notes,
      });
      const res = await fetch(`${API_BASE_URL}/api/v1/supplier-contracts/${selectedContract.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.message || "فشل تحديث العقد");
      }
      const json = await res.json();
      const updated: BackendContract = json?.data?.contract;
      setContracts(prev => prev.map(c => c.id === selectedContract.id ? mapBackendToUi(updated) : c));
    setShowEditForm(false);
    setSelectedContract(null);
    resetForm();
      toast({ title: "تم تحديث العقد بنجاح", description: `تم تحديث بيانات العقد: ${updated.contract_number}` });
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message || "تعذر تحديث العقد", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setNewContract({
      supplierName: "",
      startDate: new Date(),
      endDate: new Date(),
      contractType: "",
      contractValue: "",
      paymentTerms: "",
      description: "",
      mainTerms: "",
      responsibleEmployee: "",
      notes: "",
    });
  };

  // Add new contract
  const addContract = async () => {
    if (!newContract.supplierName || !newContract.contractType) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إكمال الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    try {
      const contractNumber = `CT-${new Date().getFullYear()}-${String(contracts.length + 1).padStart(3, '0')}`;
      const selectedSupplier = suppliers.find(s => s.name_ar === newContract.supplierName || s.name_en === newContract.supplierName);
      const payload = mapUiToBackend({
        contractNumber,
        supplierId: selectedSupplier?.supplier_id || null,
      supplierName: newContract.supplierName,
      startDate: newContract.startDate,
      endDate: newContract.endDate,
      contractType: newContract.contractType,
      contractValue: parseFloat(newContract.contractValue) || 0,
      paymentTerms: newContract.paymentTerms,
      description: newContract.description,
      mainTerms: newContract.mainTerms,
      responsibleEmployee: newContract.responsibleEmployee,
      notes: newContract.notes,
        status: "ساري",
      });
      const res = await fetch(`${API_BASE_URL}/api/v1/supplier-contracts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.message || "فشل إنشاء العقد");
      }
      const json = await res.json();
      const created: BackendContract = json?.data?.contract;
      setContracts(prev => [...prev, mapBackendToUi(created)]);
    setIsAddDialogOpen(false);
    resetForm();
      toast({ title: "تم إضافة العقد بنجاح", description: `رقم العقد: ${created.contract_number}` });
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message || "تعذر إضافة العقد", variant: "destructive" });
    }
  };

  // Renew contract
  const renewContract = async (contractId: number) => {
    try {
      const target = contracts.find(c => c.id === contractId);
      if (!target) return;
      const payload = { status: "قيد التجديد" } as any;
      const res = await fetch(`${API_BASE_URL}/api/v1/supplier-contracts/${contractId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("فشل بدء إجراءات التجديد");
      const json = await res.json();
      const updated: BackendContract = json?.data?.contract;
      setContracts(prev => prev.map(c => (c.id === contractId ? mapBackendToUi(updated) : c)));
      toast({ title: "تم بدء إجراءات التجديد", description: "سيتم إشعارك عند اكتمال التجديد" });
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message || "تعذر بدء إجراءات التجديد", variant: "destructive" });
    }
  };

  // Terminate contract
  const terminateContract = async (contractId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/supplier-contracts/${contractId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "منتهي" }),
      });
      if (!res.ok) throw new Error("فشل إنهاء العقد");
      const json = await res.json();
      const updated: BackendContract = json?.data?.contract;
      setContracts(prev => prev.map(c => (c.id === contractId ? mapBackendToUi(updated) : c)));
      toast({ title: "تم إنهاء العقد", description: "تم تسجيل إنهاء العقد في النظام" });
    } catch (e: any) {
      toast({ title: "خطأ", description: e.message || "تعذر إنهاء العقد", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="space-y-8 p-6">
        {/* Enhanced Header with Modern Design */}
        <div className="relative overflow-hidden bg-gradient-to-r from-white/95 via-blue-50/80 to-purple-50/70 p-8 rounded-3xl border border-white/60 shadow-2xl backdrop-blur-md">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 via-purple-200/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/20 via-pink-200/10 to-transparent rounded-full blur-xl"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <FileSignature className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
                  عقود الموردين
                </h1>
                <p className="text-lg text-gray-600 font-medium">
                  إدارة متقدمة وشاملة لجميع العقود والاتفاقيات مع الموردين
                </p>
              </div>
            </div>
            
            {/* Enhanced Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 bg-white/80 backdrop-blur-sm border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
              >
                <Download className="w-5 h-5 text-blue-600" />
                تصدير قائمة
              </Button>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg"
                      className="relative gap-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
                    >
                      <div className="relative">
                        <Plus className="w-6 h-6" />
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                      </div>
                      <span className="text-lg">إضافة عقد جديد</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">إضافة عقد جديد</DialogTitle>
                      <DialogDescription className="text-lg">إدخال بيانات العقد الجديد مع المورد</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>اسم المورد *</Label>
                          <Select 
                            value={newContract.supplierName}
                            onValueChange={(value) => setNewContract(prev => ({ ...prev, supplierName: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر المورد" />
                            </SelectTrigger>
                            <SelectContent>
                              {suppliers.map((supplier) => (
                                <SelectItem key={supplier.supplier_id} value={supplier.name_ar || supplier.name_en || supplier.supplier_id?.toString() || `supplier-${supplier.supplier_id || Math.random()}`}>
                                  {supplier.name_ar || supplier.name_en || `مورد ${supplier.supplier_id}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>نوع العقد *</Label>
                          <Select value={newContract.contractType} onValueChange={(value) => setNewContract(prev => ({ ...prev, contractType: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر نوع العقد" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="توريد مواد كيميائية">توريد مواد كيميائية</SelectItem>
                              <SelectItem value="توريد مشروب ومنتجات">توريد مشروب ومنتجات</SelectItem>
                              <SelectItem value="توريد زيوت ومواد تشحيم">توريد زيوت ومواد تشحيم</SelectItem>
                              <SelectItem value="صيانة دورية">صيانة دورية</SelectItem>
                              <SelectItem value="خدمات استشارية">خدمات استشارية</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>تاريخ بدء العقد</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {format(newContract.startDate, "yyyy-MM-dd")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={newContract.startDate}
                                onSelect={(date) => date && setNewContract(prev => ({ ...prev, startDate: date }))}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label>تاريخ نهاية العقد</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {format(newContract.endDate, "yyyy-MM-dd")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={newContract.endDate}
                                onSelect={(date) => date && setNewContract(prev => ({ ...prev, endDate: date }))}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label>قيمة العقد (جنيه)</Label>
                          <Input
                            type="number"
                            value={newContract.contractValue}
                            onChange={(e) => setNewContract(prev => ({ ...prev, contractValue: e.target.value }))}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label>شروط الدفع</Label>
                          <Select value={newContract.paymentTerms} onValueChange={(value) => setNewContract(prev => ({ ...prev, paymentTerms: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر شروط الدفع" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="عند التسليم">عند التسليم</SelectItem>
                              <SelectItem value="30 يوم من تاريخ الايصال">30 يوم من تاريخ الايصال</SelectItem>
                              <SelectItem value="دفعات شهرية">دفعات شهرية</SelectItem>
                              <SelectItem value="دفع مقدم">دفع مقدم</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>المسؤول عن العقد</Label>
                          <Input
                            value={newContract.responsibleEmployee}
                            onChange={(e) => setNewContract(prev => ({ ...prev, responsibleEmployee: e.target.value }))}
                            placeholder="اسم الموظف المسؤول"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>وصف موجز للعقد</Label>
                        <Textarea
                          value={newContract.description}
                          onChange={(e) => setNewContract(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="ملخص مختصر لشروط وأهداف العقد"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label>البنود الأساسية</Label>
                        <Textarea
                          value={newContract.mainTerms}
                          onChange={(e) => setNewContract(prev => ({ ...prev, mainTerms: e.target.value }))}
                          placeholder="البنود والشروط الأساسية للعقد"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>ملاحظات إضافية</Label>
                        <Textarea
                          value={newContract.notes}
                          onChange={(e) => setNewContract(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="أي ملاحظات أو تفاصيل إضافية"
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          إلغاء
                        </Button>
                        <Button onClick={addContract}>
                          حفظ العقد
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-white/90 to-green-50/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">العقود السارية</p>
                  <p className="text-3xl font-bold text-green-700 group-hover:scale-105 transition-transform duration-300">{contracts.filter(c => c.status === "ساري").length}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium">عقد نشط حالياً</div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden bg-gradient-to-br from-white/90 to-red-50/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">العقود المنتهية</p>
                  <p className="text-3xl font-bold text-red-700 group-hover:scale-105 transition-transform duration-300">{contracts.filter(c => c.status === "منتهي").length}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium">عقد منتهي الصلاحية</div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white/90 to-yellow-50/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">تنبيهات التجديد</p>
                  <p className="text-3xl font-bold text-yellow-700 group-hover:scale-105 transition-transform duration-300">{contracts.filter(c => isExpiringSoon(c.endDate) && c.status === "ساري").length}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium">عقد يحتاج تجديد</div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white/90 to-purple-50/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">إجمالي القيمة</p>
                  <p className="text-3xl font-bold text-purple-700 group-hover:scale-105 transition-transform duration-300">{contracts.reduce((acc, c) => acc + c.contractValue, 0).toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-sm text-gray-600 font-medium">جنيه مصري إجمالي العقود</div>
            </CardContent>
          </Card>
        </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-5 p-1 bg-gradient-to-r from-white/90 to-blue-50/80 border shadow-2xl rounded-2xl">
          <TabsTrigger 
            value="active" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl"
          >
            <CheckCircle className="w-4 h-4" />
            العقود السارية
          </TabsTrigger>
          <TabsTrigger 
            value="ai-analysis" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl"
          >
            <Brain className="w-4 h-4" />
            التحليل الذكي
          </TabsTrigger>
          <TabsTrigger 
            value="expired" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl"
          >
            <Clock className="w-4 h-4" />
            العقود المنتهية
          </TabsTrigger>
          <TabsTrigger 
            value="alerts" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl"
          >
            <AlertTriangle className="w-4 h-4" />
            تنبيهات التجديد
          </TabsTrigger>
          <TabsTrigger 
            value="all" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl"
          >
            <FileText className="w-4 h-4" />
            جميع العقود
          </TabsTrigger>
        </TabsList>

        {/* العقود السارية */}
        <TabsContent value="active">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  العقود السارية
                </div>
                <Badge variant="secondary">
                  {contracts.filter(c => c.status === "ساري").length} عقد
                </Badge>
              </CardTitle>
              <CardDescription>قائمة العقود الجارية والنشطة</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="البحث برقم العقد أو اسم المورد..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={contractTypeFilter} onValueChange={setContractTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="نوع العقد" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="الكل">جميع الأنواع</SelectItem>
                    <SelectItem value="توريد مواد كيميائية">مواد كيميائية</SelectItem>
                    <SelectItem value="توريد مشروب ومنتجات">مشروب ومنتجات</SelectItem>
                    <SelectItem value="توريد زيوت ومواد تشحيم">زيوت ومواد تشحيم</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredContracts
                  .filter(contract => contract.status === "ساري")
                  .map((contract) => (
                    <div key={contract.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{contract.contractNumber}</h3>
                            <Badge className={getStatusColor(contract.status)}>
                              {contract.status}
                            </Badge>
                            {isExpiringSoon(contract.endDate) && (
                              <Badge variant="destructive" className="gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                ينتهي قريباً
                              </Badge>
                            )}
                          </div>
                          <p className="text-lg font-medium">{contract.supplierName}</p>
                          <p className="text-sm text-muted-foreground">{contract.contractType}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              {format(contract.startDate, "yyyy-MM-dd")} - {format(contract.endDate, "yyyy-MM-dd")}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {contract.contractValue.toLocaleString()} جنيه
                            </span>
                            <span className="flex items-center gap-1">
                              <Timer className="w-4 h-4" />
                              {contract.duration} شهر
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl shadow-2xl border-0 bg-white/95 backdrop-blur-md">
                              <DropdownMenuItem onClick={() => viewContract(contract)} className="hover:bg-blue-50">
                                <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                عرض التفاصيل
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => editContract(contract)} className="hover:bg-green-50">
                                <Edit className="mr-2 h-4 w-4 text-green-600" />
                                تعديل العقد
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => renewContract(contract.id)} className="hover:bg-purple-50">
                                <RefreshCw className="mr-2 h-4 w-4 text-purple-600" />
                                تجديد العقد
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-orange-50">
                                <Upload className="mr-2 h-4 w-4 text-orange-600" />
                                رفع مستند
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteContract(contract.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                حذف العقد
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* التحليل الذكي للعقود */}
        <TabsContent value="ai-analysis">
          <AIContractManagement />
        </TabsContent>

        {/* العقود المنتهية */}
        <TabsContent value="expired">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-red-600" />
                  العقود المنتهية
                </div>
                <Badge variant="destructive">
                  {contracts.filter(c => c.status === "منتهي").length} عقد
                </Badge>
              </CardTitle>
              <CardDescription>العقود التي انتهت صلاحيتها</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts
                  .filter(contract => contract.status === "منتهي")
                  .map((contract) => (
                    <div key={contract.id} className="p-4 border rounded-lg bg-red-50 border-red-200">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{contract.contractNumber}</h3>
                            <Badge className={getStatusColor(contract.status)}>
                              {contract.status}
                            </Badge>
                          </div>
                          <p className="text-lg font-medium">{contract.supplierName}</p>
                          <p className="text-sm text-muted-foreground">{contract.contractType}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>انتهى في: {format(contract.endDate, "yyyy-MM-dd")}</span>
                            <span>القيمة: {contract.contractValue.toLocaleString()} جنيه</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => renewContract(contract.id)}
                            className="gap-1"
                          >
                            <RefreshCw className="w-4 h-4" />
                            إعادة التجديد
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedContract(contract)}
                            className="gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            تفاصيل
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تنبيهات التجديد */}
        <TabsContent value="alerts">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  تنبيهات التجديد
                </div>
                <Badge variant="outline">
                  {contracts.filter(c => isExpiringSoon(c.endDate) && c.status === "ساري").length} تنبيه
                </Badge>
              </CardTitle>
              <CardDescription>العقود التي تحتاج إلى تجديد خلال 30 يوم</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts
                  .filter(contract => isExpiringSoon(contract.endDate) && contract.status === "ساري")
                  .map((contract) => {
                    const daysLeft = differenceInDays(contract.endDate, new Date());
                    return (
                      <div key={contract.id} className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold">{contract.contractNumber}</h3>
                              <Badge variant="destructive" className="gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                {daysLeft} يوم متبقي
                              </Badge>
                            </div>
                            <p className="text-lg font-medium">{contract.supplierName}</p>
                            <p className="text-sm text-muted-foreground">{contract.contractType}</p>
                            <div className="text-sm text-muted-foreground">
                              ينتهي في: <span className="font-medium text-red-600">{format(contract.endDate, "yyyy-MM-dd")}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => renewContract(contract.id)}
                              className="gap-1"
                            >
                              <RefreshCw className="w-4 h-4" />
                              بدء التجديد
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedContract(contract)}
                              className="gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              تفاصيل
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {contracts.filter(contract => isExpiringSoon(contract.endDate) && contract.status === "ساري").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد عقود تحتاج إلى تجديد في الوقت الحالي</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* جميع العقود */}
        <TabsContent value="all">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  جميع العقود
                </div>
                <Badge variant="secondary">
                  {contracts.length} عقد إجمالي
                </Badge>
              </CardTitle>
              <CardDescription>قائمة شاملة بجميع العقود</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="البحث برقم العقد أو اسم المورد..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="الكل">جميع الحالات</SelectItem>
                    <SelectItem value="ساري">ساري</SelectItem>
                    <SelectItem value="منتهي">منتهي</SelectItem>
                    <SelectItem value="موقوف">موقوف</SelectItem>
                    <SelectItem value="قيد التجديد">قيد التجديد</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={contractTypeFilter} onValueChange={setContractTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="نوع العقد" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="الكل">جميع الأنواع</SelectItem>
                    <SelectItem value="توريد مواد كيميائية">مواد كيميائية</SelectItem>
                    <SelectItem value="توريد مشروب ومنتجات">مشروب ومنتجات</SelectItem>
                    <SelectItem value="توريد زيوت ومواد تشحيم">زيوت ومواد تشحيم</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredContracts.map((contract) => (
                  <div key={contract.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{contract.contractNumber}</h3>
                          <Badge className={getStatusColor(contract.status)}>
                            {contract.status}
                          </Badge>
                          {isExpiringSoon(contract.endDate) && contract.status === "ساري" && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              ينتهي قريباً
                            </Badge>
                          )}
                        </div>
                        <p className="text-lg font-medium">{contract.supplierName}</p>
                        <p className="text-sm text-muted-foreground">{contract.contractType}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {format(contract.startDate, "yyyy-MM-dd")} - {format(contract.endDate, "yyyy-MM-dd")}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {contract.contractValue.toLocaleString()} جنيه
                          </span>
                          <span className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {contract.responsibleEmployee}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl shadow-2xl border-0 bg-white/95 backdrop-blur-md">
                            <DropdownMenuItem onClick={() => viewContract(contract)} className="hover:bg-blue-50">
                              <Eye className="mr-2 h-4 w-4 text-blue-600" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editContract(contract)} className="hover:bg-green-50">
                              <Edit className="mr-2 h-4 w-4 text-green-600" />
                              تعديل العقد
                            </DropdownMenuItem>
                            {contract.status === "ساري" && (
                              <DropdownMenuItem onClick={() => renewContract(contract.id)} className="hover:bg-purple-50">
                                <RefreshCw className="mr-2 h-4 w-4 text-purple-600" />
                                تجديد العقد
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="hover:bg-orange-50">
                              <Upload className="mr-2 h-4 w-4 text-orange-600" />
                              رفع مستند
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-gray-50">
                              <Download className="mr-2 h-4 w-4 text-gray-600" />
                              تحميل العقد
                            </DropdownMenuItem>
                            {contract.status === "ساري" && (
                              <DropdownMenuItem 
                                onClick={() => terminateContract(contract.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                إنهاء العقد
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => deleteContract(contract.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              حذف العقد
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Edit Contract Dialog */}
      {showEditForm && selectedContract && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-purple-100/10 to-indigo-100/20 rounded-3xl blur-xl"></div>
            <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 to-blue-50/80 backdrop-blur-md border-0 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
              <CardHeader className="bg-gradient-to-r from-blue-50/80 to-purple-50/60 backdrop-blur-sm p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-md opacity-30 animate-pulse"></div>
                      <div className="relative p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                        <Edit className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                        تعديل العقد
                      </CardTitle>
                      <CardDescription className="text-lg text-gray-600 font-medium mt-2">
                        تحديث بيانات العقد: {selectedContract.contractNumber}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setShowEditForm(false)}
                    className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>اسم المورد *</Label>
                      <Select 
                        value={newContract.supplierName}
                        onValueChange={(value) => setNewContract(prev => ({ ...prev, supplierName: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المورد" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.supplier_id} value={supplier.name_ar || supplier.name_en || supplier.supplier_id?.toString() || `supplier-${supplier.supplier_id || Math.random()}`}>
                              {supplier.name_ar || supplier.name_en || `مورد ${supplier.supplier_id}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>نوع العقد *</Label>
                      <Select value={newContract.contractType} onValueChange={(value) => setNewContract(prev => ({ ...prev, contractType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع العقد" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="توريد مواد كيميائية">توريد مواد كيميائية</SelectItem>
                          <SelectItem value="توريد مشروب ومنتجات">توريد مشروب ومنتجات</SelectItem>
                          <SelectItem value="توريد زيوت ومواد تشحيم">توريد زيوت ومواد تشحيم</SelectItem>
                          <SelectItem value="صيانة دورية">صيانة دورية</SelectItem>
                          <SelectItem value="خدمات استشارية">خدمات استشارية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>قيمة العقد (جنيه)</Label>
                      <Input
                        type="number"
                        value={newContract.contractValue}
                        onChange={(e) => setNewContract(prev => ({ ...prev, contractValue: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label>المسؤول عن العقد</Label>
                      <Input
                        value={newContract.responsibleEmployee}
                        onChange={(e) => setNewContract(prev => ({ ...prev, responsibleEmployee: e.target.value }))}
                        placeholder="اسم الموظف المسؤول"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
                    <Button 
                      onClick={updateContract}
                      size="lg"
                      className="flex-1 gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <CheckCircle className="w-5 h-5" />
                      تحديث العقد
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowEditForm(false)}
                      size="lg"
                      className="flex-1 gap-3 border-2 border-gray-300 hover:bg-gray-50 font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                      إلغاء
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Enhanced View Contract Dialog */}
      {showViewDialog && selectedContract && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-5xl w-full max-h-[95vh] overflow-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 via-blue-100/10 to-purple-100/20 rounded-3xl blur-xl"></div>
            <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 to-green-50/80 backdrop-blur-md border-0 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
              <CardHeader className="bg-gradient-to-r from-green-50/80 to-blue-50/60 backdrop-blur-sm p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500 rounded-2xl blur-md opacity-30 animate-pulse"></div>
                      <div className="relative p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl shadow-lg">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-700 to-blue-700 bg-clip-text text-transparent">
                        تفاصيل العقد - {selectedContract.contractNumber}
                      </CardTitle>
                      <CardDescription className="text-lg text-gray-600 font-medium mt-2">
                        معلومات شاملة ومفصلة عن العقد
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setShowViewDialog(false)}
                    className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">رقم العقد</Label>
                      <p className="text-lg font-medium bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-100">{selectedContract.contractNumber}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">اسم المورد</Label>
                      <p className="text-lg font-medium bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-100">{selectedContract.supplierName}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">نوع العقد</Label>
                      <p className="text-lg font-medium bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-lg border border-orange-100">{selectedContract.contractType}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">حالة العقد</Label>
                      <Badge className={`${getStatusColor(selectedContract.status)} text-lg py-2 px-4`}>
                        {selectedContract.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">قيمة العقد</Label>
                      <p className="text-lg font-medium text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">{selectedContract.contractValue.toLocaleString()} جنيه</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-600">مدة العقد</Label>
                      <p className="text-lg font-medium bg-purple-50 p-3 rounded-lg border border-purple-100">{selectedContract.duration} شهر</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-600">وصف العقد</Label>
                    <p className="text-lg font-medium bg-gray-50 p-4 rounded-lg border border-gray-100">{selectedContract.description}</p>
                  </div>

                  <div className="flex gap-4 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
                    <Button 
                      onClick={() => editContract(selectedContract)}
                      size="lg"
                      className="flex-1 gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <Edit className="w-5 h-5" />
                      تعديل العقد
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="flex-1 gap-3 border-2 border-green-300 hover:bg-green-50 font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <Download className="w-5 h-5" />
                      تحميل العقد
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowViewDialog(false)}
                      size="lg"
                      className="flex-1 gap-3 border-2 border-gray-300 hover:bg-gray-50 font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                      إغلاق
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Enhanced Add Supplier Form with Modern Design */}
      {showAddForm && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 via-emerald-100/10 to-teal-100/20 rounded-3xl blur-xl"></div>
          <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 to-green-50/80 backdrop-blur-md border-0 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
            <CardHeader className="bg-gradient-to-r from-green-50/80 to-emerald-50/60 backdrop-blur-sm p-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 rounded-2xl blur-md opacity-30 animate-pulse"></div>
                  <div className="relative p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                    إضافة عقد جديد
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 font-medium mt-2">
                    تسجيل بيانات عقد جديد في النظام بطريقة احترافية ومتقدمة
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="supplierName">اسم المورد *</Label>
                  <Select 
                    value={newContract.supplierName} 
                    onValueChange={(value) => setNewContract(prev => ({ ...prev, supplierName: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المورد" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.supplier_id} value={supplier.name_ar || supplier.name_en}>
                          {supplier.name_ar || supplier.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="activity">النشاط التجاري</Label>
                  <Input
                    id="activity"
                    value={newContract.activity || ""}
                    onChange={(e) => setNewContract(prev => ({ ...prev, activity: e.target.value }))}
                    placeholder="نوع النشاط التجاري"
                  />
                </div>

                <div>
                  <Label htmlFor="commercialRecord">السجل التجاري *</Label>
                  <Input
                    id="commercialRecord"
                    value={newContract.commercialRecord || ""}
                    onChange={(e) => setNewContract(prev => ({ ...prev, commercialRecord: e.target.value }))}
                    placeholder="رقم السجل التجاري"
                  />
                </div>

                <div>
                  <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                  <Input
                    id="taxNumber"
                    value={newContract.taxNumber || ""}
                    onChange={(e) => setNewContract(prev => ({ ...prev, taxNumber: e.target.value }))}
                    placeholder="الرقم الضريبي"
                  />
                </div>

                <div>
                  <Label htmlFor="mobile">رقم الجوال *</Label>
                  <Input
                    id="mobile"
                    value={newContract.mobile || ""}
                    onChange={(e) => setNewContract(prev => ({ ...prev, mobile: e.target.value }))}
                    placeholder="05xxxxxxxx"
                  />
                </div>

                <div>
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContract.email || ""}
                    onChange={(e) => setNewContract(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="country">الدولة</Label>
                  <Input
                    id="country"
                    value={newContract.country || ""}
                    onChange={(e) => setNewContract(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="المصرية"
                  />
                </div>

                <div>
                  <Label htmlFor="city">المدينة</Label>
                  <Input
                    id="city"
                    value={newContract.city || ""}
                    onChange={(e) => setNewContract(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="الرياض"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPerson">الشخص المسؤول</Label>
                  <Input
                    id="contactPerson"
                    value={newContract.contactPerson || ""}
                    onChange={(e) => setNewContract(prev => ({ ...prev, contactPerson: e.target.value }))}
                    placeholder="اسم الشخص المسؤول"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                  <Label htmlFor="address">العنوان</Label>
                  <Textarea
                    id="address"
                    value={newContract.address || ""}
                    onChange={(e) => setNewContract(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="العنوان التفصيلي"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
                <Button 
                  onClick={addContract}
                  size="lg"
                  className="flex-1 gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <CheckCircle className="w-5 h-5" />
                  حفظ العقد
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                  size="lg"
                  className="flex-1 gap-3 border-2 border-gray-300 hover:bg-gray-50 font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
};

export default SupplierContracts;