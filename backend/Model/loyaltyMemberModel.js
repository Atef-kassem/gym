const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');

const LoyaltyMember = sequelize.define('LoyaltyMember', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerId: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  customerName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  customerEmail: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  customerPhone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  joinDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  totalEarned: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalSpent: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  currentBalance: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  membershipLevel: {
    type: DataTypes.ENUM('Bronze', 'Silver', 'Gold', 'Platinum'),
    allowNull: false,
    defaultValue: 'Bronze'
  },
  lastActivity: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  pointsExpiring: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('نشط', 'مجمد', 'منتهي'),
    allowNull: false,
    defaultValue: 'نشط'
  },
  birthdayBonus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  nationalDayBonus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
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
  tableName: 'LoyaltyMembers',
  timestamps: true,
  paranoid: true, // Soft delete
  indexes: [
    {
      fields: ['customerId']
    },
    {
      fields: ['customerEmail']
    },
    {
      fields: ['membershipLevel']
    },
    {
      fields: ['status']
    },
    {
      fields: ['joinDate']
    },
    {
      fields: ['expiryDate']
    }
  ]
});

// Hook to calculate membership level
LoyaltyMember.beforeSave((member) => {
  if (member.totalEarned >= 2000) {
    member.membershipLevel = 'Platinum';
  } else if (member.totalEarned >= 1000) {
    member.membershipLevel = 'Gold';
  } else if (member.totalEarned >= 500) {
    member.membershipLevel = 'Silver';
  } else {
    member.membershipLevel = 'Bronze';
  }
});

// Hook to update last activity
LoyaltyMember.beforeUpdate((member) => {
  if (member.changed('totalEarned') || member.changed('totalSpent') || member.changed('currentBalance')) {
    member.lastActivity = new Date().toISOString().split('T')[0];
  }
});

module.exports = LoyaltyMember;
