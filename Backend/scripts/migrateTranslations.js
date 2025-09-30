import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Translation from '../models/Translation.js';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', 'config', 'config.env') });

const DB = process.env.MONGO_URI;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('DB connection successful!')).catch(err => console.error('DB connection error:', err));

const migrateTranslations = async () => {
  try {
    const filePath = path.join(__dirname, '..', '..', 'src', 'translations', 'ar.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const translations = JSON.parse(rawData);

    console.log('Starting translation migration...');

    for (const key in translations) {
      if (translations.hasOwnProperty(key)) {
        await Translation.findOneAndUpdate(
          { key: key },
          { value: translations[key] },
          { upsert: true, new: true, runValidators: true }
        );
        console.log(`Upserted: ${key}`);
      }
    }
    console.log('Translation migration completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error during translation migration:', error);
    process.exit(1);
  }
};

migrateTranslations();
