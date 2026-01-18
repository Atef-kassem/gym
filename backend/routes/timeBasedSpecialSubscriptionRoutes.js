const express = require("express");
const router = express.Router();
const timeBasedSpecialSubscriptionController = require("../controllers/timeBasedSpecialSubscriptionController");

router.route("/")
  .get(timeBasedSpecialSubscriptionController.getAllTimeBasedSpecialSubscriptions)
  .post(timeBasedSpecialSubscriptionController.createTimeBasedSpecialSubscription);

router.get("/statistics", timeBasedSpecialSubscriptionController.getTimeBasedSpecialSubscriptionStatistics);

router.route("/:id")
  .get(timeBasedSpecialSubscriptionController.getTimeBasedSpecialSubscriptionById)
  .put(timeBasedSpecialSubscriptionController.updateTimeBasedSpecialSubscription)
  .delete(timeBasedSpecialSubscriptionController.deleteTimeBasedSpecialSubscription);

module.exports = router;

