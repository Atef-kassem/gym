/**
 * وحدة تشخيص الأخطاء بالتفصيل
 * Error Logger with Detailed Diagnostics
 */

const fs = require('fs');
const path = require('path');

class ErrorLogger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDirectory();
  }

  // إنشاء مجلد السجلات إذا لم يكن موجوداً
  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  // تسجيل الخطأ مع التفاصيل الكاملة
  logError(error, context = {}, additionalInfo = {}) {
    const timestamp = new Date().toISOString();
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const errorDetails = {
      errorId,
      timestamp,
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      sql: error.sql,
      parameters: error.parameters,
      context: context,
      additionalInfo: additionalInfo,
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
      }
    };

    // طباعة في الكونسول
    this.logToConsole(errorDetails);
    
    // حفظ في ملف
    this.logToFile(errorDetails);
    
    return errorId;
  }

  // طباعة تفصيلية في الكونسول
  logToConsole(errorDetails) {
    console.log('\n' + '='.repeat(80));
    console.log('🚨 خطأ مفصل في النظام');
    console.log('='.repeat(80));
    
    console.log(`📋 معرف الخطأ: ${errorDetails.errorId}`);
    console.log(`⏰ الوقت: ${errorDetails.timestamp}`);
    console.log(`🔍 نوع الخطأ: ${errorDetails.name}`);
    console.log(`💬 الرسالة: ${errorDetails.message}`);
    
    if (errorDetails.code) {
      console.log(`🔢 كود الخطأ: ${errorDetails.code}`);
    }
    
    if (errorDetails.sql) {
      console.log('\n📊 استعلام SQL:');
      console.log(errorDetails.sql);
    }
    
    if (errorDetails.parameters) {
      console.log('\n📝 معاملات SQL:');
      console.log(JSON.stringify(errorDetails.parameters, null, 2));
    }
    
    if (errorDetails.context && Object.keys(errorDetails.context).length > 0) {
      console.log('\n🎯 السياق:');
      Object.entries(errorDetails.context).forEach(([key, value]) => {
        console.log(`   ${key}: ${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}`);
      });
    }
    
    if (errorDetails.additionalInfo && Object.keys(errorDetails.additionalInfo).length > 0) {
      console.log('\n📋 معلومات إضافية:');
      Object.entries(errorDetails.additionalInfo).forEach(([key, value]) => {
        console.log(`   ${key}: ${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}`);
      });
    }
    
    console.log('\n📚 Stack Trace:');
    console.log(errorDetails.stack);
    
    console.log('\n💻 معلومات النظام:');
    console.log(`   Node.js: ${errorDetails.systemInfo.nodeVersion}`);
    console.log(`   النظام: ${errorDetails.systemInfo.platform} ${errorDetails.systemInfo.arch}`);
    console.log(`   وقت التشغيل: ${Math.floor(errorDetails.systemInfo.uptime)} ثانية`);
    console.log(`   استخدام الذاكرة: ${Math.round(errorDetails.systemInfo.memoryUsage.heapUsed / 1024 / 1024)} MB`);
    
    console.log('='.repeat(80) + '\n');
  }

  // حفظ في ملف
  logToFile(errorDetails) {
    const date = new Date().toISOString().split('T')[0];
    const filename = `error_${date}.log`;
    const filepath = path.join(this.logDir, filename);
    
    const logEntry = JSON.stringify(errorDetails, null, 2) + '\n' + '-'.repeat(100) + '\n';
    
    fs.appendFileSync(filepath, logEntry);
  }

  // تسجيل معلومات عامة
  logInfo(message, data = {}) {
    const timestamp = new Date().toISOString();
    console.log(`\n📝 [${timestamp}] ${message}`);
    
    if (Object.keys(data).length > 0) {
      console.log('   البيانات:', JSON.stringify(data, null, 2));
    }
  }

  // تسجيل تحذيرات
  logWarning(message, data = {}) {
    const timestamp = new Date().toISOString();
    console.log(`\n⚠️  [${timestamp}] تحذير: ${message}`);
    
    if (Object.keys(data).length > 0) {
      console.log('   البيانات:', JSON.stringify(data, null, 2));
    }
  }

  // تسجيل نجاح العمليات
  logSuccess(message, data = {}) {
    const timestamp = new Date().toISOString();
    console.log(`\n✅ [${timestamp}] نجح: ${message}`);
    
    if (Object.keys(data).length > 0) {
      console.log('   البيانات:', JSON.stringify(data, null, 2));
    }
  }
}

// إنشاء instance واحد للنظام
const errorLogger = new ErrorLogger();

module.exports = errorLogger;
