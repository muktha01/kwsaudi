// Migrate local Page.backgroundImage files to Cloudinary and update DB
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import Page from './models/Page.js';

// Load env
dotenv.config({ path: path.join('./config/config.env') });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const LOCAL_BASE = path.join(process.cwd(), 'uploads'); // adjust if your local images are elsewhere

async function migrateImages() {
  await mongoose.connect(process.env.MONGO_URI);
  const pages = await Page.find({ backgroundImage: { $exists: true, $ne: null } });
  for (const page of pages) {
    const imgPath = page.backgroundImage;
    if (imgPath.startsWith('http')) continue; // already on Cloudinary
    const localPath = path.isAbsolute(imgPath) ? imgPath : path.join(LOCAL_BASE, imgPath);
    if (!fs.existsSync(localPath)) {
      console.warn(`File not found: ${localPath}`);
      continue;
    }
    try {
      const result = await cloudinary.uploader.upload(localPath, { folder: 'uploads' });
      page.backgroundImage = result.secure_url;
      await page.save();
      console.log(`Migrated: ${imgPath} -> ${result.secure_url}`);
    } catch (err) {
      console.error(`Failed to upload ${imgPath}:`, err.message);
    }
  }
  await mongoose.disconnect();
  console.log('Migration complete.');
}

migrateImages();
