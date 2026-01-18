const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');

const LoyaltyReward = sequelize.define('LoyaltyReward', {
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
  pointsRequired: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    allowNull: false,
    defaultValue: 'percentage',
    validate: {
      isIn: [['percentage', 'fixed']]
    }
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'عام'
  },
  expiryDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30,
    validate: {
      min: 1,
      max: 365
    }
  },
  maxRedemptions: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  currentRedemptions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
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
  tableName: 'LoyaltyRewards',
  timestamps: true,
  paranoid: true, // Soft delete
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['category']
    },
    {
      fields: ['active']
    },
    {
      fields: ['pointsRequired']
    }
  ]
});

// Hook to validate max redemptions
LoyaltyReward.beforeSave((reward) => {
  if (reward.maxRedemptions && reward.currentRedemptions > reward.maxRedemptions) {
    throw new Error('عدد الاستردادات الحالي يتجاوز الحد الأقصى المسموح');
  }
});

module.exports = LoyaltyReward;
