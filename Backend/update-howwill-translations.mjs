// Script to update Howwill.js translations in MongoDB
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'kwfinal';
const collectionName = 'translations';

const translations = [
  { key: 'KW SAUDI ARABIA', value: 'KW SAUDI ARABIA', lang: 'en' },
  { key: 'Together We Do More', value: 'Together We Do More', lang: 'en' },
  { key: 'Keller Williams Is There To Help At Every Big Step In The Realestate Journey.', value: 'Keller Williams Is There To Help At Every Big Step In The Realestate Journey.', lang: 'en' },
  { key: 'JOIN US', value: 'JOIN US', lang: 'en' },
  { key: 'How Will You Thrive', value: 'How Will You Thrive', lang: 'en' },
  // Add Arabic values below
  { key: 'KW SAUDI ARABIA', value: 'كي دبليو السعودية', lang: 'ar' },
  { key: 'Together We Do More', value: 'معًا نحقق المزيد', lang: 'ar' },
  { key: 'Keller Williams Is There To Help At Every Big Step In The Realestate Journey.', value: 'كيلر ويليامز موجودة لمساعدتك في كل خطوة كبيرة في رحلة العقارات.', lang: 'ar' },
  { key: 'JOIN US', value: 'انضم إلينا', lang: 'ar' },
  { key: 'How Will You Thrive', value: 'كيف ستزدهر', lang: 'ar' },
];

async function updateTranslations() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    for (const t of translations) {
      await collection.updateOne(
        { key: t.key, lang: t.lang },
        { $set: { value: t.value } },
        { upsert: true }
      );
    }
    console.log('Howwill.js translations updated successfully!');
  } catch (err) {
    console.error('Error updating translations:', err);
  } finally {
    await client.close();
  }
}

updateTranslations();
