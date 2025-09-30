@echo off
echo 🚀 Starting Translation Migration from ar.json to Backend Database...
echo.

echo 📋 Prerequisites Check:
echo 1. Backend server should be running on http://localhost:5001
echo 2. MongoDB should be connected
echo 3. ar.json file should exist in src/translations/
echo.

pause

echo ⏳ Running migration script...
node src/scripts/migrateTranslations.mjs

echo.
echo ✅ Migration completed! 
echo 💡 Check your admin dashboard to verify the translations were imported.
echo 🌐 Your frontend website should now sync with backend translations automatically.

pause