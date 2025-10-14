import mongoose from 'mongoose';

const newsArabicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  contentImage: { type: String },
  excerpt: { type: String },
  author: { type: String },
  tags: [String],
  category: { type: String },
  coverImage: { type: String },
  location: { type: String },
  eventDate: { type: Date },
  additionalImages: [{ type: String }],
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('NewsArabic', newsArabicSchema);
