// controllers/pdfController.js
import PdfArabic from '../models/pdf-arabic.js';

export const uploadPdfArabic = async (req, res) => {
  try {
    const { name } = req.body; // pdf1 or pdf2
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // remove old PDF if exists
    const oldPdf = await PdfArabic.findOne({ name });
    if (oldPdf) {
      await oldPdf.deleteOne();
    }

    const newPdf = new PdfArabic({
      name,
      originalName: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });
    await newPdf.save();

    res.json({ message: "PDF uploaded successfully", pdf: newPdf });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};

export const downloadPdfArabic = async (req, res) => {
  try {
    const { name } = req.params;
    const pdf = await PdfArabic.findOne({ name });
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    res.set({
      'Content-Type': pdf.contentType,
      'Content-Disposition': `attachment; filename="${pdf.originalName || name}.pdf"`
    });
    res.send(pdf.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Download failed" });
  }
};
export const listPdfsArabic = async (req, res) => {
  try {
  const pdfs = await PdfArabic.find({}, "-__v").sort({ createdAt: -1 });
  res.json(pdfs); // this MUST be an array []
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch PDFs" });
  }
};