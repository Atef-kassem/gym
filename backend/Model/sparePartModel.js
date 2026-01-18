const { DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

const SparePart = sequelize.define(
  "SparePart",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sparePartCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "كود  ة ",
    },
    originalPartNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "رقم  ة الأصلي ",
    },
    alternativePartNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "رقم  ة البديل",
    },
    arabicName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    englishName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    mainCategory_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "MainCategory",
        key: "id",
      },
    },
    subCategory_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "SubCategory",
        key: "id",
      },
    },

    partStatus: {
      type: DataTypes.ENUM("جديد", "مستعمل", "مجدد"),
      allowNull: false,
      defaultValue: "جديد",
      comment: "حالة  ة ",
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "ماركة  ة ",
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "الشركة المصنعة",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    compatibleVehicles: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: " المركبات المتوافقة ",
    },
    compatibleYears: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: " السنوات المتوافقة ",
    },
    partLocationInCar: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "موقع  ة في المشروب",
    },

    warrantyPeriod: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "فترة الضمان ",
    },
    warrantyType: {
      type: DataTypes.ENUM("أشهر", "سنوات", "كيلومترات"),
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("نشط", "غير نشط"),
      allowNull: false,
      defaultValue: "نشط",
    },

    warehouse_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Warehouses",
        key: "warehouse_id",
      },
    },
    shelfLocation: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "موقع الرف في المخزن",
    },
    currentStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "الكمية الحالية في المخزن",
    },
    minimumStock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "الحد الأدنى للكمية في المخزن",
    },
    maximumStock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "الحد الأقصى للكمية في المخزن",
    },
    reorderPoint: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "نقطة إعادة الطلب",
    },

    costPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    sellingPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    wholesalePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "سعر الجملة",
    },

    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Suppliers",
        key: "supplier_id",
      },
    },

    weight: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    material: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    installationDifficulty: {
      type: DataTypes.ENUM("سهل", "متوسط", "صعب"),
      allowNull: true,
    },
    installationTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    requiredTools: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    partImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    branch_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Branches", // Changed from "branch" to "branches" to match actual table name
        key: "id",
      },
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "SparePart",
    timestamps: false,
  }
);

module.exports = SparePart;
