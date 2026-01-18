# سكريبت لتنظيف المشروع قبل البناء
# يغلق جميع عمليات Electron ويحذف مجلدات البناء

Write-Host "🧹 تنظيف المشروع..." -ForegroundColor Cyan

# 1. إغلاق جميع عمليات Electron
Write-Host "`n📌 إغلاق عمليات Electron..." -ForegroundColor Yellow
$electronProcesses = Get-Process | Where-Object { $_.Name -like "*electron*" -or $_.Name -eq "OneM" }
if ($electronProcesses) {
    $electronProcesses | ForEach-Object {
        Write-Host "   - إغلاق: $($_.Name) (PID: $($_.Id))" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "✅ تم إغلاق جميع عمليات Electron" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "✅ لا توجد عمليات Electron تعمل" -ForegroundColor Green
}

# 2. حذف مجلد release
Write-Host "`n📌 حذف مجلد release..." -ForegroundColor Yellow
if (Test-Path "release") {
    try {
        Remove-Item -Path "release" -Recurse -Force -ErrorAction Stop
        Write-Host "✅ تم حذف مجلد release" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  لم يتم حذف بعض الملفات (قد تكون مقفولة)" -ForegroundColor Yellow
        # محاولة حذف المحتويات فقط
        Get-ChildItem -Path "release" -Recurse -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "✅ مجلد release غير موجود" -ForegroundColor Green
}

# 3. حذف مجلد dist (اختياري)
Write-Host "`n📌 حذف مجلد dist..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✅ تم حذف مجلد dist" -ForegroundColor Green
} else {
    Write-Host "✅ مجلد dist غير موجود" -ForegroundColor Green
}

Write-Host "`n✅ اكتمل التنظيف!" -ForegroundColor Green
Write-Host "`n💡 الآن يمكنك تشغيل: npm run dist" -ForegroundColor Cyan

