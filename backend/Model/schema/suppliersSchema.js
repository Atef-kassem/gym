const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const suppliersSchema = sequelize.define("suppliers", {
  supplier_id: {
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
  mobile: {
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
  tax_number: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: [0, 50],
    },
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
  tableName: "Suppliers",
  timestamps: false,
});

module.exports = suppliersSchema;
