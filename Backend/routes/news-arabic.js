import express from 'express';
import {
  createNewsArabic,
  getAllNewsArabic,
  getNewsArabicById,
  updateNewsArabic,
  deleteNewsArabic
} from '../controllers/news-arabicController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Create Arabic news
router.post(
  '/news-arabic',
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'contentImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 10 }
  ]),
  createNewsArabic
);

// Get all Arabic news
router.get('/news-arabic', getAllNewsArabic);

// Get Arabic news by ID
router.get('/news-arabic/:id', getNewsArabicById);

// Update Arabic news by ID
router.put(
  '/news-arabic/:id',
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'contentImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 10 }
  ]),
  updateNewsArabic
);

// Delete Arabic news by ID
router.delete('/news-arabic/:id', deleteNewsArabic);

export default router;
