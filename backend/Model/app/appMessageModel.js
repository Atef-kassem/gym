const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const AppMessage = sequelize.define(
  "AppMessage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    notificationType: {
      type: DataTypes.ENUM(
        "news",
        "offer",
        "subscription",
        "trainer",
        "exercise",
        "ad",
        "invitation",
        "system",
        "other"
      ),
      allowNull: false,
      defaultValue: "other",
      comment: "نوع الإشعار: خبر جديد، عرض جديد، اشتراك جديد، إلخ",
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "معرف المستخدم الذي سيستلم الإشعار (Member ID)",
    },
    receiverType: {
      type: DataTypes.ENUM("employee", "member", "all"),
      allowNull: false,
      defaultValue: "member",
      comment: "نوع المستلم: موظف، عضو، أو الكل",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "عنوان الإشعار",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "محتوى الإشعار",
    },
    relatedItemId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "معرف العنصر المرتبط (مثل: معرف الخبر، معرف العرض، إلخ)",
    },
    relatedItemType: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "نوع العنصر المرتبط (مثل: AppNews، AppOffer، إلخ)",
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "رابط صورة الإشعار (اختياري)",
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "هل تم قراءة الإشعار",
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "وقت قراءة الإشعار",
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "هل تم حذف الإشعار",
    },
    priority: {
      type: DataTypes.ENUM("low", "normal", "high"),
      allowNull: false,
      defaultValue: "normal",
      comment: "أولوية الإشعار",
    },
  },
  {
    tableName: "AppMessages",
    timestamps: true,
  }
);

module.exports = AppMessage;

