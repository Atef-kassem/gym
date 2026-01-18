const express = require("express");
const router = express.Router();

const surveyController = require("../controllers/surveyController");

// Survey routes
router
  .route("/")
  .get(surveyController.getSurveys)
  .post(surveyController.createSurvey);

router
  .route("/:id")
  .get(surveyController.getSurveyById)
  .put(surveyController.updateSurvey)
  .delete(surveyController.deleteSurvey);

router
  .route("/:id/status")
  .put(surveyController.updateSurveyStatus);

router
  .route("/:id/analytics")
  .get(surveyController.getSurveyAnalytics);

// Survey responses routes
router
  .route("/responses")
  .get(surveyController.getSurveyResponses)
  .post(surveyController.createSurveyResponse);

module.exports = router;
