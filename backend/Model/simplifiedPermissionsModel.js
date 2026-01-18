const { DataTypes } = require("sequelize");
const sequelize = require("../Config/sequelize");

const SimplifiedPermissions = sequelize.define("SimplifiedPermissions", {
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
  roleName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: "User",
  },
  pageName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  moduleName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  pageTitle: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  moduleTitle: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  canView: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  canCreate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  canUpdate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  canDelete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  canExport: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  canImport: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  orderIndex: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: "SimplifiedPermissions",
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'pageName']
    },
    {
      fields: ['roleName']
    },
    {
      fields: ['moduleName']
    }
  ]
});

module.exports = SimplifiedPermissions;
