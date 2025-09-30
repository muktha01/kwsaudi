// Quick seed script to add sample translations to database
//node seed-translations.mjs
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'Backend-lokesh', 'config', 'config.env') });

// Simple Translation Schema
const translationSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
}, { timestamps: true });

const Translation = mongoose.model('Translation', translationSchema);

// Load all translations from ar.json
const arJsonPath = path.join(__dirname, 'src', 'translations', 'ar.json');
let allTranslations = {};
try {
  const raw = fs.readFileSync(arJsonPath, 'utf8');
  allTranslations = JSON.parse(raw);
} catch (e) {
  console.error('❌ Failed to load ar.json:', e.message);
  process.exit(1);
}

async function seedTranslations() {
  try {
    console.log('🌱 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🌱 Seeding sample translations...');
    
    for (const [key, value] of Object.entries(allTranslations)) {
      await Translation.findOneAndUpdate(
        { key: key },
        { key: key, value: value },
        { upsert: true, new: true }
      );
      console.log(`✅ Seeded: ${key} -> ${value}`);
    }

    console.log('🎉 All translations from ar.json seeded successfully!');
    console.log(`📊 Total translations: ${Object.keys(allTranslations).length}`);
    
  } catch (error) {
    console.error('❌ Error seeding translations:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

seedTranslations();