import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Link from '../models/AgentLink.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', 'config', 'config.env') });

const seedLinks = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    // Clear existing links
    await Link.deleteMany({});
    console.log('Cleared existing links');

    // Create initial links
    const initialLinks = [
      { name: "Google", url: "https://www.google.com" },
      { name: "GitHub", url: "https://github.com" },
      { name: "LinkedIn", url: "https://linkedin.com" },
      { name: "KW Saudi", url: "https://kwsaudi.com" },
      { name: "Facebook", url: "https://facebook.com" }
    ];

    const createdLinks = await Link.insertMany(initialLinks);
    console.log('Created links:', createdLinks);

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedLinks();