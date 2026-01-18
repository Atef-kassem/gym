const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const supplierContractSchema = sequelize.define("supplier_contracts", {
  contract_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  contract_number: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  supplier_name: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  contract_type: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  contract_value: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0,
  },
  payment_terms: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  main_terms: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  contract_document: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: "ساري",
  },
  responsible_employee: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  tableName: "SupplierContracts",
  timestamps: false,
});

module.exports = supplierContractSchema;


