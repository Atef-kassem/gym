# سكريبت لبناء Backend كملف .exe منفصل

Write-Host "🚀 بناء Backend Server كملف .exe منفصل..." -ForegroundColor Cyan
Write-Host ""

# الانتقال إلى مجلد backend
Set-Location backend

# التحقق من تثبيت pkg
Write-Host "📦 التحقق من pkg..." -ForegroundColor Yellow
$pkgInstalled = Get-Command pkg -ErrorAction SilentlyContinue
if (-not $pkgInstalled) {
    Write-Host "❌ pkg غير مثبت. جاري التثبيت..." -ForegroundColor Red
    npm install -g pkg
    Write-Host "✅ pkg مثبت" -ForegroundColor Green
} else {
    Write-Host "✅ pkg جاهز" -ForegroundColor Green
}

# التحقق من وجود app.js
if (-not (Test-Path "app.js")) {
    Write-Host "❌ ملف app.js غير موجود!" -ForegroundColor Red
    exit 1
}

# إنشاء مجلد release إذا لم يكن موجوداً
if (-not (Test-Path "../release")) {
    New-Item -ItemType Directory -Path "../release" | Out-Null
}

# بناء Backend.exe
Write-Host ""
Write-Host "🔨 جاري بناء Backend.exe..." -ForegroundColor Yellow
Write-Host "⏳ هذا قد يستغرق بضع دقائق..." -ForegroundColor Gray
Write-Host ""

pkg app.js --targets node18-win-x64 --output ../release/OneM-Backend.exe --compress GZip

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ تم بناء Backend.exe بنجاح!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📁 الملف موجود في: release\OneM-Backend.exe" -ForegroundColor Cyan
    
    # حجم الملف
    $file = Get-Item "../release/OneM-Backend.exe"
    $sizeMB = [math]::Round($file.Length / 1MB, 2)
    Write-Host "📊 الحجم: $sizeMB MB" -ForegroundColor Gray
    
    Write-Host ""
    Write-Host "🎯 لتشغيل Backend:" -ForegroundColor Yellow
    Write-Host "   1. اذهب إلى مجلد release" -ForegroundColor White
    Write-Host "   2. انقر نقراً مزدوجاً على OneM-Backend.exe" -ForegroundColor White
    Write-Host "   3. سيعمل Backend على https://metagym.metacodecx.com" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ فشل بناء Backend.exe" -ForegroundColor Red
    Write-Host "راجع الأخطاء أعلاه" -ForegroundColor Yellow
}

# العودة للمجلد الرئيسي
Set-Location ..

