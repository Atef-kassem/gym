const { Op } = require("sequelize");
const { Product, Category, Brand, Manufacturer, Supplier, Warehouse, Inventory, ProductBranch } = require("../index");

class UnifiedRepository {
  async createProduct(productData) {
    try {
      return await Product.create(productData);
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  async getProductById(productId) {
    try {
      return await Product.findByPk(productId, {
        include: [
          { model: Category, as: "category" },
          { model: Brand, as: "brand" },
          { model: Manufacturer, as: "manufacturer" },
          { model: Supplier, as: "supplier" },
        ],
      });
    } catch (error) {
      throw new Error(`Error finding product: ${error.message}`);
    }
  }

  async getAllProducts(options = {}) {
    try {
      const { page = 1, limit = 10, search = "", categoryId, brandId, status } = options;

      const offset = (page - 1) * limit;
      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [
          { name_ar: { [Op.like]: `%${search}%` } },
          { name_en: { [Op.like]: `%${search}%` } },
          { product_id: { [Op.like]: `%${search}%` } },
        ];
      }

      if (categoryId) whereClause.category_id = categoryId;
      if (brandId) whereClause.brand_id = brandId;
      if (status) whereClause.status = status;

      const { count, rows } = await Product.findAndCountAll({
        where: whereClause,
        include: [
          { model: Category, as: "category" },
          { model: Brand, as: "brand" },
          { model: Manufacturer, as: "manufacturer" },
          { model: Supplier, as: "supplier" },
        ],
        order: [["created_at", "DESC"]],
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

  async updateProduct(productId, updateData) {
    try {
      const [updatedRows] = await Product.update(updateData, {
        where: { product_id: productId },
      });
      return updatedRows > 0 ? await this.getProductById(productId) : null;
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  async deleteProduct(productId) {
    try {
      const deletedRows = await Product.destroy({
        where: { product_id: productId },
      });
      return deletedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }

  async createCategory(categoryData) {
    try {
      return await Category.create(categoryData);
    } catch (error) {
      throw new Error(`Error creating category: ${error.message}`);
    }
  }

  async getCategoryById(categoryId) {
    try {
      return await Category.findByPk(categoryId, {
        include: [
          { model: Category, as: "parent" },
          { model: Product, as: "products" },
        ],
      });
    } catch (error) {
      throw new Error(`Error finding category: ${error.message}`);
    }
  }

  async getAllCategories(options = {}) {
    try {
      const { page = 1, limit = 10, parentId } = options;
      const offset = (page - 1) * limit;
      const whereClause = {};

      if (parentId) whereClause.parent_category_id = parentId;

      const { count, rows } = await Category.findAndCountAll({
        where: whereClause,
        include: [
          { model: Category, as: "parent" },
          { model: Category, as: "children" },
        ],
        order: [["name_en", "ASC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        categories: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding categories: ${error.message}`);
    }
  }

  async updateCategory(categoryId, updateData) {
    try {
      const [updatedRows] = await Category.update(updateData, {
        where: { category_id: categoryId },
      });
      return updatedRows > 0 ? await this.getCategoryById(categoryId) : null;
    } catch (error) {
      throw new Error(`Error updating category: ${error.message}`);
    }
  }

  async deleteCategory(categoryId) {
    try {
      const deletedRows = await Category.destroy({
        where: { category_id: categoryId },
      });
      return deletedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting category: ${error.message}`);
    }
  }

  async createBrand(brandData) {
    try {
      return await Brand.create(brandData);
    } catch (error) {
      throw new Error(`Error creating brand: ${error.message}`);
    }
  }

  async getBrandById(brandId) {
    try {
      return await Brand.findByPk(brandId, {
        include: [{ model: Product, as: "products" }],
      });
    } catch (error) {
      throw new Error(`Error finding brand: ${error.message}`);
    }
  }

  async getAllBrands(options = {}) {
    try {
      const { page = 1, limit = 10, search = "" } = options;
      const offset = (page - 1) * limit;
      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [{ name_ar: { [Op.like]: `%${search}%` } }, { name_en: { [Op.like]: `%${search}%` } }];
      }

      const { count, rows } = await Brand.findAndCountAll({
        where: whereClause,
        include: [{ model: Product, as: "products" }],
        order: [["name_en", "ASC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        brands: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding brands: ${error.message}`);
    }
  }

  async updateBrand(brandId, updateData) {
    try {
      const [updatedRows] = await Brand.update(updateData, {
        where: { brand_id: brandId },
      });
      return updatedRows > 0 ? await this.getBrandById(brandId) : null;
    } catch (error) {
      throw new Error(`Error updating brand: ${error.message}`);
    }
  }

  async deleteBrand(brandId) {
    try {
      const deletedRows = await Brand.destroy({
        where: { brand_id: brandId },
      });
      return deletedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting brand: ${error.message}`);
    }
  }

  async createManufacturer(manufacturerData) {
    try {
      return await Manufacturer.create(manufacturerData);
    } catch (error) {
      throw new Error(`Error creating manufacturer: ${error.message}`);
    }
  }

  async getManufacturerById(manufacturerId) {
    try {
      return await Manufacturer.findByPk(manufacturerId, {
        include: [{ model: Product, as: "products" }],
      });
    } catch (error) {
      throw new Error(`Error finding manufacturer: ${error.message}`);
    }
  }

  async getAllManufacturers(options = {}) {
    try {
      const { page = 1, limit = 10, search = "" } = options;
      const offset = (page - 1) * limit;
      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [{ name_ar: { [Op.like]: `%${search}%` } }, { name_en: { [Op.like]: `%${search}%` } }];
      }

      const { count, rows } = await Manufacturer.findAndCountAll({
        where: whereClause,
        include: [{ model: Product, as: "products" }],
        order: [["name_en", "ASC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        manufacturers: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding manufacturers: ${error.message}`);
    }
  }

  async updateManufacturer(manufacturerId, updateData) {
    try {
      const [updatedRows] = await Manufacturer.update(updateData, {
        where: { manufacturer_id: manufacturerId },
      });
      return updatedRows > 0 ? await this.getManufacturerById(manufacturerId) : null;
    } catch (error) {
      throw new Error(`Error updating manufacturer: ${error.message}`);
    }
  }

  async deleteManufacturer(manufacturerId) {
    try {
      const deletedRows = await Manufacturer.destroy({
        where: { manufacturer_id: manufacturerId },
      });
      return deletedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting manufacturer: ${error.message}`);
    }
  }

  async createSupplier(supplierData) {
    try {
      return await Supplier.create(supplierData);
    } catch (error) {
      throw new Error(`Error creating supplier: ${error.message}`);
    }
  }

  async getSupplierById(supplierId) {
    try {
      return await Supplier.findByPk(supplierId, {
        include: [{ model: Product, as: "products" }],
      });
    } catch (error) {
      throw new Error(`Error finding supplier: ${error.message}`);
    }
  }

  async getAllSuppliers(options = {}) {
    try {
      const { page = 1, limit = 10, search = "" } = options;
      const offset = (page - 1) * limit;
      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [{ name_ar: { [Op.like]: `%${search}%` } }, { name_en: { [Op.like]: `%${search}%` } }];
      }

      const { count, rows } = await Supplier.findAndCountAll({
        where: whereClause,
        include: [{ model: Product, as: "products" }],
        order: [["name_en", "ASC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        suppliers: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding suppliers: ${error.message}`);
    }
  }

  async updateSupplier(supplierId, updateData) {
    try {
      const [updatedRows] = await Supplier.update(updateData, {
        where: { supplier_id: supplierId },
      });
      return updatedRows > 0 ? await this.getSupplierById(supplierId) : null;
    } catch (error) {
      throw new Error(`Error updating supplier: ${error.message}`);
    }
  }

  async deleteSupplier(supplierId) {
    try {
      const deletedRows = await Supplier.destroy({
        where: { supplier_id: supplierId },
      });
      return deletedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting supplier: ${error.message}`);
    }
  }

  async createWarehouse(warehouseData) {
    try {
      return await Warehouse.create(warehouseData);
    } catch (error) {
      throw new Error(`Error creating warehouse: ${error.message}`);
    }
  }

  async getWarehouseById(warehouseId) {
    try {
      return await Warehouse.findByPk(warehouseId, {
        include: [{ model: Inventory, as: "inventories" }],
      });
    } catch (error) {
      throw new Error(`Error finding warehouse: ${error.message}`);
    }
  }

  async getAllWarehouses(options = {}) {
    try {
      const { page = 1, limit = 10, search = "", branchId } = options;
      const offset = (page - 1) * limit;
      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [
          { name_ar: { [Op.like]: `%${search}%` } },
          { name_en: { [Op.like]: `%${search}%` } },
          { warehouse_code: { [Op.like]: `%${search}%` } },
        ];
      }

      if (branchId) whereClause.branch_id = branchId;

      const { count, rows } = await Warehouse.findAndCountAll({
        where: whereClause,
        include: [{ model: Inventory, as: "inventories" }],
        order: [["name_en", "ASC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        warehouses: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding warehouses: ${error.message}`);
    }
  }

  async updateWarehouse(warehouseId, updateData) {
    try {
      const [updatedRows] = await Warehouse.update(updateData, {
        where: { warehouse_id: warehouseId },
      });
      return updatedRows > 0 ? await this.getWarehouseById(warehouseId) : null;
    } catch (error) {
      throw new Error(`Error updating warehouse: ${error.message}`);
    }
  }

  async deleteWarehouse(warehouseId) {
    try {
      const deletedRows = await Warehouse.destroy({
        where: { warehouse_id: warehouseId },
      });
      return deletedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting warehouse: ${error.message}`);
    }
  }

  async createInventory(inventoryData) {
    try {
      return await Inventory.create(inventoryData);
    } catch (error) {
      throw new Error(`Error creating inventory: ${error.message}`);
    }
  }

  async getInventoryById(inventoryId) {
    try {
      return await Inventory.findByPk(inventoryId, {
        include: [
          { model: Product, as: "product" },
          { model: Warehouse, as: "warehouse" },
        ],
      });
    } catch (error) {
      throw new Error(`Error finding inventory: ${error.message}`);
    }
  }

  async getInventoryByProductAndWarehouse(productId, warehouseId) {
    try {
      return await Inventory.findOne({
        where: { product_id: productId, warehouse_id: warehouseId },
        include: [
          { model: Product, as: "product" },
          { model: Warehouse, as: "warehouse" },
        ],
      });
    } catch (error) {
      throw new Error(`Error finding inventory: ${error.message}`);
    }
  }

  async getAllInventory(options = {}) {
    try {
      const { page = 1, limit = 10, productId, warehouseId, lowStock = false } = options;
      const offset = (page - 1) * limit;
      const whereClause = {};

      if (productId) whereClause.product_id = productId;
      if (warehouseId) whereClause.warehouse_id = warehouseId;
      if (lowStock) {
        whereClause.current_stock = {
          [Op.lte]: Sequelize.col("reorder_point"),
        };
      }

      const { count, rows } = await Inventory.findAndCountAll({
        where: whereClause,
        include: [
          { model: Product, as: "product" },
          { model: Warehouse, as: "warehouse" },
        ],
        order: [["last_updated", "DESC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        inventory: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding inventory: ${error.message}`);
    }
  }

  async updateInventory(inventoryId, updateData) {
    try {
      const [updatedRows] = await Inventory.update(updateData, {
        where: { inventory_id: inventoryId },
      });
      return updatedRows > 0 ? await this.getInventoryById(inventoryId) : null;
    } catch (error) {
      throw new Error(`Error updating inventory: ${error.message}`);
    }
  }

  async updateStock(productId, warehouseId, quantity, operation = "add") {
    try {
      const inventory = await this.getInventoryByProductAndWarehouse(productId, warehouseId);

      if (!inventory) {
        throw new Error("Inventory record not found");
      }

      const newStock = operation === "add" ? inventory.current_stock + quantity : inventory.current_stock - quantity;

      if (newStock < 0) {
        throw new Error("Insufficient stock");
      }

      return await this.updateInventory(inventory.inventory_id, {
        current_stock: newStock,
        last_updated: new Date(),
      });
    } catch (error) {
      throw new Error(`Error updating stock: ${error.message}`);
    }
  }

  async deleteInventory(inventoryId) {
    try {
      const deletedRows = await Inventory.destroy({
        where: { inventory_id: inventoryId },
      });
      return deletedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting inventory: ${error.message}`);
    }
  }

  async createProductBranch(productBranchData) {
    try {
      return await ProductBranch.create(productBranchData);
    } catch (error) {
      throw new Error(`Error creating product branch: ${error.message}`);
    }
  }

  async getProductBranch(productId, branchId) {
    try {
      return await ProductBranch.findOne({
        where: { product_id: productId, branch_id: branchId },
        include: [
          { model: Product, as: "product" },
          { model: require("../index").Branch, as: "branch" },
        ],
      });
    } catch (error) {
      throw new Error(`Error finding product branch: ${error.message}`);
    }
  }

  async getAllProductBranches(options = {}) {
    try {
      const { page = 1, limit = 10, productId, branchId, lowStock = false } = options;
      const offset = (page - 1) * limit;
      const whereClause = {};

      if (productId) whereClause.product_id = productId;
      if (branchId) whereClause.branch_id = branchId;
      if (lowStock) whereClause.stock_quantity = { [Op.lte]: 10 };

      const { count, rows } = await ProductBranch.findAndCountAll({
        where: whereClause,
        include: [
          { model: Product, as: "product" },
          { model: require("../index").Branch, as: "branch" },
        ],
        order: [["last_updated", "DESC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        productBranches: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding product branches: ${error.message}`);
    }
  }

  async updateProductBranch(productId, branchId, updateData) {
    try {
      const [updatedRows] = await ProductBranch.update(updateData, {
        where: { product_id: productId, branch_id: branchId },
      });
      return updatedRows > 0 ? await this.getProductBranch(productId, branchId) : null;
    } catch (error) {
      throw new Error(`Error updating product branch: ${error.message}`);
    }
  }

  async deleteProductBranch(productId, branchId) {
    try {
      const deletedRows = await ProductBranch.destroy({
        where: { product_id: productId, branch_id: branchId },
      });
      return deletedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting product branch: ${error.message}`);
    }
  }

  async getProductsWithStockDetails(productId = null) {
    try {
      const whereClause = productId ? { product_id: productId } : {};

      return await Product.findAll({
        where: whereClause,
        include: [
          { model: Category, as: "category" },
          { model: Brand, as: "brand" },
          { model: Manufacturer, as: "manufacturer" },
          { model: Supplier, as: "supplier" },
          {
            model: Inventory,
            as: "inventories",
            include: [{ model: Warehouse, as: "warehouse" }],
          },
          {
            model: require("../index").Branch,
            as: "branches",
            through: { attributes: ["stock_quantity"] },
          },
        ],
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error getting products with stock details: ${error.message}`);
    }
  }

  async getLowStockItems(threshold = 10) {
    try {
      return await Inventory.findAll({
        where: {
          current_stock: {
            [Op.lte]: Sequelize.col("reorder_point"),
          },
        },
        include: [
          { model: Product, as: "product" },
          { model: Warehouse, as: "warehouse" },
        ],
        order: [["current_stock", "ASC"]],
      });
    } catch (error) {
      throw new Error(`Error getting low stock items: ${error.message}`);
    }
  }

  async getStockValueByWarehouse() {
    try {
      return await Inventory.findAll({
        attributes: [
          "warehouse_id",
          [Sequelize.fn("SUM", Sequelize.col("current_stock")), "total_quantity"],
          [Sequelize.fn("SUM", Sequelize.literal("current_stock * product.cost_price")), "total_value"],
        ],
        include: [{ model: Warehouse, as: "warehouse" }],
        group: ["warehouse_id", "warehouse.warehouse_id"],
        order: [["total_value", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error getting stock value by warehouse: ${error.message}`);
    }
  }
}

module.exports = new UnifiedRepository();
