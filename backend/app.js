/**
 * Raghwa Backend Server
 * 
 * الميزات:
 * - نظام إدارة الأدوار والصلاحيات المتقدم مع الوحدات
 * - إنشاء تلقائي للمستخدم المدير والأدوار الأساسية
 * - نظام إدارة المستخدمين
 * - API شامل للنظام
 * 
 * متغيرات البيئة:
 * - AUTO_SEED: true/false (افتراضي: true) - إنشاء البيانات الأساسية تلقائياً
 * - PORT: رقم المنفذ (افتراضي: 4000)
 * - DATABASE: اسم قاعدة البيانات
 */

const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const qs = require("qs");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const dotenv = require("dotenv").config();
const { connectDB } = require("./Config/dbConfig");
const { startAutoCloseService } = require("./services/shiftAutoCloseService");

// Import multer for file upload error handling
const multer = require("multer");

// Set default values if .env file doesn't exist
process.env.DATABASE = process.env.DATABASE || 'raghwa_db';
process.env.DATABASE_USER = process.env.DATABASE_USER || 'root';
process.env.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
process.env.DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
process.env.PORT = process.env.PORT || 4000;
process.env.JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '90d';
process.env.CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:8080,http://localhost:8081,https://metagym.metacodecx.com';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const appError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const cors = require("cors"); // Import cors
const serviceRouter = require("./routes/serviceRoutes");
const productRouter = require("./routes/productRoutes");
const storageRouter = require("./routes/storageRoutes");
const companyRouter = require("./routes/companyRoutes");
const compositeProductRoutes = require("./routes/compositeProductsRoutes");
const branchRouter = require("./routes/branchesRoutes");
const tableRouter = require("./routes/tableRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const quickSaleRouter = require("./routes/quickSaleRoutes");
const serviceConsumablesRouter = require("./routes/serviceConsumablesRoutes");
const shiftRouter = require("./routes/shiftRoutes");
const shiftSessionRouter = require("./routes/shiftSessionRoutes");

// Motorcycle Management Routes
const motorcycleRouter = require("./routes/motorcycleRoutes");
const motorcycleMaintenanceRouter = require("./routes/motorcycleMaintenanceRoutes");
const deliveryOrderRouter = require("./routes/deliveryOrderRoutes");
const deliveryDriverRouter = require("./routes/deliveryDriverRoutes");
const deliveryTrackingRouter = require("./routes/deliveryTrackingRoutes");
const roleRouter = require("./routes/roleRoutes");
const systemRouter = require("./routes/systemRoutes");
const authRouter = require("./routes/authRoutes");
const sectionRouter = require("./routes/sectionRoutes");
const suppliersRouter = require("./routes/suppliersRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const supplierInvoiceRoutes = require("./routes/supplierInvoiceRoutes");
const supplierPaymentApiRoutes = require("./routes/supplierPaymentRoutes");
const brandsRouter = require("./routes/brandsRoutes");
const categoriesRouter = require("./routes/categoriesRoutes");
const manufacturersRouter = require("./routes/manufacturersRoutes");
const warehousesRouter = require("./routes/warehouseRoutes");
const inventoryRouter = require("./routes/inventoryRoutes");
const productBranchesRoutes = require("./routes/productBranchesRoutes");
const rfqRoutes = require("./routes/rfqRoutes");
const quotationRoutes = require("./routes/quotationRoutes");
const requisitionRoutes = require("./routes/purchaseRequisitionRoutes");
const procurementSettingsRoutes = require("./routes/procurementSettingsRoutes");
const approvalRoutes = require("./routes/approvalRoutes");
const procurementLookupRoutes = require("./routes/procurementLookupRoutes");
const purchaseOrderRoutes = require("./routes/purchaseOrderRoutes");
const quickPurchaseOrderRoutes = require("./routes/quickPurchaseOrderRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const revenueRoutes = require("./routes/revenueRoutes");
const goodsReceiptRoutes = require("./routes/goodsReceiptRoutes");
const purchaseInvoiceRoutes = require("./routes/purchaseInvoiceRoutes");
const supplierPaymentRoutes = require("./routes/supplierPaymentRoutes");
const supplierPaymentScheduleRoutes = require("./routes/supplierPaymentScheduleRoutes");
const purchaseReturnRoutes = require("./routes/purchaseReturnRoutes");
const supplierContractsRoutes = require("./routes/supplierContractsRoutes");
const supplierDashboardRoutes = require("./routes/supplierDashboardRoutes");
const supplierReportsRoutes = require("./routes/supplierReportsRoutes");
const debitNoteRoutes = require("./routes/debitNoteRoutes");
const customerRoutes = require("./routes/customerRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const surveyRoutes = require("./routes/surveyRoutes");

const sparePart = require("./routes/sparePartsRoutes");
const mainCategoryRouter = require("./routes/mainCategoryRoutes");
const subCategoryRouter = require("./routes/subCategoryRoutes");
const openingStockRouter = require("./routes/openingStockRoutes");
const couponRouter = require("./routes/couponRoutes");
const subscriptionRouter = require("./routes/subscriptionRoutes");
const planRouter = require("./routes/planRoutes");
const loyaltyRouter = require("./routes/loyaltyRoutes");
const unitTemplateRouter = require("./routes/unitTemplateRoutes");
const accountingRouter = require("./routes/accountingRoutes");

// POS Routes
const posDeviceRoutes = require("./routes/posDeviceRoutes");
const posSettingsRoutes = require("./routes/posSettingsRoutes");
const posPaymentRoutes = require("./routes/posPaymentRoutes");
const posInvoiceRoutes = require("./routes/posInvoiceRoutes");
const posNotificationRoutes = require("./routes/posNotificationRoutes");
const posReportRoutes = require("./routes/posReportRoutes");

// const { categoriesSchema, brandsSchema, Branch } = require("./Model");

const stockTakingRoutes = require("./routes/stockTakingRoutes");
const supplierSettingsRoutes = require("./routes/supplierSettingsRoutes");
const { categoriesSchema, brandsSchema, Branch, manufacturersSchema, Role, User, Company, Section } = require("./Model");
const UserRole = require("./Model/user_roleModel");
const consumablesRoutes = require("./routes/consumablesRoutes"); // Adjust path


// Inline seed data and seeding logic (moved from separate seeders)
// Data will be created directly in seedInlineCoreData function

// Roles and Pages definitions removed - managed via frontend interface

/*const inlineRoles = [
  {
    roleName: "Super Admin",
    description: "مدير النظام الكامل مع جميع الصلاحيات",
    permissions: [
      "dashboard_view", "dashboard_edit",
      "users_view", "users_create", "users_edit", "users_delete",
      "roles_view", "roles_create", "roles_edit", "roles_delete",
      "permissions_view", "permissions_assign",
      "inventory_view", "inventory_create", "inventory_edit", "inventory_delete",
      "sales_view", "sales_create", "sales_edit", "sales_delete",
      "customers_view", "customers_create", "customers_edit", "customers_delete",
      "reports_view", "reports_export",
      "settings_view", "settings_edit",
      "audit_view", "audit_export",
      "branches_view", "branches_create", "branches_edit", "branches_delete",
      "company_view", "company_edit"
    ]
  },
  {
    roleName: "Admin",
    description: "مدير مع صلاحيات إدارية عالية",
    permissions: [
      "dashboard_view", "dashboard_edit",
      "users_view", "users_create", "users_edit",
      "roles_view", "permissions_view", "permissions_assign",
      "inventory_view", "inventory_create", "inventory_edit",
      "sales_view", "sales_create", "sales_edit",
      "customers_view", "customers_create", "customers_edit",
      "reports_view", "reports_export",
      "settings_view", "settings_edit",
      "audit_view", "audit_export",
      "branches_view", "branches_edit",
      "company_view"
    ]
  },
  {
    roleName: "Manager",
    description: "مدير فرع مع صلاحيات محدودة",
    permissions: [
      "dashboard_view",
      "users_view",
      "inventory_view", "inventory_create", "inventory_edit",
      "sales_view", "sales_create", "sales_edit",
      "customers_view", "customers_create", "customers_edit",
      "reports_view",
      "branches_view"
    ]
  },
  {
    roleName: "Sales Representative",
    description: "مندوب مبيعات",
    permissions: [
      "dashboard_view",
      "inventory_view",
      "sales_view", "sales_create",
      "customers_view", "customers_create", "customers_edit",
      "reports_view"
    ]
  },
  {
    roleName: "Inventory Manager",
    description: "مدير المخزون",
    permissions: [
      "dashboard_view",
      "inventory_view", "inventory_create", "inventory_edit",
      "reports_view"
    ]
  },
  {
    roleName: "Viewer",
    description: "مستخدم للقراءة فقط",
    permissions: [
      "dashboard_view",
      "inventory_view",
      "sales_view",
      "customers_view",
      "reports_view"
    ]
  }
];

const inlinePages = [
  // لوحة التحكم
  { pageName: "عرض لوحة التحكم", moduleName: "dashboard", description: "صفحة عرض لوحة التحكم الرئيسية" },
  { pageName: "إحصائيات المبيعات", moduleName: "dashboard", description: "صفحة إحصائيات المبيعات" },
  { pageName: "تقارير الأداء", moduleName: "dashboard", description: "صفحة تقارير الأداء" },
  { pageName: "مراقبة النظام", moduleName: "dashboard", description: "صفحة مراقبة النظام" },

  // إدارة العملاء
  { pageName: "قائمة العملاء", moduleName: "customers", description: "صفحة قائمة العملاء" },
  { pageName: "إضافة عميل جديد", moduleName: "customers", description: "صفحة إضافة عميل جديد" },
  { pageName: "تعديل بيانات العميل", moduleName: "customers", description: "صفحة تعديل بيانات العميل" },
  { pageName: "حذف عميل", moduleName: "customers", description: "صفحة حذف العميل" },
  { pageName: "تاريخ العميل", moduleName: "customers", description: "صفحة تاريخ العميل" },
  { pageName: "نقاط الولاء", moduleName: "customers", description: "صفحة نقاط الولاء" },

  // إدارة الخدمات
  { pageName: "قائمة الخدمات", moduleName: "services", description: "صفحة قائمة الخدمات" },
  { pageName: "إضافة خدمة جديدة", moduleName: "services", description: "صفحة إضافة خدمة جديدة" },
  { pageName: "تعديل الخدمة", moduleName: "services", description: "صفحة تعديل الخدمة" },
  { pageName: "حذف الخدمة", moduleName: "services", description: "صفحة حذف الخدمة" },
  { pageName: "أسعار الخدمات", moduleName: "services", description: "صفحة أسعار الخدمات" },
  { pageName: "مدة الخدمة", moduleName: "services", description: "صفحة مدة الخدمة" },

  // إدارة الطلبات
  { pageName: "قائمة الطلبات", moduleName: "orders", description: "صفحة قائمة الطلبات" },
  { pageName: "إنشاء طلب جديد", moduleName: "orders", description: "صفحة إنشاء طلب جديد" },
  { pageName: "تعديل الطلب", moduleName: "orders", description: "صفحة تعديل الطلب" },
  { pageName: "إلغاء الطلب", moduleName: "orders", description: "صفحة إلغاء الطلب" },
  { pageName: "حالة الطلب", moduleName: "orders", description: "صفحة حالة الطلب" },
  { pageName: "تتبع الطلب", moduleName: "orders", description: "صفحة تتبع الطلب" },

  // إدارة المخزون
  { pageName: "قائمة المنتجات", moduleName: "inventory", description: "صفحة قائمة المنتجات" },
  { pageName: "إضافة منتج", moduleName: "inventory", description: "صفحة إضافة منتج" },
  { pageName: "تعديل المنتج", moduleName: "inventory", description: "صفحة تعديل المنتج" },
  { pageName: "حذف المنتج", moduleName: "inventory", description: "صفحة حذف المنتج" },
  { pageName: "جرد المخزون", moduleName: "inventory", description: "صفحة جرد المخزون" },
  { pageName: "تقارير المخزون", moduleName: "inventory", description: "صفحة تقارير المخزون" },
  { pageName: "طلبات التوريد", moduleName: "inventory", description: "صفحة طلبات التوريد" },

  // الإدارة المالية
  { pageName: "الإيصالات", moduleName: "finance", description: "صفحة الإيصالات" },
  { pageName: "المدفوعات", moduleName: "finance", description: "صفحة المدفوعات" },
  { pageName: "التقارير المالية", moduleName: "finance", description: "صفحة التقارير المالية" },
  { pageName: "الحسابات", moduleName: "finance", description: "صفحة الحسابات" },
  { pageName: "الضرائب", moduleName: "finance", description: "صفحة الضرائب" },
  { pageName: "التسويات المالية", moduleName: "finance", description: "صفحة التسويات المالية" },

  // التقارير والتحليلات
  { pageName: "تقارير المبيعات", moduleName: "reports", description: "صفحة تقارير المبيعات" },
  { pageName: "تقارير العملاء", moduleName: "reports", description: "صفحة تقارير العملاء" },
  { pageName: "تقارير المخزون", moduleName: "reports", description: "صفحة تقارير المخزون" },
  { pageName: "تقارير الموظفين", moduleName: "reports", description: "صفحة تقارير الموظفين" },
  { pageName: "التحليلات التنبؤية", moduleName: "reports", description: "صفحة التحليلات التنبؤية" },
  { pageName: "تصدير التقارير", moduleName: "reports", description: "صفحة تصدير التقارير" },

  // إعدادات النظام
  { pageName: "الإعدادات العامة", moduleName: "settings", description: "صفحة الإعدادات العامة" },
  { pageName: "إدارة المستخدمين", moduleName: "settings", description: "صفحة إدارة المستخدمين" },
  { pageName: "إدارة الأدوار", moduleName: "settings", description: "صفحة إدارة الأدوار" },
  { pageName: "إعدادات الأمان", moduleName: "settings", description: "صفحة إعدادات الأمان" },
  { pageName: "النسخ الاحتياطي", moduleName: "settings", description: "صفحة النسخ الاحتياطي" },
  { pageName: "سجل النشاطات", moduleName: "settings", description: "صفحة سجل النشاطات" }
];*/

async function seedInlineCoreData() {
  try {

    // Create roles with empty modules (all permissions management is done through frontend)
    const rolesData = [
      { 
        roleName: "مدير", 
        description: "مدير النظام مع جميع الصلاحيات",
        modules: {}
      },
      { 
        roleName: "مستخدم", 
        description: "مستخدم عادي مع صلاحيات محدودة",
        modules: {}
      }
    ];

    for (const roleData of rolesData) {
      await Role.findOrCreate({
        where: { roleName: roleData.roleName },
        defaults: roleData
      });
    }

    // إنشاء حساب المدير
    
    // إنشاء الشركة إذا لم تكن موجودة
    const [company] = await Company.findOrCreate({
      where: { arabicName: "شركة رغوة للمشروبات" },
      defaults: {
        arabicName: "شركة رغوة للمشروبات",
        englishName: "Raghwa Cars Company",
        code: "RAG001",
        symbol: "RAG",
        description: "شركة متخصصة في بيع وصيانة  الكافية",
        country: "المملكة العربية المصرية",
        city: "الرياض",
        neighborhood: "المركز",
        street: "شارع الملك فهد",
        postalCode: "12345",
        phoneNumber: "+966501234567",
        telephoneNumber: "+966501234568",
        email: "info@raghwa.com",
        website: "https://raghwa.com",
        taxRegistrationNumber: 123456789,
        commercialRegistrationNumber: 987654321
      }
    });

    // إنشاء الفرع إذا لم يكن موجوداً
    const [branch] = await Branch.findOrCreate({
      where: { arabicName: "الفرع الرئيسي" },
      defaults: {
        arabicName: "الفرع الرئيسي",
        englishName: "Main Branch",
        code: "BR001",
        storageCapacity: 10000,
        description: "الفرع الرئيسي للشركة",
        working_hours_from: "08:00:00",
        working_hours_to: "18:00:00",
        isActive: true,
        phoneNumber: "+966501234568",
        telephoneNumber: "+966501234569",
        email: "main@raghwa.com",
        website: "https://raghwa.com",
        country: "المملكة العربية المصرية",
        city: "الرياض",
        neighborhood: "المركز",
        street: "شارع الملك فهد",
        postalCode: "12345",
        manager: "أحمد محمد",
        supervisor: "محمد أحمد",
        companyId: company.id
      }
    });

    // إنشاء القسم إذا لم يكن موجوداً
    const [section] = await Section.findOrCreate({
      where: { sectionName: "قسم المبيعات" },
      defaults: {
        sectionName: "قسم المبيعات",
        description: "قسم متخصص في مبيعات  الكافية و "
      }
    });

    // إنشاء حساب المدير
    const [adminUser] = await User.findOrCreate({
      where: { email: "admin@raghwa.com" },
      defaults: {
        arabicName: "مدير النظام",
        englinshName: "System Administrator",
        ssNumber: "ADMIN001",
        email: "admin@raghwa.com",
        password: "admin123", // سيتم تشفيرها تلقائياً بواسطة bcrypt
        phoneNumber: "+966501234570",
        telephoneNumber: "+966501234571",
        country: "المملكة العربية المصرية",
        city: "الرياض",
        nighborhood: "المركز",
        street: "شارع الملك فهد",
        postalCode: "12345",
        emergencyContactName: "أحمد محمد",
        emergencyContactPhone: "+966501234572",
        emergencyContactRelation: "أخ",
        branchId: branch.id,
        sectionId: section.id,
        salary: 15000.00,
        active: true
      }
    });

    // ربط المدير بدور مدير
    const adminRole = await Role.findOne({ where: { roleName: "مدير" } });
    if (adminRole) {
      await UserRole.findOrCreate({
        where: { userId: adminUser.id, roleId: adminRole.id },
        defaults: { userId: adminUser.id, roleId: adminRole.id }
      });
    }


  } catch (error) {
    console.error("❌ خطأ أثناء إنشاء البيانات الأساسية:", error);
    throw error;
  }
}

// ! start express app & connect to db

const app = express();
// In app.js or your main server file
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ! Middlewares
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:8080,http://localhost:8081,https://metagym.metacodecx.com").split(",").map(o => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "public")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));

// ! Security meddilewares

app.use(helmet()); // * setting security headers

app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString("base64");
  res.setHeader(
    "Content-Security-Policy",
    `script-src 'self' https://cdnjs.cloudflare.com https://api.mapbox.com; ` +
      `style-src 'self' https://api.mapbox.com https://fonts.googleapis.com 'nonce-${nonce}'; ` +
      `font-src https://fonts.gstatic.com; ` +
      `connect-src 'self' https://api.mapbox.com; ` +
      `img-src 'self' https://api.mapbox.com data:; ` +
      `worker-src blob:`
  );
  res.locals.nonce = nonce;
  next();
});
// Rate limiting removed - no limits on API requests
// * prevent http parameter pollution

// ! Body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
// ! Query Passer
app.set("query parser", "extended"); //  to configure how query strings in incoming HTTP requests are parsed

app.use((req, res, next) => {
  next();
});

// ! Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/companies", companyRouter);
app.get("/api/v1/branches", async (req, res) => {
  try {
    const branches = await Branch.findAll(); // Assuming a database query
    res.json({ data: branches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch brands" });
  }
});
app.use("/api/v1/branches", branchRouter);
app.use("/api/v1/tables", tableRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/quick-sales", quickSaleRouter);
app.use("/api/v1/service-consumables", serviceConsumablesRouter);
app.use("/api/v1/shifts", shiftRouter);
app.use("/api/v1/shift-sessions", shiftSessionRouter);

// Motorcycle Management Routes
app.use("/api/v1/motorcycles", motorcycleRouter);
app.use("/api/v1/motorcycle-maintenance", motorcycleMaintenanceRouter);
app.use("/api/v1/delivery-orders", deliveryOrderRouter);
app.use("/api/v1/delivery-drivers", deliveryDriverRouter);
app.use("/api/v1/delivery-tracking", deliveryTrackingRouter);
app.use("/api/v1/storages", storageRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/compositeproducts", compositeProductRoutes);
app.use("/api/v1/roles", roleRouter);
app.use("/api/v1/system", systemRouter);
app.use("/api/v1/sections", sectionRouter);
app.use("/api/v1/suppliers", suppliersRouter);
app.use("/api/v1/suppliers-core", supplierRoutes);
app.use("/api/v1/supplier-invoices", supplierInvoiceRoutes);
app.use("/api/v1/supplier-payments-core", supplierPaymentApiRoutes);
// Mount brands router to support GET/POST/PATCH/DELETE
app.use("/api/v1/brands", brandsRouter);
app.get("/api/v1/categories", async (req, res) => {
  try {
    const categories = await categoriesSchema.findAll(); // Assuming a database query
    res.json({ data: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch brands" });
  }
});
app.use("/api/v1/manufacturers", manufacturersRouter);
app.get("/api/v1/manufacturers", async (req, res) => {
  try {
    const manufacturers = await manufacturersSchema.findAll(); // Assuming a database query
    res.json({ data: manufacturers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch brands" });
  }
});
app.use("/api/v1/warehouses", warehousesRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/inventory-transactions", require("./routes/inventoryTransactionRoutes"));
app.use("/api/v1/inventory-movements", require("./routes/inventoryMovementRoutes"));
app.use("/api/v1/product-branches", productBranchesRoutes);
app.use("/api/v1/rfqs", rfqRoutes);
app.use("/api/v1/quotations", quotationRoutes);
app.use("/api/v1/requisitions", requisitionRoutes);
app.use("/api/v1/procurement-settings", procurementSettingsRoutes);
app.use("/api/v1/approvals", approvalRoutes);
app.use("/api/v1/procurement", procurementLookupRoutes);
app.use("/api/v1/purchase-orders", purchaseOrderRoutes);
app.use("/api/v1/quick-purchase-orders", quickPurchaseOrderRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/revenues", revenueRoutes);
app.use("/api/v1/goods-receipts", goodsReceiptRoutes);
app.use("/api/v1/purchase-invoices", purchaseInvoiceRoutes);
app.use("/api/v1/supplier-payments", supplierPaymentRoutes);
app.use("/api/v1/supplier-payment-schedules", supplierPaymentScheduleRoutes);
app.use("/api/v1/purchase-returns", purchaseReturnRoutes);
app.use("/api/v1/supplier-contracts", supplierContractsRoutes);
app.use("/api/v1/supplier-dashboard", supplierDashboardRoutes);
app.use("/api/v1/supplier-dashboard/reports", supplierReportsRoutes);
app.use("/api/v1/debit-notes", debitNoteRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/campaigns", campaignRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/feedbacks", feedbackRoutes);
app.use("/api/v1/surveys", surveyRoutes);
app.use("/api/v1/companies", companyRouter);

app.use("/api/v1/spare-parts", sparePart);
app.use("/api/v1/main-categories", mainCategoryRouter);
app.use("/api/v1/sub-categories", subCategoryRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/opening-stocks", openingStockRouter);
app.use("/api/v1/unit-templates", unitTemplateRouter);

app.use("/api/v1/consumables", consumablesRoutes);
app.use("/api/v1/stock-taking", stockTakingRoutes);
app.use("/api/v1/supplier-settings", supplierSettingsRoutes);
app.use("/api/v1/accounting", accountingRouter);
// مسارات إدارة الكوبونات - تعمل بدون تسجيل دخول
app.use("/api/v1/coupons", couponRouter);

// مسارات إدارة الاشتراكات - تعمل بدون تسجيل دخول
app.use("/api/v1/subscriptions", subscriptionRouter);

// مسارات إدارة الخطط - تعمل بدون تسجيل دخول
app.use("/api/v1/plans", planRouter);

// مسارات إدارة نقاط الولاء - تعمل بدون تسجيل دخول
app.use("/api/v1/loyalty", loyaltyRouter);

// POS Routes
app.use("/api/v1/pos-devices", posDeviceRoutes);
app.use("/api/v1/pos-settings", posSettingsRoutes);
app.use("/api/v1/pos-payments", posPaymentRoutes);
app.use("/api/v1/pos-invoices", posInvoiceRoutes);
app.use("/api/v1/pos-notifications", posNotificationRoutes);
app.use("/api/v1/pos-reports", posReportRoutes);

// Gym Management Routes
const memberRoutes = require("./routes/memberRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const subscriptionTypeRoutes = require("./routes/subscriptionTypeRoutes");
const subscriptionTransferRoutes = require("./routes/subscriptionTransferRoutes");
const subscriptionRefundRoutes = require("./routes/subscriptionRefundRoutes");
const memberAttendanceRoutes = require("./routes/memberAttendanceRoutes");
const lockerRoutes = require("./routes/lockerRoutes");
const appManagementRoutes = require("./routes/appManagementRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const trainerSalaryRoutes = require("./routes/trainerSalaryRoutes");
const classRoutes = require("./routes/classRoutes");
const timeBasedSpecialSubscriptionRoutes = require("./routes/timeBasedSpecialSubscriptionRoutes");

app.use("/api/v1/gym/members", memberRoutes);
app.use("/api/v1/gym/membership-types", require("./routes/membershipTypeRoutes"));
app.use("/api/v1/gym/subscriptions", subscriptionRoutes);
app.use("/api/v1/gym/subscription-types", subscriptionTypeRoutes);
app.use("/api/v1/gym/subscription-transfers", subscriptionTransferRoutes);
app.use("/api/v1/gym/subscription-refunds", subscriptionRefundRoutes);
app.use("/api/v1/gym/time-based-special-subscriptions", timeBasedSpecialSubscriptionRoutes);
app.use("/api/v1/gym/member-attendance", memberAttendanceRoutes);
app.use("/api/v1/gym/inbody", require("./routes/inbodyRoutes"));
app.use("/api/v1/gym/lockers", lockerRoutes);
app.use("/api/v1/gym/groups", require("./routes/groupRoutes"));

// HR Management Routes
app.use("/api/v1/hr/employees", employeeRoutes);

// App Management Routes
app.use("/api/v1/app", appManagementRoutes);

// Trainer Salary Routes
app.use("/api/v1/gym/trainer-salaries", trainerSalaryRoutes);

// Gym Classes Routes
app.use("/api/v1/gym/classes", classRoutes);

// Trainer Routes
const trainerRoutes = require("./routes/trainerRoutes");
app.use("/api/v1/gym/trainers", trainerRoutes);

// مسار إنشاء البيانات الأساسية (للتطوير فقط)
app.post("/api/v1/seed", async (req, res) => {
  try {
    await seedInlineCoreData();
    res.json({ success: true, message: "تم إنشاء البيانات الأساسية بنجاح!" });
  } catch (error) {
    console.error("❌ خطأ في إنشاء البيانات الأساسية:", error);
    res.status(500).json({ success: false, message: "فشل في إنشاء البيانات الأساسية", error: error.message });
  }
});

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


// ! handling unhandled routes
const server = app.use((req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ! Global error handling middleware

// معالجة أخطاء multer
app.use((error, req, res, next) => {
  if (error && error.code && error.code.startsWith('LIMIT_')) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File too large. Maximum size is 50MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        status: 'error',
        message: 'Too many files uploaded'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        status: 'error',
        message: 'Unexpected file field'
      });
    }
    return res.status(400).json({
      status: 'error',
      message: `File upload error: ${error.message}`
    });
  }
  next(error);
});

app.use(globalErrorHandler);

// Universal SPA Fallback Route - works in both development and production
// This ensures that all non-API routes are handled by the frontend router
app.get(/^(?!\/api).*/, (req, res) => {
  console.log("🌐 Universal SPA Fallback for:", req.path);
  
  // Try to find index.html in various locations
  const currentDir = __dirname;
  const parentDir = path.join(currentDir, "..");
  const publicDir = path.join(currentDir, "public");
  const distDir = path.join(parentDir, "dist");
  
  const possibleIndexPaths = [
    path.join(currentDir, "index.html"),           // Same directory as server
    path.join(publicDir, "index.html"),            // Public folder in server directory
    path.join(parentDir, "index.html"),            // Parent directory (where index.html actually is)
    path.join(distDir, "index.html"),              // Dist folder in parent directory
    path.join(currentDir, "..", "build", "index.html"),  // Build folder in parent
    path.join(currentDir, "..", "public", "index.html")  // Public folder in parent
  ];
  
  console.log("🔍 Searching for index.html in:", possibleIndexPaths);
  
  for (const indexPath of possibleIndexPaths) {
    if (fs.existsSync(indexPath)) {
      console.log("✅ Found index.html at:", indexPath);
      return res.sendFile(indexPath);
    }
  }
  
  // If no index.html found, send a helpful response
  console.log("⚠️ No index.html found in:", possibleIndexPaths);
  res.status(200).json({
    message: "SPA route requested",
    path: req.path,
    environment: process.env.NODE_ENV,
    searchedPaths: possibleIndexPaths,
    note: "index.html not found. Please ensure the frontend build files are uploaded to the server directory."
  });
});

// ! Unhandled Rejection and uncaught exception handling

process.on("unhandledRejection", (err) => {
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  /* server.close(() => {
    process.exit(1);
  }); */
});

// Serve frontend build in production
if (process.env.NODE_ENV === "production") {
  // Since the dist contents are uploaded directly to the hosting server
  // Look for static files in various possible locations
  const currentDir = __dirname;
  const parentDir = path.join(currentDir, "..");
  const publicDir = path.join(currentDir, "public");
  const distDir = path.join(parentDir, "dist");
  
  // Try to find the best static directory
  let staticDir = currentDir;
  if (fs.existsSync(publicDir)) {
    staticDir = publicDir;
  } else if (fs.existsSync(distDir)) {
    staticDir = distDir;
  } else if (fs.existsSync(path.join(parentDir, "public"))) {
    staticDir = path.join(parentDir, "public");
  }

  console.log("📁 Serving static files from:", staticDir);
  app.use(express.static(staticDir));
  
  // Also serve static files from parent directory
  app.use(express.static(parentDir));
  
  // Fallback route for SPA - send all non-API requests to index.html
  app.get(/^(?!\/api).*/, (req, res) => {
    console.log("🔄 Production SPA Fallback for:", req.path);
    
    // Try to find index.html in various locations
    const possibleIndexPaths = [
      path.join(staticDir, "index.html"),
      path.join(currentDir, "index.html"),
      path.join(publicDir, "index.html"),
      path.join(parentDir, "index.html"),
      path.join(distDir, "index.html"),
      path.join(parentDir, "build", "index.html"),
      path.join(parentDir, "public", "index.html")
    ];
    
    console.log("🔍 Production searching for index.html in:", possibleIndexPaths);
    
    for (const indexPath of possibleIndexPaths) {
      if (fs.existsSync(indexPath)) {
        console.log("✅ Found index.html at:", indexPath);
        return res.sendFile(indexPath);
      }
    }
    
    // If no index.html found, send a helpful response
    console.log("⚠️ No index.html found in:", possibleIndexPaths);
    res.status(200).json({
      message: "SPA route requested",
      path: req.path,
      searchedPaths: possibleIndexPaths,
      note: "index.html not found. Please ensure the frontend build files are uploaded to the server directory."
    });
  });
}

const port = process.env.PORT || 4000;

// تشغيل الخادم مع الـ seeder التلقائي
const startServer = async () => {
  try {
    // الاتصال بقاعدة البيانات
    await connectDB();
    
    // تشغيل خدمة الإغلاق التلقائي للورديات
    startAutoCloseService();
    
    // التحقق من إعدادات إنشاء البيانات الأساسية التلقائي
    const AUTO_SEED = process.env.AUTO_SEED !== 'false'; // true افتراضياً
    
    if (AUTO_SEED) {
      // إنشاء البيانات الأساسية تلقائياً
      try {
        await seedInlineCoreData();
      } catch (seederError) {
        console.warn("⚠️ تحذير: فشل في إنشاء البيانات الأساسية، لكن الخادم سيعمل:");
        console.warn(seederError.message);
      }
    } else {
    }
    
    // تشغيل الخادم
    app.listen(port, () => {
      if (AUTO_SEED) {
      }
    });
    
  } catch (error) {
    console.error("❌ خطأ في بدء التشغيل:", error);
    process.exit(1);
  }
};

// بدء التشغيل
startServer();
