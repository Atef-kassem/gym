const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const inventorySchema = sequelize.define("inventory", {
  inventory_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
    references: {
      model: "Products",
      key: "product_id",
    },
  },
  warehouse_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Warehouses",
      key: "warehouse_id",
    },
  },
  shelf_location: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: [0, 50],
    },
  },
  current_stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  min_stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  max_stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1000,
    validate: {
      min: 0,
    },
  },
  reorder_point: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    validate: {
      min: 0,
    },
  },
  last_updated: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "Inventory",
  timestamps: false,
});

module.exports = inventorySchema;
