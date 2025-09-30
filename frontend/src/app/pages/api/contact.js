export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Contact form submission:', req.body);
    return res.status(200).json({ success: true });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 