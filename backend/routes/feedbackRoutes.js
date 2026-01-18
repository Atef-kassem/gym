const express = require("express");
const router = express.Router();

const feedbackController = require("../controllers/feedbackController");

router
  .route("/")
  .get(feedbackController.getFeedbacks)
  .post(feedbackController.createFeedback);

router
  .route("/:id")
  .get(feedbackController.getFeedbackById)
  .put(feedbackController.updateFeedback)
  .delete(feedbackController.deleteFeedback);

module.exports = router;


