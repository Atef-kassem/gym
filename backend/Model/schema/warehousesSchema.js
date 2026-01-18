const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const warehousesSchema = sequelize.define("Warehouses", {
  warehouse_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  warehouse_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50],
    },
  },
  name_ar: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [1, 255],
    },
  },
  name_en: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [1, 255],
    },
  },
  type: {
    type: DataTypes.ENUM("main", "sub"),
    allowNull: false,
    defaultValue: "main",
  },
  storage_capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
      branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Branches",
        key: "id",
      },
    },
  current_stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    allowNull: false,
    defaultValue: "active",
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
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: "المملكة العربية المصرية",
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  district: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  postal_code: {
    type: DataTypes.STRING(10),
    allowNull: true,
    validate: {
      len: [0, 10],
    },
  },
  street: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  manager_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: [0, 255],
    },
  },
  assistant_manager_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: [0, 255],
    },
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
  tableName: "Warehouses",
  timestamps: false,
});

module.exports = warehousesSchema;
