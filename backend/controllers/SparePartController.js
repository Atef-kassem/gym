const SparePart = require("../Model/sparePartModel");
const { Op, col } = require("sequelize");

// Create a new spare part
exports.createSparePart = async (req, res) => {
  try {
    const {
      sparePartCode,
      originalPartNumber,
      alternativePartNumber,
      arabicName,
      englishName,
      mainCategory_Id,
      subCategory_Id,
      partStatus,
      brand,
      manufacturer,
      description,
      compatibleVehicles,
      compatibleYears,
      partLocationInCar,
      warrantyPeriod,
      warrantyType,
      warehouse_id,
      shelfLocation,
      currentStock,
      minimumStock,
      maximumStock,
      reorderPoint,
      costPrice,
      sellingPrice,
      wholesalePrice,
      supplier_id,
      weight,
      material,
      installationDifficulty,
      installationTime,
      requiredTools,
      partImage,
      branch_Id,
    } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!sparePartCode) missingFields.push("sparePartCode");
    if (!arabicName) missingFields.push("arabicName");
    if (!englishName) missingFields.push("englishName");
    if (!mainCategory_Id) missingFields.push("mainCategory_Id");
    if (!subCategory_Id) missingFields.push("subCategory_Id");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Validate foreign key constraints
    const MainCategory = require("../Model/mainCategoryModel");
    const SubCategory = require("../Model/subCategoryModel");
    const warehousesSchema = require("../Model/schema/warehousesSchema");

    const mainCategoryExists = await MainCategory.findByPk(mainCategory_Id);
    if (!mainCategoryExists) {
      return res.status(400).json({
        success: false,
        message: `Invalid mainCategory_Id: ${mainCategory_Id}. Main category does not exist.`,
      });
    }

    const subCategoryExists = await SubCategory.findByPk(subCategory_Id);
    if (!subCategoryExists) {
      return res.status(400).json({
        success: false,
        message: `Invalid subCategory_Id: ${subCategory_Id}. Sub category does not exist.`,
      });
    }

    // Validate warehouse_id if provided
    if (warehouse_id) {
      const warehouseExists = await warehousesSchema.findByPk(warehouse_id);
      if (!warehouseExists) {
        return res.status(400).json({
          success: false,
          message: `Invalid warehouse_id: ${warehouse_id}. Warehouse does not exist.`,
        });
      }
    }

    // Validate supplier_id if provided
    if (supplier_id) {
      const suppliersSchema = require("../Model/schema/suppliersSchema");
      const supplierExists = await suppliersSchema.findByPk(supplier_id);
      if (!supplierExists) {
        return res.status(400).json({
          success: false,
          message: `Invalid supplier_id: ${supplier_id}. Supplier does not exist.`,
        });
      }
    }

    // Check if spare part code already exists
    const existingPart = await SparePart.findOne({ where: { sparePartCode } });
    if (existingPart) {
      return res.status(409).json({
        success: false,
        message: "Spare part code already exists",
      });
    }

    const newSparePart = await SparePart.create({
      sparePartCode,
      originalPartNumber,
      alternativePartNumber,
      arabicName,
      englishName,
      mainCategory_Id,
      subCategory_Id,
      partStatus,
      brand,
      manufacturer,
      description,
      compatibleVehicles,
      compatibleYears,
      partLocationInCar,
      warrantyPeriod,
      warrantyType,
      status: "نشط",
      warehouse_id,
      shelfLocation,
      currentStock: currentStock || 0,
      minimumStock: minimumStock || 0,
      maximumStock,
      reorderPoint,
      costPrice,
      sellingPrice,
      wholesalePrice,
      supplier_id,
      weight,
      material,
      installationDifficulty,
      installationTime,
      requiredTools,
      partImage,
      branch_Id,
    });

    res.status(201).json({
      success: true,
      message: "Spare part created successfully",
      data: newSparePart,
    });
  } catch (error) {
    console.error("Error creating spare part:", error);
    res.status(500).json({
      success: false,
      message: "Error creating spare part",
      error: error.message,
    });
  }
};

// Get all spare parts with pagination and filtering
exports.getAllSpareParts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 100000000,
      search,
      mainCategoryId,
      subCategoryId,
      partStatus,
      brand,
      status,
      branch_Id,
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Add filters
    if (search) {
      whereClause[Op.or] = [
        { sparePartCode: { [Op.like]: `%${search}%` } },
        { arabicName: { [Op.like]: `%${search}%` } },
        { englishName: { [Op.like]: `%${search}%` } },
        { originalPartNumber: { [Op.like]: `%${search}%` } },
        { alternativePartNumber: { [Op.like]: `%${search}%` } },
      ];
    }

    if (mainCategoryId) whereClause.mainCategory_Id = mainCategoryId;
    if (subCategoryId) whereClause.subCategory_Id = subCategoryId;
    if (partStatus) whereClause.partStatus = partStatus;
    if (brand) whereClause.brand = brand;
    if (status) whereClause.status = status;
    if (branch_Id) whereClause.branch_Id = branch_Id;

    const { count, rows } = await SparePart.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
      include: [
        { model: require("../Model/mainCategoryModel"), as: "mainCategory" },
        { model: require("../Model/subCategoryModel"), as: "subCategory" },
      ],
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching spare parts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching spare parts",
      error: error.message,
    });
  }
};

// Get a single spare part by ID
exports.getSparePartById = async (req, res) => {
  try {
    const { id } = req.params;

    const sparePart = await SparePart.findByPk(id, {
      include: [
        { model: require("../Model/mainCategoryModel"), as: "mainCategory" },
        { model: require("../Model/subCategoryModel"), as: "subCategory" },
        { model: require("../Model/schema/suppliersSchema"), as: "supplier" },
      ],
    });

    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: "Spare part not found",
      });
    }

    res.status(200).json({
      success: true,
      data: sparePart,
    });
  } catch (error) {
    console.error("Error fetching spare part:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching spare part",
      error: error.message,
    });
  }
};

// Get spare part by code
exports.getSparePartByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const sparePart = await SparePart.findOne({
      where: { sparePartCode: code },
      include: [
        { model: require("../Model/mainCategoryModel"), as: "mainCategory" },
        { model: require("../Model/subCategoryModel"), as: "subCategory" },
        { model: require("../Model/schema/suppliersSchema"), as: "supplier" },
      ],
    });

    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: "Spare part not found",
      });
    }

    res.status(200).json({
      success: true,
      data: sparePart,
    });
  } catch (error) {
    console.error("Error fetching spare part:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching spare part",
      error: error.message,
    });
  }
};

// Update a spare part
exports.updateSparePart = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const sparePart = await SparePart.findByPk(id);
    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: "Spare part not found",
      });
    }

    // Check if spare part code is being updated and if it already exists
    if (updateData.sparePartCode && updateData.sparePartCode !== sparePart.sparePartCode) {
      const existingPart = await SparePart.findOne({
        where: { sparePartCode: updateData.sparePartCode },
      });
      if (existingPart) {
        return res.status(409).json({
          success: false,
          message: "Spare part code already exists",
        });
      }
    }

    // Validate warehouse_id if being updated
    if (updateData.warehouse_id) {
      const warehousesSchema = require("../Model/schema/warehousesSchema");
      const warehouseExists = await warehousesSchema.findByPk(updateData.warehouse_id);
      if (!warehouseExists) {
        return res.status(400).json({
          success: false,
          message: `Invalid warehouse_id: ${updateData.warehouse_id}. Warehouse does not exist.`,
        });
      }
    }

    // Validate supplier_id if being updated
    if (updateData.supplier_id) {
      const suppliersSchema = require("../Model/schema/suppliersSchema");
      const supplierExists = await suppliersSchema.findByPk(updateData.supplier_id);
      if (!supplierExists) {
        return res.status(400).json({
          success: false,
          message: `Invalid supplier_id: ${updateData.supplier_id}. Supplier does not exist.`,
        });
      }
    }

    await sparePart.update(updateData);

    res.status(200).json({
      success: true,
      message: "Spare part updated successfully",
      data: sparePart,
    });
  } catch (error) {
    console.error("Error updating spare part:", error);
    res.status(500).json({
      success: false,
      message: "Error updating spare part",
      error: error.message,
    });
  }
};

// Delete a spare part
exports.deleteSparePart = async (req, res) => {
  try {
    const { id } = req.params;

    const sparePart = await SparePart.findByPk(id);
    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: "Spare part not found",
      });
    }

    await sparePart.destroy();

    res.status(200).json({
      success: true,
      message: "Spare part deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting spare part:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting spare part",
      error: error.message,
    });
  }
};

// Get low stock items
exports.getLowStockItems = async (req, res) => {
  try {
    const { branch_Id } = req.query;

    const whereClause = {
      currentStock: { [Op.lte]: col("minimumStock") },
    };

    if (branch_Id) whereClause.branch_Id = branch_Id;

    const lowStockItems = await SparePart.findAll({
      where: whereClause,
      include: [
        { model: require("../Model/mainCategoryModel"), as: "mainCategory" },
        { model: require("../Model/subCategoryModel"), as: "subCategory" },
      ],
      order: [["currentStock", "ASC"]],
    });

    res.status(200).json({
      success: true,
      data: lowStockItems,
    });
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching low stock items",
      error: error.message,
    });
  }
};

// Update stock quantity
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, operation } = req.body;

    const sparePart = await SparePart.findByPk(id);
    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: "Spare part not found",
      });
    }

    let newStock;
    if (operation === "add") {
      newStock = sparePart.currentStock + quantity;
    } else if (operation === "subtract") {
      newStock = sparePart.currentStock - quantity;
      if (newStock < 0) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid operation. Use "add" or "subtract"',
      });
    }

    await sparePart.update({ currentStock: newStock });

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: { currentStock: newStock },
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({
      success: false,
      message: "Error updating stock",
      error: error.message,
    });
  }
};

// Set spare part stock quantity (for stock taking)
exports.setSparePartStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({
        success: false,
        message: "Quantity is required",
      });
    }

    const sparePart = await SparePart.findByPk(id);
    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: "Spare part not found",
      });
    }

    await sparePart.update({ currentStock: parseFloat(quantity) });

    res.status(200).json({
      success: true,
      message: "Stock set successfully",
      data: { currentStock: parseFloat(quantity) },
    });
  } catch (error) {
    console.error("Error setting stock:", error);
    res.status(500).json({
      success: false,
      message: "Error setting stock",
      error: error.message,
    });
  }
};
