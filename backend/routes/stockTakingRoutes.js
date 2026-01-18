const express = require("express");
const stockTakingController = require("../controllers/stockTakingController");
const authController = require("../controllers/authController");
const router = express.Router();

// Protect all routes
// router.use(authController.protect);

// Stock Count Session Routes
router.route("/sessions").get(stockTakingController.getAllSessions).post(stockTakingController.createSession);

router
  .route("/sessions/:id")
  .get(stockTakingController.getSession)
  .patch(stockTakingController.updateSession)
  .delete(stockTakingController.deleteSession);

// Count Item Routes
router
  .route("/sessions/:sessionId/items")
  .get(stockTakingController.getAllCountItems)
  .post(stockTakingController.createCountItem);

router.route("/sessions/:sessionId/items/bulk").post(stockTakingController.createBulkCountItems);

router.route("/items/all").get(stockTakingController.getAllCountItemsFromAllSessions);

router
  .route("/items/:id")
  .get(stockTakingController.getCountItem)
  .patch(stockTakingController.updateCountItem)
  .delete(stockTakingController.deleteCountItem);

// Adjustment Routes
router.route("/adjustments").get(stockTakingController.getAllAdjustments).post(stockTakingController.createAdjustment);

router
  .route("/adjustments/:id")
  .get(stockTakingController.getAdjustment)
  .patch(stockTakingController.updateAdjustment)
  .delete(stockTakingController.deleteAdjustment);

router.route("/adjustments/:id/approve").patch(stockTakingController.approveAdjustment);

// Statistics Routes
router.route("/statistics").get(stockTakingController.getStatistics);

router.route("/sessions/:sessionId/statistics").get(stockTakingController.getSessionStatistics);

module.exports = router;
