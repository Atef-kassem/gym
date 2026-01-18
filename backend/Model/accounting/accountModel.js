const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const Account = sequelize.define(
  "Account",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("asset", "liability", "equity", "revenue", "expense"),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    accountLevel: {
      type: DataTypes.ENUM("main", "sub-main", "sub"),
      allowNull: false,
      defaultValue: "main",
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Accounts",
        key: "id",
      },
    },
    balance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Branches",
        key: "id",
      },
    },
  },
  {
    tableName: "Accounts",
    timestamps: true,
    indexes: [
      { fields: ["code"] },
      { fields: ["parentId"] },
      { fields: ["type"] },
      { fields: ["accountLevel"] },
      { fields: ["branchId"] },
    ],
  }
);

// Note: Self-referential associations are defined in Model/index.js to avoid circular dependency and duplicate aliases

module.exports = Account;

