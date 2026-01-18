const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const SupplierCategory = sequelize.define("SupplierCategory", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [1, 255],
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: true,
    defaultValue: "#3B82F6",
    validate: {
      is: /^#[0-9A-F]{6}$/i,
    },
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: "package",
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
  tableName: "SupplierCategories",
  timestamps: true,
  indexes: [
    {
      fields: ["active"],
    },
    {
      fields: ["name"],
    },
  ],
});

module.exports = SupplierCategory;
