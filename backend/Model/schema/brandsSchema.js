const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const brandsSchema = sequelize.define("brands", {
  brand_id: {
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
  logo_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
  description: {
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
  tableName: "Brands",
  timestamps: false,
});

module.exports = brandsSchema;
