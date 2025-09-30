// Update buyer guide step content translations in database
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

const translationSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
}, { timestamps: true });

const Translation = mongoose.model('Translation', translationSchema);

const buyerGuideTranslations = {
  "We'll Arrange To Visit The Homes You've Selected, Together And In-person, To Determine The Best Fit For You.\n\nHow Can I Make The Most Of My Time When Visiting Homes? +\n\nWhat Should I Expect When Visiting Homes? +\n\nHow Many Homes Should I Visit? +\n\nWhat Should I Look For When Visiting Homes? +": "سنقوم بترتيب زيارة للمنازل التي اخترتها، معًا وشخصيًا، لتحديد الأنسب لك.\n\nكيف يمكنني الاستفادة القصوى من وقتي عند زيارة المنازل؟ +\n\nماذا يجب أن أتوقع عند زيارة المنازل؟ +\n\nكم عدد المنازل التي يجب أن أزورها؟ +\n\nماذا يجب أن أبحث عنه عند زيارة المنازل؟ +",
  "Once You've Narrowed Down Your List And Have A Clear Favorite, Collaborate With Us To Make An Offer On A Home.\n\nWhat Should I Include With My Offer? +\n\nWhat Are The Most Common Contingencies? +\n\nWhat Happens If I Face Multiple Offers? +\n\nWhat Is A Counteroffer? +": "بمجرد تضييق نطاق قائمتك ووجود مفضل واضح، تعاون معنا لتقديم عرض على المنزل.\n\nماذا يجب أن أضمن في عرضي؟ +\n\nما هي الشروط الأكثر شيوعًا؟ +\n\nماذا يحدث إذا واجهت عروضًا متعددة؟ +\n\nما هو العرض المضاد؟ +",
  "The Crucial Period Between An Offer And A Final Contract Is An Important Time To Stay In Close Contact With Your Keller Williams Agent So You're Equipped With All The Information You Need To Make Smart Decisions.\n\nWhat Should I Expect To See In The Contract? +\n\nHow Do I Know When To Negotiate And When To Let Go? +\n\nWhat Are Common Contract Pitfalls I Should Avoid? +": "الفترة الحاسمة بين العرض والعقد النهائي هي وقت مهم للبقاء على اتصال وثيق مع وكيل كيلر ويليامز الخاص بك لتكون مجهزًا بجميع المعلومات التي تحتاجها لاتخاذ قرارات ذكية.\n\nماذا يجب أن أتوقع رؤيته في العقد؟ +\n\nكيف أعرف متى أتفاوض ومتى أتخلى؟ +\n\nما هي المزالق الشائعة في العقد التي يجب أن أتجنبها؟ +",
  "As Soon Your Offer Is Accepted, You Should Schedule Your Home Inspection. If You're Buying In A Busy Season, It May Take Time To Find An Available Inspector, So Rely On Your Keller Williams Agent To Recommend Trusted Home Inspectors.\n\nWhat's Included On A Home Inspection?+\n\nWhat Should I Watch For During The Home Inspection? +\n\nI've Got The Home Inspection Report, Now What? +": "بمجرد قبول عرضك، يجب عليك جدولة فحص منزلك. إذا كنت تشتري في موسم مزدحم، فقد يستغرق الأمر وقتًا للعثور على مفتش متاح، لذا اعتمد على وكيل كيلر ويليامز الخاص بك للتوصية بمفتشي المنازل الموثوق بهم.\n\nماذا يتضمن فحص المنزل؟ +\n\nماذا يجب أن أراقب أثناء فحص المنزل؟ +\n\nلقد حصلت على تقرير فحص المنزل، ماذا الآن؟ +",
  "Some Home Sellers Pay For A Home Warranty That Covers Them While Their Home Is On The Market And Conveys To The Buyers After The Sale. You Can Ask Your Real Estate Agent For Advice About Negotiating For The Sellers To Pay For A Warranty Or Buying One Yourself.\n\nWhat Is A Home Warranty? +\n\nDo I Need A Home Warranty? +\n\nWhat Should I Look For In A Home Warranty? +": "يدفع بعض بائعي المنازل مقابل ضمان منزلي يغطيهم بينما منزلهم معروض للبيع وينتقل إلى المشترين بعد البيع. يمكنك أن تطلب من وكيلك العقاري النصيحة بشأن التفاوض على قيام البائعين بالدفع مقابل الضمان أو شراء واحد بنفسك.\n\nما هو ضمان المنزل؟ +\n\nهل أحتاج إلى ضمان منزلي؟ +\n\nماذا يجب أن أبحث عنه في ضمان المنزل؟ +",
  "While You May Feel Jittery Before Your Closing, Your Kw Agent And Lender Should Have You Fully Prepared For The Day. As The Buyer, You Choose The Title Company For Your Title Search And The Closing. Your Agent And Lender Can Recommend Reliable Title Companies.\n\nWhat Should I Do Before The Closing?+\n\nWhat Can I Expect When Closing? +\n\nWhat Paperwork Is Required To Close? +\n\nWhat's Next? +": "بينما قد تشعر بالتوتر قبل الإغلاق، يجب أن يكون وكيل KW والمقرض قد أعداك بالكامل لهذا اليوم. بصفتك المشتري، تختار شركة العنوان لبحث العنوان والإغلاق. يمكن لوكيلك ومقرضك التوصية بشركات عنوان موثوقة.\n\nماذا يجب أن أفعل قبل الإغلاق؟ +\n\nماذا يمكن أن أتوقع عند الإغلاق؟ +\n\nما هي الأوراق المطلوبة للإغلاق؟ +\n\nماذا بعد ذلك؟ +"
};

async function updateBuyerGuideTranslations() {
  try {
    console.log('🌱 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🔄 Updating buyer guide step content translations...');
    for (const [key, value] of Object.entries(buyerGuideTranslations)) {
      await Translation.findOneAndUpdate(
        { key: key },
        { key: key, value: value },
        { upsert: true, new: true }
      );
      console.log(`✅ Updated: ${key.substring(0, 50)}...`);
    }
    console.log('🎉 Buyer guide step content translations updated successfully!');
  } catch (error) {
    console.error('❌ Error updating buyer guide translations:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

updateBuyerGuideTranslations();
