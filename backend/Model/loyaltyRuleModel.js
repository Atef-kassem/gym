const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');

const LoyaltyRule = sequelize.define('LoyaltyRule', {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  earnRate: {
    type: DataTypes.DECIMAL(8, 4),
    allowNull: false,
    defaultValue: 0.1,
    validate: {
      min: 0
    }
  },
  redeemRate: {
    type: DataTypes.DECIMAL(8, 4),
    allowNull: false,
    defaultValue: 0.1,
    validate: {
      min: 0
    }
  },
  minPurchase: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  maxPoints: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 1000,
    validate: {
      min: 0
    }
  },
  expiryMonths: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 12,
    validate: {
      min: 1,
      max: 60
    }
  },
  levelMultiplier: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      "Bronze": 1,
      "Silver": 1.5,
      "Gold": 2,
      "Platinum": 3
    }
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
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
  tableName: 'LoyaltyRules',
  timestamps: true,
  paranoid: true, // Soft delete
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['active']
    },
    {
      fields: ['earnRate']
    },
    {
      fields: ['expiryMonths']
    }
  ]
});

module.exports = LoyaltyRule;
