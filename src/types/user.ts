export interface User {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  position: string;
  branch: string;
  supervisor: string;
  hireDate: string;
  salary: number;
  status: "active" | "inactive";
  lastLogin: string;
  address: {
    country: string;
    city: string;
    district: string;
    street: string;
    postalCode: string;
  };
  emergency: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface UserFormData {
  name: string;
  nameEn: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  position: string;
  branch: string;
  supervisor: string;
  hireDate: string;
  salary: number;
  status: "active" | "inactive";
  password: string; // إضافة حقل كلمة المرور
  address: {
    country: string;
    city: string;
    district: string;
    street: string;
    postalCode: string;
  };
  emergency: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface AccountData {
  username: string;
  password: string;
  confirmPassword: string;
}

// User Permissions Interface
export interface UserPermissions {
  dashboard: boolean;
  pos: boolean;
  inventory: boolean;
  crm: boolean;
  reception: boolean;
  reports: boolean;
  settings: boolean;
  users: boolean;
  backup: boolean;
  systemLogs: boolean;
}

// User Modules Interface
export interface UserModules {
  sales: boolean;
  purchases: boolean;
  accounting: boolean;
  hr: boolean;
  maintenance: boolean;
}

// User Roles Interface
export interface UserRoles {
  roles: string[];
  primaryRole: string;
}

// User Audit Log Interface
export interface UserAuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

// User Login History Interface
export interface UserLoginHistory {
  id: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
  location?: string;
}

// API Response Interfaces
export interface UsersResponse {
  users: User[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface UserPermissionsResponse {
  permissions: UserPermissions;
  lastUpdated: string;
}

export interface UserModulesResponse {
  modules: UserModules;
  lastUpdated: string;
}

export interface UserRolesResponse {
  roles: UserRoles;
  lastUpdated: string;
}

export interface UserAuditLogResponse {
  logs: UserAuditLog[];
  totalCount: number;
}

export interface UserLoginHistoryResponse {
  history: UserLoginHistory[];
  totalCount: number;
}

export const roles = [
  { id: "admin", name: "مدير النظام" },
  { id: "manager", name: "مدير عام" },
  { id: "branch_manager", name: "مدير فرع" },
  { id: "supervisor", name: "مشرف" },
  { id: "employee", name: "موظف" },
  { id: "viewer", name: "مشاهد" },
];

// Permission Types
export const permissionTypes = [
  { id: "view", name: "عرض", description: "عرض البيانات والشاشات" },
  { id: "create", name: "إنشاء", description: "إنشاء وإضافة بيانات جديدة" },
  { id: "edit", name: "تعديل", description: "تعديل البيانات الموجودة" },
  { id: "delete", name: "حذف", description: "حذف البيانات" },
  { id: "approve", name: "اعتماد", description: "اعتماد العمليات والطلبات" },
  { id: "reject", name: "رفض", description: "رفض العمليات والطلبات" },
  { id: "export", name: "تصدير", description: "تصدير البيانات والتقارير" },
  { id: "print", name: "طباعة", description: "طباعة المستندات" },
  { id: "audit", name: "تدقيق", description: "مراجعة سجل النشاطات" },
  { id: "configure", name: "تكوين", description: "تكوين الإعدادات المتقدمة" }
];

// System Modules
export const systemModules = [
  {
    id: "dashboard",
    name: "لوحة التحكم الرئيسية",
    screens: [
      "عرض لوحة التحكم",
      "إحصائيات المبيعات",
      "تقارير الأداء",
      "مراقبة النظام"
    ]
  },
  {
    id: "customers",
    name: "إدارة العملاء",
    screens: [
      "قائمة العملاء",
      "إضافة عميل جديد",
      "تعديل بيانات العميل",
      "حذف عميل",
      "تاريخ العميل",
      "نقاط الولاء"
    ]
  },
  {
    id: "services",
    name: "إدارة الخدمات",
    screens: [
      "قائمة الخدمات",
      "إضافة خدمة جديدة",
      "تعديل الخدمة",
      "حذف الخدمة",
      "أسعار الخدمات",
      "مدة الخدمة"
    ]
  },
  {
    id: "orders",
    name: "إدارة الطلبات",
    screens: [
      "قائمة الطلبات",
      "إنشاء طلب جديد",
      "تعديل الطلب",
      "إلغاء الطلب",
      "حالة الطلب",
      "تتبع الطلب"
    ]
  },
  {
    id: "inventory",
    name: "إدارة المخزون",
    screens: [
      "قائمة المنتجات",
      "إضافة منتج",
      "تعديل المنتج",
      "حذف المنتج",
      "جرد المخزون",
      "تقارير المخزون",
      "طلبات التوريد"
    ]
  },
  {
    id: "finance",
    name: "الإدارة المالية",
    screens: [
      "الإيصالات",
      "المدفوعات",
      "التقارير المالية",
      "الحسابات",
      "الضرائب",
      "التسويات المالية"
    ]
  },
  {
    id: "reports",
    name: "التقارير والتحليلات",
    screens: [
      "تقارير المبيعات",
      "تقارير العملاء",
      "تقارير المخزون",
      "تقارير الموظفين",
      "التحليلات التنبؤية",
      "تصدير التقارير"
    ]
  },
  {
    id: "settings",
    name: "إعدادات النظام",
    screens: [
      "الإعدادات العامة",
      "إدارة المستخدمين",
      "إدارة الأدوار",
      "إعدادات الأمان",
      "النسخ الاحتياطي",
      "سجل النشاطات"
    ]
  }
];