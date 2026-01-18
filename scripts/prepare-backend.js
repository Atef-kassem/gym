/**
 * سكريبت للتأكد من أن Backend جاهز للتضمين في التطبيق
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n🔧 إعداد Backend للتضمين في التطبيق...\n');

const backendDir = path.join(__dirname, '..', 'backend');

// التحقق من وجود مجلد Backend
if (!fs.existsSync(backendDir)) {
  console.error('❌ مجلد backend غير موجود!');
  process.exit(1);
}

// التحقق من وجود package.json
const packageJsonPath = path.join(backendDir, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ ملف backend/package.json غير موجود!');
  process.exit(1);
}

console.log('✅ مجلد Backend موجود');

// التحقق من node_modules
const nodeModulesPath = path.join(backendDir, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 تثبيت dependencies الخاصة بـ Backend...');
  try {
    execSync('npm install', { 
      cwd: backendDir, 
      stdio: 'inherit' 
    });
    console.log('✅ تم تثبيت dependencies بنجاح');
  } catch (error) {
    console.error('❌ فشل تثبيت dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ dependencies الخاصة بـ Backend مثبتة بالفعل');
}

// التحقق من ملف app.js
const appJsPath = path.join(backendDir, 'app.js');
if (!fs.existsSync(appJsPath)) {
  console.error('❌ ملف backend/app.js غير موجود!');
  process.exit(1);
}

console.log('✅ ملف app.js موجود');

// حساب حجم Backend التقريبي
const getDirectorySize = (dirPath) => {
  let size = 0;
  try {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        size += getDirectorySize(filePath);
      } else {
        size += stats.size;
      }
    });
  } catch (e) {
    // تجاهل الأخطاء
  }
  return size;
};

const backendSize = getDirectorySize(backendDir);
const sizeMB = (backendSize / (1024 * 1024)).toFixed(2);

console.log(`\n📊 حجم Backend: ${sizeMB} MB`);
console.log('\n✅ Backend جاهز للتضمين في التطبيق!\n');

