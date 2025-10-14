import mongoose from 'mongoose';

const eventArabicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String },
  location: { type: String },
  image: { type: String },
  additionalImages: [{ type: String }],
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('EventArabic', eventArabicSchema);
