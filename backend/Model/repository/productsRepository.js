const { Op } = require("sequelize");
const { productsSchema } = require("../index");

class ProductsRepository {
  async create(productData) {
    try {
      const product = await productsSchema.create(productData);
      return product;
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  async findById(productId) {
    try {
      const product = await productsSchema.findByPk(productId, {
        include: [
          { model: require("../index").categoriesSchema, as: "category" },
          { model: require("../index").brandsSchema, as: "brand" },
          { model: require("../index").manufacturersSchema, as: "manufacturer" },
          { model: require("../index").suppliersSchema, as: "supplier" },
          {
            model: require("../index").warehousesSchema,
            as: "warehouses",
            through: { attributes: [] }
          }
        ],
      });
      return product;
    } catch (error) {
      throw new Error(`Error finding product: ${error.message}`);
    }
  }

  async findByBarcode(barcode) {
    try {
      const product = await productsSchema.findOne({
        where: { barcode },
        include: [
          { model: require("../index").categoriesSchema, as: "category" },
          { model: require("../index").brandsSchema, as: "brand" },
          { model: require("../index").manufacturersSchema, as: "manufacturer" },
          { model: require("../index").suppliersSchema, as: "supplier" },
          {
            model: require("../index").warehousesSchema,
            as: "warehouses",
            through: { attributes: [] }
          }
        ],
      });
      return product;
    } catch (error) {
      throw new Error(`Error finding product by barcode: ${error.message}`);
    }
  }

  async findBySku(sku) {
    try {
      if (!sku) {
        return null;
      }
      const product = await productsSchema.findOne({
        where: { product_id: sku },
        include: [
          { model: require("../index").categoriesSchema, as: "category" },
          { model: require("../index").brandsSchema, as: "brand" },
          { model: require("../index").manufacturersSchema, as: "manufacturer" },
          { model: require("../index").suppliersSchema, as: "supplier" },
          {
            model: require("../index").warehousesSchema,
            as: "warehouses",
            through: { attributes: [] }
          }
        ],
      });
      return product;
    } catch (error) {
      throw new Error(`Error finding product by SKU: ${error.message}`);
    }
  }

  async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        categoryId,
        brandId,
        status,
        warehouseId,
        expiryDate,
        batchNumber,
        sortBy = "created_at",
        sortOrder = "DESC",
      } = options;

      const offset = (page - 1) * limit;
      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [
          { name_ar: { [Op.like]: `%${search}%` } },
          { name_en: { [Op.like]: `%${search}%` } },
          { product_id: { [Op.like]: `%${search}%` } },
        ];
      }

      if (categoryId) {
        whereClause.category_id = categoryId;
      }

      if (brandId) {
        whereClause.brand_id = brandId;
      }

      if (status) {
        whereClause.status = status;
      }

      if (expiryDate) {
        whereClause.expiry_date = {
          [Op.lte]: expiryDate
        };
      }

      if (batchNumber) {
        whereClause.batch_number = batchNumber;
      }

      const includeOptions = [
        { model: require("../index").categoriesSchema, as: "category" },
        { model: require("../index").brandsSchema, as: "brand" },
        { model: require("../index").manufacturersSchema, as: "manufacturer" },
        { model: require("../index").suppliersSchema, as: "supplier" },
      ];

      if (warehouseId) {
        includeOptions.push({
          model: require("../index").warehousesSchema,
          as: "warehouses",
          where: { warehouse_id: warehouseId },
          through: { attributes: [] }
        });
      } else {
        includeOptions.push({
          model: require("../index").warehousesSchema,
          as: "warehouses",
          through: { attributes: [] }
        });
      }

      const { count, rows } = await productsSchema.findAndCountAll({
        where: whereClause,
        include: includeOptions,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        products: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding products: ${error.message}`);
    }
  }

  async update(productId, updateData) {
    try {
      const [updatedRows] = await productsSchema.update(updateData, {
        where: { product_id: productId },
      });

      if (updatedRows === 0) {
        return null;
      }

      return await this.findById(productId);
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  async delete(productId) {
    try {
      const deletedRows = await productsSchema.destroy({
        where: { product_id: productId },
      });

      return deletedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }

  async exists(productId) {
    try {
      const count = await productsSchema.count({
        where: { product_id: productId },
      });
      return count > 0;
    } catch (error) {
      throw new Error(`Error checking product existence: ${error.message}`);
    }
  }

  async getLowStockProducts(threshold = 10) {
    try {
      const products = await productsSchema.findAll({
        include: [
          {
            model: require("../index").inventorySchema,
            as: "inventory",
            where: {
              current_stock: {
                [Op.lte]: threshold,
              },
            },
          },
        ],
      });
      return products;
    } catch (error) {
      throw new Error(`Error getting low stock products: ${error.message}`);
    }
  }

  async getProductsByBranch(branchId) {
    try {
      const products = await productsSchema.findAll({
        include: [
          {
            model: require("../index").brandsSchema,
            as: "branches",
            where: { branch_id: branchId },
            through: { attributes: ["stock_quantity"] },
          },
        ],
      });
      return products;
    } catch (error) {
      throw new Error(`Error getting products by branch: ${error.message}`);
    }
  }

  async addProductToWarehouse(productId, warehouseId) {
    try {
      const product = await productsSchema.findByPk(productId);
      const warehouse = await require("../index").warehousesSchema.findByPk(warehouseId);
      
      if (!product || !warehouse) {
        throw new Error("Product or warehouse not found");
      }

      await product.addWarehouse(warehouse);
      return await this.findById(productId);
    } catch (error) {
      throw new Error(`Error adding product to warehouse: ${error.message}`);
    }
  }

  async removeProductFromWarehouse(productId, warehouseId) {
    try {
      const product = await productsSchema.findByPk(productId);
      const warehouse = await require("../index").warehousesSchema.findByPk(warehouseId);
      
      if (!product || !warehouse) {
        throw new Error("Product or warehouse not found");
      }

      await product.removeWarehouse(warehouse);
      return await this.findById(productId);
    } catch (error) {
      throw new Error(`Error removing product from warehouse: ${error.message}`);
    }
  }

  async getProductsByWarehouse(warehouseId) {
    try {
      const products = await productsSchema.findAll({
        include: [
          {
            model: require("../index").warehousesSchema,
            as: "warehouses",
            where: { warehouse_id: warehouseId },
            through: { attributes: [] }
          }
        ],
      });
      return products;
    } catch (error) {
      throw new Error(`Error getting products by warehouse: ${error.message}`);
    }
  }

  async getExpiringProducts(days = 30) {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + days);

      const products = await productsSchema.findAll({
        where: {
          expiry_date: {
            [Op.lte]: expiryDate,
            [Op.gte]: new Date()
          }
        },
        include: [
          { model: require("../index").categoriesSchema, as: "category" },
          { model: require("../index").brandsSchema, as: "brand" }
        ],
      });
      return products;
    } catch (error) {
      throw new Error(`Error getting expiring products: ${error.message}`);
    }
  }

  async getProductsByBatch(batchNumber) {
    try {
      const products = await productsSchema.findAll({
        where: { batch_number: batchNumber },
        include: [
          { model: require("../index").categoriesSchema, as: "category" },
          { model: require("../index").brandsSchema, as: "brand" }
        ],
      });
      return products;
    } catch (error) {
      throw new Error(`Error getting products by batch: ${error.message}`);
    }
  }

  async findByCategory(categoryId) {
    try {
      const products = await productsSchema.findAll({
        where: { category_id: categoryId },
        include: [
          { model: require("../index").categoriesSchema, as: "category" },
          { model: require("../index").brandsSchema, as: "brand" }
        ],
      });
      return products;
    } catch (error) {
      throw new Error(`Error finding products by category: ${error.message}`);
    }
  }

  async findByBrand(brandId) {
    try {
      const products = await productsSchema.findAll({
        where: { brand_id: brandId },
        include: [
          { model: require("../index").categoriesSchema, as: "category" },
          { model: require("../index").brandsSchema, as: "brand" }
        ],
      });
      return products;
    } catch (error) {
      throw new Error(`Error finding products by brand: ${error.message}`);
    }
  }

  async search(query) {
    try {
      const products = await productsSchema.findAll({
        where: {
          [Op.or]: [
            { name_ar: { [Op.like]: `%${query}%` } },
            { name_en: { [Op.like]: `%${query}%` } },
            { product_id: { [Op.like]: `%${query}%` } },
            { barcode: { [Op.like]: `%${query}%` } }
          ]
        },
        include: [
          { model: require("../index").categoriesSchema, as: "category" },
          { model: require("../index").brandsSchema, as: "brand" }
        ],
      });
      return products;
    } catch (error) {
      throw new Error(`Error searching products: ${error.message}`);
    }
  }
}

module.exports = new ProductsRepository();
