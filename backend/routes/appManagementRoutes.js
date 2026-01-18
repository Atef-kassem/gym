const express = require("express");
const router = express.Router();
const appManagementController = require("../controllers/appManagementController");
const { uploadHandler } = require("../middlewares/fileUpload");

// Media Upload (images for app content)
router.post("/upload-image", uploadHandler, appManagementController.uploadAppImage);

// About App
router.get("/about", appManagementController.getAboutApp);
router.put("/about", appManagementController.updateAboutApp);

// Privacy Policy
router.get("/policy", appManagementController.getPrivacyPolicy);
router.put("/policy", appManagementController.updatePrivacyPolicy);

// Invitations
router.get("/invitations", appManagementController.getAllInvitations);
router.post("/invitations", appManagementController.createInvitation);
router.put("/invitations/:id", appManagementController.updateInvitation);
router.get("/invitations/status/:status", appManagementController.getInvitationsByStatus);

// Offers
router.get("/offers", appManagementController.getAllOffers);
router.post("/offers", appManagementController.createOffer);
router.put("/offers/:id", appManagementController.updateOffer);
router.delete("/offers/:id", appManagementController.deleteOffer);
router.post("/offers/favourite", appManagementController.toggleOfferFavorite);

// Trainers
router.get("/trainers", appManagementController.getAllTrainers);
router.post("/trainers", appManagementController.createTrainer);
router.put("/trainers/:id", appManagementController.updateTrainer);
router.delete("/trainers/:id", appManagementController.deleteTrainer);

// Exercise Categories
router.get("/exercise-categories", appManagementController.getAllExerciseCategories);
router.post("/exercise-categories", appManagementController.createExerciseCategory);
router.put("/exercise-categories/:id", appManagementController.updateExerciseCategory);
router.delete("/exercise-categories/:id", appManagementController.deleteExerciseCategory);

// Exercises
router.get("/exercises", appManagementController.getAllExercises);
router.post("/exercises", appManagementController.createExercise);
router.put("/exercises/:id", appManagementController.updateExercise);
router.delete("/exercises/:id", appManagementController.deleteExercise);

// News
router.get("/news", appManagementController.getAllNews);
router.post("/news", appManagementController.createNews);
router.put("/news/:id", appManagementController.updateNews);
router.delete("/news/:id", appManagementController.deleteNews);

// Ads
router.get("/ads", appManagementController.getAllAds);
router.post("/ads", appManagementController.createAd);
router.put("/ads/:id", appManagementController.updateAd);
router.delete("/ads/:id", appManagementController.deleteAd);

// Messages
router.get("/messages", appManagementController.getAllMessages);
router.post("/messages", appManagementController.createMessage);
router.get("/messages/:id", appManagementController.getMessageById);
router.put("/messages/:id/read", appManagementController.markAsRead);
router.delete("/messages/:id", appManagementController.deleteMessage);

module.exports = router;

