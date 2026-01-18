-- إنشاء جدول إشعارات المدين
CREATE TABLE IF NOT EXISTS `debit_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `debit_number` varchar(50) NOT NULL,
  `debit_date` date NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `po_number` varchar(50) DEFAULT NULL,
  `purchase_order_id` int(11) DEFAULT NULL,
  `invoice_number` varchar(50) DEFAULT NULL,
  `invoice_id` int(11) DEFAULT NULL,
  `reason` varchar(255) NOT NULL,
  `reason_details` text,
  `debit_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` enum('مسودة','بانتظار الموافقة','معتمد','مرفوض','مرسل للمورد','مكتمل') NOT NULL DEFAULT 'مسودة',
  `approver` varchar(100) DEFAULT NULL,
  `approved_by` varchar(100) DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `sent_date` datetime DEFAULT NULL,
  `notes` text,
  `branch_id` int(11) DEFAULT NULL,
  `branch_name` varchar(100) DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `debit_number` (`debit_number`),
  KEY `supplier_id` (`supplier_id`),
  KEY `purchase_order_id` (`purchase_order_id`),
  KEY `invoice_id` (`invoice_id`),
  KEY `branch_id` (`branch_id`),
  KEY `status` (`status`),
  KEY `debit_date` (`debit_date`),
  CONSTRAINT `debit_notes_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`) ON DELETE CASCADE,
  CONSTRAINT `debit_notes_ibfk_2` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`) ON DELETE SET NULL,
  CONSTRAINT `debit_notes_ibfk_3` FOREIGN KEY (`invoice_id`) REFERENCES `purchase_invoices` (`id`) ON DELETE SET NULL,
  CONSTRAINT `debit_notes_ibfk_4` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- إنشاء جدول أصناف إشعارات المدين
CREATE TABLE IF NOT EXISTS `debit_note_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `debit_note_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `quantity` decimal(10,2) NOT NULL DEFAULT '0.00',
  `unit_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `unit` varchar(50) DEFAULT 'piece',
  `item_id` int(11) DEFAULT NULL,
  `purchase_order_item_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `debit_note_id` (`debit_note_id`),
  KEY `item_id` (`item_id`),
  KEY `purchase_order_item_id` (`purchase_order_item_id`),
  CONSTRAINT `debit_note_items_ibfk_1` FOREIGN KEY (`debit_note_id`) REFERENCES `debit_notes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `debit_note_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `products` (`id`) ON DELETE SET NULL,
  CONSTRAINT `debit_note_items_ibfk_3` FOREIGN KEY (`purchase_order_item_id`) REFERENCES `purchase_order_items` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- إضافة فهارس إضافية لتحسين الأداء
CREATE INDEX `idx_debit_notes_supplier_status` ON `debit_notes` (`supplier_id`, `status`);
CREATE INDEX `idx_debit_notes_branch_status` ON `debit_notes` (`branch_id`, `status`);
CREATE INDEX `idx_debit_notes_date_status` ON `debit_notes` (`debit_date`, `status`);
CREATE INDEX `idx_debit_notes_amount` ON `debit_notes` (`debit_amount`);
CREATE INDEX `idx_debit_notes_reason` ON `debit_notes` (`reason`);

-- إضافة فهارس لجدول الأصناف
CREATE INDEX `idx_debit_note_items_debit_note` ON `debit_note_items` (`debit_note_id`);
CREATE INDEX `idx_debit_note_items_amount` ON `debit_note_items` (`amount`);
