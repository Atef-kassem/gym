const { DataTypes } = require('sequelize');
const sequelize = require('../Config/sequelize');

const DebitNote = sequelize.define('debit_note', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  debit_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  debit_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Suppliers',
      key: 'supplier_id'
    }
  },
  po_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  purchase_order_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'PurchaseOrders',
      key: 'id'
    }
  },
  invoice_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  invoice_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'PurchaseInvoices',
      key: 'id'
    }
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reason_details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  debit_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('مسودة', 'بانتظار الموافقة', 'معتمد', 'مرفوض', 'مرسل للمورد', 'مكتمل'),
    allowNull: false,
    defaultValue: 'مسودة'
  },
  approver: {
    type: DataTypes.STRING,
    allowNull: true
  },
  approved_by: {
    type: DataTypes.STRING,
    allowNull: true
  },
  approved_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  sent_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  branch_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Branches',
      key: 'id'
    }
  },
  branch_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'DEBIT_NOTES',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = DebitNote;
