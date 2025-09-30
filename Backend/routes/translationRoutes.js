import express from 'express';
import { createTranslation, getTranslations, getTranslationById, updateTranslation, deleteTranslation } from '../controllers/translationController.js';

const router = express.Router();

router.post('/translations', createTranslation);
router.get('/translations', getTranslations);
router.get('/translations/:id', getTranslationById);
router.put('/translations/:id', updateTranslation);
router.delete('/translations/:id', deleteTranslation);

export default router;
