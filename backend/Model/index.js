const brandsSchema = require("./schema/brandsSchema");
const categoriesSchema = require("./schema/categoriesSchema");
const inventorySchema = require("./schema/inventorySchema");
const manufacturersSchema = require("./schema/manufacturersSchema");
const productBranchesSchema = require("./schema/productBranchesSchema");
const productsSchema = require("./schema/productsSchema");
const suppliersSchema = require("./schema/suppliersSchema");
const warehousesSchema = require("./schema/warehousesSchema");
const unitTemplateSchema = require("./schema/unitTemplateSchema");
const unitConversionSchema = require("./schema/unitConversionSchema");

const User = require("./userModel");
const Role = require("./roleModel");
const UserRole = require("./user_roleModel");
const Service = require("./serviceModel");
const Branch = require("./branchesModel");
const Storage = require("./storageModel");
const Company = require("./companyModel");
const CompositeProduct = require("./composite_products");
const CompositeProductItem = require("./composite_product_itemsModel");
const Section = require("./sectionModel");

const SparePart = require("./sparePartModel");
const MainCategory = require("./mainCategoryModel");
const SubCategory = require("./subCategoryModel");
const OpeningStock = require("./openingStockModel");

const Consumables = require("./consumablesModel");
const ServiceConsumables = require("./schema/serviceConsumablesSchema");
const CountItem = require("./schema/countItemSchema");
const Coupon = require("./couponModel");
const Adjustment = require("./schema/adjustmentSchema");
const StockCountSession = require("./schema/stockCountSessionSchema");
const RFQ = require("./schema/rfqSchema");
const RFQItem = require("./schema/rfqItemSchema");
const Quotation = require("./schema/quotationSchema");
const PurchaseRequisition = require("./schema/purchaseRequisitionSchema");
const PurchaseRequisitionItem = require("./schema/purchaseRequisitionItemSchema");
const ProcurementSettings = require("./schema/procurementSettingsSchema");
const PurchaseOrder = require("./schema/purchaseOrderSchema");
const PurchaseOrderItem = require("./schema/purchaseOrderItemSchema");
const GoodsReceipt = require("./schema/goodsReceiptSchema");
const GoodsReceiptItem = require("./schema/goodsReceiptItemSchema");
const PurchaseInvoice = require("./schema/purchaseInvoiceSchema");
const PurchaseInvoiceItem = require("./schema/purchaseInvoiceItemSchema");
const SupplierPaymentSchedule = require("./schema/supplierPaymentScheduleSchema");
const SupplierContract = require("./schema/supplierContractSchema");
const PurchaseReturn = require("./schema/purchaseReturnSchema");
const PurchaseReturnItem = require("./schema/purchaseReturnItemSchema");
const DebitNote = require("./debitNoteModel");
const DebitNoteItem = require("./debitNoteItemModel");
const Customer = require("./schema/customerSchema");
const Car = require("./schema/carSchema");
const Contact = require("./schema/contactSchema");
const RelatedPerson = require("./schema/relatedPersonSchema");
const Feedback = require("./schema/feedbackSchema");
const Survey = require("./schema/surveySchema");
const SurveyResponse = require("./schema/surveyResponseSchema");
const CompanyAttachment = require("./schema/companyAttachmentSchema");
const CompanyAccount = require("./schema/companyAccountSchema");
const Campaign = require("./schema/campaignSchema");
const CampaignTarget = require("./schema/campaignTargetSchema");
const Subscription = require("./subscriptionModel");
const Plan = require("./planModel");
const LoyaltyMember = require("./loyaltyMemberModel");
const PointsTransaction = require("./pointsTransactionModel");
const LoyaltyRule = require("./loyaltyRuleModel");
const LoyaltyReward = require("./loyaltyRewardModel");
const DropdownDefinition = require("./schema/dropdownDefinitionSchema");
const SupplierCategory = require("./schema/supplierCategorySchema");
const SupplyRegion = require("./schema/supplyRegionSchema");
const PaymentTerm = require("./schema/paymentTermSchema");

// POS Models
const POSDevice = require("./posDeviceModel");
const POSSettings = require("./posSettingsModel");
const POSPaymentMethod = require("./posPaymentMethodModel");
const POSInvoiceTemplate = require("./posInvoiceTemplateModel");
const POSNotificationRule = require("./posNotificationRuleModel");
const POSReportTemplate = require("./posReportTemplateModel");

// Inventory Transaction Models
const {
  InventoryTransaction,
  InventoryTransactionItem,
  InventoryTransactionAttachment,
  InventoryTransactionLog
} = require("./schema/inventoryTransactionSchema");

// Inventory Movement Models
const InventoryMovement = require("./inventoryMovementModel");
const AIInsight = require("./aiInsightModel");
const SmartAlert = require("./smartAlertModel");

// Use existing suppliersSchema instead of a new Supplier model
const Supplier = suppliersSchema;
const SupplierInvoice = require("./supplierInvoiceModel");
const SupplierInvoiceItem = require("./supplierInvoiceItemModel");
const SupplierPayment = require("./supplierPaymentModel");
const Table = require("./schema/tableSchema");
const Booking = require("./schema/bookingSchema");
const QuickSale = require("./schema/quickSaleSchema");
const Shift = require("./shiftModel");
const ShiftSession = require("./shiftSessionModel");

// Motorcycle Management Models
const Motorcycle = require("./schema/motorcycleSchema");
const MotorcycleMaintenance = require("./schema/motorcycleMaintenanceSchema");
const DeliveryOrder = require("./schema/deliveryOrderSchema");
const DeliveryOrderItem = require("./schema/deliveryOrderItemSchema");
const DeliveryTracking = require("./schema/deliveryTrackingSchema");
const DeliveryDriver = require("./schema/deliveryDriverSchema");

// HR Management Models
const Employee = require("./hr/employeeModel");
const Department = require("./hr/departmentModel");
const Position = require("./hr/positionModel");

// Gym Management Models
const Member = require("./gym/memberModel");
const MembershipType = require("./gym/membershipTypeModel");
const GymSubscription = require("./gym/subscriptionModel");
const GymSubscriptionType = require("./gym/subscriptionTypeModel");
const SubscriptionTransfer = require("./gym/subscriptionTransferModel");
const SubscriptionRefund = require("./gym/subscriptionRefundModel");
const MemberAttendance = require("./gym/memberAttendanceModel");
const Inbody = require("./gym/inbodyModel");
const Locker = require("./gym/lockerModel");
const LockerSubscription = require("./gym/lockerSubscriptionModel");
const LockerSubscriptionType = require("./gym/lockerSubscriptionTypeModel");
const Group = require("./gym/groupModel");
const GroupCategory = require("./gym/groupCategoryModel");
const TrainerSalary = require("./gym/trainerSalaryModel");
const GymClass = require("./gym/gymClassModel");
const ClassEnrollment = require("./gym/classEnrollmentModel");
const TimeBasedSpecialSubscription = require("./gym/timeBasedSpecialSubscriptionModel");

// Accounting Models
const Account = require("./accounting/accountModel");
const JournalEntry = require("./accounting/journalEntryModel");
const JournalEntryItem = require("./accounting/journalEntryItemModel");

// App Management Models
const AboutApp = require("./app/aboutAppModel");
const Invitation = require("./app/invitationModel");
const AppOffer = require("./app/appOfferModel");
const AppTrainer = require("./app/appTrainerModel");
const ExerciseCategory = require("./app/exerciseCategoryModel");
const AppExercise = require("./app/appExerciseModel");
const AppNews = require("./app/appNewsModel");
const AppAd = require("./app/appAdModel");

// Company relationships
Company.hasMany(Branch, { foreignKey: "companyId", as: "branches" });
Branch.belongsTo(Company, { foreignKey: "companyId", as: "company" });

// HR Management Associations
Branch.hasMany(Employee, { foreignKey: "branchId", as: "employees" });
Employee.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });
Department.hasMany(Employee, { foreignKey: "departmentId", as: "employees" });
Employee.belongsTo(Department, { foreignKey: "departmentId", as: "department" });
Position.hasMany(Employee, { foreignKey: "positionId", as: "employees" });
Employee.belongsTo(Position, { foreignKey: "positionId", as: "position" });

// Gym Management Associations
Branch.hasMany(Member, { foreignKey: "branchId", as: "members" });
Member.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });
MembershipType.hasMany(Member, { foreignKey: "membershipTypeId", as: "members" });
Member.belongsTo(MembershipType, { foreignKey: "membershipTypeId", as: "membershipType" });

Branch.hasMany(GymSubscriptionType, { foreignKey: "branchId", as: "gymSubscriptionTypes" });
GymSubscriptionType.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });

Branch.hasMany(GymSubscription, { foreignKey: "branchId", as: "subscriptions" });
GymSubscription.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });
Employee.hasMany(GymSubscription, { foreignKey: "employeeId", as: "subscriptions" });
GymSubscription.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });

// Time Based Special Subscription Associations
Branch.hasMany(TimeBasedSpecialSubscription, { foreignKey: "branchId", as: "timeBasedSpecialSubscriptions" });
TimeBasedSpecialSubscription.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });
Member.hasMany(TimeBasedSpecialSubscription, { foreignKey: "memberId", as: "timeBasedSpecialSubscriptions" });
TimeBasedSpecialSubscription.belongsTo(Member, { foreignKey: "memberId", as: "member" });
Employee.hasMany(TimeBasedSpecialSubscription, { foreignKey: "employeeId", as: "timeBasedSpecialSubscriptions" });
TimeBasedSpecialSubscription.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });

// Subscription Transfer Associations
GymSubscription.hasMany(SubscriptionTransfer, { foreignKey: "subscriptionId", as: "transfers" });
SubscriptionTransfer.belongsTo(GymSubscription, { foreignKey: "subscriptionId", as: "subscription" });
Branch.hasMany(SubscriptionTransfer, { foreignKey: "branchId", as: "subscriptionTransfers" });
SubscriptionTransfer.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });
Member.hasMany(SubscriptionTransfer, { foreignKey: "memberId", as: "subscriptionTransfers" });
SubscriptionTransfer.belongsTo(Member, { foreignKey: "memberId", as: "member" });
User.hasMany(SubscriptionTransfer, { foreignKey: "createdBy", as: "createdTransfers" });
SubscriptionTransfer.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// Subscription Refund Associations
GymSubscription.hasMany(SubscriptionRefund, { foreignKey: "subscriptionId", as: "refunds" });
SubscriptionRefund.belongsTo(GymSubscription, { foreignKey: "subscriptionId", as: "subscription" });
Branch.hasMany(SubscriptionRefund, { foreignKey: "branchId", as: "subscriptionRefunds" });
SubscriptionRefund.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });
Member.hasMany(SubscriptionRefund, { foreignKey: "memberId", as: "subscriptionRefunds" });
SubscriptionRefund.belongsTo(Member, { foreignKey: "memberId", as: "member" });
User.hasMany(SubscriptionRefund, { foreignKey: "createdBy", as: "createdRefunds" });
SubscriptionRefund.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// Member Attendance Associations
Member.hasMany(MemberAttendance, { foreignKey: "memberId", as: "attendances" });
MemberAttendance.belongsTo(Member, { foreignKey: "memberId", as: "member" });
Branch.hasMany(MemberAttendance, { foreignKey: "branchId", as: "memberAttendances" });
MemberAttendance.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });
User.hasMany(MemberAttendance, { foreignKey: "createdBy", as: "createdAttendances" });
MemberAttendance.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// Inbody relationships
Member.hasMany(Inbody, { foreignKey: "memberId", as: "inbodyRecords" });
Inbody.belongsTo(Member, { foreignKey: "memberId", as: "member" });

// Group Associations
Branch.hasMany(Group, { foreignKey: "branchId", as: "groups" });
Group.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });
Employee.hasMany(Group, { foreignKey: "trainerId", as: "trainerGroups" });
Group.belongsTo(Employee, { foreignKey: "trainerId", as: "trainer" });

Branch.hasMany(Locker, { foreignKey: "mainBranchId", as: "mainLockers" });
Branch.hasMany(Locker, { foreignKey: "subBranchId", as: "subLockers" });
Locker.belongsTo(Branch, { foreignKey: "mainBranchId", as: "mainBranch" });
Locker.belongsTo(Branch, { foreignKey: "subBranchId", as: "subBranch" });

Locker.hasMany(LockerSubscription, { foreignKey: "lockerId", as: "subscriptions" });
LockerSubscription.belongsTo(Locker, { foreignKey: "lockerId", as: "locker" });
LockerSubscriptionType.hasMany(LockerSubscription, { foreignKey: "subscriptionTypeId", as: "subscriptions" });
LockerSubscription.belongsTo(LockerSubscriptionType, { foreignKey: "subscriptionTypeId", as: "subscriptionType" });
Branch.hasMany(LockerSubscription, { foreignKey: "mainBranchId", as: "mainLockerSubscriptions" });
Branch.hasMany(LockerSubscription, { foreignKey: "subBranchId", as: "subLockerSubscriptions" });
LockerSubscription.belongsTo(Branch, { foreignKey: "mainBranchId", as: "mainBranch" });
LockerSubscription.belongsTo(Branch, { foreignKey: "subBranchId", as: "subBranch" });
Employee.hasMany(LockerSubscription, { foreignKey: "recommendedEmployeeId", as: "recommendedLockerSubscriptions" });
LockerSubscription.belongsTo(Employee, { foreignKey: "recommendedEmployeeId", as: "recommendedEmployee" });

// App Management Associations
Employee.hasMany(AppTrainer, { foreignKey: "employeeId", as: "appTrainer" });
AppTrainer.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });

// Trainer Salary Associations
AppTrainer.hasMany(TrainerSalary, { foreignKey: "trainerId", as: "salaries" });
TrainerSalary.belongsTo(AppTrainer, { foreignKey: "trainerId", as: "trainer" });

// Gym Class Associations
Branch.hasMany(GymClass, { foreignKey: "branchId", as: "gymClasses" });
GymClass.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });
AppTrainer.hasMany(GymClass, { foreignKey: "trainerId", as: "classes" });
GymClass.belongsTo(AppTrainer, { foreignKey: "trainerId", as: "trainer" });
GymClass.hasMany(ClassEnrollment, { foreignKey: "classId", as: "enrollments" });
ClassEnrollment.belongsTo(GymClass, { foreignKey: "classId", as: "class" });
Member.hasMany(ClassEnrollment, { foreignKey: "memberId", as: "classEnrollments" });
ClassEnrollment.belongsTo(Member, { foreignKey: "memberId", as: "member" });

Branch.hasMany(Invitation, { foreignKey: "branchId", as: "invitations" });
Invitation.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });
ExerciseCategory.hasMany(AppExercise, { foreignKey: "categoryId", as: "exercises" });
AppExercise.belongsTo(ExerciseCategory, { foreignKey: "categoryId", as: "category" });

// Table relationships
Branch.hasMany(Table, { foreignKey: "branchId", as: "tables" });
Table.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });

// Booking relationships
Branch.hasMany(Booking, { foreignKey: "branchId", as: "bookings" });
Booking.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });


Table.hasMany(Booking, { foreignKey: "tableId", as: "bookings" });
Booking.belongsTo(Table, { foreignKey: "tableId", as: "table" });

// Quick Sale relationships
Branch.hasMany(QuickSale, { foreignKey: "branchId", as: "quickSales" });
QuickSale.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });

// Shift relationships
Shift.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });
Branch.hasMany(Shift, { foreignKey: "branchId", as: "shifts" });

// ShiftSession relationships
ShiftSession.belongsTo(Shift, { foreignKey: "shiftId", as: "shift" });
Shift.hasMany(ShiftSession, { foreignKey: "shiftId", as: "sessions" });

ShiftSession.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });
Branch.hasMany(ShiftSession, { foreignKey: "branchId", as: "shiftSessions" });

ShiftSession.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(ShiftSession, { foreignKey: "userId", as: "shiftSessions" });

ShiftSession.belongsTo(User, { foreignKey: "closedBy", as: "closingUser" });
User.hasMany(ShiftSession, { foreignKey: "closedBy", as: "closedShiftSessions" });

// Motorcycle Management Relationships
Branch.hasMany(Motorcycle, { foreignKey: "branchId", as: "motorcycles" });
Motorcycle.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });

Company.hasMany(Motorcycle, { foreignKey: "companyId", as: "motorcycles" });
Motorcycle.belongsTo(Company, { foreignKey: "companyId", as: "company" });

Motorcycle.hasMany(MotorcycleMaintenance, { foreignKey: "motorcycleId", as: "maintenances" });
MotorcycleMaintenance.belongsTo(Motorcycle, { foreignKey: "motorcycleId", as: "motorcycle" });

Branch.hasMany(MotorcycleMaintenance, { foreignKey: "branchId", as: "motorcycleMaintenances" });
MotorcycleMaintenance.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });

Company.hasMany(MotorcycleMaintenance, { foreignKey: "companyId", as: "motorcycleMaintenances" });
MotorcycleMaintenance.belongsTo(Company, { foreignKey: "companyId", as: "company" });

Branch.hasMany(DeliveryOrder, { foreignKey: "branchId", as: "deliveryOrders" });
DeliveryOrder.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });

Company.hasMany(DeliveryOrder, { foreignKey: "companyId", as: "deliveryOrders" });
DeliveryOrder.belongsTo(Company, { foreignKey: "companyId", as: "company" });

Motorcycle.hasMany(DeliveryOrder, { foreignKey: "motorcycleId", as: "deliveryOrders" });
DeliveryOrder.belongsTo(Motorcycle, { foreignKey: "motorcycleId", as: "motorcycle" });

DeliveryOrder.hasMany(DeliveryOrderItem, { foreignKey: "deliveryOrderId", as: "items" });
DeliveryOrderItem.belongsTo(DeliveryOrder, { foreignKey: "deliveryOrderId", as: "deliveryOrder" });

DeliveryOrder.hasMany(DeliveryTracking, { foreignKey: "deliveryOrderId", as: "tracking" });
DeliveryTracking.belongsTo(DeliveryOrder, { foreignKey: "deliveryOrderId", as: "deliveryOrder" });

Motorcycle.hasMany(DeliveryTracking, { foreignKey: "motorcycleId", as: "tracking" });
DeliveryTracking.belongsTo(Motorcycle, { foreignKey: "motorcycleId", as: "motorcycle" });

Branch.hasMany(DeliveryDriver, { foreignKey: "branchId", as: "deliveryDrivers" });
DeliveryDriver.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });

Company.hasMany(DeliveryDriver, { foreignKey: "companyId", as: "deliveryDrivers" });
DeliveryDriver.belongsTo(Company, { foreignKey: "companyId", as: "company" });

// Motorcycle - DeliveryDriver relationship
Motorcycle.belongsTo(DeliveryDriver, { foreignKey: "driverId", as: "driver" });
DeliveryDriver.hasMany(Motorcycle, { foreignKey: "driverId", as: "motorcycles" });

DeliveryDriver.hasMany(DeliveryOrder, { foreignKey: "driverId", as: "deliveryOrders" });
DeliveryOrder.belongsTo(DeliveryDriver, { foreignKey: "driverId", as: "driver" });

DeliveryDriver.hasMany(DeliveryTracking, { foreignKey: "driverId", as: "tracking" });
DeliveryTracking.belongsTo(DeliveryDriver, { foreignKey: "driverId", as: "driver" });

// Company attachments and account relationships
Company.hasMany(CompanyAttachment, { foreignKey: "company_id", as: "attachments" });
CompanyAttachment.belongsTo(Company, { foreignKey: "company_id", as: "company" });

Company.hasMany(CompanyAccount, { foreignKey: "company_id", as: "accounts" });
CompanyAccount.belongsTo(Company, { foreignKey: "company_id", as: "company" });

// Branch relationships
Branch.hasMany(User, { foreignKey: "branchId", as: "users" });
User.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });
// في موديل Branch
Branch.hasMany(Storage, { foreignKey: "branchId", as: "storages" });

// في موديل Storage
Storage.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });

// POS Relationships
Company.hasMany(POSDevice, { foreignKey: "companyId", as: "posDevices" });
POSDevice.belongsTo(Company, { foreignKey: "companyId", as: "company" });

Branch.hasMany(POSDevice, { foreignKey: "branchId", as: "posDevices" });
POSDevice.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });

Company.hasMany(POSSettings, { foreignKey: "companyId", as: "posSettings" });
POSSettings.belongsTo(Company, { foreignKey: "companyId", as: "company" });

Branch.hasMany(POSSettings, { foreignKey: "branchId", as: "posSettings" });
POSSettings.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });

Company.hasMany(POSPaymentMethod, { foreignKey: "companyId", as: "posPaymentMethods" });
POSPaymentMethod.belongsTo(Company, { foreignKey: "companyId", as: "company" });

Company.hasMany(POSInvoiceTemplate, { foreignKey: "companyId", as: "posInvoiceTemplates" });
POSInvoiceTemplate.belongsTo(Company, { foreignKey: "companyId", as: "company" });

Company.hasMany(POSNotificationRule, { foreignKey: "companyId", as: "posNotificationRules" });
POSNotificationRule.belongsTo(Company, { foreignKey: "companyId", as: "company" });

Company.hasMany(POSReportTemplate, { foreignKey: "companyId", as: "posReportTemplates" });
POSReportTemplate.belongsTo(Company, { foreignKey: "companyId", as: "company" });

// Section relationships
Section.hasMany(User, { foreignKey: "sectionId", as: "users" });
User.belongsTo(Section, { foreignKey: "sectionId", as: "section" });

// User relationships
User.hasMany(UserRole, { foreignKey: "userId", as: "userRoles" });
UserRole.belongsTo(User, { foreignKey: "userId", as: "user" });

// Role relationships
Role.hasMany(UserRole, { foreignKey: "roleId", as: "userRoles" });
UserRole.belongsTo(Role, { foreignKey: "roleId", as: "role" });

// Category relationships
categoriesSchema.hasMany(productsSchema, { foreignKey: "category_id", as: "products" });
productsSchema.belongsTo(categoriesSchema, { foreignKey: "category_id", as: "category" });

categoriesSchema.hasMany(categoriesSchema, { foreignKey: "parent_category_id", as: "subcategories" });
categoriesSchema.belongsTo(categoriesSchema, { foreignKey: "parent_category_id", as: "parentCategory" });

brandsSchema.hasMany(productsSchema, { foreignKey: "brand_id", as: "products" });
productsSchema.belongsTo(brandsSchema, { foreignKey: "brand_id", as: "brand" });

manufacturersSchema.hasMany(productsSchema, { foreignKey: "manufacturer_id", as: "products" });
productsSchema.belongsTo(manufacturersSchema, { foreignKey: "manufacturer_id", as: "manufacturer" });

suppliersSchema.hasMany(productsSchema, { foreignKey: "supplier_id", as: "products" });
productsSchema.belongsTo(suppliersSchema, { foreignKey: "supplier_id", as: "supplier" });

suppliersSchema.hasMany(SparePart, { foreignKey: "supplier_id", as: "spareParts" });
SparePart.belongsTo(suppliersSchema, { foreignKey: "supplier_id", as: "supplier" });

// Product relationships
productsSchema.hasMany(inventorySchema, { foreignKey: "product_id", as: "inventory" });
inventorySchema.belongsTo(productsSchema, { foreignKey: "product_id", as: "product" });

productsSchema.hasMany(productBranchesSchema, { foreignKey: "product_id", as: "productBranches" });
productBranchesSchema.belongsTo(productsSchema, { foreignKey: "product_id", as: "product" });

productsSchema.hasMany(CompositeProductItem, { foreignKey: "productId", as: "compositeItems" });
CompositeProductItem.belongsTo(productsSchema, { foreignKey: "productId", as: "product" });

// Warehouse relationships
warehousesSchema.hasMany(inventorySchema, { foreignKey: "warehouse_id", as: "inventory" });
inventorySchema.belongsTo(warehousesSchema, { foreignKey: "warehouse_id", as: "warehouse" });

warehousesSchema.hasMany(SparePart, { foreignKey: "warehouse_id", as: "spareParts" });
SparePart.belongsTo(warehousesSchema, { foreignKey: "warehouse_id", as: "warehouse" });

// Add missing association between Warehouses and Branch
warehousesSchema.belongsTo(Branch, { foreignKey: "branch_id", as: "branch" });
Branch.hasMany(warehousesSchema, { foreignKey: "branch_id", as: "warehouses" });

// Branch relationships with products
Branch.hasMany(productBranchesSchema, { foreignKey: "branch_id", as: "productBranches" });
productBranchesSchema.belongsTo(Branch, { foreignKey: "branch_id", as: "branch" });

Branch.hasMany(SparePart, { foreignKey: "branch_Id", as: "spareParts" });
SparePart.belongsTo(Branch, { foreignKey: "branch_Id", as: "branch" });

// Composite Product relationships
CompositeProduct.hasMany(CompositeProductItem, { foreignKey: "compositeProductId", as: "items" });
CompositeProductItem.belongsTo(CompositeProduct, { foreignKey: "compositeProductId", as: "compositeProduct" });

// Service relationships
Service.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });
Branch.hasMany(Service, { foreignKey: "branchId", as: "services" });

Service.belongsTo(categoriesSchema, { foreignKey: "categoryId", as: "category" });
categoriesSchema.hasMany(Service, { foreignKey: "categoryId", as: "services" });

// Service-Consumables relationships (many-to-many)
Service.belongsToMany(Consumables, { 
  through: ServiceConsumables, 
  foreignKey: "serviceId", 
  otherKey: "consumableId",
  as: "consumables" 
});
Consumables.belongsToMany(Service, { 
  through: ServiceConsumables, 
  foreignKey: "consumableId", 
  otherKey: "serviceId",
  as: "services" 
});

// Direct access to junction table
Service.hasMany(ServiceConsumables, { foreignKey: "serviceId", as: "serviceConsumables" });
ServiceConsumables.belongsTo(Service, { foreignKey: "serviceId", as: "service" });

Consumables.hasMany(ServiceConsumables, { foreignKey: "consumableId", as: "serviceConsumables" });
ServiceConsumables.belongsTo(Consumables, { foreignKey: "consumableId", as: "consumable" });

// Unit Template relationships
unitTemplateSchema.hasMany(unitConversionSchema, { foreignKey: "template_id", as: "conversions" });
unitConversionSchema.belongsTo(unitTemplateSchema, { foreignKey: "template_id", as: "template" });

// Category relationships
MainCategory.hasMany(SubCategory, { foreignKey: "mainCategory_Id", as: "subCategories" });
SubCategory.belongsTo(MainCategory, { foreignKey: "mainCategory_Id", as: "mainCategory" });

SubCategory.hasMany(SparePart, { foreignKey: "subCategory_Id", as: "spareParts" });
SparePart.belongsTo(SubCategory, { foreignKey: "subCategory_Id", as: "subCategory" });

MainCategory.hasMany(SparePart, { foreignKey: "mainCategory_Id", as: "spareParts" });
SparePart.belongsTo(MainCategory, { foreignKey: "mainCategory_Id", as: "mainCategory" });

// CRM relationships
Customer.hasMany(Car, { foreignKey: "customerId", as: "cars" });
Car.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

Customer.hasMany(Contact, { foreignKey: "customerId", as: "contacts" });
Contact.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

Customer.hasMany(RelatedPerson, { foreignKey: "customerId", as: "relatedCustomers" });
RelatedPerson.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

Customer.hasMany(Feedback, { foreignKey: "customerId", as: "feedbacks" });
Feedback.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

// Survey relationships
Survey.hasMany(SurveyResponse, { foreignKey: "surveyId", as: "responses", onDelete: "CASCADE" });
SurveyResponse.belongsTo(Survey, { foreignKey: "surveyId", as: "survey" });

Customer.hasMany(SurveyResponse, { foreignKey: "customerId", as: "surveyResponses", onDelete: "SET NULL" });
SurveyResponse.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

// Campaign relationships
Campaign.hasMany(CampaignTarget, { foreignKey: "campaignId", as: "targets", onDelete: "CASCADE" });
CampaignTarget.belongsTo(Campaign, { foreignKey: "campaignId", as: "campaign" });

Customer.hasMany(CampaignTarget, { foreignKey: "customerId", as: "campaignTargets", onDelete: "CASCADE" });
CampaignTarget.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

// Opening Stock relationships
Branch.hasMany(OpeningStock, { foreignKey: "branch_id", as: "openingStocks" });
OpeningStock.belongsTo(Branch, { foreignKey: "branch_id", as: "branch" });

warehousesSchema.hasMany(OpeningStock, { foreignKey: "warehouse_id", as: "openingStocks" });
OpeningStock.belongsTo(warehousesSchema, { foreignKey: "warehouse_id", as: "warehouse" });

productsSchema.hasMany(OpeningStock, { foreignKey: "product_id", as: "openingStocks" });
OpeningStock.belongsTo(productsSchema, { foreignKey: "product_id", as: "product" });

SparePart.hasMany(OpeningStock, { foreignKey: "spare_part_id", as: "openingStocks" });
OpeningStock.belongsTo(SparePart, { foreignKey: "spare_part_id", as: "sparePart" });

// Relationships for Consumables table
Consumables.belongsTo(Branch, {
  foreignKey: "branchId",
  as: "branch",
  onDelete: "RESTRICT",
});

Consumables.belongsTo(warehousesSchema, {
  foreignKey: "warehouseId",
  targetKey: "warehouse_id",
  as: "warehouse",
  onDelete: "RESTRICT",
});

Consumables.belongsTo(categoriesSchema, {
  foreignKey: "categoryId",
  as: "category",
  onDelete: "RESTRICT",
});

Consumables.belongsTo(suppliersSchema, {
  foreignKey: "supplierId",
  targetKey: "supplier_id",
  as: "supplier",
  onDelete: "RESTRICT",
});

// Commented out temporarily to fix foreign key constraint error
// Consumables.belongsTo(unitTemplateSchema, {
//   foreignKey: "unitId",
//   targetKey: "template_id",
//   as: "UnitTemplate",
//   onDelete: "RESTRICT",
// });

// Inverse relationships
Branch.hasMany(Consumables, {
  foreignKey: "branchId",
  as: "consumables",
});

warehousesSchema.hasMany(Consumables, {
  foreignKey: "warehouseId",
  as: "consumables",
});

// Commented out temporarily to fix foreign key constraint error
// unitTemplateSchema.hasMany(Consumables, {
//   foreignKey: "unitId",
//   as: "consumables",
// });

// Procurement relationships
RFQ.hasMany(RFQItem, { foreignKey: "rfqId", as: "items" });
RFQItem.belongsTo(RFQ, { foreignKey: "rfqId", as: "rfq" });

PurchaseRequisition.hasMany(PurchaseRequisitionItem, { foreignKey: "requisitionId", as: "items" });
PurchaseRequisitionItem.belongsTo(PurchaseRequisition, { foreignKey: "requisitionId", as: "requisition" });

Quotation.belongsTo(RFQ, { foreignKey: "rfqId", as: "rfq" });

// Purchase Order relationships
PurchaseOrder.hasMany(PurchaseOrderItem, { foreignKey: "purchaseOrderId", as: "items" });
PurchaseOrderItem.belongsTo(PurchaseOrder, { foreignKey: "purchaseOrderId", as: "purchaseOrder" });
PurchaseOrder.belongsTo(PurchaseRequisition, { foreignKey: "requisitionId", as: "requisition" });
PurchaseOrder.belongsTo(suppliersSchema, { foreignKey: "supplierId", targetKey: "supplier_id", as: "supplier" });

// Goods Receipt relationships
GoodsReceipt.belongsTo(PurchaseOrder, { foreignKey: "purchaseOrderId", as: "purchaseOrder" });
GoodsReceipt.hasMany(GoodsReceiptItem, { foreignKey: "goodsReceiptId", as: "items" });
GoodsReceiptItem.belongsTo(GoodsReceipt, { foreignKey: "goodsReceiptId", as: "goodsReceipt" });

// Purchase Invoice relationships
PurchaseInvoice.belongsTo(suppliersSchema, { foreignKey: "supplierId", targetKey: "supplier_id", as: "supplier", onDelete: "RESTRICT", onUpdate: "CASCADE" });
PurchaseInvoice.belongsTo(PurchaseOrder, { foreignKey: "purchaseOrderId", as: "purchaseOrder" });
PurchaseInvoice.belongsTo(GoodsReceipt, { foreignKey: "goodsReceiptId", as: "goodsReceipt" });
PurchaseInvoice.hasMany(PurchaseInvoiceItem, { foreignKey: "purchaseInvoiceId", as: "items" });
PurchaseInvoiceItem.belongsTo(PurchaseInvoice, { foreignKey: "purchaseInvoiceId", as: "invoice" });

// Supplier payment schedule relationships
// Purchase Return relationships
PurchaseReturn.belongsTo(PurchaseOrder, { foreignKey: "purchaseOrderId", as: "purchaseOrder" });
PurchaseReturn.belongsTo(GoodsReceipt, { foreignKey: "goodsReceiptId", as: "goodsReceipt" });
PurchaseReturn.belongsTo(suppliersSchema, { foreignKey: "supplierId", targetKey: "supplier_id", as: "supplier" });
PurchaseReturn.hasMany(PurchaseReturnItem, { foreignKey: "purchaseReturnId", as: "items" });
PurchaseReturnItem.belongsTo(PurchaseReturn, { foreignKey: "purchaseReturnId", as: "purchaseReturn" });

// Debit Note relationships
DebitNote.hasMany(DebitNoteItem, { foreignKey: "debit_note_id", as: "items" });
DebitNoteItem.belongsTo(DebitNote, { foreignKey: "debit_note_id", as: "debitNote" });

DebitNote.belongsTo(suppliersSchema, { foreignKey: "supplier_id", targetKey: "supplier_id", as: "supplier" });
suppliersSchema.hasMany(DebitNote, { foreignKey: "supplier_id", as: "debitNotes" });

DebitNote.belongsTo(PurchaseOrder, { foreignKey: "purchase_order_id", as: "purchaseOrder" });
PurchaseOrder.hasMany(DebitNote, { foreignKey: "purchase_order_id", as: "debitNotes" });

DebitNote.belongsTo(PurchaseInvoice, { foreignKey: "invoice_id", as: "invoice" });
PurchaseInvoice.hasMany(DebitNote, { foreignKey: "invoice_id", as: "debitNotes" });

// DebitNoteItem relationships with products
DebitNoteItem.belongsTo(productsSchema, { foreignKey: "item_id", targetKey: "product_id", as: "product" });
productsSchema.hasMany(DebitNoteItem, { foreignKey: "item_id", as: "debitNoteItems" });

SupplierPaymentSchedule.belongsTo(PurchaseInvoice, { foreignKey: "purchaseInvoiceId", as: "invoice" });
PurchaseInvoice.hasMany(SupplierPaymentSchedule, { foreignKey: "purchaseInvoiceId", as: "paymentSchedules" });

// Supplier Contract relationships
SupplierContract.belongsTo(suppliersSchema, { foreignKey: "supplier_id", targetKey: "supplier_id", as: "supplier" });
suppliersSchema.hasMany(SupplierContract, { foreignKey: "supplier_id", as: "contracts" });

// Purchase Invoice relationships with suppliers (for dashboard queries)
suppliersSchema.hasMany(PurchaseInvoice, { foreignKey: "supplierId", sourceKey: "supplier_id", as: "purchase_invoices" });

            // POS Models Relationships
            // Company relationships with POS
            Company.hasMany(POSDevice, { foreignKey: "companyId", as: "companyPosDevices" });
            Company.hasMany(POSSettings, { foreignKey: "companyId", as: "companyPosSettings" });
            Company.hasMany(POSPaymentMethod, { foreignKey: "companyId", as: "companyPosPaymentMethods" });
            Company.hasMany(POSInvoiceTemplate, { foreignKey: "companyId", as: "companyPosInvoiceTemplates" });
            Company.hasMany(POSNotificationRule, { foreignKey: "companyId", as: "companyPosNotificationRules" });
            Company.hasMany(POSReportTemplate, { foreignKey: "companyId", as: "companyPosReportTemplates" });

            // Branch relationships with POS
            Branch.hasMany(POSDevice, { foreignKey: "branchId", as: "branchPosDevices" });
            Branch.hasMany(POSSettings, { foreignKey: "branchId", as: "branchPosSettings" });

            // Warehouse relationships with POS
            warehousesSchema.hasMany(POSDevice, { foreignKey: "warehouseId", as: "warehousePosDevices" });

// User relationships with POS
User.hasMany(POSDevice, { foreignKey: "createdBy", as: "userCreatedPosDevices" });
User.hasMany(POSDevice, { foreignKey: "updatedBy", as: "userUpdatedPosDevices" });
User.hasMany(POSSettings, { foreignKey: "createdBy", as: "userCreatedPosSettings" });
User.hasMany(POSSettings, { foreignKey: "updatedBy", as: "userUpdatedPosSettings" });
User.hasMany(POSPaymentMethod, { foreignKey: "createdBy", as: "userCreatedPosPaymentMethods" });
User.hasMany(POSPaymentMethod, { foreignKey: "updatedBy", as: "userUpdatedPosPaymentMethods" });
User.hasMany(POSInvoiceTemplate, { foreignKey: "createdBy", as: "userCreatedPosInvoiceTemplates" });
User.hasMany(POSInvoiceTemplate, { foreignKey: "updatedBy", as: "userUpdatedPosInvoiceTemplates" });
User.hasMany(POSNotificationRule, { foreignKey: "createdBy", as: "userCreatedPosNotificationRules" });
User.hasMany(POSNotificationRule, { foreignKey: "updatedBy", as: "userUpdatedPosNotificationRules" });
User.hasMany(POSReportTemplate, { foreignKey: "createdBy", as: "userCreatedPosReportTemplates" });
User.hasMany(POSReportTemplate, { foreignKey: "updatedBy", as: "userUpdatedPosReportTemplates" });

// POS Models belong to relationships
POSDevice.belongsTo(Company, { foreignKey: "companyId", as: "deviceCompany" });
POSDevice.belongsTo(Branch, { foreignKey: "branchId", as: "deviceBranch" });
POSDevice.belongsTo(warehousesSchema, { foreignKey: "warehouseId", as: "deviceWarehouse" });
POSDevice.belongsTo(User, { foreignKey: "createdBy", as: "deviceCreator" });
POSDevice.belongsTo(User, { foreignKey: "updatedBy", as: "deviceUpdater" });

POSSettings.belongsTo(Company, { foreignKey: "companyId", as: "settingsCompany" });
POSSettings.belongsTo(Branch, { foreignKey: "branchId", as: "settingsBranch" });
POSSettings.belongsTo(User, { foreignKey: "createdBy", as: "settingsCreator" });
POSSettings.belongsTo(User, { foreignKey: "updatedBy", as: "settingsUpdater" });

POSPaymentMethod.belongsTo(Company, { foreignKey: "companyId", as: "paymentCompany" });
POSPaymentMethod.belongsTo(User, { foreignKey: "createdBy", as: "paymentCreator" });
POSPaymentMethod.belongsTo(User, { foreignKey: "updatedBy", as: "paymentUpdater" });

POSInvoiceTemplate.belongsTo(Company, { foreignKey: "companyId", as: "invoiceCompany" });
POSInvoiceTemplate.belongsTo(User, { foreignKey: "createdBy", as: "invoiceCreator" });
POSInvoiceTemplate.belongsTo(User, { foreignKey: "updatedBy", as: "invoiceUpdater" });

POSNotificationRule.belongsTo(Company, { foreignKey: "companyId", as: "notificationCompany" });
POSNotificationRule.belongsTo(User, { foreignKey: "createdBy", as: "notificationCreator" });
POSNotificationRule.belongsTo(User, { foreignKey: "updatedBy", as: "notificationUpdater" });

POSReportTemplate.belongsTo(Company, { foreignKey: "companyId", as: "reportCompany" });
POSReportTemplate.belongsTo(User, { foreignKey: "createdBy", as: "reportCreator" });
POSReportTemplate.belongsTo(User, { foreignKey: "updatedBy", as: "reportUpdater" });

// Inventory Movement Relationships
Company.hasMany(InventoryMovement, { foreignKey: "companyId", as: "inventoryMovements" });
InventoryMovement.belongsTo(Company, { foreignKey: "companyId", as: "company" });

Branch.hasMany(InventoryMovement, { foreignKey: "branchId", as: "inventoryMovements" });
InventoryMovement.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });

User.hasMany(InventoryMovement, { foreignKey: "userId", as: "inventoryMovements" });
InventoryMovement.belongsTo(User, { foreignKey: "userId", as: "user" });

// AI Insights Relationships
Company.hasMany(AIInsight, { foreignKey: "companyId", as: "aiInsights" });
AIInsight.belongsTo(Company, { foreignKey: "companyId", as: "company" });

Branch.hasMany(AIInsight, { foreignKey: "branchId", as: "aiInsights" });
AIInsight.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });

// Smart Alerts Relationships
Company.hasMany(SmartAlert, { foreignKey: "companyId", as: "smartAlerts" });
SmartAlert.belongsTo(Company, { foreignKey: "companyId", as: "company" });

Branch.hasMany(SmartAlert, { foreignKey: "branchId", as: "smartAlerts" });
SmartAlert.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });

// Supplier System Relationships
// Suppliers schema uses supplier_id and table Suppliers without company/branch foreign keys in schema
// Associations to Company/Branch are skipped to match existing schema

Supplier.hasMany(SupplierInvoice, { foreignKey: "supplier_id", sourceKey: "supplier_id", as: "invoices" });
SupplierInvoice.belongsTo(Supplier, { foreignKey: "supplier_id", targetKey: "supplier_id", as: "supplier" });

Supplier.hasMany(SupplierPayment, { foreignKey: "supplier_id", sourceKey: "supplier_id", as: "payments" });
SupplierPayment.belongsTo(Supplier, { foreignKey: "supplier_id", targetKey: "supplier_id", as: "supplier" });

SupplierInvoice.hasMany(SupplierInvoiceItem, { foreignKey: "invoiceId", as: "items" });
SupplierInvoiceItem.belongsTo(SupplierInvoice, { foreignKey: "invoiceId", as: "invoice" });

SupplierInvoice.hasMany(SupplierPayment, { foreignKey: "invoiceId", as: "payments" });
SupplierPayment.belongsTo(SupplierInvoice, { foreignKey: "invoiceId", as: "invoice" });

Branch.hasMany(SupplierInvoice, { foreignKey: "branchId", as: "supplierInvoices" });
SupplierInvoice.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });

Branch.hasMany(SupplierPayment, { foreignKey: "branchId", as: "supplierPayments" });
SupplierPayment.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });

// Accounting Associations
Branch.hasMany(Account, { foreignKey: "branchId", as: "accounts" });
Account.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });

// Self-referential association for Account parent-child relationship
Account.hasMany(Account, { foreignKey: "parentId", as: "children" });
Account.belongsTo(Account, { foreignKey: "parentId", as: "parent" });

JournalEntry.belongsTo(Branch, { foreignKey: "branchId", as: "branch" });
Branch.hasMany(JournalEntry, { foreignKey: "branchId", as: "journalEntries" });

JournalEntry.belongsTo(User, { foreignKey: "createdBy", as: "createdByUser" });
JournalEntry.belongsTo(User, { foreignKey: "postedBy", as: "postedByUser" });

JournalEntry.hasMany(JournalEntryItem, { foreignKey: "journalEntryId", as: "items" });
JournalEntryItem.belongsTo(JournalEntry, { foreignKey: "journalEntryId", as: "journalEntry" });

JournalEntryItem.belongsTo(Account, { foreignKey: "accountId", as: "account" });
Account.hasMany(JournalEntryItem, { foreignKey: "accountId", as: "journalEntryItems" });

// Export models with associations
module.exports = {
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
  SparePart,
  MainCategory,
  SubCategory,
  OpeningStock,
  brandsSchema,
  categoriesSchema,
  inventorySchema,
  manufacturersSchema,
  productBranchesSchema,
  productsSchema,
  suppliersSchema,
  warehousesSchema,
  unitTemplateSchema,
  unitConversionSchema,
  Consumables,
  ServiceConsumables,
  CountItem,
  Adjustment,
  StockCountSession,
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
  SupplierContract,
  PurchaseReturn,
  PurchaseReturnItem,
  DebitNote,
  DebitNoteItem,
  Customer,
  Car,
  Contact,
  RelatedPerson,
  Feedback,
  Survey,
  SurveyResponse,
  CompanyAttachment,
  CompanyAccount,
  Campaign,
  CampaignTarget,
  Coupon,
  Subscription,
  Plan,
  LoyaltyMember,
  PointsTransaction,
  LoyaltyRule,
  LoyaltyReward,
  DropdownDefinition,
  SupplierCategory,
  SupplyRegion,
  PaymentTerm,
  POSDevice,
  POSSettings,
  POSPaymentMethod,
  POSInvoiceTemplate,
  POSNotificationRule,
  POSReportTemplate,
  
  // Inventory Transaction Models
  InventoryTransaction,
  InventoryTransactionItem,
  InventoryTransactionAttachment,
  InventoryTransactionLog,
  
  // Inventory Movement Models
  InventoryMovement,
  AIInsight,
  SmartAlert,
  
  // Supplier System Models
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
  
  // HR Management Models
  Employee: require("./hr/employeeModel"),
  Department: require("./hr/departmentModel"),
  Position: require("./hr/positionModel"),
  
  // Gym Management Models
  Member: require("./gym/memberModel"),
  MembershipType: require("./gym/membershipTypeModel"),
  GymSubscription: require("./gym/subscriptionModel"),
  GymSubscriptionType: require("./gym/subscriptionTypeModel"),
  SubscriptionTransfer: require("./gym/subscriptionTransferModel"),
  SubscriptionRefund: require("./gym/subscriptionRefundModel"),
  MemberAttendance: require("./gym/memberAttendanceModel"),
  Inbody: require("./gym/inbodyModel"),
  Locker: require("./gym/lockerModel"),
  LockerSubscription: require("./gym/lockerSubscriptionModel"),
  LockerSubscriptionType: require("./gym/lockerSubscriptionTypeModel"),
  Group: require("./gym/groupModel"),
  GroupCategory: require("./gym/groupCategoryModel"),
  TrainerSalary: require("./gym/trainerSalaryModel"),
  GymClass: require("./gym/gymClassModel"),
  ClassEnrollment: require("./gym/classEnrollmentModel"),
  TimeBasedSpecialSubscription: require("./gym/timeBasedSpecialSubscriptionModel"),
  
  // Accounting Models
  Account: require("./accounting/accountModel"),
  JournalEntry: require("./accounting/journalEntryModel"),
  JournalEntryItem: require("./accounting/journalEntryItemModel"),
  
  // App Management Models
  AboutApp: require("./app/aboutAppModel"),
  Invitation: require("./app/invitationModel"),
  AppOffer: require("./app/appOfferModel"),
  AppTrainer: require("./app/appTrainerModel"),
  ExerciseCategory: require("./app/exerciseCategoryModel"),
  AppExercise: require("./app/appExerciseModel"),
  AppNews: require("./app/appNewsModel"),
  AppAd: require("./app/appAdModel"),
  AppMessage: require("./app/appMessageModel"),
  OfferFavorite: require("./app/offerFavoriteModel"),
  
  // Schema Aliases (for backward compatibility)
  purchaseInvoiceSchema: PurchaseInvoice,
  purchaseOrderSchema: PurchaseOrder,
  supplierContractSchema: SupplierContract,
  supplyRegionSchema: SupplyRegion,
};
