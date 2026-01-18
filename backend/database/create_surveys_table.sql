-- Create surveys table if not exists
CREATE TABLE IF NOT EXISTS `surveys` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `status` enum('draft','active','paused','completed','archived') DEFAULT 'draft',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `response_count` int(11) DEFAULT '0',
  `target_count` int(11) DEFAULT '0',
  `category` varchar(100) DEFAULT NULL,
  `type` enum('satisfaction','nps','feedback','market_research','employee') DEFAULT 'satisfaction',
  `questions` json DEFAULT NULL,
  `distribution` json DEFAULT NULL,
  `analytics` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create survey_responses table if not exists
CREATE TABLE IF NOT EXISTS `survey_responses` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `survey_id` int(11) unsigned NOT NULL,
  `customer_id` int(11) unsigned DEFAULT NULL,
  `response_data` json NOT NULL,
  `score` decimal(3,2) DEFAULT NULL,
  `feedback` text,
  `completed_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `survey_id` (`survey_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `survey_responses_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`) ON DELETE CASCADE,
  CONSTRAINT `survey_responses_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
