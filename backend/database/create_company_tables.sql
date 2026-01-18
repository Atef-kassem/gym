-- Create company_attachments table if not exists
CREATE TABLE IF NOT EXISTS `company_attachments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` int(11) unsigned NOT NULL,
  `file_type` enum('logo','commercial_register','tax_certificate','business_license','quality_certificate','high_quality_logo','facility_images','other_attachments','digital_signature') NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` bigint(20) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `status` enum('active','inactive','deleted') DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  KEY `file_type` (`file_type`),
  KEY `status` (`status`),
  CONSTRAINT `company_attachments_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create company_accounts table if not exists
CREATE TABLE IF NOT EXISTS `company_accounts` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` int(11) unsigned NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('admin','manager','user') DEFAULT 'admin',
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `last_login` datetime DEFAULT NULL,
  `password_changed_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `company_id` (`company_id`),
  KEY `status` (`status`),
  CONSTRAINT `company_accounts_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default company if not exists
INSERT IGNORE INTO `companies` (
  `id`, `arabicName`, `englishName`, `code`, `symbol`, `description`, 
  `country`, `city`, `neighborhood`, `street`, `postalCode`, 
  `phoneNumber`, `telephoneNumber`, `email`, `website`, 
  `taxRegistrationNumber`, `commercialRegistrationNumber`, 
  `status`, `createdAt`, `updatedAt`
) VALUES (
  1, 'مغاسل النجاح للمشروبات', 'Success Car Wash', 'SUCCESS001', 'SNC', 
  'شركة رائدة في مجال خدمات   وتنظيف  الكافية',
  'المملكة العربية المصرية', 'الرياض', 'حي الملقا', 'شارع الملك فهد', '12345',
  '+966501234567', '+966501234567', 'info@successcarwash.com', 'www.successcarwash.com',
  '300123456700003', '1234567890',
  'active', NOW(), NOW()
);

-- Insert default company account if not exists
INSERT IGNORE INTO `company_accounts` (
  `company_id`, `username`, `password_hash`, `email`, `role`, `status`, `created_at`, `updated_at`
) VALUES (
  1, 'admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8HqHqHq', 
  'info@successcarwash.com', 'admin', 'active', NOW(), NOW()
);
