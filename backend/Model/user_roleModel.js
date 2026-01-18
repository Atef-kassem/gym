const { DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

const UserRole = sequelize.define(
  "UserRole",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Roles",
        key: "id",
      },
    },
  },
  {
    tableName: "UserRoles",
    timestamps: false,
  }
);

module.exports = UserRole;
