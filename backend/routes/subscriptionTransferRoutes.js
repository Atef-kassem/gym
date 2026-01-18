const express = require("express");
const router = express.Router();
const subscriptionTransferController = require("../controllers/subscriptionTransferController");

router.route("/")
  .get(subscriptionTransferController.getAllTransfers)
  .post(subscriptionTransferController.createTransfer);

router.get("/statistics", subscriptionTransferController.getTransferStatistics);

router.get("/member/:memberId/history", subscriptionTransferController.getMemberSubscriptionHistory);

router.route("/:id")
  .get(subscriptionTransferController.getTransferById);

module.exports = router;

