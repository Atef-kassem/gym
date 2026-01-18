const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const Invitation = sequelize.define(
  "Invitation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    invitationCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    recipientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipientEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    sentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected", "attended"),
      allowNull: false,
      defaultValue: "pending",
    },
    acceptedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rejectedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    attendanceDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Branches",
        key: "id",
      },
    },
  },
  {
    tableName: "Invitations",
    timestamps: true,
  }
);

// Associations are defined in Model/index.js

module.exports = Invitation;

