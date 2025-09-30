// Debug route to verify router is loaded

const router = express.Router();
router.get('/pdf-arabic/debug', (req, res) => {
  res.json({ success: true, message: 'pdf-arabic router is active!' });
});
// routes/pdfRoutes.js
import express from "express";
import multer from "multer";
import { uploadPdfArabic, downloadPdfArabic, listPdfsArabic } from "../controllers/pdf-arabicController.js";



// Multer memory storage for direct-to-DB upload
const storage = multer.memoryStorage();
const upload = multer({ storage });


// List all Arabic PDFs route
router.get("/pdf-arabic", listPdfsArabic);

// Upload Arabic PDF
router.post("/uploads", upload.single("pdf"), uploadPdfArabic);

// Download Arabic PDF
router.get("/downloads/:name", downloadPdfArabic);

export default router;
