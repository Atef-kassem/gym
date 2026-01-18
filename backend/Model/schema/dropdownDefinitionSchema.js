const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const DropdownDefinition = sequelize.define("DropdownDefinition", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [1, 255],
    },
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100],
    },
  },
  values: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    validate: {
      isArrayValidator(value) {
        if (!Array.isArray(value)) {
          throw new Error('Values must be an array');
        }
      }
    },
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  tableName: "DropdownDefinitions",
  timestamps: true,
  indexes: [
    {
      fields: ["category"],
    },
    {
      fields: ["active"],
    },
  ],
});

module.exports = DropdownDefinition;
