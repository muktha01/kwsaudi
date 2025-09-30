// Update seller page main paragraph translation in database
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// Translation Schema
const translationSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
}, { timestamps: true });

const Translation = mongoose.model('Translation', translationSchema);

// Main paragraph translation to add
const mainParagraphTranslation = {
  "You're Ready To Sell Your Property. And, While You're Looking Forward To Seeing The Word \"SOLD\" Posted From The Curb, You Know There's A Lot To Consider Along The Way. One Of Your First Decisions Is To Select A Real Estate Company And Real Estate Agent Who'll Join You In The Process.": "أنت مستعد لبيع عقارك. وبينما تتطلع إلى رؤية كلمة \"مباع\" معلقة على الرصيف، فأنت تعلم أن هناك الكثير مما يجب مراعاته على طول الطريق. أحد قراراتك الأولى هو اختيار شركة عقارية ووكيل عقاري سينضم إليك في هذه العملية."
};

async function updateMainParagraphTranslation() {
  try {
    console.log('🌱 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🔄 Updating seller page main paragraph translation...');
    
    for (const [key, value] of Object.entries(mainParagraphTranslation)) {
      const result = await Translation.findOneAndUpdate(
        { key: key },
        { key: key, value: value },
        { upsert: true, new: true }
      );
      console.log(`✅ Updated main paragraph translation`);
      console.log(`Key: ${key.substring(0, 100)}...`);
      console.log(`Value: ${value.substring(0, 100)}...`);
    }

    console.log('🎉 Seller page main paragraph translation updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating main paragraph translation:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

updateMainParagraphTranslation();