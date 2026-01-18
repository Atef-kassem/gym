const { DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

const Supplier = sequelize.define("Supplier", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  supplierCode: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    comment: "رمز المورد الفريد"
  },
  supplierName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: "اسم المورد"
  },
  supplierNameEn: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: "اسم المورد بالإنجليزية"
  },
  contactPerson: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: "الشخص المسؤول عن التواصل"
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: "رقم الهاتف"
  },
  mobile: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: "رقم الجوال"
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: true
    },
    comment: "البريد الإلكتروني"
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: "الموقع الإلكتروني"
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "العنوان"
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: "المدينة"
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: "الدولة"
  },
  postalCode: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: "الرمز البريدي"
  },
  taxNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: "الرقم الضريبي"
  },
  commercialRecord: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: "السجل التجاري"
  },
  bankName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: "اسم البنك"
  },
  bankAccountNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: "رقم الحساب البنكي"
  },
  bankIBAN: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: "رقم الآيبان"
  },
  paymentTerms: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 30,
    comment: "شروط الدفع بالأيام"
  },
  creditLimit: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0,
    comment: "الحد الائتماني"
  },
  currentBalance: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0,
    comment: "الرصيد الحالي"
  },
  supplierCategory: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: "فئة المورد"
  },
  supplyRegion: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: "منطقة التوريد"
  },
  supplierRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    },
    comment: "تقييم المورد (0-5)"
  },
  status: {
    type: DataTypes.ENUM('نشط', 'غير نشط', 'معلق', 'محظور'),
    allowNull: false,
    defaultValue: 'نشط',
    comment: "حالة المورد"
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "ملاحظات إضافية"
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: "المرفقات (ملفات، صور، مستندات)"
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "معرف المستخدم الذي أنشأ المورد"
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "معرف المستخدم الذي حدث المورد"
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: "هل تم حذف المورد"
  }
}, {
  tableName: "suppliers",
  timestamps: true,
  paranoid: true, // Soft delete
  indexes: [
    {
      unique: true,
      fields: ['supplierCode']
    },
    {
      fields: ['supplierName']
    },
    {
      fields: ['email']
    },
    {
      fields: ['phone']
    },
    {
      fields: ['status']
    },
    {
      fields: ['supplierCategory']
    },
    {
      fields: ['supplyRegion']
    }
  ],
  hooks: {
    beforeCreate: (supplier) => {
      if (!supplier.supplierCode) {
        supplier.supplierCode = `SUP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      }
    },
    beforeUpdate: (supplier) => {
      if (supplier.changed('currentBalance')) {
        // يمكن إضافة منطق إضافي هنا للتحقق من الحد الائتماني
      }
    }
  }
});

// Instance methods
Supplier.prototype.getFullAddress = function() {
  const parts = [this.address, this.city, this.country, this.postalCode];
  return parts.filter(part => part).join(', ');
};

Supplier.prototype.getContactInfo = function() {
  const contacts = [];
  if (this.phone) contacts.push(`هاتف: ${this.phone}`);
  if (this.mobile) contacts.push(`جوال: ${this.mobile}`);
  if (this.email) contacts.push(`بريد: ${this.email}`);
  return contacts.join(' | ');
};

Supplier.prototype.isOverCreditLimit = function() {
  return this.creditLimit > 0 && this.currentBalance > this.creditLimit;
};

Supplier.prototype.getCreditUtilization = function() {
  if (this.creditLimit <= 0) return 0;
  return (this.currentBalance / this.creditLimit) * 100;
};

// Class methods
Supplier.findByCategory = function(category) {
  return this.findAll({
    where: { supplierCategory: category, status: 'نشط' }
  });
};

Supplier.findByRegion = function(region) {
  return this.findAll({
    where: { supplyRegion: region, status: 'نشط' }
  });
};

Supplier.findActiveSuppliers = function() {
  return this.findAll({
    where: { status: 'نشط', isDeleted: false }
  });
};

Supplier.findByRating = function(minRating) {
  return this.findAll({
    where: { 
      supplierRating: { [sequelize.Op.gte]: minRating },
      status: 'نشط',
      isDeleted: false
    }
  });
};

module.exports = Supplier;
