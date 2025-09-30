import express from 'express';
import { saveEmailArabic } from '../controllers/emailControllerArabic.js';

import fs from 'fs';
import path from 'path';

const router = express.Router();
router.post('/emails-arabic', saveEmailArabic);

// GET /emails - return all saved emails for dashboard
router.get('/emails-arabic', (req, res) => {
    const emailsFile = path.join(process.cwd(), 'Backend-lokesh', 'emails-arabic.json');
    try {
        if (!fs.existsSync(emailsFile)) {
            return res.json([]);
        }
        const data = fs.readFileSync(emailsFile, 'utf-8');
        const emails = JSON.parse(data);
        res.json(emails);
    } catch (err) {
        res.status(500).json({ error: 'Failed to read emails.' });
    }
});

router.delete('/emails-arabic', (req, res) => {
    const { email, pdfName, date } = req.body;
    const emailsFile = path.join(process.cwd(), 'Backend-lokesh', 'emails-arabic.json');
    try {
        if (!fs.existsSync(emailsFile)) {
            return res.status(404).json({ error: 'No emails found.' });
        }
        let emails = JSON.parse(fs.readFileSync(emailsFile, 'utf-8'));
        emails = emails.filter(e => !(e.email === email && e.pdfName === pdfName && e.date === date));
        fs.writeFileSync(emailsFile, JSON.stringify(emails, null, 2));
        res.json({ message: 'Email deleted.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete email.' });
    }
});

export default router;
