const { DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    modules: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
      comment: "JSON object containing modules with their pages and permissions"
    }
  },
  {
    tableName: "Roles",
    timestamps: false,
  }
);

module.exports = Role;
