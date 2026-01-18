const { Op } = require("sequelize");
const sequelize = require("../../Config/sequelize");
const DropdownDefinition = require("../schema/dropdownDefinitionSchema");

class DropdownDefinitionRepository {
  async create(definitionData) {
    try {
      const definition = await DropdownDefinition.create(definitionData);
      return definition;
    } catch (error) {
      throw new Error(`Error creating dropdown definition: ${error.message}`);
    }
  }

  async findAll(filters = {}) {
    try {
      const whereClause = {};

      if (filters.category && filters.category !== "all") {
        whereClause.category = filters.category;
      }

      if (filters.active !== undefined) {
        whereClause.active = filters.active;
      }

      if (filters.searchTerm) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${filters.searchTerm}%` } },
          { description: { [Op.like]: `%${filters.searchTerm}%` } },
        ];
      }

      const definitions = await DropdownDefinition.findAll({
        where: whereClause,
        order: [["created_at", "DESC"]],
      });

      return definitions;
    } catch (error) {
      throw new Error(`Error fetching dropdown definitions: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const definition = await DropdownDefinition.findByPk(id);

      if (!definition) {
        throw new Error("Dropdown definition not found");
      }

      return definition;
    } catch (error) {
      throw new Error(`Error fetching dropdown definition: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      const [updatedRows] = await DropdownDefinition.update(updateData, {
        where: { id },
      });

      if (updatedRows === 0) {
        throw new Error("Dropdown definition not found");
      }

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating dropdown definition: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const deletedRows = await DropdownDefinition.destroy({
        where: { id },
      });

      if (deletedRows === 0) {
        throw new Error("Dropdown definition not found");
      }

      return true;
    } catch (error) {
      throw new Error(`Error deleting dropdown definition: ${error.message}`);
    }
  }

  async addValue(id, value) {
    try {
      const definition = await this.findById(id);
      const values = [...definition.values, value];
      
      return await this.update(id, { values });
    } catch (error) {
      throw new Error(`Error adding value to dropdown definition: ${error.message}`);
    }
  }

  async removeValue(id, valueIndex) {
    try {
      const definition = await this.findById(id);
      const values = definition.values.filter((_, index) => index !== valueIndex);
      
      return await this.update(id, { values });
    } catch (error) {
      throw new Error(`Error removing value from dropdown definition: ${error.message}`);
    }
  }

  async toggleStatus(id) {
    try {
      const definition = await this.findById(id);
      const newStatus = !definition.active;
      
      return await this.update(id, { active: newStatus });
    } catch (error) {
      throw new Error(`Error toggling dropdown definition status: ${error.message}`);
    }
  }

  async getByCategory(category) {
    try {
      const definitions = await DropdownDefinition.findAll({
        where: { 
          category,
          active: true 
        },
        order: [["name", "ASC"]],
      });

      return definitions;
    } catch (error) {
      throw new Error(`Error fetching dropdown definitions by category: ${error.message}`);
    }
  }

  async getStatistics() {
    try {
      const stats = await DropdownDefinition.findAll({
        attributes: [
          [sequelize.fn("COUNT", sequelize.col("id")), "totalDefinitions"],
          [
            sequelize.fn("SUM", sequelize.literal("CASE WHEN active = true THEN 1 ELSE 0 END")),
            "activeDefinitions",
          ],
          [
            sequelize.fn("SUM", sequelize.literal("CASE WHEN active = false THEN 1 ELSE 0 END")),
            "inactiveDefinitions",
          ],
        ],
        raw: true,
      });

      return stats[0];
    } catch (error) {
      throw new Error(`Error fetching dropdown definition statistics: ${error.message}`);
    }
  }
}

module.exports = new DropdownDefinitionRepository();
