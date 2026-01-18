const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");

// Get system modules
exports.getSystemModules = catchAsync(async (req, res, next) => {
  const modules = [
    {
      id: "dashboard",
      name: "لوحة التحكم",
      icon: "Dashboard",
      screens: ["الرئيسية", "الإحصائيات", "التقارير السريعة"]
    },
    {
      id: "users",
      name: "إدارة المستخدمين",
      icon: "Users",
      screens: ["قائمة المستخدمين", "إضافة مستخدم", "تعديل المستخدم", "حذف المستخدم"]
    },
    {
      id: "roles",
      name: "إدارة الأدوار",
      icon: "Shield",
      screens: ["قائمة الأدوار", "إضافة دور", "تعديل الدور", "حذف الدور"]
    },
    {
      id: "inventory",
      name: "إدارة المخزون",
      icon: "Package",
      screens: ["قائمة المنتجات", "إضافة منتج", "تعديل المنتج", "حذف المنتج", "جرد المخزون"]
    },
    {
      id: "sales",
      name: "إدارة المبيعات",
      icon: "DollarSign",
      screens: ["قائمة المبيعات", "ايصال جديدة", "تعديل الايصال", "حذف الايصال", "تقارير المبيعات"]
    },
    {
      id: "customers",
      name: "إدارة العملاء",
      icon: "UserCheck",
      screens: ["قائمة العملاء", "إضافة عميل", "تعديل العميل", "حذف العميل", "تاريخ العميل"]
    },
    {
      id: "suppliers",
      name: "إدارة الموردين",
      icon: "Truck",
      screens: ["قائمة الموردين", "إضافة مورد", "تعديل المورد", "حذف المورد", "تقييم المورد"]
    },
    {
      id: "reports",
      name: "التقارير",
      icon: "BarChart",
      screens: ["تقرير المبيعات", "تقرير المخزون", "تقرير العملاء", "تقرير الأرباح", "تصدير التقارير"]
    },
    {
      id: "settings",
      name: "الإعدادات",
      icon: "Settings",
      screens: ["إعدادات الشركة", "إعدادات النظام", "إعدادات المستخدم", "النسخ الاحتياطية"]
    },
    {
      id: "audit",
      name: "سجل التدقيق",
      icon: "History",
      screens: ["سجل المستخدمين", "سجل الأدوار", "سجل الصلاحيات", "سجل النظام"]
    }
  ];

  res.status(200).json({
    status: "success",
    data: modules,
  });
});

// Get permission types
exports.getPermissionTypes = catchAsync(async (req, res, next) => {
  const permissions = [
    {
      id: "view",
      name: "عرض",
      description: "إمكانية عرض البيانات",
      icon: "Eye",
      color: "text-blue-600"
    },
    {
      id: "create",
      name: "إنشاء",
      description: "إمكانية إنشاء بيانات جديدة",
      icon: "Plus",
      color: "text-green-600"
    },
    {
      id: "edit",
      name: "تعديل",
      description: "إمكانية تعديل البيانات الموجودة",
      icon: "Edit",
      color: "text-yellow-600"
    },
    {
      id: "delete",
      name: "حذف",
      description: "إمكانية حذف البيانات",
      icon: "Trash2",
      color: "text-red-600"
    },
    {
      id: "export",
      name: "تصدير",
      description: "إمكانية تصدير البيانات",
      icon: "Download",
      color: "text-purple-600"
    },
    {
      id: "import",
      name: "استيراد",
      description: "إمكانية استيراد البيانات",
      icon: "Upload",
      color: "text-indigo-600"
    },
    {
      id: "approve",
      name: "موافقة",
      description: "إمكانية الموافقة على الطلبات",
      icon: "Check",
      color: "text-emerald-600"
    },
    {
      id: "reject",
      name: "رفض",
      description: "إمكانية رفض الطلبات",
      icon: "X",
      color: "text-rose-600"
    }
  ];

  res.status(200).json({
    status: "success",
    data: permissions,
  });
});

// Get role statistics
exports.getRoleStatistics = catchAsync(async (req, res, next) => {
  const statistics = {
    totalRoles: 6,
    totalUsers: 24,
    activeRoles: 5,
    inactiveRoles: 1,
    rolesWithPermissions: 4,
    rolesWithoutPermissions: 2,
    mostUsedRole: "Admin",
    leastUsedRole: "Viewer",
    averagePermissionsPerRole: 12,
    totalPermissions: 72
  };

  res.status(200).json({
    status: "success",
    data: statistics,
  });
});
