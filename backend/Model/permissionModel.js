const { DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

const Permission = sequelize.define(
  "Permission",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    permissionName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    permissionKey: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: "Short key for permission (e.g., 'view', 'create', 'update')"
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Permission category (e.g., 'CRUD', 'Data', 'System')"
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },
  {
    tableName: "Permissions",
    timestamps: true,
  }
);

module.exports = Permission;

