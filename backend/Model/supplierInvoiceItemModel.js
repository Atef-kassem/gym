const { DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

const SupplierInvoiceItem = sequelize.define("SupplierInvoiceItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "معرف الايصال"
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "معرف المنتج"
  },
  productName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: "اسم المنتج"
  },
  productCode: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: "رمز المنتج"
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "وصف المنتج"
  },
  unit: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: "الوحدة"
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    defaultValue: 1,
    comment: "الكمية"
  },
  receivedQuantity: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    defaultValue: 0,
    comment: "الكمية المستلمة"
  },
  unitPrice: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
    defaultValue: 0,
    comment: "سعر الوحدة"
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    comment: "نسبة الضريبة"
  },
  taxAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: "مبلغ الضريبة"
  },
  discountRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    comment: "نسبة الخصم"
  },
  discountAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: "مبلغ الخصم"
  },
  subtotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: "المجموع الفرعي"
  },
  totalAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: "إجمالي المبلغ"
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "ملاحظات إضافية"
  },
  specifications: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: "المواصفات التقنية"
  },
  warranty: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: "الضمان"
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: "تاريخ انتهاء الصلاحية"
  },
  batchNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: "رقم الدفعة"
  },
  serialNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: "الرقم التسلسلي"
  },
  isService: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: "هل هو خدمة"
  },
  serviceDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: "تاريخ الخدمة"
  },
  serviceDuration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "مدة الخدمة بالأيام"
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "معرف المستخدم الذي أنشأ العنصر"
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "معرف المستخدم الذي حدث العنصر"
  }
}, {
  tableName: "supplier_invoice_items",
  timestamps: true,
  indexes: [
    {
      fields: ['invoiceId']
    },
    {
      fields: ['productId']
    },
    {
      fields: ['productCode']
    }
  ],
  hooks: {
    beforeCreate: (item) => {
      // حساب المبالغ تلقائياً
      item.calculateTotals();
    },
    beforeUpdate: (item) => {
      if (item.changed('quantity') || item.changed('unitPrice') || 
          item.changed('taxRate') || item.changed('discountRate')) {
        item.calculateTotals();
      }
    }
  }
});

// Instance methods
SupplierInvoiceItem.prototype.calculateTotals = function() {
  // حساب المجموع الفرعي
  this.subtotal = this.quantity * this.unitPrice;
  
  // حساب مبلغ الخصم
  this.discountAmount = (this.subtotal * this.discountRate) / 100;
  
  // حساب مبلغ الضريبة (بعد الخصم)
  const amountAfterDiscount = this.subtotal - this.discountAmount;
  this.taxAmount = (amountAfterDiscount * this.taxRate) / 100;
  
  // حساب إجمالي المبلغ
  this.totalAmount = amountAfterDiscount + this.taxAmount;
  
  return this;
};

SupplierInvoiceItem.prototype.getRemainingQuantity = function() {
  return this.quantity - this.receivedQuantity;
};

SupplierInvoiceItem.prototype.isFullyReceived = function() {
  return this.receivedQuantity >= this.quantity;
};

SupplierInvoiceItem.prototype.getReceiptPercentage = function() {
  if (this.quantity <= 0) return 0;
  return (this.receivedQuantity / this.quantity) * 100;
};

// Class methods
SupplierInvoiceItem.findByInvoice = function(invoiceId) {
  return this.findAll({
    where: { invoiceId },
    order: [['id', 'ASC']]
  });
};

SupplierInvoiceItem.findByProduct = function(productId) {
  return this.findAll({
    where: { productId }
  });
};

SupplierInvoiceItem.findPendingReceipt = function() {
  return this.findAll({
    where: {
      receivedQuantity: { [sequelize.Op.lt]: sequelize.col('quantity') }
    }
  });
};

module.exports = SupplierInvoiceItem;
