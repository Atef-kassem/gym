const express = require("express");
const router = express.Router();
const lockerController = require("../controllers/lockerController");

// Locker routes
router.route("/")
  .get(lockerController.getAllLockers)
  .post(lockerController.createLocker);

router.route("/:id")
  .get(lockerController.getLockerById)
  .put(lockerController.updateLocker)
  .delete(lockerController.deleteLocker);

// Locker subscription types routes
router.get("/subscription-types/all", lockerController.getLockerSubscriptionTypes);
router.post("/subscription-types", lockerController.createLockerSubscriptionType);
router.put("/subscription-types/:id", lockerController.updateLockerSubscriptionType);
router.delete("/subscription-types/:id", lockerController.deleteLockerSubscriptionType);

// Locker subscriptions routes
router.get("/subscriptions/all", lockerController.getAllLockerSubscriptions);
router.post("/subscriptions", lockerController.createLockerSubscription);
router.get("/statistics", lockerController.getLockerStatistics);

module.exports = router;

