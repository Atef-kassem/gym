const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/sequelize");

const CompanyAttachment = sequelize.define(
  "CompanyAttachment",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "company_id",
    },
    file_type: {
      type: DataTypes.ENUM(
        "logo",
        "commercial_register",
        "tax_certificate",
        "business_license",
        "quality_certificate",
        "high_quality_logo",
        "facility_images",
        "other_attachments",
        "digital_signature"
      ),
      allowNull: false,
      field: "file_type",
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "file_name",
    },
    original_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "original_name",
    },
    file_path: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: "file_path",
    },
    file_size: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "file_size",
    },
    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "mime_type",
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "deleted"),
      defaultValue: "active",
      field: "status",
    },
  },
  {
    tableName: "CompanyAttachments",
    timestamps: true,
    underscored: true,
  }
);

module.exports = CompanyAttachment;
