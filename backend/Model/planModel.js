const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');

const Plan = sequelize.define('Plan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  interval: {
    type: DataTypes.ENUM('شهري', 'سنوي', 'أسبوعي'),
    allowNull: false,
    defaultValue: 'شهري'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  popular: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  color: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'blue'
  },
  maxUsers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  maxServices: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Plans',
  timestamps: true,
  paranoid: true, // Soft delete
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['interval']
    },
    {
      fields: ['popular']
    },
    {
      fields: ['isActive']
    }
  ]
});

module.exports = Plan;
