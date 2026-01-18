const sequelize = require("./sequelize");
const dotenv = require("dotenv");

// Import all models
const {
  User,
  Storage,
  Branch,
  Service,
  Company,
  CompositeProduct,
  CompositeProductItem,
  Section,
  UserRole,
  
  Role,
  brandsSchema,
  categoriesSchema,
  inventorySchema,
  manufacturersSchema,
  productBranchesSchema,
  productsSchema,
  suppliersSchema,
  warehousesSchema,

  MainCategory,
  SubCategory,
  SparePart,
  OpeningStock,

  Consumables,
  ServiceConsumables,
  StockCountSession,
  CountItem,
  Adjustment,
  RFQ,
  RFQItem,
  Quotation,
  PurchaseRequisition,
  PurchaseRequisitionItem,
  ProcurementSettings,
  PurchaseOrder,
  PurchaseOrderItem,
  GoodsReceipt,
  GoodsReceiptItem,
  PurchaseInvoice,
  PurchaseInvoiceItem,
  SupplierPaymentSchedule,
  PurchaseReturn,
  PurchaseReturnItem,
  DebitNote,
  DebitNoteItem,
  SupplierContract,
  Survey,
  SurveyResponse,
  Coupon,
  Plan,
  Subscription,
  LoyaltyMember,
  PointsTransaction,
  LoyaltyRule,
  LoyaltyReward,
  
  // Supplier Settings schemas
  DropdownDefinition,
  SupplierCategory,
  SupplyRegion,
  PaymentTerm,
  
  // Company Settings schemas
  CompanyAttachment,
  CompanyAccount,
  
  // POS Models
  POSDevice,
  POSSettings,
  POSPaymentMethod,
  POSInvoiceTemplate,
  POSNotificationRule,
  POSReportTemplate,
  
  // Unit Template Models
  unitTemplateSchema,
  unitConversionSchema,
  
  // Inventory Transaction Models
  InventoryTransaction,
  InventoryTransactionItem,
  InventoryTransactionAttachment,
  InventoryTransactionLog,
  
  // Inventory Movement Models
  InventoryMovement,
  AIInsight,
  SmartAlert,
  
  // New Supplier System Models
  Supplier,
  SupplierInvoice,
  SupplierInvoiceItem,
  SupplierPayment,
  
  // Table Management Model
  Table,
  Booking,
  
  // Quick Sale Model
  QuickSale,
  Shift,
  ShiftSession,
  
  // Motorcycle Management Models
  Motorcycle,
  MotorcycleMaintenance,
  DeliveryOrder,
  DeliveryOrderItem,
  DeliveryTracking,
  DeliveryDriver,
  
  // Accounting Models
  Account,
  JournalEntry,
  JournalEntryItem,
  
} = require("../Model/index");

// Finance Models
const Expense = require("../Model/schema/expenseSchema");
const Revenue = require("../Model/schema/revenueSchema");
const QuickPurchaseOrder = require("../Model/schema/quickPurchaseOrderSchema");
const serviceRepository = require("../Model/repository/serviceRepository");
const { Customer, Car, Contact, RelatedPerson, Feedback } = require("../Model/index");
const Campaign = require("../Model/schema/campaignSchema");
const CampaignTarget = require("../Model/schema/campaignTargetSchema");

// Import new models - will be imported inline in sync section to avoid circular dependencies

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to SQL Server via Sequelize");

    // Sync tables in the correct order to respect foreign key dependencies
    // Base tables first
    try {
      await Company.sync({ force: false }); // Create Company table first
      console.log("Company table synchronized");
    } catch (err) {
      console.log("Company table already exists or error:", err.message);
    }
    
    try {
      await Branch.sync({ force: false }); // Create Branch table first
      console.log("Branch table synchronized");
    } catch (err) {
      console.log("Branch table already exists or error:", err.message);
    }
    
    try {
      await Section.sync({ force: false }); // Create Section table next
      console.log("Section table synchronized");
    } catch (err) {
      console.log("Section table already exists or error:", err.message);
    }
    
    
    
    try {
      await Role.sync({ force: false }); // Create Role table next
      console.log("Role table synchronized");
    } catch (err) {
      console.log("Role table already exists or error:", err.message);
    }
    
    
    
    
    
    
    

    
    try {
      await User.sync({ force: false }); // Create User table last
      console.log("User table synchronized");
    } catch (err) {
      console.log("User table already exists or error:", err.message);
    }
    
    try {
      await Storage.sync({ force: false }); // Create Storage table last
      console.log("Storage table synchronized");
    } catch (err) {
      console.log("Storage table already exists or error:", err.message);
    }

    try {
      await suppliersSchema.sync({ force: false });
      console.log("Suppliers table synchronized");
    } catch (err) {
      console.log("Suppliers table already exists or error:", err.message);
    }
    
    try {
      await brandsSchema.sync({ force: false });
      console.log("Brands table synchronized");
    } catch (err) {
      console.log("Brands table already exists or error:", err.message);
    }
    
    try {
      await categoriesSchema.sync({ force: false });
      console.log("Categories table synchronized");
    } catch (err) {
      console.log("Categories table already exists or error:", err.message);
    }
    
    try {
      await manufacturersSchema.sync({ force: false });
      console.log("Manufacturers table synchronized");
    } catch (err) {
      console.log("Manufacturers table already exists or error:", err.message);
    }
    
    try {
      await warehousesSchema.sync({ force: false });
      console.log("Warehouses table synchronized");
    } catch (err) {
      console.log("Warehouses table already exists or error:", err.message);
    }
    
    try {
      await productsSchema.sync({ force: false });
      console.log("Products table synchronized");
    } catch (err) {
      console.log("Products table already exists or error:", err.message);
    }
    
    try {
      await productBranchesSchema.sync({ force: false });
      console.log("ProductBranches table synchronized");
    } catch (err) {
      console.log("ProductBranches table already exists or error:", err.message);
    }
    
    try {
      await inventorySchema.sync({ force: false });
      console.log("Inventory table synchronized");
    } catch (err) {
      console.log("Inventory table already exists or error:", err.message);
    }
    
    try {
      await Service.sync({ force: false });
      console.log("Service table synchronized");
    } catch (err) {
      console.log("Service table already exists or error:", err.message);
    }

    try {
      await MainCategory.sync({ force: false });
      console.log("MainCategory table synchronized");
    } catch (err) {
      console.log("MainCategory table already exists or error:", err.message);
    }
    
    try {
      await SubCategory.sync({ force: false });
      console.log("SubCategory table synchronized");
    } catch (err) {
      console.log("SubCategory table already exists or error:", err.message);
    }
    
    try {
      await SparePart.sync({ force: false });
      console.log("SparePart table synchronized");
    } catch (err) {
      console.log("SparePart table already exists or error:", err.message);
    }
    
    try {
      await OpeningStock.sync({ force: false });
      console.log("OpeningStock table synchronized");
    } catch (err) {
      console.log("OpeningStock table already exists or error:", err.message);
    }

    try {
      await UserRole.sync({ force: false });
      console.log("UserRole table synchronized");
    } catch (err) {
      console.log("UserRole table already exists or error:", err.message);
    }
    
    try {
      await CompositeProduct.sync({ force: false });
      console.log("CompositeProduct table synchronized");
    } catch (err) {
      console.log("CompositeProduct table already exists or error:", err.message);
    }
    
    try {
      await CompositeProductItem.sync({ force: false });
      console.log("CompositeProductItem table synchronized");
    } catch (err) {
      console.log("CompositeProductItem table already exists or error:", err.message);
    }
    
    try {
      await Consumables.sync({ force: false });
      console.log("Consumables table synchronized");
    } catch (err) {
      console.log("Consumables table already exists or error:", err.message);
    }
    
    try {
      await ServiceConsumables.sync({ force: false });
      console.log("ServiceConsumables table synchronized");
    } catch (err) {
      console.log("ServiceConsumables table already exists or error:", err.message);
    }
    
    try {
      await StockCountSession.sync({ force: false });
      console.log("StockCountSession table synchronized");
    } catch (err) {
      console.log("StockCountSession table already exists or error:", err.message);
    }
    
    try {
      await CountItem.sync({ force: false });
      console.log("CountItem table synchronized");
    } catch (err) {
      console.log("CountItem table already exists or error:", err.message);
    }
    
    try {
      await Adjustment.sync({ force: false });
      console.log("Adjustment table synchronized");
    } catch (err) {
      console.log("Adjustment table already exists or error:", err.message);
    }
    
    try {
      await PurchaseRequisition.sync({ force: false });
      console.log("PurchaseRequisition table synchronized");
    } catch (err) {
      console.log("PurchaseRequisition table already exists or error:", err.message);
    }
    
    try {
      await PurchaseRequisitionItem.sync({ force: false });
      console.log("PurchaseRequisitionItem table synchronized");
    } catch (err) {
      console.log("PurchaseRequisitionItem table already exists or error:", err.message);
    }
    
    try {
      await RFQ.sync({ force: false });
      console.log("RFQ table synchronized");
    } catch (err) {
      console.log("RFQ table already exists or error:", err.message);
    }
    
    try {
      await RFQItem.sync({ force: false });
      console.log("RFQItem table synchronized");
    } catch (err) {
      console.log("RFQItem table already exists or error:", err.message);
    }
    
    try {
      await Quotation.sync({ force: false });
      console.log("Quotation table synchronized");
    } catch (err) {
      console.log("Quotation table already exists or error:", err.message);
    }
    
    try {
      await ProcurementSettings.sync({ force: false });
      console.log("ProcurementSettings table synchronized");
    } catch (err) {
      console.log("ProcurementSettings table already exists or error:", err.message);
    }
    
    try {
      await PurchaseOrder.sync({ force: false });
      console.log("PurchaseOrder table synchronized");
    } catch (err) {
      console.log("PurchaseOrder table already exists or error:", err.message);
    }
    
    try {
      await PurchaseOrderItem.sync({ force: false });
      console.log("PurchaseOrderItem table synchronized");
    } catch (err) {
      console.log("PurchaseOrderItem table already exists or error:", err.message);
    }
    
    try {
      await GoodsReceipt.sync({ force: false });
      console.log("GoodsReceipt table synchronized");
    } catch (err) {
      console.log("GoodsReceipt table already exists or error:", err.message);
    }
    
    try {
      await GoodsReceiptItem.sync({ force: false });
      console.log("GoodsReceiptItem table synchronized");
    } catch (err) {
      console.log("GoodsReceiptItem table already exists or error:", err.message);
    }

    // New: Invoices and supplier payments
    // Use force: false for existing tables to avoid MySQL key limit errors
    try {
      await PurchaseInvoice.sync({ force: false });
      console.log("PurchaseInvoice table synchronized");
    } catch (err) {
      console.log("PurchaseInvoice table already exists or error:", err.message);
    }
    
    try {
      await PurchaseInvoiceItem.sync({ force: false });
      console.log("PurchaseInvoiceItem table synchronized");
    } catch (err) {
      console.log("PurchaseInvoiceItem table already exists or error:", err.message);
    }
    
    try {
      await SupplierPaymentSchedule.sync({ force: false });
      console.log("SupplierPaymentSchedule table synchronized");
    } catch (err) {
      console.log("SupplierPaymentSchedule table already exists or error:", err.message);
    }
    
    try {
      await PurchaseReturn.sync({ force: false });
      console.log("PurchaseReturn table synchronized");
    } catch (err) {
      console.log("PurchaseReturn table already exists or error:", err.message);
    }
    
    try {
      await PurchaseReturnItem.sync({ force: false });
      console.log("PurchaseReturnItem table synchronized");
    } catch (err) {
      console.log("PurchaseReturnItem table already exists or error:", err.message);
    }

    // Supplier Contracts
    try {
      await SupplierContract.sync({ force: false });
      console.log("SupplierContract table synchronized");
    } catch (err) {
      console.log("SupplierContract table already exists or error:", err.message);
    }

    // CRM Customers - Check if tables exist first to avoid conflicts
    try {
      await Customer.sync({ force: false });
      console.log("Customer table synchronized");
    } catch (err) {
      console.log("Customer table already exists or error:", err.message);
    }
    
    try {
      await Car.sync({ force: false });
      console.log("Car table synchronized");
    } catch (err) {
      console.log("Car table already exists or error:", err.message);
    }
    
    try {
      await Contact.sync({ force: false });
      console.log("Contact table synchronized");
    } catch (err) {
      console.log("Contact table already exists or error:", err.message);
    }
    
    try {
      await RelatedPerson.sync({ force: false });
      console.log("RelatedPerson table synchronized");
    } catch (err) {
      console.log("RelatedPerson table already exists or error:", err.message);
    }
    
    try {
      await Feedback.sync({ force: false });
      console.log("Feedback table synchronized");
    } catch (err) {
      console.log("Feedback table already exists or error:", err.message);
    }

    // Marketing Campaigns
    try {
      await Campaign.sync({ force: false });
      console.log("Campaign table synchronized");
    } catch (err) {
      console.log("Campaign table already exists or error:", err.message);
    }
    
    try {
      await CampaignTarget.sync({ force: false });
      console.log("CampaignTarget table synchronized");
    } catch (err) {
      console.log("CampaignTarget table already exists or error:", err.message);
    }

    // Surveys
    try {
      await Survey.sync({ force: false });
      console.log("Survey table synchronized");
    } catch (err) {
      console.log("Survey table already exists or error:", err.message);
    }
    
    try {
      await SurveyResponse.sync({ force: false });
      console.log("SurveyResponse table synchronized");
    } catch (err) {
      console.log("SurveyResponse table already exists or error:", err.message);
    }

    // Coupons - إضافة جدول الكوبونات
    try {
      await Coupon.sync({ force: false });
      console.log("Coupon table synchronized");
    } catch (err) {
      console.log("Coupon table already exists or error:", err.message);
    }

    // Plans - إضافة جدول الخطط
    try {
      await Plan.sync({ force: false });
      console.log("Plan table synchronized");
    } catch (err) {
      console.log("Plan table already exists or error:", err.message);
    }

        // Subscriptions - إضافة جدول الاشتراكات
    try {
      await Subscription.sync({ force: false });
      console.log("Subscription table synchronized");
    } catch (err) {
      console.log("Subscription table already exists or error:", err.message);
    }

    // Loyalty Members - إضافة جدول أعضاء الولاء
    try {
      await LoyaltyMember.sync({ force: false });
      console.log("LoyaltyMember table synchronized");
    } catch (err) {
      console.log("LoyaltyMember table already exists or error:", err.message);
    }

    // Points Transactions - إضافة جدول معاملات النقاط
    try {
      await PointsTransaction.sync({ force: false });
      console.log("PointsTransaction table synchronized");
    } catch (err) {
      console.log("PointsTransaction table already exists or error:", err.message);
    }

    // Loyalty Rules - إضافة جدول قواعد الولاء
    try {
      await LoyaltyRule.sync({ force: false });
      console.log("LoyaltyRule table synchronized");
    } catch (err) {
      console.log("LoyaltyRule table already exists or error:", err.message);
    }

    // Loyalty Rewards - إضافة جدول مكافآت الولاء
    try {
      await LoyaltyReward.sync({ force: false });
      console.log("LoyaltyReward table synchronized");
    } catch (err) {
      console.log("LoyaltyReward table already exists or error:", err.message);
    }

    // Supplier Settings schemas - إضافة جداول إعدادات الموردين
    try {
      await DropdownDefinition.sync({ force: false });
      console.log("DropdownDefinition table synchronized");
    } catch (err) {
      console.log("DropdownDefinition table already exists or error:", err.message);
    }

    try {
      await SupplierCategory.sync({ force: false });
      console.log("SupplierCategory table synchronized");
    } catch (err) {
      console.log("SupplierCategory table already exists or error:", err.message);
    }

    try {
      await SupplyRegion.sync({ force: false });
      console.log("SupplyRegion table synchronized");
    } catch (err) {
      console.log("SupplyRegion table already exists or error:", err.message);
    }

    try {
      await PaymentTerm.sync({ force: false });
      console.log("PaymentTerm table synchronized");
    } catch (err) {
      console.log("PaymentTerm table already exists or error:", err.message);
    }

    // Company Settings tables
    try {
      await CompanyAttachment.sync({ force: false });
      console.log("CompanyAttachment table synchronized");
    } catch (err) {
      console.log("CompanyAttachment table already exists or error:", err.message);
    }

    try {
      await CompanyAccount.sync({ force: false });
      console.log("CompanyAccount table synchronized");
    } catch (err) {
      console.log("CompanyAccount table already exists or error:", err.message);
    }

      // POS Tables Synchronization
  try {
    await POSDevice.sync({ force: false });
    console.log("POSDevice table synchronized");
  } catch (err) {
    console.log("POSDevice table already exists or error:", err.message);
  }

  // Unit Template Tables Synchronization
  try {
    await unitTemplateSchema.sync({ force: false });
    console.log("UnitTemplate table synchronized");
  } catch (err) {
    console.log("UnitTemplate table already exists or error:", err.message);
  }

  try {
    await unitConversionSchema.sync({ force: false });
    console.log("UnitConversion table synchronized");
  } catch (err) {
    console.log("UnitConversion table already exists or error:", err.message);
  }

    try {
      await POSSettings.sync({ force: false });
      console.log("POSSettings table synchronized");
    } catch (err) {
      console.log("POSSettings table already exists or error:", err.message);
    }

    try {
      await POSPaymentMethod.sync({ force: false });
      console.log("POSPaymentMethod table synchronized");
    } catch (err) {
      console.log("POSPaymentMethod table already exists or error:", err.message);
    }

    try {
      await POSInvoiceTemplate.sync({ force: false });
      console.log("POSInvoiceTemplate table synchronized");
    } catch (err) {
      console.log("POSInvoiceTemplate table already exists or error:", err.message);
    }

    try {
      await POSNotificationRule.sync({ force: false });
      console.log("POSNotificationRule table synchronized");
    } catch (err) {
      console.log("POSNotificationRule table already exists or error:", err.message);
    }

    try {
      await POSReportTemplate.sync({ force: false });
      console.log("POSReportTemplate table synchronized");
    } catch (err) {
      console.log("POSReportTemplate table already exists or error:", err.message);
    }
    
    // Inventory Transaction Tables Synchronization
    try {
      await InventoryTransaction.sync({ force: false });
      console.log("InventoryTransaction table synchronized");
    } catch (err) {
      console.log("InventoryTransaction table already exists or error:", err.message);
    }
    
    try {
      await InventoryTransactionItem.sync({ force: false });
      console.log("InventoryTransactionItem table synchronized");
    } catch (err) {
      console.log("InventoryTransactionItem table already exists or error:", err.message);
    }
    
    try {
      await InventoryTransactionAttachment.sync({ force: false });
      console.log("InventoryTransactionAttachment table synchronized");
    } catch (err) {
      console.log("InventoryTransactionAttachment table already exists or error:", err.message);
    }
    
    try {
      await InventoryTransactionLog.sync({ force: false });
      console.log("InventoryTransactionLog table synchronized");
    } catch (err) {
      console.log("InventoryTransactionLog table already exists or error:", err.message);
    }
    
    // Inventory Movement Tables Synchronization
    try {
      await InventoryMovement.sync({ force: false });
      console.log("InventoryMovement table synchronized");
    } catch (err) {
      console.log("InventoryMovement table already exists or error:", err.message);
    }
    
    try {
      await AIInsight.sync({ force: false });
      console.log("AIInsight table synchronized");
    } catch (err) {
      console.log("AIInsight table already exists or error:", err.message);
    }
    
    try {
      await SmartAlert.sync({ force: false });
      console.log("SmartAlert table synchronized");
    } catch (err) {
      console.log("SmartAlert table already exists or error:", err.message);
    }
    
    // Debit Note Tables - يجب إنشاؤها بعد جميع الجداول الأساسية
    try {
      await DebitNote.sync({ force: false });
      console.log("DebitNote table synchronized");
    } catch (err) {
      console.log("DebitNote table already exists or error:", err.message);
    }
    
    try {
      await DebitNoteItem.sync({ force: false });
      console.log("DebitNoteItem table synchronized");
    } catch (err) {
      console.log("DebitNoteItem table already exists or error:", err.message);
    }

    try {
      await SupplierInvoice.sync({ force: false });
      console.log("SupplierInvoice table synchronized");
    } catch (err) {
      console.log("SupplierInvoice table already exists or error:", err.message);
    }

    try {
      await SupplierInvoiceItem.sync({ force: false });
      console.log("SupplierInvoiceItem table synchronized");
    } catch (err) {
      console.log("SupplierInvoiceItem table already exists or error:", err.message);
    }

    try {
      await SupplierPayment.sync({ force: false });
      console.log("SupplierPayment table synchronized");
    } catch (err) {
      console.log("SupplierPayment table already exists or error:", err.message);
    }

    // Table Management Tables Synchronization
    try {
      await Table.sync({ force: false });
      console.log("Table table synchronized");
    } catch (err) {
      console.log("Table table already exists or error:", err.message);
    }

    try {
      await Booking.sync({ force: false });
      console.log("Booking table synchronized");
    } catch (err) {
      console.log("Booking table already exists or error:", err.message);
    }

    // Quick Sale Tables Synchronization
    try {
      await QuickSale.sync({ force: false });
      console.log("QuickSale table synchronized");
    } catch (err) {
      console.log("QuickSale table already exists or error:", err.message);
    }

    // Shift Tables Synchronization
    try {
      await Shift.sync({ force: false });
      console.log("Shift table synchronized");
    } catch (err) {
      console.log("Shift table already exists or error:", err.message);
    }

    // Shift Sessions Tables Synchronization
    try {
      await ShiftSession.sync({ force: false });
      console.log("ShiftSession table synchronized");
    } catch (err) {
      console.log("ShiftSession table already exists or error:", err.message);
    }

    // Motorcycle Management Tables Synchronization
    // الترتيب الصحيح: DeliveryDriver أولاً، ثم Motorcycle (لأنه يعتمد على DeliveryDriver)
    try {
      await DeliveryDriver.sync({ force: false });
      console.log("DeliveryDriver table synchronized");
    } catch (err) {
      console.log("DeliveryDriver table already exists or error:", err.message);
    }

    try {
      await Motorcycle.sync({ force: false });
      console.log("Motorcycle table synchronized");
    } catch (err) {
      console.log("Motorcycle table already exists or error:", err.message);
    }

    try {
      await MotorcycleMaintenance.sync({ force: false });
      console.log("MotorcycleMaintenance table synchronized");
    } catch (err) {
      console.log("MotorcycleMaintenance table already exists or error:", err.message);
    }

    try {
      await DeliveryOrder.sync({ force: false });
      console.log("DeliveryOrder table synchronized");
    } catch (err) {
      console.log("DeliveryOrder table already exists or error:", err.message);
    }

    try {
      await DeliveryOrderItem.sync({ force: false });
      console.log("DeliveryOrderItem table synchronized");
    } catch (err) {
      console.log("DeliveryOrderItem table already exists or error:", err.message);
    }

    try {
      await DeliveryTracking.sync({ force: false });
      console.log("DeliveryTracking table synchronized");
    } catch (err) {
      console.log("DeliveryTracking table already exists or error:", err.message);
    }

    // Accounting Tables Synchronization
    try {
      await Account.sync({ force: false });
      console.log("Account table synchronized");
    } catch (err) {
      console.log("Account table already exists or error:", err.message);
    }

    try {
      await JournalEntry.sync({ force: false });
      console.log("JournalEntry table synchronized");
    } catch (err) {
      console.log("JournalEntry table already exists or error:", err.message);
    }

    try {
      await JournalEntryItem.sync({ force: false });
      console.log("JournalEntryItem table synchronized");
    } catch (err) {
      console.log("JournalEntryItem table already exists or error:", err.message);
    }

    // Finance Tables Synchronization
    try {
      await Expense.sync({ force: false });
      console.log("Expense table synchronized");
    } catch (err) {
      console.log("Expense table already exists or error:", err.message);
    }
    
    try {
      await Revenue.sync({ force: false });
      console.log("Revenue table synchronized");
    } catch (err) {
      console.log("Revenue table already exists or error:", err.message);
    }
    
    try {
      await QuickPurchaseOrder.sync({ force: false });
      console.log("QuickPurchaseOrder table synchronized");
    } catch (err) {
      console.log("QuickPurchaseOrder table already exists or error:", err.message);
    }

    // HR Management Models
    const { Employee, Department, Position } = require("../Model/index");
    try {
      await Department.sync({ force: false });
      console.log("Department table synchronized");
    } catch (err) {
      console.log("Department table already exists or error:", err.message);
    }
    
    try {
      await Position.sync({ force: false });
      console.log("Position table synchronized");
    } catch (err) {
      console.log("Position table already exists or error:", err.message);
    }
    
    try {
      await Employee.sync({ force: false });
      console.log("Employee table synchronized");
    } catch (err) {
      console.log("Employee table already exists or error:", err.message);
    }

    // Gym Management Models
    const {
      Member,
      MembershipType,
      Subscription:   GymSubscription,
  GymSubscriptionType,
  SubscriptionTransfer,
  SubscriptionRefund,
  MemberAttendance,
      Inbody,
      TimeBasedSpecialSubscription,
      Locker,
      LockerSubscription,
      LockerSubscriptionType,
      Group,
      GroupCategory,
      TrainerSalary,
      GymClass,
      ClassEnrollment,
    } = require("../Model/index");
    try {
      await MembershipType.sync({ force: false });
      console.log("MembershipType table synchronized");
    } catch (err) {
      console.log("MembershipType table already exists or error:", err.message);
    }
    
    try {
      await Member.sync({ force: false });
      console.log("Member table synchronized");
    } catch (err) {
      console.log("Member table already exists or error:", err.message);
    }
    
    // إنشاء / تحديث جدول اشتراكات الجيم إذا لم يكن موجوداً (مع التوافق مع الموديل GymSubscription)
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS \`GymSubscriptions\` (
          \`id\` INT NOT NULL AUTO_INCREMENT,
          \`subscriptionNumber\` VARCHAR(255) NOT NULL UNIQUE,
          \`registrationDate\` DATE NOT NULL,
          \`branchId\` INT NOT NULL,
          \`memberId\` INT NULL,
          \`customerName\` VARCHAR(255) NOT NULL,
          \`subscriptionType\` VARCHAR(255) NOT NULL,
          \`subscriptionStartDate\` DATE NOT NULL,
          \`subscriptionEndDate\` DATE NOT NULL,
          \`subscriptionValue\` DECIMAL(10,2) NOT NULL,
          \`discountEnabled\` TINYINT(1) NOT NULL DEFAULT 0,
          \`discountValue\` DECIMAL(10,2) DEFAULT 0,
          \`paidAmount\` DECIMAL(10,2) NOT NULL DEFAULT 0,
          \`remainingAmount\` DECIMAL(10,2) NOT NULL DEFAULT 0,
          \`gender\` ENUM('male','female') DEFAULT NULL,
          \`employeeId\` INT DEFAULT NULL,
          \`paymentMethod\` ENUM('cash','card','bank','online') DEFAULT NULL,
          \`receiptNumber\` VARCHAR(255) DEFAULT NULL,
          \`status\` ENUM('active','expired','upcoming') NOT NULL DEFAULT 'active',
          \`createdAt\` DATETIME NOT NULL,
          \`updatedAt\` DATETIME NOT NULL,
          PRIMARY KEY (\`id\`),
          KEY \`GymSubscriptions_branchId_idx\` (\`branchId\`),
          KEY \`GymSubscriptions_employeeId_idx\` (\`employeeId\`),
          KEY \`GymSubscriptions_memberId_idx\` (\`memberId\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
      console.log("GymSubscriptions table ensured via raw SQL");
    } catch (err) {
      console.log("GymSubscriptions raw create error:", err.message);
    }

    // محاولة إضافة عمود memberId إذا كان الجدول موجوداً بدون هذا العمود
    try {
      await sequelize.query(`
        ALTER TABLE \`GymSubscriptions\`
        ADD COLUMN \`memberId\` INT NULL AFTER \`branchId\`;
      `);
      console.log("GymSubscriptions.memberId column added via ALTER TABLE");
    } catch (err) {
      // إذا كان الخطأ بسبب أن العمود موجود بالفعل نتجاهله
      if (!String(err.message).includes("Duplicate column name") &&
          !String(err.message).includes("exists")) {
        console.log("GymSubscriptions memberId alter error:", err.message);
      }
    }

    // محاولة إضافة عمود isSpecial إذا كان الجدول موجوداً بدون هذا العمود
    try {
      await sequelize.query(`
        ALTER TABLE \`GymSubscriptions\`
        ADD COLUMN \`isSpecial\` TINYINT(1) NOT NULL DEFAULT 0 AFTER \`status\`;
      `);
      console.log("GymSubscriptions.isSpecial column added via ALTER TABLE");
    } catch (err) {
      // إذا كان الخطأ بسبب أن العمود موجود بالفعل نتجاهله
      if (!String(err.message).includes("Duplicate column name") &&
          !String(err.message).includes("exists") &&
          !String(err.message).includes("Duplicate column")) {
        console.log("GymSubscriptions isSpecial alter error:", err.message);
      }
    }

    try {
      await GymSubscription.sync({ alter: true });
      console.log("GymSubscription table synchronized");
    } catch (err) {
      console.log("GymSubscription table sync error:", err.message);
      // If alter fails, try force: false
      try {
        await GymSubscription.sync({ force: false });
        console.log("GymSubscription table synchronized (fallback)");
      } catch (fallbackErr) {
        console.log("GymSubscription table already exists or error:", fallbackErr.message);
      }
    }

    // Time Based Special Subscriptions
    try {
      await TimeBasedSpecialSubscription.sync({ alter: true });
      console.log("TimeBasedSpecialSubscription table synchronized");
    } catch (err) {
      console.log("TimeBasedSpecialSubscription table sync error:", err.message);
      try {
        await TimeBasedSpecialSubscription.sync({ force: false });
        console.log("TimeBasedSpecialSubscription table synchronized (fallback)");
      } catch (fallbackErr) {
        console.log("TimeBasedSpecialSubscription table already exists or error:", fallbackErr.message);
      }
    }

    // Subscription Transfers
    try {
      await SubscriptionTransfer.sync({ force: false });
      console.log("SubscriptionTransfer table synchronized");
    } catch (err) {
      console.log("SubscriptionTransfer table already exists or error:", err.message);
    }

    // Subscription Refunds
    try {
      await SubscriptionRefund.sync({ force: false });
      console.log("SubscriptionRefund table synchronized");
    } catch (err) {
      console.log("SubscriptionRefund table already exists or error:", err.message);
    }

    // Member Attendance
    try {
      await MemberAttendance.sync({ force: false });
      console.log("MemberAttendance table synchronized");
    } catch (err) {
      console.log("MemberAttendance table already exists or error:", err.message);
    }

    // Inbody
    try {
      await Inbody.sync({ alter: true });
      console.log("Inbody table synchronized");
    } catch (err) {
      console.log("Inbody table already exists or error:", err.message);
    }

    // Gym subscription types
    // إنشاء الجدول أولاً
    try {
      await GymSubscriptionType.sync({ alter: true });
      console.log("GymSubscriptionType table synchronized");
    } catch (err) {
      console.log("GymSubscriptionType table sync error:", err.message);
      // If alter fails, try force: false
      try {
        await GymSubscriptionType.sync({ force: false });
        console.log("GymSubscriptionType table synchronized (fallback)");
      } catch (fallbackErr) {
        console.log("GymSubscriptionType table already exists or error:", fallbackErr.message);
      }
    }

    // إضافة الأعمدة الجديدة يدوياً إذا لم تكن موجودة (بعد إنشاء الجدول)
    try {
      await sequelize.query(`
        ALTER TABLE GymSubscriptionTypes 
        ADD COLUMN sessionsCount INT DEFAULT 0
      `);
      console.log("GymSubscriptionTypes sessionsCount column added");
    } catch (err) {
      if (!String(err.message).includes("Duplicate column name") &&
          !String(err.message).includes("already exists") &&
          !String(err.message).includes("doesn't exist")) {
        console.log("sessionsCount column error:", err.message);
      }
    }
    
    try {
      await sequelize.query(`
        ALTER TABLE GymSubscriptionTypes 
        ADD COLUMN freezeDays INT DEFAULT 0
      `);
      console.log("GymSubscriptionTypes freezeDays column added");
    } catch (err) {
      if (!String(err.message).includes("Duplicate column name") &&
          !String(err.message).includes("already exists") &&
          !String(err.message).includes("doesn't exist")) {
        console.log("freezeDays column error:", err.message);
      }
    }
    
    try {
      await sequelize.query(`
        ALTER TABLE GymSubscriptionTypes 
        ADD COLUMN spaCount INT DEFAULT 0
      `);
      console.log("GymSubscriptionTypes spaCount column added");
    } catch (err) {
      if (!String(err.message).includes("Duplicate column name") &&
          !String(err.message).includes("already exists") &&
          !String(err.message).includes("doesn't exist")) {
        console.log("spaCount column error:", err.message);
      }
    }
    
    try {
      await LockerSubscriptionType.sync({ force: false });
      console.log("LockerSubscriptionType table synchronized");
    } catch (err) {
      console.log("LockerSubscriptionType table already exists or error:", err.message);
    }
    
    try {
      await Locker.sync({ force: false });
      console.log("Locker table synchronized");
    } catch (err) {
      console.log("Locker table already exists or error:", err.message);
    }
    
    try {
      await LockerSubscription.sync({ force: false });
      console.log("LockerSubscription table synchronized");
    } catch (err) {
      console.log("LockerSubscription table already exists or error:", err.message);
    }
    
    try {
      await Group.sync({ alter: true });
      console.log("Group table synchronized");
    } catch (err) {
      console.log("Group table sync error:", err.message);
      try {
        await Group.sync({ force: false });
        console.log("Group table synchronized (fallback)");
      } catch (fallbackErr) {
        console.log("Group table already exists or error:", fallbackErr.message);
      }
    }
    
    try {
      await GroupCategory.sync({ alter: true });
      console.log("GroupCategory table synchronized");
    } catch (err) {
      console.log("GroupCategory table sync error:", err.message);
      try {
        await GroupCategory.sync({ force: false });
        console.log("GroupCategory table synchronized (fallback)");
      } catch (fallbackErr) {
        console.log("GroupCategory table already exists or error:", fallbackErr.message);
      }
    }
  
  // Trainer Salary table
  try {
    await TrainerSalary.sync({ alter: true });
    console.log("TrainerSalary table synchronized");
    
    await GymClass.sync({ alter: true });
    console.log("GymClass table synchronized");
    
    await ClassEnrollment.sync({ alter: true });
    console.log("ClassEnrollment table synchronized");
  } catch (err) {
    console.log("TrainerSalary table sync error:", err.message);
    try {
      await TrainerSalary.sync({ force: false });
      console.log("TrainerSalary table synchronized (fallback)");
    } catch (fallbackErr) {
      console.log("TrainerSalary table already exists or error:", fallbackErr.message);
    }
  }

    // App Management Models
    const { AboutApp, Invitation, AppOffer, AppTrainer, ExerciseCategory, AppExercise, AppNews, AppAd, AppMessage, OfferFavorite } = require("../Model/index");
    try {
      await AboutApp.sync({ force: false });
      console.log("AboutApp table synchronized");
    } catch (err) {
      console.log("AboutApp table already exists or error:", err.message);
    }
    
    try {
      await Invitation.sync({ force: false });
      console.log("Invitation table synchronized");
    } catch (err) {
      console.log("Invitation table already exists or error:", err.message);
    }
    
    try {
      await AppOffer.sync({ alter: true });
      console.log("AppOffer table synchronized");
    } catch (err) {
      console.log("AppOffer table already exists or error:", err.message);
    }
    
    try {
      await ExerciseCategory.sync({ force: false });
      console.log("ExerciseCategory table synchronized");
    } catch (err) {
      console.log("ExerciseCategory table already exists or error:", err.message);
    }
    
    try {
      await AppExercise.sync({ alter: true });
      console.log("AppExercise table synchronized");
    } catch (err) {
      console.log("AppExercise table already exists or error:", err.message);
    }
    
    try {
      await AppTrainer.sync({ alter: true });
      console.log("AppTrainer table synchronized");
    } catch (err) {
      console.log("AppTrainer table already exists or error:", err.message);
    }
    
    try {
      await AppNews.sync({ alter: true });
      console.log("AppNews table synchronized");
    } catch (err) {
      console.log("AppNews table already exists or error:", err.message);
    }
    
    try {
      await AppAd.sync({ alter: true });
      console.log("AppAd table synchronized");
    } catch (err) {
      console.log("AppAd table already exists or error:", err.message);
    }
    
    try {
      await AppMessage.sync({ alter: true });
      console.log("AppMessage table synchronized");
    } catch (err) {
      console.log("AppMessage table already exists or error:", err.message);
    }
    
    try {
      await OfferFavorite.sync({ alter: true });
      console.log("OfferFavorite table synchronized");
    } catch (err) {
      console.log("OfferFavorite table already exists or error:", err.message);
    }
    
    console.log("All models synchronized successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
};

module.exports = { connectDB };
