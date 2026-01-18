const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const Expense = sequelize.define(
  "expenses",
  {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    expenseNumber: { 
      type: DataTypes.STRING(100), 
      allowNull: true,
      unique: true,
      comment: "رقم المصروف الفريد"
    },
    expenseDate: { 
      type: DataTypes.DATEONLY, 
      allowNull: false,
      comment: "تاريخ المصروف"
    },
    category: { 
      type: DataTypes.ENUM(
        'رواتب', 'إيجار', 'مرافق', 'صيانة', 'تسويق', 'مشتريات', 
        'نقل وشحن', 'ضرائب ورسوم', 'تأمينات', 'قرطاسية', 
        'اتصالات', 'ضيافة', 'تدريب', 'أخرى'
      ),
      allowNull: false,
      comment: "فئة المصروف"
    },
    subCategory: { 
      type: DataTypes.STRING(100), 
      allowNull: true,
      comment: "الفئة الفرعية"
    },
    amount: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: false,
      comment: "المبلغ"
    },
    paymentMethod: { 
      type: DataTypes.ENUM('نقدي', 'شيك', 'تحويل بنكي', 'بطاقة ائتمان', 'أخرى'),
      allowNull: false,
      defaultValue: 'نقدي',
      comment: "طريقة الدفع"
    },
    paymentStatus: { 
      type: DataTypes.ENUM('مدفوع', 'معلق', 'مؤجل', 'ملغي'),
      allowNull: false,
      defaultValue: 'معلق',
      comment: "حالة الدفع"
    },
    description: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: "وصف المصروف"
    },
    vendor: { 
      type: DataTypes.STRING(255), 
      allowNull: true,
      comment: "اسم المورد أو الجهة"
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
      comment: "هل هو مصروف متكرر"
    },
    recurringFrequency: { 
      type: DataTypes.ENUM('يومي', 'أسبوعي', 'شهري', 'ربع سنوي', 'سنوي'),
      allowNull: true,
      comment: "تكرار المصروف"
    },
    nextRecurringDate: { 
      type: DataTypes.DATEONLY, 
      allowNull: true,
      comment: "تاريخ التكرار القادم"
    },
    approvalStatus: { 
      type: DataTypes.ENUM('معلق', 'موافق عليه', 'مرفوض'),
      allowNull: false,
      defaultValue: 'معلق',
      comment: "حالة الموافقة"
    },
    approvedBy: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: "معرف الموافق"
    },
    approvedAt: { 
      type: DataTypes.DATE, 
      allowNull: true,
      comment: "تاريخ الموافقة"
    },
    taxAmount: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: true,
      defaultValue: 0,
      comment: "مبلغ الضريبة"
    },
    totalAmount: { 
      type: DataTypes.DECIMAL(15, 2), 
      allowNull: false,
      defaultValue: 0,
      comment: "المبلغ الإجمالي شامل الضريبة"
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
      comment: "هل تم حذف المصروف"
    }
  },
  {
    tableName: "EXPENSES",
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeCreate: (expense) => {
        if (!expense.expenseNumber) {
          const timestamp = Date.now();
          const random = Math.random().toString(36).substr(2, 5).toUpperCase();
          expense.expenseNumber = `EXP-${timestamp}-${random}`;
        }
        // حساب المبلغ الإجمالي
        expense.totalAmount = parseFloat(expense.amount || 0) + parseFloat(expense.taxAmount || 0);
      },
      beforeUpdate: (expense) => {
        if (expense.changed('amount') || expense.changed('taxAmount')) {
          expense.totalAmount = parseFloat(expense.amount || 0) + parseFloat(expense.taxAmount || 0);
        }
      }
    }
  }
);

module.exports = Expense;

