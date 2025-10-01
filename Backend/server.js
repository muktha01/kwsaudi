import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cors from 'cors';

import seoRoutes from './routes/seoRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import homepageRoutes from './routes/homepageRoute.js';
// import themeRoutes from './routes/themeRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import listingRoutes from './routes/listingRoutes.js'
import agentRoutes from './routes/agentRoutes.js';
import agentLinkRoutes from './routes/agentLinkRoutes.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import pdfArabicRoutes from './routes/pdf-arabicRouts.js';
// import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import leadRoutes from './routes/leadRoutes.js'
import translationRoutes from './routes/translationRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import emailsArabicRoutes from './routes/emails-arabic.js';
import apiManagementRoutes from './routes/apiManagement.js';
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

const app = express();

// Configure CORS to allow requests from specific origins
app.use(cors({
  origin: [
    'http://localhost:3002',
    'http://localhost:3001',
    'http://localhost:3000',
    'https://kwsaudi-admin.vercel.app',
    'https://www.kwsaudiarabia.com'
     // <-- add your production frontend domain if needed
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma']
}));

// JSON parsing middleware with error handling
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      console.error('Invalid JSON received:', e.message);
      res.status(400).json({ 
        error: 'Invalid JSON format',
        message: 'The request body contains invalid JSON'
      });
      throw new Error('Invalid JSON');
    }
  }
}));

// Error handling middleware for JSON parsing errors
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    console.error('❌ JSON parsing error:', error.message);
    return res.status(400).json({
      error: 'Invalid JSON format',
      message: 'The request body contains invalid JSON'
    });
  }
  next(error);
});
app.use(cookieParser());
app.use('/api', leadRoutes);
app.get('/',(req, res)=>{
  res.send("backend Working Fine")
})

// Test endpoint for authentication
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!', 
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api', seoRoutes);
app.use('/api', emailsArabicRoutes);
app.use('/api', pageRoutes);
app.use('/api', homepageRoutes);
// app.use('/api', themeRoutes);
app.use('/api', blogRoutes);
app.use('/api', newsRoutes);
app.use('/api', eventRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/links', agentLinkRoutes);


app.use('/api', translationRoutes);
app.use('/api', emailRoutes);
app.use('/api/api-management', apiManagementRoutes);

app.use("/api/employee", employeeRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api", pdfArabicRoutes);

// app.use('/api', userRoutes);
app.use('/uploads', express.static('uploads')); // serve images

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler

// Move catch-all route to the very end to not block API routes
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Start server even if MongoDB is not available (for testing)
const startServer = () => {
  const port = process.env.PORT || 5001;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

// Try to connect to MongoDB, but don't fail if it's not available
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('MongoDB connected');
      startServer();
    })
    .catch((err) => {
      console.warn('MongoDB connection failed, starting server without database:', err.message);
      console.log('Note: Authentication features will not work without database connection');
      startServer();
    });
} else {
  console.log('No MongoDB URI provided, starting server without database');
  startServer();
}

  