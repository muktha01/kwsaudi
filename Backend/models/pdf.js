// models/Pdf.js
import mongoose from "mongoose";


const pdfSchema = new mongoose.Schema({
  name: { type: String, required: true },   // e.g. pdf1, pdf2
  originalName: { type: String, required: true }, // uploaded filename
  data: { type: Buffer, required: true },   // PDF file data
  contentType: { type: String, required: true }, // e.g. 'application/pdf'
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Pdf", pdfSchema);
