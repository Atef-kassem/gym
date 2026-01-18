-- تحديث جدول Users لجعل branchId اختياري (nullable)
-- هذا الملف يزيل قيد NOT NULL من عمود branchId

ALTER TABLE `Users` 
MODIFY COLUMN `branchId` INT NULL;

-- التحقق من التحديث
-- يمكنك تشغيل هذا الاستعلام للتحقق:
-- DESCRIBE Users;

