// Enhanced Translation Migration Script
// Run this script to sync your static ar.json file with the backend database

import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Configuration
const CONFIG = {
  BACKEND_URL: 'http://localhost:5001/api',
  AR_JSON_PATH: '../src/translations/ar.json',
  BATCH_SIZE: 50,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000
};

console.log('🚀 Starting Enhanced Translation Migration...\n');

// Utility function to wait/delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test backend connectivity
async function testBackendConnection() {
  try {
    console.log('🔗 Testing backend connection...');
    const response = await axios.get(`${CONFIG.BACKEND_URL}/test`, {
      timeout: 5001
    });
    
    if (response.status === 200) {
      console.log('✅ Backend connection successful');
      return true;
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    console.error('💡 Make sure your backend server is running on port 5001');
    return false;
  }
}

// Load translations from ar.json
function loadTranslationsFromFile() {
  try {
    const filePath = path.resolve(CONFIG.AR_JSON_PATH);
    console.log(`📁 Loading translations from: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`ar.json file not found at: ${filePath}`);
    }
    
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const translations = JSON.parse(rawData);
    
    console.log(`✅ Loaded ${Object.keys(translations).length} translations from ar.json`);
    return translations;
  } catch (error) {
    console.error('❌ Error loading ar.json:', error.message);
    throw error;
  }
}

// Get existing translations from backend
async function getExistingTranslations() {
  try {
    console.log('📥 Fetching existing translations from backend...');
    const response = await axios.get(`${CONFIG.BACKEND_URL}/translations`, {
      timeout: 10000
    });
    
    const existing = response.data || [];
    console.log(`✅ Found ${existing.length} existing translations in backend`);
    
    return existing.reduce((acc, translation) => {
      if (translation.key) {
        acc[translation.key] = translation;
      }
      return acc;
    }, {});
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('ℹ️ No existing translations found (starting fresh)');
      return {};
    }
    console.error('❌ Error fetching existing translations:', error.message);
    throw error;
  }
}

// Create or update translation with retry logic
async function upsertTranslation(key, value, existingTranslations, attempt = 1) {
  try {
    const existing = existingTranslations[key];
    
    if (existing && existing.value === value) {
      // Skip if translation already exists and is identical
      return { action: 'skipped', key };
    }
    
    if (existing) {
      // Update existing translation
      const response = await axios.put(
        `${CONFIG.BACKEND_URL}/translations/${existing._id}`,
        { key, value },
        { timeout: 5001 }
      );
      return { action: 'updated', key, data: response.data };
    } else {
      // Create new translation
      const response = await axios.post(
        `${CONFIG.BACKEND_URL}/translations`,
        { key, value },
        { timeout: 5001 }
      );
      return { action: 'created', key, data: response.data };
    }
  } catch (error) {
    if (attempt < CONFIG.RETRY_ATTEMPTS) {
      console.log(`⚠️ Retrying ${key} (attempt ${attempt + 1}/${CONFIG.RETRY_ATTEMPTS})`);
      await delay(CONFIG.RETRY_DELAY);
      return upsertTranslation(key, value, existingTranslations, attempt + 1);
    }
    
    console.error(`❌ Failed to upsert translation "${key}":`, error.message);
    return { action: 'error', key, error: error.message };
  }
}

// Process translations in batches
async function processTranslationsBatch(translations, existingTranslations, batchNumber, totalBatches) {
  console.log(`🔄 Processing batch ${batchNumber}/${totalBatches} (${translations.length} items)...`);
  
  const results = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: []
  };
  
  for (const [key, value] of translations) {
    const result = await upsertTranslation(key, value, existingTranslations);
    
    switch (result.action) {
      case 'created':
        results.created++;
        console.log(`➕ Created: ${key}`);
        break;
      case 'updated':
        results.updated++;
        console.log(`✏️ Updated: ${key}`);
        break;
      case 'skipped':
        results.skipped++;
        break;
      case 'error':
        results.errors.push({ key, error: result.error });
        break;
    }
  }
  
  return results;
}

// Main migration function
async function migrateTranslations() {
  try {
    // Test backend connection
    const isBackendReady = await testBackendConnection();
    if (!isBackendReady) {
      throw new Error('Backend is not accessible');
    }
    
    // Load translations from file
    const fileTranslations = loadTranslationsFromFile();
    const translationEntries = Object.entries(fileTranslations);
    
    if (translationEntries.length === 0) {
      console.log('ℹ️ No translations found in ar.json');
      return;
    }
    
    // Get existing translations from backend
    const existingTranslations = await getExistingTranslations();
    
    // Process in batches
    const batches = [];
    for (let i = 0; i < translationEntries.length; i += CONFIG.BATCH_SIZE) {
      batches.push(translationEntries.slice(i, i + CONFIG.BATCH_SIZE));
    }
    
    console.log(`\n📦 Processing ${translationEntries.length} translations in ${batches.length} batches...\n`);
    
    const totalResults = {
      created: 0,
      updated: 0,
      skipped: 0,
      errors: []
    };
    
    for (let i = 0; i < batches.length; i++) {
      const batchResults = await processTranslationsBatch(
        batches[i],
        existingTranslations,
        i + 1,
        batches.length
      );
      
      totalResults.created += batchResults.created;
      totalResults.updated += batchResults.updated;
      totalResults.skipped += batchResults.skipped;
      totalResults.errors.push(...batchResults.errors);
      
      // Small delay between batches to avoid overwhelming the server
      if (i < batches.length - 1) {
        await delay(500);
      }
    }
    
    // Summary
    console.log('\n🎉 Migration completed successfully!');
    console.log('📊 Summary:');
    console.log(`   ➕ Created: ${totalResults.created}`);
    console.log(`   ✏️ Updated: ${totalResults.updated}`);
    console.log(`   ⏭️ Skipped: ${totalResults.skipped}`);
    console.log(`   ❌ Errors: ${totalResults.errors.length}`);
    
    if (totalResults.errors.length > 0) {
      console.log('\n⚠️ Errors encountered:');
      totalResults.errors.forEach(({ key, error }) => {
        console.log(`   ${key}: ${error}`);
      });
    }
    
    console.log('\n✅ Your frontend translation system should now sync with the backend!');
    
  } catch (error) {
    console.error('\n💥 Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateTranslations()
    .then(() => {
      console.log('\n🏁 Migration process finished.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Migration failed:', error);
      process.exit(1);
    });
}

export { migrateTranslations };