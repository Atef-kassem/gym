const { DataTypes } = require("sequelize");

const sequelize = require("../Config/sequelize");

const Storage = sequelize.define("Storage", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // ! Storage information
  arabicName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  englishName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  storageType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  storageCapacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  currentStock: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },

  // ! Contact information

  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telephoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  // ! Address information

  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  neighborhood: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  street: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // other fields
  manager: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  supervisor: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // ! Attachments
  storageImageAttachment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  licenceAttachment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  safetyCertificationAttachment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  WarehousePlansAttachment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  inventoryReportsAttachment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  anotherAttachments: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Branches", // جدول الفروع
      key: "id",
    },
  },
}, {
  tableName: "Storage",
  timestamps: true,
});

module.exports = Storage;
