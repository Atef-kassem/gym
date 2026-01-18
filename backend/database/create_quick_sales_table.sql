-- إنشاء جدول البيع السريع
-- ملاحظة: اسم الجدول بأحرف صغيرة للتوافق مع Sequelize
CREATE TABLE IF NOT EXISTS `quick_sales` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `sale_number` VARCHAR(50) NOT NULL UNIQUE COMMENT 'رقم البيع',
  `customer_id` INT NULL COMMENT 'معرف العميل (إذا كان مسجل)',
  `customer_name` VARCHAR(100) NULL COMMENT 'اسم العميل',
  `customer_phone` VARCHAR(20) NULL COMMENT 'رقم الهاتف',
  `branch_id` INT NOT NULL COMMENT 'معرف الفرع',
  `cashier_id` INT NULL COMMENT 'معرف الكاشير',
  `sale_date` DATE NOT NULL COMMENT 'تاريخ البيع',
  `sale_time` TIME NOT NULL COMMENT 'وقت البيع',
  `items` JSON NOT NULL COMMENT 'المنتجات المباعة',
  `subtotal` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'المجموع الفرعي',
  `discount_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'قيمة الخصم',
  `discount_percentage` DECIMAL(5, 2) NOT NULL DEFAULT 0.00 COMMENT 'نسبة الخصم',
  `tax_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'قيمة الضريبة',
  `tax_percentage` DECIMAL(5, 2) NOT NULL DEFAULT 15.00 COMMENT 'نسبة الضريبة',
  `total_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'المبلغ الإجمالي',
  `payment_method` ENUM('cash', 'card', 'wallet', 'transfer', 'mixed') NOT NULL DEFAULT 'cash' COMMENT 'طريقة الدفع',
  `payment_details` JSON NULL COMMENT 'تفاصيل الدفع (للمدفوعات المختلطة)',
  `status` ENUM('completed', 'refunded', 'cancelled') NOT NULL DEFAULT 'completed' COMMENT 'حالة البيع',
  `notes` TEXT NULL COMMENT 'ملاحظات',
  `loyalty_points_earned` INT NOT NULL DEFAULT 0 COMMENT 'نقاط الولاء المكتسبة',
  `loyalty_points_used` INT NOT NULL DEFAULT 0 COMMENT 'نقاط الولاء المستخدمة',
  `receipt_printed` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'هل تم طباعة الايصال',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'تاريخ التحديث',
  
  INDEX `idx_sale_number` (`sale_number`),
  INDEX `idx_customer_id` (`customer_id`),
  INDEX `idx_branch_id` (`branch_id`),
  INDEX `idx_sale_date` (`sale_date`),
  INDEX `idx_status` (`status`),
  INDEX `idx_payment_method` (`payment_method`),
  INDEX `idx_created_at` (`created_at`),
  
  FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `CUSTOMERS`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول البيع السريع';

-- إنشاء جدول تفاصيل البيع السريع (اختياري للبحث والتقارير)
CREATE TABLE IF NOT EXISTS `quick_sale_items` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `sale_id` INT NOT NULL COMMENT 'معرف البيع',
  `product_id` INT NULL COMMENT 'معرف المنتج',
  `product_name` VARCHAR(200) NOT NULL COMMENT 'اسم المنتج',
  `product_sku` VARCHAR(100) NULL COMMENT 'كود المنتج',
  `quantity` DECIMAL(10, 3) NOT NULL COMMENT 'الكمية',
  `unit_price` DECIMAL(10, 2) NOT NULL COMMENT 'سعر الوحدة',
  `discount_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'قيمة الخصم',
  `subtotal` DECIMAL(10, 2) NOT NULL COMMENT 'المجموع الفرعي',
  `total` DECIMAL(10, 2) NOT NULL COMMENT 'المجموع الكلي',
  `notes` VARCHAR(500) NULL COMMENT 'ملاحظات على المنتج',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  INDEX `idx_sale_id` (`sale_id`),
  INDEX `idx_product_id` (`product_id`),
  INDEX `idx_created_at` (`created_at`),
  
  FOREIGN KEY (`sale_id`) REFERENCES `quick_sales`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول تفاصيل البيع السريع';

-- إضافة بيانات تجريبية (اختياري)
-- INSERT INTO `QUICK_SALES` 
-- (`sale_number`, `customer_name`, `customer_phone`, `branch_id`, `sale_date`, `sale_time`, `items`, `subtotal`, `tax_amount`, `total_amount`, `payment_method`, `status`)
-- VALUES
-- ('QS1728400000001', 'عميل نقدي', '0501234567', 1, CURDATE(), CURTIME(), '[]', 150.00, 22.50, 172.50, 'cash', 'completed');
