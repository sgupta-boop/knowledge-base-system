// Import required packages
const express = require('express');
const cors = require('cors');
const path = require('path'); // Added path for static files
require('dotenv').config();

// Import database connection
const pool = require('./config/db');

// Import middleware
const trackActivity = require('./middleware/activity'); // Added activity tracking middleware

// Import routes
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const categoryRoutes = require('./routes/categories');
const uploadRoutes = require('./routes/upload'); // Added upload routes
const searchRoutes = require('./routes/search');
const commentRoutes = require('./routes/comments');
const statsRoutes = require('./routes/stats'); // Added stats routes

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// Middleware = functions that run before route handlers
// ============================================

// 1. CORS - allows frontend (localhost:5173) to call backend (localhost:5000)
app.use(cors({
    origin: 'http://localhost:5173',  // Vite dev server
    credentials: true
}));

// 2. JSON parser - converts request body to JavaScript object
app.use(express.json());

// 3. URL encoded parser - handles form submissions
app.use(express.urlencoded({ extended: true }));

// 4. Request logger - helpful for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); // Continue to next middleware/route
});

// ============================================
// ROUTES
// Routes define what happens for each URL path
// ============================================

app.use('/api/auth', authRoutes);           // /api/auth/login, /api/auth/register
app.use('/api/articles', articleRoutes);     // /api/articles, /api/articles/:id
app.use('/api/categories', categoryRoutes);  // /api/categories
app.use('/api/search', searchRoutes);        // /api/search?q=keyword
app.use('/api/comments', commentRoutes);     // /api/comments

// Root route - just for testing server is running
app.get('/', (req, res) => {
    res.json({ message: 'Knowledge Base API is running!' });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler - if no route matches
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV}`);
});