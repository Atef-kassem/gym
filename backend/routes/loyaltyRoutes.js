const express = require('express');
const router = express.Router();
const loyaltyMemberController = require('../controllers/loyaltyMemberController');
const pointsTransactionController = require('../controllers/pointsTransactionController');
const loyaltyRuleController = require('../controllers/loyaltyRuleController');
const loyaltyRewardController = require('../controllers/loyaltyRewardController');

// لا يوجد middleware مصادقة - النظام يعمل بدون تسجيل دخول

// مسارات أعضاء الولاء
router.route('/members')
  .get(loyaltyMemberController.getAllMembers)
  .post(loyaltyMemberController.createMember);

router.route('/members/stats')
  .get(loyaltyMemberController.getMemberStats);

router.route('/members/export')
  .get(loyaltyMemberController.exportMembers);

router.route('/members/customer/:customerId')
  .get(loyaltyMemberController.getCustomerMembers);

router.route('/members/:id')
  .get(loyaltyMemberController.getMember)
  .patch(loyaltyMemberController.updateMember)
  .delete(loyaltyMemberController.deleteMember);

router.route('/members/:id/status')
  .patch(loyaltyMemberController.toggleMemberStatus);

router.route('/members/:id/points')
  .patch(loyaltyMemberController.updatePoints);

// مسارات معاملات النقاط
router.route('/transactions')
  .get(pointsTransactionController.getAllTransactions)
  .post(pointsTransactionController.createTransaction);

router.route('/transactions/stats')
  .get(pointsTransactionController.getTransactionStats);

router.route('/transactions/export')
  .get(pointsTransactionController.exportTransactions);

router.route('/transactions/customer/:customerId')
  .get(pointsTransactionController.getCustomerTransactions);

router.route('/transactions/:id')
  .get(pointsTransactionController.getTransaction)
  .patch(pointsTransactionController.updateTransaction)
  .delete(pointsTransactionController.deleteTransaction);

// مسارات قواعد الولاء
router.route('/rules')
  .get(loyaltyRuleController.getAllRules)
  .post(loyaltyRuleController.createRule);

router.route('/rules/active')
  .get(loyaltyRuleController.getActiveRules);

router.route('/rules/stats')
  .get(loyaltyRuleController.getRuleStats);

router.route('/rules/:id')
  .get(loyaltyRuleController.getRule)
  .patch(loyaltyRuleController.updateRule)
  .delete(loyaltyRuleController.deleteRule);

router.route('/rules/:id/status')
  .patch(loyaltyRuleController.toggleRuleStatus);

router.route('/rules/:id/duplicate')
  .post(loyaltyRuleController.duplicateRule);

// مسارات مكافآت الولاء
router.route('/rewards')
  .get(loyaltyRewardController.getAllRewards)
  .post(loyaltyRewardController.createReward);

router.route('/rewards/available')
  .get(loyaltyRewardController.getAvailableRewards);

router.route('/rewards/stats')
  .get(loyaltyRewardController.getRewardStats);

router.route('/rewards/:id')
  .get(loyaltyRewardController.getReward)
  .patch(loyaltyRewardController.updateReward)
  .delete(loyaltyRewardController.deleteReward);

router.route('/rewards/:id/status')
  .patch(loyaltyRewardController.toggleRewardStatus);

router.route('/rewards/:id/duplicate')
  .post(loyaltyRewardController.duplicateReward);

router.route('/rewards/:id/redeem')
  .post(loyaltyRewardController.redeemReward);

module.exports = router;
