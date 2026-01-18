const productBranchesRepository = require("../Model/repository/productBranchesRepository");
const branchesRepository = require("../Model/repository/branchesRepository");
const productsRepository = require("../Model/repository/productsRepository");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

class ProductBranchesController {
  createProductBranch = catchAsync(async (req, res, next) => {
    const { product_id, branch_id } = req.body;

    if (!product_id || !branch_id) {
      return next(new AppError("product_id and branch_id are required", 400));
    }

    const branchExists = await branchesRepository.findById(branch_id);
    if (!branchExists) {
      return next(new AppError(`Branch with id ${branch_id} does not exist`, 404));
    }

    const productExists = await productsRepository.findById(product_id);
    if (!productExists) {
      return next(new AppError(`Product with id ${product_id} does not exist`, 404));
    }

    const existingProductBranch = await productBranchesRepository.findById(product_id, branch_id);
    if (existingProductBranch) {
      return next(new AppError("Product branch already exists", 409));
    }

    try {
      const productBranch = await productBranchesRepository.create(req.body);

      res.status(201).json({
        status: "success",
        data: {
          productBranch,
        },
      });
    } catch (error) {
      if (error.message.includes("foreign key constraint fails")) {
        if (error.message.includes("branch_id")) {
          return next(new AppError("Invalid branch_id - branch does not exist", 400));
        }
        if (error.message.includes("product_id")) {
          return next(new AppError("Invalid product_id - product does not exist", 400));
        }
      }
      return next(new AppError(error.message, 400));
    }
  });

  getAllProductBranches = catchAsync(async (req, res, next) => {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 100000,
      productId: req.query.productId,
      branchId: req.query.branchId,
      lowStock: req.query.lowStock === "true",
      sortBy: req.query.sortBy || "last_updated",
      sortOrder: req.query.sortOrder || "DESC",
    };

    const result = await productBranchesRepository.findAll(options);

    res.status(200).json({
      status: "success",
      data: {
        productBranches: result.productBranches,
        pagination: result.pagination,
      },
    });
  });

  getProductBranch = catchAsync(async (req, res, next) => {
    const { productId, branchId } = req.params;

    const productBranch = await productBranchesRepository.findById(productId, branchId);

    if (!productBranch) {
      return next(new AppError("Product branch not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        productBranch,
      },
    });
  });

  updateProductBranch = catchAsync(async (req, res, next) => {
    const { productId, branchId } = req.params;

    const existingProductBranch = await productBranchesRepository.findById(productId, branchId);
    if (!existingProductBranch) {
      return next(new AppError("Product branch not found", 404));
    }

    if (req.body.branch_id && req.body.branch_id !== parseInt(branchId)) {
      const branchExists = await branchesRepository.findById(req.body.branch_id);
      if (!branchExists) {
        return next(new AppError(`Branch with id ${req.body.branch_id} does not exist`, 404));
      }
    }

    if (req.body.product_id && req.body.product_id !== productId) {
      const productExists = await productsRepository.findById(req.body.product_id);
      if (!productExists) {
        return next(new AppError(`Product with id ${req.body.product_id} does not exist`, 404));
      }
    }

    try {
      const productBranch = await productBranchesRepository.update(productId, branchId, req.body);

      res.status(200).json({
        status: "success",
        data: {
          productBranch,
        },
      });
    } catch (error) {
      if (error.message.includes("foreign key constraint fails")) {
        if (error.message.includes("branch_id")) {
          return next(new AppError("Invalid branch_id - branch does not exist", 400));
        }
        if (error.message.includes("product_id")) {
          return next(new AppError("Invalid product_id - product does not exist", 400));
        }
      }
      return next(new AppError(error.message, 400));
    }
  });

  deleteProductBranch = catchAsync(async (req, res, next) => {
    const { productId, branchId } = req.params;

    const deleted = await productBranchesRepository.delete(productId, branchId);

    if (!deleted) {
      return next(new AppError("Product branch not found", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

  updateStock = catchAsync(async (req, res, next) => {
    const { productId, branchId } = req.params;
    const { quantity, operation } = req.body;

    if (!quantity || isNaN(quantity)) {
      return next(new AppError("Quantity is required and must be a number", 400));
    }

    const productBranch = await productBranchesRepository.updateStock(
      productId,
      branchId,
      parseInt(quantity),
      operation || "add"
    );

    res.status(200).json({
      status: "success",
      data: {
        productBranch,
      },
    });
  });

  getProductsByBranch = catchAsync(async (req, res, next) => {
    const { branchId } = req.params;

    const branchExists = await branchesRepository.findById(branchId);
    if (!branchExists) {
      return next(new AppError(`Branch with id ${branchId} does not exist`, 404));
    }

    const products = await productBranchesRepository.getProductsByBranch(branchId);

    res.status(200).json({
      status: "success",
      data: {
        products,
      },
    });
  });

  getBranchesByProduct = catchAsync(async (req, res, next) => {
    const { productId } = req.params;

    const productExists = await productsRepository.findById(productId);
    if (!productExists) {
      return next(new AppError(`Product with id ${productId} does not exist`, 404));
    }

    const branches = await productBranchesRepository.getBranchesByProduct(productId);

    res.status(200).json({
      status: "success",
      data: {
        branches,
      },
    });
  });

  getLowStockItems = catchAsync(async (req, res, next) => {
    const { branchId } = req.params;
    const threshold = parseInt(req.query.threshold) || 10;

    if (branchId) {
      const branchExists = await branchesRepository.findById(branchId);
      if (!branchExists) {
        return next(new AppError(`Branch with id ${branchId} does not exist`, 404));
      }
    }

    const lowStockItems = await productBranchesRepository.getLowStockItems(branchId || null, threshold);

    res.status(200).json({
      status: "success",
      data: {
        lowStockItems,
      },
    });
  });
}

module.exports = new ProductBranchesController();
