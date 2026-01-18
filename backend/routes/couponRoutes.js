const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

// لا يوجد middleware مصادقة - النظام يعمل بدون تسجيل دخول

// مسارات إدارة الكوبونات الأساسية
router.route('/')
  .get(couponController.getAllCoupons)
  .post(couponController.createCoupon);

router.route('/stats')
  .get(couponController.getCouponStats);

router.route('/export')
  .get(couponController.exportCoupons);

router.route('/expired')
  .get(couponController.getExpiredCoupons)
  .patch(couponController.updateExpiredCoupons);

router.route('/code/:code')
  .get(couponController.findCouponByCode);

router.route('/:id')
  .get(couponController.getCoupon)
  .patch(couponController.updateCoupon)
  .delete(couponController.deleteCoupon);

router.route('/:id/toggle-status')
  .patch(couponController.toggleCouponStatus);

router.route('/:id/duplicate')
  .post(couponController.duplicateCoupon);

router.route('/:id/usage')
  .patch(couponController.updateCouponUsage);

module.exports = router;
