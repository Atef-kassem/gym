// تكوين API
export const API_CONFIG = {
  // عنوان الخادم الأساسي
  BASE_URL: import.meta.env.VITE_API_URL || 'https://metagym.metacodecx.com',
  
  // مسار API
  API_PATH: '/api/v1',
  
  // مهلة الطلب (بالميلي ثانية)
  TIMEOUT: 30000,
  
  // إعدادات CORS
  CORS: {
    credentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  },
  
  // إعدادات إعادة المحاولة
  RETRY: {
    maxRetries: 3,
    retryDelay: 1000,
  },
  
  // إعدادات التخزين المؤقت
  CACHE: {
    // مدة صلاحية التخزين المؤقت (بالميلي ثانية)
    ttl: 5 * 60 * 1000, // 5 دقائق
    
    // الحد الأقصى لعدد العناصر المخزنة مؤقتاً
    maxItems: 100,
  },
};

// تكوين نقاط النهاية
export const ENDPOINTS = {
  // نقاط نهاية الولاء
  LOYALTY: {
    MEMBERS: '/loyalty/members',
    TRANSACTIONS: '/loyalty/transactions',
    RULES: '/loyalty/rules',
    REWARDS: '/loyalty/rewards',
    STATS: '/loyalty/members/stats',
  },
  
  // نقاط نهاية العملاء
  CUSTOMERS: '/customers',
  
  // نقاط نهاية المصادقة
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
};

// تكوين رسائل الخطأ
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'خطأ في الاتصال بالخادم',
  UNAUTHORIZED: 'غير مصرح لك بالوصول',
  FORBIDDEN: 'ممنوع الوصول',
  NOT_FOUND: 'المورد غير موجود',
  VALIDATION_ERROR: 'خطأ في البيانات المدخلة',
  SERVER_ERROR: 'خطأ في الخادم',
  TIMEOUT_ERROR: 'انتهت مهلة الطلب',
};

// تكوين رسائل النجاح
export const SUCCESS_MESSAGES = {
  MEMBER_CREATED: 'تم إنشاء العضو بنجاح',
  MEMBER_UPDATED: 'تم تحديث العضو بنجاح',
  MEMBER_DELETED: 'تم حذف العضو بنجاح',
  POINTS_UPDATED: 'تم تحديث النقاط بنجاح',
  TRANSACTION_CREATED: 'تم إنشاء المعاملة بنجاح',
  RULE_CREATED: 'تم إنشاء القاعدة بنجاح',
  REWARD_CREATED: 'تم إنشاء المكافأة بنجاح',
};

// تكوين المستويات
export const MEMBERSHIP_LEVELS = {
  BRONZE: 'Bronze',
  SILVER: 'Silver',
  GOLD: 'Gold',
  PLATINUM: 'Platinum',
} as const;

// تكوين حالات العضو
export const MEMBER_STATUSES = {
  ACTIVE: 'نشط',
  FROZEN: 'مجمد',
  EXPIRED: 'منتهي',
} as const;

// تكوين أنواع المعاملات
export const TRANSACTION_TYPES = {
  EARNED: 'earned',
  REDEEMED: 'redeemed',
  BONUS: 'bonus',
  EXPIRED: 'expired',
} as const;

// تكوين أنواع الخصم
export const DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
} as const;

// تكوين الألوان للمستويات
export const LEVEL_COLORS = {
  [MEMBERSHIP_LEVELS.BRONZE]: 'from-amber-600 to-yellow-600',
  [MEMBERSHIP_LEVELS.SILVER]: 'from-gray-400 to-gray-600',
  [MEMBERSHIP_LEVELS.GOLD]: 'from-yellow-400 to-yellow-600',
  [MEMBERSHIP_LEVELS.PLATINUM]: 'from-purple-500 to-indigo-600',
} as const;

// تكوين الأيقونات للمستويات
export const LEVEL_ICONS = {
  [MEMBERSHIP_LEVELS.BRONZE]: 'Award',
  [MEMBERSHIP_LEVELS.SILVER]: 'Star',
  [MEMBERSHIP_LEVELS.GOLD]: 'Crown',
  [MEMBERSHIP_LEVELS.PLATINUM]: 'Trophy',
} as const;

// تكوين القيم الافتراضية
export const DEFAULT_VALUES = {
  INITIAL_POINTS: 0,
  EARN_RATE: 0.1, // 1 نقطة لكل 10 جنيه
  REDEEM_RATE: 0.1, // 1 جنيه لكل 10 نقاط
  MIN_PURCHASE: 10,
  MAX_POINTS: 1000,
  EXPIRY_MONTHS: 12,
  EXPIRY_DAYS: 30,
  MAX_REDEMPTIONS: 100,
} as const;

// تكوين التصفية
export const FILTER_OPTIONS = {
  LEVELS: [
    { value: 'all', label: 'جميع المستويات' },
    { value: MEMBERSHIP_LEVELS.BRONZE, label: 'Bronze' },
    { value: MEMBERSHIP_LEVELS.SILVER, label: 'Silver' },
    { value: MEMBERSHIP_LEVELS.GOLD, label: 'Gold' },
    { value: MEMBERSHIP_LEVELS.PLATINUM, label: 'Platinum' },
  ],
  
  STATUSES: [
    { value: 'all', label: 'جميع الحالات' },
    { value: MEMBER_STATUSES.ACTIVE, label: 'نشط' },
    { value: MEMBER_STATUSES.FROZEN, label: 'مجمد' },
    { value: MEMBER_STATUSES.EXPIRED, label: 'منتهي' },
  ],
  
  TRANSACTION_TYPES: [
    { value: 'all', label: 'جميع الأنواع' },
    { value: TRANSACTION_TYPES.EARNED, label: 'كسب' },
    { value: TRANSACTION_TYPES.REDEEMED, label: 'استرداد' },
    { value: TRANSACTION_TYPES.BONUS, label: 'مكافأة' },
    { value: TRANSACTION_TYPES.EXPIRED, label: 'منتهي' },
  ],
} as const;

// تكوين الترتيب
export const SORT_OPTIONS = {
  MEMBERS: [
    { value: 'createdAt', label: 'تاريخ الإنشاء' },
    { value: 'customerName', label: 'اسم العميل' },
    { value: 'currentBalance', label: 'الرصيد الحالي' },
    { value: 'membershipLevel', label: 'المستوى' },
    { value: 'lastActivity', label: 'آخر نشاط' },
  ],
  
  TRANSACTIONS: [
    { value: 'date', label: 'التاريخ' },
    { value: 'points', label: 'النقاط' },
    { value: 'type', label: 'النوع' },
    { value: 'customerName', label: 'اسم العميل' },
  ],
} as const;

// تكوين التصدير
export const EXPORT_FORMATS = {
  CSV: 'csv',
  EXCEL: 'xlsx',
  PDF: 'pdf',
  JSON: 'json',
} as const;

// تكوين التحميل
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
} as const;
