const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

// Schema للحركات المخزنية
const InventoryTransaction = sequelize.define("InventoryTransaction", {
  id: {
    type: DataTypes.STRING(255),
    primaryKey: true,
    allowNull: false,
    comment: "معرف فريد للحركة المخزنية"
  },
  type: {
    type: DataTypes.ENUM('استلام', 'صرف', 'تحويل', 'جرد', 'إتلاف', 'مرتجع مشتريات', 'مرتجع مبيعات'),
    allowNull: false,
    comment: "نوع الحركة المخزنية"
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: "تاريخ الحركة"
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: "وقت الحركة"
  },
  sourceWarehouseId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'source_warehouse_id',
    comment: "معرف المستودع المصدر"
  },
  sourceWarehouseName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'source_warehouse_name',
    comment: "اسم المستودع المصدر"
  },
  targetWarehouseId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'target_warehouse_id',
    comment: "معرف المستودع المستقبل (للتحويل)"
  },
  targetWarehouseName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'target_warehouse_name',
    comment: "اسم المستودع المستقبل"
  },
  reference: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: "رقم المرجع (أمر شراء، ايصال، إلخ)"
  },
  userId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'user_id',
    comment: "معرف المستخدم الذي أنشأ الحركة"
  },
  userName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'user_name',
    comment: "اسم المستخدم"
  },
  status: {
    type: DataTypes.ENUM('معتمدة', 'غير معتمدة', 'مسودة'),
    defaultValue: 'مسودة',
    comment: "حالة الحركة"
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "ملاحظات إضافية"
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "سبب الحركة"
  },
  branchId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'branch_id',
    comment: "معرف الفرع"
  },
  branchName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'branch_name',
    comment: "اسم الفرع"
  },
  totalAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    field: 'total_amount',
    comment: "إجمالي قيمة الحركة"
  },
  approvedBy: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'approved_by',
    comment: "معرف المستخدم الذي اعتمد الحركة"
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'approved_at',
    comment: "تاريخ ووقت الاعتماد"
  },
  rejectedBy: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'rejected_by',
    comment: "معرف المستخدم الذي رفض الحركة"
  },
  rejectedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'rejected_at',
    comment: "تاريخ ووقت الرفض"
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'rejection_reason',
    comment: "سبب الرفض"
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
    comment: "تاريخ الإنشاء"
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
    comment: "تاريخ التحديث"
  },
  createdBy: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'created_by',
    comment: "معرف المستخدم الذي أنشأ السجل"
  },
  updatedBy: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'updated_by',
    comment: "معرف المستخدم الذي حدث السجل"
  }
}, {
  tableName: 'INVENTORY_TRANSACTIONS',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: "جدول الحركات المخزنية"
});

// Schema لأصناف الحركات المخزنية
const InventoryTransactionItem = sequelize.define("InventoryTransactionItem", {
  id: {
    type: DataTypes.STRING(255),
    primaryKey: true,
    allowNull: false,
    comment: "معرف فريد للصنف"
  },
  transactionId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'transaction_id',
    comment: "معرف الحركة المخزنية"
  },
  productId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'product_id',
    comment: "معرف المنتج (اختياري)"
  },
  itemCode: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'item_code',
    comment: "كود الصنف"
  },
  itemName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'item_name',
    comment: "اسم الصنف"
  },
  quantity: {
    type: DataTypes.DECIMAL(15, 3),
    allowNull: false,
    comment: "الكمية"
  },
  unit: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: "وحدة القياس"
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    comment: "سعر الوحدة"
  },
  total: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    comment: "إجمالي السعر"
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "ملاحظات على الصنف"
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
    comment: "تاريخ الإنشاء"
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
    comment: "تاريخ التحديث"
  }
}, {
  tableName: 'INVENTORY_TRANSACTION_ITEMS',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  comment: "جدول أصناف الحركات المخزنية"
});

// Schema لمرفقات الحركات المخزنية
const InventoryTransactionAttachment = sequelize.define("InventoryTransactionAttachment", {
  id: {
    type: DataTypes.STRING(255),
    primaryKey: true,
    allowNull: false,
    comment: "معرف فريد للمرفق"
  },
  transactionId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'transaction_id',
    comment: "معرف الحركة المخزنية"
  },
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'file_name',
    comment: "اسم الملف"
  },
  filePath: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'file_path',
    comment: "مسار الملف"
  },
  fileSize: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'file_size',
    comment: "حجم الملف بالبايت"
  },
  mimeType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'mime_type',
    comment: "نوع الملف"
  },
  uploadedBy: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'uploaded_by',
    comment: "معرف المستخدم الذي رفع الملف"
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
    comment: "تاريخ الرفع"
  }
}, {
  tableName: 'INVENTORY_TRANSACTION_ATTACHMENTS',
  timestamps: false,
  comment: "جدول مرفقات الحركات المخزنية"
});

// Schema لسجل تغييرات الحركات المخزنية
const InventoryTransactionLog = sequelize.define("InventoryTransactionLog", {
  id: {
    type: DataTypes.STRING(255),
    primaryKey: true,
    allowNull: false,
    comment: "معرف فريد للسجل"
  },
  transactionId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'transaction_id',
    comment: "معرف الحركة المخزنية"
  },
  action: {
    type: DataTypes.ENUM('created', 'updated', 'approved', 'rejected', 'deleted'),
    allowNull: false,
    comment: "نوع الإجراء"
  },
  oldData: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'old_data',
    comment: "البيانات القديمة"
  },
  newData: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'new_data',
    comment: "البيانات الجديدة"
  },
  changedBy: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'changed_by',
    comment: "معرف المستخدم الذي قام بالتغيير"
  },
  changeReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'change_reason',
    comment: "سبب التغيير"
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
    comment: "تاريخ التغيير"
  }
}, {
  tableName: 'INVENTORY_TRANSACTION_LOGS',
  timestamps: false,
  comment: "جدول سجل تغييرات الحركات المخزنية"
});

// تعريف العلاقات
InventoryTransaction.hasMany(InventoryTransactionItem, {
  foreignKey: 'transactionId',
  as: 'items',
  onDelete: 'CASCADE'
});

InventoryTransactionItem.belongsTo(InventoryTransaction, {
  foreignKey: 'transactionId',
  as: 'transaction'
});

InventoryTransaction.hasMany(InventoryTransactionAttachment, {
  foreignKey: 'transactionId',
  as: 'attachments',
  onDelete: 'CASCADE'
});

InventoryTransactionAttachment.belongsTo(InventoryTransaction, {
  foreignKey: 'transactionId',
  as: 'transaction'
});

InventoryTransaction.hasMany(InventoryTransactionLog, {
  foreignKey: 'transactionId',
  as: 'logs',
  onDelete: 'CASCADE'
});

InventoryTransactionLog.belongsTo(InventoryTransaction, {
  foreignKey: 'transactionId',
  as: 'transaction'
});

module.exports = {
  InventoryTransaction,
  InventoryTransactionItem,
  InventoryTransactionAttachment,
  InventoryTransactionLog
};
