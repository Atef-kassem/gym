const { DataTypes } = require("sequelize");

const sequelize = require("../Config/sequelize");

const Consumables = sequelize.define("Consumables", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Categories",
      key: "category_id",
    },
  },
  nameAr: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nameEn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unitId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },

  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  consumptionRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  unitCost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  warehouseId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Warehouses",
      key: "warehouse_id",
    },
  },
  shelfLocation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currentStock: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  minStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  maxStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reorderPoint: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Suppliers",
      key: "supplier_id",
    },
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  batchNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  storageConditions: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  attachmentImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Branches", // جدول الفروع
      key: "id",
    },
  },
  brandId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Brands",
      key: "brand_id",
    },
  },
}, {
  tableName: "Consumables",
  timestamps: false,
});

module.exports = Consumables;
