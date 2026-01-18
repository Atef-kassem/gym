const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const warehousesSchema = require("./warehousesSchema");
const inventorySchema = require("./inventorySchema");

const productsSchema = sequelize.define("products", {
  product_id: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    validate: {
      len: [3, 50],
    },
  },
  barcode: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: true,
    validate: {
      len: [0, 50],
      // Allow empty string, null, or valid barcode
      customValidator(value) {
        if (value && value !== null && value !== '') {
          // Basic barcode validation - allow alphanumeric
          if (!/^[a-zA-Z0-9\-_]+$/.test(value)) {
            throw new Error('الباركود يجب أن يحتوي على أرقام وحروف فقط');
          }
        }
      }
    },
  },
  name_ar: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [1, 255],
      notEmpty: {
        msg: 'اسم المنتج مطلوب'
      }
    },
  },
  name_en: {
    type: DataTypes.STRING(255),
    allowNull: true, // أصبح اختياري
    defaultValue: null,
    validate: {
      len: [0, 255],
    },
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // أصبح اختياري
    defaultValue: 1, // قيمة افتراضية
    references: {
      model: "Categories",
      key: "category_id",
    },
  },
  brand_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Brands",
      key: "brand_id",
    },
  },
  model: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: [0, 100],
    },
  },
  unit_of_measure: {
    type: DataTypes.STRING(50),
    allowNull: true, // أصبح اختياري
    defaultValue: "وحدة",
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    allowNull: false,
    defaultValue: "active",
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  manufacturer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Manufacturers",
      key: "manufacturer_id",
    },
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Suppliers",
      key: "supplier_id",
    },
  },
 
  expiry_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: true,
      // Custom validation function for expiry date
      customValidator(value) {
        if (value && value !== null) {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset time to start of day
          const expiryDate = new Date(value);
          
          if (expiryDate < today) {
            throw new Error('تاريخ انتهاء الصلاحية يجب أن يكون في المستقبل');
          }
        }
      }
    },
  },
  batch_number: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: [0, 50],
    },
  },
  cost_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true, // أصبح اختياري
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  selling_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false, // مطلوب
    validate: {
      min: {
        args: [0],
        msg: 'سعر المنتج يجب أن يكون أكبر من أو يساوي الصفر'
      },
      notEmpty: {
        msg: 'سعر المنتج مطلوب'
      }
    },
  },
  wholesale_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true, // اختياري
    defaultValue: null,
    validate: {
      // Allow empty string, null, or valid URL or relative path
      customValidator(value) {
        if (value && value !== null && value !== '') {
          // قبول: data URLs, http, https, أو مسارات نسبية تبدأ بـ /
          if (value.startsWith('data:image/') || 
              value.startsWith('http://') || 
              value.startsWith('https://') ||
              value.startsWith('/') ||
              value.startsWith('Uploads/')) {
            return true;
          }
          throw new Error('يجب أن يكون رابط صورة صحيح');
        }
      }
    },
  },
  weight_kg: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  dimensions: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: [0, 50],
    },
  },
  color: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: [0, 50],
    },
  },
  size: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: [0, 50],
    },
  },
  material: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: [0, 100],
    },
  },
  warranty_period: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: [0, 50],
    },
  },
  // حقول المخزون
  current_stock: {
    type: DataTypes.INTEGER,
    allowNull: false, // أصبح مطلوب
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'كمية المنتج يجب أن تكون أكبر من أو تساوي الصفر'
      },
      notEmpty: {
        msg: 'كمية المنتج مطلوبة'
      },
      isInt: {
        msg: 'كمية المنتج يجب أن تكون رقماً صحيحاً'
      }
    },
  },
  min_stock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1,
    validate: {
      min: 0,
    },
  },
  max_stock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1000,
    validate: {
      min: 0,
    },
  },
  reorder_point: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 10,
    validate: {
      min: 0,
    },
  },
  // معرف المستودع
  warehouse_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Warehouses",
      key: "warehouse_id",
    },
  },
  // موقع الرف
  shelf_location: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: [0, 100],
    },
  },
  // تطبيق على جميع الفروع
  apply_to_all_branches: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "Products",
  timestamps: false,
});

productsSchema.belongsToMany(warehousesSchema, {
  through: inventorySchema,
  foreignKey: "product_id",
  otherKey: "warehouse_id",
  as: "warehouses",
});
warehousesSchema.belongsToMany(productsSchema, {
  through: inventorySchema,
  foreignKey: "warehouse_id",
  otherKey: "product_id",
  as: "products",
});

module.exports = productsSchema;
