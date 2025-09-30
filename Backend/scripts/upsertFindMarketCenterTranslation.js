// Script to add/update a translation in the backend database
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Translation from '../models/Translation.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', 'config', 'config.env') });

const MONGO_URI = process.env.MONGO_URI;

const key = 'Find a Market Center';
const value = 'ابحث عن مركز التسويق';

async function upsertTranslation() {
  if (!MONGO_URI) {
    console.error('MONGO_URI not set in environment.');
    process.exit(1);
  }
  await mongoose.connect(MONGO_URI);
  try {
    const updated = await Translation.findOneAndUpdate(
      { key },
      { value },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('Translation upserted:', updated);
  } catch (err) {
    console.error('Error upserting translation:', err);
  } finally {
    await mongoose.disconnect();
  }
}

upsertTranslation();
