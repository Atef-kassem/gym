-- إدراج شركات تجريبية
-- Insert Sample Companies for Testing

-- تحقق من وجود جدول الشركات
-- Check if companies table exists

-- إدراج شركة تجريبية 1
INSERT INTO companies (
    companyName, 
    arabicName, 
    englishName, 
    email, 
    phoneNumber, 
    address, 
    city, 
    country,
    isActive,
    createdAt,
    updatedAt
) VALUES (
    'شركة التوصيل السريع',
    'شركة التوصيل السريع',
    'Fast Delivery Company',
    'info@fastdelivery.com',
    '+966112345678',
    'شارع الملك فهد، حي النخيل',
    'الرياض',
    'المملكة العربية المصرية',
    1,
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE companyName = companyName;

-- إدراج شركة تجريبية 2
INSERT INTO companies (
    companyName, 
    arabicName, 
    englishName, 
    email, 
    phoneNumber, 
    address, 
    city, 
    country,
    isActive,
    createdAt,
    updatedAt
) VALUES (
    'شركة الخدمات اللوجستية',
    'شركة الخدمات اللوجستية',
    'Logistics Services Company',
    'info@logistics.com',
    '+966112345679',
    'شارع العليا، حي السفارات',
    'الرياض',
    'المملكة العربية المصرية',
    1,
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE companyName = companyName;

-- إدراج شركة تجريبية 3
INSERT INTO companies (
    companyName, 
    arabicName, 
    englishName, 
    email, 
    phoneNumber, 
    address, 
    city, 
    country,
    isActive,
    createdAt,
    updatedAt
) VALUES (
    'شركة النقل الحديث',
    'شركة النقل الحديث',
    'Modern Transport Company',
    'info@moderntransport.com',
    '+966112345680',
    'طريق الملك عبدالله، حي الياسمين',
    'الرياض',
    'المملكة العربية المصرية',
    1,
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE companyName = companyName;

-- عرض الشركات المضافة
SELECT 
    id,
    companyName,
    arabicName,
    englishName,
    email,
    phoneNumber,
    city,
    isActive
FROM companies
ORDER BY id DESC
LIMIT 10;

