import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/apiManagement.json');

// Helper to read data
function readData() {
  if (!fs.existsSync(DATA_FILE)) return { header: '', footer: '' };
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

// Helper to write data
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET header/footer content
router.get('/', (req, res) => {
  const data = readData();
  res.json(data);
});

// POST new content
router.post('/', (req, res) => {
  const { header, footer } = req.body;
  if (typeof header !== 'string' || typeof footer !== 'string') {
    return res.status(400).json({ error: 'Invalid data' });
  }
  writeData({ header, footer });
  res.json({ success: true });
});

// PUT update content
router.put('/', (req, res) => {
  const { header, footer } = req.body;
  if (typeof header !== 'string' || typeof footer !== 'string') {
    return res.status(400).json({ error: 'Invalid data' });
  }
  writeData({ header, footer });
  res.json({ success: true });
});

export default router;
