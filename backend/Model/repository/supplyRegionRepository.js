const { Op } = require("sequelize");
const sequelize = require("../../Config/sequelize");
const SupplyRegion = require("../schema/supplyRegionSchema");

class SupplyRegionRepository {
  async create(regionData) {
    try {
      const region = await SupplyRegion.create(regionData);
      return region;
    } catch (error) {
      throw new Error(`Error creating supply region: ${error.message}`);
    }
  }

  async findAll(filters = {}) {
    try {
      const whereClause = {};

      if (filters.active !== undefined) {
        whereClause.active = filters.active;
      }

      if (filters.country && filters.country !== "all") {
        whereClause.country = filters.country;
      }

      if (filters.city && filters.city !== "all") {
        whereClause.city = filters.city;
      }

      if (filters.searchTerm) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${filters.searchTerm}%` } },
          { description: { [Op.like]: `%${filters.searchTerm}%` } },
          { city: { [Op.like]: `%${filters.searchTerm}%` } },
        ];
      }

      const regions = await SupplyRegion.findAll({
        where: whereClause,
        order: [["created_at", "DESC"]],
      });

      return regions;
    } catch (error) {
      throw new Error(`Error fetching supply regions: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const region = await SupplyRegion.findByPk(id);

      if (!region) {
        throw new Error("Supply region not found");
      }

      return region;
    } catch (error) {
      throw new Error(`Error fetching supply region: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      const [updatedRows] = await SupplyRegion.update(updateData, {
        where: { id },
      });

      if (updatedRows === 0) {
        throw new Error("Supply region not found");
      }

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating supply region: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const deletedRows = await SupplyRegion.destroy({
        where: { id },
      });

      if (deletedRows === 0) {
        throw new Error("Supply region not found");
      }

      return true;
    } catch (error) {
      throw new Error(`Error deleting supply region: ${error.message}`);
    }
  }

  async toggleStatus(id) {
    try {
      const region = await this.findById(id);
      const newStatus = !region.active;
      
      return await this.update(id, { active: newStatus });
    } catch (error) {
      throw new Error(`Error toggling supply region status: ${error.message}`);
    }
  }

  async addBranch(id, branchName) {
    try {
      const region = await this.findById(id);
      const branches = [...region.branches, branchName];
      
      return await this.update(id, { branches });
    } catch (error) {
      throw new Error(`Error adding branch to supply region: ${error.message}`);
    }
  }

  async removeBranch(id, branchIndex) {
    try {
      const region = await this.findById(id);
      const branches = region.branches.filter((_, index) => index !== branchIndex);
      
      return await this.update(id, { branches });
    } catch (error) {
      throw new Error(`Error removing branch from supply region: ${error.message}`);
    }
  }

  async getActiveRegions() {
    try {
      const regions = await SupplyRegion.findAll({
        where: { active: true },
        order: [["name", "ASC"]],
      });

      return regions;
    } catch (error) {
      throw new Error(`Error fetching active supply regions: ${error.message}`);
    }
  }

  async getRegionsByCountry(country) {
    try {
      const regions = await SupplyRegion.findAll({
        where: { 
          country,
          active: true 
        },
        order: [["city", "ASC"], ["name", "ASC"]],
      });

      return regions;
    } catch (error) {
      throw new Error(`Error fetching supply regions by country: ${error.message}`);
    }
  }

  async getStatistics() {
    try {
      const stats = await SupplyRegion.findAll({
        attributes: [
          [sequelize.fn("COUNT", sequelize.col("id")), "totalRegions"],
          [
            sequelize.fn("SUM", sequelize.literal("CASE WHEN active = true THEN 1 ELSE 0 END")),
            "activeRegions",
          ],
          [
            sequelize.fn("SUM", sequelize.literal("CASE WHEN active = false THEN 1 ELSE 0 END")),
            "inactiveRegions",
          ],
          [sequelize.fn("COUNT", sequelize.fn("DISTINCT", sequelize.col("country"))), "totalCountries"],
          [sequelize.fn("COUNT", sequelize.fn("DISTINCT", sequelize.col("city"))), "totalCities"],
        ],
        raw: true,
      });

      return stats[0];
    } catch (error) {
      throw new Error(`Error fetching supply region statistics: ${error.message}`);
    }
  }
}

module.exports = new SupplyRegionRepository();
