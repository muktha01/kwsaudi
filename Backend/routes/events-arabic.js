import express from 'express';
import {
	createEventArabic,
	getAllEventsArabic,
	getEventArabicById,
	updateEventArabic,
	deleteEventArabic
} from '../controllers/events-arabicController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Create Arabic event
router.post(
	'/events-arabic',
	upload.fields([
		{ name: 'image', maxCount: 1 },
		{ name: 'additionalImages', maxCount: 10 }
	]),
	createEventArabic
);

// Get all Arabic events
router.get('/events-arabic', getAllEventsArabic);

// Get Arabic event by ID
router.get('/events-arabic/:id', getEventArabicById);

// Update Arabic event by ID
router.put(
	'/events-arabic/:id',
	upload.fields([
		{ name: 'image', maxCount: 1 },
		{ name: 'additionalImages', maxCount: 10 }
	]),
	updateEventArabic
);

// Delete Arabic event by ID
router.delete('/events-arabic/:id', deleteEventArabic);

export default router;
