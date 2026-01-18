const { DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

const SupplierInvoice = sequelize.define("SupplierInvoice", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  invoiceNumber: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
    comment: "رقم الايصال الفريد"
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "معرف المورد"
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "معرف الفرع"
  },
  warehouseId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "معرف المستودع"
  },
  invoiceDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: "تاريخ الايصال"
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: "تاريخ الاستحقاق"
  },
  deliveryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: "تاريخ التسليم"
  },
  referenceNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: "رقم المرجع (طلب الشراء، أمر الشراء)"
  },
  referenceType: {
    type: DataTypes.ENUM('طلب_شراء', 'أمر_شراء', 'إيصال_استلام', 'أخرى'),
    allowNull: true,
    comment: "نوع المرجع"
  },
  subtotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: "المجموع الفرعي"
  },
  taxAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: "مبلغ الضريبة"
  },
  discountAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: "مبلغ الخصم"
  },
  shippingAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: "مبلغ الشحن"
  },
  totalAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: "إجمالي المبلغ"
  },
  paidAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: "المبلغ المدفوع"
  },
  remainingAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: "المبلغ المتبقي"
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'SAR',
    comment: "العملة"
  },
  exchangeRate: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
    defaultValue: 1,
    comment: "سعر الصرف"
  },
  paymentTerms: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "شروط الدفع بالأيام"
  },
  paymentMethod: {
    type: DataTypes.ENUM('تحويل_بنكي', 'شيك', 'نقد', 'بطاقة_ائتمان', 'أخرى'),
    allowNull: true,
    comment: "طريقة الدفع"
  },
  status: {
    type: DataTypes.ENUM('مسودة', 'مرسل', 'مستلم', 'مؤكد', 'مدفوع', 'جزئي', 'متأخر', 'ملغي'),
    allowNull: false,
    defaultValue: 'مسودة',
    comment: "حالة الايصال"
  },
  approvalStatus: {
    type: DataTypes.ENUM('في_انتظار', 'موافق', 'مرفوض', 'معلق'),
    allowNull: false,
    defaultValue: 'في_انتظار',
    comment: "حالة الموافقة"
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "معرف المستخدم المعتمد"
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "تاريخ الموافقة"
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "ملاحظات الايصال"
  },
  internalNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "ملاحظات داخلية"
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: "المرفقات (ملفات، صور، مستندات)"
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: "هل هي ايصال متكررة"
  },
  recurringFrequency: {
    type: DataTypes.ENUM('يومي', 'أسبوعي', 'شهري', 'ربع_سنوي', 'سنوي'),
    allowNull: true,
    comment: "تكرار الايصال"
  },
  nextInvoiceDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: "تاريخ الايصال التالية"
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "معرف المستخدم الذي أنشأ الايصال"
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "معرف المستخدم الذي حدث الايصال"
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: "هل تم حذف الايصال"
  }
}, {
  tableName: "supplier_invoices",
  timestamps: true,
  paranoid: true, // Soft delete
  indexes: [
    {
      unique: true,
      fields: ['invoiceNumber']
    },
    {
      fields: ['supplier_id']
    },
    {
      fields: ['branchId']
    },
    {
      fields: ['warehouseId']
    },
    {
      fields: ['invoiceDate']
    },
    {
      fields: ['dueDate']
    },
    {
      fields: ['status']
    },
    {
      fields: ['approvalStatus']
    },
    {
      fields: ['referenceNumber']
    }
  ],
  hooks: {
    beforeCreate: (invoice) => {
      if (!invoice.invoiceNumber) {
        invoice.invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      }
      // حساب المبلغ المتبقي
      invoice.remainingAmount = invoice.totalAmount - invoice.paidAmount;
    },
    beforeUpdate: (invoice) => {
      if (invoice.changed('totalAmount') || invoice.changed('paidAmount')) {
        invoice.remainingAmount = invoice.totalAmount - invoice.paidAmount;
      }
      if (invoice.changed('approvalStatus') && invoice.approvalStatus === 'موافق') {
        invoice.approvedAt = new Date();
      }
    }
  }
});

// Instance methods
SupplierInvoice.prototype.calculateTotals = function() {
  this.totalAmount = this.subtotal + this.taxAmount + this.shippingAmount - this.discountAmount;
  this.remainingAmount = this.totalAmount - this.paidAmount;
  return this;
};

SupplierInvoice.prototype.isOverdue = function() {
  if (!this.dueDate) return false;
  return new Date() > new Date(this.dueDate) && this.remainingAmount > 0;
};

SupplierInvoice.prototype.getDaysOverdue = function() {
  if (!this.dueDate) return 0;
  const today = new Date();
  const dueDate = new Date(this.dueDate);
  const diffTime = today - dueDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

SupplierInvoice.prototype.isFullyPaid = function() {
  return this.remainingAmount <= 0;
};

SupplierInvoice.prototype.getPaymentPercentage = function() {
  if (this.totalAmount <= 0) return 0;
  return (this.paidAmount / this.totalAmount) * 100;
};

// Class methods
SupplierInvoice.findOverdueInvoices = function() {
  return this.findAll({
    where: {
      dueDate: { [sequelize.Op.lt]: new Date() },
      remainingAmount: { [sequelize.Op.gt]: 0 },
      status: { [sequelize.Op.notIn]: ['ملغي', 'مدفوع'] },
      isDeleted: false
    }
  });
};

SupplierInvoice.findBySupplier = function(supplierId) {
  return this.findAll({
    where: { supplier_id: supplierId, isDeleted: false },
    order: [['invoiceDate', 'DESC']]
  });
};

SupplierInvoice.findByStatus = function(status) {
  return this.findAll({
    where: { status, isDeleted: false }
  });
};

SupplierInvoice.findByDateRange = function(startDate, endDate) {
  return this.findAll({
    where: {
      invoiceDate: {
        [sequelize.Op.between]: [startDate, endDate]
      },
      isDeleted: false
    }
  });
};

SupplierInvoice.findPendingApproval = function() {
  return this.findAll({
    where: {
      approvalStatus: 'في_انتظار',
      isDeleted: false
    }
  });
};

module.exports = SupplierInvoice;
