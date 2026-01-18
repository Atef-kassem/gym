@echo off
chcp 65001 >nul
cls
echo ╔════════════════════════════════════════════╗
echo ║     OneM Backend Server (Development)     ║
echo ║     مخدم النظام الخلفي (وضع التطوير)      ║
echo ╚════════════════════════════════════════════╝
echo.
echo 🚀 جاري بدء Backend Server بـ nodemon...
echo 💡 التغييرات ستُحدّث تلقائياً
echo.

REM الانتقال لمجلد backend
cd backend

REM التحقق من وجود node_modules
if not exist "node_modules\" (
    echo ⚠️  node_modules غير موجود!
    echo 📦 جاري تثبيت dependencies...
    echo.
    npm install
    echo.
)

REM تشغيل npm start
echo ✅ بدء Backend...
echo.
npm start

REM إذا توقف، انتظر
echo.
echo ❌ Backend توقف
pause

