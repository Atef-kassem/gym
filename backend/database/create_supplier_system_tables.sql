-- =====================================================
-- إنشاء جداول نظام الموردين الشامل
-- =====================================================

-- جدول الموردين
CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  supplierCode VARCHAR(50) UNIQUE NOT NULL COMMENT 'رمز المورد الفريد',
  supplierName VARCHAR(255) NOT NULL COMMENT 'اسم المورد',
  supplierNameEn VARCHAR(255) COMMENT 'اسم المورد بالإنجليزية',
  contactPerson VARCHAR(255) COMMENT 'الشخص المسؤول عن التواصل',
  phone VARCHAR(20) COMMENT 'رقم الهاتف',
  mobile VARCHAR(20) COMMENT 'رقم الجوال',
  email VARCHAR(255) COMMENT 'البريد الإلكتروني',
  website VARCHAR(255) COMMENT 'الموقع الإلكتروني',
  address TEXT COMMENT 'العنوان',
  city VARCHAR(100) COMMENT 'المدينة',
  country VARCHAR(100) COMMENT 'الدولة',
  postalCode VARCHAR(20) COMMENT 'الرمز البريدي',
  taxNumber VARCHAR(50) COMMENT 'الرقم الضريبي',
  commercialRecord VARCHAR(50) COMMENT 'السجل التجاري',
  bankName VARCHAR(255) COMMENT 'اسم البنك',
  bankAccountNumber VARCHAR(50) COMMENT 'رقم الحساب البنكي',
  bankIBAN VARCHAR(50) COMMENT 'رقم الآيبان',
  paymentTerms INT DEFAULT 30 COMMENT 'شروط الدفع بالأيام',
  creditLimit DECIMAL(15,2) DEFAULT 0 COMMENT 'الحد الائتماني',
  currentBalance DECIMAL(15,2) DEFAULT 0 COMMENT 'الرصيد الحالي',
  supplierCategory VARCHAR(100) COMMENT 'فئة المورد',
  supplyRegion VARCHAR(100) COMMENT 'منطقة التوريد',
  supplierRating INT DEFAULT 0 COMMENT 'تقييم المورد (0-5)',
  status ENUM('نشط', 'غير نشط', 'معلق', 'محظور') DEFAULT 'نشط' COMMENT 'حالة المورد',
  notes TEXT COMMENT 'ملاحظات إضافية',
  attachments JSON COMMENT 'المرفقات (ملفات، صور، مستندات)',
  companyId INT COMMENT 'معرف الشركة',
  branchId INT COMMENT 'معرف الفرع',
  createdBy INT COMMENT 'معرف المستخدم الذي أنشأ المورد',
  updatedBy INT COMMENT 'معرف المستخدم الذي حدث المورد',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP NULL,
  INDEX idx_supplier_code (supplierCode),
  INDEX idx_supplier_name (supplierName),
  INDEX idx_supplier_email (email),
  INDEX idx_supplier_phone (phone),
  INDEX idx_supplier_status (status),
  INDEX idx_supplier_category (supplierCategory),
  INDEX idx_supplier_region (supplyRegion),
  INDEX idx_company_id (companyId),
  INDEX idx_branch_id (branchId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول الموردين';

-- جدول إيصالات الموردين
CREATE TABLE IF NOT EXISTS supplier_invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoiceNumber VARCHAR(100) UNIQUE NOT NULL COMMENT 'رقم الايصال الفريد',
  supplierId INT NOT NULL COMMENT 'معرف المورد',
  branchId INT COMMENT 'معرف الفرع',
  warehouseId INT COMMENT 'معرف المستودع',
  invoiceDate DATE NOT NULL COMMENT 'تاريخ الايصال',
  dueDate DATE COMMENT 'تاريخ الاستحقاق',
  deliveryDate DATE COMMENT 'تاريخ التسليم',
  referenceNumber VARCHAR(100) COMMENT 'رقم المرجع (طلب الشراء، أمر الشراء)',
  referenceType ENUM('طلب_شراء', 'أمر_شراء', 'إيصال_استلام', 'أخرى') COMMENT 'نوع المرجع',
  subtotal DECIMAL(15,2) DEFAULT 0 COMMENT 'المجموع الفرعي',
  taxAmount DECIMAL(15,2) DEFAULT 0 COMMENT 'مبلغ الضريبة',
  discountAmount DECIMAL(15,2) DEFAULT 0 COMMENT 'مبلغ الخصم',
  shippingAmount DECIMAL(15,2) DEFAULT 0 COMMENT 'مبلغ الشحن',
  totalAmount DECIMAL(15,2) DEFAULT 0 COMMENT 'إجمالي المبلغ',
  paidAmount DECIMAL(15,2) DEFAULT 0 COMMENT 'المبلغ المدفوع',
  remainingAmount DECIMAL(15,2) DEFAULT 0 COMMENT 'المبلغ المتبقي',
  currency VARCHAR(3) DEFAULT 'SAR' COMMENT 'العملة',
  exchangeRate DECIMAL(10,4) DEFAULT 1 COMMENT 'سعر الصرف',
  paymentTerms INT COMMENT 'شروط الدفع بالأيام',
  paymentMethod ENUM('تحويل_بنكي', 'شيك', 'نقد', 'بطاقة_ائتمان', 'أخرى') COMMENT 'طريقة الدفع',
  status ENUM('مسودة', 'مرسل', 'مستلم', 'مؤكد', 'مدفوع', 'جزئي', 'متأخر', 'ملغي') DEFAULT 'مسودة' COMMENT 'حالة الايصال',
  approvalStatus ENUM('في_انتظار', 'موافق', 'مرفوض', 'معلق') DEFAULT 'في_انتظار' COMMENT 'حالة الموافقة',
  approvedBy INT COMMENT 'معرف المستخدم المعتمد',
  approvedAt TIMESTAMP NULL COMMENT 'تاريخ الموافقة',
  notes TEXT COMMENT 'ملاحظات الايصال',
  internalNotes TEXT COMMENT 'ملاحظات داخلية',
  attachments JSON COMMENT 'المرفقات (ملفات، صور، مستندات)',
  isRecurring BOOLEAN DEFAULT FALSE COMMENT 'هل هي ايصال متكررة',
  recurringFrequency ENUM('يومي', 'أسبوعي', 'شهري', 'ربع_سنوي', 'سنوي') COMMENT 'تكرار الايصال',
  nextInvoiceDate DATE COMMENT 'تاريخ الايصال التالية',
  createdBy INT COMMENT 'معرف المستخدم الذي أنشأ الايصال',
  updatedBy INT COMMENT 'معرف المستخدم الذي حدث الايصال',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP NULL,
  INDEX idx_invoice_number (invoiceNumber),
  INDEX idx_supplier_id (supplierId),
  INDEX idx_branch_id (branchId),
  INDEX idx_warehouse_id (warehouseId),
  INDEX idx_invoice_date (invoiceDate),
  INDEX idx_due_date (dueDate),
  INDEX idx_status (status),
  INDEX idx_approval_status (approvalStatus),
  INDEX idx_reference_number (referenceNumber),
  FOREIGN KEY (supplierId) REFERENCES suppliers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول إيصالات الموردين';

-- جدول عناصر إيصالات الموردين
CREATE TABLE IF NOT EXISTS supplier_invoice_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoiceId INT NOT NULL COMMENT 'معرف الايصال',
  productId INT COMMENT 'معرف المنتج',
  productName VARCHAR(255) NOT NULL COMMENT 'اسم المنتج',
  productCode VARCHAR(100) COMMENT 'رمز المنتج',
  description TEXT COMMENT 'وصف المنتج',
  unit VARCHAR(50) COMMENT 'الوحدة',
  quantity DECIMAL(10,3) DEFAULT 1 COMMENT 'الكمية',
  receivedQuantity DECIMAL(10,3) DEFAULT 0 COMMENT 'الكمية المستلمة',
  unitPrice DECIMAL(15,4) DEFAULT 0 COMMENT 'سعر الوحدة',
  taxRate DECIMAL(5,2) DEFAULT 0 COMMENT 'نسبة الضريبة',
  taxAmount DECIMAL(15,2) DEFAULT 0 COMMENT 'مبلغ الضريبة',
  discountRate DECIMAL(5,2) DEFAULT 0 COMMENT 'نسبة الخصم',
  discountAmount DECIMAL(15,2) DEFAULT 0 COMMENT 'مبلغ الخصم',
  subtotal DECIMAL(15,2) DEFAULT 0 COMMENT 'المجموع الفرعي',
  totalAmount DECIMAL(15,2) DEFAULT 0 COMMENT 'إجمالي المبلغ',
  notes TEXT COMMENT 'ملاحظات إضافية',
  specifications JSON COMMENT 'المواصفات التقنية',
  warranty VARCHAR(255) COMMENT 'الضمان',
  expiryDate DATE COMMENT 'تاريخ انتهاء الصلاحية',
  batchNumber VARCHAR(100) COMMENT 'رقم الدفعة',
  serialNumber VARCHAR(100) COMMENT 'الرقم التسلسلي',
  isService BOOLEAN DEFAULT FALSE COMMENT 'هل هو خدمة',
  serviceDate DATE COMMENT 'تاريخ الخدمة',
  serviceDuration INT COMMENT 'مدة الخدمة بالأيام',
  createdBy INT COMMENT 'معرف المستخدم الذي أنشأ العنصر',
  updatedBy INT COMMENT 'معرف المستخدم الذي حدث العنصر',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_invoice_id (invoiceId),
  INDEX idx_product_id (productId),
  INDEX idx_product_code (productCode),
  FOREIGN KEY (invoiceId) REFERENCES supplier_invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول عناصر إيصالات الموردين';

-- جدول مدفوعات الموردين
CREATE TABLE IF NOT EXISTS supplier_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paymentNumber VARCHAR(100) UNIQUE NOT NULL COMMENT 'رقم الدفعة الفريد',
  supplierId INT NOT NULL COMMENT 'معرف المورد',
  invoiceId INT COMMENT 'معرف الايصال المرتبطة',
  branchId INT COMMENT 'معرف الفرع',
  paymentDate DATE NOT NULL COMMENT 'تاريخ الدفع',
  dueDate DATE COMMENT 'تاريخ الاستحقاق',
  paymentAmount DECIMAL(15,2) DEFAULT 0 COMMENT 'مبلغ الدفع',
  originalAmount DECIMAL(15,2) DEFAULT 0 COMMENT 'المبلغ الأصلي',
  remainingAmount DECIMAL(15,2) DEFAULT 0 COMMENT 'المبلغ المتبقي',
  currency VARCHAR(3) DEFAULT 'SAR' COMMENT 'العملة',
  exchangeRate DECIMAL(10,4) DEFAULT 1 COMMENT 'سعر الصرف',
  paymentMethod ENUM('تحويل_بنكي', 'شيك', 'نقد', 'بطاقة_ائتمان', 'أخرى') NOT NULL COMMENT 'طريقة الدفع',
  bankName VARCHAR(255) COMMENT 'اسم البنك',
  bankAccount VARCHAR(100) COMMENT 'رقم الحساب البنكي',
  transferNumber VARCHAR(100) COMMENT 'رقم التحويل',
  checkNumber VARCHAR(100) COMMENT 'رقم الشيك',
  checkDate DATE COMMENT 'تاريخ الشيك',
  status ENUM('مسودة', 'مؤكد', 'مدفوع', 'جزئي', 'معلق', 'متأخر', 'ملغي') DEFAULT 'مسودة' COMMENT 'حالة الدفع',
  approvalStatus ENUM('في_انتظار', 'موافق', 'مرفوض', 'معلق') DEFAULT 'في_انتظار' COMMENT 'حالة الموافقة',
  approvedBy INT COMMENT 'معرف المستخدم المعتمد',
  approvedAt TIMESTAMP NULL COMMENT 'تاريخ الموافقة',
  priority ENUM('عادي', 'عالي', 'عاجل') DEFAULT 'عادي' COMMENT 'أولوية الدفع',
  paymentType ENUM('دفعة_كاملة', 'دفعة_جزئية', 'دفعة_مقدمة', 'دفعة_مؤجلة') DEFAULT 'دفعة_كاملة' COMMENT 'نوع الدفعة',
  notes TEXT COMMENT 'ملاحظات الدفع',
  internalNotes TEXT COMMENT 'ملاحظات داخلية',
  attachments JSON COMMENT 'المرفقات (إيصالات، مستندات)',
  isRecurring BOOLEAN DEFAULT FALSE COMMENT 'هل هي دفعة متكررة',
  recurringFrequency ENUM('يومي', 'أسبوعي', 'شهري', 'ربع_سنوي', 'سنوي') COMMENT 'تكرار الدفعة',
  nextPaymentDate DATE COMMENT 'تاريخ الدفعة التالية',
  lateFees DECIMAL(15,2) DEFAULT 0 COMMENT 'رسوم التأخير',
  discountAmount DECIMAL(15,2) DEFAULT 0 COMMENT 'مبلغ الخصم',
  discountReason VARCHAR(255) COMMENT 'سبب الخصم',
  createdBy INT COMMENT 'معرف المستخدم الذي أنشأ الدفعة',
  updatedBy INT COMMENT 'معرف المستخدم الذي حدث الدفعة',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP NULL,
  INDEX idx_payment_number (paymentNumber),
  INDEX idx_supplier_id (supplierId),
  INDEX idx_invoice_id (invoiceId),
  INDEX idx_branch_id (branchId),
  INDEX idx_payment_date (paymentDate),
  INDEX idx_due_date (dueDate),
  INDEX idx_status (status),
  INDEX idx_approval_status (approvalStatus),
  INDEX idx_payment_method (paymentMethod),
  INDEX idx_transfer_number (transferNumber),
  INDEX idx_check_number (checkNumber),
  FOREIGN KEY (supplierId) REFERENCES suppliers(id) ON DELETE CASCADE,
  FOREIGN KEY (invoiceId) REFERENCES supplier_invoices(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول مدفوعات الموردين';

-- إضافة البيانات الأولية للموردين
INSERT INTO suppliers (supplierCode, supplierName, supplierNameEn, contactPerson, phone, mobile, email, address, city, country, supplierCategory, supplyRegion, supplierRating, status, notes) VALUES
('SUP-001', 'مؤسسة العناية بالزيوت', 'Oil Care Foundation', 'أحمد محمد', '+966501234567', '+966501234567', 'ahmed@oilcare.com', 'شارع الملك فهد، الرياض', 'الرياض', 'المملكة العربية المصرية', 'زيوت ومواد تشحيم', 'الرياض', 5, 'نشط', 'مورد موثوق للزيوت والمواد التشحيم'),
('SUP-002', 'متجر قطع    الأوروبية', 'European Spare Parts Store', 'سارة أحمد', '+966502345678', '+966502345678', 'sara@europarts.com', 'شارع التحلية، جدة', 'جدة', 'المملكة العربية المصرية', 'مشروب ومنتجات', 'جدة', 4, 'نشط', 'متخصص في قطع    الأوروبية'),
('SUP-003', 'شركة المواد الكيميائية المتقدمة', 'Advanced Chemical Materials Co.', 'محمد علي', '+966503456789', '+966503456789', 'mohamed@chemadv.com', 'شارع العليا، الرياض', 'الرياض', 'المملكة العربية المصرية', 'مواد كيميائية', 'الرياض', 4, 'نشط', 'شركة رائدة في المواد الكيميائية'),
('SUP-004', 'مجموعة الشرق للتوريدات', 'Eastern Supply Group', 'فاطمة حسن', '+966504567890', '+966504567890', 'fatima@eastgroup.com', 'شارع الملك خالد، الدمام', 'الدمام', 'المملكة العربية المصرية', 'توريدات عامة', 'الشرقية', 3, 'نشط', 'مجموعة متكاملة للتوريدات'),
('SUP-005', 'مصنع البلاستيك الحديث', 'Modern Plastic Factory', 'خالد عبدالله', '+966505678901', '+966505678901', 'khalid@modernplastic.com', 'المنطقة الصناعية، الخبر', 'الخبر', 'المملكة العربية المصرية', 'بلاستيك', 'الشرقية', 4, 'نشط', 'مصنع متخصص في منتجات البلاستيك');

-- إضافة إيصالات تجريبية
INSERT INTO supplier_invoices (invoiceNumber, supplierId, invoiceDate, dueDate, subtotal, taxAmount, discountAmount, shippingAmount, totalAmount, paidAmount, remainingAmount, status, approvalStatus, notes) VALUES
('INV-2024-001', 1, '2024-03-15', '2024-04-15', 15000.00, 2250.00, 0.00, 0.00, 17250.00, 17250.00, 0.00, 'مدفوع', 'موافق', 'ايصال زيوت محركات'),
('INV-2024-002', 2, '2024-03-10', '2024-04-10', 25000.00, 3750.00, 1000.00, 500.00, 27250.00, 15000.00, 12250.00, 'جزئي', 'موافق', 'ايصال مشروب ومنتجات'),
('INV-2024-003', 3, '2024-03-25', '2024-04-25', 8500.00, 1275.00, 0.00, 0.00, 9775.00, 0.00, 9775.00, 'متأخر', 'موافق', 'ايصال مواد كيميائية'),
('INV-2024-004', 4, '2024-03-28', '2024-04-28', 12750.00, 1912.50, 500.00, 0.00, 14162.50, 0.00, 14162.50, 'معلق', 'في_انتظار', 'ايصال توريدات عامة');

-- إضافة عناصر الإيصالات
INSERT INTO supplier_invoice_items (invoiceId, productName, productCode, quantity, unitPrice, taxRate, discountRate, subtotal, taxAmount, discountAmount, totalAmount, unit) VALUES
(1, 'زيت محرك 5W-30', 'OIL-001', 100, 150.00, 15.00, 0.00, 15000.00, 2250.00, 0.00, 17250.00, 'لتر'),
(2, 'فلتر هواء محرك', 'FIL-001', 50, 400.00, 15.00, 5.00, 20000.00, 3000.00, 1000.00, 22000.00, '  '),
(2, 'شمعات إشعال', 'SPK-001', 100, 50.00, 15.00, 0.00, 5000.00, 750.00, 0.00, 5750.00, '  '),
(3, 'مادة تنظيف محرك', 'CLEAN-001', 50, 170.00, 15.00, 0.00, 8500.00, 1275.00, 0.00, 9775.00, 'لتر'),
(4, 'أدوات صيانة', 'TOOL-001', 25, 510.00, 15.00, 5.00, 12750.00, 1912.50, 500.00, 14162.50, '  ');

-- إضافة مدفوعات تجريبية
INSERT INTO supplier_payments (paymentNumber, supplierId, invoiceId, paymentDate, dueDate, paymentAmount, originalAmount, remainingAmount, paymentMethod, status, approvalStatus, priority, notes) VALUES
('PAY-2024-001', 1, 1, '2024-03-15', '2024-04-15', 17250.00, 17250.00, 0.00, 'تحويل_بنكي', 'مدفوع', 'موافق', 'عادي', 'دفع كامل للايصال'),
('PAY-2024-002', 2, 2, '2024-03-10', '2024-04-10', 15000.00, 27250.00, 12250.00, 'شيك', 'جزئي', 'موافق', 'عالي', 'دفعة جزئية'),
('PAY-2024-003', 3, 3, '2024-04-05', '2024-04-25', 0.00, 9775.00, 9775.00, 'تحويل_بنكي', 'متأخر', 'في_انتظار', 'عاجل', 'في انتظار الموافقة'),
('PAY-2024-004', 4, 4, '2024-04-10', '2024-04-28', 0.00, 14162.50, 14162.50, 'تحويل_بنكي', 'معلق', 'في_انتظار', 'عادي', 'ايصال معلقة');

-- إضافة فهارس إضافية لتحسين الأداء
CREATE INDEX idx_suppliers_company_branch ON suppliers(companyId, branchId);
CREATE INDEX idx_invoices_supplier_status ON supplier_invoices(supplierId, status);
CREATE INDEX idx_payments_supplier_status ON supplier_payments(supplierId, status);
CREATE INDEX idx_invoice_items_product ON supplier_invoice_items(productId, productCode);

-- إضافة قيود الفهرسة
ALTER TABLE suppliers ADD CONSTRAINT fk_suppliers_company FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE SET NULL;
ALTER TABLE suppliers ADD CONSTRAINT fk_suppliers_branch FOREIGN KEY (branchId) REFERENCES branches(id) ON DELETE SET NULL;
ALTER TABLE supplier_invoices ADD CONSTRAINT fk_invoices_branch FOREIGN KEY (branchId) REFERENCES branches(id) ON DELETE SET NULL;
ALTER TABLE supplier_payments ADD CONSTRAINT fk_payments_branch FOREIGN KEY (branchId) REFERENCES branches(id) ON DELETE SET NULL;

COMMIT;
