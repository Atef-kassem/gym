const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const manufacturersSchema = sequelize.define("Manufacturers", {
  manufacturer_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_ar: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100],
    },
  },
  name_en: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100],
    },
  },
  contact_person: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: [0, 100],
    },
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      len: [0, 20],
    },
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "Manufacturers",
  timestamps: false,
});

module.exports = manufacturersSchema;
