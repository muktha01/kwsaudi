import NewsArabic from '../models/news-arabic.js';

// Create Arabic news
export const createNewsArabic = async (req, res) => {
  try {
    const {
      title,
      content,
      author,
      tags,
      isPublished,
      publishedAt,
      location,
      eventDate,
      category
    } = req.body;

    const contentImage = req.files?.contentImage?.[0]?.path;
    const coverImage = req.files?.coverImage?.[0]?.path;
    const additionalImages = req.files?.additionalImages ? 
      req.files.additionalImages.map(file => file.path) : [];

    const news = new NewsArabic({
      title,
      content,
      author,
      tags: Array.isArray(tags) ? tags : [tags].filter(Boolean),
      isPublished: isPublished === 'true' || isPublished === true,
      publishedAt: isPublished === 'true' || isPublished === true ? new Date() : null,
      contentImage,
      coverImage,
      location,
      eventDate: eventDate ? new Date(eventDate) : null,
      additionalImages,
      category
    });

    const saved = await news.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Arabic news', details: error.message });
  }
};

// Get all Arabic news
export const getAllNewsArabic = async (req, res) => {
  try {
    const news = await NewsArabic.find().sort({ createdAt: -1 });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Arabic news' });
  }
};

// Get Arabic news by ID
export const getNewsArabicById = async (req, res) => {
  try {
    const news = await NewsArabic.findById(req.params.id);
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Arabic news by ID' });
  }
};

// Update Arabic news by ID
export const updateNewsArabic = async (req, res) => {
  try {
    const update = req.body;
    if (req.files?.coverImage?.[0]) update.coverImage = req.files.coverImage[0].path;
    if (req.files?.contentImage?.[0]) update.contentImage = req.files.contentImage[0].path;
    if (req.files?.additionalImages) update.additionalImages = req.files.additionalImages.map(f => f.path);
    const news = await NewsArabic.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update Arabic news' });
  }
};

// Delete Arabic news by ID
export const deleteNewsArabic = async (req, res) => {
  try {
    const news = await NewsArabic.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.status(200).json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete Arabic news' });
  }
};
