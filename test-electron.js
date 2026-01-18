/**
 * ملف اختبار بسيط للتحقق من أن كل شيء جاهز
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Testing Electron Setup...\n');

const checks = [
  {
    name: 'Electron files exist',
    check: () => {
      const files = ['electron/main.js', 'electron/preload.js', 'electron/backend-setup.js'];
      return files.every(file => fs.existsSync(file));
    }
  },
  {
    name: 'electron-builder.json exists',
    check: () => fs.existsSync('electron-builder.json')
  },
  {
    name: 'LICENSE file exists',
    check: () => fs.existsSync('LICENSE')
  },
  {
    name: 'package.json configured correctly',
    check: () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return pkg.main === 'electron/main.js' && 
             pkg.type === 'commonjs' &&
             pkg.scripts['electron:dev'] &&
             pkg.scripts['electron:build'];
    }
  },
  {
    name: 'vite.config.ts has base path',
    check: () => {
      const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
      return viteConfig.includes("base: mode === 'production' ? './' : '/'");
    }
  },
  {
    name: 'node_modules/electron exists',
    check: () => fs.existsSync('node_modules/electron')
  },
  {
    name: 'node_modules/electron-builder exists',
    check: () => fs.existsSync('node_modules/electron-builder')
  }
];

let passed = 0;
let failed = 0;

checks.forEach((test, index) => {
  try {
    const result = test.check();
    if (result) {
      console.log(`✅ ${index + 1}. ${test.name}`);
      passed++;
    } else {
      console.log(`❌ ${index + 1}. ${test.name}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${index + 1}. ${test.name} - Error: ${error.message}`);
    failed++;
  }
});

console.log('\n' + '='.repeat(50));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('🎉 All checks passed! You\'re ready to go!\n');
  console.log('Next steps:');
  console.log('  1. Run: npm run electron:dev');
  console.log('  2. Or build: npm run electron:build\n');
} else {
  console.log('⚠️  Some checks failed. Please review the errors above.\n');
  process.exit(1);
}

