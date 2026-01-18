const { DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

const SupplierPayment = sequelize.define("SupplierPayment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  paymentNumber: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
    comment: "رقم الدفعة الفريد"
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "معرف المورد"
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "معرف الايصال المرتبطة"
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "معرف الفرع"
  },
  paymentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: "تاريخ الدفع"
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: "تاريخ الاستحقاق"
  },
  paymentAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: "مبلغ الدفع"
  },
  originalAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: "المبلغ الأصلي"
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
  paymentMethod: {
    type: DataTypes.ENUM('تحويل_بنكي', 'شيك', 'نقد', 'بطاقة_ائتمان', 'أخرى'),
    allowNull: false,
    comment: "طريقة الدفع"
  },
  bankName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: "اسم البنك"
  },
  bankAccount: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: "رقم الحساب البنكي"
  },
  transferNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: "رقم التحويل"
  },
  checkNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: "رقم الشيك"
  },
  checkDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: "تاريخ الشيك"
  },
  status: {
    type: DataTypes.ENUM('مسودة', 'مؤكد', 'مدفوع', 'جزئي', 'معلق', 'متأخر', 'ملغي'),
    allowNull: false,
    defaultValue: 'مسودة',
    comment: "حالة الدفع"
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
  priority: {
    type: DataTypes.ENUM('عادي', 'عالي', 'عاجل'),
    allowNull: false,
    defaultValue: 'عادي',
    comment: "أولوية الدفع"
  },
  paymentType: {
    type: DataTypes.ENUM('دفعة_كاملة', 'دفعة_جزئية', 'دفعة_مقدمة', 'دفعة_مؤجلة'),
    allowNull: false,
    defaultValue: 'دفعة_كاملة',
    comment: "نوع الدفعة"
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "ملاحظات الدفع"
  },
  internalNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "ملاحظات داخلية"
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: "المرفقات (إيصالات، مستندات)"
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: "هل هي دفعة متكررة"
  },
  recurringFrequency: {
    type: DataTypes.ENUM('يومي', 'أسبوعي', 'شهري', 'ربع_سنوي', 'سنوي'),
    allowNull: true,
    comment: "تكرار الدفعة"
  },
  nextPaymentDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: "تاريخ الدفعة التالية"
  },
  lateFees: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: "رسوم التأخير"
  },
  discountAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: "مبلغ الخصم"
  },
  discountReason: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: "سبب الخصم"
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "معرف المستخدم الذي أنشأ الدفعة"
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "معرف المستخدم الذي حدث الدفعة"
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: "هل تم حذف الدفعة"
  }
}, {
  tableName: "supplier_payments",
  timestamps: true,
  paranoid: true, // Soft delete
  indexes: [
    {
      unique: true,
      fields: ['paymentNumber']
    },
    {
      fields: ['supplier_id']
    },
    {
      fields: ['invoiceId']
    },
    {
      fields: ['branchId']
    },
    {
      fields: ['paymentDate']
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
      fields: ['paymentMethod']
    },
    {
      fields: ['transferNumber']
    },
    {
      fields: ['checkNumber']
    }
  ],
  hooks: {
    beforeCreate: (payment) => {
      if (!payment.paymentNumber) {
        payment.paymentNumber = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      }
      // حساب المبلغ المتبقي
      payment.remainingAmount = payment.originalAmount - payment.paymentAmount;
    },
    beforeUpdate: (payment) => {
      if (payment.changed('paymentAmount') || payment.changed('originalAmount')) {
        payment.remainingAmount = payment.originalAmount - payment.paymentAmount;
      }
      if (payment.changed('approvalStatus') && payment.approvalStatus === 'موافق') {
        payment.approvedAt = new Date();
      }
    }
  }
});

// Instance methods
SupplierPayment.prototype.calculateRemaining = function() {
  this.remainingAmount = this.originalAmount - this.paymentAmount;
  return this;
};

SupplierPayment.prototype.isOverdue = function() {
  if (!this.dueDate) return false;
  return new Date() > new Date(this.dueDate) && this.remainingAmount > 0;
};

SupplierPayment.prototype.getDaysOverdue = function() {
  if (!this.dueDate) return 0;
  const today = new Date();
  const dueDate = new Date(this.dueDate);
  const diffTime = today - dueDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

SupplierPayment.prototype.isFullyPaid = function() {
  return this.remainingAmount <= 0;
};

SupplierPayment.prototype.getPaymentPercentage = function() {
  if (this.originalAmount <= 0) return 0;
  return (this.paymentAmount / this.originalAmount) * 100;
};

SupplierPayment.prototype.calculateLateFees = function(dailyRate = 0.001) {
  if (!this.isOverdue()) return 0;
  const daysOverdue = this.getDaysOverdue();
  return this.remainingAmount * dailyRate * daysOverdue;
};

// Class methods
SupplierPayment.findOverduePayments = function() {
  return this.findAll({
    where: {
      dueDate: { [sequelize.Op.lt]: new Date() },
      remainingAmount: { [sequelize.Op.gt]: 0 },
      status: { [sequelize.Op.notIn]: ['ملغي', 'مدفوع'] },
      isDeleted: false
    }
  });
};

SupplierPayment.findBySupplier = function(supplierId) {
  return this.findAll({
    where: { supplier_id: supplierId, isDeleted: false },
    order: [['paymentDate', 'DESC']]
  });
};

SupplierPayment.findByStatus = function(status) {
  return this.findAll({
    where: { status, isDeleted: false }
  });
};

SupplierPayment.findByDateRange = function(startDate, endDate) {
  return this.findAll({
    where: {
      paymentDate: {
        [sequelize.Op.between]: [startDate, endDate]
      },
      isDeleted: false
    }
  });
};

SupplierPayment.findPendingApproval = function() {
  return this.findAll({
    where: {
      approvalStatus: 'في_انتظار',
      isDeleted: false
    }
  });
};

SupplierPayment.findByPaymentMethod = function(method) {
  return this.findAll({
    where: { paymentMethod: method, isDeleted: false }
  });
};

module.exports = SupplierPayment;
