-- إنشاء جداول نظام إدارة الدراجات النارية للتوصيل
-- Motorcycle Management System Tables

-- جدول الدراجات النارية
CREATE TABLE MOTORCYCLES (
    id INT PRIMARY KEY AUTO_INCREMENT,
    motorcycleCode VARCHAR(50) NOT NULL UNIQUE COMMENT 'رمز الدراجة النارية الفريد',
    plateNumber VARCHAR(20) NOT NULL UNIQUE COMMENT 'رقم اللوحة',
    brand VARCHAR(100) NOT NULL COMMENT 'الماركة',
    model VARCHAR(100) NOT NULL COMMENT 'الموديل',
    year INT NOT NULL COMMENT 'سنة الصنع',
    color VARCHAR(50) COMMENT 'اللون',
    engineNumber VARCHAR(100) COMMENT 'رقم المحرك',
    chassisNumber VARCHAR(100) COMMENT 'رقم الهيكل',
    capacity DECIMAL(5,2) COMMENT 'سعة المحرك (سي سي)',
    fuelType ENUM('بنزين', 'ديزل', 'كهربائي', 'هجين') NOT NULL DEFAULT 'بنزين' COMMENT 'نوع الوقود',
    status ENUM('متاح', 'في الخدمة', 'صيانة', 'معطل', 'محجوز') NOT NULL DEFAULT 'متاح' COMMENT 'حالة الدراجة',
    purchaseDate DATE COMMENT 'تاريخ الشراء',
    purchasePrice DECIMAL(15,2) COMMENT 'سعر الشراء',
    currentValue DECIMAL(15,2) COMMENT 'القيمة الحالية',
    insuranceNumber VARCHAR(100) COMMENT 'رقم التأمين',
    insuranceExpiry DATE COMMENT 'انتهاء التأمين',
    registrationExpiry DATE COMMENT 'انتهاء التسجيل',
    lastMaintenanceDate DATE COMMENT 'تاريخ آخر صيانة',
    nextMaintenanceDate DATE COMMENT 'تاريخ الصيانة القادمة',
    mileage INT DEFAULT 0 COMMENT 'المسافة المقطوعة (كم)',
    maxLoad DECIMAL(8,2) COMMENT 'الحد الأقصى للحمل (كجم)',
    fuelCapacity DECIMAL(6,2) COMMENT 'سعة خزان الوقود (لتر)',
    averageFuelConsumption DECIMAL(5,2) COMMENT 'متوسط استهلاك الوقود (لتر/100كم)',
    driverId INT COMMENT 'معرف السائق المخصص',
    branchId INT NOT NULL COMMENT 'معرف الفرع',
    companyId INT NOT NULL COMMENT 'معرف الشركة',
    notes TEXT COMMENT 'ملاحظات',
    isActive BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'نشط',
    createdBy INT COMMENT 'منشئ السجل',
    updatedBy INT COMMENT 'محدث السجل',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_motorcycle_code (motorcycleCode),
    INDEX idx_plate_number (plateNumber),
    INDEX idx_status (status),
    INDEX idx_branch_company (branchId, companyId),
    INDEX idx_driver (driverId),
    INDEX idx_fuel_type (fuelType)
) COMMENT 'جدول إدارة الدراجات النارية للتوصيل';

-- جدول صيانة الدراجات النارية
CREATE TABLE MOTORCYCLE_MAINTENANCE (
    id INT PRIMARY KEY AUTO_INCREMENT,
    maintenanceCode VARCHAR(50) NOT NULL UNIQUE COMMENT 'رمز الصيانة الفريد',
    motorcycleId INT NOT NULL COMMENT 'معرف الدراجة النارية',
    maintenanceType ENUM('صيانة دورية', 'صيانة طارئة', 'إصلاح', 'فحص', 'تنظيف') NOT NULL COMMENT 'نوع الصيانة',
    maintenanceDate DATE NOT NULL COMMENT 'تاريخ الصيانة',
    maintenanceTime TIME COMMENT 'وقت الصيانة',
    description TEXT COMMENT 'وصف الصيانة',
    mileage INT COMMENT 'المسافة المقطوعة وقت الصيانة',
    cost DECIMAL(15,2) DEFAULT 0 COMMENT 'تكلفة الصيانة',
    laborCost DECIMAL(15,2) DEFAULT 0 COMMENT 'تكلفة العمالة',
    partsCost DECIMAL(15,2) DEFAULT 0 COMMENT 'تكلفة القطع',
    workshopName VARCHAR(200) COMMENT 'اسم الورشة',
    workshopContact VARCHAR(100) COMMENT 'جهة اتصال الورشة',
    technicianName VARCHAR(100) COMMENT 'اسم الفني',
    nextMaintenanceDate DATE COMMENT 'تاريخ الصيانة القادمة',
    nextMaintenanceMileage INT COMMENT 'المسافة للصيانة القادمة',
    status ENUM('مجدولة', 'قيد التنفيذ', 'مكتملة', 'ملغاة') NOT NULL DEFAULT 'مجدولة' COMMENT 'حالة الصيانة',
    completedDate DATE COMMENT 'تاريخ الإنجاز',
    completedTime TIME COMMENT 'وقت الإنجاز',
    notes TEXT COMMENT 'ملاحظات',
    attachments JSON COMMENT 'مرفقات الصيانة',
    branchId INT NOT NULL COMMENT 'معرف الفرع',
    companyId INT NOT NULL COMMENT 'معرف الشركة',
    createdBy INT COMMENT 'منشئ السجل',
    updatedBy INT COMMENT 'محدث السجل',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_maintenance_code (maintenanceCode),
    INDEX idx_motorcycle (motorcycleId),
    INDEX idx_maintenance_date (maintenanceDate),
    INDEX idx_status (status),
    INDEX idx_type (maintenanceType),
    INDEX idx_branch_company (branchId, companyId),
    
    FOREIGN KEY (motorcycleId) REFERENCES MOTORCYCLES(id) ON DELETE CASCADE
) COMMENT 'جدول صيانة الدراجات النارية';

-- جدول سائقي التوصيل
CREATE TABLE DELIVERY_DRIVERS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    driverCode VARCHAR(50) NOT NULL UNIQUE COMMENT 'رمز السائق الفريد',
    name VARCHAR(200) NOT NULL COMMENT 'اسم السائق',
    nameEn VARCHAR(200) COMMENT 'اسم السائق بالإنجليزية',
    phone VARCHAR(20) NOT NULL COMMENT 'رقم الهاتف',
    email VARCHAR(200) COMMENT 'البريد الإلكتروني',
    nationalId VARCHAR(20) COMMENT 'رقم الهوية الوطنية',
    licenseNumber VARCHAR(50) NOT NULL COMMENT 'رقم رخصة القيادة',
    licenseType ENUM('دراجة نارية', 'مشروب', 'شاحنة صغيرة', 'شاحنة كبيرة') NOT NULL COMMENT 'نوع الرخصة',
    licenseExpiry DATE NOT NULL COMMENT 'انتهاء الرخصة',
    dateOfBirth DATE COMMENT 'تاريخ الميلاد',
    address TEXT COMMENT 'العنوان',
    emergencyContact VARCHAR(200) COMMENT 'جهة الاتصال في الطوارئ',
    emergencyPhone VARCHAR(20) COMMENT 'هاتف الطوارئ',
    hireDate DATE COMMENT 'تاريخ التوظيف',
    salary DECIMAL(15,2) COMMENT 'الراتب',
    commissionRate DECIMAL(5,2) DEFAULT 0 COMMENT 'نسبة العمولة (%)',
    status ENUM('نشط', 'غير نشط', 'إجازة', 'معلق', 'مستقيل') NOT NULL DEFAULT 'نشط' COMMENT 'حالة السائق',
    isAvailable BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'متاح للتوصيل',
    currentLocation JSON COMMENT 'الموقع الحالي',
    lastActiveTime TIMESTAMP COMMENT 'آخر وقت نشاط',
    totalDeliveries INT DEFAULT 0 COMMENT 'إجمالي التوصيلات',
    successfulDeliveries INT DEFAULT 0 COMMENT 'التوصيلات الناجحة',
    failedDeliveries INT DEFAULT 0 COMMENT 'التوصيلات الفاشلة',
    averageRating DECIMAL(3,2) DEFAULT 0 COMMENT 'متوسط التقييم',
    totalEarnings DECIMAL(15,2) DEFAULT 0 COMMENT 'إجمالي الأرباح',
    notes TEXT COMMENT 'ملاحظات',
    branchId INT NOT NULL COMMENT 'معرف الفرع',
    companyId INT NOT NULL COMMENT 'معرف الشركة',
    createdBy INT COMMENT 'منشئ السجل',
    updatedBy INT COMMENT 'محدث السجل',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_driver_code (driverCode),
    INDEX idx_phone (phone),
    INDEX idx_national_id (nationalId),
    INDEX idx_license_number (licenseNumber),
    INDEX idx_status (status),
    INDEX idx_available (isAvailable),
    INDEX idx_branch_company (branchId, companyId)
) COMMENT 'جدول سائقي التوصيل';

-- جدول طلبات التوصيل
CREATE TABLE DELIVERY_ORDERS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    orderNumber VARCHAR(50) NOT NULL UNIQUE COMMENT 'رقم طلب التوصيل الفريد',
    customerName VARCHAR(200) NOT NULL COMMENT 'اسم العميل',
    customerPhone VARCHAR(20) NOT NULL COMMENT 'هاتف العميل',
    customerAddress TEXT NOT NULL COMMENT 'عنوان العميل',
    deliveryAddress TEXT NOT NULL COMMENT 'عنوان التوصيل',
    deliveryLatitude DECIMAL(10,8) COMMENT 'خط العرض للتوصيل',
    deliveryLongitude DECIMAL(11,8) COMMENT 'خط الطول للتوصيل',
    orderDate TIMESTAMP NOT NULL COMMENT 'تاريخ الطلب',
    scheduledDeliveryDate TIMESTAMP COMMENT 'تاريخ التوصيل المحدد',
    actualDeliveryDate TIMESTAMP COMMENT 'تاريخ التوصيل الفعلي',
    motorcycleId INT COMMENT 'معرف الدراجة النارية',
    driverId INT COMMENT 'معرف السائق',
    driverName VARCHAR(200) COMMENT 'اسم السائق',
    driverPhone VARCHAR(20) COMMENT 'هاتف السائق',
    orderValue DECIMAL(15,2) NOT NULL DEFAULT 0 COMMENT 'قيمة الطلب',
    deliveryFee DECIMAL(10,2) DEFAULT 0 COMMENT 'رسوم التوصيل',
    totalAmount DECIMAL(15,2) NOT NULL DEFAULT 0 COMMENT 'المبلغ الإجمالي',
    paymentMethod ENUM('نقد', 'بطاقة ائتمان', 'تحويل بنكي', 'محفظة إلكترونية', 'عند التوصيل') NOT NULL DEFAULT 'نقد' COMMENT 'طريقة الدفع',
    paymentStatus ENUM('غير مدفوع', 'مدفوع', 'مدفوع جزئياً', 'مسترد') NOT NULL DEFAULT 'غير مدفوع' COMMENT 'حالة الدفع',
    status ENUM('جديد', 'قيد التحضير', 'جاهز للتوصيل', 'في الطريق', 'تم التوصيل', 'ملغي', 'مؤجل') NOT NULL DEFAULT 'جديد' COMMENT 'حالة الطلب',
    priority ENUM('عادي', 'عاجل', 'فائق العجلة') NOT NULL DEFAULT 'عادي' COMMENT 'أولوية الطلب',
    deliveryType ENUM('عادي', 'سريع', 'مجدول', 'مستعجل') NOT NULL DEFAULT 'عادي' COMMENT 'نوع التوصيل',
    estimatedDeliveryTime INT COMMENT 'الوقت المتوقع للتوصيل (دقيقة)',
    actualDeliveryTime INT COMMENT 'الوقت الفعلي للتوصيل (دقيقة)',
    distance DECIMAL(8,2) COMMENT 'المسافة (كم)',
    specialInstructions TEXT COMMENT 'تعليمات خاصة',
    customerNotes TEXT COMMENT 'ملاحظات العميل',
    deliveryNotes TEXT COMMENT 'ملاحظات التوصيل',
    rating INT COMMENT 'تقييم الخدمة (1-5)',
    feedback TEXT COMMENT 'تعليق العميل',
    cancellationReason TEXT COMMENT 'سبب الإلغاء',
    cancelledBy ENUM('العميل', 'النظام', 'السائق', 'الإدارة') COMMENT 'من ألغى الطلب',
    cancellationDate TIMESTAMP COMMENT 'تاريخ الإلغاء',
    branchId INT NOT NULL COMMENT 'معرف الفرع',
    companyId INT NOT NULL COMMENT 'معرف الشركة',
    createdBy INT COMMENT 'منشئ الطلب',
    updatedBy INT COMMENT 'محدث الطلب',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_order_number (orderNumber),
    INDEX idx_customer_phone (customerPhone),
    INDEX idx_order_date (orderDate),
    INDEX idx_status (status),
    INDEX idx_payment_status (paymentStatus),
    INDEX idx_priority (priority),
    INDEX idx_motorcycle (motorcycleId),
    INDEX idx_driver (driverId),
    INDEX idx_branch_company (branchId, companyId),
    
    FOREIGN KEY (motorcycleId) REFERENCES MOTORCYCLES(id) ON DELETE SET NULL,
    FOREIGN KEY (driverId) REFERENCES DELIVERY_DRIVERS(id) ON DELETE SET NULL
) COMMENT 'جدول طلبات التوصيل';

-- جدول عناصر طلبات التوصيل
CREATE TABLE DELIVERY_ORDER_ITEMS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    deliveryOrderId INT NOT NULL COMMENT 'معرف طلب التوصيل',
    productId INT COMMENT 'معرف المنتج',
    productName VARCHAR(200) NOT NULL COMMENT 'اسم المنتج',
    productCode VARCHAR(100) COMMENT 'رمز المنتج',
    description TEXT COMMENT 'وصف المنتج',
    quantity DECIMAL(10,3) NOT NULL COMMENT 'الكمية',
    unit VARCHAR(50) COMMENT 'الوحدة',
    unitPrice DECIMAL(15,2) NOT NULL COMMENT 'سعر الوحدة',
    totalPrice DECIMAL(15,2) NOT NULL COMMENT 'السعر الإجمالي',
    discount DECIMAL(15,2) DEFAULT 0 COMMENT 'الخصم',
    discountPercentage DECIMAL(5,2) DEFAULT 0 COMMENT 'نسبة الخصم',
    tax DECIMAL(15,2) DEFAULT 0 COMMENT 'الضريبة',
    taxPercentage DECIMAL(5,2) DEFAULT 0 COMMENT 'نسبة الضريبة',
    netAmount DECIMAL(15,2) NOT NULL COMMENT 'المبلغ الصافي',
    notes TEXT COMMENT 'ملاحظات',
    isDelivered BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'تم التوصيل',
    deliveredQuantity DECIMAL(10,3) DEFAULT 0 COMMENT 'الكمية المسلمة',
    returnedQuantity DECIMAL(10,3) DEFAULT 0 COMMENT 'الكمية المرتجعة',
    returnReason TEXT COMMENT 'سبب الإرجاع',
    branchId INT NOT NULL COMMENT 'معرف الفرع',
    companyId INT NOT NULL COMMENT 'معرف الشركة',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_delivery_order (deliveryOrderId),
    INDEX idx_product (productId),
    INDEX idx_branch_company (branchId, companyId),
    
    FOREIGN KEY (deliveryOrderId) REFERENCES DELIVERY_ORDERS(id) ON DELETE CASCADE
) COMMENT 'جدول عناصر طلبات التوصيل';

-- جدول تتبع التوصيل
CREATE TABLE DELIVERY_TRACKING (
    id INT PRIMARY KEY AUTO_INCREMENT,
    deliveryOrderId INT NOT NULL COMMENT 'معرف طلب التوصيل',
    motorcycleId INT COMMENT 'معرف الدراجة النارية',
    driverId INT COMMENT 'معرف السائق',
    status ENUM('جاهز للانطلاق', 'في الطريق', 'وصل للموقع', 'جاري التوصيل', 'تم التوصيل', 'فشل التوصيل') NOT NULL COMMENT 'حالة التتبع',
    latitude DECIMAL(10,8) COMMENT 'خط العرض',
    longitude DECIMAL(11,8) COMMENT 'خط الطول',
    address TEXT COMMENT 'العنوان',
    speed DECIMAL(6,2) COMMENT 'السرعة (كم/ساعة)',
    direction DECIMAL(6,2) COMMENT 'الاتجاه (درجة)',
    altitude DECIMAL(8,2) COMMENT 'الارتفاع (متر)',
    accuracy DECIMAL(8,2) COMMENT 'دقة الموقع (متر)',
    batteryLevel INT COMMENT 'مستوى البطارية (%)',
    signalStrength INT COMMENT 'قوة الإشارة (%)',
    timestamp TIMESTAMP NOT NULL COMMENT 'وقت التتبع',
    notes TEXT COMMENT 'ملاحظات',
    isActive BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'نشط',
    branchId INT NOT NULL COMMENT 'معرف الفرع',
    companyId INT NOT NULL COMMENT 'معرف الشركة',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_delivery_order (deliveryOrderId),
    INDEX idx_motorcycle (motorcycleId),
    INDEX idx_driver (driverId),
    INDEX idx_timestamp (timestamp),
    INDEX idx_status (status),
    INDEX idx_branch_company (branchId, companyId),
    
    FOREIGN KEY (deliveryOrderId) REFERENCES DELIVERY_ORDERS(id) ON DELETE CASCADE,
    FOREIGN KEY (motorcycleId) REFERENCES MOTORCYCLES(id) ON DELETE SET NULL,
    FOREIGN KEY (driverId) REFERENCES DELIVERY_DRIVERS(id) ON DELETE SET NULL
) COMMENT 'جدول تتبع التوصيل';

-- إضافة المفاتيح الخارجية للجداول الموجودة
-- ربط الدراجات النارية بالفروع والشركات
ALTER TABLE MOTORCYCLES 
ADD CONSTRAINT fk_motorcycles_branch 
FOREIGN KEY (branchId) REFERENCES branches(id) ON DELETE RESTRICT;

ALTER TABLE MOTORCYCLES 
ADD CONSTRAINT fk_motorcycles_company 
FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE RESTRICT;

-- ربط صيانة الدراجات النارية بالفروع والشركات
ALTER TABLE MOTORCYCLE_MAINTENANCE 
ADD CONSTRAINT fk_maintenance_branch 
FOREIGN KEY (branchId) REFERENCES branches(id) ON DELETE RESTRICT;

ALTER TABLE MOTORCYCLE_MAINTENANCE 
ADD CONSTRAINT fk_maintenance_company 
FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE RESTRICT;

-- ربط سائقي التوصيل بالفروع والشركات
ALTER TABLE DELIVERY_DRIVERS 
ADD CONSTRAINT fk_drivers_branch 
FOREIGN KEY (branchId) REFERENCES branches(id) ON DELETE RESTRICT;

ALTER TABLE DELIVERY_DRIVERS 
ADD CONSTRAINT fk_drivers_company 
FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE RESTRICT;

-- ربط طلبات التوصيل بالفروع والشركات
ALTER TABLE DELIVERY_ORDERS 
ADD CONSTRAINT fk_orders_branch 
FOREIGN KEY (branchId) REFERENCES branches(id) ON DELETE RESTRICT;

ALTER TABLE DELIVERY_ORDERS 
ADD CONSTRAINT fk_orders_company 
FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE RESTRICT;

-- ربط عناصر طلبات التوصيل بالفروع والشركات
ALTER TABLE DELIVERY_ORDER_ITEMS 
ADD CONSTRAINT fk_order_items_branch 
FOREIGN KEY (branchId) REFERENCES branches(id) ON DELETE RESTRICT;

ALTER TABLE DELIVERY_ORDER_ITEMS 
ADD CONSTRAINT fk_order_items_company 
FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE RESTRICT;

-- ربط تتبع التوصيل بالفروع والشركات
ALTER TABLE DELIVERY_TRACKING 
ADD CONSTRAINT fk_tracking_branch 
FOREIGN KEY (branchId) REFERENCES branches(id) ON DELETE RESTRICT;

ALTER TABLE DELIVERY_TRACKING 
ADD CONSTRAINT fk_tracking_company 
FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE RESTRICT;

-- إدراج بيانات تجريبية
INSERT INTO MOTORCYCLES (
    motorcycleCode, plateNumber, brand, model, year, color, fuelType, 
    status, branchId, companyId, createdBy
) VALUES 
('MC001', 'ABC-123', 'Honda', 'CBR150R', 2023, 'أحمر', 'بنزين', 'متاح', 1, 1, 1),
('MC002', 'DEF-456', 'Yamaha', 'YZF-R15', 2022, 'أزرق', 'بنزين', 'في الخدمة', 1, 1, 1),
('MC003', 'GHI-789', 'Kawasaki', 'Ninja 250', 2023, 'أخضر', 'كهربائي', 'صيانة', 1, 1, 1);

INSERT INTO DELIVERY_DRIVERS (
    driverCode, name, phone, licenseNumber, licenseType, licenseExpiry,
    status, isAvailable, branchId, companyId, createdBy
) VALUES 
('DRV001', 'أحمد محمد', '0501234567', 'LIC123456', 'دراجة نارية', '2025-12-31', 'نشط', TRUE, 1, 1, 1),
('DRV002', 'محمد علي', '0507654321', 'LIC789012', 'دراجة نارية', '2024-06-30', 'نشط', FALSE, 1, 1, 1),
('DRV003', 'سعد أحمد', '0509876543', 'LIC345678', 'مشروب', '2025-03-15', 'إجازة', FALSE, 1, 1, 1);
