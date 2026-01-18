#!/usr/bin/env node

/**
 * Standalone Backend Server Launcher
 * يمكن تحويل هذا الملف إلى .exe مستقل
 */

console.log('╔════════════════════════════════════════════╗');
console.log('║     OneM Backend Server                    ║');
console.log('║     مخدم النظام الخلفي                     ║');
console.log('╚════════════════════════════════════════════╝');
console.log('');

// تحديد PORT
const PORT = process.env.PORT || 5000;

// بدء Backend
console.log('🚀 بدء Backend Server...');
console.log('📍 Port:', PORT);
console.log('');

// استيراد التطبيق الرئيسي
try {
    require('./app.js');
    
    console.log('');
    console.log('╔════════════════════════════════════════════╗');
    console.log('║  ✅ Backend Server يعمل الآن!              ║');
    console.log('║                                            ║');
    console.log(`║  🌐 URL: http://localhost:${PORT}         ║`);
    console.log('║                                            ║');
    console.log('║  لإيقاف Server: اضغط Ctrl+C              ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');
    
} catch (error) {
    console.error('');
    console.error('╔════════════════════════════════════════════╗');
    console.error('║  ❌ فشل في بدء Backend Server             ║');
    console.error('╚════════════════════════════════════════════╝');
    console.error('');
    console.error('الخطأ:', error.message);
    console.error('');
    process.exit(1);
}

