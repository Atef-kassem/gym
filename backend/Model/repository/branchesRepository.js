const { Branch } = require("../index");

class BranchesRepository {
  async findById(branchId) {
    try {
      return await Branch.findByPk(branchId);
    } catch (error) {
      throw new Error(`Error finding branch: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await Branch.findAll();
    } catch (error) {
      throw new Error(`Error finding branches: ${error.message}`);
    }
  }
}

module.exports = new BranchesRepository();
