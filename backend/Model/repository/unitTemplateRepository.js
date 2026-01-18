const { Op } = require("sequelize");
const { unitTemplateSchema, unitConversionSchema } = require("../index");

class UnitTemplateRepository {
  async create(templateData) {
    try {
      const { conversions, ...templateFields } = templateData;
      
      // Create template
      const template = await unitTemplateSchema.create(templateFields);
      
      // Create conversions if provided
      if (conversions && conversions.length > 0) {
        const conversionData = conversions.map((conv, index) => ({
          template_id: template.template_id,
          from_unit: conv.fromUnit,
          to_unit: conv.toUnit,
          factor: conv.factor,
          formula: conv.formula,
          sort_order: index + 1,
        }));
        
        await unitConversionSchema.bulkCreate(conversionData);
      }
      
      return await this.findById(template.template_id);
    } catch (error) {
      throw new Error(`Error creating unit template: ${error.message}`);
    }
  }

  async findById(templateId) {
    try {
      const template = await unitTemplateSchema.findByPk(templateId, {
        include: [
          {
            model: unitConversionSchema,
            as: "conversions",
            order: [["sort_order", "ASC"]],
          },
        ],
      });
      return template;
    } catch (error) {
      throw new Error(`Error finding unit template: ${error.message}`);
    }
  }

  async findAll(options = {}) {
    try {
      const { page = 1, limit = 10, search = "", category, isActive, sortBy = "name_en", sortOrder = "ASC" } = options;

      const offset = (page - 1) * limit;
      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [
          { name_ar: { [Op.like]: `%${search}%` } },
          { name_en: { [Op.like]: `%${search}%` } },
          { code: { [Op.like]: `%${search}%` } },
        ];
      }

      if (category) {
        whereClause.category = category;
      }

      if (isActive !== undefined) {
        whereClause.is_active = isActive;
      }

      const { count, rows } = await unitTemplateSchema.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: unitConversionSchema,
            as: "conversions",
            order: [["sort_order", "ASC"]],
          },
        ],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        templates: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding unit templates: ${error.message}`);
    }
  }

  async update(templateId, updateData) {
    try {
      const { conversions, ...templateFields } = updateData;
      
      // Update template
      const [updatedRows] = await unitTemplateSchema.update(templateFields, {
        where: { template_id: templateId },
      });

      if (updatedRows === 0) {
        return null;
      }

      // Update conversions if provided
      if (conversions) {
        // Delete existing conversions
        await unitConversionSchema.destroy({
          where: { template_id: templateId },
        });

        // Create new conversions
        if (conversions.length > 0) {
          const conversionData = conversions.map((conv, index) => ({
            template_id: templateId,
            from_unit: conv.fromUnit,
            to_unit: conv.toUnit,
            factor: conv.factor,
            formula: conv.formula,
            sort_order: index + 1,
          }));
          
          await unitConversionSchema.bulkCreate(conversionData);
        }
      }

      return await this.findById(templateId);
    } catch (error) {
      throw new Error(`Error updating unit template: ${error.message}`);
    }
  }

  async delete(templateId) {
    try {
      // Delete conversions first
      await unitConversionSchema.destroy({
        where: { template_id: templateId },
      });

      // Delete template
      const deletedRows = await unitTemplateSchema.destroy({
        where: { template_id: templateId },
      });

      return deletedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting unit template: ${error.message}`);
    }
  }

  async findByCategory(category) {
    try {
      return await unitTemplateSchema.findAll({
        where: { category, is_active: true },
        include: [
          {
            model: unitConversionSchema,
            as: "conversions",
            order: [["sort_order", "ASC"]],
          },
        ],
        order: [["name_en", "ASC"]],
      });
    } catch (error) {
      throw new Error(`Error finding unit templates by category: ${error.message}`);
    }
  }

  async getActiveTemplates() {
    try {
      return await unitTemplateSchema.findAll({
        where: { is_active: true },
        include: [
          {
            model: unitConversionSchema,
            as: "conversions",
            order: [["sort_order", "ASC"]],
          },
        ],
        order: [["name_en", "ASC"]],
      });
    } catch (error) {
      throw new Error(`Error finding active unit templates: ${error.message}`);
    }
  }

  async incrementUsageCount(templateId) {
    try {
      await unitTemplateSchema.increment("usage_count", {
        where: { template_id: templateId },
      });
    } catch (error) {
      throw new Error(`Error incrementing usage count: ${error.message}`);
    }
  }
}

module.exports = new UnitTemplateRepository();
