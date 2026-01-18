const dropdownDefinitionRepo = require("../Model/repository/dropdownDefinitionRepository");
const supplierCategoryRepo = require("../Model/repository/supplierCategoryRepository");
const supplyRegionRepo = require("../Model/repository/supplyRegionRepository");
const paymentTermRepo = require("../Model/repository/paymentTermRepository");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

class SupplierSettingsController {
  // Dropdown Definitions Controllers
  createDropdownDefinition = catchAsync(async (req, res, next) => {
    const definition = await dropdownDefinitionRepo.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        definition,
      },
    });
  });

  getAllDropdownDefinitions = catchAsync(async (req, res, next) => {
    const filters = {
      category: req.query.category,
      active: req.query.active === "true" ? true : req.query.active === "false" ? false : undefined,
      searchTerm: req.query.search,
    };

    const definitions = await dropdownDefinitionRepo.findAll(filters);

    res.status(200).json({
      status: "success",
      results: definitions.length,
      data: {
        definitions,
      },
    });
  });

  getDropdownDefinition = catchAsync(async (req, res, next) => {
    const definition = await dropdownDefinitionRepo.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        definition,
      },
    });
  });

  updateDropdownDefinition = catchAsync(async (req, res, next) => {
    const definition = await dropdownDefinitionRepo.update(req.params.id, req.body);

    res.status(200).json({
      status: "success",
      data: {
        definition,
      },
    });
  });

  deleteDropdownDefinition = catchAsync(async (req, res, next) => {
    await dropdownDefinitionRepo.delete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

  addValueToDefinition = catchAsync(async (req, res, next) => {
    const { value } = req.body;
    const definition = await dropdownDefinitionRepo.addValue(req.params.id, value);

    res.status(200).json({
      status: "success",
      data: {
        definition,
      },
    });
  });

  removeValueFromDefinition = catchAsync(async (req, res, next) => {
    const { valueIndex } = req.params;
    const definition = await dropdownDefinitionRepo.removeValue(req.params.id, parseInt(valueIndex));

    res.status(200).json({
      status: "success",
      data: {
        definition,
      },
    });
  });

  toggleDefinitionStatus = catchAsync(async (req, res, next) => {
    const definition = await dropdownDefinitionRepo.toggleStatus(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        definition,
      },
    });
  });

  // Supplier Categories Controllers
  createSupplierCategory = catchAsync(async (req, res, next) => {
    const category = await supplierCategoryRepo.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        category,
      },
    });
  });

  getAllSupplierCategories = catchAsync(async (req, res, next) => {
    const filters = {
      active: req.query.active === "true" ? true : req.query.active === "false" ? false : undefined,
      searchTerm: req.query.search,
    };

    const categories = await supplierCategoryRepo.findAll(filters);

    res.status(200).json({
      status: "success",
      results: categories.length,
      data: {
        categories,
      },
    });
  });

  getSupplierCategory = catchAsync(async (req, res, next) => {
    const category = await supplierCategoryRepo.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  });

  updateSupplierCategory = catchAsync(async (req, res, next) => {
    const category = await supplierCategoryRepo.update(req.params.id, req.body);

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  });

  deleteSupplierCategory = catchAsync(async (req, res, next) => {
    await supplierCategoryRepo.delete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

  toggleCategoryStatus = catchAsync(async (req, res, next) => {
    const category = await supplierCategoryRepo.toggleStatus(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  });

  // Supply Regions Controllers
  createSupplyRegion = catchAsync(async (req, res, next) => {
    const region = await supplyRegionRepo.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        region,
      },
    });
  });

  getAllSupplyRegions = catchAsync(async (req, res, next) => {
    const filters = {
      active: req.query.active === "true" ? true : req.query.active === "false" ? false : undefined,
      country: req.query.country,
      city: req.query.city,
      searchTerm: req.query.search,
    };

    const regions = await supplyRegionRepo.findAll(filters);

    res.status(200).json({
      status: "success",
      results: regions.length,
      data: {
        regions,
      },
    });
  });

  getSupplyRegion = catchAsync(async (req, res, next) => {
    const region = await supplyRegionRepo.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        region,
      },
    });
  });

  updateSupplyRegion = catchAsync(async (req, res, next) => {
    const region = await supplyRegionRepo.update(req.params.id, req.body);

    res.status(200).json({
      status: "success",
      data: {
        region,
      },
    });
  });

  deleteSupplyRegion = catchAsync(async (req, res, next) => {
    await supplyRegionRepo.delete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

  toggleRegionStatus = catchAsync(async (req, res, next) => {
    const region = await supplyRegionRepo.toggleStatus(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        region,
      },
    });
  });

  addBranchToRegion = catchAsync(async (req, res, next) => {
    const { branchName } = req.body;
    const region = await supplyRegionRepo.addBranch(req.params.id, branchName);

    res.status(200).json({
      status: "success",
      data: {
        region,
      },
    });
  });

  removeBranchFromRegion = catchAsync(async (req, res, next) => {
    const { branchIndex } = req.params;
    const region = await supplyRegionRepo.removeBranch(req.params.id, parseInt(branchIndex));

    res.status(200).json({
      status: "success",
      data: {
        region,
      },
    });
  });

  // Payment Terms Controllers
  createPaymentTerm = catchAsync(async (req, res, next) => {
    const term = await paymentTermRepo.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        term,
      },
    });
  });

  getAllPaymentTerms = catchAsync(async (req, res, next) => {
    const filters = {
      active: req.query.active === "true" ? true : req.query.active === "false" ? false : undefined,
      type: req.query.type,
      days: req.query.days ? parseInt(req.query.days) : undefined,
      searchTerm: req.query.search,
    };

    const terms = await paymentTermRepo.findAll(filters);

    res.status(200).json({
      status: "success",
      results: terms.length,
      data: {
        terms,
      },
    });
  });

  getPaymentTerm = catchAsync(async (req, res, next) => {
    const term = await paymentTermRepo.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        term,
      },
    });
  });

  updatePaymentTerm = catchAsync(async (req, res, next) => {
    const term = await paymentTermRepo.update(req.params.id, req.body);

    res.status(200).json({
      status: "success",
      data: {
        term,
      },
    });
  });

  deletePaymentTerm = catchAsync(async (req, res, next) => {
    await paymentTermRepo.delete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

  toggleTermStatus = catchAsync(async (req, res, next) => {
    const term = await paymentTermRepo.toggleStatus(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        term,
      },
    });
  });

  // Statistics Controllers
  getSettingsStatistics = catchAsync(async (req, res, next) => {
    const [dropdownStats, categoryStats, regionStats, termStats] = await Promise.all([
      dropdownDefinitionRepo.getStatistics(),
      supplierCategoryRepo.getStatistics(),
      supplyRegionRepo.getStatistics(),
      paymentTermRepo.getStatistics(),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        dropdownDefinitions: dropdownStats,
        supplierCategories: categoryStats,
        supplyRegions: regionStats,
        paymentTerms: termStats,
      },
    });
  });

  // Utility Controllers
  getActiveDropdownDefinitions = catchAsync(async (req, res, next) => {
    const { category } = req.params;
    const definitions = await dropdownDefinitionRepo.getByCategory(category);

    res.status(200).json({
      status: "success",
      results: definitions.length,
      data: {
        definitions,
      },
    });
  });

  getActiveSupplierCategories = catchAsync(async (req, res, next) => {
    const categories = await supplierCategoryRepo.getActiveCategories();

    res.status(200).json({
      status: "success",
      results: categories.length,
      data: {
        categories,
      },
    });
  });

  getActiveSupplyRegions = catchAsync(async (req, res, next) => {
    const regions = await supplyRegionRepo.getActiveRegions();

    res.status(200).json({
      status: "success",
      results: regions.length,
      data: {
        regions,
      },
    });
  });

  getActivePaymentTerms = catchAsync(async (req, res, next) => {
    const terms = await paymentTermRepo.getActiveTerms();

    res.status(200).json({
      status: "success",
      results: terms.length,
      data: {
        terms,
      },
    });
  });

  getRegionsByCountry = catchAsync(async (req, res, next) => {
    const { country } = req.params;
    const regions = await supplyRegionRepo.getRegionsByCountry(country);

    res.status(200).json({
      status: "success",
      results: regions.length,
      data: {
        regions,
      },
    });
  });

  getTermsByType = catchAsync(async (req, res, next) => {
    const { type } = req.params;
    const terms = await paymentTermRepo.getTermsByType(type);

    res.status(200).json({
      status: "success",
      results: terms.length,
      data: {
        terms,
      },
    });
  });
}

module.exports = new SupplierSettingsController();
