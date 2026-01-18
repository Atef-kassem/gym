import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

import { toast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  Search, 
  Filter, 
  Download, 
  Calculator,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  FileCheck,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Settings,
  User,
  Calendar,
  CreditCard,
  Shield,
  PieChart,
  BarChart3,
  Target
} from "lucide-react";

// نماذج البيانات المتقدمة
interface Employee {
  id: string;
  empId: string;
  name: string;
  nameEn: string;
  position: string;
  department: string;
  branch: string;
  nationalId: string;
  iban: string;
  gosiNumber: string;
  basicSalary: number;
  currency: "SAR" | "USD" | "EUR";
  paymentFrequency: "monthly" | "weekly" | "biweekly";
  hireDate: string;
  status: "active" | "inactive" | "terminated";
}

interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: {
    housing: number;
    transportation: number;
    medical: number;
    food: number;
    other: number;
  };
  overtime: {
    hours: number;
    rate: number;
    amount: number;
  };
  bonuses: number;
  deductions: {
    gosi: number;
    absence: number;
    lateness: number;
    loans: number;
    penalties: number;
    other: number;
  };
  netSalary: number;
  grossSalary: number;
  status: "draft" | "approved" | "paid" | "cancelled";
  paymentDate?: string;
  wpsStatus: "pending" | "sent" | "confirmed" | "rejected";
  payslipGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PayrollSettings {
  gosiEmployeeRate: number;
  gosiEmployerRate: number;
  overtimeRate: number;
  weekendOvertimeRate: number;
  holidayOvertimeRate: number;
  maxOvertimeHours: number;
  paymentDay: number;
  wpsSubmissionDay: number;
}

const Payroll = () => {
  const [activeTab, setActiveTab] = useState("current");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("2024-01");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [showPayslip, setShowPayslip] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);

  // إعدادات الرواتب
  const payrollSettings: PayrollSettings = {
    gosiEmployeeRate: 0.10,
    gosiEmployerRate: 0.12,
    overtimeRate: 1.5,
    weekendOvertimeRate: 2.0,
    holidayOvertimeRate: 2.5,
    maxOvertimeHours: 20,
    paymentDay: 27,
    wpsSubmissionDay: 25,
  };

  // بيانات الموظفين
  const initialEmployees: Employee[] = [
    {
      id: "1",
      empId: "EMP001",
      name: "أحمد محمد العتيبي",
      nameEn: "Ahmed Mohammed Al-Otaibi",
      position: "فني صيانة",
      department: "الصيانة",
      branch: "الرياض الرئيسي",
      nationalId: "1234567890",
      iban: "SA0380000000608010167519",
      gosiNumber: "123456789",
      basicSalary: 8000,
      currency: "SAR",
      paymentFrequency: "monthly",
      hireDate: "2022-01-15",
      status: "active"
    },
    {
      id: "2",
      empId: "EMP002",
      name: "فاطمة علي الأحمدي",
      nameEn: "Fatima Ali Al-Ahmadi",
      position: "مستقبل عملاء",
      department: "خدمة العملاء",
      branch: "الرياض الرئيسي",
      nationalId: "1234567891",
      iban: "SA0380000000608010167520",
      gosiNumber: "123456010",
      basicSalary: 6000,
      currency: "SAR",
      paymentFrequency: "monthly",
      hireDate: "2022-03-01",
      status: "active"
    },
    {
      id: "3",
      empId: "EMP003",
      name: "محمد سعد القحطاني",
      nameEn: "Mohammed Saad Al-Qahtani",
      position: "محاسب",
      department: "المحاسبة",
      branch: "الرياض الرئيسي",
      nationalId: "1234567892",
      iban: "SA0380000000608010167521",
      gosiNumber: "123456791",
      basicSalary: 12000,
      currency: "SAR",
      paymentFrequency: "monthly",
      hireDate: "2021-08-15",
      status: "active"
    },
    {
      id: "4",
      empId: "EMP004",
      name: "نورة خالد المطيري",
      nameEn: "Noura Khalid Al-Mutairi",
      position: "مدير فرع",
      department: "الإدارة",
      branch: "جدة",
      nationalId: "1234567893",
      iban: "SA0380000000608010167522",
      gosiNumber: "123456792",
      basicSalary: 15000,
      currency: "SAR",
      paymentFrequency: "monthly",
      hireDate: "2020-05-20",
      status: "active"
    }
  ];

  // سجلات الرواتب الأولية
  const initialPayrollRecords: PayrollRecord[] = [
    {
      id: "1",
      employeeId: "1",
      month: "01",
      year: 2024,
      basicSalary: 8000,
      allowances: {
        housing: 1500,
        transportation: 300,
        medical: 200,
        food: 0,
        other: 0
      },
      overtime: {
        hours: 10,
        rate: 1.5,
        amount: 500
      },
      bonuses: 0,
      deductions: {
        gosi: 800,
        absence: 0,
        lateness: 0,
        loans: 0,
        penalties: 0,
        other: 0
      },
      netSalary: 9700,
      grossSalary: 10500,
      status: "approved",
      wpsStatus: "confirmed",
      payslipGenerated: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      employeeId: "2",
      month: "01",
      year: 2024,
      basicSalary: 6000,
      allowances: {
        housing: 1200,
        transportation: 300,
        medical: 0,
        food: 0,
        other: 0
      },
      overtime: {
        hours: 0,
        rate: 1.5,
        amount: 0
      },
      bonuses: 0,
      deductions: {
        gosi: 600,
        absence: 0,
        lateness: 0,
        loans: 0,
        penalties: 0,
        other: 0
      },
      netSalary: 6900,
      grossSalary: 7500,
      status: "draft",
      wpsStatus: "pending",
      payslipGenerated: false,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    }
  ];

  // ملفات WPS الأولية
  const initialWpsFiles = [
    {
      id: "1",
      month: "يناير 2024",
      totalEmployees: 4,
      totalAmount: "85,000",
      status: "مرسل",
      date: "2024-01-31",
      bankResponse: "تم القبول",
      submissionTime: "14:30"
    },
    {
      id: "2",
      month: "ديسمبر 2023",
      totalEmployees: 4,
      totalAmount: "82,000",
      status: "مكتمل",
      date: "2023-12-31",
      bankResponse: "تم التحويل",
      submissionTime: "13:45"
    }
  ];

  // State للبيانات القابلة للتعديل
  const [payrollData, setPayrollData] = useState<PayrollRecord[]>(initialPayrollRecords);
  const [employeesData, setEmployeesData] = useState<Employee[]>(initialEmployees);
  const [wpsFilesData, setWpsFilesData] = useState(initialWpsFiles);

  // حساب الراتب الآلي
  const calculatePayroll = (employee: Employee, overtimeHours: number = 0): PayrollRecord => {
    const basicSalary = employee.basicSalary;
    const allowances = {
      housing: basicSalary * 0.25,
      transportation: 300,
      medical: employee.position.includes("مدير") ? 500 : 200,
      food: 0,
      other: 0
    };
    
    const totalAllowances = Object.values(allowances).reduce((sum, val) => sum + val, 0);
    const hourlyRate = basicSalary / (30 * 8);
    const overtimeAmount = overtimeHours * hourlyRate * payrollSettings.overtimeRate;
    const grossSalary = basicSalary + totalAllowances + overtimeAmount;
    const gosiDeduction = grossSalary * payrollSettings.gosiEmployeeRate;
    
    const deductions = {
      gosi: gosiDeduction,
      absence: 0,
      lateness: 0,
      loans: 0,
      penalties: 0,
      other: 0
    };
    
    const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + val, 0);
    const netSalary = grossSalary - totalDeductions;
    
    return {
      id: Date.now().toString(),
      employeeId: employee.id,
      month: new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`,
      year: new Date().getFullYear(),
      basicSalary,
      allowances,
      overtime: {
        hours: overtimeHours,
        rate: payrollSettings.overtimeRate,
        amount: overtimeAmount
      },
      bonuses: 0,
      deductions,
      netSalary,
      grossSalary,
      status: "draft",
      wpsStatus: "pending",
      payslipGenerated: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  // معالجة البيانات المفلترة
  const filteredPayrollData = useMemo(() => {
    return payrollData.filter(record => {
      const employee = employeesData.find(emp => emp.id === record.employeeId);
      if (!employee) return false;
      
      const matchesSearch = searchTerm === "" || 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment;
      const matchesMonth = `${record.year}-${record.month.padStart(2, '0')}` === selectedMonth;
      
      return matchesSearch && matchesDepartment && matchesMonth;
    });
  }, [searchTerm, selectedDepartment, selectedMonth, payrollData, employeesData]);

  // بيانات الموظف والراتب المحدد
  const selectedEmployeeData = useMemo(() => {
    return selectedEmployee ? employeesData.find(emp => emp.id === selectedEmployee) : null;
  }, [selectedEmployee, employeesData]);

  const selectedEmployeePayroll = useMemo(() => {
    return selectedEmployee ? payrollData.find(record => record.employeeId === selectedEmployee) : null;
  }, [selectedEmployee, payrollData]);

  // معالجة الأحداث
  const handleExportWPS = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const wpsData = filteredPayrollData.map(record => {
        const employee = employeesData.find(emp => emp.id === record.employeeId);
        return {
          employeeId: employee?.empId,
          employeeName: employee?.name,
          nationalId: employee?.nationalId,
          iban: employee?.iban,
          basicSalary: record.basicSalary,
          allowances: Object.values(record.allowances).reduce((sum, val) => sum + val, 0),
          deductions: Object.values(record.deductions).reduce((sum, val) => sum + val, 0),
          netSalary: record.netSalary
        };
      });
      
      setPayrollData(prev => prev.map(record => 
        filteredPayrollData.some(filtered => filtered.id === record.id)
          ? { ...record, wpsStatus: "sent" as const }
          : record
      ));
      
      const newWpsFile = {
        id: Date.now().toString(),
        month: new Date().toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' }),
        totalEmployees: filteredPayrollData.length,
        totalAmount: filteredPayrollData.reduce((sum, record) => sum + record.netSalary, 0).toLocaleString(),
        status: "مرسل",
        date: new Date().toISOString().split('T')[0],
        bankResponse: "في الانتظار",
        submissionTime: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      };
      
      setWpsFilesData(prev => [newWpsFile, ...prev]);
      
      toast({
        title: "تم تصدير ملف WPS بنجاح ✅",
        description: `تم إنشاء ملف حماية الأجور لـ ${filteredPayrollData.length} موظف وإرساله للبنك`,
      });
    } catch (error) {
      toast({
        title: "خطأ في التصدير ❌",
        description: "حدث خطأ أثناء تصدير ملف WPS",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCalculateSalaries = async () => {
    setIsCalculating(true);
    try {
      toast({
        title: "جاري احتساب الرواتب...",
        description: "يتم تطبيق المعادلات والبدلات والاستقطاعات",
      });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const updatedRecords = payrollData.map(record => {
        if (filteredPayrollData.some(filtered => filtered.id === record.id)) {
          const employee = employeesData.find(emp => emp.id === record.employeeId);
          if (employee) {
            const recalculated = calculatePayroll(employee, record.overtime.hours);
            return {
              ...record,
              ...recalculated,
              id: record.id,
              status: "approved" as const,
              updatedAt: new Date().toISOString()
            };
          }
        }
        return record;
      });
      
      setPayrollData(updatedRecords);
      
      toast({
        title: "تم احتساب الرواتب بنجاح ✅",
        description: `تم احتساب وتحديث رواتب ${filteredPayrollData.length} موظف`,
      });
    } catch (error) {
      toast({
        title: "خطأ في الحساب ❌",
        description: "حدث خطأ أثناء احتساب الرواتب",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleViewPayslip = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    setShowPayslip(true);
  };

  const handleDownloadPayslip = async (employeeId: string) => {
    const employee = employeesData.find(emp => emp.id === employeeId);
    const payroll = payrollData.find(record => record.employeeId === employeeId);
    
    if (!employee || !payroll) {
      toast({
        title: "خطأ ❌",
        description: "لم يتم العثور على بيانات الموظف أو الراتب",
      });
      return;
    }

    try {
      toast({
        title: "جاري تحضير الملف...",
        description: `تحضير قسيمة راتب ${employee.name}`,
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      const pdfContent = `
        قسيمة راتب - ${employee.name}
        الرقم الوظيفي: ${employee.empId}
        الشهر: ${selectedMonth}
        الراتب الأساسي: ${payroll.basicSalary.toLocaleString()} جنيه
        صافي الراتب: ${payroll.netSalary.toLocaleString()} جنيه
      `;

      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payslip_${employee.empId}_${selectedMonth}.txt`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "تم التحميل بنجاح ✅",
        description: `تم تحميل قسيمة راتب ${employee.name}`,
      });
    } catch (error) {
      toast({
        title: "خطأ في التحميل ❌",
        description: "حدث خطأ أثناء تحميل قسيمة الراتب",
      });
    }
  };

  const handleApprovePayroll = (recordId: string) => {
    setPayrollData(prev => prev.map(record => 
      record.id === recordId 
        ? { ...record, status: "approved" as const, updatedAt: new Date().toISOString() }
        : record
    ));
    
    const record = payrollData.find(r => r.id === recordId);
    const employee = employeesData.find(emp => emp.id === record?.employeeId);
    
    toast({
      title: "تم اعتماد الراتب ✅",
      description: `تم اعتماد راتب ${employee?.name} وإرساله للمعالجة`,
    });
  };

  const handleRejectPayroll = (recordId: string) => {
    setPayrollData(prev => prev.map(record => 
      record.id === recordId 
        ? { ...record, status: "draft" as const, updatedAt: new Date().toISOString() }
        : record
    ));
    
    const record = payrollData.find(r => r.id === recordId);
    const employee = employeesData.find(emp => emp.id === record?.employeeId);
    
    toast({
      title: "تم رفض الراتب",
      description: `تم إرجاع راتب ${employee?.name} للمراجعة`,
    });
  };

  const handleBulkApprove = () => {
    if (selectedRecords.length === 0) {
      toast({
        title: "لا توجد عناصر محددة",
        description: "يرجى تحديد الرواتب المراد اعتمادها",
      });
      return;
    }

    setPayrollData(prev => prev.map(record => 
      selectedRecords.includes(record.id)
        ? { ...record, status: "approved" as const, updatedAt: new Date().toISOString() }
        : record
    ));
    
    setSelectedRecords([]);
    setBulkSelectMode(false);
    
    toast({
      title: "تم الاعتماد الجماعي ✅",
      description: `تم اعتماد ${selectedRecords.length} راتب`,
    });
  };

  const handleGenerateReport = async (reportType: string) => {
    try {
      toast({
        title: "جاري إنشاء التقرير...",
        description: `تحضير ${reportType}`,
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      let reportData = "";
      switch (reportType) {
        case "تقرير الرواتب الشهرية":
          reportData = `
تقرير الرواتب الشهرية - ${selectedMonth}
=====================================
إجمالي الموظفين: ${filteredPayrollData.length}
إجمالي الرواتب الأساسية: ${filteredPayrollData.reduce((sum, record) => sum + record.basicSalary, 0).toLocaleString()} جنيه
إجمالي البدلات: ${filteredPayrollData.reduce((sum, record) => sum + Object.values(record.allowances).reduce((allowSum, allow) => allowSum + allow, 0), 0).toLocaleString()} جنيه
إجمالي الاستقطاعات: ${filteredPayrollData.reduce((sum, record) => sum + Object.values(record.deductions).reduce((deductSum, deduct) => deductSum + deduct, 0), 0).toLocaleString()} جنيه
صافي الرواتب: ${filteredPayrollData.reduce((sum, record) => sum + record.netSalary, 0).toLocaleString()} جنيه
          `;
          break;
        default:
          reportData = `تقرير ${reportType} - ${selectedMonth}\n=====================================\nالبيانات متاحة للتصدير`;
      }

      const blob = new Blob([reportData], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}_${selectedMonth}.txt`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "تم إنشاء التقرير بنجاح ✅",
        description: `تم تحميل ${reportType}`,
      });
    } catch (error) {
      toast({
        title: "خطأ في إنشاء التقرير ❌",
        description: "حدث خطأ أثناء إنشاء التقرير",
      });
    }
  };

  // إحصائيات محسوبة ديناميكياً
  const stats = useMemo(() => {
    const totalGrossSalary = filteredPayrollData.reduce((sum, record) => sum + record.grossSalary, 0);
    const totalNetSalary = filteredPayrollData.reduce((sum, record) => sum + record.netSalary, 0);
    const approvedCount = filteredPayrollData.filter(record => record.status === "approved").length;
    const draftCount = filteredPayrollData.filter(record => record.status === "draft").length;
    const totalEmployees = employeesData.filter(emp => emp.status === "active").length;
    const totalDeductions = filteredPayrollData.reduce((sum, record) => 
      sum + Object.values(record.deductions).reduce((deductSum, deduct) => deductSum + deduct, 0), 0);

    return [
      { 
        title: "إجمالي الرواتب الصافية", 
        value: `${totalNetSalary.toLocaleString()} جنيه`, 
        icon: DollarSign, 
        color: "text-green-600", 
        bg: "bg-green-50",
        trend: "+5.2%"
      },
      { 
        title: "عدد الموظفين النشطين", 
        value: `${totalEmployees}`, 
        icon: User, 
        color: "text-blue-600", 
        bg: "bg-blue-50",
        trend: "+2"
      },
      { 
        title: "رواتب في المراجعة", 
        value: `${draftCount}`, 
        icon: Clock, 
        color: "text-orange-600", 
        bg: "bg-orange-50",
        trend: `-${approvedCount}`
      },
      { 
        title: "إجمالي الاستقطاعات", 
        value: `${totalDeductions.toLocaleString()} جنيه`, 
        icon: Calculator, 
        color: "text-red-600", 
        bg: "bg-red-50",
        trend: "10.5%"
      },
      {
        title: "رواتب معتمدة",
        value: `${approvedCount}`,
        icon: CheckCircle,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        trend: `${Math.round((approvedCount/Math.max(filteredPayrollData.length, 1)) * 100)}%`
      },
      {
        title: "الراتب الإجمالي",
        value: `${totalGrossSalary.toLocaleString()} جنيه`,
        icon: TrendingUp,
        color: "text-purple-600",
        bg: "bg-purple-50",
        trend: "+3.8%"
      }
    ];
  }, [filteredPayrollData, employeesData]);

  // الأقسام المتاحة
  const departments = ["all", ...Array.from(new Set(employeesData.map(emp => emp.department)))];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "draft": { color: "bg-yellow-100 text-yellow-800", label: "مسودة" },
      "approved": { color: "bg-green-100 text-green-800", label: "معتمد" },
      "paid": { color: "bg-blue-100 text-blue-800", label: "مدفوع" },
      "cancelled": { color: "bg-red-100 text-red-800", label: "ملغي" },
      "جاهز": { color: "bg-green-100 text-green-800", label: "جاهز" },
      "معلق": { color: "bg-orange-100 text-orange-800", label: "معلق" },
      "مكتمل": { color: "bg-blue-100 text-blue-800", label: "مكتمل" },
      "مرسل": { color: "bg-purple-100 text-purple-800", label: "مرسل" },
      "مرفوض": { color: "bg-red-100 text-red-800", label: "مرفوض" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { color: "bg-gray-100 text-gray-800", label: status };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getWPSStatusBadge = (status: string) => {
    const statusConfig = {
      "pending": { color: "bg-yellow-100 text-yellow-800", label: "في الانتظار" },
      "sent": { color: "bg-blue-100 text-blue-800", label: "مرسل" },
      "confirmed": { color: "bg-green-100 text-green-800", label: "مؤكد" },
      "rejected": { color: "bg-red-100 text-red-800", label: "مرفوض" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { color: "bg-gray-100 text-gray-800", label: status };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">إدارة الرواتب</h1>
            <p className="text-slate-600 mt-2">نظام الرواتب ومسيرات الأجور</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleExportWPS}
              disabled={isExporting || filteredPayrollData.length === 0}
              className="hover:scale-105 hover:bg-blue-50 transition-all duration-300"
            >
              {isExporting ? (
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isExporting ? "جاري التصدير..." : "تصدير ملف WPS"}
            </Button>
            <Button 
              onClick={handleCalculateSalaries}
              disabled={isCalculating || filteredPayrollData.length === 0}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isCalculating ? (
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Calculator className="w-4 h-4 mr-2 animate-bounce" />
              )}
              {isCalculating ? "جاري الحساب..." : "احتساب الرواتب"}
            </Button>
            {bulkSelectMode && selectedRecords.length > 0 && (
              <Button
                onClick={handleBulkApprove}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                اعتماد المحدد ({selectedRecords.length})
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="group border-0 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-fade-in bg-gradient-to-br from-white to-slate-50/30 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors duration-300">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
                      <span className="text-xs text-slate-500 mr-2">من الشهر الماضي</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <stat.icon className={`h-6 w-6 ${stat.color} group-hover:animate-pulse`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Controls */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-slate-50/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="اختر الشهر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-01">يناير 2024</SelectItem>
                      <SelectItem value="2024-02">فبراير 2024</SelectItem>
                      <SelectItem value="2024-03">مارس 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-slate-600" />
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأقسام</SelectItem>
                      {departments.filter(dept => dept !== "all").map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input 
                    placeholder="البحث في الموظفين..." 
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  مسير الرواتب - {selectedMonth}
                </CardTitle>
                <CardDescription>
                  إدارة رواتب الموظفين وملفات حماية الأجور
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-slate-600">
                  {filteredPayrollData.length} موظف
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkSelectMode(!bulkSelectMode)}
                  className={bulkSelectMode ? "bg-purple-50 text-purple-600" : ""}
                >
                  {bulkSelectMode ? "إلغاء التحديد" : "تحديد متعدد"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="current">المسير الحالي</TabsTrigger>
                <TabsTrigger value="wps">ملفات WPS</TabsTrigger>
                <TabsTrigger value="analytics">التحليلات</TabsTrigger>
                <TabsTrigger value="reports">التقارير</TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {bulkSelectMode && <TableHead className="w-12">تحديد</TableHead>}
                      <TableHead>الرقم الوظيفي</TableHead>
                      <TableHead>اسم الموظف</TableHead>
                      <TableHead>الراتب الأساسي</TableHead>
                      <TableHead>البدلات</TableHead>
                      <TableHead>الإضافي</TableHead>
                      <TableHead>الخصومات</TableHead>
                      <TableHead>صافي الراتب</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>WPS</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayrollData.map((record) => {
                      const employee = employeesData.find(emp => emp.id === record.employeeId);
                      if (!employee) return null;
                      
                      const totalAllowances = Object.values(record.allowances).reduce((sum, val) => sum + val, 0);
                      const totalDeductions = Object.values(record.deductions).reduce((sum, val) => sum + val, 0);
                      
                      return (
                        <TableRow key={record.id} className={selectedRecords.includes(record.id) ? "bg-purple-50" : ""}>
                          {bulkSelectMode && (
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedRecords.includes(record.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedRecords(prev => [...prev, record.id]);
                                  } else {
                                    setSelectedRecords(prev => prev.filter(id => id !== record.id));
                                  }
                                }}
                                className="rounded border-gray-300"
                              />
                            </TableCell>
                          )}
                          <TableCell className="font-medium">{employee.empId}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-sm text-slate-600">{employee.position}</p>
                            </div>
                          </TableCell>
                          <TableCell>{record.basicSalary.toLocaleString()} جنيه</TableCell>
                          <TableCell className="text-green-600">+{totalAllowances.toLocaleString()}</TableCell>
                          <TableCell className="text-blue-600">+{record.overtime.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-red-600">-{totalDeductions.toLocaleString()}</TableCell>
                          <TableCell className="font-bold">{record.netSalary.toLocaleString()} جنيه</TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          <TableCell>{getWPSStatusBadge(record.wpsStatus)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewPayslip(employee.id)}
                                className="hover:bg-blue-50 hover:text-blue-600 hover:scale-110 transition-all duration-300"
                                title="عرض قسيمة الراتب"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDownloadPayslip(employee.id)}
                                className="hover:bg-green-50 hover:text-green-600 hover:scale-110 transition-all duration-300"
                                title="تحميل قسيمة الراتب"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              {record.status === "draft" && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleApprovePayroll(record.id)}
                                  className="hover:bg-emerald-50 hover:text-emerald-600 hover:scale-110 transition-all duration-300"
                                  title="اعتماد الراتب"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              )}
                              {record.status === "approved" && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRejectPayroll(record.id)}
                                  className="hover:bg-red-50 hover:text-red-600 hover:scale-110 transition-all duration-300"
                                  title="إرجاع للمراجعة"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="wps" className="mt-6">
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">ملفات حماية الأجور</h3>
                  <Button
                    variant="outline"
                    onClick={() => setWpsFilesData(prev => [...prev])}
                    size="sm"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    تحديث
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الشهر</TableHead>
                      <TableHead>عدد الموظفين</TableHead>
                      <TableHead>إجمالي المبلغ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>رد البنك</TableHead>
                      <TableHead>وقت الإرسال</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wpsFilesData.map((file, index) => (
                      <TableRow key={file.id || index}>
                        <TableCell className="font-medium">{file.month}</TableCell>
                        <TableCell>{file.totalEmployees}</TableCell>
                        <TableCell>{file.totalAmount} جنيه</TableCell>
                        <TableCell>{getStatusBadge(file.status)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            file.bankResponse === "تم التحويل" ? "text-green-600" :
                            file.bankResponse === "تم القبول" ? "text-blue-600" : "text-yellow-600"
                          }>
                            {file.bankResponse}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{file.submissionTime}</TableCell>
                        <TableCell>{file.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: "تحميل ملف WPS",
                                  description: `جاري تحميل ملف ${file.month}`,
                                });
                              }}
                              className="hover:bg-blue-50 hover:text-blue-600"
                              title="تحميل الملف"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: "عرض التفاصيل",
                                  description: `عرض تفاصيل ملف ${file.month}`,
                                });
                              }}
                              className="hover:bg-green-50 hover:text-green-600"
                              title="عرض التفاصيل"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        تطور الرواتب الشهرية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                        <div className="text-center">
                          <BarChart3 className="w-12 h-12 mx-auto text-blue-500 mb-2" />
                          <p className="text-slate-600">رسم بياني لتطور الرواتب</p>
                          <p className="text-sm text-slate-500">يناير - ديسمبر 2024</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        توزيع الرواتب حسب الأقسام
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                        <div className="text-center">
                          <PieChart className="w-12 h-12 mx-auto text-green-500 mb-2" />
                          <p className="text-slate-600">توزيع الرواتب والنفقات</p>
                          <div className="mt-4 space-y-2">
                            {departments.filter(dept => dept !== "all").map((dept, index) => (
                              <div key={dept} className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${
                                    index === 0 ? 'bg-blue-500' : 
                                    index === 1 ? 'bg-green-500' : 
                                    index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                                  }`}></div>
                                  {dept}
                                </span>
                                <span className="font-medium">
                                  {Math.round(Math.random() * 40 + 10)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        مؤشرات الأداء الرئيسية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {Math.round((filteredPayrollData.filter(r => r.status === 'approved').length / Math.max(filteredPayrollData.length, 1)) * 100)}%
                          </div>
                          <div className="text-sm text-slate-600">معدل اعتماد الرواتب</div>
                          <Progress value={85} className="mt-2" />
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {Math.round((filteredPayrollData.filter(r => r.wpsStatus === 'confirmed').length / Math.max(filteredPayrollData.length, 1)) * 100)}%
                          </div>
                          <div className="text-sm text-slate-600">نجاح WPS</div>
                          <Progress value={92} className="mt-2" />
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {filteredPayrollData.reduce((sum, record) => sum + record.overtime.hours, 0)}
                          </div>
                          <div className="text-sm text-slate-600">ساعات إضافية</div>
                          <Progress value={65} className="mt-2" />
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {Math.round(filteredPayrollData.reduce((sum, record) => 
                              sum + Object.values(record.deductions).reduce((deductSum, deduct) => deductSum + deduct, 0), 0) / 1000)}K
                          </div>
                          <div className="text-sm text-slate-600">إجمالي الخصومات</div>
                          <Progress value={45} className="mt-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border border-slate-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                          <TrendingUp className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-slate-900">تقرير الرواتب الشهرية</h3>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">تحليل مفصل للرواتب والبدلات والاستقطاعات</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleGenerateReport("تقرير الرواتب الشهرية")}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        تحميل التقرير
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* نافذة عرض قسيمة الراتب */}
        <Dialog open={showPayslip} onOpenChange={setShowPayslip}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                قسيمة راتب - {selectedEmployeeData?.name}
              </DialogTitle>
              <DialogDescription>
                تفاصيل الراتب للشهر: {selectedMonth}
              </DialogDescription>
            </DialogHeader>
            
            {selectedEmployeeData && selectedEmployeePayroll && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">معلومات الموظف</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">الاسم:</span>
                        <span className="font-medium mr-2">{selectedEmployeeData.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">الرقم الوظيفي:</span>
                        <span className="font-medium mr-2">{selectedEmployeeData.empId}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowPayslip(false)}>
                    إغلاق
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleDownloadPayslip(selectedEmployeeData.id)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    تحميل PDF
                  </Button>
                  <Button onClick={() => handleApprovePayroll(selectedEmployeePayroll.id)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    اعتماد الراتب
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Payroll;
