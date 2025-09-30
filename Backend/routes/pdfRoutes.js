// routes/pdfRoutes.js
import express from "express";
import multer from "multer";
import { uploadPdf, downloadPdf, listPdfs } from "../controllers/pdfController.js";

const router = express.Router();

// Multer memory storage for direct-to-DB upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// List all PDFs route
router.get("/", listPdfs);

// Upload route
router.post("/upload", upload.single("pdf"), uploadPdf);

// Download route
router.get("/download/:name", downloadPdf);

export default router;
