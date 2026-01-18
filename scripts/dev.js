/**
 * سكريبت لتشغيل التطبيق في وضع التطوير
 * يقوم بتشغيل Backend و Frontend و Electron معاً
 */

const { spawn } = require('child_process');
const path = require('path');

// الألوان للـ console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// تشغيل Backend
function startBackend() {
  return new Promise((resolve, reject) => {
    log('🚀 Starting Backend Server...', colors.blue);
    
    const backend = spawn('node', ['app.js'], {
      cwd: path.join(__dirname, '../backend'),
      stdio: 'inherit',
      shell: true
    });

    backend.on('error', (err) => {
      log('❌ Backend Error: ' + err.message, colors.red);
      reject(err);
    });

    // انتظار قليلاً حتى يبدأ Backend
    setTimeout(() => {
      log('✅ Backend Server Running on https://metagym.metacodecx.com', colors.green);
      resolve(backend);
    }, 3000);
  });
}

// تشغيل Frontend
function startFrontend() {
  return new Promise((resolve) => {
    log('🚀 Starting Frontend (Vite)...', colors.blue);
    
    const frontend = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    });

    frontend.on('error', (err) => {
      log('❌ Frontend Error: ' + err.message, colors.red);
    });

    // انتظار حتى يبدأ Vite
    setTimeout(() => {
      log('✅ Frontend Running on http://localhost:5173', colors.green);
      resolve(frontend);
    }, 5000);
  });
}

// تشغيل Electron
function startElectron() {
  log('🚀 Starting Electron...', colors.blue);
  
  const electron = spawn('npm', ['run', 'electron'], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      NODE_ENV: 'development'
    }
  });

  electron.on('error', (err) => {
    log('❌ Electron Error: ' + err.message, colors.red);
  });

  electron.on('exit', (code) => {
    log('🛑 Electron closed with code ' + code, colors.yellow);
    process.exit(code);
  });

  return electron;
}

// تشغيل كل شيء
async function start() {
  try {
    log('════════════════════════════════════════', colors.bright);
    log('    OneM Development Environment', colors.bright);
    log('════════════════════════════════════════', colors.bright);
    
    const backend = await startBackend();
    const frontend = await startFrontend();
    const electron = startElectron();

    log('════════════════════════════════════════', colors.bright);
    log('✅ All services started successfully!', colors.green);
    log('════════════════════════════════════════', colors.bright);

    // التعامل مع إغلاق التطبيق
    process.on('SIGINT', () => {
      log('\n🛑 Shutting down...', colors.yellow);
      backend.kill();
      frontend.kill();
      electron.kill();
      process.exit(0);
    });

  } catch (error) {
    log('❌ Failed to start development environment:', colors.red);
    log(error.message, colors.red);
    process.exit(1);
  }
}

start();

