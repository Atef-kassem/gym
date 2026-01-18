const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const Customer = sequelize.define(
  "Customer",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: { isEmail: true },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    customerType: {
      type: DataTypes.ENUM("Individual", "Company", "Group"),
      allowNull: false,
      defaultValue: "Individual",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    joinDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    lastVisit: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    totalVisits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    totalSpent: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "Customers",
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ["name"] }, { fields: ["phone"], unique: true }],
  }
);

module.exports = Customer;


