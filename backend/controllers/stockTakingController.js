const stockCountSessionRepo = require("../Model/repository/stockCountSessionRepository");
const countItemRepo = require("../Model/repository/countItemRepository");
const adjustmentRepo = require("../Model/repository/adjustmentRepository");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

class StockTakingController {
  // Stock Count Session Controllers
  createSession = catchAsync(async (req, res, next) => {
    const sessionData = {
      ...req.body,
      sessionNumber: await stockCountSessionRepo.generateSessionNumber(),
    };

    const session = await stockCountSessionRepo.create(sessionData);

    res.status(201).json({
      status: "success",
      data: {
        session,
      },
    });
  });

  getAllSessions = catchAsync(async (req, res, next) => {
    const filters = {
      warehouse: req.query.warehouse,
      status: req.query.status,
      searchTerm: req.query.search,
    };

    const sessions = await stockCountSessionRepo.findAll(filters);

    res.status(200).json({
      status: "success",
      results: sessions.length,
      data: {
        sessions,
      },
    });
  });

  getSession = catchAsync(async (req, res, next) => {
    const session = await stockCountSessionRepo.findById(req.params.id);

    if (!session) {
      return next(new AppError("Session not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        session,
      },
    });
  });

  updateSession = catchAsync(async (req, res, next) => {
    const session = await stockCountSessionRepo.update(req.params.id, req.body);

    res.status(200).json({
      status: "success",
      data: {
        session,
      },
    });
  });

  deleteSession = catchAsync(async (req, res, next) => {
    await stockCountSessionRepo.delete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

  // Count Item Controllers
  createCountItem = catchAsync(async (req, res, next) => {
    const itemData = {
      ...req.body,
      stockCountSessionId: req.params.sessionId,
    };

    const item = await countItemRepo.create(itemData);

    res.status(201).json({
      status: "success",
      data: {
        item,
      },
    });
  });

  createBulkCountItems = catchAsync(async (req, res, next) => {
    const raw = Array.isArray(req.body)
      ? req.body
      : Array.isArray(req.body.items)
      ? req.body.items
      : Array.isArray(req.body.itemsData)
      ? req.body.itemsData
      : [];

    const itemsData = raw.map((item) => ({
      ...item,
      stockCountSessionId: req.params.sessionId,
    }));

    const items = await countItemRepo.createBulk(itemsData);

    res.status(201).json({
      status: "success",
      data: {
        items,
      },
    });
  });

  getAllCountItems = catchAsync(async (req, res, next) => {
    const filters = {
      stockCountSessionId: req.params.sessionId || req.query.sessionId,
      searchTerm: req.query.search,
      status: req.query.status,
      category: req.query.category,
    };

    const items = await countItemRepo.findAll(filters);

    res.status(200).json({
      status: "success",
      results: items.length,
      data: {
        items,
      },
    });
  });

  getAllCountItemsFromAllSessions = catchAsync(async (req, res, next) => {
    const filters = {
      searchTerm: req.query.search,
      status: req.query.status,
      category: req.query.category,
    };

    const items = await countItemRepo.findAll(filters);

    res.status(200).json({
      status: "success",
      results: items.length,
      data: {
        items,
      },
    });
  });

  getCountItem = catchAsync(async (req, res, next) => {
    const item = await countItemRepo.findById(req.params.id);

    if (!item) {
      return next(new AppError("Count item not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        item,
      },
    });
  });

  updateCountItem = catchAsync(async (req, res, next) => {
    const item = await countItemRepo.update(req.params.id, req.body);

    res.status(200).json({
      status: "success",
      data: {
        item,
      },
    });
  });

  deleteCountItem = catchAsync(async (req, res, next) => {
    await countItemRepo.delete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

  // Adjustment Controllers
  createAdjustment = catchAsync(async (req, res, next) => {
    const adjustmentData = {
      ...req.body,
      adjustmentNumber: await adjustmentRepo.generateAdjustmentNumber(),
    };

    const adjustment = await adjustmentRepo.create(adjustmentData);

    res.status(201).json({
      status: "success",
      data: {
        adjustment,
      },
    });
  });

  getAllAdjustments = catchAsync(async (req, res, next) => {
    const filters = {
      stockCountSessionId: req.query.sessionId,
      status: req.query.status,
      searchTerm: req.query.search,
    };

    const adjustments = await adjustmentRepo.findAll(filters);

    res.status(200).json({
      status: "success",
      results: adjustments.length,
      data: {
        adjustments,
      },
    });
  });

  getAdjustment = catchAsync(async (req, res, next) => {
    const adjustment = await adjustmentRepo.findById(req.params.id);

    if (!adjustment) {
      return next(new AppError("Adjustment not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        adjustment,
      },
    });
  });

  updateAdjustment = catchAsync(async (req, res, next) => {
    const adjustment = await adjustmentRepo.update(req.params.id, req.body);

    res.status(200).json({
      status: "success",
      data: {
        adjustment,
      },
    });
  });

  approveAdjustment = catchAsync(async (req, res, next) => {
    try {
      console.log("🔍 بدء عملية اعتماد التسوية");
      console.log("📋 req.params:", req.params);
      console.log("📋 req.body:", req.body);
      
      const adjustmentId = req.params.id;
      console.log("🆔 معرف التسوية:", adjustmentId);
      
      // استخدام اسم افتراضي لأن المصادقة غير مفعلة
      const approverName = "نظام";
      console.log("👤 اسم المعتمد:", approverName);
      
      const adjustment = await adjustmentRepo.approve(adjustmentId, approverName);
      console.log("✅ تم اعتماد التسوية بنجاح:", adjustment);

      res.status(200).json({
        status: "success",
        data: {
          adjustment,
        },
        message: "تم اعتماد التسوية بنجاح"
      });
    } catch (error) {
      console.error("❌ خطأ في اعتماد التسوية:", error);
      res.status(500).json({
        status: "error",
        message: error.message || "فشل في اعتماد التسوية",
      });
    }
  });

  deleteAdjustment = catchAsync(async (req, res, next) => {
    await adjustmentRepo.delete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

  // Statistics Controllers
  getStatistics = catchAsync(async (req, res, next) => {
    const sessionStats = await stockCountSessionRepo.getStatistics();
    const adjustmentStats = await adjustmentRepo.getStatistics();

    res.status(200).json({
      status: "success",
      data: {
        sessions: sessionStats,
        adjustments: adjustmentStats,
      },
    });
  });

  getSessionStatistics = catchAsync(async (req, res, next) => {
    const sessionId = req.params.sessionId;

    const itemStats = await countItemRepo.getStatistics(sessionId);
    const discrepancies = await countItemRepo.getDiscrepanciesByCategory(sessionId);

    res.status(200).json({
      status: "success",
      data: {
        items: itemStats,
        discrepancies,
      },
    });
  });
}

module.exports = new StockTakingController();
