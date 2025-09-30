import fs from 'fs';
import path from 'path';

export const saveEmail = (req, res) => {
  const { email, pdfName } = req.body;
  if (!email || !pdfName) {
    return res.status(400).json({ message: 'Email and PDF name are required.' });
  }
  const data = { email, pdfName, date: new Date().toISOString() };
  const dirPath = path.join(path.resolve(), 'Backend-lokesh');
  const filePath = path.join(dirPath, 'emails.json');
  let emails = [];
  try {
    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    // Read or create file
    if (fs.existsSync(filePath)) {
      try {
        emails = JSON.parse(fs.readFileSync(filePath));
      } catch (e) {
        emails = [];
      }
    }
    emails.push(data);
    fs.writeFileSync(filePath, JSON.stringify(emails, null, 2));
    res.json({ message: 'Email saved.' });
  } catch (err) {
    console.error('Failed to save email:', err);
    res.status(500).json({ message: 'Failed to save email', error: err.message });
  }
};
