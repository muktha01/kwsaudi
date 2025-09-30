// Update seller page translations in database
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

// Seller page translations to update
const sellerTranslations = {
  // Updated with proper line breaks
  "Deciding To Sell Your Home Can Be A Very Emotional Process, No Matter The Reason. The First Step In Selling Is To Understand Your Motivation And Goal. If You Are Selling Because Of Outside Circumstances, You Probably Have A Timeline To Work Within\n\nWhy Do You Want To Sell Your Home ? +\n\nTalk With Your Keller Williams Agent About Their Strategy To Sell Your Home.": "يمكن أن يكون قرار بيع منزلك عملية عاطفية جداً، بغض النظر عن السبب. الخطوة الأولى في البيع هي فهم دوافعك وهدفك. إذا كنت تبيع بسبب ظروف خارجية، فمن المحتمل أن يكون لديك جدول زمني للعمل ضمنه\n\nلماذا تريد بيع منزلك؟ +\n\nتحدث مع وكيل كيلر ويليامز حول استراتيجيتهم لبيع منزلك.",
  
  "In This Fast-paced Real Estate Environment, Having The Right Real Estate Agent Sell Your Home Is Extremely Important. In Most Urban Areas, Inventory Is Low, So You Don't Want To Underprice Nor Over-price Your Home For Today's Market. Selling Is A Combination Of Pricing Right, Strategic Marketing, Staging, And Bringing In The Right Buyer At The Right Time.\n\nThen Choosing A Real Estate Professional +": "في بيئة العقارات سريعة الخطى هذه، يعتبر وجود وكيل عقاري مناسب لبيع منزلك أمراً مهماً للغاية. في معظم المناطق الحضرية، المخزون منخفض، لذا لا تريد أن تقلل من سعر منزلك أو تبالغ في تسعيره لسوق اليوم. البيع هو مزيج من التسعير الصحيح والتسويق الاستراتيجي والتنسيق وجلب المشتري المناسب في الوقت المناسب.\n\nثم اختيار متخصص عقاري +",
  
  "Your KW Agent will provide you with a CMA (Comparative Market Analysis). This report can be the most important tool in determining the listing price. Review the CMA carefully with your Agent so you understand the current. Studying the past sales will not only help you understand the pricing strategy but give you a realistic expectation as to how much your home might appraise for when you go under contract. Remember, the listing price of a similar home is your competition, not a comparable for value.\n\nThe CMA reports usually contain +": "سيقدم لك وكيل KW تحليل السوق المقارن (CMA). يمكن أن يكون هذا التقرير الأداة الأهم في تحديد سعر الإدراج. راجع CMA بعناية مع وكيلك حتى تفهم الوضع الحالي. دراسة المبيعات السابقة لن تساعدك فقط في فهم استراتيجية التسعير ولكن ستعطيك توقعاً واقعياً حول مقدار تقييم منزلك عندما تدخل تحت العقد. تذكر، سعر إدراج منزل مماثل هو منافسك، وليس مقارناً للقيمة.\n\nتقارير CMA عادة ما تحتوي +",
  
  "Once you decide to sell your house, it is no longer your home. Your house was a big investment and now you should get what it is worth. First impressions are everything when selling your home. You want buyers to be excited to get out of the car and come into the home.\n\nYour KW Agent will guide you with a few suggestions such as +": "بمجرد أن تقرر بيع منزلك، لم يعد منزلك. كان منزلك استثماراً كبيراً والآن يجب أن تحصل على ما يستحقه. الانطباعات الأولى هي كل شيء عند بيع منزلك. تريد أن يكون المشترون متحمسين للخروج من السيارة والدخول إلى المنزل.\n\nسيوجهك وكيل KW ببعض الاقتراحات مثل +",
  
  "To sell your home, you must be flexible and ready. Living in a home for sale isn't always the easiest, especially with children.\n\nHave a schedule +\n\nThe CMA reports usually contain +": "لبيع منزلك، يجب أن تكون مرناً ومستعداً. العيش في منزل للبيع ليس دائماً الأسهل، خاصة مع الأطفال.\n\nاحرص على وجود جدول زمني +\n\nتقارير CMA عادة ما تحتوي +",

  // Seller page title translations
  "Reason For Selling": "سبب البيع",
  "Hire The Right Agent": "استئجار الوكيل المناسب",
  "Price Your Home": "سعّر منزلك",
  "Preparing Your Home for Sell": "تحضير منزلك للبيع",
  "Be Ready": "كن مستعداً",
  "Five Steps To Sell": "خمس خطوات للبيع"
};

async function updateSellerTranslations() {
  try {
    console.log('🌱 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🔄 Updating seller page translations...');
    
    for (const [key, value] of Object.entries(sellerTranslations)) {
      const result = await Translation.findOneAndUpdate(
        { key: key },
        { key: key, value: value },
        { upsert: true, new: true }
      );
      console.log(`✅ Updated: ${key.substring(0, 50)}... -> ${value.substring(0, 30)}...`);
    }

    console.log('🎉 Seller page translations updated successfully!');
    console.log(`📊 Total translations updated: ${Object.keys(sellerTranslations).length}`);
    
  } catch (error) {
    console.error('❌ Error updating seller translations:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

updateSellerTranslations();