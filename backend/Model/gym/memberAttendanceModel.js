const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const MemberAttendance = sequelize.define(
  "MemberAttendance",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Members",
        key: "id",
      },
      comment: "معرف العضو",
    },
    memberCode: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "كود العضو",
    },
    memberName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "اسم العضو",
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Branches",
        key: "id",
      },
      comment: "معرف الفرع",
    },
    checkInTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "وقت الدخول",
    },
    checkOutTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "وقت الخروج",
    },
    attendanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "تاريخ الحضور",
    },
    status: {
      type: DataTypes.ENUM("checked_in", "checked_out"),
      allowNull: false,
      defaultValue: "checked_in",
      comment: "حالة الحضور",
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "مدة الحضور بالدقائق",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "ملاحظات",
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      comment: "المستخدم الذي أنشأ السجل",
    },
  },
  {
    tableName: "MemberAttendances",
    timestamps: true,
    indexes: [
      {
        fields: ["memberId"],
      },
      {
        fields: ["branchId"],
      },
      {
        fields: ["attendanceDate"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["memberCode"],
      },
    ],
  }
);

module.exports = MemberAttendance;

