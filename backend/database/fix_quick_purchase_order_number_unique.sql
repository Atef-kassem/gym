-- إزالة UNIQUE constraint من orderNumber في جدول QUICKPURCHASEORDERS
-- للسماح بنفس رقم الأمر لأكثر من منتج

-- خطوة 1: عرض جميع الـ indexes على الجدول لمعرفة اسم الـ unique index
-- قم بتشغيل هذا الأمر أولاً في phpMyAdmin أو MySQL:
SHOW INDEX FROM QUICKPURCHASEORDERS WHERE Column_name = 'orderNumber';

-- خطوة 2: بعد معرفة اسم الـ index، استخدم أحد الأوامر التالية:

-- إذا كان اسم الـ index هو: orderNumber
ALTER TABLE QUICKPURCHASEORDERS DROP INDEX orderNumber;

-- إذا كان اسم الـ index هو: orderNumber_UNIQUE
-- ALTER TABLE QUICKPURCHASEORDERS DROP INDEX orderNumber_UNIQUE;

-- إذا كان اسم الـ index هو: quick_purchase_orders_orderNumber_key
-- ALTER TABLE QUICKPURCHASEORDERS DROP INDEX quick_purchase_orders_orderNumber_key;

-- إذا كان اسم الـ index مختلف، استخدم:
-- ALTER TABLE QUICKPURCHASEORDERS DROP INDEX [اسم_الindex_من_الخطوة_1];

-- خطوة 3 (اختياري): إضافة index عادي (غير unique) على orderNumber لتحسين الأداء
-- ALTER TABLE QUICKPURCHASEORDERS ADD INDEX idx_order_number (orderNumber);

