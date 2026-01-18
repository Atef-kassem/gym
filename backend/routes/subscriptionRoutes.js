const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");

router.route("/")
  .get(subscriptionController.getAllSubscriptions)
  .post(subscriptionController.createSubscription);

router.get("/statistics", subscriptionController.getSubscriptionStatistics);

router.route("/:id")
  .get(subscriptionController.getSubscriptionById)
  .put(subscriptionController.updateSubscription)
  .delete(subscriptionController.deleteSubscription);

module.exports = router;
