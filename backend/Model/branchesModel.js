const { DataTypes } = require("sequelize");

const sequelize = require("../Config/sequelize");

const Branch = sequelize.define("Branch", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
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
  storageCapacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  working_hours_from: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  working_hours_to: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },

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

  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },

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

  manager: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  supervisor: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  branchImageAttachment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  licenceAttachment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  anotherAttachments: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  zone: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Companies",
      key: "id",
    },
  },
}, {
  tableName: "Branches",
  timestamps: true,
});

module.exports = Branch;
