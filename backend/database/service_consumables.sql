-- جدول ربط الخدمات بالمواد المستهلكة
-- يحدد المواد المستهلكة المطلوبة لكل خدمة وكمياتها

CREATE TABLE IF NOT EXISTS `service_consumables` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `service_id` INT NOT NULL COMMENT 'معرف الخدمة',
  `consumable_id` INT NOT NULL COMMENT 'معرف المادة المستهلكة',
  `quantity` DECIMAL(10, 2) NOT NULL DEFAULT 1.00 COMMENT 'الكمية المطلوبة من المادة لتنفيذ الخدمة',
  `unit` VARCHAR(50) DEFAULT NULL COMMENT 'وحدة القياس',
  `is_optional` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'هل المادة اختيارية؟',
  `notes` TEXT DEFAULT NULL COMMENT 'ملاحظات حول استخدام المادة',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'هل العلاقة نشطة؟',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_service_consumable` (`service_id`, `consumable_id`),
  KEY `idx_service_id` (`service_id`),
  KEY `idx_consumable_id` (`consumable_id`),
  KEY `idx_is_active` (`is_active`),
  
  CONSTRAINT `fk_service_consumable_service` 
    FOREIGN KEY (`service_id`) 
    REFERENCES `Services` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
    
  CONSTRAINT `fk_service_consumable_consumable` 
    FOREIGN KEY (`consumable_id`) 
    REFERENCES `Consumables` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='جدول ربط الخدمات بالمواد المستهلكة - يحدد المواد التي تستخدم لكل خدمة وكمياتها';

-- مثال على إضافة بيانات تجريبية (اختياري - يمكن حذفه)
-- INSERT INTO `service_consumables` (`service_id`, `consumable_id`, `quantity`, `unit`, `is_optional`, `notes`) VALUES
-- (1, 1, 2.00, 'لتر', FALSE, 'زيت محرك للتغيير'),
-- (1, 2, 1.00, 'قطعة', FALSE, 'فلتر زيت'),
-- (2, 3, 0.50, 'كجم', FALSE, 'شحم للفحص'),
-- (3, 4, 1.00, 'قطعة', TRUE, 'قطعة غيار اختيارية');

