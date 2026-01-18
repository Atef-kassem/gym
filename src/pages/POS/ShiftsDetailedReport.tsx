import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Clock, 
  Users, 
  DollarSign, 
  FileText, 
  Download, 
  Printer,
  Search,
  ArrowRight,
  Eye,
  CreditCard,
  Banknote,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// Mock data for detailed shift operations
const detailedOperations = [
  {
    id: 1,
    timestamp: '2024-01-15 08:00:00',
    shiftId: 'S001',
    cashierName: 'أحمد محمد',
    operationType: 'بداية الوردية',
    description: 'فتح الكاشة وتسجيل المبلغ الابتدائي',
    amount: 1000,
    runningBalance: 1000,
    reference: 'SHIFT_START_001',
    signature: 'تم',
    notes: 'مبلغ ابتدائي للصندوق'
  },
  {
    id: 2,
    timestamp: '2024-01-15 08:15:00',
    shiftId: 'S001',
    cashierName: 'أحمد محمد',
    operationType: 'مبيعات نقدية',
    description: '  مشروب صغيرة',
    amount: 45,
    runningBalance: 1045,
    reference: 'INV_001234',
    signature: 'تم',
    notes: 'خدمة   أساسية'
  },
  {
    id: 3,
    timestamp: '2024-01-15 08:30:00',
    shiftId: 'S001',
    cashierName: 'أحمد محمد',
    operationType: 'مبيعات بطاقة',
    description: '  وتشميع',
    amount: 120,
    runningBalance: 1165,
    reference: 'INV_001235',
    signature: 'تم',
    notes: 'خدمة متكاملة'
  },
  {
    id: 4,
    timestamp: '2024-01-15 09:00:00',
    shiftId: 'S001',
    cashierName: 'أحمد محمد',
    operationType: 'سحب نقدي',
    description: 'سحب مبلغ للمصروفات',
    amount: -200,
    runningBalance: 965,
    reference: 'CASH_OUT_001',
    signature: 'تم',
    notes: 'مصروفات تشغيلية'
  },
  {
    id: 5,
    timestamp: '2024-01-15 10:00:00',
    shiftId: 'S001',
    cashierName: 'أحمد محمد',
    operationType: 'إيداع نقدي',
    description: 'إيداع مبلغ إضافي',
    amount: 500,
    runningBalance: 1465,
    reference: 'CASH_IN_001',
    signature: 'تم',
    notes: 'تقوية الصندوق'
  },
  {
    id: 6,
    timestamp: '2024-01-15 11:30:00',
    shiftId: 'S001',
    cashierName: 'أحمد محمد',
    operationType: 'استرداد',
    description: 'استرداد مبلغ خدمة ملغاة',
    amount: -45,
    runningBalance: 1420,
    reference: 'REF_001234',
    signature: 'تم',
    notes: 'إلغاء خدمة بناء على طلب العميل'
  },
  {
    id: 7,
    timestamp: '2024-01-15 16:00:00',
    shiftId: 'S001',
    cashierName: 'أحمد محمد',
    operationType: 'نهاية الوردية',
    description: 'إغلاق الكاشة وعد النقدية',
    amount: 0,
    runningBalance: 1420,
    reference: 'SHIFT_END_001',
    signature: 'تم',
    notes: 'إجمالي مبيعات الوردية: 1420 جنيه'
  }
];

const shiftSummary = {
  openingBalance: 1000,
  closingBalance: 1420,
  totalSales: 165,
  totalReturns: 45,
  cashDeposits: 500,
  cashWithdrawals: 200,
  cardSales: 120,
  cashSales: 45,
  netCashFlow: 420
};

export default function ShiftsDetailedReport() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShift, setSelectedShift] = useState('all');
  const [selectedOperation, setSelectedOperation] = useState('all');

  const filteredOperations = detailedOperations.filter(operation => {
    const matchesSearch = operation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operation.cashierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesShift = selectedShift === 'all' || operation.shiftId === selectedShift;
    const matchesOperation = selectedOperation === 'all' || operation.operationType === selectedOperation;
    
    return matchesSearch && matchesShift && matchesOperation;
  });

  const getOperationTypeColor = (type: string) => {
    switch (type) {
      case 'بداية الوردية':
      case 'نهاية الوردية':
        return 'bg-blue-100 text-blue-800';
      case 'مبيعات نقدية':
      case 'مبيعات بطاقة':
        return 'bg-green-100 text-green-800';
      case 'سحب نقدي':
      case 'استرداد':
        return 'bg-red-100 text-red-800';
      case 'إيداع نقدي':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = ['الوقت', 'رقم الوردية', 'الكاشير', 'نوع العملية', 'الوصف', 'المبلغ', 'الرصيد الجاري', 'المرجع', 'التوقيع', 'ملاحظات'];
    const csvContent = [
      headers.join(','),
      ...filteredOperations.map(op => [
        op.timestamp,
        op.shiftId,
        op.cashierName,
        op.operationType,
        op.description,
        op.amount,
        op.runningBalance,
        op.reference,
        op.signature,
        op.notes
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'shifts_detailed_report.csv';
    link.click();
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/pos/reports')}
            className="flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للتقارير
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تقرير حركة الورديات التفصيلي</h1>
            <p className="text-gray-600 mt-2">متابعة كل العمليات والتعاملات المالية لكل وردية</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            تصدير CSV
          </Button>
          <Button onClick={printReport} variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            طباعة
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            فلاتر البحث
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="البحث في العمليات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={selectedShift} onValueChange={setSelectedShift}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الوردية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الورديات</SelectItem>
                <SelectItem value="S001">الوردية S001</SelectItem>
                <SelectItem value="S002">الوردية S002</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedOperation} onValueChange={setSelectedOperation}>
              <SelectTrigger>
                <SelectValue placeholder="نوع العملية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع العمليات</SelectItem>
                <SelectItem value="مبيعات نقدية">مبيعات نقدية</SelectItem>
                <SelectItem value="مبيعات بطاقة">مبيعات بطاقة</SelectItem>
                <SelectItem value="سحب نقدي">سحب نقدي</SelectItem>
                <SelectItem value="إيداع نقدي">إيداع نقدي</SelectItem>
                <SelectItem value="استرداد">استرداد</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedShift('all');
              setSelectedOperation('all');
            }}>
              إعادة تعيين
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">الرصيد الافتتاحي</p>
                <p className="text-2xl font-bold text-blue-900">{shiftSummary.openingBalance.toLocaleString()} جنيه</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">الرصيد الختامي</p>
                <p className="text-2xl font-bold text-green-900">{shiftSummary.closingBalance.toLocaleString()} جنيه</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">صافي التدفق النقدي</p>
                <p className="text-2xl font-bold text-purple-900">{shiftSummary.netCashFlow.toLocaleString()} جنيه</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">إجمالي العمليات</p>
                <p className="text-2xl font-bold text-orange-900">{detailedOperations.length}</p>
              </div>
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Operations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            سجل العمليات التفصيلي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الوقت</TableHead>
                  <TableHead>رقم الوردية</TableHead>
                  <TableHead>الكاشير</TableHead>
                  <TableHead>نوع العملية</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>الرصيد الجاري</TableHead>
                  <TableHead>المرجع</TableHead>
                  <TableHead>التوقيع</TableHead>
                  <TableHead>ملاحظات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOperations.map((operation) => (
                  <TableRow key={operation.id}>
                    <TableCell className="font-mono text-sm">
                      {operation.timestamp}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{operation.shiftId}</Badge>
                    </TableCell>
                    <TableCell>{operation.cashierName}</TableCell>
                    <TableCell>
                      <Badge className={getOperationTypeColor(operation.operationType)}>
                        {operation.operationType}
                      </Badge>
                    </TableCell>
                    <TableCell>{operation.description}</TableCell>
                    <TableCell className={`font-semibold ${operation.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {operation.amount >= 0 ? '+' : ''}{operation.amount.toLocaleString()} جنيه
                    </TableCell>
                    <TableCell className="font-semibold">
                      {operation.runningBalance.toLocaleString()} جنيه
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {operation.reference}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-green-600">
                        {operation.signature}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={operation.notes}>
                        {operation.notes}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="w-5 h-5" />
              ملخص النقدية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>المبلغ الابتدائي:</span>
              <span className="font-semibold">{shiftSummary.openingBalance.toLocaleString()} جنيه</span>
            </div>
            <div className="flex justify-between">
              <span>المبيعات النقدية:</span>
              <span className="font-semibold text-green-600">+{shiftSummary.cashSales.toLocaleString()} جنيه</span>
            </div>
            <div className="flex justify-between">
              <span>الإيداعات:</span>
              <span className="font-semibold text-green-600">+{shiftSummary.cashDeposits.toLocaleString()} جنيه</span>
            </div>
            <div className="flex justify-between">
              <span>السحوبات:</span>
              <span className="font-semibold text-red-600">-{shiftSummary.cashWithdrawals.toLocaleString()} جنيه</span>
            </div>
            <div className="flex justify-between">
              <span>المردودات:</span>
              <span className="font-semibold text-red-600">-{shiftSummary.totalReturns.toLocaleString()} جنيه</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>المبلغ النهائي:</span>
              <span>{shiftSummary.closingBalance.toLocaleString()} جنيه</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              ملخص المبيعات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>مبيعات نقدية:</span>
              <span className="font-semibold">{shiftSummary.cashSales.toLocaleString()} جنيه</span>
            </div>
            <div className="flex justify-between">
              <span>مبيعات بطاقة:</span>
              <span className="font-semibold">{shiftSummary.cardSales.toLocaleString()} جنيه</span>
            </div>
            <div className="flex justify-between">
              <span>إجمالي المبيعات:</span>
              <span className="font-semibold">{shiftSummary.totalSales.toLocaleString()} جنيه</span>
            </div>
            <div className="flex justify-between">
              <span>المردودات:</span>
              <span className="font-semibold text-red-600">{shiftSummary.totalReturns.toLocaleString()} جنيه</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>صافي المبيعات:</span>
              <span>{(shiftSummary.totalSales - shiftSummary.totalReturns).toLocaleString()} جنيه</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}