const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const CompanyAccount = sequelize.define(
  "CompanyAccount",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "company_id",
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: "username",
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash",
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: "email",
    },
    role: {
      type: DataTypes.ENUM("admin", "manager", "user"),
      defaultValue: "admin",
      field: "role",
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "suspended"),
      defaultValue: "active",
      field: "status",
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_login",
    },
    password_changed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "password_changed_at",
    },
  },
  {
    tableName: "CompanyAccounts",
    timestamps: true,
    underscored: true,
  }
);

module.exports = CompanyAccount;
