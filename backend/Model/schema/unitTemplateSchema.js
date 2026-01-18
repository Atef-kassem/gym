const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const unitTemplateSchema = sequelize.define("UnitTemplates", {
  template_id: {
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
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 20],
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  base_unit: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50],
    },
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: "general",
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  usage_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
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
  tableName: "UnitTemplates",
  timestamps: false,
});

module.exports = unitTemplateSchema;
