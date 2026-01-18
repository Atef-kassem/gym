const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const JournalEntry = sequelize.define(
  "JournalEntry",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    entryNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    entryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    entryType: {
      type: DataTypes.ENUM("daily", "monthly", "annual", "opening", "closing", "adjusting"),
      allowNull: false,
      defaultValue: "daily",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reference: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    totalDebit: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    totalCredit: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    status: {
      type: DataTypes.ENUM("draft", "posted", "cancelled"),
      allowNull: false,
      defaultValue: "draft",
    },
    postedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    postedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Branches",
        key: "id",
      },
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    tableName: "journal_entries",
    timestamps: true,
    indexes: [
      { fields: ["entryNumber"] },
      { fields: ["entryDate"] },
      { fields: ["entryType"] },
      { fields: ["status"] },
      { fields: ["branchId"] },
    ],
  }
);

module.exports = JournalEntry;

