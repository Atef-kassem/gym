# Script to fix Kotlin Compile Daemon Connection Issues

Write-Host "Fixing Kotlin Compile Daemon..." -ForegroundColor Cyan
Write-Host ""

# Change to project directory
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

Write-Host "1. Stopping Gradle Daemon..." -ForegroundColor Yellow
Set-Location "android"
if (Test-Path "gradlew.bat") {
    & .\gradlew.bat --stop 2>&1 | Out-Null
    Write-Host "   Done: Gradle Daemon stopped" -ForegroundColor Green
} else {
    Write-Host "   Warning: gradlew.bat not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "2. Cleaning build directories..." -ForegroundColor Yellow

# Clean Flutter
Set-Location ".."
if (Get-Command flutter -ErrorAction SilentlyContinue) {
    flutter clean 2>&1 | Out-Null
    Write-Host "   Done: Flutter build cleaned" -ForegroundColor Green
} else {
    Write-Host "   Warning: Flutter not found in PATH" -ForegroundColor Yellow
}

# Clean Gradle
Set-Location "android"
if (Test-Path "gradlew.bat") {
    & .\gradlew.bat clean 2>&1 | Out-Null
    Write-Host "   Done: Gradle build cleaned" -ForegroundColor Green
}

# Remove temporary build directories
$buildDirs = @(
    "build",
    "app\build",
    ".gradle",
    "app\.gradle"
)

foreach ($dir in $buildDirs) {
    if (Test-Path $dir) {
        Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "   Done: Removed $dir" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "3. Cleaning Kotlin Daemon cache..." -ForegroundColor Yellow

# Clean Kotlin daemon cache
$kotlinCache = "$env:USERPROFILE\.kotlin\daemon"
if (Test-Path $kotlinCache) {
    Get-ChildItem -Path $kotlinCache -Filter "*.log" -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
    Write-Host "   Done: Kotlin daemon cache cleaned" -ForegroundColor Green
}

# Clean Gradle cache
$gradleCache = "$env:USERPROFILE\.gradle\caches"
if (Test-Path "$gradleCache\modules-2") {
    Write-Host "   Info: Cleaning Gradle cache (may take time)..." -ForegroundColor Cyan
    Remove-Item -Path "$gradleCache\modules-2\files-2.1\org.jetbrains.kotlin" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   Done: Kotlin removed from Gradle cache" -ForegroundColor Green
}

Write-Host ""
Write-Host "4. Getting packages..." -ForegroundColor Yellow
Set-Location ".."
if (Get-Command flutter -ErrorAction SilentlyContinue) {
    flutter pub get 2>&1 | Out-Null
    Write-Host "   Done: Packages fetched" -ForegroundColor Green
}

Write-Host ""
Write-Host "Done! Cleanup completed." -ForegroundColor Green
Write-Host ""
Write-Host "Next step:" -ForegroundColor Cyan
Write-Host "  flutter build apk --debug" -ForegroundColor White
Write-Host ""
Write-Host "If the problem persists, try:" -ForegroundColor Yellow
Write-Host "  cd android" -ForegroundColor White
Write-Host "  .\gradlew.bat --no-daemon clean" -ForegroundColor White
Write-Host "  cd .." -ForegroundColor White
Write-Host "  flutter build apk --debug" -ForegroundColor White
Write-Host ""
