@echo off
REM Build Script for Face Mask Detector Android App

echo ========================================
echo Face Mask Detector - Build Script
echo ========================================
echo.

REM Check if gradlew exists
if not exist "gradlew.bat" (
    echo ERROR: gradlew.bat not found!
    echo Make sure you're in the FaceMaskDetectorApp directory
    pause
    exit /b 1
)

echo [1/5] Cleaning previous builds...
call gradlew.bat clean
if errorlevel 1 (
    echo ERROR: Clean failed!
    pause
    exit /b 1
)

echo.
echo [2/5] Checking dependencies...
call gradlew.bat dependencies --configuration releaseRuntimeClasspath > nul
if errorlevel 1 (
    echo WARNING: Some dependencies may be missing
)

echo.
echo [3/5] Building debug APK for testing...
call gradlew.bat assembleDebug
if errorlevel 1 (
    echo ERROR: Debug build failed!
    pause
    exit /b 1
)

echo.
echo [4/5] Running lint checks...
call gradlew.bat lint
if errorlevel 1 (
    echo WARNING: Lint checks found issues
    echo Check app\build\reports\lint-results.html for details
)

echo.
echo [5/5] Building release AAB for Play Store...
call gradlew.bat bundleRelease
if errorlevel 1 (
    echo ERROR: Release build failed!
    echo Make sure you have configured signing in build.gradle
    pause
    exit /b 1
)

echo.
echo ========================================
echo BUILD SUCCESSFUL!
echo ========================================
echo.
echo Debug APK: app\build\outputs\apk\debug\app-debug.apk
echo Release AAB: app\build\outputs\bundle\release\app-release.aab
echo.
echo Next steps:
echo 1. Test the debug APK on a real device
echo 2. Sign the release AAB with your keystore
echo 3. Upload app-release.aab to Google Play Console
echo.
pause
