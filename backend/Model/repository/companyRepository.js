const { Company, CompanyAttachment, CompanyAccount } = require("../index");
const { Op } = require("sequelize");

class CompanyRepository {
  // Get company by ID with attachments and accounts
  async findById(id, options = {}) {
    try {
      const company = await Company.findByPk(id, {
        include: [
          {
            model: CompanyAttachment,
            as: "attachments",
            where: { status: "active" },
            required: false,
          },
          {
            model: CompanyAccount,
            as: "accounts",
            where: { status: "active" },
            required: false,
          },
        ],
        ...options,
      });
      return company;
    } catch (error) {
      throw error;
    }
  }

  // Get company by email
  async findByEmail(email) {
    try {
      const company = await Company.findOne({
        where: { email },
        include: [
          {
            model: CompanyAttachment,
            as: "attachments",
            where: { status: "active" },
            required: false,
          },
        ],
      });
      return company;
    } catch (error) {
      throw error;
    }
  }

  // Create new company
  async create(companyData) {
    try {
      const company = await Company.create(companyData);
      return company;
    } catch (error) {
      throw error;
    }
  }

  // Update company
  async update(id, updateData) {
    try {
      const [updatedCount] = await Company.update(updateData, {
        where: { id },
      });
      
      if (updatedCount === 0) {
        throw new Error("Company not found");
      }
      
      const updatedCompany = await this.findById(id);
      return updatedCompany;
    } catch (error) {
      throw error;
    }
  }

  // Delete company
  async delete(id) {
    try {
      const deletedCount = await Company.destroy({
        where: { id },
      });
      
      if (deletedCount === 0) {
        throw new Error("Company not found");
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get all companies with pagination
  async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        includeAttachments = false,
        includeAccounts = false,
      } = options;

      const where = {};
      if (search) {
        where[Op.or] = [
          { arabicName: { [Op.like]: `%${search}%` } },
          { englishName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ];
      }
      
      if (status) {
        where.status = status;
      }

      const include = [];
      if (includeAttachments) {
        include.push({
          model: CompanyAttachment,
          as: "attachments",
          where: { status: "active" },
          required: false,
        });
      }
      
      if (includeAccounts) {
        include.push({
          model: CompanyAccount,
          as: "accounts",
          where: { status: "active" },
          required: false,
        });
      }

      const { rows, count } = await Company.findAndCountAll({
        where,
        include,
        order: [["createdAt", "DESC"]],
        limit: Number(limit),
        offset: (Number(page) - 1) * Number(limit),
      });

      return {
        companies: rows,
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      };
    } catch (error) {
      throw error;
    }
  }

  // Get company attachments
  async getAttachments(companyId, fileType = null) {
    try {
      const where = {
        company_id: companyId,
        status: "active",
      };
      
      if (fileType) {
        where.file_type = fileType;
      }

      const attachments = await CompanyAttachment.findAll({
        where,
        order: [["createdAt", "DESC"]],
      });
      
      return attachments;
    } catch (error) {
      throw error;
    }
  }

  // Add attachment
  async addAttachment(attachmentData) {
    try {
      const attachment = await CompanyAttachment.create(attachmentData);
      return attachment;
    } catch (error) {
      throw error;
    }
  }

  // Update attachment
  async updateAttachment(id, updateData) {
    try {
      const [updatedCount] = await CompanyAttachment.update(updateData, {
        where: { id },
      });
      
      if (updatedCount === 0) {
        throw new Error("Attachment not found");
      }
      
      const updatedAttachment = await CompanyAttachment.findByPk(id);
      return updatedAttachment;
    } catch (error) {
      throw error;
    }
  }

  // Delete attachment
  async deleteAttachment(id) {
    try {
      const [updatedCount] = await CompanyAttachment.update(
        { status: "deleted" },
        { where: { id } }
      );
      
      if (updatedCount === 0) {
        throw new Error("Attachment not found");
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get company account
  async getAccount(companyId) {
    try {
      const account = await CompanyAccount.findOne({
        where: { company_id: companyId, status: "active" },
      });
      return account;
    } catch (error) {
      throw error;
    }
  }

  // Create or update account
  async upsertAccount(accountData) {
    try {
      const [account, created] = await CompanyAccount.findOrCreate({
        where: { company_id: accountData.company_id },
        defaults: accountData,
      });

      if (!created) {
        await account.update(accountData);
      }

      return account;
    } catch (error) {
      throw error;
    }
  }

  // Update account password
  async updatePassword(companyId, newPasswordHash) {
    try {
      const [updatedCount] = await CompanyAccount.update(
        {
          password_hash: newPasswordHash,
          password_changed_at: new Date(),
        },
        {
          where: { company_id: companyId },
        }
      );
      
      if (updatedCount === 0) {
        throw new Error("Account not found");
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get company by commercial register
  async findByCommercialRegister(commercialRegister) {
    try {
      const company = await Company.findOne({
        where: { commercialRegistrationNumber: commercialRegister },
      });
      return company;
    } catch (error) {
      throw error;
    }
  }

  // Get company by tax number
  async findByTaxNumber(taxNumber) {
    try {
      const company = await Company.findOne({
        where: { taxRegistrationNumber: taxNumber },
      });
      return company;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CompanyRepository();
