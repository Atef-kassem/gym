const { DataTypes } = require("sequelize");

const sequelize = require("../Config/sequelize");

const Company = sequelize.define("Company", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  // ! Company information

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

  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
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
    allowNull: false,
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: true,
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
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // ! legal informations
  taxRegistrationNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  commercialRegistrationNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  // ! Attachments needed
  commercialRegistrationNumberAttachment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  taxRegistrationNumberAttachment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  licenceAttachment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  qualityCertificateAttachment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  logoAttachment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  buildingsAttachment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  anotherAttachments: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "Companies",
  timestamps: true,
});

module.exports = Company;
