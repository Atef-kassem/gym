const express = require("express");
const router = express.Router();
const subscriptionRefundController = require("../controllers/subscriptionRefundController");

router.route("/")
  .get(subscriptionRefundController.getAllRefunds)
  .post(subscriptionRefundController.createRefund);

router.get("/statistics", subscriptionRefundController.getRefundStatistics);

router.route("/:id")
  .get(subscriptionRefundController.getRefundById)
  .put(subscriptionRefundController.updateRefundStatus);

module.exports = router;

