const catchAsync = require("./catchAsync");
const { Op } = require("sequelize");
const { Product } = require("../Model");
const AppError = require("./appError");
const { sequelize } = require("../Config/dbConfig");
const findProductsWithCost = async (consumedProducts) => {
  const transaction = await sequelize.transaction();
  try {
    // TODO 1. Validate and get products with current costs
    const productIds = consumedProducts.map((cp) => cp.id);
    const products = await Product.findAll({
      where: {
        id: { [Op.in]: productIds },
        isActive: true,
      },
      attributes: ["id", "cost", "name"],
      transaction,
    });

    if (products.length !== productIds.length) {
      throw new AppError("Some products not found or inactive", 404);
    }
    return products;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = findProductsWithCost;
