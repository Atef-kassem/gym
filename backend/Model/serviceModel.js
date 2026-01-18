const { DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

const Service = sequelize.define("service", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  serviceCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  arabicName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  englishName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  administrativeNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
  discountType: {
    type: DataTypes.ENUM("percentage", "fixed"),
    allowNull: true,
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.0,
  },
  priceAfterDiscount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.0,
  },
  minimumPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.0,
  },
  taxType: {
    type: DataTypes.ENUM("with_vat", "without_vat"),
    allowNull: false,
    defaultValue: "with_vat",
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 15.0,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 15,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "service",
  },
  executionUnit: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "per_car",
  },
  targetCarType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "all_types",
  },
  serviceType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
      categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Categories",
        key: "category_id",
      },
    },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  serviceStatus: {
    type: DataTypes.ENUM("active", "inactive", "pending"),
    allowNull: false,
    defaultValue: "active",
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Branches",
      key: "id",
    },
  },
}, {
  timestamps: false, // Disable automatic timestamp columns
  tableName: 'Services', // Use consistent table name
});

module.exports = Service;
