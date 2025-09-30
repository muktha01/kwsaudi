@echo off
echo 🔧 Translation System Troubleshooting Script
echo ==========================================
echo.

echo 📋 Step 1: Testing Backend Connection
echo --------------------------------------
node test-backend.mjs
echo.

echo 📋 Step 2: Seeding Sample Translations (if needed)
echo ------------------------------------------------
set /p seed="Do you want to seed sample translations? (y/n): "
if /i "%seed%"=="y" (
    node seed-translations.mjs
    echo.
)

echo 📋 Step 3: Instructions
echo -----------------------
echo 1. Make sure your backend server is running:
echo    cd Backend-lokesh
echo    npm start
echo.
echo 2. Your frontend should be running on: http://localhost:3001
echo 3. Check the browser console for translation status logs
echo 4. Look for the 🌐 icon in the top-right corner of your website
echo.

echo ✅ Troubleshooting complete!
pause