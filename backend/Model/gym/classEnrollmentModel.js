const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const ClassEnrollment = sequelize.define(
  "ClassEnrollment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "GymClasses",
        key: "id",
      },
      comment: "معرف الحصة",
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
    enrollmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "تاريخ التسجيل",
    },
    attendanceStatus: {
      type: DataTypes.ENUM("registered", "attended", "absent", "cancelled"),
      allowNull: false,
      defaultValue: "registered",
      comment: "حالة الحضور",
    },
    attendanceTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "وقت الحضور الفعلي",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "ملاحظات",
    },
  },
  {
    tableName: "ClassEnrollments",
    timestamps: true,
    indexes: [
      {
        fields: ["classId"],
      },
      {
        fields: ["memberId"],
      },
      {
        fields: ["attendanceStatus"],
      },
      {
        unique: true,
        fields: ["classId", "memberId"],
        name: "unique_class_member",
      },
    ],
  }
);

module.exports = ClassEnrollment;

