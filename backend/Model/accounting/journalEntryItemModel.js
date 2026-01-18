const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const JournalEntryItem = sequelize.define(
  "JournalEntryItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    journalEntryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "journal_entries",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Accounts",
        key: "id",
      },
    },
    debit: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    credit: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reference: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    lineOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "journal_entry_items",
    timestamps: true,
    indexes: [
      { fields: ["journalEntryId"] },
      { fields: ["accountId"] },
    ],
  }
);

module.exports = JournalEntryItem;

