import { useState, useMemo, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Types for menu items
interface SubMenuItem {
  title: string;
  url: string;
  icon: any;
  color: string;
  description: string;
  badge?: string;
}

interface MenuItem {
  title: string;
  url?: string;
  icon: any;
  color?: string;
  description: string;
  submenu?: SubMenuItem[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}
import {
  Settings,
  Building,
  Palette,
  Database,
  Shield,
  Car,
  Bike,
  FileText,
  BarChart,
  Package,
  Calendar,
  CreditCard,
  Headphones,
  ChevronDown,
  Store,
  TrendingUp,
  Zap,
  Gem,
  Stars,
  Activity,
  MapPin,
  Users,
  DollarSign,
  Globe,
  ShoppingCart,
  CheckCircle,
  Award,
  Target,
  Bookmark,
  ArrowLeft,
  Receipt,
  Monitor,
  Clock,
  User,
  MessageSquare,
  Gift,
  Plus,
  Command,
  Bell,
  LogOut,
  HelpCircle,
  Languages,
  Moon,
  Sun,
  Link,
  ExternalLink,
  Navigation2,
  Smartphone,
  Truck,
  Calculator,
  BarChart3,
  Building2,
  Wrench,
  TrendingDown,
  Table,
  Star,
  Tag,
  UserCog,
  Fuel,
  ClipboardCheck,
  Warehouse,
  Lock,
  Megaphone,
  Newspaper,
  Send,
  FolderTree,
  UserCheck,
  XCircle,
  Scan,
  ArrowRightLeft,
  Undo2,
  List,
  Search,
  BookOpen,
  Wallet,
  PieChart,
  Scale,
  UserPlus,
  GraduationCap,
  Folder,
  RotateCcw,
} from "lucide-react";

const gymSettingsRoutes = [
  { path: "/gym/settings/membership-settings", page: "membership-settings" },
  { path: "/gym/settings/membership-cards-settings", page: "membership-cards-settings" },
  { path: "/gym/settings/attendance-settings", page: "attendance-settings" },
  { path: "/gym/settings/groups-categories-settings", page: "groups-categories-settings" },
  { path: "/gym/settings/surveys-settings", page: "surveys-settings" },
  { path: "/gym/settings/subscription-settings", page: "subscription-settings" },
  { path: "/gym/settings/payment-settings", page: "payment-settings" },
  { path: "/gym/settings/invoice-settings", page: "invoice-settings" },
  { path: "/gym/settings/financial-reports-settings", page: "financial-reports-settings" },
  { path: "/gym/settings/discounts-settings", page: "discounts-settings" },
  { path: "/gym/settings/workout-programs-settings", page: "workout-programs-settings" },
  { path: "/gym/settings/workout-templates-settings", page: "workout-templates-settings" },
  { path: "/gym/settings/progress-tracking-settings", page: "progress-tracking-settings" },
  { path: "/gym/settings/assessments-settings", page: "assessments-settings" },
  { path: "/gym/settings/scheduling-settings", page: "scheduling-settings" },
  { path: "/gym/settings/class-booking-settings", page: "class-booking-settings" },
  { path: "/gym/settings/room-booking-settings", page: "room-booking-settings" },
  { path: "/gym/settings/personal-sessions-settings", page: "personal-sessions-settings" },
  { path: "/gym/settings/trainer-settings", page: "trainer-settings" },
  { path: "/gym/settings/trainer-payments-settings", page: "trainer-payments-settings" },
  { path: "/gym/settings/trainer-ratings-settings", page: "trainer-ratings-settings" },
  { path: "/gym/settings/facility-settings", page: "facility-settings" },
  { path: "/gym/settings/equipment-inventory-settings", page: "equipment-inventory-settings" },
  { path: "/gym/settings/equipment-maintenance-settings", page: "equipment-maintenance-settings" },
  { path: "/gym/settings/spa-services-settings", page: "spa-services-settings" },
  { path: "/gym/settings/sales-settings", page: "sales-settings" },
  { path: "/gym/settings/marketing-settings", page: "marketing-settings" },
  { path: "/gym/settings/loyalty-programs-settings", page: "loyalty-programs-settings" },
  { path: "/gym/settings/reports-settings", page: "reports-settings" },
  { path: "/gym/settings/analytics-settings", page: "analytics-settings" },
  { path: "/gym/settings/mobile-app-settings", page: "mobile-app-settings" },
  { path: "/gym/settings/general-settings", page: "general-settings" },
  { path: "/gym/settings/security-settings", page: "security-settings" },
  { path: "/gym/settings/notifications-settings", page: "notifications-settings" },
];

const gymSettingsPageSlugs = ["club-settings", ...gymSettingsRoutes.map(route => route.page)];

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Main menu structure for Car Wash ERP with enhanced icons and styling
const menuSections: MenuSection[] = [
  {
    title: "",
    items: [
      {
        title: "الرئيسية",
        url: "/dashboard",
        icon: TrendingUp,
        color: "bg-gradient-to-r from-blue-500 to-cyan-500",
        description: "نظرة عامة شاملة على أداء النظام"
      },
    ],
  },
  {
    title: "إدارة النظام",
    items: [
      {
        title: "إدارة النظام",
        icon: Settings,
        url: "/settings",
        color: "bg-gradient-to-r from-amber-700 to-amber-500",
        description: "إعدادات النظام الشاملة",
        submenu: [
          { title: "بيانات الشركة", url: "/settings/company", icon: Building, color: "text-orange-500", description: "معلومات الشركة الأساسية" },
          { title: "الفروع", url: "/settings/branches", icon: Store, color: "text-green-500", description: "إدارة فروع الشركة" },
          { title: "المستخدمون", url: "/settings/users", icon: Users, color: "text-amber-600", description: "إدارة المستخدمين" },
          { title: "الأدوار والصلاحيات", url: "/settings/roles", icon: Shield, color: "text-red-500", description: "تحديد الصلاحيات" },
        ],
      },
    ],
  },
  {
    title: "إدارة النادي الرياضي",
    items: [
      {
        title: "لوحة التحكم",
        icon: BarChart3,
        url: "/gym/dashboard",
        color: "bg-gradient-to-r from-indigo-500 to-blue-600",
        description: "نظرة شاملة على أداء النادي الرياضي",
      },
      {
        title: "إدارة العضوية والأعضاء",
        icon: Users,
        url: "/gym/memberships",
        color: "bg-gradient-to-r from-blue-500 to-cyan-500",
        description: "إدارة شاملة للعضوية والأعضاء",
        submenu: [
          {
            title: "إدارة العضوية",
            url: "/gym/memberships",
            icon: Users,
            color: "text-blue-500",
            description: "إدارة العضوية وسجلات الأعضاء",
          },
          {
            title: "بطاقات العضوية",
            url: "/gym/membership-cards",
            icon: CreditCard,
            color: "text-green-500",
            description: "إصدار وإدارة بطاقات العضوية",
          },
          {
            title: "البحث بالباركود",
            url: "/gym/barcode-search",
            icon: Scan,
            color: "text-indigo-500",
            description: "البحث عن العضو باستخدام الباركود",
          },
          {
            title: "إدارة الباركود",
            url: "/gym/barcode-management",
            icon: Scan,
            color: "text-indigo-500",
            description: "إدارة وعرض أكواد الباركود للأعضاء",
          },
          {
            title: "حضور الأعضاء",
            url: "/gym/attendance",
            icon: CheckCircle,
            color: "text-emerald-500",
            description: "تتبع حضور وانصراف الأعضاء",
          },
          {
            title: "المجموعات والفئات",
            url: "/gym/groups",
            icon: Users,
            color: "text-amber-500",
            description: "إدارة مجموعات وفئات الأعضاء",
          },
          {
            title: "الاستبيانات",
            url: "/gym/surveys",
            icon: FileText,
            color: "text-indigo-500",
            description: "إدارة الاستبيانات والاستطلاعات",
          },
          {
            title: "إعدادات العضوية",
            url: "/gym/settings/membership",
            icon: Settings,
            color: "text-gray-500",
            description: "إعدادات إدارة العضوية والأعضاء",
          },
        ],
      },
      {
        title: "إدارة الاشتراكات والمدفوعات",
        icon: CreditCard,
        url: "/gym/subscriptions",
        color: "bg-gradient-to-r from-green-500 to-emerald-500",
        description: "إدارة الاشتراكات والمدفوعات المالية",
        submenu: [
          {
            title: "الاشتراكات",
            url: "/gym/subscriptions",
            icon: Receipt,
            color: "text-rose-500",
            description: "إدارة باقات واشتراكات الأعضاء",
          },
          {
            title: "إضافة اشتراك جديد",
            url: "/gym/add-subscription",
            icon: Plus,
            color: "text-green-600",
            description: "إضافة اشتراك جديد للعميل",
          },
          {
            title: "اشتراكات خاصة",
            url: "/gym/special-subscriptions",
            icon: Receipt,
            color: "text-indigo-600",
            description: "إدارة الاشتراكات الخاصة",
          },
          {
            title: "اشتراكات خاصة بوقت",
            url: "/gym/time-based-special-subscriptions",
            icon: Clock,
            color: "text-orange-600",
            description: "إدارة الاشتراكات الخاصة مع تحديد وقت في اليوم",
          },
          {
            title: "تحويلات الاشتراكات",
            url: "/crm/subscription-transfers",
            icon: ArrowRightLeft,
            color: "text-indigo-500",
            description: "تحويل الاشتراكات بين الأنواع المختلفة",
          },
          {
            title: "تحويل الاشتراك بين الأعضاء",
            url: "/gym/subscription-member-transfer",
            icon: ArrowRightLeft,
            color: "text-blue-600",
            description: "نقل الاشتراك من عضو إلى عضو آخر",
          },
          {
            title: "مردودات الاشتراكات",
            url: "/crm/subscription-refunds",
            icon: Undo2,
            color: "text-orange-500",
            description: "إيقاف الاشتراكات وحساب المردودات",
          },
         
          {
            title: "الإيصالات",
            url: "/gym/invoices",
            icon: FileText,
            color: "text-blue-600",
            description: "إدارة الإيصالات المالية",
          },
          {
            title: "التقارير المالية",
            url: "/gym/financial-reports",
            icon: BarChart,
            color: "text-emerald-600",
            description: "تقارير الإيرادات والمصروفات",
          },
          {
            title: "الخصومات والعروض",
            url: "/gym/discounts",
            icon: Tag,
            color: "text-amber-600",
            description: "إدارة العروض والخصومات",
          },
          {
            title: "إعدادات الاشتراكات والمدفوعات",
            url: "/gym/settings/subscription-payment",
            icon: Settings,
            color: "text-gray-500",
            description: "إعدادات الاشتراكات والمدفوعات",
          },
          {
            title: "استمارة عضو",
            url: "/gym/member-form",
            icon: FileText,
            color: "text-indigo-600",
            description: "استمارة عضو مع جميع التفاصيل والاشتراكات",
          },
        ],
      },
      {
        title: "إدارة اللوكر",
        icon: Lock,
        url: "/gym/lockers",
        color: "bg-gradient-to-r from-teal-500 to-cyan-500",
        description: "إدارة اللوكر والاشتراكات",
        submenu: [
          {
            title: "قائمة اللوكر",
            url: "/gym/lockers",
            icon: Lock,
            color: "text-teal-600",
            description: "عرض وإدارة جميع اللوكر",
          },
          {
            title: "إضافة لوكر",
            url: "/gym/add-locker",
            icon: Plus,
            color: "text-cyan-600",
            description: "إضافة اشتراك لوكر جديد",
          },
          {
            title: "إعدادات اللوكر",
            url: "/gym/settings/locker",
            icon: Settings,
            color: "text-gray-500",
            description: "إعدادات اللوكر وأنواع الاشتراكات",
          },
        ],
      },
    ],
  },
  {
    title: "البرامج التدريبية واللياقة",
    items: [
      {
        title: "البرامج التدريبية واللياقة",
        icon: Activity,
        url: "/gym/workout-programs",
        color: "bg-gradient-to-r from-indigo-500 to-blue-500",
        description: "إدارة البرامج التدريبية واللياقة البدنية",
        submenu: [
          {
            title: "البرامج التدريبية",
            url: "/gym/workout-programs",
            icon: Activity,
            color: "text-indigo-600",
            description: "إدارة البرامج التدريبية"
          },
          {
            title: "قوالب التمارين",
            url: "/gym/workout-templates",
            icon: FileText,
            color: "text-indigo-600",
            description: "قوالب جاهزة للتمارين"
          },
          {
            title: "تمارين القوة",
            url: "/gym/strength-training",
            icon: Activity,
            color: "text-red-500",
            description: "تمارين القوة واللياقة البدنية"
          },
          {
            title: "تتبع التقدم",
            url: "/gym/progress-tracking",
            icon: TrendingUp,
            color: "text-green-500",
            description: "تقدم الأعضاء في البرامج التدريبية"
          },
          {
            title: "التقييمات البدنية",
            url: "/gym/assessments",
            icon: CheckCircle,
            color: "text-blue-500",
            description: "تقييمات اللياقة البدنية"
          },
         
        ]
      },
      {
        title: "الجدولة والحجوزات",
        icon: Calendar,
        url: "/gym/scheduling",
        color: "bg-gradient-to-r from-orange-500 to-red-500",
        description: "إدارة الجدولة والحجوزات",
        submenu: [
          {
            title: "الجدولة",
            url: "/gym/scheduling",
            icon: Calendar,
            color: "text-orange-600",
            description: "إدارة الجداول الزمنية"
          },
          {
            title: "إدارة الحصص",
            url: "/gym/classes",
            icon: Calendar,
            color: "text-red-600",
            description: "إدارة الحصص والأعضاء والمدربين"
          },
          {
            title: "حجز الحصص",
            url: "/gym/class-booking",
            icon: Calendar,
            color: "text-indigo-600",
            description: "حجز الحصص للأعضاء"
          },
          {
            title: "حجوزات القاعات",
            url: "/gym/room-bookings",
            icon: Calendar,
            color: "text-blue-600",
            description: "حجز القاعات"
          },
          {
            title: "المواعيد الشخصية",
            url: "/gym/personal-sessions",
            icon: Calendar,
            color: "text-green-600",
            description: "المواعيد الشخصية مع المدربين"
          }
        ]
      },
      {
        title: "إدارة المدربين",
        icon: UserCog,
        url: "/gym/trainers",
        color: "bg-gradient-to-r from-indigo-600 to-blue-600",
        description: "إدارة المدربين والمستحقات",
        submenu: [
          {
            title: "إدارة المدربين",
            url: "/gym/trainers",
            icon: Users,
            color: "text-indigo-500",
            description: "إدارة المدربين وجداولهم"
          },
          {
            title: "أجور المدربين",
            url: "/gym/trainer-payments",
            icon: DollarSign,
            color: "text-green-500",
            description: "إدارة مستحقات المدربين"
          },
          {
            title: "بحث عن المدرب",
            url: "/gym/trainer-search",
            icon: Search,
            color: "text-blue-500",
            description: "البحث عن المدرب وعرض تفاصيله وإحصائياته"
          },
          {
            title: "تقييمات المدربين",
            url: "/gym/trainer-ratings",
            icon: Star,
            color: "text-amber-500",
            description: "تقييمات أداء المدربين"
          },
          {
            title: "إعدادات المدربين",
            url: "/gym/settings/trainers",
            icon: Settings,
            color: "text-gray-500",
            description: "إعدادات إدارة المدربين"
          }
        ]
      },
      {
        title: "المرافق والمعدات",
        icon: Building,
        url: "/gym/facilities",
        color: "bg-gradient-to-r from-gray-600 to-gray-700",
        description: "إدارة مرافق ومعدات النادي",
        submenu: [
          {
            title: "إدارة المرافق",
            url: "/gym/facilities",
            icon: Building,
            color: "text-blue-500",
            description: "إدارة مرافق النادي"
          },
          {
            title: "جرد المعدات",
            url: "/gym/equipment",
            icon: Activity,
            color: "text-gray-500",
            description: "إدارة معدات النادي"
          },
          {
            title: "صيانة المعدات",
            url: "/gym/equipment-maintenance",
            icon: Wrench,
            color: "text-amber-500",
            description: "جدولة ومتابعة صيانة المعدات"
          },
          {
            title: "إعدادات المرافق والمعدات",
            url: "/gym/settings/facilities",
            icon: Settings,
            color: "text-gray-500",
            description: "إعدادات المرافق والمعدات"
          }
        ]
      },
    
   
    ]
  },
  {
    // توحيد إدارة المخازن + الموردين + المشتريات تحت مسمى واحد
    title: "إدارة مبيعات الجيم",
    items: [
      {
        title: "إدارة المخازن",
        icon: Database,
        url: "/inventory",
        color: "bg-gradient-to-r from-cyan-500 to-blue-500",
        description: "إدارة شاملة للمخازن",
        submenu: [
          {
            title: "لوحة تحكم المخزون",
            url: "/inventory/dashboard",
            icon: BarChart,
            color: "text-blue-500",
            description: "مراقبة المخزون وتحليل البيانات"
          },
          {
            title: "الأعدادات",
            url: "/inventory/settings",
            icon: Settings,
            color: "text-gray-500",
            description: "إعدادات المخازن"
          },
          {
            title: "المنتجات والخدمات",
            url: "/items",
            icon: Package,
            color: "text-green-500",
            description: "إدارة المنتجات والخدمات"
          },
          {
            title: "قائمة الأسعار",
            url: "/inventory/price-list",
            icon: DollarSign,
            color: "text-emerald-500",
            description: "إدارة أسعار المنتجات والخدمات حسب الفروع"
          },
          {
            title: "بضاعة أول المدة",
            url: "/inventory/opening-stock",
            icon: FileText,
            color: "text-orange-500",
            description: "بضاعة أول المدة"
          },
          {
            title: "الحركات المخزنية",
            url: "/inventory-transactions",
            icon: Activity,
            color: "text-amber-600",
            description: "الحركات المخزنية"
          },
          {
            title: "سجل الحركات",
            url: "/inventory/movement-log",
            icon: FileText,
            color: "text-teal-500",
            description: "سجل الحركات"
          },
          {
            title: "الجرد والتسويات",
            url: "/inventory/stocktaking",
            icon: CheckCircle,
            color: "text-green-600",
            description: "الجرد والتسويات"
          },
          {
            title: "السياسات والأجراءات",
            url: "/inventory/policies",
            icon: Shield,
            color: "text-red-500",
            description: "السياسات والأجراءات"
          },
          {
            title: "البيانات والتحليل الذكي",
            url: "/inventory/analytics",
            icon: TrendingUp,
            color: "text-indigo-500",
            description: "البيانات والتحليل الذكي"
          },
        ],
      },
   
      {
        title: "إدارة المشتريات",
        icon: ShoppingCart,
        url: "/procurement",
        color: "bg-gradient-to-r from-orange-500 to-red-500",
        description: "إدارة شاملة للمشتريات",
        submenu: [
          
          {
            title: "أمر شراء سريع",
            url: "/quick-purchase-orders",
            icon: Zap,
            color: "text-yellow-500",
            description: "إنشاء أمر شراء سريع بسيط",
            badge: "جديد"
          },
          
          {
            title: "مرتجع المشتريات",
            url: "/purchase-returns",
            icon: ArrowLeft,
            color: "text-orange-500",
            description: "إدارة مرتجعات المشتريات"
          }
        ],
      },
      {
        title: "إدارة البيع ",
        icon: Bookmark,
        url: "/reception/booking-dashboard",
        color: "bg-gradient-to-r from-amber-700 to-amber-500",
        description: "منصة متكاملة لإدارة البيع ",
        submenu: [
         
          {
            title: "ايصال بيع جديدة",
            url: "/reception/create-booking",
            icon: Plus,
            color: "text-green-500",
            description: "إنشاء ايصال بيع جديدة"
          },
          {
            title: "قائمة الفاتورات",
            url: "/reception/bookings-list",
            icon: List,
            color: "text-blue-600",
            description: "عرض وإدارة جميع البيع"
          }
        ]
      },
    ],
  },
    
  {
    title: "المحاسبة المالية",
    items: [
      {
        title: "المحاسبة المالية",
        icon: FileText,
        url: "/accounting",
        color: "bg-gradient-to-r from-indigo-500 to-blue-500",
        description: "نظام محاسبي متكامل",
        submenu: [
          {
            title: "لوحة التحكم",
            url: "/accounting/dashboard",
            icon: BarChart3,
            color: "text-blue-600",
            description: "لوحة تحكم شاملة للمحاسبة المالية"
          },
          {
            title: "القيود المحاسبية",
            url: "/accounting/journal-entries",
            icon: BookOpen,
            color: "text-indigo-600",
            description: "إدارة القيود اليومية والشهرية والسنوية"
          },
          {
            title: "شجرة الحسابات",
            url: "/accounting/chart-of-accounts",
            icon: FileText,
            color: "text-indigo-600",
            description: "إدارة الحسابات المحاسبية وتصنيفها"
          },
          {
            title: "قائمة الدخل",
            url: "/accounting/income-statement",
            icon: TrendingUp,
            color: "text-green-600",
            description: "عرض الإيرادات والمصروفات وصافي الربح"
          },
          {
            title: "الميزانية العمومية",
            url: "/accounting/balance-sheet",
            icon: PieChart,
            color: "text-red-600",
            description: "عرض الأصول والخصوم وحقوق الملكية"
          },
          {
            title: "قائمة التدفق النقدي",
            url: "/accounting/cash-flow",
            icon: Wallet,
            color: "text-cyan-600",
            description: "تتبع التدفقات النقدية الداخلة والخارجة"
          },
          {
            title: "ميزان المراجعة",
            url: "/accounting/trial-balance",
            icon: Scale,
            color: "text-indigo-600",
            description: "عرض أرصدة جميع الحسابات وتوازنها"
          },
          {
            title: "كشف حساب",
            url: "/accounting/account-statement",
            icon: FileText,
            color: "text-indigo-600",
            description: "عرض جميع حركات حساب محاسبي معين"
          },
          {
            title: "دفتر الأستاذ العام",
            url: "/accounting/general-ledger",
            icon: BookOpen,
            color: "text-blue-600",
            description: "عرض جميع القيود المحاسبية منظمة حسب الحسابات"
          },
          {
            title: "إعدادات المحاسبة",
            url: "/accounting/settings",
            icon: Settings,
            color: "text-gray-500",
            description: "إعدادات النظام المحاسبي"
          }
        ]
      },
    ],
  },
  {
    title: "الإدارة المالية",
    items: [
      {
        title: "الإدارة المالية",
        icon: DollarSign,
        url: "/finance",
        color: "bg-gradient-to-r from-emerald-500 to-teal-600",
        description: "إدارة شاملة للمصروفات والإيرادات",
        submenu: [
          {
            title: "لوحة تحكم المالية",
            url: "/finance/dashboard",
            icon: BarChart3,
            color: "text-blue-500",
            description: "نظرة عامة على الوضع المالي"
          },
          {
            title: "إدارة المصروفات",
            url: "/finance/expenses",
            icon: TrendingDown,
            color: "text-red-500",
            description: "تسجيل وإدارة جميع المصروفات"
          },
          {
            title: "إدارة الإيرادات",
            url: "/finance/revenues",
            icon: TrendingUp,
            color: "text-green-500",
            description: "تسجيل وإدارة جميع الإيرادات"
          },
          {
            title: "تقارير المصروفات",
            url: "/finance/expense-reports",
            icon: FileText,
            color: "text-orange-500",
            description: "تقارير تفصيلية للمصروفات"
          },
          {
            title: "تقارير الإيرادات",
            url: "/finance/revenue-reports",
            icon: Receipt,
            color: "text-emerald-500",
            description: "تقارير تفصيلية للإيرادات"
          },
          {
            title: "التحليل المالي",
            url: "/finance/analysis",
            icon: BarChart,
            color: "text-indigo-500",
            description: "تحليل الأداء المالي والتوقعات"
          },
          {
            title: "الأرباح والخسائر",
            url: "/finance/profit-loss",
            icon: Calculator,
            color: "text-indigo-500",
            description: "قائمة الدخل والأرباح والخسائر"
          },
        ],
      },
    ],
  },
  
 
 
 
 
  {
    title: "إدارة الموارد البشرية",
    items: [
      {
        title: "إدارة الموارد البشرية",
        icon: Users,
        url: "/hr",
        color: "bg-gradient-to-r from-blue-600 to-cyan-500",
        description: "إدارة شاملة للموارد البشرية والموظفين",
        submenu: [
          {
            title: "لوحة التحكم",
            url: "/hr/dashboard",
            icon: BarChart,
            color: "text-blue-500",
            description: "نظرة شاملة على الموارد البشرية"
          },
          {
            title: "إدارة الموظفين",
            url: "/hr/employees",
            icon: Users,
            color: "text-green-500",
            description: "إدارة بيانات الموظفين"
          },
          {
            title: "التوظيف والاستقطاب",
            url: "/hr/recruitment",
            icon: UserPlus,
            color: "text-indigo-500",
            description: "إدارة الوظائف الشاغرة والمرشحين"
          },
          {
            title: "الحضور والانصراف",
            url: "/hr/attendance",
            icon: Clock,
            color: "text-amber-500",
            description: "تتبع حضور وانصراف الموظفين"
          },
          {
            title: "إدارة المناوبات",
            url: "/hr/shifts",
            icon: RotateCcw,
            color: "text-orange-500",
            description: "إدارة مناوبات الموظفين"
          },
          {
            title: "إدارة الإجازات",
            url: "/hr/leaves",
            icon: Calendar,
            color: "text-indigo-500",
            description: "إدارة طلبات الإجازات"
          },
          {
            title: "إدارة الرواتب",
            url: "/hr/payroll",
            icon: DollarSign,
            color: "text-green-500",
            description: "إدارة كشوف الرواتب"
          },
          {
            title: "التدريب والتطوير",
            url: "/hr/training",
            icon: GraduationCap,
            color: "text-indigo-500",
            description: "إدارة برامج التدريب والشهادات"
          },
          {
            title: "تقييم الأداء",
            url: "/hr/performance",
            icon: Award,
            color: "text-yellow-500",
            description: "تقييمات الأداء وأهداف الموظفين"
          },
          {
            title: "إدارة المزايا",
            url: "/hr/benefits",
            icon: Gift,
            color: "text-pink-500",
            description: "إدارة مزايا الموظفين والبدلات"
          },
          {
            title: "إدارة العقود",
            url: "/hr/contracts",
            icon: FileText,
            color: "text-indigo-500",
            description: "إدارة عقود العمل"
          },
          {
            title: "إدارة الوثائق",
            url: "/hr/documents",
            icon: Folder,
            color: "text-teal-500",
            description: "إدارة وثائق الموظفين"
          },
          {
            title: "التقارير والتحليلات",
            url: "/hr/reports",
            icon: BarChart3,
            color: "text-blue-500",
            description: "تقارير شاملة عن الموارد البشرية"
          }
        ]
      }
    ]
  },


  
  {
    title: "إدارة التطبيق",
    items: [
      {
        title: "إدارة التطبيق",
        icon: Smartphone,
        url: "/app/about",
        color: "bg-gradient-to-r from-indigo-500 to-blue-500",
        description: "إدارة التطبيق والمحتوى",
        submenu: [
          {
            title: "عن التطبيق",
            url: "/app/about",
            icon: Smartphone,
            color: "text-indigo-600",
            description: "معلومات وبيانات التطبيق"
          },
          {
            title: "الدعوات المرسلة",
            url: "/app/invitations/sent",
            icon: Send,
            color: "text-blue-600",
            description: "إدارة الدعوات المرسلة للأعضاء"
          },
          {
            title: "الدعوات المقبولة من قبل الإدارة",
            url: "/app/invitations/accepted",
            icon: CheckCircle,
            color: "text-green-600",
            description: "الدعوات التي تم قبولها من قبل الإدارة"
          },
          {
            title: "الدعوات المسجلة حضور بالفرع",
            url: "/app/invitations/attended",
            icon: UserCheck,
            color: "text-blue-600",
            description: "الدعوات التي تم تسجيل حضورها في الفروع"
          },
          {
            title: "الدعوات المرفوضة",
            url: "/app/invitations/rejected",
            icon: XCircle,
            color: "text-red-600",
            description: "الدعوات التي تم رفضها"
          },
          {
            title: "إدارة العروض",
            url: "/app/offers",
            icon: Tag,
            color: "text-yellow-600",
            description: "إدارة عروض التطبيق"
          },
          {
            title: "إدارة المدربين",
            url: "/app/trainers",
            icon: User,
            color: "text-indigo-600",
            description: "إدارة مدربين التطبيق"
          },
          {
            title: "إدارة تصنيفات التمارين",
            url: "/app/exercise-categories",
            icon: FolderTree,
            color: "text-blue-600",
            description: "إدارة تصنيفات التمارين في التطبيق"
          },
          {
            title: "إدارة التمارين",
            url: "/app/exercises",
            icon: Activity,
            color: "text-green-600",
            description: "إدارة تمارين التطبيق"
          },
          {
            title: "إدارة الأخبار",
            url: "/app/news",
            icon: Newspaper,
            color: "text-orange-600",
            description: "إدارة أخبار التطبيق"
          },
          {
            title: "إدارة الإعلانات",
            url: "/app/ads",
            icon: Megaphone,
            color: "text-pink-600",
            description: "إدارة إعلانات التطبيق"
          }
        ]
      }
    ]
  }
];

export function AppSidebar() {
  
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { canAccessPage, userPermissions, isLoadingPermissions, user } = useAuth();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("ar");
  const collapsed = state === "collapsed";

  // الحصول على اسم المستخدم والوظيفة
  const userName = user?.name || user?.username || user?.email || "المستخدم";
  
  // التعامل مع role كـ object أو string
  let userRole = "مستخدم";
  if (user?.role) {
    if (typeof user.role === 'string') {
      userRole = user.role;
    } else if (typeof user.role === 'object' && user.role.roleName) {
      userRole = user.role.roleName;
    }
  } else if (user?.roleName) {
    userRole = user.roleName;
  }
  
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || "أح";
  
  console.log('👤 AppSidebar - User data:', { 
    user, 
    userName, 
    userRole, 
    userInitials,
    userKeys: user ? Object.keys(user) : [],
    userRoleKeys: user?.role ? Object.keys(user.role) : []
  });

  // Handle button functions
  const handleNotifications = () => {
    // يمكن إضافة منطق فتح صفحة الإشعارات هنا
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLanguageToggle = () => {
    const newLang = currentLanguage === "ar" ? "en" : "ar";
    setCurrentLanguage(newLang);
    document.documentElement.setAttribute('lang', newLang);
    document.documentElement.setAttribute('dir', newLang === "ar" ? 'rtl' : 'ltr');
  };

  const handleHelp = () => {
    window.open('https://help.raghwa.com', '_blank');
  };

  const handlePrivacyPolicy = () => {
    window.open('https://raghwa.com/privacy', '_blank');
  };

  const handleTermsPolicy = () => {
    window.open('https://raghwa.com/terms', '_blank');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleAccountSettings = () => {
    navigate('/settings/account');
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // استخدام دالة تسجيل الخروج من AuthContext
    navigate('/login');
  };

  const toggleMenu = (menuTitle: string) => {
    setOpenMenus(prev =>
      prev.includes(menuTitle)
        ? prev.filter(item => item !== menuTitle)
        : [...prev, menuTitle]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isSubmenuActive = (submenu: SubMenuItem[]) =>
    submenu?.some(item => location.pathname === item.url);

  // دالة لتحديد الوحدة من URL
  const getModuleFromUrl = useCallback((url: string): string | null => {
    if (!url) return null;
    
    // تحديد الوحدة من URL
    if (url === '/dashboard') {
      return 'dashboard'; // الرئيسية تنتمي لوحدة dashboard
    }
    
    // للمشتريات - يجب أن يكون أولاً لتجنب تضارب مع /settings
    if (url.includes('/procurement')) {
      return 'procurement';
    }
    if (url.includes('/purchase-orders') || url.includes('/quick-purchase-orders') || url.includes('/goods-receipt') || url.includes('/invoice-processing') || url.includes('/purchase-returns') || url.includes('/debit-note')) {
      return 'procurement';
    }
    
    // للمحاسبة المالية
    if (url.includes('/accounting')) {
      return 'accounting';
    }
    
    // للإدارة المالية
    if (url.includes('/finance')) {
      return 'finance';
    }
    
    // للمخازن
    if (url.includes('/inventory')) {
      return 'inventory';
    }
    if (url.includes('/items')) {
      return 'inventory';
    }
    if (url.includes('/inventory-transactions')) {
      return 'inventory';
    }
    
    // للموردين
    if (url.includes('/suppliers')) {
      return 'suppliers';
    }
    
    // للـ CRM - يجب أن يكون قبل /gym للصفحات المشتركة
    // الصفحات التالية تنتمي لوحدة CRM حتى لو كانت تحت /gym/
    if (url.includes('/crm')) {
      return 'crm';
    }
    // صفحات الاشتراكات والإيصالات من وحدة CRM
    if (url.includes('/gym/subscriptions') || url.includes('/gym/invoices') || url.includes('/gym/invoices-receipts') || 
        url.includes('/gym/financial-reports') || url.includes('/gym/discounts') || url.includes('/gym/discounts-offers') ||
        url.includes('/gym/subscription-transfers') || url.includes('/gym/subscription-member-transfer') || url.includes('/gym/subscription-refunds') ||
        url.includes('/gym/add-subscription') || url.includes('/gym/special-subscriptions') || url.includes('/gym/time-based-special-subscriptions') || url.includes('/gym/member-form')) {
      return 'crm'; // هذه الصفحات تنتمي لوحدة CRM
    }
    
    // للحجوزات - يجب أن يكون أولاً لتجنب تضارب مع reception-service
    // ملاحظة: لا نتحقق من /shifts هنا لأن /hr/shifts يجب أن يعود إلى hr-management
    if (url.includes('/reception/booking') ||url.includes('/reception/booking-dashboard') || url.includes('/reception/create-booking') || url.includes('/reception/bookings-list') || url.includes('/reception/booking-calendar') || url.includes('/reception/booking-analytics') || url.includes('/reception/table-management') || (url.includes('/shifts') && !url.includes('/hr/shifts'))) {
      return 'reception';
    }
    
    // لخدمة الاستقبال - يجب أن يكون بعد البيع
    if (url.includes('/reception') && !url.includes('/mobile-wash') && !url.includes('/reception/booking')) {
      return 'reception-service';
    }
    if (url.includes('/live-control-center') || url.includes('/customer-service') || url.includes('/reception/reports') || url.includes('/reception/system-integration') || url.includes('/customer-notifications')) {
      return 'reception-service';
    }
    
    // للكافية المتنقلة
    if (url.includes('/mobile-wash')) {
      return 'mobile-wash';
    }
    
    // للدراجات النارية
    if (url.includes('/motorcycle-management')) {
      return 'motorcycle-management';
    }
    
    // لإدارة النادي الرياضي - يجب أن يكون قبل /operations لتجنب التضارب
    // ولكن بعد التحقق من صفحات CRM
    if (url.includes('/gym')) {
      return 'gym-management'; // اسم الوحدة في قاعدة البيانات هو gym-management
    }
    
    // لإدارة التطبيق
    if (url.includes('/app')) {
      return 'app-management';
    }
    
    // لإدارة الموارد البشرية
    if (url.includes('/hr')) {
      return 'hr-management';
    }
    
   
    
    // لإدارة المركبات
    if (url.includes('/fleet')) {
      return 'fleet-management';
    }
    
    // لإدارة الصيانة
    if (url.includes('/maintenance')) {
      return 'maintenance-management';
    }
    
    // لإدارة التسويق والمبيعات
    if (url.includes('/marketing')) {
      return 'marketing-management';
    }
    
    // للعمليات
    if (url.includes('/operations')) {
      return 'operations';
    }
    
    // لنقاط البيع
    if (url.includes('/pos')) {
      return 'pos';
    }
    
    // للموارد البشرية
    if (url.includes('/hcm')) {
      return 'hcm';
    }
    
    // للحسابات
    if (url.includes('/accounts')) {
      return 'accounting';
    }
    
    // للأصول الثابتة
    if (url.includes('/fixed-assets')) {
      return 'accounting';
    }
    
    // للعمليات المحاسبية
    if (url.includes('/accounting-operations')) {
      return 'accounting';
    }
    
    // للتقارير المالية
    if (url.includes('/financial-reports')) {
      return 'accounting';
    }
    
    // للإدارة العامة
    if (url.includes('/administration')) {
      return 'administration';
    }
    
    // لتطوير الجودة
    if (url.includes('/quality-development')) {
      return 'quality-development';
    }
    
    // إدارة النظام - يجب أن يكون آخراً لتجنب تضارب مع الوحدات الأخرى
    if (url.includes('/dashboard') && !url.includes('/inventory') && !url.includes('/suppliers') && !url.includes('/crm') && !url.includes('/reception') && !url.includes('/mobile-wash') && !url.includes('/motorcycle-management') && !url.includes('/pos') && !url.includes('/hcm') && !url.includes('/accounts') && !url.includes('/fixed-assets') && !url.includes('/accounting-operations') && !url.includes('/financial-reports') && !url.includes('/administration') && !url.includes('/quality-development') && !url.includes('/gym') && !url.includes('/hr') && !url.includes('/warehouse') && !url.includes('/fleet') && !url.includes('/maintenance') && !url.includes('/marketing')) {
      return 'system-administration'; // باقي لوحات التحكم تنتمي لوحدة إدارة النظام
    }
    if (url.includes('/settings')) {
      return 'system-administration';
    }
    
    return null;
  }, []);

  // دالة لتحديد الصفحة من URL
  const getPageFromUrl = useCallback((url: string): string | null => {
    if (!url) return null;
    
    // تحديد الصفحة من URL
    if (url === '/dashboard') {
      return 'main-dashboard';
    }
    
    // إدارة النظام - تطابق قاعدة البيانات
    // للصفحة الرئيسية /settings
    if (url === '/settings' || (url.includes('/settings') && !url.includes('/settings/'))) {
      return 'company-settings'; // الصفحة الافتراضية لإدارة النظام
    }
    if (url.includes('/company')) {
      return 'company-settings';
    }
    if (url.includes('/branches')) {
      return 'branch-management';
    }
    if (url.includes('/warehouses')) {
      return 'warehouse-management';
    }
    if (url.includes('/users')) {
      return 'user-management';
    }
    if (url.includes('/roles')) {
      return 'roles-permissions';
    }
    if (url.includes('/themes')) {
      return 'theme-settings';
    }
    if (url.includes('/system')) {
      return 'system-settings';
    }
    if (url.includes('/devices')) {
      return 'device-settings';
    }
    if (url.includes('/advanced')) {
      return 'advanced-settings';
    }
    
    // للمخازن - تطابق قاعدة البيانات
    // للصفحة الرئيسية /inventory
    if (url === '/inventory' || (url.includes('/inventory') && !url.includes('/inventory/'))) {
      return 'inventory-dashboard';
    }
    if (url.includes('/dashboard') && url.includes('/inventory')) {
      return 'inventory-dashboard';
    }
    if (url.includes('/settings') && url.includes('/inventory')) {
      return 'inventory-settings';
    }
    if (url.includes('/items')) {
      return 'product-management';
    }
    if (url.includes('/price-list')) {
      return 'price-management';
    }
    if (url.includes('/opening-stock')) {
      return 'opening-stock';
    }
    if (url.includes('/inventory-transactions')) {
      return 'inventory-transactions';
    }
    if (url.includes('/movement-log')) {
      return 'movement-log';
    }
    if (url.includes('/stocktaking')) {
      return 'stocktaking';
    }
    if (url.includes('/policies') && url.includes('/inventory')) {
      return 'inventory-policies';
    }
    if (url.includes('/analytics') && url.includes('/inventory')) {
      return 'inventory-analytics';
    }
    
    // للموردين - تطابق قاعدة البيانات
    // للصفحة الرئيسية /suppliers
    if (url === '/suppliers' || (url.includes('/suppliers') && !url.includes('/suppliers/'))) {
      return 'suppliers-dashboard';
    }
    if (url.includes('/dashboard') && url.includes('/suppliers')) {
      return 'suppliers-dashboard';
    }
    if (url.includes('/suppliers') && url.includes('tab=settings')) {
      return 'suppliers-settings';
    }
    if (url.includes('/suppliers') && url.includes('tab=suppliers')) {
      return 'suppliers-management';
    }
    if (url.includes('/payments') && url.includes('/suppliers')) {
      return 'suppliers-payments';
    }
    if (url.includes('/evaluation')) {
      return 'suppliers-evaluation';
    }
    if (url.includes('/contracts')) {
      return 'suppliers-contracts';
    }
    if (url.includes('/reports') && url.includes('/suppliers')) {
      return 'suppliers-reports';
    }
    
    // للمشتريات - تطابق قاعدة البيانات
    // للصفحة الرئيسية /procurement
    if (url === '/procurement' || (url.includes('/procurement') && !url.includes('/procurement/'))) {
      return 'procurement-settings';
    }
    if (url.includes('/settings') && url.includes('/procurement')) {
      return 'procurement-settings';
    }
    if (url.includes('/procurement/settings')) {
      return 'procurement-settings';
    }
    if (url.includes('/procurement') && url.includes('/settings')) {
      return 'procurement-settings';
    }
    if (url.includes('/requisition')) {
      return 'purchase-requisition';
    }
    if (url.includes('/approval')) {
      return 'approval-workflow';
    }
    if (url.includes('/rfq')) {
      return 'rfq-management';
    }
    if (url.includes('/purchase-orders')) {
      return 'purchase-orders';
    }
    if (url.includes('/quick-purchase-orders')) {
      return 'quick-purchase-orders';
    }
    if (url.includes('/goods-receipt')) {
      return 'goods-receipt';
    }
    if (url.includes('/invoice-processing')) {
      return 'invoice-processing';
    }
    if (url.includes('/purchase-returns')) {
      return 'purchase-returns';
    }
    if (url.includes('/debit-note')) {
      return 'debit-note';
    }
    
    // للإدارة المالية - تطابق قاعدة البيانات (يجب أن يكون قبل /gym/financial-reports)
    // للصفحة الرئيسية /finance
    if (url === '/finance' || (url.includes('/finance') && !url.includes('/finance/'))) {
      return 'finance-dashboard';
    }
    if (url.includes('/finance/dashboard')) {
      return 'finance-dashboard';
    }
    if (url.includes('/finance/expenses')) {
      return 'expense-management';
    }
    if (url.includes('/finance/revenues')) {
      return 'revenue-management';
    }
    if (url.includes('/finance/expense-reports')) {
      return 'expense-reports';
    }
    if (url.includes('/finance/revenue-reports')) {
      return 'revenue-reports';
    }
    if (url.includes('/finance/analysis')) {
      return 'financial-analysis';
    }
    if (url.includes('/finance/profit-loss')) {
      return 'profit-loss';
    }
    // يجب التحقق من /finance قبل /gym لتجنب التعارض
    
    // للمحاسبة المالية
    if (url.includes('/accounting/dashboard')) {
      return 'accounting-dashboard';
    }
    if (url.includes('/accounting/journal-entries')) {
      return 'journal-entries';
    }
    if (url.includes('/accounting/chart-of-accounts')) {
      return 'chart-of-accounts';
    }
    if (url.includes('/accounting/income-statement')) {
      return 'income-statement';
    }
    if (url.includes('/accounting/balance-sheet')) {
      return 'balance-sheet';
    }
    if (url.includes('/accounting/cash-flow')) {
      return 'cash-flow';
    }
    if (url.includes('/accounting/trial-balance')) {
      return 'trial-balance';
    }
    if (url.includes('/accounting/account-statement')) {
      return 'account-statement';
    }
    if (url.includes('/accounting/general-ledger')) {
      return 'general-ledger';
    }
    if (url.includes('/accounting/settings')) {
      return 'accounting-settings';
    }
    if (url.includes('/accounting')) {
      return 'accounting-dashboard';
    }
    
    // للـ CRM - تطابق قاعدة البيانات
    // للصفحة الرئيسية /crm
    if (url === '/crm' || (url.includes('/crm') && !url.includes('/crm/'))) {
      return 'crm-dashboard';
    }
    if (url.includes('/dashboard') && url.includes('/crm')) {
      return 'crm-dashboard';
    }
    if (url.includes('/customers')) {
      return 'customer-management';
    }
    if (url.includes('/crm/subscriptions') && !url.includes('/subscription-transfers') && !url.includes('/subscription-refunds')) {
      return 'subscription-management';
    }
    if (url.includes('/crm/subscription-transfers')) {
      return 'subscription-transfers';
    }
    if (url.includes('/gym/subscription-member-transfer')) {
      return 'subscription-member-transfer';
    }
    if (url.includes('/crm/subscription-refunds')) {
      return 'subscription-refunds';
    }
    
    if (url.includes('/campaigns')) {
      return 'campaign-management';
    }
    if (url.includes('/feedback')) {
      return 'feedback-management';
    }
    if (url.includes('/survey')) {
      return 'survey-management';
    }
    if (url.includes('/coupons')) {
      return 'coupon-management';
    }
    if (url.includes('/subscriptions')) {
      return 'subscription-management';
    }
    if (url.includes('/loyalty')) {
      return 'loyalty-management';
    }
    if (url.includes('/cards')) {
      return 'card-management';
    }
    
    // للحجوزات - تطابق قاعدة البيانات
    // يجب أن تكون الشروط المحددة أولاً لتجنب التعارضات
    if (url.includes('/reception/create-booking')) {
      return 'create-booking';
    }
    if (url.includes('/reception/bookings-list')) {
      return 'bookings-list';
    }
    if (url.includes('/reception/booking-calendar')) {
      return 'booking-calendar';
    }
    if (url.includes('/reception/booking-analytics')) {
      return 'booking-analytics';
    }
    if (url === '/reception/booking-dashboard' || url.includes('/reception/booking-dashboard')) {
      return 'booking-dashboard';
    }
    if (url.includes('/booking-dashboard') && url.includes('/reception')) {
      return 'booking-dashboard';
    }
    // Fallback للشروط العامة (إذا لم تكن في /reception)
    if (url.includes('/create-booking')) {
      return 'create-booking';
    }
    if (url.includes('/bookings-list')) {
      return 'bookings-list';
    }
    if (url.includes('/booking-calendar')) {
      return 'booking-calendar';
    }
    if (url.includes('/booking-analytics')) {
      return 'booking-analytics';
    }
    if (url.includes('/table-management')) {
      return 'table-management';
    }
    // التحقق من shifts فقط إذا لم تكن جزءاً من HR
    if (url.includes('/shifts') && !url.includes('/hr/shifts') && url.includes('/daily-report')) {
      return 'daily-shift-report';
    }
    if (url.includes('/shifts') && !url.includes('/hr/shifts') && !url.includes('/revenue') && !url.includes('/daily-report')) {
      return 'shifts-list';
    }
    if (url.includes('/shifts') && !url.includes('/hr/shifts') && url.includes('/revenue')) {
      return 'shift-revenue';
    }
    if (url.includes('/shifts/add')) {
      return 'add-shift';
    }
    
    if (url.includes('/reception') && !url.includes('/mobile-wash') && !url.includes('/booking')) {
      return 'reception-dashboard';
    }
    if (url.includes('/live-control-center')) {
      return 'live-control-center';
    }
    if (url.includes('/customer-service')) {
      return 'customer-service';
    }
    if (url.includes('/reception/reports')) {
      return 'reception-reports';
    }
    if ( url.includes('/system-integration')) {
      return 'system-integrations';
    }
    if (url.includes('/customer-notifications')) {
      return 'customer-notifications';
    }
    
    // للكافية المتنقلة - تطابق قاعدة البيانات
    if (url.includes('/dashboard') && url.includes('/mobile-wash')) {
      return 'mobile-wash-dashboard';
    }
    if (url.includes('/bookings') && url.includes('/mobile-wash')) {
      return 'mobile-wash-bookings';
    }
    if (url.includes('/fleet')) {
      return 'fleet-management';
    }
    if (url.includes('/tracking')) {
      return 'live-tracking';
    }
    if (url.includes('/quality') && url.includes('/mobile-wash')) {
      return 'quality-management';
    }
    if (url.includes('/mobile-app')) {
      return 'mobile-app-management';
    }
    
    // للدراجات النارية
    // للصفحة الرئيسية /motorcycle-management
    if (url === '/motorcycle-management' || (url.includes('/motorcycle-management') && !url.includes('/motorcycle-management/'))) {
      return 'motorcycle-management-dashboard';
    }
    if (url.includes('/dashboard') && url.includes('/motorcycle-management')) {
      return 'motorcycle-management-dashboard';
    }
    if (url.includes('/motorcycles') && url.includes('/motorcycle-management')) {
      return 'motorcycle-management-motorcycles';
    }
    if (url.includes('/drivers') && url.includes('/motorcycle-management')) {
      return 'motorcycle-management-drivers';
    }
    if (url.includes('/orders') && url.includes('/motorcycle-management')) {
      return 'motorcycle-management-orders';
    }
    if (url.includes('/maintenance') && url.includes('/motorcycle-management')) {
      return 'motorcycle-management-maintenance';
    }
    
    // للعمليات - تطابق قاعدة البيانات
    if (url.includes('/operations')) {
      return 'operations-management';
    }
    if (url.includes('/work-orders')) {
      return 'work-orders';
    }
    
    // لنقاط البيع - تطابق قاعدة البيانات
    if (url.includes('/dashboard') && url.includes('/pos')) {
      return 'pos-dashboard';
    }
    if (url.includes('/pos') && !url.includes('/dashboard') && !url.includes('/orders') && !url.includes('/shifts') && !url.includes('/invoices') && !url.includes('/payments') && !url.includes('/operations') && !url.includes('/reports') && !url.includes('/settings')) {
      return 'pos-system';
    }
    if (url.includes('/orders')) {
      return 'active-orders';
    }
    // التحقق من shifts فقط إذا لم تكن جزءاً من HR
    if (url.includes('/shifts') && !url.includes('/hr/shifts')) {
      return 'shift-management';
    }
    if (url.includes('/outstanding-invoices')) {
      return 'outstanding-invoices';
    }
    if (url.includes('/customer-payments')) {
      return 'customer-payments';
    }
    if (url.includes('/operations-log')) {
      return 'operations-log';
    }
    if (url.includes('/reports') && url.includes('/pos')) {
      return 'pos-reports';
    }
    if (url.includes('/pos-settings')) {
      return 'pos-settings';
    }
    
    // للموارد البشرية (HCM) - تطابق قاعدة البيانات
    if (url.includes('/dashboard') && url.includes('/hcm')) {
      return 'hcm-dashboard';
    }
    if (url.includes('/recruitment')) {
      return 'recruitment-management';
    }
    if (url.includes('/contracts')) {
      return 'contract-management';
    }
    if (url.includes('/employee-files')) {
      return 'employee-files';
    }
    if (url.includes('/payroll')) {
      return 'payroll-management';
    }
    if (url.includes('/attendance')) {
      return 'attendance-management';
    }
    if (url.includes('/performance')) {
      return 'performance-management';
    }
    if (url.includes('/offboarding')) {
      return 'offboarding-management';
    }
    if (url.includes('/self-service')) {
      return 'employee-self-service';
    }
    if (url.includes('/capital-management')) {
      return 'capital-management';
    }
    if (url.includes('/reports') && url.includes('/hcm')) {
      return 'hcm-reports';
    }
    
    // للحسابات - تطابق قاعدة البيانات
    if (url.includes('/dashboard') && url.includes('/accounts')) {
      return 'accounting-dashboard';
    }
    if (url.includes('/accounts')) {
      return 'accounts-management';
    }
    
    // للأصول الثابتة - تطابق قاعدة البيانات
    if (url.includes('/dashboard') && url.includes('/fixed-assets')) {
      return 'fixed-assets-dashboard';
    }
    if (url.includes('/fixed-assets')) {
      return 'fixed-assets-management';
    }
    
    // للعمليات المحاسبية - تطابق قاعدة البيانات
    if (url.includes('/dashboard') && url.includes('/accounting-operations')) {
      return 'accounting-operations-dashboard';
    }
    if (url.includes('/accounting-operations')) {
      return 'accounting-operations';
    }
    
    // للتقارير المالية - تطابق قاعدة البيانات
    if (url.includes('/dashboard') && url.includes('/financial-reports')) {
      return 'financial-reports-dashboard';
    }
    if (url.includes('/financial-reports')) {
      return 'financial-reports';
    }
    
    // للإدارة - تطابق قاعدة البيانات
    if (url.includes('/dashboard') && url.includes('/administration')) {
      return 'administration-dashboard';
    }
    if (url.includes('/administration')) {
      return 'administration-management';
    }
    
    // لتطوير الجودة - تطابق قاعدة البيانات
    if (url.includes('/quality-development')) {
      return 'quality-development';
    }
    
    // للمستندات - تطابق قاعدة البيانات
    if (url.includes('/documents')) {
      return 'document-management';
    }
    
    // للخدمات العامة - تطابق قاعدة البيانات
    if (url.includes('/general-services')) {
      return 'general-services';
    }
    
    // للمج.ملات - تطابق قاعدة البيانات
    if (url.includes('/correspondence')) {
      return 'correspondence-management';
    }
    
    // للمقارنة بين الفروع - تطابق قاعدة البيانات
    if (url.includes('/branch-comparison')) {
      return 'branch-comparison';
    }
    
    // لإدارة الفروع - تطابق قاعدة البيانات
    if (url.includes('/branch-management')) {
      return 'branch-management';
    }
    
    // لإدارة الشركة - تطابق قاعدة البيانات
    if (url.includes('/company-settings')) {
      return 'company-settings';
    }
    
    // لإعدادات الفروع - تطابق قاعدة البيانات
    if (url.includes('/branch-settings')) {
      return 'branch-settings';
    }
    
    // للإعدادات المتقدمة - تطابق قاعدة البيانات
    if (url.includes('/advanced-settings')) {
      return 'advanced-settings';
    }
    
    // لإعدادات الأجهزة - تطابق قاعدة البيانات
    if (url.includes('/device-settings')) {
      return 'device-settings';
    }
    
    // لإعدادات النظام - تطابق قاعدة البيانات
    if (url.includes('/system-settings')) {
      return 'system-settings';
    }
    
    // لإعدادات الثيمات - تطابق قاعدة البيانات
    if (url.includes('/theme-settings')) {
      return 'theme-settings';
    }
    
    // لإدارة المستخدمين - تطابق قاعدة البيانات
    if (url.includes('/user-management')) {
      return 'user-management';
    }
    
    // للأدوار والصلاحيات - تطابق قاعدة البيانات
    if (url.includes('/roles-permissions')) {
      return 'roles-permissions';
    }
    
    
    // لإدارة النادي الرياضي - تطابق قاعدة البيانات
    if (url.includes('/dashboard') && url.includes('/gym')) {
      return 'gym-dashboard';
    }
    if (url.includes('/gym/memberships')) {
      return 'membership-management';
    }
    if (url.includes('/gym/membership-cards')) {
      return 'membership-cards';
    }
    if (url.includes('/gym/barcode-search')) {
      return 'barcode-search';
    }
    if (url.includes('/gym/barcode-management')) {
      return 'barcode-management';
    }
    if (url.includes('/gym/attendance')) {
      return 'member-attendance';
    }
    if (url.includes('/gym/groups')) {
      return 'groups-categories';
    }
    if (url.includes('/gym/surveys')) {
      return 'surveys';
    }
    // صفحات الاشتراكات والإيصالات - يجب البحث عنها في وحدة crm
    if (url.includes('/gym/subscriptions') || url.includes('/crm/subscriptions')) {
      return 'subscriptions';
    }
    if (url.includes('/gym/add-subscription') || url.includes('/crm/add-subscription')) {
      return 'add-subscription';
    }
    if (url.includes('/gym/special-subscriptions') || url.includes('/crm/special-subscriptions')) {
      return 'special-subscriptions';
    }
    if (url.includes('/gym/time-based-special-subscriptions') || url.includes('/crm/time-based-special-subscriptions')) {
      return 'time-based-special-subscriptions';
    }
    if (url.includes('/gym/invoices') || url.includes('/crm/invoices') || url.includes('/gym/invoices-receipts') || url.includes('/crm/invoices-receipts')) {
      return 'invoices-receipts';
    }
    if (url.includes('/gym/financial-reports') || url.includes('/crm/financial-reports')) {
      return 'financial-reports';
    }
    if (url.includes('/gym/discounts') || url.includes('/crm/discounts') || url.includes('/gym/discounts-offers') || url.includes('/crm/discounts-offers')) {
      return 'discounts-offers';
    }
    if (url.includes('/gym/lockers') && !url.includes('/add-locker') && !url.includes('/settings')) {
      return 'lockers-list';
    }
    if (url.includes('/gym/add-locker')) {
      return 'add-locker';
    }
    if (url.includes('/gym/settings/locker')) {
      return 'locker-settings';
    }
    if (url.includes('/gym/online-payments')) {
      return 'online-payments';
    }
    
    // لإدارة التطبيق
    if (url.includes('/app/about')) {
      return 'about-app';
    }
    if (url.includes('/app/invitations/sent')) {
      return 'sent-invitations';
    }
    if (url.includes('/app/invitations/accepted')) {
      return 'accepted-invitations';
    }
    if (url.includes('/app/invitations/attended')) {
      return 'attended-invitations';
    }
    if (url.includes('/app/invitations/rejected')) {
      return 'rejected-invitations';
    }
    if (url.includes('/app/offers')) {
      return 'app-offers';
    }
    if (url.includes('/app/trainers')) {
      return 'app-trainers';
    }
    if (url.includes('/app/exercise-categories')) {
      return 'exercise-categories';
    }
    if (url.includes('/app/exercises')) {
      return 'app-exercises';
    }
    if (url.includes('/app/news')) {
      return 'app-news';
    }
    if (url.includes('/app/ads')) {
      return 'app-ads';
    }
    if (url.includes('/gym/financial-reports')) {
      return 'financial-reports';
    }
    if (url.includes('/gym/discounts')) {
      return 'discounts-offers';
    }
    if (url.includes('/gym/member-form')) {
      return 'member-form';
    }
    if (url.includes('/gym/workout-programs')) {
      return 'training-programs';
    }
    if (url.includes('/gym/workout-templates')) {
      return 'workout-templates';
    }
    if (url.includes('/gym/strength-training')) {
      return 'strength-training';
    }
    if (url.includes('/gym/progress-tracking')) {
      return 'progress-tracking';
    }
    if (url.includes('/gym/assessments')) {
      return 'fitness-assessments';
    }
    if (url.includes('/gym/scheduling')) {
      return 'scheduling';
    }
    if (url.includes('/gym/classes')) {
      return 'classes';
    }
    if (url.includes('/gym/class-booking')) {
      return 'class-booking';
    }
    if (url.includes('/gym/room-bookings')) {
      return 'room-bookings';
    }
    if (url.includes('/gym/personal-sessions')) {
      return 'personal-sessions';
    }
    if (url.includes('/gym/trainers')) {
      return 'trainer-management';
    }
    if (url.includes('/gym/trainer-payments')) {
      return 'trainer-payments';
    }
    if (url.includes('/gym/trainer-search')) {
      return 'trainer-search';
    }
    if (url.includes('/gym/trainer-ratings')) {
      return 'trainer-ratings';
    }
    if (url.includes('/gym/facilities')) {
      return 'facility-management';
    }
    if (url.includes('/gym/equipment') && !url.includes('/equipment-maintenance')) {
      return 'equipment-inventory';
    }
    if (url.includes('/gym/equipment-maintenance')) {
      return 'equipment-maintenance';
    }
    if (url.includes('/gym/spa-services')) {
      return 'spa-services';
    }
    if (url.includes('/gym/sales')) {
      return 'sales-management';
    }
    if (url.includes('/gym/marketing')) {
      return 'marketing';
    }
    if (url.includes('/gym/loyalty-programs')) {
      return 'loyalty-programs';
    }
    if (url.includes('/gym/reports')) {
      return 'reports-analytics';
    }
    if (url.includes('/gym/mobile-app')) {
      return 'mobile-app';
    }

    // صفحات إعدادات كل إدارة
    if (url === '/gym/settings/membership') {
      return 'membership-settings';
    }
    if (url === '/gym/settings/subscription-payment') {
      return 'subscription-settings';
    }
    if (url === '/gym/settings/workout-programs') {
      return 'workout-programs-settings';
    }
    if (url === '/gym/settings/scheduling') {
      return 'scheduling-settings';
    }
    if (url === '/gym/settings/trainers') {
      return 'trainer-settings';
    }
    if (url === '/gym/settings/facilities') {
      return 'facility-settings';
    }
    if (url === '/gym/settings/services-marketing') {
      return 'sales-settings';
    }

    for (const route of gymSettingsRoutes) {
      if (url.includes(route.path)) {
        return route.page;
      }
    }
    if (
      url === '/gym/settings' ||
      (url.startsWith('/gym/settings') && !gymSettingsRoutes.some(route => url.includes(route.path)))
    ) {
      return 'club-settings';
    }

    if (url.includes('/gym/support')) {
      return 'technical-support';
    }
    // للمسار الرئيسي /gym
    if (url === '/gym') {
      return 'gym-dashboard';
    }
    
    // HR Management URLs
    if (url.includes('/hr')) {
      if (url.includes('/hr/dashboard') || url === '/hr') {
        return 'hr-dashboard';
      }
      if (url.includes('/hr/employees')) {
        return 'employee-management';
      }
      if (url.includes('/hr/recruitment')) {
        return 'recruitment';
      }
      if (url.includes('/hr/attendance')) {
        return 'attendance-management';
      }
      if (url.includes('/hr/shifts')) {
        return 'shifts';
      }
      if (url.includes('/hr/leaves')) {
        return 'leave-management';
      }
      if (url.includes('/hr/payroll')) {
        return 'payroll-management';
      }
      if (url.includes('/hr/training')) {
        return 'training';
      }
      if (url.includes('/hr/performance')) {
        return 'performance';
      }
      if (url.includes('/hr/benefits')) {
        return 'benefits';
      }
      if (url.includes('/hr/contracts')) {
        return 'contracts';
      }
      if (url.includes('/hr/documents')) {
        return 'documents';
      }
      if (url.includes('/hr/reports')) {
        return 'reports';
      }
    }
    
    // Warehouse Management URLs
    if (url.includes('/warehouse')) {
      if (url.includes('/warehouse/dashboard') || url === '/warehouse') {
        return 'warehouse-dashboard';
      }
      if (url.includes('/warehouse/management')) {
        return 'warehouse-management';
      }
      if (url.includes('/warehouse/movement')) {
        return 'stock-movement';
      }
      if (url.includes('/warehouse/items')) {
        return 'inventory-items';
      }
      if (url.includes('/warehouse/stock-taking')) {
        return 'stock-taking';
      }
      if (url.includes('/warehouse/reports')) {
        return 'warehouse-reports';
      }
    }
    
    // Fleet Management URLs
    if (url.includes('/fleet')) {
      if (url.includes('/fleet/dashboard') || url === '/fleet') {
        return 'fleet-dashboard';
      }
      if (url.includes('/fleet/vehicles')) {
        return 'vehicle-management';
      }
      if (url.includes('/fleet/tracking')) {
        return 'vehicle-tracking';
      }
      if (url.includes('/fleet/fuel')) {
        return 'fuel-management';
      }
      if (url.includes('/fleet/drivers')) {
        return 'driver-management';
      }
    }
    
    // Maintenance Management URLs
    if (url.includes('/maintenance')) {
      if (url.includes('/maintenance/dashboard') || url === '/maintenance') {
        return 'maintenance-dashboard';
      }
      if (url.includes('/maintenance/requests')) {
        return 'maintenance-requests';
      }
      if (url.includes('/maintenance/scheduled')) {
        return 'scheduled-maintenance';
      }
      if (url.includes('/maintenance/technicians')) {
        return 'technician-management';
      }
      if (url.includes('/maintenance/reports')) {
        return 'maintenance-reports';
      }
    }
    
    // Marketing & Sales Management URLs
    if (url.includes('/marketing')) {
      if (url.includes('/marketing/dashboard') || url === '/marketing') {
        return 'marketing-dashboard';
      }
      if (url.includes('/marketing/campaigns')) {
        return 'campaign-management';
      }
      if (url.includes('/marketing/leads')) {
        return 'lead-management';
      }
      if (url.includes('/marketing/sales')) {
        return 'sales-management';
      }
    }
    
    return null;
  }, []);

  // تصفية القوائم بناءً على صلاحيات المستخدم
  const filteredMenuSections = useMemo(() => {
    
    // إذا كانت الصلاحيات في التحميل، لا نعرض أي قوائم حتى يتم تحميل الصلاحيات
    if (isLoadingPermissions) {
      console.log('⏳ AppSidebar - Loading permissions... hiding menu until permissions are loaded');
      return [];
    }

    // إذا لم يكن لديه صلاحيات، لا نعرض أي قوائم
    if (!userPermissions || Object.keys(userPermissions).length === 0) {
      console.log('⚠️ AppSidebar - No user permissions found, hiding menu:', { userPermissions, isLoadingPermissions });
      return [];
    }

    // Debug: Log gym-management permissions
    if (userPermissions['gym-management']) {
      console.log('🏋️ AppSidebar - Gym management permissions:', {
        module: userPermissions['gym-management'],
        pages: Object.keys(userPermissions['gym-management'].pages || {}),
        settingsPages: gymSettingsPageSlugs.filter(slug => 
          userPermissions['gym-management'].pages?.[slug]
        )
      });
    }

    
    return menuSections.map(section => ({
      ...section,
      items: section.items.map(item => {
        if (item.submenu) {
          // تصفية القوائم الفرعية
          const filteredSubmenu = item.submenu.filter(subItem => {
            // Debug: Log all submenu items being checked
            const isSettingsItem = subItem.url.includes('settings');
            if (isSettingsItem) {
              console.log('🔍 AppSidebar - Processing settings menu item:', {
                title: subItem.title,
                url: subItem.url,
                itemTitle: item.title
              });
            }
            // تحديد الوحدة والصفحة من URL
            const moduleName = getModuleFromUrl(subItem.url);
            const pageName = getPageFromUrl(subItem.url);
            
            if (!moduleName || !pageName) {
              console.warn('⚠️ لا يمكن تحديد الوحدة أو الصفحة:', {
                url: subItem.url,
                moduleName,
                pageName
              });
              return false; // إذا لم نتمكن من تحديد الوحدة، لا نعرض العنصر
            }
            
            // تحقق إضافي من الصلاحيات
            const hasModulePermission = userPermissions[moduleName];
            
            // إذا لم يكن للمستخدم صلاحيات على الوحدة نفسها، لا نعرض أي صفحة منها
            if (!hasModulePermission) {
              console.log('❌ AppSidebar - No module permission:', moduleName);
              return false;
            }
            
            const pageData = hasModulePermission?.pages?.[pageName];
            const isSettingsPage = pageName.includes('settings');
            
            // Debug خاص لصفحات الإعدادات
            if (isSettingsPage) {
              console.log('⚙️ AppSidebar - Checking settings page:', {
                url: subItem.url,
                moduleName,
                pageName,
                hasModulePermission: !!hasModulePermission,
                pageData: pageData ? {
                  pageTitle: pageData.pageTitle,
                  canView: pageData.permissions?.canView,
                  permissions: pageData.permissions
                } : null,
                allPagesInModule: hasModulePermission ? Object.keys(hasModulePermission.pages || {}) : [],
                matchingPages: hasModulePermission ? Object.keys(hasModulePermission.pages || {}).filter(p => p.includes('settings')) : []
              });
            }
            
            let hasPagePermission = false;
            let hasAccess = false;
            
            // التحقق من الصلاحيات بشكل صحيح - يجب أن تكون canView: true
            if (pageData && pageData.permissions) {
              hasPagePermission = pageData.permissions.canView === true || pageData.permissions.canView === 1;
              hasAccess = hasPagePermission;
              
              if (isSettingsPage) {
                console.log('✅ AppSidebar - Settings page found in permissions:', {
                  moduleName,
                  pageName,
                  canView: pageData.permissions.canView,
                  hasPagePermission,
                  allPermissions: pageData.permissions
                });
              }
            } else {
              // إذا لم تكن الصفحة موجودة في قاعدة البيانات أو لم يكن لديها صلاحيات، نستخدم canAccessPage
              hasAccess = canAccessPage(moduleName, pageName);
              hasPagePermission = hasAccess;
              
              if (isSettingsPage) {
                console.log('⚠️ AppSidebar - Settings page not found in permissions, using canAccessPage:', {
                  moduleName,
                  pageName,
                  hasAccess,
                  availablePages: Object.keys(hasModulePermission?.pages || {}),
                  canAccessPageResult: hasAccess
                });
              }
            }
            
            // إذا لم يكن canView: true، لا نعرض الصفحة
            if (!hasPagePermission) {
              console.log('❌ AppSidebar - No view permission for page:', { 
                moduleName, 
                pageName, 
                pageData,
                hasModulePermission: !!hasModulePermission,
                availablePages: hasModulePermission ? Object.keys(hasModulePermission.pages || {}) : []
              });
              return false;
            }

            let effectiveAccess = hasAccess;
            
            console.log('✅ AppSidebar - Page authorized:', {
              url: subItem.url,
              moduleName,
              pageName,
              hasAccess,
              effectiveAccess,
              hasPagePermission
            });
              
            // نعرض فقط الصفحات التي لدى المستخدم صلاحيات لها
            return effectiveAccess && hasPagePermission;
          });

          console.log('📋 تصفية القائمة:', {
            title: item.title,
            url: item.url,
            originalCount: item.submenu.length,
            filteredCount: filteredSubmenu.length
          });

          // إذا لم يتبق أي عنصر فرعي مصرح به، لا نعرض هذا البند نهائياً
          if (filteredSubmenu.length === 0) {
            // لا نعرض العنصر الرئيسي إذا لم يكن لديه صفحات فرعية مصرح بها
            console.log('❌ AppSidebar - No authorized submenu items, hiding main item:', item.title);
            return null;
          }
          
          // إرجاع العنصر مع القوائم الفرعية المصفاة فقط
          return {
            ...item,
            submenu: filteredSubmenu
          };
        } else {
          // للعناصر الرئيسية التي لا تحتوي على submenu، نتحقق من الصلاحيات
          const moduleName = getModuleFromUrl(item.url || '');
          const pageName = getPageFromUrl(item.url || '');
          
          console.log('🔍 فحص العنصر الرئيسي:', {
            url: item.url,
            moduleName,
            pageName,
            hasModule: !!moduleName,
            hasPage: !!pageName
          });
          
          // صفحة Dashboard (الرئيسية) متاحة دائماً للمستخدمين المسجلين
          if (item.url === '/dashboard' || moduleName === 'dashboard') {
            console.log('✅ AppSidebar - Dashboard is always accessible');
            return item;
          }
          
          if (!moduleName || !pageName) {
            console.warn('⚠️ لا يمكن تحديد الوحدة أو الصفحة للعنصر الرئيسي:', {
              url: item.url,
              moduleName,
              pageName
            });
            return false; // إذا لم نتمكن من تحديد الوحدة، لا نعرض العنصر
          }
          
          // التحقق من صلاحيات الوحدة أولاً
          const mainModulePermission = userPermissions[moduleName];
          if (!mainModulePermission) {
            console.log('❌ AppSidebar - No module permission for main item:', moduleName);
            return false;
          }
          
          // التحقق من صلاحيات الصفحة
          const mainPageData = mainModulePermission?.pages?.[pageName];
          const mainHasPagePermission = mainPageData?.permissions?.canView === true || mainPageData?.permissions?.canView === 1;
          
          const hasAccess = canAccessPage(moduleName, pageName) && mainHasPagePermission;
          
          console.log('🔍 فحص صلاحيات العنصر الرئيسي:', {
            moduleName,
            pageName,
            canAccessPage: hasAccess,
            mainHasPagePermission,
            mainPageData
          });
          
          return hasAccess ? item : null;
        }
      }).filter((item): item is MenuItem => item !== null && item !== false) // إزالة العناصر null و false
    })).filter(section => section.items.length > 0); // إزالة الأقسام الفارغة
  }, [userPermissions, isLoadingPermissions, canAccessPage, getModuleFromUrl, getPageFromUrl]);


  return (
    <Sidebar
      className="order-2 shadow-2xl border-l border-sidebar-border bg-[hsl(var(--sidebar-background))] text-sidebar-foreground backdrop-blur-xl transition-colors duration-300 dark:text-white"
      side="right"
    >
      <SidebarHeader className="p-6 border-b border-sidebar-border bg-[hsl(var(--sidebar-background))] dark:bg-[hsl(var(--sidebar-background))]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src="/logo.jpeg" 
              alt="Meta Codecx" 
              className="w-12 h-12 rounded-xl shadow-lg ring-2 ring-primary/45 hover:ring-primary/65 transition-all duration-200"
            />
          </div>
          {!collapsed && (
            <div className="text-right">
              <h3 className="font-bold text-xl text-primary tracking-wide">
                Meta Codecx
              </h3>
              <p className="text-sm text-sidebar-foreground/70 font-medium">
                منصة إدارة نادي Meta Codecx المتكاملة
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Stars className="w-3 h-3 text-primary" />
                <span className="text-xs text-primary/80 font-semibold">هوية Meta Codecx</span>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="custom-scrollbar overflow-y-auto bg-[hsl(var(--sidebar-background))] dark:bg-[hsl(var(--sidebar-background))] max-h-[calc(100vh-120px)]">
        {isLoadingPermissions ? (
          // رسالة التحميل
          <div className="flex items-center justify-center h-32 text-sidebar-foreground/70">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm">جاري تحميل الصلاحيات...</p>
            </div>
          </div>
        ) : filteredMenuSections.length === 0 ? (
          // رسالة عدم وجود صلاحيات
          <div className="flex items-center justify-center h-32 text-sidebar-foreground/70">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-3 text-primary/60" />
              <p className="text-sm font-medium mb-1">لا توجد صلاحيات</p>
              <p className="text-xs text-sidebar-foreground/50">يرجى التواصل مع المدير لإعطائك الصلاحيات المناسبة</p>
            </div>
          </div>
        ) : (
          // عرض القوائم المصرح بها
          filteredMenuSections.map((section, sectionIndex) => (
          <SidebarGroup key={section.title} className="px-2 py-0.5">
            {!collapsed && section.title && (
              <SidebarGroupLabel className="text-sidebar-foreground/60 font-bold text-xs uppercase tracking-wider mb-0.5 px-1">
                {section.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent className="space-y-0.5">
              <SidebarMenu>
                {section.items.map((item, itemIndex) => (
                  <SidebarMenuItem key={item.title}>
                    {item.submenu ? (
                      <Collapsible
                        open={openMenus.includes(item.title)}
                        onOpenChange={() => toggleMenu(item.title)}
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={`group w-full justify-between p-3 rounded-xl transition-all duration-200 hover:shadow-md ${
                              isSubmenuActive(item.submenu)
                                ? "bg-primary/15 text-sidebar-foreground font-semibold shadow-lg border border-primary/30 ring-1 ring-primary/20"
                                : "hover:bg-sidebar-accent/40 text-sidebar-foreground/80 hover:text-sidebar-foreground"
                            }`}
                            onMouseEnter={() => setHoveredItem(item.title)}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/60 via-primary/35 to-primary/20 shadow-lg ring-1 ring-primary/30">
                                <item.icon className="w-4 h-4 text-primary" />
                              </div>
                              {!collapsed && (
                                <div className="flex-1 text-right">
                                  <span className="font-medium text-sidebar-foreground">{item.title}</span>
                                </div>
                              )}
                            </div>
                            {!collapsed && (
                              <ChevronDown
                                className={`w-4 h-4 transition-all duration-200 ${
                                  openMenus.includes(item.title) ? "rotate-180 text-primary" : "text-sidebar-foreground/60"
                                }`}
                              />
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2">
                          <SidebarMenuSub className="space-y-1 pr-4">
                            {item.submenu.map((subItem, subIndex) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  className={`p-3 rounded-lg transition-all duration-200 ${
                                    isActive(subItem.url)
                                      ? "bg-primary/15 text-sidebar-foreground font-semibold shadow-lg border border-primary/30"
                                      : "hover:bg-sidebar-accent/40 text-sidebar-foreground/75 hover:text-sidebar-foreground"
                                  }`}
                                  onMouseEnter={() => setHoveredItem(subItem.title)}
                                  onMouseLeave={() => setHoveredItem(null)}
                                >
                                  <NavLink to={subItem.url} className="flex items-center gap-3 w-full">
                                     <div className="relative">
                                        <subItem.icon className="w-4 h-4 text-primary transition-colors duration-200" />
                                        {isActive(subItem.url) && (
                                          <div className="absolute -inset-1 bg-primary/20 rounded-full"></div>
                                        )}
                                     </div>
                                     <div className="flex-1 text-right">
                                       <span className="text-sm font-medium text-sidebar-foreground">{subItem.title}</span>
                                     </div>
                                    {isActive(subItem.url) && (
                                      <CheckCircle className="w-3 h-3 text-primary" />
                                    )}
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        className={`p-3 rounded-xl transition-all duration-200 hover:shadow-md ${
                          isActive(item.url || '')
                            ? "bg-primary/15 text-sidebar-foreground font-semibold shadow-lg border border-primary/30 ring-1 ring-primary/20"
                            : "hover:bg-sidebar-accent/40 text-sidebar-foreground/80 hover:text-sidebar-foreground"
                        }`}
                        onMouseEnter={() => setHoveredItem(item.title)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <NavLink to={item.url || '/'} className="flex items-center gap-3 w-full">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/60 via-primary/35 to-primary/20 shadow-lg ring-1 ring-primary/30">
                            <item.icon className="w-4 h-4 text-primary" />
                          </div>
                          {!collapsed && (
                            <div className="flex-1 text-right">
                              <span className="font-medium text-sidebar-foreground">{item.title}</span>
                            </div>
                          )}
                          {isActive(item.url || '') && (
                            <CheckCircle className="w-4 h-4 text-primary" />
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )))}
      </SidebarContent>

      {/* Footer Section */}
      <SidebarFooter className="p-4 border-t border-sidebar-border bg-white/95 dark:bg-[hsl(var(--sidebar-background))]">
        <div className="space-y-3">
          {/* User Profile Section */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 p-3 rounded-xl hover:bg-primary/15 text-sidebar-foreground transition-all duration-200 hover:scale-[1.02] ${
                  collapsed ? "px-2" : "px-3"
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/api/placeholder/32/32" alt="المستخدم" />
                  <AvatarFallback className="bg-gradient-to-br from-white via-[#f1e5c7] to-primary text-primary-foreground text-sm font-bold dark:from-[#090a0f] dark:via-[#1b1f2d] dark:to-primary dark:text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 text-right">
                    <p className="text-sm font-medium text-sidebar-foreground">{userName}</p>
                    <p className="text-xs text-sidebar-foreground/70">{userRole}</p>
                  </div>
                )}
                {!collapsed && <ChevronDown className="w-4 h-4 text-sidebar-foreground/60" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-white/95 dark:bg-gradient-to-b dark:from-[#050608] dark:via-[#11131b] dark:to-[#1b2030]/95 backdrop-blur-sm border border-primary/25 shadow-xl"
            >
              <DropdownMenuItem onClick={handleProfile} className="gap-3 text-sidebar-foreground hover:bg-primary/15 focus:bg-primary/15 cursor-pointer dark:text-white">
                <User className="w-5 h-5 stroke-2 text-primary" />
                <span className="font-medium">الملف الشخصي</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAccountSettings} className="gap-3 text-sidebar-foreground hover:bg-primary/15 focus:bg-primary/15 cursor-pointer dark:text-white">
                <Settings className="w-5 h-5 stroke-2 text-primary" />
                <span className="font-medium">إعدادات الحساب</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-primary/25" />
              <DropdownMenuItem onClick={handleLogout} className="gap-3 text-red-400 hover:bg-red-500/20 focus:bg-red-500/20 cursor-pointer">
                <LogOut className="w-5 h-5 stroke-2" />
                <span className="font-medium">تسجيل الخروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Actions Row */}
          {!collapsed && (
            <div className="flex items-center justify-between gap-2">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNotifications}
                className="relative p-2.5 rounded-xl hover:bg-primary/15 text-sidebar-foreground/80 hover:text-sidebar-foreground transition-all duration-200 hover:scale-105 hover:shadow-lg dark:text-white/80 dark:hover:text-white"
                title="الإشعارات"
              >
                <Bell className="w-5 h-5 stroke-2 text-primary" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-primary/30"></span>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleThemeToggle}
                className="p-2.5 rounded-xl hover:bg-primary/15 text-sidebar-foreground/80 hover:text-sidebar-foreground transition-all duration-200 hover:scale-105 hover:shadow-lg dark:text-white/80 dark:hover:text-white"
                title="تبديل السمة"
              >
                {isDarkMode ? <Sun className="w-5 h-5 stroke-2 text-primary" /> : <Moon className="w-5 h-5 stroke-2 text-primary" />}
              </Button>

              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLanguageToggle}
                className="p-2.5 rounded-xl hover:bg-primary/15 text-sidebar-foreground/80 hover:text-sidebar-foreground transition-all duration-200 hover:scale-105 hover:shadow-lg dark:text-white/80 dark:hover:text-white"
                title="تبديل اللغة"
              >
                <Languages className="w-5 h-5 stroke-2 text-primary" />
              </Button>

              {/* Help */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleHelp}
                className="p-2.5 rounded-xl hover:bg-primary/15 text-sidebar-foreground/80 hover:text-sidebar-foreground transition-all duration-200 hover:scale-105 hover:shadow-lg dark:text-white/80 dark:hover:text-white"
                title="المساعدة"
              >
                <HelpCircle className="w-5 h-5 stroke-2 text-primary" />
              </Button>
            </div>
          )}

          {/* Collapsed Mode Icons */}
          {collapsed && (
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNotifications}
                className="relative p-2.5 rounded-xl hover:bg-primary/15 text-sidebar-foreground/80 hover:text-sidebar-foreground transition-all duration-200 hover:scale-105 hover:shadow-lg dark:text-white/80 dark:hover:text-white"
                title="الإشعارات"
              >
                <Bell className="w-5 h-5 stroke-2 text-primary" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-primary/30"></span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleThemeToggle}
                className="p-2.5 rounded-xl hover:bg-primary/15 text-sidebar-foreground/80 hover:text-sidebar-foreground transition-all duration-200 hover:scale-105 hover:shadow-lg dark:text-white/80 dark:hover:text-white"
                title="تبديل السمة"
              >
                {isDarkMode ? <Sun className="w-5 h-5 stroke-2 text-primary" /> : <Moon className="w-5 h-5 stroke-2 text-primary" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLanguageToggle}
                className="p-2.5 rounded-xl hover:bg-primary/15 text-sidebar-foreground/80 hover:text-sidebar-foreground transition-all duration-200 hover:scale-105 hover:shadow-lg dark:text-white/80 dark:hover:text-white"
                title="تبديل اللغة"
              >
                <Languages className="w-5 h-5 stroke-2 text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleHelp}
                className="p-2.5 rounded-xl hover:bg-primary/15 text-sidebar-foreground/80 hover:text-sidebar-foreground transition-all duration-200 hover:scale-105 hover:shadow-lg dark:text-white/80 dark:hover:text-white"
                title="المساعدة"
              >
                <HelpCircle className="w-5 h-5 stroke-2 text-primary" />
              </Button>
            </div>
          )}

          {/* Quick Links */}
          {!collapsed && (
            <>
              <Separator className="bg-primary/20" />
              <div className="flex items-center justify-between text-xs">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrivacyPolicy}
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground p-2 h-auto font-normal hover:bg-primary/15 rounded-lg transition-all duration-200 hover:scale-105 dark:text-white/70 dark:hover:text-white"
                >
                  <Link className="w-4 h-4 stroke-2 mr-1 text-primary" />
                  الخصوصية
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleTermsPolicy}
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground p-2 h-auto font-normal hover:bg-primary/15 rounded-lg transition-all duration-200 hover:scale-105 dark:text-white/70 dark:hover:text-white"
                >
                  <ExternalLink className="w-4 h-4 stroke-2 mr-1 text-primary" />
                  السياسة
                </Button>
              </div>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

