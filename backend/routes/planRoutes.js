const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');

// لا يوجد middleware مصادقة - النظام يعمل بدون تسجيل دخول

// مسارات إدارة الخطط
router.route('/')
  .get(planController.getAllPlans)
  .post(planController.createPlan);

router.route('/stats')
  .get(planController.getPlanStats);

router.route('/:id')
  .get(planController.getPlan)
  .patch(planController.updatePlan)
  .delete(planController.deletePlan);

router.route('/:id/status')
  .patch(planController.togglePlanStatus);

router.route('/:id/duplicate')
  .post(planController.duplicatePlan);

module.exports = router;
