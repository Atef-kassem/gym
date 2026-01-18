const express = require("express");
const router = express.Router();
const subscriptionTypeController = require("../controllers/subscriptionTypeController");

router.get("/all", subscriptionTypeController.getAllSubscriptionTypes);
router.post("/", subscriptionTypeController.createSubscriptionType);
router.put("/:id", subscriptionTypeController.updateSubscriptionType);
router.delete("/:id", subscriptionTypeController.deleteSubscriptionType);

module.exports = router;


