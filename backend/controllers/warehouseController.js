const Warehouse = require("../Model/schema/warehousesSchema");
const Inventory = require("../Model/repository/inventoryRepository");
const Product = require("../Model/repository/productsRepository");
const Branch = require("../Model/branchesModel");

const createWarehouse = async (req, res) => {
  try {
    const newWarehouse = await Warehouse.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        warehouse: newWarehouse,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.findAll({
      include: [
        {
          model: Branch,
          as: "branch",
          attributes: ["id", "arabicName", "englishName"],
        },
      ],
    });
    res.status(200).json({
      status: "success",
      results: warehouses.length,
      data: {
        warehouses,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id, {
      include: [
        {
          model: Branch,
          as: "branch",
          attributes: ["id", "arabicName", "englishName"],
        },
        {
          model: Inventory,
          as: "inventories",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_id", "name_ar", "name_en"],
            },
          ],
        },
      ],
    });

    if (!warehouse) {
      return res.status(404).json({
        status: "fail",
        message: "Warehouse not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        warehouse,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const updateWarehouse = async (req, res) => {
  try {
    const [updated] = await Warehouse.update(req.body, {
      where: { warehouse_id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({
        status: "fail",
        message: "Warehouse not found",
      });
    }

    const warehouse = await Warehouse.findByPk(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        warehouse,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const deleteWarehouse = async (req, res) => {
  try {
    const deleted = await Warehouse.destroy({
      where: { warehouse_id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({
        status: "fail",
        message: "Warehouse not found",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getWarehouseInventory = async (req, res) => {
  try {
    // استخدم المستودع الخاص بالمستودع (Repository) مع توقيعه الصحيح للتصفية
    const result = await Inventory.findAll({
      warehouseId: req.params.id,
      limit: 100000,
    });
    const inventory = result?.inventory || [];

    res.status(200).json({
      status: "success",
      results: inventory.length,
      data: {
        inventory,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const updateWarehouseInventory = async (req, res) => {
  try {
    const [updated] = await Inventory.update(req.body, {
      where: { inventory_id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({
        status: "fail",
        message: "Inventory record not found",
      });
    }

    const inventory = await Inventory.findByPk(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        inventory,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

module.exports = {
  createWarehouse,
  getAllWarehouses,
  getWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getWarehouseInventory,
  updateWarehouseInventory,
};
