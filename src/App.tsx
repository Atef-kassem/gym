import React, { useState, memo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import ErrorBoundary from "@/components/ErrorBoundary";
import { BackendStatusNotification } from "@/components/BackendStatusNotification";

// استخدم HashRouter في Electron و BrowserRouter في الويب
const Router = typeof window !== 'undefined' && (window as any).electronAPI?.isElectron 
  ? HashRouter 
  : BrowserRouter;

// Layout and Pages
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import SupportChatbot from "@/components/SupportChatbot";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import UserSettings from "./pages/UserSettings";
import CompanySettings from "./pages/Settings/CompanySettings";
import BranchSettings from "./pages/Settings/BranchSettings";
import UsersSettings from "./pages/Settings/UsersSettings";
import ThemeSettings from "./pages/Settings/ThemeSettings";
import SystemSettings from "./pages/Settings/SystemSettings";
import ExternalDevicesSettings from "./pages/Settings/ExternalDevicesSettings";
import AdvancedSettings from "./pages/Settings/AdvancedSettings";
import RolesPermissions from "./pages/Settings/RolesPermissions";
import InventoryDashboard from "./pages/Inventory/InventoryDashboard";
import InventoryReports from "./pages/Inventory/InventoryReports";
import Warehouses from "./pages/Inventory/Warehouses";
import Items from "./pages/Inventory/Items";
import PriceList from "./pages/Inventory/PriceList";
import Suppliers from "./pages/Inventory/Suppliers";
import SupplierManagementDashboard from "./pages/Inventory/SupplierManagementDashboard";
import PurchaseOrders from "./pages/Inventory/PurchaseOrders";
import QuickPurchaseOrder from "./pages/Inventory/QuickPurchaseOrder.jsx";
import GoodsReceipt from "./pages/Inventory/GoodsReceipt";

// Finance Pages
import FinanceDashboard from "./pages/Finance/FinanceDashboard.jsx";
import ExpenseManagement from "./pages/Finance/ExpenseManagement.jsx";
import RevenueManagement from "./pages/Finance/RevenueManagement.jsx";
import ExpenseReports from "./pages/Finance/ExpenseReports.jsx";
import RevenueReports from "./pages/Finance/RevenueReports.jsx";
import FinancialAnalysis from "./pages/Finance/FinancialAnalysis.jsx";
import ProfitLoss from "./pages/Finance/ProfitLoss.jsx";

// Accounting Pages
import AccountingDashboard from "./pages/Accounting/AccountingDashboard";
import JournalEntries from "./pages/Accounting/JournalEntries";
import ChartOfAccounts from "./pages/Accounting/ChartOfAccounts";
import IncomeStatement from "./pages/Accounting/IncomeStatement";
import BalanceSheet from "./pages/Accounting/BalanceSheet";
import CashFlow from "./pages/Accounting/CashFlow";
import AccountingSettings from "./pages/Accounting/AccountingSettings";
import TrialBalance from "./pages/Accounting/TrialBalance";
import AccountStatement from "./pages/Accounting/AccountStatement";
import GeneralLedger from "./pages/Accounting/GeneralLedger";
import InvoiceProcessing from "./pages/Inventory/InvoiceProcessing";
import PurchaseReturns from "./pages/Inventory/PurchaseReturns";
import DebitNote from "./pages/Inventory/DebitNote";
import InventoryTransactions from "./pages/Inventory/InventoryTransactions";
import WarehouseSettings from "./pages/Inventory/WarehouseSettings";
import OpeningStock from "./pages/Inventory/OpeningStock";
import ProcurementSettings from "./pages/Procurement/ProcurementSettings";
import PurchaseRequisition from "./pages/Procurement/PurchaseRequisition";
import RequestForQuotation from "./pages/Procurement/RequestForQuotation";
import ApprovalWorkflow from "./pages/Procurement/ApprovalWorkflow";
import InventoryMovementLog from "./pages/Inventory/InventoryMovementLog";
import StockTaking from "./pages/Inventory/StockTaking";
import InventoryPolicies from "./pages/Inventory/InventoryPolicies";
import InventoryAnalytics from "./pages/Inventory/InventoryAnalytics";
import AddItemPage from "./pages/AddItemPage";

import SimplePOSSystem from "./pages/POS/SimplePOSSystem";
import POSDashboard from "./pages/POS/POSDashboard";
import ActiveOrders from "./pages/POS/ActiveOrders";
import ShiftManagement from "./pages/POS/ShiftManagement";

import OutstandingInvoices from "./pages/POS/OutstandingInvoices";
import OperationsLog from "./pages/POS/OperationsLog";
import ReportsHub from "./pages/POS/ReportsHub";
import CategoriesSalesReport from "./pages/POS/CategoriesSalesReport";
import ProductsServicesReport from "./pages/POS/ProductsServicesReport";
import ShiftsSalesReport from "./pages/POS/ShiftsSalesReport";
import ShiftsDetailedReport from "./pages/POS/ShiftsDetailedReport";
import ShiftsProfitabilityReport from "./pages/POS/ShiftsProfitabilityReport";
import CategoriesProfitabilityReport from "./pages/POS/CategoriesProfitabilityReport";
import ProductsProfitabilityReport from "./pages/POS/ProductsProfitabilityReport";
import POSSettings from "./pages/Settings/POSSettings";
import POSDevicesSettings from "./pages/Settings/POSDevicesSettings";
import POSPaymentSettings from "./pages/Settings/POSPaymentSettings";
import POSInvoiceSettings from "./pages/Settings/POSInvoiceSettings";
import POSSecuritySettings from "./pages/Settings/POSSecuritySettings";
import POSInventorySettings from "./pages/Settings/POSInventorySettings";
import POSNotificationsSettings from "./pages/Settings/POSNotificationsSettings";
import POSReportsSettings from "./pages/Settings/POSReportsSettings";
import EvaluationManagement from "./pages/POS/EvaluationManagement";
import CheckUpForm from "./pages/POS/EvaluationForms/CheckUpForm";
import EvaluationHistory from "./pages/POS/EvaluationForms/EvaluationHistory";
import EvaluationReports from "./pages/POS/EvaluationForms/EvaluationReports";
import CustomerSatisfactionAnalysis from "./pages/POS/CustomerSatisfactionAnalysis";
import CustomerPayments from "./pages/POS/CustomerPayments";

// CRM Pages
import CRMDashboard from "./pages/CRM/CRMDashboard";
import CustomerManagement from "./pages/CRM/CustomerManagement";
import VehicleManagement from "./pages/CRM/VehicleManagement";

import MarketingCampaigns from "./pages/CRM/MarketingCampaigns";
import CustomerFeedback from "./pages/CRM/CustomerFeedback";
import CustomerSurvey from "./pages/CRM/CustomerSurvey";
import SurveyManagement from "./pages/CRM/SurveyManagement";
import CouponsManagement from "./pages/CRM/CouponsManagement";
import SubscriptionManagement from "./pages/CRM/SubscriptionManagement";
import SubscriptionTransfers from "./pages/CRM/SubscriptionTransfers";
import SubscriptionRefunds from "./pages/CRM/SubscriptionRefunds";
import LoyaltyPointsManagement from "./pages/CRM/LoyaltyPointsManagement";
import CardManagement from "./pages/CRM/CardManagement";

import OperationsManagement from "./pages/Reception/OperationsManagement";
import WorkOrderManagement from "./pages/Reception/WorkOrderManagement";
import UnifiedReceptionDashboard from "./pages/Reception/UnifiedReceptionDashboard";
import CustomerService from "./pages/Reception/CustomerService";
import BookingDashboard from "./pages/Reception/BookingDashboard";
import CreateBooking from "./pages/Reception/CreateBooking";
import BookingsList from "./pages/Reception/BookingsList";
import BookingCalendar from "./pages/Reception/BookingCalendar";
import BookingAnalytics from "./pages/Reception/BookingAnalytics";
import TableManagement from "./pages/Reception/TableManagement";
import LiveControlCenter from "./pages/Reception/LiveControlCenter";
import ShiftsList from "./pages/Shifts/ShiftsList";
import AddShift from "./pages/Shifts/AddShift";
import EditShift from "./pages/Shifts/EditShift";
import ShiftRevenue from "./pages/Shifts/ShiftRevenue";
import DailyShiftReport from "./pages/Shifts/DailyShiftReport";
import ReceptionReports from "./pages/Reception/ReceptionReports";
import CustomerNotifications from "./pages/Reception/CustomerNotifications";
import SystemIntegration from "./pages/Reception/SystemIntegration";

// Mobile Wash Pages
import MobileWashDashboard from "./pages/MobileWash/MobileWashDashboard";
import BookingManagement from "./pages/MobileWash/BookingManagement";
import FleetManagement from "./pages/MobileWash/FleetManagement";
import LiveTracking from "./pages/MobileWash/LiveTracking";
import QualityManagement from "./pages/MobileWash/QualityManagement";
import MobileAppManagement from "./pages/MobileWash/MobileAppManagement";

// Motorcycle Management Pages
import MotorcycleDashboard from "./pages/MotorcycleManagement/MotorcycleDashboard";
import MotorcycleList from "./pages/MotorcycleManagement/MotorcycleList";
import MotorcycleForm from "./pages/MotorcycleManagement/MotorcycleForm";
import DeliveryOrderList from "./pages/MotorcycleManagement/DeliveryOrderList";
import DeliveryOrderForm from "./pages/MotorcycleManagement/DeliveryOrderForm";
import DeliveryDriverList from "./pages/MotorcycleManagement/DeliveryDriverList";
import DeliveryDriverForm from "./pages/MotorcycleManagement/DeliveryDriverForm";
import MaintenanceList from "./pages/MotorcycleManagement/MaintenanceList";
import MaintenanceForm from "./pages/MotorcycleManagement/MaintenanceForm";

// Gym Management Pages
import GymDashboard from "./pages/Gym/GymDashboard";
import MembershipManagement from "./pages/Gym/MembershipManagement";
import MembershipCards from "./pages/Gym/MembershipCards";
import BarcodeManagement from "./pages/Gym/BarcodeManagement";
import BarcodeSearch from "./pages/Gym/BarcodeSearch";
import MemberAttendance from "./pages/Gym/MemberAttendance";
import GroupsCategories from "./pages/Gym/GroupsCategories";
import Surveys from "./pages/Gym/Surveys";
import SubscriptionManagementGym from "./pages/Gym/SubscriptionManagement";
import Subscriptions from "./pages/Gym/Subscriptions";
import SpecialSubscriptions from "./pages/Gym/SpecialSubscriptions";
import TimeBasedSpecialSubscriptions from "./pages/Gym/TimeBasedSpecialSubscriptions";
import SubscriptionMemberTransfer from "./pages/Gym/SubscriptionMemberTransfer";
import MemberForm from "./pages/Gym/MemberForm";
import LockersList from "./pages/Gym/LockersList";
import AddLocker from "./pages/Gym/AddLocker";
import LockerSettings from "./pages/Gym/LockerSettings";
import OnlinePayments from "./pages/Gym/OnlinePayments";
import AboutApp from "./pages/App/AboutApp";
import SentInvitations from "./pages/App/SentInvitations";
import AcceptedInvitations from "./pages/App/AcceptedInvitations";
import AttendedInvitations from "./pages/App/AttendedInvitations";
import RejectedInvitations from "./pages/App/RejectedInvitations";
import AppOffers from "./pages/App/AppOffers";
import AppTrainers from "./pages/App/AppTrainers";
import ExerciseCategories from "./pages/App/ExerciseCategories";
import AppExercises from "./pages/App/AppExercises";
import AppNews from "./pages/App/AppNews";
import AppAds from "./pages/App/AppAds";
import InvoicesReceipts from "./pages/Gym/InvoicesReceipts";
import FinancialReports from "./pages/Gym/FinancialReports";
import DiscountsOffers from "./pages/Gym/DiscountsOffers";
import WorkoutPrograms from "./pages/Gym/WorkoutPrograms";
import WorkoutTemplates from "./pages/Gym/WorkoutTemplates";
import StrengthTraining from "./pages/Gym/StrengthTraining";
import ProgressTracking from "./pages/Gym/ProgressTracking";
import SchedulingManagement from "./pages/Gym/SchedulingManagement";
import Scheduling from "./pages/Gym/Scheduling";
import ClassBooking from "./pages/Gym/ClassBooking";
import PersonalSessions from "./pages/Gym/PersonalSessions";
import Classes from "./pages/Gym/Classes";
import TrainerManagement from "./pages/Gym/TrainerManagement";
import TrainerPayments from "./pages/Gym/TrainerPayments";
import TrainerSearch from "./pages/Gym/TrainerSearch";
import FacilityManagement from "./pages/Gym/FacilityManagement";
import ServicesAndMarketing from "./pages/Gym/ServicesAndMarketing";
import ReportsAndSettings from "./pages/Gym/ReportsAndSettings";
import GymSettings from "./pages/Gym/GymSettings";
import MembershipSettings from "./pages/gym/MembershipSettings";
import SubscriptionPaymentSettings from "./pages/gym/SubscriptionPaymentSettings";
import WorkoutProgramsSettings from "./pages/gym/WorkoutProgramsSettings";
import SchedulingSettings from "./pages/gym/SchedulingSettings";
import TrainerSettings from "./pages/gym/TrainerSettings";
import FacilitySettings from "./pages/gym/FacilitySettings";
import ServicesMarketingSettings from "./pages/gym/ServicesMarketingSettings";

// HR Management Pages
import HRDashboard from "./pages/HR/HRDashboard";
import EmployeeManagement from "./pages/HR/EmployeeManagement";
import AttendanceManagement from "./pages/HR/AttendanceManagement";
import LeaveManagement from "./pages/HR/LeaveManagement";
import PayrollManagement from "./pages/HR/PayrollManagement";
import HRRecruitment from "./pages/HR/Recruitment";
import HRTraining from "./pages/HR/Training";
import HRPerformance from "./pages/HR/Performance";
import HRBenefits from "./pages/HR/Benefits";
import HRContracts from "./pages/HR/Contracts";
import HRDocuments from "./pages/HR/Documents";
import HRShifts from "./pages/HR/Shifts";
import HRReports from "./pages/HR/Reports";

// Warehouse Management Pages
import WarehouseDashboard from "./pages/Warehouse/WarehouseDashboard";
import WarehouseManagement from "./pages/Warehouse/WarehouseManagement";
import StockMovement from "./pages/Warehouse/StockMovement";
import InventoryItems from "./pages/Warehouse/InventoryItems";
import WarehouseStockTaking from "./pages/Warehouse/StockTaking";
import WarehouseReports from "./pages/Warehouse/WarehouseReports";

// Fleet Management Pages
import FleetDashboard from "./pages/Fleet/FleetDashboard";
import FleetVehicleManagement from "./pages/Fleet/VehicleManagement";
import VehicleTracking from "./pages/Fleet/VehicleTracking";
import FuelManagement from "./pages/Fleet/FuelManagement";
import DriverManagement from "./pages/Fleet/DriverManagement";

// Maintenance Management Pages
import MaintenanceDashboard from "./pages/Maintenance/MaintenanceDashboard";
import MaintenanceRequests from "./pages/Maintenance/MaintenanceRequests";
import ScheduledMaintenance from "./pages/Maintenance/ScheduledMaintenance";
import TechnicianManagement from "./pages/Maintenance/TechnicianManagement";
import MaintenanceReports from "./pages/Maintenance/MaintenanceReports";

// Marketing & Sales Management Pages
import MarketingDashboard from "./pages/Marketing/MarketingDashboard";
import CampaignManagement from "./pages/Marketing/CampaignManagement";
import LeadManagement from "./pages/Marketing/LeadManagement";
import SalesManagement from "./pages/Marketing/SalesManagement";

// HCM Pages
import HCMDashboard from './pages/HCM/HCMDashboard';
import Recruitment from './pages/HCM/Recruitment';
import ContractManagementPage from './pages/HCM/ContractManagement';
import EmployeeFiles from './pages/HCM/EmployeeFiles';
import Payroll from './pages/HCM/Payroll';
import Attendance from './pages/HCM/Attendance';
import Performance from './pages/HCM/Performance';
import Offboarding from './pages/HCM/Offboarding';
import EmployeeSelfService from './pages/HCM/EmployeeSelfService';
import CapitalManagement from './pages/HCM/CapitalManagement';
import HCMReports from './pages/HCM/Reports';
import EmployeesReport from './pages/HCM/Reports/EmployeesReport';
import PayrollReport from './pages/HCM/Reports/PayrollReport';
import AttendanceReport from './pages/HCM/Reports/AttendanceReport';
import RecruitmentReport from './pages/HCM/Reports/RecruitmentReport';
import PerformanceReport from './pages/HCM/Reports/PerformanceReport';
import OffboardingReport from './pages/HCM/Reports/OffboardingReport';
import AIManagement from './pages/HCM/AIManagement';
import HCMSettings from './pages/HCM/HCMSettings';
import OrganizationalStructure from './pages/HCM/Settings/OrganizationalStructure';
import JobDefinitions from './pages/HCM/Settings/JobDefinitions';
import SalaryScales from './pages/HCM/Settings/SalaryScales';
import WorkShifts from './pages/HCM/Settings/WorkShifts';
import AdministrativeDefinitions from './pages/HCM/Settings/AdministrativeDefinitions';
import SocialInsuranceSettings from './pages/HCM/Settings/SocialInsuranceSettings';
import RecruitmentPolicies from './pages/HCM/Settings/RecruitmentPolicies';
import PromotionPolicies from './pages/HCM/Settings/PromotionPolicies';
import LeavePolicies from './pages/HCM/Settings/LeavePolicies';
import AttendancePolicies from './pages/HCM/Settings/AttendancePolicies';
import OvertimePolicies from './pages/HCM/Settings/OvertimePolicies';
import DocumentAlerts from './pages/HCM/Settings/DocumentAlerts';
import SalaryPolicies from './pages/HCM/Settings/SalaryPolicies';
import PerformancePolicies from './pages/HCM/Settings/PerformancePolicies';
import ExitPolicies from './pages/HCM/Settings/ExitPolicies';
import HealthSafetyPolicies from './pages/HCM/Settings/HealthSafetyPolicies';
import DocumentTemplates from './pages/HCM/Settings/DocumentTemplates';
import WorkflowAutomation from './pages/HCM/Settings/WorkflowAutomation';
import SelfService from './pages/HCM/Settings/SelfService';
import DigitalArchive from './pages/HCM/Settings/DigitalArchive';
import AnalyticalIndicators from './pages/HCM/Settings/AnalyticalIndicators';

// Accounts Pages
import AccountsDashboard from './pages/Accounts/AccountsDashboard';

// Fixed Assets Pages
import FixedAssetsDashboard from './pages/FixedAssets/FixedAssetsDashboard';

// Accounting Operations Pages
import AccountingOperationsDashboard from './pages/AccountingOperations/AccountingOperationsDashboard';

// Financial Reports Pages
import FinancialReportsDashboard from './pages/FinancialReports/FinancialReportsDashboard';

// Administration Pages
import AdministrationDashboard from './pages/Administration/AdministrationDashboard';
import DocumentManagement from './pages/Administration/DocumentManagement';
import GeneralServices from './pages/Administration/GeneralServices';
import PropertyMaintenance from './pages/Administration/PropertyMaintenance';

// Quality Development Pages
import QualityDevelopmentDashboard from './pages/QualityDevelopment/QualityDevelopmentDashboard';
import QualityPolicies from './pages/QualityDevelopment/QualityPolicies';

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background" dir="rtl">
      <div className="flex-1 flex flex-col min-w-0 order-1">
        <Header />
        <main className="flex-1 p-6 overflow-auto custom-scrollbar">
          {children}
        </main>
      </div>
      <AppSidebar />
    </div>
  </SidebarProvider>
);

const MemoizedToaster = memo(Toaster);
const MemoizedSonner = memo(Sonner);

const App = () => {
  const [showBackendNotification, setShowBackendNotification] = useState(true);
  const [showSonner, setShowSonner] = useState(false);
  
  React.useEffect(() => {
    // Delay Sonner rendering to avoid potential state conflicts
    const timer = setTimeout(() => setShowSonner(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <ErrorBoundary>
      {showSonner && <MemoizedSonner />}
      <BackendStatusNotification 
        isVisible={showBackendNotification}
        onDismiss={() => setShowBackendNotification(false)}
      />
      <Router>
        <SupportChatbot />
        <Routes>
                <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<ProtectedRoute><Layout><UserProfile /></Layout></ProtectedRoute>} />
                <Route path="/user-settings" element={<ProtectedRoute><Layout><UserSettings /></Layout></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/settings/company" element={
              <ProtectedRoute>
                <Layout>
                  <CompanySettings />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings/branches" element={
              <ProtectedRoute>
                <Layout>
                  <BranchSettings />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings/warehouses" element={
              <ProtectedRoute>
                <Layout>
                  <Warehouses />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings/users" element={
              <ProtectedRoute>
                <Layout>
                  <UsersSettings />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings/roles" element={
              <ProtectedRoute>
                <Layout>
                  <RolesPermissions />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings/themes" element={
              <ProtectedRoute>
                <Layout>
                  <ThemeSettings />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings/system" element={
              <ProtectedRoute>
                <Layout>
                  <SystemSettings />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings/devices" element={
              <ProtectedRoute>
                <Layout>
                  <ExternalDevicesSettings />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings/advanced" element={
              <ProtectedRoute>
                <Layout>
                  <AdvancedSettings />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings/security" element={
              <ProtectedRoute>
                <Layout>
                  <AdvancedSettings />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings/account" element={
              <ProtectedRoute>
                <Layout>
                  <UserSettings />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute>
                <Layout>
                  <InventoryDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/inventory/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <InventoryDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/items" element={
              <ProtectedRoute>
                <Layout>
                  <Items />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/add-item" element={
              <ProtectedRoute>
                <Layout>
                  <AddItemPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/inventory/price-list" element={
              <ProtectedRoute>
                <Layout>
                  <PriceList />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/suppliers" element={
              <ProtectedRoute>
                <Layout>
                  <Suppliers />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/suppliers/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <SupplierManagementDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/suppliers/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Suppliers />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/suppliers/management" element={
              <Layout>
                <Suppliers />
              </Layout>
            } />
            <Route path="/suppliers/contracts" element={
              <Layout>
                <Suppliers />
              </Layout>
            } />
            <Route path="/suppliers/payments" element={
              <Layout>
                <Suppliers />
              </Layout>
            } />
            <Route path="/suppliers/evaluation" element={
              <Layout>
                <Suppliers />
              </Layout>
            } />
            <Route path="/suppliers/reports" element={
              <Layout>
                <Suppliers />
              </Layout>
            } />
            <Route path="/purchase-orders" element={
              <Layout>
                <PurchaseOrders />
              </Layout>
            } />
            <Route path="/quick-purchase-orders" element={
              <Layout>
                <QuickPurchaseOrder />
              </Layout>
            } />
            
            {/* Finance Routes */}
            <Route path="/finance/dashboard" element={
              <Layout>
                <FinanceDashboard />
              </Layout>
            } />
            <Route path="/finance/expenses" element={
              <Layout>
                <ExpenseManagement />
              </Layout>
            } />
            <Route path="/finance/revenues" element={
              <Layout>
                <RevenueManagement />
              </Layout>
            } />
            <Route path="/finance/expense-reports" element={
              <Layout>
                <ExpenseReports />
              </Layout>
            } />
            <Route path="/finance/revenue-reports" element={
              <Layout>
                <RevenueReports />
              </Layout>
            } />
            <Route path="/finance/analysis" element={
              <Layout>
                <FinancialAnalysis />
              </Layout>
            } />
            <Route path="/finance/profit-loss" element={
              <Layout>
                <ProfitLoss />
              </Layout>
            } />
            
            <Route path="/goods-receipt" element={
              <Layout>
                <GoodsReceipt />
              </Layout>
            } />
            <Route path="/invoice-processing" element={
              <Layout>
                <InvoiceProcessing />
              </Layout>
            } />
            <Route path="/purchase-returns" element={
              <Layout>
                <PurchaseReturns />
              </Layout>
            } />
            <Route path="/debit-note" element={
              <Layout>
                <DebitNote />
              </Layout>
            } />
            <Route path="/inventory-transactions" element={
              <Layout>
                <InventoryTransactions />
              </Layout>
            } />
            <Route path="/inventory/opening-stock" element={
              <Layout>
                <OpeningStock />
              </Layout>
            } />
            <Route path="/inventory/settings" element={
              <Layout>
                <WarehouseSettings />
              </Layout>
            } />
            <Route path="/procurement/settings" element={
              <Layout>
                <ProcurementSettings />
              </Layout>
            } />
            <Route path="/procurement/requisition" element={
              <Layout>
                <PurchaseRequisition />
              </Layout>
            } />
            <Route path="/procurement/rfq" element={
              <Layout>
                <RequestForQuotation />
              </Layout>
            } />
            <Route path="/procurement/approval" element={
              <Layout>
                <ApprovalWorkflow />
              </Layout>
            } />
            <Route path="/inventory/movement-log" element={
              <Layout>
                <InventoryMovementLog />
              </Layout>
            } />
            <Route path="/inventory/stocktaking" element={
              <Layout>
                <StockTaking />
              </Layout>
            } />
            <Route path="/inventory/policies" element={
              <Layout>
                <InventoryPolicies />
              </Layout>
            } />
            <Route path="/inventory/analytics" element={
              <Layout>
                <InventoryAnalytics />
              </Layout>
            } />
            <Route path="/inventory/reports" element={
              <Layout>
                <InventoryReports />
              </Layout>
            } />
                            <Route path="/pos" element={<ProtectedRoute><Layout><SimplePOSSystem /></Layout></ProtectedRoute>} />
                            <Route path="/pos/dashboard" element={<ProtectedRoute><Layout><POSDashboard /></Layout></ProtectedRoute>} />
                <Route path="/pos/orders" element={
                  <ProtectedRoute>
                    <Layout>
                      <ActiveOrders />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/pos/shifts" element={
                  <ProtectedRoute>
                    <Layout>
                      <ShiftManagement />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/pos/outstanding-invoices" element={
                  <ProtectedRoute>
                    <Layout>
                      <OutstandingInvoices />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/pos/operations-log" element={
                  <ProtectedRoute>
                    <Layout>
                      <OperationsLog />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/pos/reports" element={
                  <ProtectedRoute>
                    <Layout>
                      <ReportsHub />
                    </Layout>
                  </ProtectedRoute>
                } />
                          <Route path="/pos/reports/categories-sales" element={
                <ProtectedRoute>
                  <Layout>
                    <CategoriesSalesReport />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/pos/reports/products-services" element={
                <ProtectedRoute>
                  <Layout>
                    <ProductsServicesReport />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/pos/reports/shifts-sales" element={
                <ProtectedRoute>
                  <Layout>
                    <ShiftsSalesReport />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/pos/reports/shifts-detailed" element={
                <ProtectedRoute>
                  <Layout>
                    <ShiftsDetailedReport />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/pos/reports/shifts-profitability" element={
                <ProtectedRoute>
                  <Layout>
                    <ShiftsProfitabilityReport />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/pos/reports/categories-profitability" element={
                <ProtectedRoute>
                  <Layout>
                    <CategoriesProfitabilityReport />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/pos/reports/products-profitability" element={
                <ProtectedRoute>
                  <Layout>
                    <ProductsProfitabilityReport />
                  </Layout>
                </ProtectedRoute>
              } />
                          <Route path="/pos/evaluation" element={
                <ProtectedRoute>
                  <Layout>
                    <EvaluationManagement />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/pos/evaluation-management" element={
                <ProtectedRoute>
                  <Layout>
                    <EvaluationManagement />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/pos/evaluation-forms/checkup" element={
                <ProtectedRoute>
                  <Layout>
                    <CheckUpForm />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/pos/evaluation-forms/history" element={
                <ProtectedRoute>
                  <Layout>
                    <EvaluationHistory />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/pos/evaluation-forms/reports" element={
                <ProtectedRoute>
                  <Layout>
                    <EvaluationReports />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/pos/customer-satisfaction-analysis" element={
                <ProtectedRoute>
                  <Layout>
                    <CustomerSatisfactionAnalysis />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/pos/customer-payments" element={
                <ProtectedRoute>
                  <Layout>
                    <CustomerPayments />
                  </Layout>
                </ProtectedRoute>
              } />
            <Route path="/settings/pos-settings" element={<ProtectedRoute><Layout><POSSettings /></Layout></ProtectedRoute>} />
            <Route path="/settings/pos-devices" element={<ProtectedRoute><Layout><POSDevicesSettings /></Layout></ProtectedRoute>} />
            <Route path="/settings/pos-payment" element={<ProtectedRoute><Layout><POSPaymentSettings /></Layout></ProtectedRoute>} />
            <Route path="/settings/pos-invoice" element={<ProtectedRoute><Layout><POSInvoiceSettings /></Layout></ProtectedRoute>} />
            <Route path="/settings/pos-security" element={<ProtectedRoute><Layout><POSSecuritySettings /></Layout></ProtectedRoute>} />
            <Route path="/settings/pos-inventory" element={<ProtectedRoute><Layout><POSInventorySettings /></Layout></ProtectedRoute>} />
            <Route path="/settings/pos-notifications" element={<ProtectedRoute><Layout><POSNotificationsSettings /></Layout></ProtectedRoute>} />
            <Route path="/settings/pos-reports" element={<ProtectedRoute><Layout><POSReportsSettings /></Layout></ProtectedRoute>} />
            <Route path="/crm" element={<ProtectedRoute><Layout><CRMDashboard /></Layout></ProtectedRoute>} />
            <Route path="/crm/dashboard" element={<ProtectedRoute><Layout><CRMDashboard /></Layout></ProtectedRoute>} />
            <Route path="/crm/customers" element={<ProtectedRoute><Layout><CustomerManagement /></Layout></ProtectedRoute>} />
            <Route path="/crm/customer-management" element={<ProtectedRoute><Layout><CustomerManagement /></Layout></ProtectedRoute>} />
            <Route path="/crm/customers/new" element={<ProtectedRoute><Layout><CustomerManagement /></Layout></ProtectedRoute>} />
            <Route path="/crm/vehicles" element={<ProtectedRoute><Layout><VehicleManagement /></Layout></ProtectedRoute>} />
            <Route path="/crm/campaigns" element={<ProtectedRoute><Layout><MarketingCampaigns /></Layout></ProtectedRoute>} />
            <Route path="/crm/campaigns/new" element={<ProtectedRoute><Layout><MarketingCampaigns /></Layout></ProtectedRoute>} />
            <Route path="/crm/feedback" element={<ProtectedRoute><Layout><CustomerFeedback /></Layout></ProtectedRoute>} />
            <Route path="/crm/survey" element={<ProtectedRoute><Layout><CustomerSurvey /></Layout></ProtectedRoute>} />
            <Route path="/crm/surveys" element={<ProtectedRoute><Layout><SurveyManagement /></Layout></ProtectedRoute>} />
            <Route path="/crm/coupons" element={<ProtectedRoute><Layout><CouponsManagement /></Layout></ProtectedRoute>} />
            <Route path="/crm/subscriptions" element={<ProtectedRoute><Layout><SubscriptionManagement /></Layout></ProtectedRoute>} />
            <Route path="/crm/subscription-transfers" element={<ProtectedRoute><Layout><SubscriptionTransfers /></Layout></ProtectedRoute>} />
            <Route path="/crm/subscription-refunds" element={<ProtectedRoute><Layout><SubscriptionRefunds /></Layout></ProtectedRoute>} />
            <Route path="/crm/loyalty" element={<ProtectedRoute><Layout><LoyaltyPointsManagement /></Layout></ProtectedRoute>} />
            <Route path="/crm/cards" element={<ProtectedRoute><Layout><CardManagement /></Layout></ProtectedRoute>} />

            <Route path="/reception" element={<ProtectedRoute><Layout><UnifiedReceptionDashboard /></Layout></ProtectedRoute>} />
            <Route path="/reception/dashboard" element={<ProtectedRoute><Layout><UnifiedReceptionDashboard /></Layout></ProtectedRoute>} />
            <Route path="/reception/tracking" element={<ProtectedRoute><Layout><OperationsManagement /></Layout></ProtectedRoute>} />
            <Route path="/operations/management" element={<ProtectedRoute><Layout><OperationsManagement /></Layout></ProtectedRoute>} />
            <Route path="/reception/operations-management" element={<ProtectedRoute><Layout><OperationsManagement /></Layout></ProtectedRoute>} />
            <Route path="/reception/operations-management/work-orders" element={<ProtectedRoute><Layout><WorkOrderManagement /></Layout></ProtectedRoute>} />
            <Route path="/reception/customer-service" element={<ProtectedRoute><Layout><CustomerService /></Layout></ProtectedRoute>} />
            <Route path="/reception/booking-dashboard" element={<ProtectedRoute><Layout><BookingDashboard /></Layout></ProtectedRoute>} />
            <Route path="/reception/create-booking" element={<ProtectedRoute><Layout><CreateBooking /></Layout></ProtectedRoute>} />
            <Route path="/reception/bookings-list" element={<ProtectedRoute><Layout><BookingsList /></Layout></ProtectedRoute>} />
            <Route path="/reception/booking-calendar" element={<ProtectedRoute><Layout><BookingCalendar /></Layout></ProtectedRoute>} />
            <Route path="/reception/booking-analytics" element={<ProtectedRoute><Layout><BookingAnalytics /></Layout></ProtectedRoute>} />
            <Route path="/reception/table-management" element={<ProtectedRoute><Layout><TableManagement /></Layout></ProtectedRoute>} />
            <Route path="/reception/live-control-center" element={<ProtectedRoute><Layout><LiveControlCenter /></Layout></ProtectedRoute>} />
            
            {/* Shifts Routes */}
            <Route path="/shifts" element={<ProtectedRoute><Layout><ShiftsList /></Layout></ProtectedRoute>} />
            <Route path="/shifts/add" element={<ProtectedRoute><Layout><AddShift /></Layout></ProtectedRoute>} />
            <Route path="/shifts/edit/:id" element={<ProtectedRoute><Layout><EditShift /></Layout></ProtectedRoute>} />
            <Route path="/shifts/:shiftId/revenue" element={<ProtectedRoute><Layout><ShiftRevenue /></Layout></ProtectedRoute>} />
            <Route path="/shifts/daily-report" element={<ProtectedRoute><Layout><DailyShiftReport /></Layout></ProtectedRoute>} />
            <Route path="/reception/reports" element={<ProtectedRoute><Layout><ReceptionReports /></Layout></ProtectedRoute>} />
            <Route path="/reception/notifications" element={<ProtectedRoute><Layout><CustomerNotifications /></Layout></ProtectedRoute>} />
            <Route path="/reception/integration" element={<ProtectedRoute><Layout><SystemIntegration /></Layout></ProtectedRoute>} />
            <Route path="/reception/system-integration" element={<ProtectedRoute><Layout><SystemIntegration /></Layout></ProtectedRoute>} />
            
            
            {/* Mobile Wash Routes */}
            <Route path="/mobile-wash" element={<ProtectedRoute><Layout><MobileWashDashboard /></Layout></ProtectedRoute>} />
            <Route path="/mobile-wash/dashboard" element={<ProtectedRoute><Layout><MobileWashDashboard /></Layout></ProtectedRoute>} />
            <Route path="/mobile-wash/bookings" element={<ProtectedRoute><Layout><BookingManagement /></Layout></ProtectedRoute>} />
            <Route path="/mobile-wash/booking-management" element={<ProtectedRoute><Layout><BookingManagement /></Layout></ProtectedRoute>} />
            <Route path="/mobile-wash/fleet" element={<ProtectedRoute><Layout><FleetManagement /></Layout></ProtectedRoute>} />
            <Route path="/mobile-wash/fleet-management" element={<ProtectedRoute><Layout><FleetManagement /></Layout></ProtectedRoute>} />
            <Route path="/mobile-wash/tracking" element={<ProtectedRoute><Layout><LiveTracking /></Layout></ProtectedRoute>} />
            <Route path="/mobile-wash/live-tracking" element={<ProtectedRoute><Layout><LiveTracking /></Layout></ProtectedRoute>} />
            <Route path="/mobile-wash/quality" element={<ProtectedRoute><Layout><QualityManagement /></Layout></ProtectedRoute>} />
            <Route path="/mobile-wash/quality-management" element={<ProtectedRoute><Layout><QualityManagement /></Layout></ProtectedRoute>} />
            <Route path="/mobile-wash/app" element={<ProtectedRoute><Layout><MobileAppManagement /></Layout></ProtectedRoute>} />
            <Route path="/mobile-wash/mobile-app" element={<ProtectedRoute><Layout><MobileAppManagement /></Layout></ProtectedRoute>} />
            <Route path="/mobile-wash/app-management" element={<ProtectedRoute><Layout><MobileAppManagement /></Layout></ProtectedRoute>} />

            {/* Motorcycle Management Routes */}
            <Route path="/motorcycle-management" element={<ProtectedRoute><Layout><MotorcycleDashboard /></Layout></ProtectedRoute>} />
            <Route path="/motorcycle-management/dashboard" element={<ProtectedRoute><Layout><MotorcycleDashboard /></Layout></ProtectedRoute>} />
            <Route path="/motorcycle-management/motorcycles" element={<ProtectedRoute><Layout><MotorcycleList /></Layout></ProtectedRoute>} />
            <Route path="/motorcycle-management/motorcycles/new" element={<ProtectedRoute><Layout><MotorcycleForm /></Layout></ProtectedRoute>} />
            <Route path="/motorcycle-management/motorcycles/:id" element={<ProtectedRoute><Layout><MotorcycleForm /></Layout></ProtectedRoute>} />
            <Route path="/motorcycle-management/motorcycles/:id/edit" element={<ProtectedRoute><Layout><MotorcycleForm /></Layout></ProtectedRoute>} />
            <Route path="/motorcycle-management/orders" element={<ProtectedRoute><Layout><DeliveryOrderList /></Layout></ProtectedRoute>} />
            <Route path="/motorcycle-management/orders/new" element={<ProtectedRoute><Layout><DeliveryOrderForm /></Layout></ProtectedRoute>} />
            <Route path="/motorcycle-management/orders/:id" element={<ProtectedRoute><Layout><DeliveryOrderForm /></Layout></ProtectedRoute>} />
            <Route path="/motorcycle-management/orders/:id/edit" element={<ProtectedRoute><Layout><DeliveryOrderForm /></Layout></ProtectedRoute>} />
            <Route path="/motorcycle-management/drivers" element={<ProtectedRoute><Layout><DeliveryDriverList /></Layout></ProtectedRoute>} />
            <Route path="/motorcycle-management/drivers/new" element={<ProtectedRoute><Layout><DeliveryDriverForm /></Layout></ProtectedRoute>} />
            <Route path="/motorcycle-management/drivers/:id" element={<ProtectedRoute><Layout><DeliveryDriverForm /></Layout></ProtectedRoute>} />
            <Route path="/motorcycle-management/drivers/:id/edit" element={<ProtectedRoute><Layout><DeliveryDriverForm /></Layout></ProtectedRoute>} />
            <Route path="/motorcycle-management/maintenance" element={<ProtectedRoute><Layout><MaintenanceList /></Layout></ProtectedRoute>} />
            <Route path="/motorcycle-management/maintenance/new" element={<ProtectedRoute><Layout><MaintenanceForm /></Layout></ProtectedRoute>} />
            <Route path="/motorcycle-management/maintenance/:id" element={<ProtectedRoute><Layout><MaintenanceForm /></Layout></ProtectedRoute>} />
            <Route path="/motorcycle-management/maintenance/:id/edit" element={<ProtectedRoute><Layout><MaintenanceForm /></Layout></ProtectedRoute>} />

            {/* HCM Routes */}
            <Route path="/hcm" element={<ProtectedRoute><Layout><HCMDashboard /></Layout></ProtectedRoute>} />
            <Route path="/hcm/recruitment" element={<ProtectedRoute><Layout><Recruitment /></Layout></ProtectedRoute>} />
            <Route path="/hcm/contracts" element={<ProtectedRoute><Layout><ContractManagementPage /></Layout></ProtectedRoute>} />
            <Route path="/hcm/employee-files" element={<ProtectedRoute><Layout><EmployeeFiles /></Layout></ProtectedRoute>} />
            <Route path="/hcm/payroll" element={<ProtectedRoute><Layout><Payroll /></Layout></ProtectedRoute>} />
            <Route path="/hcm/attendance" element={<ProtectedRoute><Layout><Attendance /></Layout></ProtectedRoute>} />
            <Route path="/hcm/performance" element={<ProtectedRoute><Layout><Performance /></Layout></ProtectedRoute>} />
            <Route path="/hcm/offboarding" element={<ProtectedRoute><Layout><Offboarding /></Layout></ProtectedRoute>} />
            <Route path="/hcm/self-service" element={<ProtectedRoute><Layout><EmployeeSelfService /></Layout></ProtectedRoute>} />
            <Route path="/hcm/capital-management" element={<ProtectedRoute><Layout><CapitalManagement /></Layout></ProtectedRoute>} />
            <Route path="/hcm/reports" element={<ProtectedRoute><Layout><HCMReports /></Layout></ProtectedRoute>} />
            <Route path="/hcm/reports/employees" element={<ProtectedRoute><Layout><EmployeesReport /></Layout></ProtectedRoute>} />
            <Route path="/hcm/reports/payroll" element={<ProtectedRoute><Layout><PayrollReport /></Layout></ProtectedRoute>} />
            <Route path="/hcm/reports/attendance" element={<ProtectedRoute><Layout><AttendanceReport /></Layout></ProtectedRoute>} />
            <Route path="/hcm/reports/recruitment" element={<ProtectedRoute><Layout><RecruitmentReport /></Layout></ProtectedRoute>} />
            <Route path="/hcm/reports/performance" element={<ProtectedRoute><Layout><PerformanceReport /></Layout></ProtectedRoute>} />
            <Route path="/hcm/reports/offboarding" element={<ProtectedRoute><Layout><OffboardingReport /></Layout></ProtectedRoute>} />
            <Route path="/hcm/ai-management" element={<ProtectedRoute><Layout><AIManagement /></Layout></ProtectedRoute>} />
            <Route path="/hcm/settings" element={<ProtectedRoute><Layout><HCMSettings /></Layout></ProtectedRoute>} />
            <Route path="/hcm/settings/organizational-structure" element={<ProtectedRoute><Layout><OrganizationalStructure /></Layout></ProtectedRoute>} />
            <Route path="/hcm/settings/job-definitions" element={<ProtectedRoute><Layout><JobDefinitions /></Layout></ProtectedRoute>} />
            <Route path="/hcm/settings/salary-scales" element={<ProtectedRoute><Layout><SalaryScales /></Layout></ProtectedRoute>} />
            <Route path="/hcm/settings/work-shifts" element={<ProtectedRoute><Layout><WorkShifts /></Layout></ProtectedRoute>} />
            <Route path="/hcm/settings/administrative-definitions" element={<ProtectedRoute><Layout><AdministrativeDefinitions /></Layout></ProtectedRoute>} />
            <Route path="/hcm/settings/social-insurance" element={<ProtectedRoute><Layout><SocialInsuranceSettings /></Layout></ProtectedRoute>} />
            <Route path="/hcm/settings/recruitment-policies" element={<ProtectedRoute><Layout><RecruitmentPolicies /></Layout></ProtectedRoute>} />
            <Route path="/hcm/settings/promotion-policies" element={<ProtectedRoute><Layout><PromotionPolicies /></Layout></ProtectedRoute>} />
            <Route path="/hcm/settings/leave-policies" element={<ProtectedRoute><Layout><LeavePolicies /></Layout></ProtectedRoute>} />
            <Route path="/hcm/settings/attendance-policies" element={<ProtectedRoute><Layout><AttendancePolicies /></Layout></ProtectedRoute>} />
            <Route path="/hcm/settings/overtime-policies" element={<ProtectedRoute><Layout><OvertimePolicies /></Layout></ProtectedRoute>} />
            <Route path="/hcm/settings/document-alerts" element={<ProtectedRoute><Layout><DocumentAlerts /></Layout></ProtectedRoute>} />
            <Route path="/hcm/settings/salary-policies" element={<ProtectedRoute><Layout><SalaryPolicies /></Layout></ProtectedRoute>} />
            <Route path="/hcm/settings/performance-policies" element={<ProtectedRoute><Layout><PerformancePolicies /></Layout></ProtectedRoute>} />
            <Route path="/hcm/settings/exit-policies" element={<ProtectedRoute><Layout><ExitPolicies /></Layout></ProtectedRoute>} />
            <Route path="/hcm/settings/health-safety" element={<ProtectedRoute><Layout><HealthSafetyPolicies /></Layout></ProtectedRoute>} />
            <Route path="/hcm/settings/document-templates" element={<ProtectedRoute><Layout><DocumentTemplates /></Layout></ProtectedRoute>} />
          <Route path="/hcm/settings/workflow-automation" element={<ProtectedRoute><Layout><WorkflowAutomation /></Layout></ProtectedRoute>} />
          <Route path="/hcm/settings/self-service" element={<ProtectedRoute><Layout><SelfService /></Layout></ProtectedRoute>} />
          <Route path="/hcm/settings/digital-archive" element={<ProtectedRoute><Layout><DigitalArchive /></Layout></ProtectedRoute>} />
          <Route path="/hcm/settings/analytics-indicators" element={<ProtectedRoute><Layout><AnalyticalIndicators /></Layout></ProtectedRoute>} />

            {/* Accounts Routes */}
            <Route path="/accounts" element={<ProtectedRoute><Layout><AccountsDashboard /></Layout></ProtectedRoute>} />
            <Route path="/accounts/dashboard" element={<ProtectedRoute><Layout><AccountsDashboard /></Layout></ProtectedRoute>} />

            {/* Fixed Assets Routes */}
            <Route path="/fixed-assets" element={<ProtectedRoute><Layout><FixedAssetsDashboard /></Layout></ProtectedRoute>} />
            <Route path="/fixed-assets/dashboard" element={<ProtectedRoute><Layout><FixedAssetsDashboard /></Layout></ProtectedRoute>} />

            {/* Accounting Operations Routes */}
            <Route path="/accounting-operations" element={<ProtectedRoute><Layout><AccountingOperationsDashboard /></Layout></ProtectedRoute>} />
            <Route path="/accounting-operations/dashboard" element={<ProtectedRoute><Layout><AccountingOperationsDashboard /></Layout></ProtectedRoute>} />

            {/* Financial Reports Routes */}
            <Route path="/financial-reports" element={<ProtectedRoute><Layout><FinancialReportsDashboard /></Layout></ProtectedRoute>} />
            
            {/* Accounting Routes */}
            <Route path="/accounting" element={<ProtectedRoute><Layout><AccountingDashboard /></Layout></ProtectedRoute>} />
            <Route path="/accounting/dashboard" element={<ProtectedRoute><Layout><AccountingDashboard /></Layout></ProtectedRoute>} />
            <Route path="/accounting/journal-entries" element={<ProtectedRoute><Layout><JournalEntries /></Layout></ProtectedRoute>} />
            <Route path="/accounting/chart-of-accounts" element={<ProtectedRoute><Layout><ChartOfAccounts /></Layout></ProtectedRoute>} />
            <Route path="/accounting/income-statement" element={<ProtectedRoute><Layout><IncomeStatement /></Layout></ProtectedRoute>} />
            <Route path="/accounting/balance-sheet" element={<ProtectedRoute><Layout><BalanceSheet /></Layout></ProtectedRoute>} />
            <Route path="/accounting/cash-flow" element={<ProtectedRoute><Layout><CashFlow /></Layout></ProtectedRoute>} />
            <Route path="/accounting/trial-balance" element={<ProtectedRoute><Layout><TrialBalance /></Layout></ProtectedRoute>} />
            <Route path="/accounting/account-statement" element={<ProtectedRoute><Layout><AccountStatement /></Layout></ProtectedRoute>} />
            <Route path="/accounting/general-ledger" element={<ProtectedRoute><Layout><GeneralLedger /></Layout></ProtectedRoute>} />
            <Route path="/accounting/settings" element={<ProtectedRoute><Layout><AccountingSettings /></Layout></ProtectedRoute>} />
            
            {/* Administration Routes */}
            <Route path="/administration" element={<ProtectedRoute><Layout><AdministrationDashboard /></Layout></ProtectedRoute>} />
            <Route path="/administration/documents" element={<ProtectedRoute><Layout><DocumentManagement /></Layout></ProtectedRoute>} />
            <Route path="/administration/services" element={<ProtectedRoute><Layout><GeneralServices /></Layout></ProtectedRoute>} />
            <Route path="/administration/property" element={<ProtectedRoute><Layout><PropertyMaintenance /></Layout></ProtectedRoute>} />
            <Route path="/financial-reports/dashboard" element={<ProtectedRoute><Layout><FinancialReportsDashboard /></Layout></ProtectedRoute>} />
            
            {/* Quality Development Routes */}
            <Route path="/quality-development" element={<ProtectedRoute><Layout><QualityDevelopmentDashboard /></Layout></ProtectedRoute>} />
            <Route path="/quality-development/dashboard" element={<ProtectedRoute><Layout><QualityDevelopmentDashboard /></Layout></ProtectedRoute>} />
            <Route path="/quality-development/policies" element={<ProtectedRoute><Layout><QualityPolicies /></Layout></ProtectedRoute>} />
            
            {/* Gym Management Routes */}
            <Route path="/gym" element={<ProtectedRoute><Layout><GymDashboard /></Layout></ProtectedRoute>} />
            <Route path="/gym/dashboard" element={<ProtectedRoute><Layout><GymDashboard /></Layout></ProtectedRoute>} />
            <Route path="/gym/memberships" element={<ProtectedRoute><Layout><MembershipManagement /></Layout></ProtectedRoute>} />
            <Route path="/gym/barcode-management" element={<ProtectedRoute><Layout><BarcodeManagement /></Layout></ProtectedRoute>} />
            <Route path="/gym/subscriptions" element={<ProtectedRoute><Layout><SubscriptionManagementGym /></Layout></ProtectedRoute>} />
            <Route path="/gym/add-subscription" element={<ProtectedRoute><Layout><Subscriptions /></Layout></ProtectedRoute>} />
            <Route path="/gym/special-subscriptions" element={<ProtectedRoute><Layout><SpecialSubscriptions /></Layout></ProtectedRoute>} />
            <Route path="/gym/time-based-special-subscriptions" element={<ProtectedRoute><Layout><TimeBasedSpecialSubscriptions /></Layout></ProtectedRoute>} />
            <Route path="/gym/subscription-member-transfer" element={<ProtectedRoute><Layout><SubscriptionMemberTransfer /></Layout></ProtectedRoute>} />
            <Route path="/gym/member-form" element={<ProtectedRoute><Layout><MemberForm /></Layout></ProtectedRoute>} />
            <Route path="/gym/lockers" element={<ProtectedRoute><Layout><LockersList /></Layout></ProtectedRoute>} />
            <Route path="/gym/add-locker" element={<ProtectedRoute><Layout><AddLocker /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/locker" element={<ProtectedRoute><Layout><LockerSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/workout-programs" element={<ProtectedRoute><Layout><WorkoutPrograms /></Layout></ProtectedRoute>} />
            
            {/* App Management Routes */}
            <Route path="/app/about" element={<ProtectedRoute><Layout><AboutApp /></Layout></ProtectedRoute>} />
            <Route path="/app/invitations/sent" element={<ProtectedRoute><Layout><SentInvitations /></Layout></ProtectedRoute>} />
            <Route path="/app/invitations/accepted" element={<ProtectedRoute><Layout><AcceptedInvitations /></Layout></ProtectedRoute>} />
            <Route path="/app/invitations/attended" element={<ProtectedRoute><Layout><AttendedInvitations /></Layout></ProtectedRoute>} />
            <Route path="/app/invitations/rejected" element={<ProtectedRoute><Layout><RejectedInvitations /></Layout></ProtectedRoute>} />
            <Route path="/app/offers" element={<ProtectedRoute><Layout><AppOffers /></Layout></ProtectedRoute>} />
            <Route path="/app/trainers" element={<ProtectedRoute><Layout><AppTrainers /></Layout></ProtectedRoute>} />
            <Route path="/app/exercise-categories" element={<ProtectedRoute><Layout><ExerciseCategories /></Layout></ProtectedRoute>} />
            <Route path="/app/exercises" element={<ProtectedRoute><Layout><AppExercises /></Layout></ProtectedRoute>} />
            <Route path="/app/news" element={<ProtectedRoute><Layout><AppNews /></Layout></ProtectedRoute>} />
            <Route path="/app/ads" element={<ProtectedRoute><Layout><AppAds /></Layout></ProtectedRoute>} />
            <Route path="/gym/scheduling" element={<ProtectedRoute><Layout><SchedulingManagement /></Layout></ProtectedRoute>} />
            <Route path="/gym/trainers" element={<ProtectedRoute><Layout><TrainerManagement /></Layout></ProtectedRoute>} />
            <Route path="/gym/facilities" element={<ProtectedRoute><Layout><FacilityManagement /></Layout></ProtectedRoute>} />
            <Route path="/gym/spa-services" element={<ProtectedRoute><Layout><ServicesAndMarketing /></Layout></ProtectedRoute>} />
            <Route path="/gym/reports" element={<ProtectedRoute><Layout><ReportsAndSettings /></Layout></ProtectedRoute>} />
            
            {/* Gym Sub-pages Routes */}
            <Route path="/gym/barcode-search" element={<ProtectedRoute><Layout><BarcodeSearch /></Layout></ProtectedRoute>} />
            <Route path="/gym/membership-cards" element={<ProtectedRoute><Layout><MembershipCards /></Layout></ProtectedRoute>} />
            <Route path="/gym/attendance" element={<ProtectedRoute><Layout><MemberAttendance /></Layout></ProtectedRoute>} />
            <Route path="/gym/groups" element={<ProtectedRoute><Layout><GroupsCategories /></Layout></ProtectedRoute>} />
            <Route path="/gym/surveys" element={<ProtectedRoute><Layout><Surveys /></Layout></ProtectedRoute>} />
            <Route path="/gym/online-payments" element={<ProtectedRoute><Layout><OnlinePayments /></Layout></ProtectedRoute>} />
            <Route path="/gym/invoices" element={<ProtectedRoute><Layout><InvoicesReceipts /></Layout></ProtectedRoute>} />
            <Route path="/gym/financial-reports" element={<ProtectedRoute><Layout><FinancialReports /></Layout></ProtectedRoute>} />
            <Route path="/gym/discounts" element={<ProtectedRoute><Layout><DiscountsOffers /></Layout></ProtectedRoute>} />
            <Route path="/gym/workout-templates" element={<ProtectedRoute><Layout><WorkoutTemplates /></Layout></ProtectedRoute>} />
            <Route path="/gym/strength-training" element={<ProtectedRoute><Layout><StrengthTraining /></Layout></ProtectedRoute>} />
            <Route path="/gym/progress-tracking" element={<ProtectedRoute><Layout><ProgressTracking /></Layout></ProtectedRoute>} />
            <Route path="/gym/assessments" element={<ProtectedRoute><Layout><WorkoutPrograms /></Layout></ProtectedRoute>} />
            <Route path="/gym/classes" element={<ProtectedRoute><Layout><Classes /></Layout></ProtectedRoute>} />
            <Route path="/gym/scheduling" element={<ProtectedRoute><Layout><Scheduling /></Layout></ProtectedRoute>} />
            <Route path="/gym/class-booking" element={<ProtectedRoute><Layout><ClassBooking /></Layout></ProtectedRoute>} />
            <Route path="/gym/room-bookings" element={<ProtectedRoute><Layout><SchedulingManagement /></Layout></ProtectedRoute>} />
            <Route path="/gym/personal-sessions" element={<ProtectedRoute><Layout><PersonalSessions /></Layout></ProtectedRoute>} />
            <Route path="/gym/trainer-payments" element={<ProtectedRoute><Layout><TrainerPayments /></Layout></ProtectedRoute>} />
            <Route path="/gym/trainer-search" element={<ProtectedRoute><Layout><TrainerSearch /></Layout></ProtectedRoute>} />
            <Route path="/gym/trainer-ratings" element={<ProtectedRoute><Layout><TrainerManagement /></Layout></ProtectedRoute>} />
            <Route path="/gym/equipment" element={<ProtectedRoute><Layout><FacilityManagement /></Layout></ProtectedRoute>} />
            <Route path="/gym/equipment-maintenance" element={<ProtectedRoute><Layout><FacilityManagement /></Layout></ProtectedRoute>} />
            <Route path="/gym/sales" element={<ProtectedRoute><Layout><ServicesAndMarketing /></Layout></ProtectedRoute>} />
            <Route path="/gym/marketing" element={<ProtectedRoute><Layout><ServicesAndMarketing /></Layout></ProtectedRoute>} />
            <Route path="/gym/loyalty-programs" element={<ProtectedRoute><Layout><ServicesAndMarketing /></Layout></ProtectedRoute>} />
            <Route path="/gym/mobile-app" element={<ProtectedRoute><Layout><ReportsAndSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/support" element={<ProtectedRoute><Layout><ReportsAndSettings /></Layout></ProtectedRoute>} />
            
            {/* Gym Settings Pages - إعدادات كل إدارة */}
            <Route path="/gym/settings/membership" element={<ProtectedRoute><Layout><MembershipSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/subscription-payment" element={<ProtectedRoute><Layout><SubscriptionPaymentSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/workout-programs" element={<ProtectedRoute><Layout><WorkoutProgramsSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/scheduling" element={<ProtectedRoute><Layout><SchedulingSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/trainers" element={<ProtectedRoute><Layout><TrainerSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/facilities" element={<ProtectedRoute><Layout><FacilitySettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/services-marketing" element={<ProtectedRoute><Layout><ServicesMarketingSettings /></Layout></ProtectedRoute>} />
            
            {/* Gym Settings Routes */}
            <Route path="/gym/settings/membership-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/membership-cards-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/attendance-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/groups-categories-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/surveys-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/subscription-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/payment-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/invoice-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/financial-reports-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/discounts-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/workout-programs-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/workout-templates-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/progress-tracking-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/assessments-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/scheduling-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/class-booking-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/room-booking-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/personal-sessions-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/trainer-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/trainer-payments-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/trainer-ratings-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/facility-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/equipment-inventory-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/equipment-maintenance-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/spa-services-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/sales-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/marketing-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/loyalty-programs-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/reports-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/analytics-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/mobile-app-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/general-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/security-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            <Route path="/gym/settings/notifications-settings" element={<ProtectedRoute><Layout><GymSettings /></Layout></ProtectedRoute>} />
            
            {/* HR Management Routes */}
            <Route path="/hr" element={<ProtectedRoute><Layout><HRDashboard /></Layout></ProtectedRoute>} />
            <Route path="/hr/dashboard" element={<ProtectedRoute><Layout><HRDashboard /></Layout></ProtectedRoute>} />
            <Route path="/hr/employees" element={<ProtectedRoute><Layout><EmployeeManagement /></Layout></ProtectedRoute>} />
            <Route path="/hr/attendance" element={<ProtectedRoute><Layout><AttendanceManagement /></Layout></ProtectedRoute>} />
            <Route path="/hr/leaves" element={<ProtectedRoute><Layout><LeaveManagement /></Layout></ProtectedRoute>} />
            <Route path="/hr/payroll" element={<ProtectedRoute><Layout><PayrollManagement /></Layout></ProtectedRoute>} />
            <Route path="/hr/recruitment" element={<ProtectedRoute><Layout><HRRecruitment /></Layout></ProtectedRoute>} />
            <Route path="/hr/training" element={<ProtectedRoute><Layout><HRTraining /></Layout></ProtectedRoute>} />
            <Route path="/hr/performance" element={<ProtectedRoute><Layout><HRPerformance /></Layout></ProtectedRoute>} />
            <Route path="/hr/benefits" element={<ProtectedRoute><Layout><HRBenefits /></Layout></ProtectedRoute>} />
            <Route path="/hr/contracts" element={<ProtectedRoute><Layout><HRContracts /></Layout></ProtectedRoute>} />
            <Route path="/hr/documents" element={<ProtectedRoute><Layout><HRDocuments /></Layout></ProtectedRoute>} />
            <Route path="/hr/shifts" element={<ProtectedRoute><Layout><HRShifts /></Layout></ProtectedRoute>} />
            <Route path="/hr/reports" element={<ProtectedRoute><Layout><HRReports /></Layout></ProtectedRoute>} />
            
            {/* Warehouse Management Routes */}
            <Route path="/warehouse" element={<ProtectedRoute><Layout><WarehouseDashboard /></Layout></ProtectedRoute>} />
            <Route path="/warehouse/dashboard" element={<ProtectedRoute><Layout><WarehouseDashboard /></Layout></ProtectedRoute>} />
            <Route path="/warehouse/management" element={<ProtectedRoute><Layout><WarehouseManagement /></Layout></ProtectedRoute>} />
            <Route path="/warehouse/movement" element={<ProtectedRoute><Layout><StockMovement /></Layout></ProtectedRoute>} />
            <Route path="/warehouse/items" element={<ProtectedRoute><Layout><InventoryItems /></Layout></ProtectedRoute>} />
            <Route path="/warehouse/stock-taking" element={<ProtectedRoute><Layout><WarehouseStockTaking /></Layout></ProtectedRoute>} />
            <Route path="/warehouse/reports" element={<ProtectedRoute><Layout><WarehouseReports /></Layout></ProtectedRoute>} />
            
            {/* Fleet Management Routes */}
            <Route path="/fleet" element={<ProtectedRoute><Layout><FleetDashboard /></Layout></ProtectedRoute>} />
            <Route path="/fleet/dashboard" element={<ProtectedRoute><Layout><FleetDashboard /></Layout></ProtectedRoute>} />
            <Route path="/fleet/vehicles" element={<ProtectedRoute><Layout><FleetVehicleManagement /></Layout></ProtectedRoute>} />
            <Route path="/fleet/tracking" element={<ProtectedRoute><Layout><VehicleTracking /></Layout></ProtectedRoute>} />
            <Route path="/fleet/fuel" element={<ProtectedRoute><Layout><FuelManagement /></Layout></ProtectedRoute>} />
            <Route path="/fleet/drivers" element={<ProtectedRoute><Layout><DriverManagement /></Layout></ProtectedRoute>} />
            
            {/* Maintenance Management Routes */}
            <Route path="/maintenance" element={<ProtectedRoute><Layout><MaintenanceDashboard /></Layout></ProtectedRoute>} />
            <Route path="/maintenance/dashboard" element={<ProtectedRoute><Layout><MaintenanceDashboard /></Layout></ProtectedRoute>} />
            <Route path="/maintenance/requests" element={<ProtectedRoute><Layout><MaintenanceRequests /></Layout></ProtectedRoute>} />
            <Route path="/maintenance/scheduled" element={<ProtectedRoute><Layout><ScheduledMaintenance /></Layout></ProtectedRoute>} />
            <Route path="/maintenance/technicians" element={<ProtectedRoute><Layout><TechnicianManagement /></Layout></ProtectedRoute>} />
            <Route path="/maintenance/reports" element={<ProtectedRoute><Layout><MaintenanceReports /></Layout></ProtectedRoute>} />
            
            {/* Marketing & Sales Management Routes */}
            <Route path="/marketing" element={<ProtectedRoute><Layout><MarketingDashboard /></Layout></ProtectedRoute>} />
            <Route path="/marketing/dashboard" element={<ProtectedRoute><Layout><MarketingDashboard /></Layout></ProtectedRoute>} />
            <Route path="/marketing/campaigns" element={<ProtectedRoute><Layout><CampaignManagement /></Layout></ProtectedRoute>} />
            <Route path="/marketing/leads" element={<ProtectedRoute><Layout><LeadManagement /></Layout></ProtectedRoute>} />
            <Route path="/marketing/sales" element={<ProtectedRoute><Layout><SalesManagement /></Layout></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    );
  };

export default App;
