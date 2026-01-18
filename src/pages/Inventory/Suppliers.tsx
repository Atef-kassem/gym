import { useSearchParams, useLocation } from "react-router-dom";
import SupplierSettings from "./SupplierSettings";
import SupplierManagement from "./SupplierManagement";
import SupplierPayments from "./SupplierPayments";
import SupplierEvaluation from "./SupplierEvaluation";
import SupplierContracts from "./SupplierContracts";
import SupplierReports from "./SupplierReports";

const Suppliers = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // تحديد الصفحة المطلوبة بناءً على المسار أو المعاملات
  const getCurrentPage = () => {
    const tab = searchParams.get("tab");
    const path = location.pathname;
    
    // التحقق من المسار أولاً
    if (path.includes('/contracts')) return 'contracts';
    if (path.includes('/evaluation')) return 'evaluation';
    if (path.includes('/payments')) return 'payments';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/dashboard')) return 'dashboard';
    
    // ثم التحقق من معاملات URL
    if (tab === 'settings') return 'settings';
    if (tab === 'suppliers') return 'suppliers';
    if (tab === 'payments') return 'payments';
    if (tab === 'evaluation') return 'evaluation';
    if (tab === 'contracts') return 'contracts';
    if (tab === 'reports') return 'reports';
    
    // افتراضي
    return 'suppliers';
  };

  const currentPage = getCurrentPage();

  // عرض الصفحة المناسبة بناءً على التنقل من السايد بار
  const renderPage = () => {
    switch (currentPage) {
      case 'settings':
        return <SupplierSettings />;
      case 'suppliers':
        return <SupplierManagement />;
      case 'contracts':
        return <SupplierContracts />;
      case 'payments':
        return <SupplierPayments />;
      case 'evaluation':
        return <SupplierEvaluation />;
      case 'reports':
        return <SupplierReports />;
      default:
        return <SupplierManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="p-6">
        {renderPage()}
      </div>
    </div>
  );
};

export default Suppliers;