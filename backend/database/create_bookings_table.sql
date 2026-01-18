-- إنشاء جدول البيع
CREATE TABLE IF NOT EXISTS `BOOKINGS` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `booking_number` VARCHAR(50) NOT NULL UNIQUE COMMENT 'رقم الحجز',
  `customer_name` VARCHAR(100) NOT NULL COMMENT 'اسم العميل',
  `customer_phone` VARCHAR(20) NOT NULL COMMENT 'رقم هاتف العميل',
  `customer_email` VARCHAR(100) NULL COMMENT 'بريد العميل الإلكتروني',
  `branch_id` INT NOT NULL COMMENT 'معرف الفرع',
  `table_id` INT NULL COMMENT 'معرف الطاولة',
  `booking_date` DATE NOT NULL COMMENT 'تاريخ الحجز',
  `booking_time` TIME NOT NULL COMMENT 'وقت الحجز',
  `status` ENUM('pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show') NOT NULL DEFAULT 'pending' COMMENT 'حالة الحجز',
  `total_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'السعر الإجمالي',
  `final_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'المبلغ النهائي',
  `payment_status` ENUM('unpaid', 'partial', 'paid', 'refunded') NOT NULL DEFAULT 'unpaid' COMMENT 'حالة الدفع',
  `notes` TEXT NULL COMMENT 'ملاحظات',
  `special_requests` JSON NULL COMMENT 'طلبات خاصة',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'تاريخ التحديث',
  
  INDEX `idx_branch_id` (`branch_id`),
  INDEX `idx_table_id` (`table_id`),
  INDEX `idx_booking_date` (`booking_date`),
  INDEX `idx_status` (`status`),
  INDEX `idx_booking_number` (`booking_number`),
  
  FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`table_id`) REFERENCES `TABLES`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول إدارة البيع';

-- إضافة بعض البيانات الاختبارية (اختياري)
-- INSERT INTO `BOOKINGS` 
-- (`booking_number`, `customer_name`, `customer_phone`, `customer_email`, `branch_id`, `table_id`, `booking_date`, `booking_time`, `status`, `total_price`, `final_amount`, `payment_status`, `notes`)
-- VALUES
-- ('BK1728400000001', 'محمد أحمد', '0501234567', 'mohammed@example.com', 1, 1, '2025-10-09', '10:00:00', 'confirmed', 250.00, 250.00, 'unpaid', 'حجز عادي'),
-- ('BK1728400000002', 'فاطمة علي', '0507654321', 'fatima@example.com', 1, 2, '2025-10-09', '14:00:00', 'confirmed', 350.00, 350.00, 'unpaid', 'حجز مع طلبات خاصة');
