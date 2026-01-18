-- جدول الحركات المخزنية
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id VARCHAR(255) PRIMARY KEY,
    type ENUM('استلام', 'صرف', 'تحويل', 'جرد', 'إتلاف', 'مرتجع مشتريات', 'مرتجع مبيعات') NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    source_warehouse_id VARCHAR(255) NOT NULL,
    target_warehouse_id VARCHAR(255) NULL,
    reference VARCHAR(255) NULL,
    user_id VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    status ENUM('معتمدة', 'غير معتمدة', 'مسودة') DEFAULT 'مسودة',
    notes TEXT NULL,
    reason TEXT NULL,
    branch_id VARCHAR(255) NOT NULL,
    branch_name VARCHAR(255) NOT NULL,
    total_amount DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NULL,
    updated_by VARCHAR(255) NULL,
    
    INDEX idx_inventory_transactions_type (type),
    INDEX idx_inventory_transactions_status (status),
    INDEX idx_inventory_transactions_date (date),
    INDEX idx_inventory_transactions_branch (branch_id),
    INDEX idx_inventory_transactions_user (user_id),
    INDEX idx_inventory_transactions_source_warehouse (source_warehouse_id),
    INDEX idx_inventory_transactions_target_warehouse (target_warehouse_id)
);

-- جدول أصناف الحركات المخزنية
CREATE TABLE IF NOT EXISTS inventory_transaction_items (
    id VARCHAR(255) PRIMARY KEY,
    transaction_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NULL,
    item_code VARCHAR(255) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(15,3) NOT NULL,
    unit VARCHAR(100) NOT NULL,
    price DECIMAL(15,2) DEFAULT 0.00,
    total DECIMAL(15,2) DEFAULT 0.00,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (transaction_id) REFERENCES inventory_transactions(id) ON DELETE CASCADE,
    INDEX idx_transaction_items_transaction (transaction_id),
    INDEX idx_transaction_items_product (product_id),
    INDEX idx_transaction_items_item_code (item_code)
);

-- جدول مرفقات الحركات المخزنية
CREATE TABLE IF NOT EXISTS inventory_transaction_attachments (
    id VARCHAR(255) PRIMARY KEY,
    transaction_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT DEFAULT 0,
    mime_type VARCHAR(100) NULL,
    uploaded_by VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (transaction_id) REFERENCES inventory_transactions(id) ON DELETE CASCADE,
    INDEX idx_transaction_attachments_transaction (transaction_id)
);

-- جدول سجل تغييرات الحركات المخزنية
CREATE TABLE IF NOT EXISTS inventory_transaction_logs (
    id VARCHAR(255) PRIMARY KEY,
    transaction_id VARCHAR(255) NOT NULL,
    action ENUM('created', 'updated', 'approved', 'rejected', 'deleted') NOT NULL,
    old_data JSON NULL,
    new_data JSON NULL,
    changed_by VARCHAR(255) NOT NULL,
    change_reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (transaction_id) REFERENCES inventory_transactions(id) ON DELETE CASCADE,
    INDEX idx_transaction_logs_transaction (transaction_id),
    INDEX idx_transaction_logs_action (action),
    INDEX idx_transaction_logs_changed_by (changed_by)
);

-- إدراج بيانات تجريبية
INSERT IGNORE INTO inventory_transactions (
    id, type, date, time, source_warehouse_id, target_warehouse_id, 
    reference, user_id, user_name, status, notes, reason, 
    branch_id, branch_name, total_amount
) VALUES 
    ('INV-2024-001', 'استلام', '2024-01-15', '10:30:00', 'WH-001', NULL, 
     'PO-1001', 'USR-001', 'أحمد محمد', 'معتمدة', 'استلام من المورد الرئيسي', 'تجديد المخزون',
     'MAIN', 'الفرع الرئيسي', 2250.00),
    ('INV-2024-002', 'صرف', '2024-01-16', '14:15:00', 'WH-001', NULL,
     'SRV-001', 'USR-002', 'سارة أحمد', 'معتمدة', 'صرف للخدمة', 'استخدام في الخدمة',
     'MAIN', 'الفرع الرئيسي', 0.00),
    ('INV-2024-003', 'تحويل', '2024-01-17', '09:00:00', 'WH-001', 'WH-002',
     'TRANS-001', 'USR-003', 'محمد علي', 'مسودة', 'نقل للفرع', 'إعادة توزيع المخزون',
     'MAIN', 'الفرع الرئيسي', 0.00);

-- إدراج أصناف تجريبية للحركات
INSERT IGNORE INTO inventory_transaction_items (
    id, transaction_id, product_id, item_code, item_name, 
    quantity, unit, price, total
) VALUES 
    ('ITM-001', 'INV-2024-001', 'PROD-001', 'OIL001', 'زيت محرك 5W-30', 
     50.000, 'لتر', 45.00, 2250.00),
    ('ITM-002', 'INV-2024-002', 'PROD-002', 'SOAP001', 'صابون مركز', 
     5.000, 'عبوة', 0.00, 0.00),
    ('ITM-003', 'INV-2024-003', 'PROD-003', 'TOWEL001', 'فوطة ميكروفايبر', 
     20.000, '  ', 0.00, 0.00);
