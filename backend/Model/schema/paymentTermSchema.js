const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const PaymentTerm = sequelize.define("PaymentTerm", {
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
  days: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 365,
    },
  },
  type: {
    type: DataTypes.ENUM("immediate", "deferred", "installments", "custom"),
    allowNull: false,
    defaultValue: "immediate",
  },
  discount_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
  },
  late_fee_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
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
  tableName: "PaymentTerms",
  timestamps: true,
  indexes: [
    {
      fields: ["active"],
    },
    {
      fields: ["type"],
    },
    {
      fields: ["days"],
    },
  ],
});

module.exports = PaymentTerm;
