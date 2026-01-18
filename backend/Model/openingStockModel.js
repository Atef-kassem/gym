const { DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

const OpeningStock = sequelize.define(
  "OpeningStock",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    opening_stock_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    item_code: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    unit_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    total_cost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Branches",
        key: "id",
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
    product_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: "Products",
        key: "product_id",
      },
    },
    spare_part_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "SparePart",
        key: "id",
      },
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
  },
  {
    tableName: "OpeningStock",
    timestamps: false,
  }
);

module.exports = OpeningStock;
