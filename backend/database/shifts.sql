-- جدول الورديات
-- يحدد أوقات العمل والورديات المختلفة في النظام

-- حذف الجدول القديم إن وجد (استخدم بحذر!)
DROP TABLE IF EXISTS `shifts`;
DROP TABLE IF EXISTS `Shifts`;

CREATE TABLE `Shifts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `shiftName` VARCHAR(100) NOT NULL COMMENT 'اسم الوردية',
  `startTime` TIME NOT NULL COMMENT 'وقت بداية الوردية',
  `endTime` TIME NOT NULL COMMENT 'وقت نهاية الوردية',
  `branchId` INT DEFAULT NULL COMMENT 'معرف الفرع (اختياري)',
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'هل الوردية نشطة؟',
  `description` TEXT DEFAULT NULL COMMENT 'وصف الوردية',
  `color` VARCHAR(20) DEFAULT '#3b82f6' COMMENT 'لون الوردية في الجدول',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_branch_id` (`branchId`),
  KEY `idx_is_active` (`isActive`),
  KEY `idx_times` (`startTime`, `endTime`),
  
  CONSTRAINT `fk_shift_branch` 
    FOREIGN KEY (`branchId`) 
    REFERENCES `Branches` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='جدول الورديات - يحدد أوقات العمل المختلفة';

-- إضافة ورديات تجريبية
INSERT INTO `Shifts` (`shiftName`, `startTime`, `endTime`, `description`, `color`, `isActive`) VALUES
('الوردية الصباحية', '08:00:00', '16:00:00', 'وردية العمل الصباحية', '#10b981', TRUE),
('الوردية المسائية', '16:00:00', '00:00:00', 'وردية العمل المسائية', '#f59e0b', TRUE),
('الوردية الليلية', '00:00:00', '08:00:00', 'وردية العمل الليلية', '#8b5cf6', TRUE);

