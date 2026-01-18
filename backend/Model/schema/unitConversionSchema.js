const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const unitConversionSchema = sequelize.define("UnitConversions", {
  conversion_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  template_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "UnitTemplates",
      key: "template_id",
    },
  },
  from_unit: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50],
    },
  },
  to_unit: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50],
    },
  },
  factor: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 0.0001,
    },
  },
  formula: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  sort_order: {
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
  tableName: "UnitConversions",
  timestamps: false,
});

module.exports = unitConversionSchema;
