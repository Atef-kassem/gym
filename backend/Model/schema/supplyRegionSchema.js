const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const SupplyRegion = sequelize.define("SupplyRegion", {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  branches: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    validate: {
      isArrayValidator(value) {
        if (!Array.isArray(value)) {
          throw new Error('Branches must be an array');
        }
      }
    },
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: "المملكة العربية المصرية",
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  district: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  coordinates: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: "Latitude and Longitude coordinates",
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
  tableName: "SupplyRegions",
  timestamps: true,
  indexes: [
    {
      fields: ["active"],
    },
    {
      fields: ["country"],
    },
    {
      fields: ["city"],
    },
  ],
});

module.exports = SupplyRegion;
