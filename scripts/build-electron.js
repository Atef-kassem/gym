/**
 * سكريبت لبناء التطبيق للإنتاج
 */

const { spawn } = require('child_process');
const fs = require('fs');
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

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    proc.on('error', reject);
    proc.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

async function build() {
  try {
    log('════════════════════════════════════════', colors.bright);
    log('    Building OneM Desktop Application', colors.bright);
    log('════════════════════════════════════════', colors.bright);

    // 1. بناء Frontend
    log('\n📦 Step 1/3: Building Frontend...', colors.blue);
    await runCommand('npm', ['run', 'build'], {
      env: {
        ...process.env,
        BUILD_TARGET: 'electron',
      },
    });
    log('✅ Frontend built successfully', colors.green);

    // 2. التحقق من وجود dist
    if (!fs.existsSync('dist')) {
      throw new Error('dist folder not found after build');
    }
    log('✅ dist folder verified', colors.green);

    // 3. بناء Electron
    log('\n📦 Step 2/3: Packaging with Electron Builder...', colors.blue);
    const platform = process.platform === 'win32' ? 'win' : 
                     process.platform === 'darwin' ? 'mac' : 'linux';
    
    await runCommand('electron-builder', ['--' + platform, '--publish', 'never']);
    log('✅ Electron app packaged successfully', colors.green);

    // 4. عرض النتائج
    log('\n════════════════════════════════════════', colors.bright);
    log('✅ Build completed successfully!', colors.green);
    log('════════════════════════════════════════', colors.bright);
    log('\n📂 Output directory: release/', colors.yellow);
    
    if (fs.existsSync('release')) {
      const files = fs.readdirSync('release');
      log('\n📄 Generated files:', colors.blue);
      files.forEach(file => {
        const stats = fs.statSync(path.join('release', file));
        const size = (stats.size / (1024 * 1024)).toFixed(2);
        log(`   - ${file} (${size} MB)`, colors.reset);
      });
    }

    log('\n🎉 You can now run the application from the release folder!', colors.green);

  } catch (error) {
    log('\n❌ Build failed:', colors.red);
    log(error.message, colors.red);
    process.exit(1);
  }
}

build();

