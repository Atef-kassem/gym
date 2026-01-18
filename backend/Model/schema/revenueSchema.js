const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const Revenue = sequelize.define(
  "revenues",
  {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    revenueNumber: { 
      type: DataTypes.STRING(100), 
      allowNull: true,
      unique: true,
      comment: "رقم الإيراد الفريد"
    },
    revenueDate: { 
      type: DataTypes.DATEONLY, 
      allowNull: false,
      comment: "تاريخ الإيراد"
    },
    source: { 
      type: DataTypes.ENUM(
        'مبيعات منتجات', 'مبيعات خدمات', 'اشتراكات', 'عمولات', 
        'استثمارات', 'إيجارات', 'تبرعات', 'فوائد', 
        'مردودات', 'أخرى'
      ),
      allowNull: false,
      comment: "مصدر الإيراد"
    },
    subSource: { 
      type: DataTypes.STRING(100), 
      allowNull: true,
      comment: "المصدر الفرعي"
    },
    amount: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: false,
      comment: "المبلغ"
    },
    paymentMethod: { 
      type: DataTypes.ENUM('نقدي', 'شيك', 'تحويل بنكي', 'بطاقة ائتمان', 'آجل', 'أخرى'),
      allowNull: false,
      defaultValue: 'نقدي',
      comment: "طريقة الدفع"
    },
    paymentStatus: { 
      type: DataTypes.ENUM('مدفوع', 'معلق', 'مؤجل', 'ملغي'),
      allowNull: false,
      defaultValue: 'مدفوع',
      comment: "حالة الدفع"
    },
    description: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: "وصف الإيراد"
    },
    customerId: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "معرف العميل"
    },
    customerName: { 
      type: DataTypes.STRING(255), 
      allowNull: true,
      comment: "اسم العميل"
    },
    invoiceNumber: { 
      type: DataTypes.STRING(100), 
      allowNull: true,
      comment: "رقم الايصال"
    },
    receiptNumber: { 
      type: DataTypes.STRING(100), 
      allowNull: true,
      comment: "رقم الإيصال"
    },
    branchId: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "معرف الفرع"
    },
    departmentId: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "معرف القسم"
    },
    projectId: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "معرف المشروع"
    },
    isRecurring: { 
      type: DataTypes.BOOLEAN, 
      allowNull: false,
      defaultValue: false,
      comment: "هل هو إيراد متكرر"
    },
    recurringFrequency: { 
      type: DataTypes.ENUM('يومي', 'أسبوعي', 'شهري', 'ربع سنوي', 'سنوي'),
      allowNull: true,
      comment: "تكرار الإيراد"
    },
    nextRecurringDate: { 
      type: DataTypes.DATEONLY, 
      allowNull: true,
      comment: "تاريخ التكرار القادم"
    },
    taxAmount: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: true,
      defaultValue: 0,
      comment: "مبلغ الضريبة"
    },
    discountAmount: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: true,
      defaultValue: 0,
      comment: "مبلغ الخصم"
    },
    totalAmount: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: false,
      defaultValue: 0,
      comment: "المبلغ الإجمالي"
    },
    netAmount: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: false,
      defaultValue: 0,
      comment: "صافي المبلغ"
    },
    attachments: { 
      type: DataTypes.JSON, 
      allowNull: true,
      comment: "المرفقات (صور، ملفات)"
    },
    tags: { 
      type: DataTypes.JSON, 
      allowNull: true,
      comment: "الوسوم للتصنيف"
    },
    notes: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: "ملاحظات إضافية"
    },
    createdBy: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "معرف المستخدم المنشئ"
    },
    isDeleted: { 
      type: DataTypes.BOOLEAN, 
      allowNull: false,
      defaultValue: false,
      comment: "هل تم حذف الإيراد"
    }
  },
  {
    tableName: "REVENUES",
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeCreate: (revenue) => {
        if (!revenue.revenueNumber) {
          const timestamp = Date.now();
          const random = Math.random().toString(36).substr(2, 5).toUpperCase();
          revenue.revenueNumber = `REV-${timestamp}-${random}`;
        }
        // حساب المبلغ الإجمالي وصافي المبلغ
        revenue.totalAmount = parseFloat(revenue.amount || 0) + parseFloat(revenue.taxAmount || 0);
        revenue.netAmount = revenue.totalAmount - parseFloat(revenue.discountAmount || 0);
      },
      beforeUpdate: (revenue) => {
        if (revenue.changed('amount') || revenue.changed('taxAmount') || revenue.changed('discountAmount')) {
          revenue.totalAmount = parseFloat(revenue.amount || 0) + parseFloat(revenue.taxAmount || 0);
          revenue.netAmount = revenue.totalAmount - parseFloat(revenue.discountAmount || 0);
        }
      }
    }
  }
);

module.exports = Revenue;

