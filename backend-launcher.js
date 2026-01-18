#!/usr/bin/env node

/**
 * Backend Launcher
 * يشغل npm start في مجلد backend
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// الألوان
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log('\n╔════════════════════════════════════════════╗');
console.log('║     OneM Backend Server (Development)     ║');
console.log('║     مخدم النظام الخلفي (وضع التطوير)      ║');
console.log('╚════════════════════════════════════════════╝\n');

// تحديد مجلد backend
const backendDir = path.join(__dirname, 'backend');

// التحقق من وجود مجلد backend
if (!fs.existsSync(backendDir)) {
  console.log(`${colors.red}❌ مجلد backend غير موجود!${colors.reset}`);
  console.log(`${colors.yellow}المسار المتوقع: ${backendDir}${colors.reset}\n`);
  process.exit(1);
}

// التحقق من وجود package.json
const packageJsonPath = path.join(backendDir, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.log(`${colors.red}❌ ملف backend/package.json غير موجود!${colors.reset}\n`);
  process.exit(1);
}

// التحقق من وجود node_modules
const nodeModulesPath = path.join(backendDir, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log(`${colors.yellow}⚠️  node_modules غير موجود!${colors.reset}`);
  console.log(`${colors.blue}📦 جاري تثبيت dependencies...${colors.reset}\n`);
  
  // تثبيت dependencies
  const install = spawn('npm', ['install'], {
    cwd: backendDir,
    stdio: 'inherit',
    shell: true
  });
  
  install.on('close', (code) => {
    if (code === 0) {
      console.log(`\n${colors.green}✅ تم تثبيت dependencies بنجاح${colors.reset}\n`);
      startBackend();
    } else {
      console.log(`\n${colors.red}❌ فشل تثبيت dependencies${colors.reset}\n`);
      process.exit(1);
    }
  });
} else {
  startBackend();
}

function startBackend() {
  console.log(`${colors.cyan}🚀 جاري بدء Backend Server...${colors.reset}`);
  console.log(`${colors.yellow}💡 التغييرات ستُحدّث تلقائياً (nodemon)${colors.reset}`);
  console.log(`${colors.yellow}💡 لإيقاف Server: اضغط Ctrl+C${colors.reset}\n`);
  
  console.log('═'.repeat(50) + '\n');
  
  // تشغيل npm start
  const backend = spawn('npm', ['start'], {
    cwd: backendDir,
    stdio: 'inherit',
    shell: true
  });
  
  backend.on('error', (err) => {
    console.log(`\n${colors.red}❌ خطأ في تشغيل Backend:${colors.reset}`, err.message);
    process.exit(1);
  });
  
  backend.on('close', (code) => {
    console.log(`\n${colors.yellow}Backend توقف بكود: ${code}${colors.reset}\n`);
    process.exit(code);
  });
  
  // التعامل مع إشارات الإيقاف
  process.on('SIGINT', () => {
    console.log(`\n${colors.yellow}🛑 إيقاف Backend...${colors.reset}`);
    backend.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    backend.kill('SIGTERM');
  });
}


